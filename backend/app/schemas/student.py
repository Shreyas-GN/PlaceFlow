from pydantic import BaseModel, EmailStr, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional

class StudentBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str
    cgpa: float = Field(ge=0, le=10)

class StudentCreate(StudentBase):
    password: str

class StudentResponse(StudentBase):
    id: UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    cgpa: Optional[float] = Field(default=None, ge=0, le=10)

class ChangePassword(BaseModel):
    current_password: str
    new_password: str
