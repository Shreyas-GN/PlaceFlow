from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional, List
from .company import CompanyResponse
from .student import StudentResponse

# Valid pipeline statuses and allowed transitions
PIPELINE_STATUSES = [
    "Applied", "Shortlisted", "OA", "Interview", "HR", "Offer",
    "Rejected", "Withdrawn", "Eligibility_Conflict", "Screening", "Technical",
    "Selected", "Archived",
]

VALID_TRANSITIONS: dict[str, list[str]] = {
    "Applied":             ["Shortlisted", "OA", "Interview", "Rejected", "Withdrawn", "Eligibility_Conflict"],
    "Shortlisted":         ["OA", "Interview", "HR", "Rejected", "Withdrawn"],
    "OA":                  ["Shortlisted", "Interview", "HR", "Rejected", "Withdrawn"],
    "Screening":           ["Shortlisted", "Interview", "HR", "Rejected", "Withdrawn"],
    "Technical":           ["Interview", "HR", "Rejected", "Withdrawn"],
    "Interview":           ["HR", "Offer", "Selected", "Rejected", "Withdrawn"],
    "HR":                  ["Offer", "Selected", "Rejected", "Withdrawn"],
    "Offer":               ["Selected", "Rejected", "Withdrawn"],
    "Selected":            ["Withdrawn"],
    "Eligibility_Conflict": ["Applied", "Rejected", "Withdrawn"],
    "Archived":            [],
    "Rejected":            [],
    "Withdrawn":           [],
}


class ApplicationBase(BaseModel):
    company_id: UUID


class ApplicationCreate(ApplicationBase):
    pass


class StatusHistoryResponse(BaseModel):
    id: UUID
    application_id: UUID
    previous_status: Optional[str] = None
    new_status: str
    changed_by: str
    changed_by_role: str
    timestamp: datetime
    note: Optional[str] = None

    model_config = ConfigDict(from_attributes=True)


class ApplicationResponse(BaseModel):
    id: UUID
    student_id: UUID
    company_id: UUID
    status: str
    applied_at: datetime
    next_action: Optional[str] = None
    recruiter_notes: Optional[str] = None
    company: Optional[CompanyResponse] = None
    student: Optional[StudentResponse] = None
    status_history: Optional[List[StatusHistoryResponse]] = None

    model_config = ConfigDict(from_attributes=True)


class StatusUpdateRequest(BaseModel):
    status: str
    note: Optional[str] = None


class BulkStatusUpdateRequest(BaseModel):
    application_ids: List[UUID]
    status: str
    note: Optional[str] = None


class NextActionUpdateRequest(BaseModel):
    next_action: Optional[str] = None


class RecruiterNoteUpdateRequest(BaseModel):
    recruiter_notes: Optional[str] = None
