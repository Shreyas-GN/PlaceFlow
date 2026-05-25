"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { applicationService, Application } from "@/services/application.service";
import { toast } from "sonner";
import { format } from "date-fns";
import { Briefcase, Filter, DollarSign, GraduationCap, Calendar, Users, X, Building2 } from "lucide-react";
import { TableSkeleton } from "@/components/shared/Skeleton";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { getStatusColor } from "@/lib/status";

export default function ApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const FILTERS = ["All", "Applied", "Shortlisted", "Interview", "Rejected", "Selected"];

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await applicationService.getApplications();
        setApplications(data);
      } catch (error) {
        toast.error("Failed to load applications");
      } finally {
        setIsLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: applications.length };
    for (const app of applications) {
      const key = app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [applications]);

  const filtered = useMemo(() => {
    if (!statusFilter || statusFilter === "All") return applications;
    return applications.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase());
  }, [applications, statusFilter]);

  const getFilterColor = (status: string) => {
    switch (status) {
      case "All": return "data-[active=true]:bg-zinc-100 data-[active=true]:text-zinc-900";
      case "Applied": return "data-[active=true]:bg-blue-500/15 data-[active=true]:text-blue-400 data-[active=true]:border-blue-500/30";
      case "Shortlisted": return "data-[active=true]:bg-emerald-500/15 data-[active=true]:text-emerald-400 data-[active=true]:border-emerald-500/30";
      case "Interview": return "data-[active=true]:bg-amber-500/15 data-[active=true]:text-amber-400 data-[active=true]:border-amber-500/30";
      case "Rejected": return "data-[active=true]:bg-red-500/15 data-[active=true]:text-red-400 data-[active=true]:border-red-500/30";
      case "Selected": return "data-[active=true]:bg-emerald-500/25 data-[active=true]:text-emerald-300 data-[active=true]:border-emerald-400/40";
      default: return "";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Your Applications</h1>
          <p className="text-zinc-500 mt-0.5 text-xs">
            {statusFilter && statusFilter !== "All" ? `Showing ${statusFilter.toLowerCase()} applications` : "Track your recruitment journey in real-time."}
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {FILTERS.map(status => (
            <button
              key={status}
              data-active={(!statusFilter || statusFilter === "All") ? status === "All" : status.toLowerCase() === statusFilter.toLowerCase()}
              onClick={() => {
                const params = new URLSearchParams(searchParams.toString());
                if (status === "All") {
                  params.delete("status");
                } else {
                  params.set("status", status.toLowerCase());
                }
                const qs = params.toString();
                router.push(qs ? `/applications?${qs}` : "/applications");
              }}
              className={`px-3 py-1 rounded text-xs font-medium border border-zinc-800/60 transition-all hover:bg-zinc-900 ${getFilterColor(status)}`}
            >
              {status}
              {statusCounts[status] !== undefined && (
                <span className="ml-1 opacity-60">({statusCounts[status]})</span>
              )}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="rounded border border-zinc-800/60 bg-layer-2">
            <TableSkeleton rows={4} />
          </div>
        ) : applications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 rounded border border-dashed border-zinc-800/60 bg-layer-2 text-center">
            <Briefcase className="w-8 h-8 text-zinc-700 mb-3" />
            <h3 className="text-sm font-medium text-zinc-400">No applications yet</h3>
            <p className="text-zinc-600 mt-0.5 text-xs max-w-sm">
                Start your placement journey by applying to companies that match your profile and CGPA.
            </p>
            <button
              onClick={() => router.push("/companies")}
              className="mt-4 h-9 px-4 rounded bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all"
            >
              Browse Companies
            </button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 rounded border border-dashed border-zinc-800/60 bg-layer-2 text-center">
            <Filter className="w-8 h-8 text-zinc-700 mb-3" />
            <h3 className="text-sm font-medium text-zinc-400">No {statusFilter?.toLowerCase()} applications</h3>
            <p className="text-zinc-600 mt-0.5 text-xs max-w-sm">
              No applications match this filter. Try a different status to see more results.
            </p>
            <button
              onClick={() => router.push("/applications")}
              className="mt-4 h-9 px-4 rounded bg-zinc-800 text-zinc-300 text-xs font-medium hover:bg-zinc-700 transition-all"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-zinc-800/40">
                  <th className="text-left text-[11px] text-zinc-600 font-medium pb-2 pr-4">Company</th>
                  <th className="text-left text-[11px] text-zinc-600 font-medium pb-2 pr-4">Role</th>
                  <th className="text-left text-[11px] text-zinc-600 font-medium pb-2 pr-4">Applied</th>
                  <th className="text-right text-[11px] text-zinc-600 font-medium pb-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => (
                  <tr 
                    key={app.id}
                    className="border-b border-zinc-800/20 hover:bg-white/[0.02] transition-colors cursor-pointer"
                    onClick={() => setSelectedCompany(app.company)}
                  >
                    <td className="py-2.5 pr-4">
                      <div className="flex items-center gap-2.5">
                        <CompanyLogo name={app.company?.company_name || "Company"} size="sm" />
                        <span className="text-sm text-zinc-300">{app.company?.company_name}</span>
                      </div>
                    </td>
                    <td className="py-2.5 pr-4 text-sm text-zinc-500">{app.company?.role}</td>
                    <td className="py-2.5 pr-4 text-xs text-zinc-600">{format(new Date(app.applied_at), "MMM d, yyyy")}</td>
                    <td className="py-2.5 text-right">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${getStatusColor(app.status)}`}>
                        {app.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {selectedCompany && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setSelectedCompany(null)}
        >
          <div
            className="relative w-full max-w-md p-5 rounded-lg bg-layer-2 border border-zinc-800/60 shadow-elevated"
            onClick={e => e.stopPropagation()}
          >
            <button onClick={() => setSelectedCompany(null)} className="absolute top-3 right-3 p-1 rounded hover:bg-zinc-800 transition-colors">
              <X className="w-3.5 h-3.5 text-zinc-500" />
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="w-9 h-9 rounded bg-zinc-900 flex items-center justify-center">
                <Building2 className="w-4 h-4 text-zinc-400" />
              </div>
              <div>
                <h2 className="text-sm font-medium">{selectedCompany.company_name}</h2>
                <p className="text-xs text-zinc-500">{selectedCompany.role}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span>Package</span>
                </div>
                <span className="font-medium text-zinc-300">{selectedCompany.package}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Min CGPA</span>
                </div>
                <span className="font-medium text-zinc-300">{selectedCompany.min_cgpa}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Users className="w-3.5 h-3.5" />
                  <span>Departments</span>
                </div>
                <span className="font-medium text-zinc-300">{selectedCompany.eligible_departments}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-zinc-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Deadline</span>
                </div>
                <span className="font-medium text-zinc-300">{format(new Date(selectedCompany.deadline), "MMM d, yyyy")}</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
