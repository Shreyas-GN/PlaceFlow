from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional, List

from app.models.announcement import Announcement
from app.models.student import Student
from app.models.admin import Admin
from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate, VALID_CATEGORIES, VALID_PRIORITIES
from app.services.notification_service import NotificationService
from app.schemas.notification import NotificationCreate


class AnnouncementService:

    @staticmethod
    def create_announcement(db: Session, data: AnnouncementCreate, admin: Admin) -> Announcement:
        if data.category not in VALID_CATEGORIES:
            raise HTTPException(status_code=422, detail=f"Invalid category. Must be one of: {VALID_CATEGORIES}")
        if data.priority not in VALID_PRIORITIES:
            raise HTTPException(status_code=422, detail=f"Invalid priority. Must be one of: {VALID_PRIORITIES}")

        announcement = Announcement(
            title=data.title,
            content=data.content,
            category=data.category,
            priority=data.priority,
            active=data.active,
            created_by=admin.full_name,
        )
        db.add(announcement)
        db.flush()

        if data.active:
            AnnouncementService._notify_all_students(db, announcement)

        db.commit()
        db.refresh(announcement)
        return announcement

    @staticmethod
    def _notify_all_students(db: Session, announcement: Announcement) -> None:
        students = db.query(Student).all()
        priority_prefix = {
            "Normal": "",
            "Important": "[Important] ",
            "Urgent": "[Urgent] ",
        }.get(announcement.priority, "")
        for student in students:
            NotificationService.create_notification(db, NotificationCreate(
                user_id=student.id,
                title=f"{priority_prefix}{announcement.title}",
                message=announcement.content[:200],
            ))

    @staticmethod
    def update_announcement(db: Session, announcement_id: str, data: AnnouncementUpdate, admin: Admin) -> Announcement:
        announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
        if not announcement:
            raise HTTPException(status_code=404, detail="Announcement not found")

        update_data = data.model_dump(exclude_unset=True)

        if "category" in update_data and update_data["category"] not in VALID_CATEGORIES:
            raise HTTPException(status_code=422, detail=f"Invalid category")
        if "priority" in update_data and update_data["priority"] not in VALID_PRIORITIES:
            raise HTTPException(status_code=422, detail=f"Invalid priority")

        was_inactive = not announcement.active
        for field, value in update_data.items():
            setattr(announcement, field, value)

        # If it just became active, send notifications
        if was_inactive and announcement.active:
            AnnouncementService._notify_all_students(db, announcement)

        db.commit()
        db.refresh(announcement)
        return announcement

    @staticmethod
    def delete_announcement(db: Session, announcement_id: str) -> None:
        announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
        if not announcement:
            raise HTTPException(status_code=404, detail="Announcement not found")
        db.delete(announcement)
        db.commit()

    @staticmethod
    def get_announcement(db: Session, announcement_id: str) -> Announcement:
        announcement = db.query(Announcement).filter(Announcement.id == announcement_id).first()
        if not announcement:
            raise HTTPException(status_code=404, detail="Announcement not found")
        return announcement

    @staticmethod
    def get_all_announcements(
        db: Session,
        category: Optional[str] = None,
        priority: Optional[str] = None,
        active_only: bool = False,
        skip: int = 0,
        limit: int = 50,
    ) -> dict:
        q = db.query(Announcement)
        if category:
            q = q.filter(Announcement.category == category)
        if priority:
            q = q.filter(Announcement.priority == priority)
        if active_only:
            q = q.filter(Announcement.active == True)
        total = q.count()
        items = q.order_by(Announcement.created_at.desc()).offset(skip).limit(limit).all()
        return {"total": total, "items": items, "skip": skip, "limit": limit}

    @staticmethod
    def get_active_announcements(db: Session) -> List[Announcement]:
        return (
            db.query(Announcement)
            .filter(Announcement.active == True)
            .order_by(
                Announcement.priority.desc(),
                Announcement.created_at.desc(),
            )
            .all()
        )
