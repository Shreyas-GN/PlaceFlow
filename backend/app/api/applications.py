from fastapi import APIRouter, Depends, BackgroundTasks, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.schemas.application import (
    ApplicationCreate, ApplicationResponse,
    StatusUpdateRequest, BulkStatusUpdateRequest,
    NextActionUpdateRequest, RecruiterNoteUpdateRequest,
)
from app.services.application_service import ApplicationService
from app.services.auth_service import AuthService, get_db
from app.services.admin_service import AdminService
from app.models.student import Student
from app.models.admin import Admin

router = APIRouter(prefix="/applications", tags=["applications"])


@router.post("/", response_model=ApplicationResponse)
def apply_to_company(
    application_in: ApplicationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: Student = Depends(AuthService.get_current_user),
):
    return ApplicationService.apply_to_company(db, current_user, application_in, background_tasks)


@router.get("/", response_model=List[ApplicationResponse])
def get_my_applications(
    company_id: Optional[str] = Query(None),
    app_status: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db),
    current_user: Student = Depends(AuthService.get_current_user),
):
    return ApplicationService.get_student_applications(db, current_user.id, company_id, app_status)


@router.get("/all")
def get_all_applications(
    company_id: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    department: Optional[str] = Query(None),
    year: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return ApplicationService.get_all_applications(
        db,
        company_id=company_id,
        app_status=status,
        department=department,
        year=year,
        skip=skip,
        limit=limit,
    )


@router.post("/bulk-status")
def bulk_update_status(
    body: BulkStatusUpdateRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin),
):
    return ApplicationService.bulk_update_status(
        db, body.application_ids, body.status, current_admin, body.note
    )


@router.get("/{application_id}", response_model=ApplicationResponse)
def get_application(
    application_id: str,
    db: Session = Depends(get_db),
    current_user: Student = Depends(AuthService.get_current_user),
):
    return ApplicationService.get_student_application_detail(db, application_id, current_user.id)


@router.patch("/{application_id}/status", response_model=ApplicationResponse)
def update_status(
    application_id: str,
    body: StatusUpdateRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin),
):
    return ApplicationService.update_application_status(
        db, application_id, body.status, background_tasks, admin=current_admin, note=body.note
    )


@router.patch("/{application_id}/next-action", response_model=ApplicationResponse)
def update_next_action(
    application_id: str,
    body: NextActionUpdateRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin),
):
    return ApplicationService.update_next_action(
        db, application_id, body.next_action, current_admin
    )


@router.patch("/{application_id}/recruiter-notes", response_model=ApplicationResponse)
def update_recruiter_notes(
    application_id: str,
    body: RecruiterNoteUpdateRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin),
):
    return ApplicationService.update_recruiter_notes(
        db, application_id, body.recruiter_notes, current_admin
    )
