from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.schemas.announcement import AnnouncementCreate, AnnouncementUpdate, AnnouncementResponse
from app.services.announcement_service import AnnouncementService
from app.services.auth_service import AuthService, get_db
from app.services.admin_service import AdminService
from app.models.student import Student
from app.models.admin import Admin

router = APIRouter(prefix="/announcements", tags=["announcements"])


# ── Admin endpoints ──────────────────────────────────────────────────────────

@router.post("/", response_model=AnnouncementResponse)
def create_announcement(
    data: AnnouncementCreate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin),
):
    return AnnouncementService.create_announcement(db, data, current_admin)


@router.get("/admin/all")
def admin_list_announcements(
    category: Optional[str] = Query(None),
    priority: Optional[str] = Query(None),
    active_only: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return AnnouncementService.get_all_announcements(db, category, priority, active_only, skip, limit)


@router.get("/admin/{announcement_id}", response_model=AnnouncementResponse)
def admin_get_announcement(
    announcement_id: str,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return AnnouncementService.get_announcement(db, announcement_id)


@router.put("/{announcement_id}", response_model=AnnouncementResponse)
def update_announcement(
    announcement_id: str,
    data: AnnouncementUpdate,
    db: Session = Depends(get_db),
    current_admin: Admin = Depends(AdminService.get_current_admin),
):
    return AnnouncementService.update_announcement(db, announcement_id, data, current_admin)


@router.delete("/{announcement_id}")
def delete_announcement(
    announcement_id: str,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    AnnouncementService.delete_announcement(db, announcement_id)
    return {"detail": "Announcement deleted"}


# ── Student endpoints ────────────────────────────────────────────────────────

@router.get("/", response_model=List[AnnouncementResponse])
def get_active_announcements(
    db: Session = Depends(get_db),
    _current_user: Student = Depends(AuthService.get_current_user),
):
    return AnnouncementService.get_active_announcements(db)
