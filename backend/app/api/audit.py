from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from app.schemas.audit_log import AuditLogResponse, AuditLogListResponse
from app.services.audit_service import AuditService
from app.services.admin_service import AdminService
from app.services.auth_service import get_db

router = APIRouter(prefix="/audit-logs", tags=["audit"])

@router.get("/", response_model=AuditLogListResponse)
def get_audit_logs(
    limit: int = Query(default=100, le=500),
    offset: int = Query(default=0, ge=0),
    resource_type: Optional[str] = None,
    action: Optional[str] = None,
    actor_role: Optional[str] = None,
    db: Session = Depends(get_db),
    current_admin = Depends(AdminService.get_current_admin),
):
    logs, total = AuditService.get_logs(
        db, limit=limit, offset=offset,
        resource_type=resource_type,
        action=action,
        actor_role=actor_role,
    )
    return {"logs": logs, "total": total}
