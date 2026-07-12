import uuid
from sqlalchemy import Column, String, Float, Integer, Boolean, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from app.db.base_class import Base

class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    department = Column(String, nullable=False)
    cgpa = Column(Float, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Extended profile fields
    roll_number = Column(String, unique=True, index=True, nullable=True)
    degree = Column(String, nullable=True)
    current_semester = Column(Integer, nullable=True)
    graduation_year = Column(Integer, nullable=True)
    active_backlogs = Column(Integer, server_default="0", nullable=True)
    historical_backlogs = Column(Integer, server_default="0", nullable=True)
    tenth_percentage = Column(Float, nullable=True)
    twelfth_percentage = Column(Float, nullable=True)
    alternative_email = Column(String, nullable=True)
    whatsapp_number = Column(String, nullable=True)
    parent_contact = Column(String, nullable=True)
    resume_url = Column(String, nullable=True)
    linkedin_url = Column(String, nullable=True)
    github_url = Column(String, nullable=True)
    profile_complete = Column(Boolean, server_default="false", nullable=False, default=False)

    # V2 profile enrichment
    skills = Column(JSON, nullable=True)          # list[str]
    projects = Column(JSON, nullable=True)        # list[{name, description, link}]
    certifications = Column(JSON, nullable=True)  # list[{name, issuer, year}]
    placement_eligible = Column(Boolean, nullable=True)

    applications = relationship("Application", back_populates="student")

    def __repr__(self):
        return f"<Student {self.email}>"
