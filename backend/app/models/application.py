import uuid
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
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

    # Phase 4 fields
    next_action = Column(String, nullable=True)
    recruiter_notes = Column(Text, nullable=True)

    student = relationship("Student", back_populates="applications")
    company = relationship("Company", back_populates="applications")
    status_history = relationship("ApplicationStatusHistory", back_populates="application", order_by="ApplicationStatusHistory.timestamp")

    def __repr__(self):
        return f"<Application student={self.student_id} company={self.company_id}>"


class ApplicationStatusHistory(Base):
    __tablename__ = "application_status_history"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    application_id = Column(UUID(as_uuid=True), ForeignKey("applications.id"), nullable=False)
    previous_status = Column(String, nullable=True)
    new_status = Column(String, nullable=False)
    changed_by = Column(String, nullable=False)  # actor name or "system"
    changed_by_role = Column(String, nullable=False, default="admin")  # admin | system
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    note = Column(Text, nullable=True)

    application = relationship("Application", back_populates="status_history")

    def __repr__(self):
        return f"<StatusHistory app={self.application_id} {self.previous_status}->{self.new_status}>"
