import api from "@/lib/api";
import type { ProjectItem, CertificationItem } from "@/store/auth.store";

export interface OnboardingPayload {
  roll_number: string;
  degree: string;
  current_semester: number;
  graduation_year: number;
  active_backlogs: number;
  historical_backlogs: number;
  tenth_percentage: number;
  twelfth_percentage: number;
  whatsapp_number: string;
  parent_contact: string;
  alternative_email?: string;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
}

export interface ProfileUpdatePayload {
  whatsapp_number?: string;
  parent_contact?: string;
  alternative_email?: string;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  skills?: string[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
}

export const studentService = {
  async submitOnboarding(data: OnboardingPayload) {
    const response = await api.post("/students/onboarding", data);
    return response.data;
  },

  async updateProfile(data: ProfileUpdatePayload) {
    const response = await api.put("/students/profile", data);
    return response.data;
  },
};
