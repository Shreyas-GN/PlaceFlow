from sqlalchemy.orm import Session
from app.models.notification import Notification
from app.schemas.notification import NotificationCreate
from uuid import UUID

class NotificationService:
    @staticmethod
    def create_notification(db: Session, notification_in: NotificationCreate):
        db_notification = Notification(
            user_id=notification_in.user_id,
            title=notification_in.title,
            message=notification_in.message
        )
        db.add(db_notification)
        db.commit()
        db.refresh(db_notification)
        return db_notification

    @staticmethod
    def get_user_notifications(db: Session, user_id: UUID):
        return db.query(Notification)\
            .filter(Notification.user_id == user_id)\
            .order_by(Notification.created_at.desc())\
            .all()

    @staticmethod
    def mark_notification_read(db: Session, notification_id: UUID, user_id: UUID):
        notification = db.query(Notification)\
            .filter(Notification.id == notification_id, Notification.user_id == user_id)\
            .first()
        if notification:
            notification.is_read = True
            db.commit()
            db.refresh(notification)
        return notification

    @staticmethod
    def mark_all_as_read(db: Session, user_id: UUID):
        db.query(Notification)\
            .filter(Notification.user_id == user_id, Notification.is_read == False)\
            .update({Notification.is_read: True}, synchronize_session=False)
        db.commit()
        return True
