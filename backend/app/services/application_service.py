from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException, status, BackgroundTasks
from app.models.application import Application
from app.models.company import Company
from app.models.student import Student
from app.models.admin import Admin
from app.schemas.application import ApplicationCreate
from app.services.notification_service import NotificationService
from app.services.audit_service import AuditService
from app.services.email_service import EmailService
from app.schemas.notification import NotificationCreate

class ApplicationService:
    @staticmethod
    def apply_to_company(db: Session, student: Student, application_in: ApplicationCreate, background_tasks: BackgroundTasks = None):
        company = db.query(Company).filter(Company.id == application_in.company_id).first()
        if not company:
            raise HTTPException(status_code=404, detail="Company not found")

        if company.status != "active":
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="This drive is no longer accepting applications"
            )

        depts = [d.strip().upper() for d in company.eligible_departments.split(",")]
        if student.cgpa < company.min_cgpa or student.department.upper() not in depts:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You are not eligible for this company"
            )

        existing = db.query(Application).filter(
            Application.student_id == student.id,
            Application.company_id == company.id
        ).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="You have already applied to this company"
            )

        db_application = Application(
            student_id=student.id,
            company_id=company.id,
            status="Applied"
        )
        db.add(db_application)

        notif = NotificationCreate(
            user_id=student.id,
            title="Application Submitted",
            message=f"You have successfully applied to {company.company_name}."
        )
        NotificationService.create_notification(db, notif)

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
            EmailService.send_application_confirmed_email(background_tasks, student.email, company.company_name)

        db.commit()
        db.refresh(db_application)
        return db_application

    @staticmethod
    def get_student_applications(db: Session, student_id: str):
        return db.query(Application)\
            .options(joinedload(Application.company))\
            .filter(Application.student_id == student_id)\
            .order_by(Application.applied_at.desc())\
            .all()

    @staticmethod
    def get_all_applications(db: Session):
        return db.query(Application)\
            .options(joinedload(Application.student), joinedload(Application.company))\
            .order_by(Application.applied_at.desc())\
            .all()

    @staticmethod
    def update_application_status(
        db: Session,
        application_id: str,
        new_status: str,
        background_tasks: BackgroundTasks = None,
        admin: Admin = None,
    ):
        application = db.query(Application).filter(Application.id == application_id).first()
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")

        old_status = application.status
        application.status = new_status

        notif_msg = {
            "Selected": "Congratulations! You have been selected.",
            "Rejected": "We regret to inform you that your application was rejected.",
            "Shortlisted": "Great news! You have been shortlisted.",
            "Interview": "Get ready! You have been invited for an interview."
        }.get(new_status, f"Your application status has been updated to {new_status}.")

        notif = NotificationCreate(
            user_id=application.student_id,
            title=f"Status Update: {application.company.company_name}",
            message=notif_msg
        )
        NotificationService.create_notification(db, notif)

        if admin:
            AuditService.create_log(
                db=db,
                actor_id=str(admin.id),
                actor_name=admin.full_name,
                actor_role="admin",
                action="update_status",
                resource_type="application",
                resource_id=str(application.id),
                details=f"Status changed: {old_status} -> {new_status} for {application.company.company_name}",
            )

        if background_tasks:
            student = db.query(Student).filter(Student.id == application.student_id).first()
            if student:
                EmailService.send_status_update_email(background_tasks, student.email, application.company.company_name, new_status)

        db.commit()
        db.refresh(application)
        return application
