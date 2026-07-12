from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional


class PlacementSettingsUpdate(BaseModel):
    season_name: Optional[str] = None
    season_active: Optional[bool] = None
    allowed_branches: Optional[str] = None
    default_min_cgpa: Optional[float] = None
    max_backlogs_allowed: Optional[int] = None
    placement_coordinator_name: Optional[str] = None
    placement_coordinator_email: Optional[str] = None


class PlacementSettingsResponse(BaseModel):
    id: UUID
    season_name: str
    season_active: bool
    allowed_branches: Optional[str] = None
    default_min_cgpa: float
    max_backlogs_allowed: int
    placement_coordinator_name: Optional[str] = None
    placement_coordinator_email: Optional[str] = None
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)
