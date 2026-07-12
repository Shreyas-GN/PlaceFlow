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
    ctc?: string;
    description?: string;
    hiring_process?: string;
    required_skills?: string;
    location?: string;
    company_type?: string;
  }) {
    const response = await api.post('/companies/', data);
    return response.data;
  },

  async getAllCompanies() {
    const response = await api.get('/companies/');
    return response.data;
  },

  async updateCompany(id: string, data: {
    company_name?: string;
    role?: string;
    package?: string;
    min_cgpa?: number;
    eligible_departments?: string;
    deadline?: string;
    ctc?: string;
    description?: string;
    hiring_process?: string;
    required_skills?: string;
    location?: string;
    company_type?: string;
  }) {
    const response = await api.put(`/companies/${id}`, data);
    return response.data;
  },

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await api.put('/admin/me/password', {
      current_password: currentPassword,
      new_password: newPassword
    });
    return response.data;
  },

  async closeDrive(companyId: string) {
    const response = await api.post(`/companies/${companyId}/close`);
    return response.data;
  },

  async archiveDrive(companyId: string) {
    const response = await api.post(`/companies/${companyId}/archive`);
    return response.data;
  },

  async duplicateDrive(companyId: string, newDeadline: string) {
    const response = await api.post(`/companies/${companyId}/duplicate`, { new_deadline: newDeadline });
    return response.data;
  },

  async getDriveCloseConsequences(companyId: string) {
    const response = await api.get(`/companies/${companyId}/close-consequences`);
    return response.data;
  },
};
