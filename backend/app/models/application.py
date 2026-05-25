import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base_class import Base

class Application(Base):
    __tablename__ = "applications"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id"), nullable=False)
    company_id = Column(UUID(as_uuid=True), ForeignKey("companies.id"), nullable=False)
    status = Column(String, default="Applied", nullable=False)
    applied_at = Column(DateTime(timezone=True), server_default=func.now())

    student = relationship("Student", back_populates="applications")
    company = relationship("Company", back_populates="applications")

    def __repr__(self):
        return f"<Application student={self.student_id} company={self.company_id}>"
