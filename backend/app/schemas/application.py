from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional
from .company import CompanyResponse
from .student import StudentResponse

class ApplicationBase(BaseModel):
    company_id: UUID

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationResponse(BaseModel):
    id: UUID
    student_id: UUID
    company_id: UUID
    status: str
    applied_at: datetime
    company: Optional[CompanyResponse] = None 
    student: Optional[StudentResponse] = None
    
    model_config = ConfigDict(from_attributes=True)
