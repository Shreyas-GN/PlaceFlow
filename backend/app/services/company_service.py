from sqlalchemy.orm import Session
from app.models.company import Company
from app.models.student import Student
from app.schemas.company import CompanyCreate

class CompanyService:
    @staticmethod
    def create_company(db: Session, company_in: CompanyCreate):
        db_company = Company(**company_in.model_dump())
        db.add(db_company)
        db.commit()
        db.refresh(db_company)
        return db_company

    @staticmethod
    def get_all_companies(db: Session):
        return db.query(Company).order_by(Company.deadline.asc()).all()

    @staticmethod
    def get_eligible_companies(db: Session, student: Student):
        # Operational logic: cgpa check and department check
        # Assuming eligible_departments is comma-separated string like "CSE,ISE,ECE"
        all_companies = db.query(Company).filter(Company.min_cgpa <= student.cgpa).all()
        
        eligible = []
        for company in all_companies:
            depts = [d.strip().upper() for d in company.eligible_departments.split(",")]
            if student.department.upper() in depts:
                eligible.append(company)
        
        return eligible
