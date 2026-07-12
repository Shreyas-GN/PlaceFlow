from sqlalchemy.orm import Session
from fastapi import HTTPException
from typing import Optional
from datetime import datetime

from app.models.calendar_event import CalendarEvent
from app.models.admin import Admin
from app.schemas.calendar_event import CalendarEventCreate, CalendarEventUpdate, VALID_EVENT_TYPES


class CalendarService:

    @staticmethod
    def create_event(db: Session, data: CalendarEventCreate, admin: Admin) -> CalendarEvent:
        if data.event_type not in VALID_EVENT_TYPES:
            raise HTTPException(status_code=422, detail=f"Invalid event_type. Must be one of: {VALID_EVENT_TYPES}")
        if data.end_time and data.end_time < data.start_time:
            raise HTTPException(status_code=422, detail="end_time must be after start_time")

        event = CalendarEvent(
            title=data.title,
            description=data.description,
            event_type=data.event_type,
            start_time=data.start_time,
            end_time=data.end_time,
            company_id=data.company_id,
            created_by=admin.full_name,
        )
        db.add(event)
        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def update_event(db: Session, event_id: str, data: CalendarEventUpdate) -> CalendarEvent:
        event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")

        update_data = data.model_dump(exclude_unset=True)
        if "event_type" in update_data and update_data["event_type"] not in VALID_EVENT_TYPES:
            raise HTTPException(status_code=422, detail=f"Invalid event_type")

        for field, value in update_data.items():
            setattr(event, field, value)

        db.commit()
        db.refresh(event)
        return event

    @staticmethod
    def delete_event(db: Session, event_id: str) -> None:
        event = db.query(CalendarEvent).filter(CalendarEvent.id == event_id).first()
        if not event:
            raise HTTPException(status_code=404, detail="Event not found")
        db.delete(event)
        db.commit()

    @staticmethod
    def list_events(
        db: Session,
        event_type: Optional[str] = None,
        from_date: Optional[datetime] = None,
        to_date: Optional[datetime] = None,
        company_id: Optional[str] = None,
    ) -> list[CalendarEvent]:
        q = db.query(CalendarEvent)
        if event_type:
            q = q.filter(CalendarEvent.event_type == event_type)
        if from_date:
            q = q.filter(CalendarEvent.start_time >= from_date)
        if to_date:
            q = q.filter(CalendarEvent.start_time <= to_date)
        if company_id:
            q = q.filter(CalendarEvent.company_id == company_id)
        return q.order_by(CalendarEvent.start_time.asc()).all()
