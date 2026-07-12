import api from "@/lib/api";

export interface CalendarEvent {
  id: string;
  title: string;
  description: string | null;
  event_type: "Interview" | "OA" | "Deadline" | "CompanyVisit" | "Notice";
  start_time: string;
  end_time: string | null;
  company_id: string | null;
  created_by: string;
  created_at: string;
}

export interface CalendarEventCreate {
  title: string;
  description?: string;
  event_type: string;
  start_time: string;
  end_time?: string;
  company_id?: string;
}

export const calendarService = {
  async listEvents(params?: { event_type?: string; from_date?: string; to_date?: string; company_id?: string }): Promise<CalendarEvent[]> {
    const res = await api.get("/calendar/", { params });
    return res.data;
  },

  async adminListEvents(params?: { event_type?: string; from_date?: string; to_date?: string }): Promise<CalendarEvent[]> {
    const res = await api.get("/calendar/admin", { params });
    return res.data;
  },

  async create(data: CalendarEventCreate): Promise<CalendarEvent> {
    const res = await api.post("/calendar/", data);
    return res.data;
  },

  async update(id: string, data: Partial<CalendarEventCreate>): Promise<CalendarEvent> {
    const res = await api.put(`/calendar/${id}`, data);
    return res.data;
  },

  async delete(id: string): Promise<void> {
    await api.delete(`/calendar/${id}`);
  },
};
