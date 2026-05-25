from sqlalchemy.orm import Session
from app.models.audit_log import AuditLog
from uuid import UUID
from typing import Optional

class AuditService:
    @staticmethod
    def create_log(
        db: Session,
        actor_id: str,
        actor_name: str,
        actor_role: str,
        action: str,
        resource_type: str,
        resource_id: Optional[str] = None,
        details: Optional[str] = None,
    ) -> AuditLog:
        log = AuditLog(
            actor_id=actor_id,
            actor_name=actor_name,
            actor_role=actor_role,
            action=action,
            resource_type=resource_type,
            resource_id=resource_id,
            details=details,
        )
        db.add(log)
        db.commit()
        db.refresh(log)
        return log

    @staticmethod
    def get_logs(
        db: Session,
        limit: int = 100,
        offset: int = 0,
        resource_type: Optional[str] = None,
        action: Optional[str] = None,
        actor_role: Optional[str] = None,
    ) -> tuple[list[AuditLog], int]:
        query = db.query(AuditLog)

        if resource_type:
            query = query.filter(AuditLog.resource_type == resource_type)
        if action:
            query = query.filter(AuditLog.action == action)
        if actor_role:
            query = query.filter(AuditLog.actor_role == actor_role)

        total = query.count()
        logs = (
            query.order_by(AuditLog.created_at.desc())
            .offset(offset)
            .limit(limit)
            .all()
        )
        return logs, total
