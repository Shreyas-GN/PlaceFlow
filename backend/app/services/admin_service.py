from sqlalchemy.orm import Session
from fastapi import HTTPException, status, Depends
from fastapi.security import OAuth2PasswordBearer
from app.models.admin import Admin
from app.schemas.admin import AdminCreate, AdminLogin
from app.core.security import get_password_hash, verify_password, create_access_token, decode_token
from app.services.auth_service import get_db

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

class AdminService:
    @staticmethod
    def register_admin(db: Session, admin_in: AdminCreate):
        existing_user = db.query(Admin).filter(Admin.email == admin_in.email).first()
        if existing_user:
            raise HTTPException(status_code=400, detail="Admin already exists")
        
        hashed_password = get_password_hash(admin_in.password)
        db_admin = Admin(
            full_name=admin_in.full_name,
            email=admin_in.email,
            password_hash=hashed_password,
            role=admin_in.role
        )
        db.add(db_admin)
        db.commit()
        db.refresh(db_admin)
        return db_admin

    @staticmethod
    def login_admin(db: Session, login_data: AdminLogin):
        admin = db.query(Admin).filter(Admin.email == login_data.email).first()
        if not admin or not verify_password(login_data.password, admin.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )
        
        access_token = create_access_token(subject=admin.email, role="admin")
        return {"access_token": access_token, "token_type": "bearer"}

    @staticmethod
    def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
        payload = decode_token(token)
        if not payload or payload.get("role") != "admin":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Not authorized as admin",
            )
        
        email = payload.get("sub")
        admin = db.query(Admin).filter(Admin.email == email).first()
        if not admin:
            raise HTTPException(status_code=404, detail="Admin not found")
        return admin
