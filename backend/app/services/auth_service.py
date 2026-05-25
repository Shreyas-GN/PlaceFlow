from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.models.student import Student
from app.schemas.student import StudentCreate
from app.schemas.auth import LoginSchema
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token
from app.db.session import SessionLocal

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class AuthService:
    @staticmethod
    def register_student(db: Session, student_in: StudentCreate):
        # Check if email exists
        existing_user = db.query(Student).filter(Student.email == student_in.email).first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="A user with this email already exists."
            )
        
        # Hash password and create student
        hashed_password = get_password_hash(student_in.password)
        db_student = Student(
            full_name=student_in.full_name,
            email=student_in.email,
            password_hash=hashed_password,
            department=student_in.department,
            cgpa=student_in.cgpa
        )
        db.add(db_student)
        db.commit()
        db.refresh(db_student)
        return db_student

    @staticmethod
    def login_student(db: Session, login_data: LoginSchema):
        user = db.query(Student).filter(Student.email == login_data.email).first()
        if not user or not verify_password(login_data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        access_token = create_access_token(subject=user.email)
        return {"access_token": access_token, "token_type": "bearer"}

    @staticmethod
    def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
        payload = decode_token(token)
        if not payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
        
        email = payload.get("sub")
        user = db.query(Student).filter(Student.email == email).first()
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        return user

    @staticmethod
    def change_password(db: Session, user: Student, current_password: str, new_password: str):
        if not verify_password(current_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Current password is incorrect"
            )
        if len(new_password) < 6:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="New password must be at least 6 characters"
            )
        user.password_hash = get_password_hash(new_password)
        db.add(user)
        db.commit()
        return {"detail": "Password updated successfully"}
