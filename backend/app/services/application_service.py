from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status, BackgroundTasks
from typing import Optional, List
from uuid import UUID

from app.models.application import Application, ApplicationStatusHistory
from app.models.company import Company
from app.models.student import Student
from app.models.admin import Admin
from app.schemas.application import (
    ApplicationCreate, VALID_TRANSITIONS, PIPELINE_STATUSES,
)
from app.services.notification_service import NotificationService
from app.services.audit_service import AuditService
from app.services.email_service import EmailService
from app.schemas.notification import NotificationCreate


STATUS_MESSAGES: dict[str, str] = {
    "Offer":       "Congratulations! You have received an offer.",
    "Selected":    "Congratulations! You have been selected.",
    "Rejected":    "We regret to inform you that your application was rejected.",
    "Shortlisted": "Great news! You have been shortlisted.",
    "OA":          "You have been invited to take an Online Assessment.",
    "Interview":   "Get ready! You have been invited for an interview.",
    "HR":          "You have been invited for the HR round.",
}


class ApplicationService:

    @staticmethod
    def _record_history(
        db: Session,
        application: Application,
        new_status: str,
        changed_by: str,
        changed_by_role: str = "admin",
        note: Optional[str] = None,
    ) -> None:
        history = ApplicationStatusHistory(
            application_id=application.id,
            previous_status=application.status,
            new_status=new_status,
            changed_by=changed_by,
            changed_by_role=changed_by_role,
            note=note,
        )
        db.add(history)

    @staticmethod
    def _validate_transition(current: str, new: str) -> None:
        if new not in PIPELINE_STATUSES:
            raise HTTPException(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                detail=f"Invalid status: {new}",
            )
        allowed = VALID_TRANSITIONS.get(current, [])
        if new not in allowed:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Cannot transition from '{current}' to '{new}'. "
                       f"Allowed: {allowed or 'none'}",
            )

    @staticmethod
    def apply_to_company(
        db: Session,
        student: Student,
        application_in: ApplicationCreate,
        background_tasks: BackgroundTasks = None,
    ) -> Application:
        company = db.query(Company).filter(Company.id == application_in.company_id).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        if company.status != "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This drive is no longer accepting applications",
            )

        depts = [d.strip().upper() for d in company.eligible_departments.split(",")]
        if student.cgpa < company.min_cgpa or student.department.upper() not in depts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You are not eligible for this company",
            )

        existing = db.query(Application).filter(
            Application.student_id == student.id,
            Application.company_id == company.id,
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already applied to this company",
            )

        db_application = Application(
            student_id=student.id,
            company_id=company.id,
            status="Applied",
        )
        db.add(db_application)
        db.flush()  # get id before history insert

        ApplicationService._record_history(
            db, db_application, "Applied", student.full_name, "student", "Initial application"
        )

        NotificationService.create_notification(db, NotificationCreate(
            user_id=student.id,
            title="Application Submitted",
            message=f"You have successfully applied to {company.company_name}.",
        ))

        AuditService.create_log(
            db=db,
            actor_id=str(student.id),
            actor_name=student.full_name,
            actor_role="student",
            action="apply",
            resource_type="application",
            resource_id=str(db_application.id),
            details=f"Applied to {company.company_name} - {company.role}",
        )

        if background_tasks:
            EmailService.send_application_confirmed_email(
                background_tasks, student.email, company.company_name
            )

        db.commit()
        db.refresh(db_application)
        return db_application

    @staticmethod
    def get_student_applications(
        db: Session,
        student_id: UUID,
        company_id: Optional[str] = None,
        app_status: Optional[str] = None,
    ) -> List[Application]:
        q = db.query(Application)\
            .options(joinedload(Application.company))\
            .filter(Application.student_id == student_id)
        if company_id:
            q = q.filter(Application.company_id == company_id)
        if app_status:
            q = q.filter(Application.status == app_status)
        return q.order_by(Application.applied_at.desc()).all()

    @staticmethod
    def get_student_application_detail(
        db: Session,
        application_id: str,
        student_id: UUID,
    ) -> Application:
        app = (
            db.query(Application)
            .options(
                joinedload(Application.company),
                joinedload(Application.status_history),
            )
            .filter(
                Application.id == application_id,
                Application.student_id == student_id,
            )
            .first()
        )
        if not app:
            raise HTTPException(status_code=404, detail="Application not found")
        return app

    @staticmethod
    def get_all_applications(
        db: Session,
        company_id: Optional[str] = None,
        app_status: Optional[str] = None,
        department: Optional[str] = None,
        year: Optional[int] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> dict:
        q = db.query(Application)\
            .options(joinedload(Application.student), joinedload(Application.company))

        if company_id:
            q = q.filter(Application.company_id == company_id)
        if app_status:
            q = q.filter(Application.status == app_status)
        if department:
            q = q.join(Application.student).filter(Student.department.ilike(f"%{department}%"))
        if year:
            q = q.join(Application.student).filter(Student.graduation_year == year)

        total = q.count()
        items = q.order_by(Application.applied_at.desc()).offset(skip).limit(limit).all()
        return {"total": total, "items": items, "skip": skip, "limit": limit}

    @staticmethod
    def update_application_status(
        db: Session,
        application_id: str,
        new_status: str,
        background_tasks: BackgroundTasks = None,
        admin: Optional[Admin] = None,
        note: Optional[str] = None,
    ) -> Application:
        application = (
            db.query(Application)
            .options(joinedload(Application.company))
            .filter(Application.id == application_id)
            .first()
        )
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")

        ApplicationService._validate_transition(application.status, new_status)

        old_status = application.status
        actor_name = admin.full_name if admin else "system"
        actor_role = "admin" if admin else "system"

        ApplicationService._record_history(db, application, new_status, actor_name, actor_role, note)
        application.status = new_status

        notif_msg = STATUS_MESSAGES.get(
            new_status, f"Your application status has been updated to {new_status}."
        )
        NotificationService.create_notification(db, NotificationCreate(
            user_id=application.student_id,
            title=f"Status Update: {application.company.company_name}",
            message=notif_msg,
        ))

        if admin:
            AuditService.create_log(
                db=db,
                actor_id=str(admin.id),
                actor_name=admin.full_name,
                actor_role="admin",
                action="update_status",
                resource_type="application",
                resource_id=str(application.id),
                details=f"Status: {old_status} -> {new_status} for {application.company.company_name}",
            )

        if background_tasks:
            student = db.query(Student).filter(Student.id == application.student_id).first()
            if student:
                EmailService.send_status_update_email(
                    background_tasks, student.email, application.company.company_name, new_status
                )

        db.commit()
        db.refresh(application)
        return application

    @staticmethod
    def bulk_update_status(
        db: Session,
        application_ids: List[UUID],
        new_status: str,
        admin: Admin,
        note: Optional[str] = None,
    ) -> dict:
        if new_status not in PIPELINE_STATUSES:
            raise HTTPException(status_code=422, detail=f"Invalid status: {new_status}")

        applications = (
            db.query(Application)
            .options(joinedload(Application.company))
            .filter(Application.id.in_(application_ids))
            .all()
        )

        updated = 0
        skipped = 0
        errors = []

        for app in applications:
            allowed = VALID_TRANSITIONS.get(app.status, [])
            if new_status not in allowed:
                skipped += 1
                errors.append({
                    "application_id": str(app.id),
                    "reason": f"Cannot transition from '{app.status}' to '{new_status}'",
                })
                continue

            ApplicationService._record_history(db, app, new_status, admin.full_name, "admin", note)
            app.status = new_status

            notif_msg = STATUS_MESSAGES.get(new_status, f"Your application status has been updated to {new_status}.")
            NotificationService.create_notification(db, NotificationCreate(
                user_id=app.student_id,
                title=f"Status Update: {app.company.company_name}",
                message=notif_msg,
            ))
            updated += 1

        if updated:
            AuditService.create_log(
                db=db,
                actor_id=str(admin.id),
                actor_name=admin.full_name,
                actor_role="admin",
                action="bulk_update_status",
                resource_type="application",
                details=f"Bulk status update to '{new_status}': {updated} updated, {skipped} skipped",
            )

        db.commit()
        return {"updated": updated, "skipped": skipped, "errors": errors}

    @staticmethod
    def update_next_action(
        db: Session,
        application_id: str,
        next_action: Optional[str],
        admin: Admin,
    ) -> Application:
        application = db.query(Application).filter(Application.id == application_id).first()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        application.next_action = next_action
        AuditService.create_log(
            db=db,
            actor_id=str(admin.id),
            actor_name=admin.full_name,
            actor_role="admin",
            action="update",
            resource_type="application",
            resource_id=str(application.id),
            details=f"Next action set to: {next_action}",
        )
        db.commit()
        db.refresh(application)
        return application

    @staticmethod
    def update_recruiter_notes(
        db: Session,
        application_id: str,
        recruiter_notes: Optional[str],
        admin: Admin,
    ) -> Application:
        application = db.query(Application).filter(Application.id == application_id).first()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        application.recruiter_notes = recruiter_notes
        AuditService.create_log(
            db=db,
            actor_id=str(admin.id),
            actor_name=admin.full_name,
            actor_role="admin",
            action="update",
            resource_type="application",
            resource_id=str(application.id),
            details="Recruiter notes updated",
        )
        db.commit()
        db.refresh(application)
        return application
