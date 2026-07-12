from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.schemas.placement_settings import PlacementSettingsUpdate, PlacementSettingsResponse
from app.services.placement_settings_service import PlacementSettingsService
from app.services.auth_service import get_db
from app.services.admin_service import AdminService
from app.models.admin import Admin

router = APIRouter(prefix="/settings/placement", tags=["placement-settings"])


@router.get("/", response_model=PlacementSettingsResponse)
def get_settings(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return PlacementSettingsService.get_or_create(db)


@router.put("/", response_model=PlacementSettingsResponse)
def update_settings(
    data: PlacementSettingsUpdate,
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return PlacementSettingsService.update(db, data)
