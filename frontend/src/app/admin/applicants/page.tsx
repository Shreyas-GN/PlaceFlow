"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  ChevronRight,
  AlertTriangle,
  X,
  CheckCircle,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/shared/Skeleton";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { getStatusColor, getStatusLabel } from "@/lib/status";
import { motion, AnimatePresence } from "framer-motion";
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

  useEffect(() => {
    loadApplications();
  }, []);

  const loadApplications = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllApplications();
      setApplications(data);
    } catch (error) {
      toast.error("Failed to load applicants");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await adminService.updateStatus(id, newStatus);
      toast.success(`Status updated to ${getStatusLabel(newStatus)}`);
      setApplications((prev: any[]) => 
        prev.map((app: any) => app.id === id ? { ...app, status: newStatus } : app)
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
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
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Applicant Tracking</h1>
          <p className="text-zinc-500 text-xs mt-0.5">Pipeline management for all active recruitment workflows.</p>
        </div>
        <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded flex items-center gap-1.5">
          <span className="text-[11px] font-medium text-primary tabular-nums">{filteredApplications.length} entries</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-600" />
          <input 
            type="text"
            placeholder="Search by student or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-layer-2 border border-zinc-800/60 rounded pl-9 pr-4 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all"
          />
        </div>
        <div>
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-layer-2 border border-zinc-800/60 rounded px-4 py-2 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all text-zinc-500 cursor-pointer hover:bg-layer-3"
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
          </select>
        </div>
      </div>

      {isLoading ? (
        <div className="space-y-0">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-3 py-2.5 border-b border-zinc-800/40">
              <Skeleton className="w-7 h-7 rounded shrink-0" />
              <Skeleton className="h-3.5 w-1/5" />
              <Skeleton className="h-3.5 w-1/6" />
              <Skeleton className="h-3.5 w-1/12 ml-auto" />
            </div>
          ))}
        </div>
      ) : filteredApplications.length === 0 ? (
        <div className="py-14 rounded border border-dashed border-zinc-800/60 bg-layer-2 text-center">
          <div className="w-10 h-10 bg-layer-3 rounded flex items-center justify-center mx-auto mb-3">
            <Users className="w-5 h-5 text-zinc-700" />
          </div>
          <p className="text-zinc-500 text-xs font-medium">No applicants match this filter</p>
          <p className="text-zinc-600 text-[11px] mt-0.5">Try adjusting your search or status filter.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-zinc-800/40">
                <th className="text-left text-[11px] text-zinc-600 font-medium pb-2 pr-4 w-[200px]">Candidate</th>
                <th className="text-left text-[11px] text-zinc-600 font-medium pb-2 pr-4 w-[150px]">Company</th>
                <th className="text-left text-[11px] text-zinc-600 font-medium pb-2 pr-4 w-[100px]">Date</th>
                <th className="text-left text-[11px] text-zinc-600 font-medium pb-2 pr-4">Status</th>
                <th className="text-right text-[11px] text-zinc-600 font-medium pb-2 w-[200px]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app: any) => (
                <tr 
                  key={app.id} 
                  className="border-b border-zinc-800/20 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded bg-primary/20 flex items-center justify-center text-primary font-semibold text-[11px] shrink-0">
                        {app.student?.full_name[0]}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-zinc-300 truncate">{app.student?.full_name}</p>
                        <p className="text-[11px] text-zinc-600">{app.student?.department} · {app.student?.cgpa} CGPA</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4">
                    <div className="flex items-center gap-2">
                      <CompanyLogo name={app.company?.company_name || "Company"} size="sm" />
                      <span className="text-sm text-zinc-500 truncate">{app.company?.company_name}</span>
                    </div>
                  </td>
                  <td className="py-2.5 pr-4 text-xs text-zinc-600">
                    <span title={format(new Date(app.applied_at), 'MMM dd, yyyy HH:mm')}>
                      {formatDistanceToNow(new Date(app.applied_at), { addSuffix: true })}
                    </span>
                  </td>
                  <td className="py-2.5 pr-4">
                    <span className={cn(
                      "px-2.5 py-0.5 rounded-full text-[11px] font-medium border",
                      getStatusColor(app.status),
                      app.status === "Eligibility_Conflict" && "ring-1 ring-inset ring-rose-500/30"
                    )}>
                      {getStatusLabel(app.status)}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <select 
                        className="bg-layer-3 border border-zinc-800/60 rounded px-2 py-1 text-[11px] font-medium focus:outline-none focus:ring-1 focus:ring-primary/50 text-zinc-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                        value={app.status}
                        onChange={(e) => showConsequence(app, e.target.value)}
                      >
                        {statuses.map(s => <option key={s} value={s}>{getStatusLabel(s)}</option>)}
                      </select>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Consequence confirmation modal for status changes */}
      <AnimatePresence>
        {pendingChange && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setPendingChange(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-sm bg-layer-2 border border-zinc-800/60 rounded-xl p-5 shadow-2xl"
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                  pendingChange.consequence.severity === "warning" ? "bg-rose-500/15 border-rose-500/20" : "bg-amber-500/15 border-amber-500/20"
                )}>
                  {pendingChange.consequence.severity === "warning" ? (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  ) : (
                    <CheckCircle className="w-4 h-4 text-amber-400" />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-zinc-200">
                    {pendingChange.consequence.label}: {pendingChange.app.student?.full_name}
                  </h3>
                  <p className="text-xs text-zinc-500 mt-1">{pendingChange.consequence.message}</p>
                  <p className="text-[11px] text-zinc-600 mt-1">
                    {pendingChange.app.company?.company_name} · Current: {getStatusLabel(pendingChange.app.status)} → {getStatusLabel(pendingChange.newStatus)}
                  </p>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <button
                  onClick={() => setPendingChange(null)}
                  className="flex-1 h-9 rounded text-xs font-medium border border-zinc-800/60 hover:bg-zinc-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleUpdateStatus(pendingChange.app.id, pendingChange.newStatus);
                    setPendingChange(null);
                  }}
                  className={cn(
                    "flex-1 h-9 rounded text-xs font-medium text-white transition-all flex items-center justify-center gap-1.5",
                    pendingChange.consequence.severity === "warning" ? "bg-rose-500 hover:bg-rose-600" : "bg-amber-500 hover:bg-amber-600"
                  )}
                >
                  Confirm {pendingChange.consequence.label}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
