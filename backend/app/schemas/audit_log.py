from pydantic import BaseModel, ConfigDict
from uuid import UUID
from datetime import datetime
from typing import Optional

class AuditLogResponse(BaseModel):
    id: UUID
    actor_id: str
    actor_name: str
    actor_role: str
    action: str
    resource_type: str
    resource_id: Optional[str] = None
    details: Optional[str] = None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)

class AuditLogListResponse(BaseModel):
    logs: list[AuditLogResponse]
    total: int
