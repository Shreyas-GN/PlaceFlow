import api from "@/lib/api";

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export const notificationService = {
  async getNotifications() {
    const response = await api.get<Notification[]>('/notifications/');
    return response.data;
  },

  async markAsRead(id: string) {
    const response = await api.patch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  async markAllAsRead() {
    const response = await api.post('/notifications/read-all');
    return response.data;
  }
};
