import uuid
from sqlalchemy import Column, String, Float, Boolean, Integer, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base_class import Base


class PlacementSettings(Base):
    __tablename__ = "placement_settings"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    season_name = Column(String, nullable=False, default="Placement Season 2025-26")
    season_active = Column(Boolean, nullable=False, default=True, server_default="true")
    allowed_branches = Column(Text, nullable=True)  # comma-separated
    default_min_cgpa = Column(Float, nullable=False, default=6.0)
    max_backlogs_allowed = Column(Integer, nullable=False, default=0)
    placement_coordinator_name = Column(String, nullable=True)
    placement_coordinator_email = Column(String, nullable=True)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    def __repr__(self):
        return f"<PlacementSettings {self.season_name}>"
