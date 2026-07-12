from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import Optional

from app.models.application import Application
from app.models.company import Company
from app.models.student import Student
from app.schemas.report import (
    CompanyReport, BranchReport, PlacementSummary, ReportResponse,
)

PLACED_STATUSES = {"Offer", "Selected"}
APPLIED_STATUSES = {
    "Applied", "Shortlisted", "OA", "Interview", "HR",
    "Offer", "Selected", "Screening", "Technical",
}


class ReportService:

    @staticmethod
    def get_full_report(db: Session) -> ReportResponse:
        return ReportResponse(
            summary=ReportService.get_summary(db),
            by_company=ReportService.get_company_report(db),
            by_branch=ReportService.get_branch_report(db),
        )

    @staticmethod
    def get_summary(db: Session) -> PlacementSummary:
        total_students = db.query(Student).count()
        total_companies = db.query(Company).count()
        active_drives = db.query(Company).filter(Company.status == "active").count()

        applied_student_ids = (
            db.query(Application.student_id)
            .filter(Application.status.in_(APPLIED_STATUSES))
            .distinct()
            .all()
        )
        total_applied = len(applied_student_ids)

        placed_student_ids = (
            db.query(Application.student_id)
            .filter(Application.status.in_(PLACED_STATUSES))
            .distinct()
            .all()
        )
        total_placed = len(placed_student_ids)
        total_offers = (
            db.query(Application)
            .filter(Application.status.in_(PLACED_STATUSES))
            .count()
        )

        placement_pct = round((total_placed / total_students * 100), 2) if total_students else 0.0

        return PlacementSummary(
            total_students=total_students,
            total_applied=total_applied,
            total_placed=total_placed,
            total_offers=total_offers,
            placement_percentage=placement_pct,
            total_companies=total_companies,
            active_drives=active_drives,
        )

    @staticmethod
    def get_company_report(db: Session, company_id: Optional[str] = None) -> list[CompanyReport]:
        companies = db.query(Company)
        if company_id:
            companies = companies.filter(Company.id == company_id)
        companies = companies.all()

        reports = []
        for company in companies:
            apps = db.query(Application).filter(Application.company_id == company.id).all()
            reports.append(CompanyReport(
                company_id=str(company.id),
                company_name=company.company_name,
                role=company.role,
                package=company.package,
                total_applications=len(apps),
                shortlisted=sum(1 for a in apps if a.status == "Shortlisted"),
                offers=sum(1 for a in apps if a.status in PLACED_STATUSES),
                rejected=sum(1 for a in apps if a.status == "Rejected"),
            ))
        return sorted(reports, key=lambda r: r.total_applications, reverse=True)

    @staticmethod
    def get_branch_report(db: Session) -> list[BranchReport]:
        departments = db.query(Student.department).distinct().all()
        reports = []

        for (dept,) in departments:
            students = db.query(Student).filter(Student.department == dept).all()
            student_ids = [s.id for s in students]
            total = len(students)

            avg_cgpa = (
                db.query(func.avg(Student.cgpa))
                .filter(Student.department == dept)
                .scalar()
            )

            applied_ids = (
                db.query(Application.student_id)
                .filter(
                    Application.student_id.in_(student_ids),
                    Application.status.in_(APPLIED_STATUSES),
                )
                .distinct()
                .all()
            )
            applied_count = len(applied_ids)

            placed_ids = (
                db.query(Application.student_id)
                .filter(
                    Application.student_id.in_(student_ids),
                    Application.status.in_(PLACED_STATUSES),
                )
                .distinct()
                .all()
            )
            placed_count = len(placed_ids)

            placement_pct = round((placed_count / total * 100), 2) if total else 0.0
            avg_cgpa_val = round(float(avg_cgpa), 2) if avg_cgpa else None

            reports.append(BranchReport(
                department=dept,
                total_students=total,
                applied=applied_count,
                placed=placed_count,
                placement_percentage=placement_pct,
                average_cgpa=avg_cgpa_val,
            ))

        return sorted(reports, key=lambda r: r.placement_percentage, reverse=True)
