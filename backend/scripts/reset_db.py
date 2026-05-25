from sqlalchemy import text
from app.db.session import SessionLocal, engine
from app.db.base_class import Base
from app.models.admin import Admin
from app.models.student import Student
from app.models.company import Company
from app.models.application import Application
from app.core.security import get_password_hash

def reset_database():
    db = SessionLocal()
    try:
        print("Clearing all data...")
        # Disable foreign key checks for truncation or truncate in order
        db.execute(text("TRUNCATE TABLE applications CASCADE"))
        db.execute(text("TRUNCATE TABLE companies CASCADE"))
        db.execute(text("TRUNCATE TABLE students CASCADE"))
        db.execute(text("TRUNCATE TABLE admins CASCADE"))
        db.commit()
        print("All data cleared.")

        # Recreate the requested admin account
        print("Recreating admin account...")
        admin = Admin(
            full_name="Shreyas Admin",
            email="shreyasgn11@outlook.com",
            password_hash=get_password_hash("passtheword"),
            role="admin"
        )
        db.add(admin)
        db.commit()
        print("Admin account shreyasgn11@outlook.com created.")
        print("Website platform is now fresh.")
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
