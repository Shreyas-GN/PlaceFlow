import api from "@/lib/api";

export interface PlacementSummary {
  total_students: number;
  total_applied: number;
  total_placed: number;
  total_offers: number;
  placement_percentage: number;
  average_package: string | null;
  total_companies: number;
  active_drives: number;
}

export interface CompanyReport {
  company_id: string;
  company_name: string;
  role: string;
  package: string;
  total_applications: number;
  shortlisted: number;
  offers: number;
  rejected: number;
}

export interface BranchReport {
  department: string;
  total_students: number;
  applied: number;
  placed: number;
  placement_percentage: number;
  average_cgpa: number | null;
}

export const reportService = {
  async getFullReport() {
    const res = await api.get("/reports/");
    return res.data;
  },

  async getSummary(): Promise<PlacementSummary> {
    const res = await api.get("/reports/summary");
    return res.data;
  },

  async getCompanyReport(company_id?: string): Promise<CompanyReport[]> {
    const res = await api.get("/reports/companies", { params: { company_id } });
    return res.data;
  },

  async getBranchReport(): Promise<BranchReport[]> {
    const res = await api.get("/reports/branches");
    return res.data;
  },

  downloadCompanyCsv() {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/reports/export/companies/csv`, "_blank");
  },

  downloadBranchCsv() {
    window.open(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"}/reports/export/branches/csv`, "_blank");
  },
};
