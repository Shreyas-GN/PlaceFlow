from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from app.services.auth_service import get_db
from app.models.student import Student
from app.models.company import Company
from app.models.application import Application
from pydantic import BaseModel
from uuid import UUID
from datetime import datetime
from typing import Optional

router = APIRouter(prefix="/search", tags=["search"])

class StudentResult(BaseModel):
    id: UUID
    full_name: str
    email: str
    department: str
    cgpa: float

class CompanyResult(BaseModel):
    id: UUID
    company_name: str
    role: str
    package: str
    status: str
    deadline: datetime

class ApplicationResult(BaseModel):
    id: UUID
    student_name: str
    student_email: str
    company_name: str
    status: str
    applied_at: datetime

class SearchResponse(BaseModel):
    students: list[StudentResult]
    companies: list[CompanyResult]
    applications: list[ApplicationResult]
    total: int

@router.get("/")
def search(
    q: str = Query("", min_length=0, max_length=100),
    limit: int = Query(5, ge=1, le=20),
    db: Session = Depends(get_db),
):
    query = q.strip()
    students = []
    companies = []
    applications = []

    if not query:
        return SearchResponse(students=[], companies=[], applications=[], total=0)

    term = f"%{query}%"

    students = db.query(Student).filter(
        or_(
            Student.full_name.ilike(term),
            Student.email.ilike(term),
            Student.department.ilike(term),
        )
    ).limit(limit).all()

    companies = db.query(Company).filter(
        or_(
            Company.company_name.ilike(term),
            Company.role.ilike(term),
        )
    ).limit(limit).all()

    app_query = db.query(Application).join(Student).join(Company).filter(
        or_(
            Student.full_name.ilike(term),
            Company.company_name.ilike(term),
            Application.status.ilike(term),
        )
    ).limit(limit).all()

    applications = [
        ApplicationResult(
            id=a.id,
            student_name=a.student.full_name,
            student_email=a.student.email,
            company_name=a.company.company_name,
            status=a.status,
            applied_at=a.applied_at,
        )
        for a in app_query
    ]

    student_results = [
        StudentResult(
            id=s.id,
            full_name=s.full_name,
            email=s.email,
            department=s.department,
            cgpa=s.cgpa,
        )
        for s in students
    ]

    company_results = [
        CompanyResult(
            id=c.id,
            company_name=c.company_name,
            role=c.role,
            package=c.package,
            status=c.status,
            deadline=c.deadline,
        )
        for c in companies
    ]

    total = len(student_results) + len(company_results) + len(applications)

    return SearchResponse(
        students=student_results,
        companies=company_results,
        applications=applications,
        total=total,
    )
