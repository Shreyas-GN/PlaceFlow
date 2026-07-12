"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Search,
  Shield,
  Building2,
  FileText,
  RefreshCw,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { auditService, AuditLogEntry } from "@/services/audit.service";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils";

const ACTION_LABELS: Record<string, string> = {
  create: "Created",
  update: "Updated",
  close_drive: "Closed Drive",
  eligibility_update: "Eligibility Updated",
  propagate_eligibility: "Eligibility Propagated",
  update_status: "Status Changed",
  apply: "Applied",
};

const RESOURCE_ICONS: Record<string, typeof Shield> = {
  drive: Building2,
  application: FileText,
};

const ACTION_COLORS: Record<string, string> = {
  create: "text-emerald-700 bg-emerald-50 border-emerald-200",
  update: "text-blue-700 bg-blue-50 border-blue-200",
  close_drive: "text-red-700 bg-red-50 border-red-200",
  eligibility_update: "text-amber-700 bg-amber-50 border-amber-200",
  propagate_eligibility: "text-violet-700 bg-violet-50 border-violet-200",
  update_status: "text-cyan-700 bg-cyan-50 border-cyan-200",
  apply: "text-indigo-700 bg-indigo-50 border-indigo-200",
};

export default function AuditLogPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [actionFilter, setActionFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = 50;

  useEffect(() => {
    loadLogs();
  }, [actionFilter, roleFilter, page]);

  const loadLogs = async () => {
    setIsLoading(true);
    try {
      const params: Record<string, string | number> = { limit: pageSize, offset: page * pageSize };
      if (actionFilter !== "all") params.action = actionFilter;
      if (roleFilter !== "all") params.actor_role = roleFilter;
      const data = await auditService.getLogs(params);
      setLogs(data.logs);
      setTotal(data.total);
    } catch {
      toast.error("Failed to load audit logs");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = useMemo(() => {
    if (!searchQuery) return logs;
    const q = searchQuery.toLowerCase();
    return logs.filter(
      (l) =>
        l.actor_name.toLowerCase().includes(q) ||
        l.details?.toLowerCase().includes(q) ||
        l.action.toLowerCase().includes(q) ||
        l.resource_type.toLowerCase().includes(q)
    );
  }, [logs, searchQuery]);

  const actions = [
    "all", "create", "update", "close_drive",
    "eligibility_update", "propagate_eligibility", "update_status", "apply",
  ];

  const totalPages = Math.ceil(total / pageSize);
  const INPUT_CLS = "bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Audit Trail</h1>
          <p className="text-gray-500 text-xs mt-0.5">
            Institutional activity log — <span className="text-gray-700 font-medium tabular-nums">{total}</span> total entries
          </p>
        </div>
        <button
          onClick={() => { setPage(0); loadLogs(); }}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-300 rounded-[10px] text-xs text-gray-500 hover:text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
          Refresh
        </button>
      </div>

      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 relative min-w-48">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by actor, details, or action..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${INPUT_CLS} pl-9`}
          />
        </div>
        <select
          value={actionFilter}
          onChange={(e) => { setActionFilter(e.target.value); setPage(0); }}
          className={`${INPUT_CLS} cursor-pointer`}
        >
          {actions.map((a) => (
            <option key={a} value={a}>
              {a === "all" ? "All Actions" : ACTION_LABELS[a] || a}
            </option>
          ))}
        </select>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(0); }}
          className={`${INPUT_CLS} cursor-pointer`}
        >
          <option value="all">All Roles</option>
          <option value="admin">Admin</option>
          <option value="student">Student</option>
        </select>
        <div className="text-xs text-gray-400 tabular-nums">
          Page {page + 1} of {totalPages || 1}
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-1">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5 border-b border-gray-100">
              <Skeleton className="w-6 h-6 rounded shrink-0" />
              <Skeleton className="h-3 w-1/6" />
              <Skeleton className="h-3 w-1/4" />
              <Skeleton className="h-3 w-1/3 ml-auto" />
            </div>
          ))}
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="py-14 rounded-xl border border-dashed border-gray-200 bg-gray-50 text-center">
          <div className="w-10 h-10 bg-white border border-gray-200 rounded-lg flex items-center justify-center mx-auto mb-3">
            <Shield className="w-5 h-5 text-gray-300" />
          </div>
          <p className="text-gray-500 text-xs font-medium">No audit log entries found</p>
          <p className="text-gray-400 text-[11px] mt-0.5">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-100">
            {filteredLogs.map((log) => {
              const isExpanded = expandedId === log.id;
              const Icon = RESOURCE_ICONS[log.resource_type] || Shield;
              const actionColor = ACTION_COLORS[log.action] || "text-gray-600 bg-gray-50 border-gray-200";

              return (
                <div key={log.id}>
                  <button
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className={cn("w-6 h-6 rounded flex items-center justify-center shrink-0 border", actionColor)}>
                      <Icon className="w-3 h-3" />
                    </div>
                    <div className="flex items-center gap-2 min-w-[120px]">
                      <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-[9px] font-semibold text-gray-500 shrink-0">
                        {log.actor_name[0]}
                      </div>
                      <span className="text-xs text-gray-900 font-medium truncate">{log.actor_name}</span>
                      <span className={cn(
                        "text-[10px] px-1.5 py-0.5 rounded font-medium border",
                        log.actor_role === "admin"
                          ? "text-orange-700 bg-orange-50 border-orange-200"
                          : "text-blue-700 bg-blue-50 border-blue-200"
                      )}>
                        {log.actor_role}
                      </span>
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full border font-medium", actionColor)}>
                      {ACTION_LABELS[log.action] || log.action}
                    </span>
                    <span className="text-xs text-gray-500 flex-1 truncate hidden sm:block">
                      {log.resource_type} {log.details ? `— ${log.details.slice(0, 80)}` : ""}
                    </span>
                    <span
                      className="text-[11px] text-gray-400 shrink-0 hidden md:block"
                      title={format(new Date(log.created_at), "MMM dd, yyyy HH:mm")}
                    >
                      {formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}
                    </span>
                    {isExpanded
                      ? <ChevronUp className="w-3 h-3 text-gray-300 shrink-0" />
                      : <ChevronDown className="w-3 h-3 text-gray-300 shrink-0" />
                    }
                  </button>
                  {isExpanded && (
                    <div className="px-4 pb-3 pt-0 bg-gray-50 border-t border-gray-100">
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Actor</span>
                          <p className="text-xs text-gray-900 mt-0.5">{log.actor_name}</p>
                          <p className="text-[11px] text-gray-400">{log.actor_role}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Action</span>
                          <p className="text-xs text-gray-900 mt-0.5">{ACTION_LABELS[log.action] || log.action}</p>
                          <p className="text-[11px] text-gray-400">{log.resource_type}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Resource ID</span>
                          <p className="text-xs text-gray-900 mt-0.5 font-mono">{log.resource_id || "—"}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Timestamp</span>
                          <p className="text-xs text-gray-900 mt-0.5">{format(new Date(log.created_at), "MMM dd, yyyy HH:mm:ss")}</p>
                          <p className="text-[11px] text-gray-400">{formatDistanceToNow(new Date(log.created_at), { addSuffix: true })}</p>
                        </div>
                      </div>
                      {log.details && (
                        <div className="mt-2 pt-2 border-t border-gray-100">
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Details</span>
                          <p className="text-xs text-gray-600 mt-0.5">{log.details}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100">
              <span className="text-[11px] text-gray-400">
                Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total}
              </span>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors rounded"
                >
                  Previous
                </button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setPage(i)}
                    className={cn(
                      "w-7 h-7 text-xs rounded transition-colors",
                      page === i ? "bg-blue-50 text-blue-700 font-medium" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
                    )}
                  >
                    {i + 1}
                  </button>
                ))}
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="px-3 py-1 text-xs text-gray-500 hover:text-gray-700 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors rounded"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
