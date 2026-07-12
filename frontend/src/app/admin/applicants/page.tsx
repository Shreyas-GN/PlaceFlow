"use client";

import { useEffect, useState } from "react";
import { Users, Search, AlertTriangle, CheckCircle, X } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/shared/Skeleton";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { getStatusColor, getStatusLabel } from "@/lib/status";
import { cn } from "@/lib/utils";

const STATUS_TRANSITION_CONSEQUENCES: Record<string, Record<string, { label: string; severity: "info" | "warning" | "success"; message: string }>> = {
  Applied: {
    Shortlisted: { label: "Shortlist", severity: "success", message: "Student will be notified and moved to screening pipeline" },
    Rejected: { label: "Reject", severity: "warning", message: "Student will be notified of rejection and removed from pipeline" },
  },
  Shortlisted: {
    Interview: { label: "Move to Interview", severity: "success", message: "Interview will be scheduled; student notified" },
    Rejected: { label: "Reject", severity: "warning", message: "Student removed from pipeline after shortlist stage" },
  },
  Interview: {
    Selected: { label: "Select", severity: "success", message: "Offer will be extended; congratulations email sent" },
    Rejected: { label: "Reject", severity: "warning", message: "Student notified after interview stage" },
  },
  Rejected: {
    Shortlisted: { label: "Reinstate", severity: "info", message: "Student reinstated despite previous rejection" },
  },
};

export default function ApplicantsPage() {
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [pendingChange, setPendingChange] = useState<{ app: any; newStatus: string; consequence: any } | null>(null);

  useEffect(() => { loadApplications(); }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllApplications();
      setApplications(data);
    } catch {
      toast.error("Failed to load applicants");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = (id: string, newStatus: string) => {
    const target = applications.find((a: any) => a.id === id);
    const previousStatus = target?.status;
    if (!previousStatus || previousStatus === newStatus) return;

    setApplications((prev: any[]) => prev.map((a: any) => (a.id === id ? { ...a, status: newStatus } : a)));

    const apiCall = adminService.updateStatus(id, newStatus);
    toast.success(`${target?.student?.full_name ?? "Applicant"} → ${getStatusLabel(newStatus)}`, {
      duration: 5000,
      action: {
        label: "Undo",
        onClick: () => {
          setApplications((prev: any[]) => prev.map((a: any) => (a.id === id ? { ...a, status: previousStatus } : a)));
          adminService.updateStatus(id, previousStatus).catch(() => {});
        },
      },
    });

    apiCall.catch(() => {
      setApplications((prev: any[]) => prev.map((a: any) => (a.id === id ? { ...a, status: previousStatus } : a)));
      toast.error("Failed to update status — reverted");
    });
  };

  const showConsequence = (app: any, newStatus: string) => {
    const consequences = STATUS_TRANSITION_CONSEQUENCES[app.status]?.[newStatus];
    if (consequences && consequences.severity === "warning") {
      setPendingChange({ app, newStatus, consequence: consequences });
    } else {
      handleUpdateStatus(app.id, newStatus);
    }
  };

  const filteredApplications = applications.filter((app: any) => {
    const matchesSearch =
      app.student?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company?.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statuses = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected", "Eligibility_Conflict"];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Applicant Tracking</h1>
          <p className="text-gray-500 text-sm mt-1">Manage all active recruitment workflows.</p>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
          <span className="text-xs font-medium text-blue-700 tabular-nums">{filteredApplications.length} entries</span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by student or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white border border-gray-300 rounded-[10px] pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-300 rounded-[10px] px-3 py-2.5 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-700 cursor-pointer"
        >
          <option value="All">All Statuses</option>
          {statuses.map((s) => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-5 py-3 border-b border-gray-100 last:border-0">
              <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-1/5 ml-auto" />
            </div>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="py-16 bg-white border border-dashed border-gray-200 rounded-xl text-center">
          <Users className="w-10 h-10 text-gray-300 mx-auto mb-3" />
          <p className="text-base font-medium text-gray-900">No applicants found</p>
          <p className="text-gray-500 text-sm mt-1">Try adjusting your search or status filter.</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-500 px-5 py-3 w-[220px]">Candidate</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-[160px]">Company</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 w-[110px]">Applied</th>
                  <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
                  <th className="text-right text-xs font-medium text-gray-500 px-5 py-3 w-[180px]">Update Status</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app: any) => (
                  <tr key={app.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm shrink-0">
                          {app.student?.full_name[0]}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{app.student?.full_name}</p>
                          <p className="text-xs text-gray-500">{app.student?.department} · {app.student?.cgpa} CGPA</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <CompanyLogo name={app.company?.company_name || "Company"} size="sm" />
                        <span className="text-sm text-gray-600 truncate">{app.company?.company_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-400">
                      <span title={format(new Date(app.applied_at), "MMM dd, yyyy HH:mm")}>
                        {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                        getStatusColor(app.status)
                      )}>
                        {getStatusLabel(app.status)}
                      </span>
                    </td>
                    <td className="py-3 px-5 text-right">
                      <select
                        className="bg-white border border-gray-300 rounded-lg px-2.5 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-gray-700 cursor-pointer transition-colors"
                        value={app.status}
                        onChange={(e) => showConsequence(app, e.target.value)}
                      >
                        {statuses.map((s) => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      {pendingChange && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setPendingChange(null)}
          />
          <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-2xl p-5 shadow-floating">
            <div className="flex items-start gap-3">
              <div className={cn(
                "w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border",
                pendingChange.consequence.severity === "warning" ? "bg-red-50 border-red-200" : "bg-amber-50 border-amber-200"
              )}>
                {pendingChange.consequence.severity === "warning" ? (
                  <AlertTriangle className="w-4 h-4 text-red-600" />
                ) : (
                  <CheckCircle className="w-4 h-4 text-amber-600" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900">
                  {pendingChange.consequence.label}: {pendingChange.app.student?.full_name}
                </h3>
                <p className="text-sm text-gray-500 mt-1">{pendingChange.consequence.message}</p>
                <p className="text-xs text-gray-400 mt-1">
                  {pendingChange.app.company?.company_name} · {getStatusLabel(pendingChange.app.status)} → {getStatusLabel(pendingChange.newStatus)}
                </p>
              </div>
              <button onClick={() => setPendingChange(null)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex gap-2 mt-5">
              <button
                onClick={() => setPendingChange(null)}
                className="flex-1 h-9 rounded-[10px] text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors text-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => { handleUpdateStatus(pendingChange.app.id, pendingChange.newStatus); setPendingChange(null); }}
                className={cn(
                  "flex-1 h-9 rounded-[10px] text-sm font-medium text-white transition-colors",
                  pendingChange.consequence.severity === "warning" ? "bg-red-600 hover:bg-red-700" : "bg-amber-600 hover:bg-amber-700"
                )}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
