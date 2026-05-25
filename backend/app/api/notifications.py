from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID
from app.services.auth_service import AuthService, get_db
from app.services.notification_service import NotificationService
from app.schemas.notification import NotificationResponse
from app.models.student import Student

router = APIRouter(prefix="/notifications", tags=["notifications"])

@router.get("/", response_model=List[NotificationResponse])
def get_my_notifications(
    db: Session = Depends(get_db),
    current_user: Student = Depends(AuthService.get_current_user)
):
    return NotificationService.get_user_notifications(db, current_user.id)

@router.patch("/{notification_id}/read", response_model=NotificationResponse)
def mark_as_read(
    notification_id: UUID,
    db: Session = Depends(get_db),
    current_user: Student = Depends(AuthService.get_current_user)
):
    notif = NotificationService.mark_notification_read(db, notification_id, current_user.id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification not found")
    return notif

@router.post("/read-all")
def mark_all_read(
    db: Session = Depends(get_db),
    current_user: Student = Depends(AuthService.get_current_user)
):
    NotificationService.mark_all_as_read(db, current_user.id)
    return {"message": "All notifications marked as read"}
