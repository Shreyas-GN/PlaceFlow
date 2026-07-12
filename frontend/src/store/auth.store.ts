import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProjectItem {
  name: string;
  description: string;
  link: string;
}

export interface CertificationItem {
  name: string;
  issuer: string;
  year: string;
}

export interface User {
  id: string;
  full_name: string;
  email: string;
  department: string;
  cgpa: number;
  created_at: string;
  profile_complete: boolean;
  roll_number?: string;
  degree?: string;
  current_semester?: number;
  graduation_year?: number;
  active_backlogs?: number;
  historical_backlogs?: number;
  tenth_percentage?: number;
  twelfth_percentage?: number;
  alternative_email?: string;
  whatsapp_number?: string;
  parent_contact?: string;
  resume_url?: string;
  linkedin_url?: string;
  github_url?: string;
  // V2 enrichment
  skills?: string[];
  projects?: ProjectItem[];
  certifications?: CertificationItem[];
  placement_eligible?: boolean;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  login: (token: string) => void;
  logout: () => void;
  setUser: (user: User) => void;
  setHasHydrated: (v: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      _hasHydrated: false,
      login: (token) => set({ token, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
      setUser: (user) => set({ user }),
      setHasHydrated: (v) => set({ _hasHydrated: v }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
