from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

VALID_CATEGORIES = {"Drive", "Update", "Deadline", "Notice"}
VALID_PRIORITIES = {"Normal", "Important", "Urgent"}


class AnnouncementCreate(BaseModel):
    title: str
    content: str
    category: str = "Notice"
    priority: str = "Normal"
    active: bool = True

    def validate_enums(self) -> None:
        if self.category not in VALID_CATEGORIES:
            raise ValueError(f"category must be one of {VALID_CATEGORIES}")
        if self.priority not in VALID_PRIORITIES:
            raise ValueError(f"priority must be one of {VALID_PRIORITIES}")


class AnnouncementUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[str] = None
    priority: Optional[str] = None
    active: Optional[bool] = None


class AnnouncementResponse(BaseModel):
    id: UUID
    title: str
    content: str
    category: str
    priority: str
    created_by: str
    created_at: datetime
    updated_at: datetime
    active: bool

    model_config = ConfigDict(from_attributes=True)
