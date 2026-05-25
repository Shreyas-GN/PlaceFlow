import api from "@/lib/api";

export interface AdminUser {
  id: string;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

export const adminService = {
  async login(email: string, password: string) {
    const response = await api.post('/admin/login', { email, password });
    return response.data;
  },

  async register(data: { name: string; email: string; password: string }) {
    const response = await api.post('/admin/register', data);
    return response.data;
  },

  async getMe(token: string) {
    const response = await api.get('/admin/me', {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  async getAllApplications() {
    const response = await api.get('/applications/all');
    return response.data;
  },

  async updateStatus(applicationId: string, status: string) {
    const response = await api.patch(`/applications/${applicationId}/status`, { status });
    return response.data;
  },

  async createCompany(data: {
    company_name: string;
    role: string;
    package: string;
    min_cgpa: number;
    eligible_departments: string;
    deadline: string;
  }) {
    const response = await api.post('/companies/', data);
    return response.data;
  },

  async getAllCompanies() {
    const response = await api.get('/companies/');
    return response.data;
  },
};
