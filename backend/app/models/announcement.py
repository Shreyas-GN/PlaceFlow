import uuid
from sqlalchemy import Column, String, Text, Boolean, DateTime
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base_class import Base


class Announcement(Base):
    __tablename__ = "announcements"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String, nullable=False, default="Notice")  # Drive | Update | Deadline | Notice
    priority = Column(String, nullable=False, default="Normal")  # Normal | Important | Urgent
    created_by = Column(String, nullable=False)  # admin name
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    active = Column(Boolean, nullable=False, default=True, server_default="true")

    def __repr__(self):
        return f"<Announcement {self.title} [{self.category}]>"
