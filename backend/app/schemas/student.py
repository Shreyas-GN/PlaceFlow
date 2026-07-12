from pydantic import BaseModel, EmailStr, ConfigDict, Field
from uuid import UUID
from datetime import datetime
from typing import Optional, List, Any

class StudentBase(BaseModel):
    full_name: str
    email: EmailStr
    department: str
    cgpa: float = Field(ge=0, le=10)

class StudentCreate(StudentBase):
    password: str

class ProjectItem(BaseModel):
    name: str
    description: str = ""
    link: str = ""

class CertificationItem(BaseModel):
    name: str
    issuer: str = ""
    year: str = ""

class StudentResponse(StudentBase):
    id: UUID
    created_at: datetime
    profile_complete: bool = False
    # Extended profile — all optional since existing rows may not have them
    roll_number: Optional[str] = None
    degree: Optional[str] = None
    current_semester: Optional[int] = None
    graduation_year: Optional[int] = None
    active_backlogs: Optional[int] = None
    historical_backlogs: Optional[int] = None
    tenth_percentage: Optional[float] = None
    twelfth_percentage: Optional[float] = None
    alternative_email: Optional[str] = None
    whatsapp_number: Optional[str] = None
    parent_contact: Optional[str] = None
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    # V2 enrichment
    skills: Optional[List[str]] = None
    projects: Optional[List[Any]] = None
    certifications: Optional[List[Any]] = None
    placement_eligible: Optional[bool] = None

    model_config = ConfigDict(from_attributes=True)

class StudentUpdate(BaseModel):
    full_name: Optional[str] = None
    department: Optional[str] = None
    cgpa: Optional[float] = Field(default=None, ge=0, le=10)

class StudentOnboarding(BaseModel):
    roll_number: str
    degree: str
    current_semester: int = Field(ge=1, le=10)
    graduation_year: int = Field(ge=2020, le=2035)
    active_backlogs: int = Field(ge=0)
    historical_backlogs: int = Field(ge=0)
    tenth_percentage: float = Field(ge=0.0, le=100.0)
    twelfth_percentage: float = Field(ge=0.0, le=100.0)
    whatsapp_number: str
    parent_contact: str
    alternative_email: Optional[EmailStr] = None
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None

class StudentProfileUpdate(BaseModel):
    whatsapp_number: Optional[str] = None
    parent_contact: Optional[str] = None
    alternative_email: Optional[EmailStr] = None
    resume_url: Optional[str] = None
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    # V2 enrichment (student-editable)
    skills: Optional[List[str]] = None
    projects: Optional[List[Any]] = None
    certifications: Optional[List[Any]] = None

class ChangePassword(BaseModel):
    current_password: str
    new_password: str
