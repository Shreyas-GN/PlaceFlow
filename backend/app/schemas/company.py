from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import List, Optional

class CompanyBase(BaseModel):
    company_name: str
    role: str
    package: str
    min_cgpa: float
    eligible_departments: str # Comma-separated or JSON string
    deadline: datetime

class CompanyCreate(CompanyBase):
    pass

class CompanyUpdate(BaseModel):
    company_name: Optional[str] = None
    role: Optional[str] = None
    package: Optional[str] = None
    min_cgpa: Optional[float] = None
    eligible_departments: Optional[str] = None
    deadline: Optional[datetime] = None
    status: Optional[str] = None

class CompanyResponse(CompanyBase):
    id: UUID
    status: str
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)

class DriveCloseConsequence(BaseModel):
    drive_name: str
    pending_applicants: int
    locked_scheduling: bool
    archived_recruiter_access: bool
    total_impacted: int
