import api from "@/lib/api";

export interface Application {
  id: string;
  student_id: string;
  company_id: string;
  status: string;
  applied_at: string;
  company?: any;
}

export const applicationService = {
  async applyToCompany(companyId: string) {
    const response = await api.post('/applications/', { company_id: companyId });
    return response.data;
  },

  async getApplications() {
    const response = await api.get('/applications/');
    return response.data;
  },

  async getApplication(id: string) {
    const response = await api.get(`/applications/${id}`);
    return response.data;
  },
};
