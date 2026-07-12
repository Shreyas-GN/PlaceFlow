from sqlalchemy.orm import Session
from app.models.placement_settings import PlacementSettings
from app.schemas.placement_settings import PlacementSettingsUpdate


class PlacementSettingsService:

    @staticmethod
    def get_or_create(db: Session) -> PlacementSettings:
        settings = db.query(PlacementSettings).first()
        if not settings:
            settings = PlacementSettings()
            db.add(settings)
            db.commit()
            db.refresh(settings)
        return settings

    @staticmethod
    def update(db: Session, data: PlacementSettingsUpdate) -> PlacementSettings:
        settings = PlacementSettingsService.get_or_create(db)
        update_data = data.model_dump(exclude_unset=True)
        for field, value in update_data.items():
            setattr(settings, field, value)
        db.commit()
        db.refresh(settings)
        return settings
