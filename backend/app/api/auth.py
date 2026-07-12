from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.student import StudentCreate, StudentResponse, StudentUpdate, ChangePassword
from app.schemas.auth import LoginSchema, Token, ForgotPasswordRequest, ResetPasswordRequest
from app.services.auth_service import AuthService, get_db
from app.models.student import Student

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post("/register", response_model=StudentResponse)
def register(student_in: StudentCreate, db: Session = Depends(get_db)):
    return AuthService.register_student(db, student_in)

@router.post("/login", response_model=Token)
def login(login_data: LoginSchema, db: Session = Depends(get_db)):
    return AuthService.login_student(db, login_data)

@router.get("/me", response_model=StudentResponse)
def get_me(current_user: Student = Depends(AuthService.get_current_user)):
    return current_user

@router.patch("/me", response_model=StudentResponse)
def update_me(
    student_in: StudentUpdate,
    current_user: Student = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    for field, value in student_in.model_dump(exclude_unset=True).items():
        setattr(current_user, field, value)
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/me/password")
def change_password(
    passwords: ChangePassword,
    current_user: Student = Depends(AuthService.get_current_user),
    db: Session = Depends(get_db)
):
    return AuthService.change_password(db, current_user, passwords.current_password, passwords.new_password)

@router.post("/forgot-password")
def forgot_password(body: ForgotPasswordRequest, db: Session = Depends(get_db)):
    return AuthService.forgot_password(db, body.email)

@router.post("/reset-password")
def reset_password(body: ResetPasswordRequest, db: Session = Depends(get_db)):
    return AuthService.reset_password(db, body.token, body.new_password)
