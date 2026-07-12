from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session
from typing import Optional
import csv
import io

from app.schemas.report import ReportResponse, CompanyReport, BranchReport, PlacementSummary
from app.services.report_service import ReportService
from app.services.auth_service import get_db
from app.services.admin_service import AdminService
from app.models.admin import Admin

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/", response_model=ReportResponse)
def get_full_report(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return ReportService.get_full_report(db)


@router.get("/summary", response_model=PlacementSummary)
def get_summary(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return ReportService.get_summary(db)


@router.get("/companies")
def get_company_report(
    company_id: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return ReportService.get_company_report(db, company_id)


@router.get("/branches")
def get_branch_report(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    return ReportService.get_branch_report(db)


@router.get("/export/companies/csv")
def export_company_report_csv(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    data = ReportService.get_company_report(db)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Company", "Role", "Package", "Total Applications", "Shortlisted", "Offers", "Rejected"])
    for r in data:
        writer.writerow([r.company_name, r.role, r.package, r.total_applications, r.shortlisted, r.offers, r.rejected])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=company_report.csv"},
    )


@router.get("/export/branches/csv")
def export_branch_report_csv(
    db: Session = Depends(get_db),
    _admin: Admin = Depends(AdminService.get_current_admin),
):
    data = ReportService.get_branch_report(db)
    output = io.StringIO()
    writer = csv.writer(output)
    writer.writerow(["Department", "Total Students", "Applied", "Placed", "Placement %", "Avg CGPA"])
    for r in data:
        writer.writerow([r.department, r.total_students, r.applied, r.placed, r.placement_percentage, r.average_cgpa or ""])
    output.seek(0)
    return StreamingResponse(
        iter([output.getvalue()]),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=branch_report.csv"},
    )
