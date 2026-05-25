import api from "@/lib/api";

export interface Company {
  id: string;
  company_name: string;
  role: string;
  package: string;
  min_cgpa: number;
  eligible_departments: string;
  deadline: string;
  created_at: string;
}

export const companyService = {
  async getCompanies() {
    const response = await api.get('/companies/');
    return response.data;
  },

  async getEligibleCompanies() {
    const response = await api.get('/companies/eligible');
    return response.data;
  },
};
