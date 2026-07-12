from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import csv
import io

from app.schemas.student import StudentResponse
from app.services.admin_student_service import AdminStudentService
from app.services.auth_service import get_db
from app.services.admin_service import AdminService
from app.models.admin import Admin

router = APIRouter(prefix="/admin/students", tags=["admin-students"])


@router.get("/")
def list_students(
    search: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    min_cgpa: Optional[float] = Query(None, ge=0, le=10),
    max_cgpa: Optional[float] = Query(None, ge=0, le=10),
    placement_eligible: Optional[bool] = Query(None),
    graduation_year: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return AdminStudentService.list_students(
        db,
        search=search,
        department=department,
        min_cgpa=min_cgpa,
        max_cgpa=max_cgpa,
        placement_eligible=placement_eligible,
        graduation_year=graduation_year,
        skip=skip,
        limit=limit,
    )


@router.get("/{student_id}", response_model=StudentResponse)
def get_student(
    student_id: str,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return AdminStudentService.get_student(db, student_id)


@router.patch("/{student_id}/eligibility", response_model=StudentResponse)
def update_eligibility(
    student_id: str,
    placement_eligible: bool = Query(...),
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin),
):
    return AdminStudentService.update_eligibility(db, student_id, placement_eligible, current_admin)


@router.get("/{student_id}/resume")
def get_resume_url(
    student_id: str,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    student = AdminStudentService.get_student(db, student_id)
    if not student.resume_url:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="No resume uploaded for this student")
    return {"resume_url": student.resume_url, "student_name": student.full_name}


@router.get("/export/csv")
def export_students_csv(
    department: Optional[str] = Query(None),
    placement_eligible: Optional[bool] = Query(None),
    graduation_year: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    result = AdminStudentService.list_students(
        db,
        department=department,
        placement_eligible=placement_eligible,
        graduation_year=graduation_year,
        limit=10000,
    )
    students = result["items"]

    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow([
        "Roll Number", "Full Name", "Email", "Department", "CGPA",
        "Graduation Year", "Placement Eligible", "Active Backlogs",
        "Resume URL", "LinkedIn", "GitHub",
    ])
    for s in students:
        writer.writerow([
            s.roll_number or "",
            s.full_name,
            s.email,
            s.department,
            s.cgpa,
            s.graduation_year or "",
            s.placement_eligible if s.placement_eligible is not None else "",
            s.active_backlogs or 0,
            s.resume_url or "",
            s.linkedin_url or "",
            s.github_url or "",
        ])

    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=students.csv"},
    )
