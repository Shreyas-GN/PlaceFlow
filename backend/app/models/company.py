import uuid
from sqlalchemy import Column, String, Float, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base_class import Base

class Company(Base):
    __tablename__ = "companies"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    company_name = Column(String, nullable=False)
    role = Column(String, nullable=False)
    package = Column(String, nullable=False)
    min_cgpa = Column(Float, nullable=False)
    eligible_departments = Column(Text, nullable=False)
    deadline = Column(DateTime(timezone=True), nullable=False)
    status = Column(String, default="active", nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    applications = relationship("Application", back_populates="company")

    def __repr__(self):
        return f"<Company {self.company_name} - {self.role}>"
