import api from "@/lib/api";

export interface SearchStudent {
  id: string;
  full_name: string;
  email: string;
  department: string;
  cgpa: number;
}

export interface SearchCompany {
  id: string;
  company_name: string;
  role: string;
  package: string;
  status: string;
  deadline: string;
}

export interface SearchApplication {
  id: string;
  student_name: string;
  student_email: string;
  company_name: string;
  status: string;
  applied_at: string;
}

export interface SearchResponse {
  students: SearchStudent[];
  companies: SearchCompany[];
  applications: SearchApplication[];
  total: number;
}

export const searchService = {
  async search(q: string, limit: number = 5) {
    const response = await api.get<SearchResponse>("/search/", {
      params: { q, limit },
    });
    return response.data;
  },
};
