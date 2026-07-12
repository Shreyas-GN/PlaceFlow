import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
  created_at: string;
}

export interface Drive {
  id: string;
  company_name: string;
  role: string;
  package: string;
  min_cgpa: number;
  eligible_departments: string;
  deadline: string;
  created_at: string;
  status?: string;
  ctc?: string;
  description?: string;
  hiring_process?: string;
  required_skills?: string;
  location?: string;
  company_type?: string;
}

interface AdminAuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  _hasHydrated: boolean;
  drives: Drive[];
  setAdmin: (admin: AdminUser) => void;
  setToken: (token: string) => void;
  logout: () => void;
  setHasHydrated: (v: boolean) => void;
  setDrives: (drives: Drive[]) => void;
  optimisticAddDrive: (drive: Drive) => void;
  optimisticUpdateDrive: (id: string, patch: Partial<Drive>) => void;
}

export const useAdminStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      _hasHydrated: false,
      drives: [],
      setAdmin: (admin) => set({ admin, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ admin: null, token: null, isAuthenticated: false }),
      setHasHydrated: (v) => set({ _hasHydrated: v }),
      setDrives: (drives) => set({ drives }),
      optimisticAddDrive: (drive) => {
        const { drives } = get();
        set({ drives: [drive, ...drives] });
      },
      optimisticUpdateDrive: (id, patch) => {
        const { drives } = get();
        set({ drives: drives.map((d) => (d.id === id ? { ...d, ...patch } : d)) });
      },
    }),
    {
      name: "admin-auth-storage",
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
