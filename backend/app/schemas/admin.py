from pydantic import BaseModel, EmailStr, ConfigDict
from uuid import UUID
from datetime import datetime

class AdminBase(BaseModel):
    full_name: str
    email: EmailStr
    role: str = "admin"

class AdminCreate(AdminBase):
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    password: str

class AdminResponse(AdminBase):
    id: UUID
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
