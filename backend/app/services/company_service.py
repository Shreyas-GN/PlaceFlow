from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.company import Company
from app.models.application import Application
from app.models.student import Student
from app.models.admin import Admin
from app.schemas.company import CompanyCreate, CompanyUpdate, DriveCloseConsequence
from app.services.audit_service import AuditService
from app.services.notification_service import NotificationService
from app.schemas.notification import NotificationCreate

class CompanyService:
    @staticmethod
    def create_company(db: Session, company_in: CompanyCreate, admin: Admin = None):
        db_company = Company(**company_in.model_dump())
        db.add(db_company)
        db.commit()
        db.refresh(db_company)

        if admin:
            AuditService.create_log(
                db=db,
                actor_id=str(admin.id),
                actor_name=admin.full_name,
                actor_role="admin",
                action="create",
                resource_type="drive",
                resource_id=str(db_company.id),
                details=f"Created drive: {db_company.company_name} - {db_company.role}",
            )

        return db_company

    @staticmethod
    def update_company(db: Session, company_id: str, company_in: CompanyUpdate, admin: Admin = None):
        db_company = db.query(Company).filter(Company.id == company_id).first()
        if not db_company:
            raise HTTPException(status_code=404, detail="Company not found")

        update_data = company_in.model_dump(exclude_unset=True)
        if not update_data:
            raise HTTPException(status_code=400, detail="No fields to update")

        changed_fields = []
        eligibility_changed = False
        for field, value in update_data.items():
            if field in ("min_cgpa", "eligible_departments") and getattr(db_company, field) != value:
                eligibility_changed = True
            if getattr(db_company, field) != value:
                old_val = getattr(db_company, field)
                changed_fields.append(f"{field}: {old_val} -> {value}")
            setattr(db_company, field, value)

        db.commit()
        db.refresh(db_company)

        if admin:
            AuditService.create_log(
                db=db,
                actor_id=str(admin.id),
                actor_name=admin.full_name,
                actor_role="admin",
                action="update" if not eligibility_changed else "eligibility_update",
                resource_type="drive",
                resource_id=str(db_company.id),
                details=f"Updated drive {db_company.company_name}: {'; '.join(changed_fields)}",
            )

        if eligibility_changed:
            CompanyService._propagate_eligibility_change(db, db_company, admin)

        return db_company

    @staticmethod
    def _propagate_eligibility_change(db: Session, company: Company, admin: Admin = None):
        applications = db.query(Application).filter(
            Application.company_id == company.id
        ).all()

        impacted_count = 0
        eligible_departments = [d.strip().upper() for d in company.eligible_departments.split(",")]

        for app in applications:
            student = db.query(Student).filter(Student.id == app.student_id).first()
            if not student:
                continue

            was_eligible = app.status not in ("Rejected", "Withdrawn")
            now_eligible = (
                student.cgpa >= company.min_cgpa
                and student.department.upper() in eligible_departments
            )

            if was_eligible and not now_eligible:
                app.status = "Eligibility_Conflict"
                impacted_count += 1
                NotificationService.create_notification(db, NotificationCreate(
                    user_id=student.id,
                    title="Eligibility Updated",
                    message=f"Your eligibility for {company.company_name} has changed due to updated criteria. CGPA threshold: {company.min_cgpa}, Eligible departments updated.",
                ))
            elif not was_eligible and now_eligible and app.status == "Eligibility_Conflict":
                app.status = "Applied"
                impacted_count += 1
                NotificationService.create_notification(db, NotificationCreate(
                    user_id=student.id,
                    title="Eligibility Restored",
                    message=f"You are now eligible for {company.company_name} following updated criteria.",
                ))

        db.commit()

        if admin and impacted_count > 0:
            AuditService.create_log(
                db=db,
                actor_id=str(admin.id),
                actor_name=admin.full_name,
                actor_role="admin",
                action="propagate_eligibility",
                resource_type="application",
                details=f"Eligibility re-check for {company.company_name}: {impacted_count} applications impacted",
            )

    @staticmethod
    def close_drive(db: Session, company_id: str, admin: Admin = None) -> dict:
        db_company = db.query(Company).filter(Company.id == company_id).first()
        if not db_company:
            raise HTTPException(status_code=404, detail="Company not found")

        if db_company.status == "closed":
            raise HTTPException(status_code=400, detail="Drive is already closed")

        pending_count = db.query(Application).filter(
            Application.company_id == company_id,
            Application.status.in_(["Applied", "Shortlisted", "Interview", "Screening", "Technical", "HR", "Eligibility_Conflict"]),
        ).count()

        db_company.status = "closed"

        db.query(Application).filter(
            Application.company_id == company_id,
            Application.status.in_(["Applied", "Eligibility_Conflict"]),
        ).update({Application.status: "Rejected"}, synchronize_session=False)

        interview_count = db.query(Application).filter(
            Application.company_id == company_id,
            Application.status.in_(["Shortlisted", "Interview", "Screening", "Technical", "HR"]),
        ).update({Application.status: "Archived"}, synchronize_session=False)

        db.commit()
        db.refresh(db_company)

        if admin:
            AuditService.create_log(
                db=db,
                actor_id=str(admin.id),
                actor_name=admin.full_name,
                actor_role="admin",
                action="close_drive",
                resource_type="drive",
                resource_id=str(db_company.id),
                details=f"Closed drive {db_company.company_name}: rejected {pending_count} pending applicants, archived {interview_count} in-progress interviews",
            )

        return {
            "status": "closed",
            "rejected_applicants": pending_count,
            "archived_interviews": interview_count,
        }

    @staticmethod
    def get_drive_consequences(db: Session, company_id: str) -> DriveCloseConsequence:
        db_company = db.query(Company).filter(Company.id == company_id).first()
        if not db_company:
            raise HTTPException(status_code=404, detail="Company not found")

        pending_count = db.query(Application).filter(
            Application.company_id == company_id,
            Application.status.in_(["Applied", "Shortlisted", "Interview", "Screening", "Technical", "HR", "Eligibility_Conflict"]),
        ).count()

        interview_count = db.query(Application).filter(
            Application.company_id == company_id,
            Application.status.in_(["Shortlisted", "Interview", "Screening", "Technical", "HR"]),
        ).count()

        return DriveCloseConsequence(
            drive_name=db_company.company_name,
            pending_applicants=pending_count,
            locked_scheduling=interview_count > 0,
            archived_recruiter_access=True,
            total_impacted=pending_count + interview_count,
        )

    @staticmethod
    def get_company(db: Session, company_id: str) -> Company:
        db_company = db.query(Company).filter(Company.id == company_id).first()
        if not db_company:
            raise HTTPException(status_code=404, detail="Company not found")
        return db_company

    @staticmethod
    def archive_drive(db: Session, company_id: str, admin: Admin = None) -> Company:
        db_company = db.query(Company).filter(Company.id == company_id).first()
        if not db_company:
            raise HTTPException(status_code=404, detail="Company not found")
        if db_company.status == "archived":
            raise HTTPException(status_code=400, detail="Drive is already archived")

        db_company.status = "archived"
        db.commit()
        db.refresh(db_company)

        if admin:
            AuditService.create_log(
                db=db,
                actor_id=str(admin.id),
                actor_name=admin.full_name,
                actor_role="admin",
                action="archive_drive",
                resource_type="drive",
                resource_id=str(db_company.id),
                details=f"Archived drive: {db_company.company_name} - {db_company.role}",
            )

        return db_company

    @staticmethod
    def duplicate_drive(db: Session, company_id: str, new_deadline: str, admin: Admin = None) -> Company:
        from datetime import datetime as dt
        source = db.query(Company).filter(Company.id == company_id).first()
        if not source:
            raise HTTPException(status_code=404, detail="Company not found")

        try:
            parsed_deadline = dt.fromisoformat(new_deadline.replace("Z", "+00:00"))
        except ValueError:
            raise HTTPException(status_code=422, detail="Invalid deadline format")

        clone = Company(
            company_name=source.company_name,
            role=source.role,
            package=source.package,
            min_cgpa=source.min_cgpa,
            eligible_departments=source.eligible_departments,
            deadline=parsed_deadline,
            status="active",
            ctc=source.ctc,
            description=source.description,
            hiring_process=source.hiring_process,
            required_skills=source.required_skills,
            location=source.location,
            company_type=source.company_type,
        )
        db.add(clone)
        db.commit()
        db.refresh(clone)

        if admin:
            AuditService.create_log(
                db=db,
                actor_id=str(admin.id),
                actor_name=admin.full_name,
                actor_role="admin",
                action="duplicate_drive",
                resource_type="drive",
                resource_id=str(clone.id),
                details=f"Duplicated drive from {source.company_name} (id={source.id})",
            )

        return clone

    @staticmethod
    def get_all_companies(db: Session):
        return db.query(Company).order_by(Company.deadline.asc()).all()

    @staticmethod
    def get_eligible_companies(db: Session, student: Student):
        all_companies = db.query(Company).filter(
            Company.min_cgpa <= student.cgpa,
            Company.status == "active",
        ).all()

        eligible = []
        for company in all_companies:
            depts = [d.strip().upper() for d in company.eligible_departments.split(",")]
            if student.department.upper() in depts:
                eligible.append(company)

        return eligible
