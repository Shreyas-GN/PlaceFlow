"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  Users, 
  Building2, 
  CheckCircle2, 
  Clock, 
  ArrowUpRight,
  Plus,
  ShieldCheck,
  Zap
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/shared/Skeleton";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalApplicants: 0,
    activeDrives: 0,
    selectedStudents: 0,
    pendingReviews: 0
  });
  const [recentApplications, setRecentApplications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [apps, companies] = await Promise.all([
        adminService.getAllApplications(),
        adminService.getAllCompanies()
      ]);

      setRecentApplications(apps.slice(0, 5));
      
      setStats({
        totalApplicants: apps.length,
        activeDrives: companies.length,
        selectedStudents: apps.filter((a: any) => a.status === "Selected").length,
        pendingReviews: apps.filter((a: any) => a.status === "Applied").length
      });
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { label: "Total Applicants", value: stats.totalApplicants, icon: Users, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "Active Drives", value: stats.activeDrives, icon: Building2, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Placements", value: stats.selectedStudents, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { label: "Pending Reviews", value: stats.pendingReviews, icon: Clock, color: "text-orange-500", bg: "bg-orange-500/10" },
  ];

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
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Admin Console</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Powering the next generation of placement workflows.</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-primary/30 transition-all group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowUpRight className="w-4 h-4 text-primary" />
            </div>
            <div className="flex items-center justify-between mb-4">
              <motion.div 
                whileHover={{ scale: 1.1 }}
                className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center transition-transform group-hover:scale-110`}
              >
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </motion.div>
            </div>
            <div>
              <p className="text-zinc-500 text-[10px] font-semibold uppercase tracking-wider mb-1">{stat.label}</p>
              <div className="text-2xl font-bold tracking-tight">
                {isLoading ? <Skeleton className="h-7 w-16" /> : stat.value}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="lg:col-span-2 rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden"
        >
          <div className="p-5 border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-primary" />
              <h2 className="text-base font-semibold tracking-tight">Pending Approval</h2>
            </div>
            <Link href="/admin/applicants" className="text-primary text-[10px] font-semibold uppercase tracking-wider hover:underline">Full Report</Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-zinc-900/50">
                  <th className="px-5 py-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Applicant</th>
                  <th className="px-5 py-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Target Entity</th>
                  <th className="px-5 py-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Submission</th>
                  <th className="px-5 py-4 text-[10px] font-semibold text-zinc-600 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800">
                {isLoading ? (
                  [...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="px-5 py-4"><Skeleton className="h-8 w-36" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-3 w-16" /></td>
                      <td className="px-5 py-4"><Skeleton className="h-6 w-16 rounded-full" /></td>
                    </tr>
                  ))
                ) : recentApplications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-16 text-center">
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 bg-zinc-900 rounded-2xl flex items-center justify-center mb-3">
                          <Users className="w-6 h-6 text-zinc-700" />
                        </div>
                        <p className="text-zinc-600 text-sm font-medium">No pending applications</p>
                        <p className="text-zinc-700 text-xs mt-1">All applicants have been processed.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  <AnimatePresence>
                    {recentApplications.map((app: any, index: number) => (
                      <motion.tr 
                        key={app.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: index * 0.03 }}
                        className="hover:bg-zinc-900/30 transition-colors group cursor-default"
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center text-primary text-xs font-semibold">
                              {app.student?.full_name?.[0]}
                            </div>
                            <div>
                              <p className="font-medium text-sm text-zinc-300">{app.student?.full_name}</p>
                              <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">{app.student?.department}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-medium text-sm text-zinc-400">{app.company?.company_name}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs text-zinc-600">{format(new Date(app.applied_at), 'MMM dd, HH:mm')}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-3 py-1 rounded-xl text-[10px] font-semibold uppercase tracking-wider border transition-all ${getStatusColor(app.status)}`}>
                            {app.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.01 }}
            className="bg-gradient-to-br from-primary via-purple-600 to-zinc-950 rounded-2xl p-[1px] group"
          >
            <div className="bg-zinc-950 rounded-[calc(1rem-1px)] p-6 h-full relative overflow-hidden">
               <div className="absolute -top-12 -right-12 w-32 h-32 bg-primary/30 blur-[50px] group-hover:scale-150 transition-transform duration-700" />
               <Zap className="w-10 h-10 text-primary mb-6" />
               <h2 className="text-xl font-bold tracking-tight mb-2">Initialize Drive</h2>
               <p className="text-zinc-500 mb-6 text-sm leading-relaxed">Onboard new placement entities into the ecosystem.</p>
               <Link href="/admin/companies" className="w-full bg-white text-black h-12 rounded-2xl font-medium flex items-center justify-center gap-2 text-sm hover:scale-[1.02] active:scale-[0.98] transition-all">
                 <Plus className="w-4 h-4" />
                 Launch Environment
               </Link>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"
          >
            <h3 className="text-xs font-semibold uppercase tracking-wider text-zinc-600 mb-5 pb-3 border-b border-zinc-800">Operational Directives</h3>
            <ul className="space-y-4">
              {[
                "Neutralize pending approvals",
                "Execute interview scheduling",
                "Generate eligibility audits",
                "Finalize placement offers"
              ].map((text, i) => (
                <motion.li 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                  className="flex items-center gap-3 text-sm font-medium text-zinc-500 group"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors" />
                  {text}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
