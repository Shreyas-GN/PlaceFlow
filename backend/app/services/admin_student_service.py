from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional

from app.models.student import Student
from app.models.admin import Admin
from app.services.audit_service import AuditService


class AdminStudentService:

    @staticmethod
    def list_students(
        db: Session,
        search: Optional[str] = None,
        department: Optional[str] = None,
        min_cgpa: Optional[float] = None,
        max_cgpa: Optional[float] = None,
        placement_eligible: Optional[bool] = None,
        graduation_year: Optional[int] = None,
        skip: int = 0,
        limit: int = 50,
    ) -> dict:
        q = db.query(Student)

        if search:
            like = f"%{search}%"
            q = q.filter(
                Student.full_name.ilike(like)
                | Student.email.ilike(like)
                | Student.roll_number.ilike(like)
            )
        if department:
            q = q.filter(Student.department.ilike(f"%{department}%"))
        if min_cgpa is not None:
            q = q.filter(Student.cgpa >= min_cgpa)
        if max_cgpa is not None:
            q = q.filter(Student.cgpa <= max_cgpa)
        if placement_eligible is not None:
            q = q.filter(Student.placement_eligible == placement_eligible)
        if graduation_year is not None:
            q = q.filter(Student.graduation_year == graduation_year)

        total = q.count()
        items = q.order_by(Student.full_name.asc()).offset(skip).limit(limit).all()
        return {"total": total, "items": items, "skip": skip, "limit": limit}

    @staticmethod
    def get_student(db: Session, student_id: str) -> Student:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")
        return student

    @staticmethod
    def update_eligibility(
        db: Session,
        student_id: str,
        placement_eligible: bool,
        admin: Admin,
    ) -> Student:
        student = db.query(Student).filter(Student.id == student_id).first()
        if not student:
            raise HTTPException(status_code=404, detail="Student not found")

        old_value = student.placement_eligible
        student.placement_eligible = placement_eligible

        AuditService.create_log(
            db=db,
            actor_id=str(admin.id),
            actor_name=admin.full_name,
            actor_role="admin",
            action="eligibility_update",
            resource_type="student",
            resource_id=str(student.id),
            details=f"placement_eligible: {old_value} -> {placement_eligible} for {student.full_name}",
        )

        db.commit()
        db.refresh(student)
        return student
