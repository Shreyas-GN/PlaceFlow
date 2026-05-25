"""Seed the database with realistic demo data for PlaceFlow."""

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from datetime import datetime, timezone, timedelta
from app.db.session import SessionLocal
from app.core.security import get_password_hash
from app.models.student import Student
from app.models.admin import Admin
from app.models.company import Company
from app.models.application import Application
from app.models.notification import Notification


COMPANIES = [
    {
        "company_name": "Google",
        "role": "Software Engineer",
        "package": "24 LPA",
        "min_cgpa": 8.0,
        "eligible_departments": "CSE,ISE,ECE",
        "deadline_days": 14,
    },
    {
        "company_name": "Amazon",
        "role": "SDE-1",
        "package": "20 LPA",
        "min_cgpa": 7.0,
        "eligible_departments": "CSE,ISE,ECE,EEE",
        "deadline_days": 10,
    },
    {
        "company_name": "Microsoft",
        "role": "Software Development Engineer",
        "package": "26 LPA",
        "min_cgpa": 8.5,
        "eligible_departments": "CSE,ISE",
        "deadline_days": 21,
    },
    {
        "company_name": "Atlassian",
        "role": "Frontend Engineer",
        "package": "18 LPA",
        "min_cgpa": 7.5,
        "eligible_departments": "CSE,ISE,ECE",
        "deadline_days": 7,
    },
    {
        "company_name": "Adobe",
        "role": "Software Engineer",
        "package": "22 LPA",
        "min_cgpa": 8.0,
        "eligible_departments": "CSE,ISE",
        "deadline_days": 18,
    },
    {
        "company_name": "Goldman Sachs",
        "role": "Software Analyst",
        "package": "16 LPA",
        "min_cgpa": 7.0,
        "eligible_departments": "CSE,ISE,ECE,EEE",
        "deadline_days": 5,
    },
    {
        "company_name": "Flipkart",
        "role": "Software Developer",
        "package": "15 LPA",
        "min_cgpa": 6.5,
        "eligible_departments": "CSE,ISE,ECE",
        "deadline_days": 12,
    },
    {
        "company_name": "NVIDIA",
        "role": "GPU Software Engineer",
        "package": "28 LPA",
        "min_cgpa": 8.5,
        "eligible_departments": "CSE,ECE",
        "deadline_days": 25,
    },
    {
        "company_name": "Uber",
        "role": "Backend Engineer",
        "package": "21 LPA",
        "min_cgpa": 7.5,
        "eligible_departments": "CSE,ISE",
        "deadline_days": 9,
    },
    {
        "company_name": "Intel",
        "role": "Hardware Engineer",
        "package": "14 LPA",
        "min_cgpa": 7.0,
        "eligible_departments": "ECE,EEE",
        "deadline_days": 30,
    },
]


APPLICATIONS_DATA = [
    {
        "company_index": 0,
        "status": "Interview",
        "days_ago": 12,
    },
    {
        "company_index": 1,
        "status": "Shortlisted",
        "days_ago": 8,
    },
    {
        "company_index": 2,
        "status": "Applied",
        "days_ago": 5,
    },
    {
        "company_index": 3,
        "status": "Applied",
        "days_ago": 2,
    },
]


NOTIFICATION_TEMPLATES = [
    {
        "days_ago": 13,
        "title": "Application Submitted",
        "message": "Your application to Google has been received and is under review.",
    },
    {
        "days_ago": 10,
        "title": "Status Update: Shortlisted",
        "message": "Congratulations! You have been shortlisted for Amazon SDE-1.",
    },
    {
        "days_ago": 6,
        "title": "Interview Scheduled",
        "message": "Google has scheduled an interview for the Software Engineer role.",
    },
    {
        "days_ago": 3,
        "title": "Status Update: Shortlisted",
        "message": "You have been shortlisted for Microsoft SDE role.",
    },
    {
        "days_ago": 1,
        "title": "New Opportunity Available",
        "message": "A new placement drive from Atlassian is now open for applications.",
    },
]


def seed():
    db = SessionLocal()
    try:
        print("Seeding PlaceFlow database...")

        existing_student = db.query(Student).filter(Student.email == "demo@student.edu").first()
        if existing_student:
            print("Demo data already exists. Skipping.")
            return

        print("Creating demo student...")
        student = Student(
            full_name="Arjun Mehta",
            email="demo@student.edu",
            password_hash=get_password_hash("demo1234"),
            department="CSE",
            cgpa=8.7,
        )
        db.add(student)
        db.flush()

        print("Creating demo admin...")
        admin = Admin(
            full_name="Priya Sharma",
            email="admin@placeflow.io",
            password_hash=get_password_hash("admin1234"),
            role="admin",
        )
        db.add(admin)
        db.flush()

        now = datetime.now(timezone.utc)

        print("Creating companies...")
        company_records = []
        for c in COMPANIES:
            company = Company(
                company_name=c["company_name"],
                role=c["role"],
                package=c["package"],
                min_cgpa=c["min_cgpa"],
                eligible_departments=c["eligible_departments"],
                deadline=now + timedelta(days=c["deadline_days"]),
            )
            db.add(company)
            db.flush()
            company_records.append(company)
            print(f"  - {c['company_name']}: {c['role']}, {c['package']}")

        print("Creating applications...")
        for a in APPLICATIONS_DATA:
            application = Application(
                student_id=student.id,
                company_id=company_records[a["company_index"]].id,
                status=a["status"],
                applied_at=now - timedelta(days=a["days_ago"]),
            )
            db.add(application)
            print(f"  - {COMPANIES[a['company_index']]['company_name']}: {a['status']}")

        print("Creating notifications...")
        for n in NOTIFICATION_TEMPLATES:
            notification = Notification(
                user_id=student.id,
                title=n["title"],
                message=n["message"],
                created_at=now - timedelta(days=n["days_ago"]),
            )
            db.add(notification)
            print(f"  - {n['title']}")

        db.commit()
        print("\nSeeding complete!")
        print(f"\nDemo credentials:")
        print(f"  Student: demo@student.edu / demo1234")
        print(f"  Admin:   admin@placeflow.io / admin1234")

    except Exception as e:
        db.rollback()
        print(f"Error during seeding: {e}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
