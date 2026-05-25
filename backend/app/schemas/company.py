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

class CompanyResponse(CompanyBase):
    id: UUID
    created_at: datetime
    
    model_config = ConfigDict(from_attributes=True)
