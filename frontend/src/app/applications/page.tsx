"use client";

import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { applicationService, Application } from "@/services/application.service";
import { toast } from "sonner";
import { format } from "date-fns";
import { CheckCircle2, Clock, Briefcase, Building2, Filter, X, DollarSign, GraduationCap, Calendar, Users } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { TableSkeleton } from "@/components/shared/Skeleton";

const getStatusBadge = (status: string) => {
  switch (status.toLowerCase()) {
    case 'applied':
      return <span className="px-3 py-1 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-xs font-semibold">Applied</span>;
    case 'shortlisted':
      return <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold">Shortlisted</span>;
    case 'rejected':
      return <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 text-xs font-semibold">Rejected</span>;
    case 'selected':
      return <span className="px-3 py-1 rounded-full bg-emerald-500 text-white text-xs font-semibold">Selected</span>;
    default:
      return <span className="px-3 py-1 rounded-full bg-zinc-800 text-zinc-500 text-xs font-semibold">{status}</span>;
  }
};

export default function ApplicationsPage() {
  const searchParams = useSearchParams();
  const statusFilter = searchParams.get("status");
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  const filtered = useMemo(() => {
    if (!statusFilter) return applications;
    return applications.filter(a => a.status.toLowerCase() === statusFilter.toLowerCase());
  }, [applications, statusFilter]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-bold tracking-tight">Your Applications</h1>
          <p className="text-zinc-500 mt-1 text-sm">
            {statusFilter ? `Showing ${statusFilter.toLowerCase()} applications` : "Track your recruitment journey in real-time."}
          </p>
        </motion.div>

        {statusFilter && (
          <motion.a
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            href="/applications"
            className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
          >
            <Filter className="w-3 h-3" /> Clear filter
          </motion.a>
        )}

        {isLoading ? (
          <div className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800">
            <TableSkeleton rows={4} />
          </div>
        ) : applications.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-16 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 text-center"
          >
            <Clock className="w-10 h-10 text-zinc-700 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400">No applications yet</h3>
            <p className="text-zinc-600 mt-1 text-sm max-w-sm">
                Explore eligible companies and kickstart your recruitment process today.
            </p>
          </motion.div>
        ) : filtered.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center p-16 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950 text-center"
          >
            <Filter className="w-10 h-10 text-zinc-700 mb-4" />
            <h3 className="text-lg font-semibold text-zinc-400">No {statusFilter?.toLowerCase()} applications</h3>
            <p className="text-zinc-600 mt-1 text-sm max-w-sm">
              No applications match this filter.
            </p>
          </motion.div>
        ) : (
          <div className="grid gap-3">
            <AnimatePresence>
              {filtered.map((app, index) => (
                <motion.div 
                  key={app.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ scale: 1.005, borderColor: "rgba(124, 58, 237, 0.3)" }}
                  className="group flex flex-col md:flex-row items-center justify-between p-4 rounded-2xl bg-zinc-950 border border-zinc-800 transition-all"
                >
                  <div className="flex items-center gap-4 w-full md:w-auto">
                    <motion.div 
                      whileHover={{ rotate: 10 }}
                      className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center"
                    >
                      <Building2 className="w-5 h-5 text-zinc-500" />
                    </motion.div>
                    <div>
                      <h3 className="font-medium text-sm cursor-pointer hover:text-zinc-200 transition-colors" onClick={() => setSelectedCompany(app.company)}>{app.company?.company_name || "Company"}</h3>
                      <p className="text-zinc-500 text-xs flex items-center gap-1.5 mt-0.5">
                        <Briefcase className="w-3 h-3" />
                        {app.company?.role || "Software Engineer"}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-6 mt-3 md:mt-0 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-600 uppercase mb-0.5 font-medium">Applied Date</p>
                      <p className="text-xs text-zinc-400">{format(new Date(app.applied_at), "MMM d, yyyy")}</p>
                    </div>
                    
                    <div className="min-w-[100px] flex justify-end">
                      {getStatusBadge(app.status)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <AnimatePresence>
        {selectedCompany && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setSelectedCompany(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-md p-6 rounded-2xl bg-zinc-950 border border-zinc-800 shadow-2xl"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelectedCompany(null)} className="absolute top-4 right-4 p-1 rounded-lg hover:bg-zinc-800 transition-colors">
                <X className="w-4 h-4 text-zinc-500" />
              </button>

              <div className="flex items-center gap-3 mb-5">
                <div className="w-10 h-10 rounded-xl bg-zinc-900 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-zinc-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">{selectedCompany.company_name}</h2>
                  <p className="text-sm text-zinc-500">{selectedCompany.role}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <DollarSign className="w-4 h-4" />
                    <span>Package</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{selectedCompany.package}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <GraduationCap className="w-4 h-4" />
                    <span>Min CGPA</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{selectedCompany.min_cgpa}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Users className="w-4 h-4" />
                    <span>Departments</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{selectedCompany.eligible_departments}</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-zinc-900">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <Calendar className="w-4 h-4" />
                    <span>Deadline</span>
                  </div>
                  <span className="text-sm font-medium text-zinc-200">{format(new Date(selectedCompany.deadline), "MMM d, yyyy")}</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}
