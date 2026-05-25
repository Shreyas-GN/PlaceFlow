from app.db.session import SessionLocal
from app.models.admin import Admin
from app.core.security import get_password_hash

def create_initial_admin():
    db = SessionLocal()
    try:
        email = "shreyasgn11@outlook.com"
        password = "passtheword"
        
        # Check if exists
        existing = db.query(Admin).filter(Admin.email == email).first()
        if existing:
            print(f"Admin {email} already exists. Updating password...")
            existing.password_hash = get_password_hash(password)
        else:
            admin = Admin(
                full_name="Shreyas Admin",
                email=email,
                password_hash=get_password_hash(password),
                role="admin"
            )
            db.add(admin)
        
        db.commit()
        print("Done. Admin account set successfully.")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    create_initial_admin()
