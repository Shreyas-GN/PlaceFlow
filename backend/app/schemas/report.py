from pydantic import BaseModel
from typing import List, Optional


class CompanyReport(BaseModel):
    company_id: str
    company_name: str
    role: str
    package: str
    total_applications: int
    shortlisted: int
    offers: int
    rejected: int


class BranchReport(BaseModel):
    department: str
    total_students: int
    applied: int
    placed: int
    placement_percentage: float
    average_cgpa: Optional[float] = None


class PlacementSummary(BaseModel):
    total_students: int
    total_applied: int
    total_placed: int
    total_offers: int
    placement_percentage: float
    average_package: Optional[str] = None
    total_companies: int
    active_drives: int


class ReportResponse(BaseModel):
    summary: PlacementSummary
    by_company: List[CompanyReport]
    by_branch: List[BranchReport]
