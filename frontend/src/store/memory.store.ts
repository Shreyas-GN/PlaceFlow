import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface RecentActivity {
  id: string;
  type: "viewed_applicant" | "opened_drive" | "viewed_application" | "search" | "filter_applied";
  label: string;
  path: string;
  timestamp: number;
}

export interface SavedFilter {
  id: string;
  name: string;
  query: Record<string, string>;
  createdAt: number;
}

interface MemoryState {
  recentActivities: RecentActivity[];
  lastOpenedDriveId: string | null;
  lastOpenedDriveName: string | null;
  recentlyViewedApplicants: string[];
  savedFilters: SavedFilter[];
  /* Actions */
  addActivity: (activity: Omit<RecentActivity, "id" | "timestamp">) => void;
  setLastDrive: (id: string, name: string) => void;
  addViewedApplicant: (applicantId: string) => void;
  addSavedFilter: (filter: Omit<SavedFilter, "id" | "createdAt">) => void;
  removeSavedFilter: (id: string) => void;
  clearMemory: () => void;
}

export const useMemoryStore = create<MemoryState>()(
  persist(
    (set, get) => ({
      recentActivities: [],
      lastOpenedDriveId: null,
      lastOpenedDriveName: null,
      recentlyViewedApplicants: [],
      savedFilters: [],

      addActivity: (activity) => {
        const { recentActivities } = get();
        set({
          recentActivities: [
            { ...activity, id: crypto.randomUUID(), timestamp: Date.now() },
            ...recentActivities.slice(0, 19),
          ],
        });
      },

      setLastDrive: (id, name) => {
        set({ lastOpenedDriveId: id, lastOpenedDriveName: name });
      },

      addViewedApplicant: (applicantId) => {
        const { recentlyViewedApplicants } = get();
        set({
          recentlyViewedApplicants: [
            applicantId,
            ...recentlyViewedApplicants.filter((id) => id !== applicantId),
          ].slice(0, 10),
        });
      },

      addSavedFilter: (filter) => {
        const { savedFilters } = get();
        set({
          savedFilters: [
            { ...filter, id: crypto.randomUUID(), createdAt: Date.now() },
            ...savedFilters.slice(0, 9),
          ],
        });
      },

      removeSavedFilter: (id) => {
        const { savedFilters } = get();
        set({ savedFilters: savedFilters.filter((f) => f.id !== id) });
      },

      clearMemory: () => {
        set({
          recentActivities: [],
          lastOpenedDriveId: null,
          lastOpenedDriveName: null,
          recentlyViewedApplicants: [],
          savedFilters: [],
        });
      },
    }),
    {
      name: "placeflow-memory",
      partialize: (state) => ({
        lastOpenedDriveId: state.lastOpenedDriveId,
        lastOpenedDriveName: state.lastOpenedDriveName,
        recentlyViewedApplicants: state.recentlyViewedApplicants,
        savedFilters: state.savedFilters,
      }),
    }
  )
);
