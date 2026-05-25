"use client";

import { useEffect, useState } from "react";
import { 
  Users, 
  Search, 
  Building2, 
  Filter,
  Clock,
  ChevronRight,
  ShieldCheck
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/shared/Skeleton";
import { cn } from "@/lib/utils";

export default function ApplicantsPage() {
  const [applications, setApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

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
      toast.success(`Status updated to ${newStatus}`);
      setApplications((prev: any) => 
        prev.map((app: any) => app.id === id ? { ...app, status: newStatus } : app)
      );
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const filteredApplications = applications.filter((app: any) => {
    const matchesSearch = 
      app.student?.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.company?.company_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || app.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statuses = ["Applied", "Shortlisted", "Interview", "Selected", "Rejected"];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Selected": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Rejected": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "Shortlisted": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Interview": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-white/5";
    }
  };

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex flex-col md:flex-row md:items-end justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Applicant Tracking</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Pipeline management for all active recruitment workflows.</p>
        </div>
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2"
        >
          <ShieldCheck className="w-4 h-4 text-primary" />
          <span className="text-xs font-semibold text-primary uppercase tracking-wider">{filteredApplications.length} Entries Found</span>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-col md:flex-row gap-3"
      >
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search by student or company name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-11 pr-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
        <div className="flex gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl px-6 py-3 text-xs font-semibold uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all text-zinc-500 cursor-pointer hover:bg-zinc-900"
          >
            <option value="All">All Statuses</option>
            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="bg-zinc-950 border border-zinc-800 rounded-2xl px-5 py-3 text-xs font-semibold uppercase tracking-wider flex items-center gap-2 hover:bg-zinc-900 transition-all text-zinc-500"
          >
            <Filter className="w-3.5 h-3.5" /> Filters
          </motion.button>
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden"
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-zinc-900/50">
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider border-b border-zinc-800">Candidate</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider border-b border-zinc-800">Company</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider border-b border-zinc-800 text-center">Date</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider border-b border-zinc-800">Status</th>
                <th className="px-6 py-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider border-b border-zinc-800 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800">
              {isLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="flex items-center gap-3"><Skeleton className="w-10 h-10 rounded-xl" /><div className="space-y-1.5"><Skeleton className="h-4 w-28" /><Skeleton className="h-3 w-36" /></div></div></td>
                    <td className="px-6 py-4"><Skeleton className="h-5 w-24" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-3 w-20 mx-auto" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-6 w-20 rounded-xl" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-8 w-28 ml-auto rounded-xl" /></td>
                  </tr>
                ))
              ) : filteredApplications.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-16 text-center">
                    <div className="w-14 h-14 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Users className="w-7 h-7 text-zinc-700" />
                    </div>
                    <p className="text-zinc-500 font-medium text-sm">No applicant signals detected.</p>
                    <p className="text-zinc-600 text-xs mt-1">Try adjusting your filters or search parameters.</p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence mode="popLayout">
                  {filteredApplications.map((app: any, index: number) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ delay: index * 0.02 }}
                      key={app.id} 
                      className="hover:bg-zinc-900/30 transition-colors group cursor-default"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <motion.div 
                            whileHover={{ scale: 1.05 }}
                            className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-transparent flex items-center justify-center text-primary font-semibold text-sm border border-zinc-800"
                          >
                            {app.student?.full_name[0]}
                          </motion.div>
                          <div>
                            <p className="font-medium text-sm text-zinc-300">{app.student?.full_name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-medium">{app.student?.department}</span>
                              <div className="w-1 h-1 rounded-full bg-zinc-800" />
                              <span className="text-[10px] text-primary uppercase tracking-wider font-medium">{app.student?.cgpa} CGPA</span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-lg bg-zinc-900 flex items-center justify-center border border-zinc-800">
                            <Building2 className="w-3.5 h-3.5 text-zinc-500" />
                          </div>
                          <span className="font-medium text-sm text-zinc-400">{app.company?.company_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="text-xs text-zinc-600 font-medium">{format(new Date(app.applied_at), 'MMM dd, yyyy')}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className={cn(
                          "inline-flex px-3 py-1.5 rounded-xl text-[10px] font-semibold tracking-wider uppercase border transition-all",
                          getStatusColor(app.status)
                        )}>
                          {app.status}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-all translate-x-1 group-hover:translate-x-0">
                          <select 
                            className="bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-[10px] font-semibold uppercase tracking-wider focus:outline-none focus:ring-1 focus:ring-primary/50 text-zinc-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                            value={app.status}
                            onChange={(e) => handleUpdateStatus(app.id, e.target.value)}
                          >
                            {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                          </select>
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 bg-zinc-900 rounded-xl border border-zinc-800 text-zinc-600 hover:text-zinc-300 transition-colors"
                          >
                            <ChevronRight className="w-3.5 h-3.5" />
                          </motion.button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>

      <div className="flex items-center justify-center py-4">
        <div className="flex items-center gap-2 text-zinc-700 font-medium text-[10px] uppercase tracking-[0.3em]">
          <Clock className="w-3 h-3" />
          Global Workforce Manager
        </div>
      </div>
    </div>
  );
}
