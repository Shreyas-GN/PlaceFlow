import api from "@/lib/api";

export interface AuditLogEntry {
  id: string;
  actor_id: string;
  actor_name: string;
  actor_role: string;
  action: string;
  resource_type: string;
  resource_id: string | null;
  details: string | null;
  created_at: string;
}

export interface AuditLogResponse {
  logs: AuditLogEntry[];
  total: number;
}

export const auditService = {
  async getLogs(params?: {
    limit?: number;
    offset?: number;
    resource_type?: string;
    action?: string;
    actor_role?: string;
  }) {
    const response = await api.get<AuditLogResponse>("/audit-logs/", { params });
    return response.data;
  },
};
