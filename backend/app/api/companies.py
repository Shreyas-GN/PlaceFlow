from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from app.schemas.company import CompanyCreate, CompanyUpdate, CompanyResponse, DriveCloseConsequence
from app.services.company_service import CompanyService
from app.services.admin_service import AdminService
from app.services.auth_service import AuthService, get_db
from app.models.student import Student
from app.models.admin import Admin

router = APIRouter(prefix="/companies", tags=["companies"])


class DuplicateRequest(BaseModel):
    new_deadline: str


@router.post("/", response_model=CompanyResponse)
def create_company(
    company_in: CompanyCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin)
):
    return CompanyService.create_company(db, company_in, admin=current_admin)

@router.put("/{company_id}", response_model=CompanyResponse)
def update_company(
    company_id: str,
    company_in: CompanyUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin)
):
    return CompanyService.update_company(db, company_id, company_in, admin=current_admin)

@router.get("/", response_model=List[CompanyResponse])
def get_companies(db: Session = Depends(get_db)):
    return CompanyService.get_all_companies(db)

@router.get("/eligible", response_model=List[CompanyResponse])
def get_eligible_companies(
    db: Session = Depends(get_db),
    current_user: Student = Depends(AuthService.get_current_user)
):
    return CompanyService.get_eligible_companies(db, current_user)

@router.get("/{company_id}", response_model=CompanyResponse)
def get_company(
    company_id: str,
    db: Session = Depends(get_db)
):
    return CompanyService.get_company(db, company_id)

@router.post("/{company_id}/archive", response_model=CompanyResponse)
def archive_drive(
    company_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin)
):
    return CompanyService.archive_drive(db, company_id, admin=current_admin)

@router.post("/{company_id}/duplicate", response_model=CompanyResponse)
def duplicate_drive(
    company_id: str,
    body: DuplicateRequest,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin)
):
    return CompanyService.duplicate_drive(db, company_id, body.new_deadline, admin=current_admin)

@router.post("/{company_id}/close")
def close_drive(
    company_id: str,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin)
):
    return CompanyService.close_drive(db, company_id, admin=current_admin)

@router.get("/{company_id}/close-consequences", response_model=DriveCloseConsequence)
def get_close_consequences(
    company_id: str,
    db: Session = Depends(get_db),
    _current_admin: Admin = Depends(AdminService.get_current_admin)
):
    return CompanyService.get_drive_consequences(db, company_id)
