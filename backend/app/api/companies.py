from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from app.schemas.company import CompanyCreate, CompanyResponse
from app.services.company_service import CompanyService
from app.services.admin_service import AdminService
from app.services.auth_service import AuthService, get_db
from app.models.student import Student

router = APIRouter(prefix="/companies", tags=["companies"])

@router.post("/", response_model=CompanyResponse)
def create_company(
    company_in: CompanyCreate, 
    db: Session = Depends(get_db),
    current_admin = Depends(AdminService.get_current_admin) # Only admins
):
    return CompanyService.create_company(db, company_in)

@router.get("/", response_model=List[CompanyResponse])
def get_companies(db: Session = Depends(get_db)):
    return CompanyService.get_all_companies(db)

@router.get("/eligible", response_model=List[CompanyResponse])
def get_eligible_companies(
    db: Session = Depends(get_db),
    current_user: Student = Depends(AuthService.get_current_user)
):
    return CompanyService.get_eligible_companies(db, current_user)
