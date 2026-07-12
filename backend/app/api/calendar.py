from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import Optional
from datetime import datetime

from app.schemas.calendar_event import CalendarEventCreate, CalendarEventUpdate, CalendarEventResponse
from app.services.calendar_service import CalendarService
from app.services.auth_service import AuthService, get_db
from app.services.admin_service import AdminService
from app.models.student import Student
from app.models.admin import Admin

router = APIRouter(prefix="/calendar", tags=["calendar"])


@router.get("/", response_model=list[CalendarEventResponse])
def list_events(
    event_type: Optional[str] = Query(None),
    from_date: Optional[datetime] = Query(None),
    to_date: Optional[datetime] = Query(None),
    company_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _user: Student = Depends(AuthService.get_current_user),
):
    return CalendarService.list_events(db, event_type, from_date, to_date, company_id)


@router.get("/admin", response_model=list[CalendarEventResponse])
def admin_list_events(
    event_type: Optional[str] = Query(None),
    from_date: Optional[datetime] = Query(None),
    to_date: Optional[datetime] = Query(None),
    company_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return CalendarService.list_events(db, event_type, from_date, to_date, company_id)


@router.post("/", response_model=CalendarEventResponse)
def create_event(
    data: CalendarEventCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin),
):
    return CalendarService.create_event(db, data, current_admin)


@router.put("/{event_id}", response_model=CalendarEventResponse)
def update_event(
    event_id: str,
    data: CalendarEventUpdate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return CalendarService.update_event(db, event_id, data)


@router.delete("/{event_id}")
def delete_event(
    event_id: str,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    CalendarService.delete_event(db, event_id)
    return {"detail": "Event deleted"}
