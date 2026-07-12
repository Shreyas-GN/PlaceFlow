import api from "@/lib/api";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  category: "Drive" | "Update" | "Deadline" | "Notice";
  priority: "Normal" | "Important" | "Urgent";
  created_by: string;
  created_at: string;
  updated_at: string;
  active: boolean;
}

export interface AnnouncementCreate {
  title: string;
  content: string;
  category: string;
  priority: string;
  active?: boolean;
}

export const announcementService = {
  async getActive(): Promise<Announcement[]> {
    const res = await api.get("/announcements/");
    return res.data;
  },

  async adminList(params?: { category?: string; priority?: string; active_only?: boolean; skip?: number; limit?: number }) {
    const res = await api.get("/announcements/admin/all", { params });
    return res.data;
  },

  async create(data: AnnouncementCreate): Promise<Announcement> {
    const res = await api.post("/announcements/", data);
    return res.data;
  },

  async update(id: string, data: Partial<AnnouncementCreate>): Promise<Announcement> {
    const res = await api.put(`/announcements/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/announcements/${id}`);
  },
};
