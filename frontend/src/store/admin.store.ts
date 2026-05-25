import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  role: string;
}

interface AdminAuthState {
  admin: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
  setAdmin: (admin: AdminUser) => void;
  setToken: (token: string) => void;
  logout: () => void;
}

export const useAdminStore = create<AdminAuthState>()(
  persist(
    (set) => ({
      admin: null,
      token: null,
      isAuthenticated: false,
      setAdmin: (admin) => set({ admin, isAuthenticated: true }),
      setToken: (token) => set({ token }),
      logout: () => set({ admin: null, token: null, isAuthenticated: false }),
    }),
    { name: "admin-auth-storage" }
  )
);
