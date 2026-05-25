from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.admin import AdminCreate, AdminLogin, AdminResponse
from app.schemas.auth import Token
from app.services.admin_service import AdminService
from app.services.auth_service import get_db

router = APIRouter(prefix="/admin", tags=["admin"])

@router.post("/register", response_model=AdminResponse)
def register_admin(admin_in: AdminCreate, db: Session = Depends(get_db)):
    return AdminService.register_admin(db, admin_in)

@router.post("/login", response_model=Token)
def login_admin(login_data: AdminLogin, db: Session = Depends(get_db)):
    return AdminService.login_admin(db, login_data)

@router.get("/me", response_model=AdminResponse)
def get_me(current_admin = Depends(AdminService.get_current_admin)):
    return current_admin
