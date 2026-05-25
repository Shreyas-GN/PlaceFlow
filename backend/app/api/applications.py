from fastapi import APIRouter, Depends, BackgroundTasks
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel
from app.schemas.application import ApplicationCreate, ApplicationResponse
from app.services.application_service import ApplicationService
from app.services.auth_service import AuthService, get_db
from app.services.admin_service import AdminService
from app.models.student import Student
from app.models.admin import Admin

router = APIRouter(prefix="/applications", tags=["applications"])

class StatusUpdate(BaseModel):
    status: str

@router.post("/", response_model=ApplicationResponse)
def apply_to_company(
    application_in: ApplicationCreate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_user: Student = Depends(AuthService.get_current_user)
):
    return ApplicationService.apply_to_company(db, current_user, application_in, background_tasks)

@router.get("/", response_model=List[ApplicationResponse])
def get_my_applications(
    db: Session = Depends(get_db),
    current_user: Student = Depends(AuthService.get_current_user)
):
    return ApplicationService.get_student_applications(db, current_user.id)

@router.get("/all")
def get_all_applications(
    db: Session = Depends(get_db),
    current_admin = Depends(AdminService.get_current_admin)
):
    return ApplicationService.get_all_applications(db)

@router.patch("/{application_id}/status")
def update_status(
    application_id: str,
    body: StatusUpdate,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin)
):
    return ApplicationService.update_application_status(db, application_id, body.status, background_tasks, admin=current_admin)
