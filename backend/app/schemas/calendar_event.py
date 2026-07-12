from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

VALID_EVENT_TYPES = {"Interview", "OA", "Deadline", "CompanyVisit", "Notice"}


class CalendarEventCreate(BaseModel):
    title: str
    description: Optional[str] = None
    event_type: str = "Notice"
    start_time: datetime
    end_time: Optional[datetime] = None
    company_id: Optional[UUID] = None


class CalendarEventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    event_type: Optional[str] = None
    start_time: Optional[datetime] = None
    end_time: Optional[datetime] = None
    company_id: Optional[UUID] = None


class CalendarEventResponse(BaseModel):
    id: UUID
    title: str
    description: Optional[str] = None
    event_type: str
    start_time: datetime
    end_time: Optional[datetime] = None
    company_id: Optional[UUID] = None
    created_by: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
