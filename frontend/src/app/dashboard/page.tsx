"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Briefcase, Building2, TrendingUp, CheckCircle2, Clock, ArrowUpRight } from "lucide-react";
import { applicationService, Application } from "@/services/application.service";
import { companyService, Company } from "@/services/company.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/notification.store";
import { format, formatDistanceToNow } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const { notifications, fetchNotifications } = useNotificationStore();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [eligibleCompaniesCount, setEligibleCompaniesCount] = useState(0);
  const [eligibleCompanies, setEligibleCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [apps, companies] = await Promise.all([
        applicationService.getApplications(),
        companyService.getEligibleCompanies(),
        fetchNotifications()
      ]);
      setApplications(apps);
      setEligibleCompaniesCount(companies.length);
      setEligibleCompanies(companies);
    } catch (error) {
      toast.error("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const stats = [
    { name: "Total Applications", value: applications.length.toString(), icon: Briefcase, color: "text-blue-500", bg: "bg-blue-500/10", href: "/applications" },
    { name: "Eligible Companies", value: eligibleCompaniesCount.toString(), icon: Building2, color: "text-emerald-500", bg: "bg-emerald-500/10", href: "/companies" },
    { name: "Status: Shortlisted", value: applications.filter(a => a.status === "Shortlisted").length.toString(), icon: CheckCircle2, color: "text-purple-500", bg: "bg-purple-500/10", href: "/applications?status=shortlisted" },
    { name: "Status: Interview", value: applications.filter(a => a.status === "Interview").length.toString(), icon: Clock, color: "text-amber-500", bg: "bg-amber-500/10", href: "/applications?status=interview" },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "Selected": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
      case "Rejected": return "bg-rose-500/10 text-rose-500 border-rose-500/20";
      case "Shortlisted": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "Interview": return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      default: return "bg-slate-500/10 text-slate-400 border-white/5";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight mb-1">Welcome back, {user?.full_name?.split(' ')[0] || 'Student'}</h1>
            <p className="text-zinc-500 text-sm">Your placement journey at a glance.</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2 bg-zinc-950 border border-zinc-800 rounded-2xl px-4 py-2"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-sm font-medium text-zinc-400">Profile: {user?.cgpa} CGPA</span>
          </motion.div>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              key={stat.name} 
              onClick={() => router.push(stat.href)}
              className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-primary/50 hover:bg-zinc-900 transition-all group cursor-pointer relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowUpRight className="w-4 h-4 text-primary" />
              </div>
              <div className="flex items-center justify-between mb-4">
                <motion.div 
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className={`p-3 rounded-2xl ${stat.bg} ${stat.color}`}
                >
                  <stat.icon className="w-5 h-5" />
                </motion.div>
              </div>
              <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">{stat.name}</p>
              <div className="text-3xl font-bold mt-1 tracking-tight">
                {isLoading ? <Skeleton className="h-8 w-16" /> : stat.value}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 p-6 rounded-2xl bg-zinc-950 border border-zinc-800"
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold">My Applications</h3>
              <motion.button 
                whileHover={{ x: 3 }}
                className="text-primary text-xs font-medium hover:underline"
                onClick={() => router.push("/applications")}
              >
                View All
              </motion.button>
            </div>
            
            <div className="space-y-3">
              {isLoading ? (
                [1, 2, 3].map((i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-2xl bg-zinc-900 border border-zinc-800">
                    <Skeleton className="w-10 h-10 rounded-2xl" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-1/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))
              ) : applications.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center py-16 text-center"
                >
                  <Briefcase className="w-10 h-10 text-zinc-700 mb-3" />
                  <p className="text-zinc-600 text-sm">You haven&apos;t applied to any companies yet.</p>
                  <p className="text-zinc-700 text-xs mt-1">Explore eligible companies to get started.</p>
                </motion.div>
              ) : (
                <AnimatePresence>
                  {applications.map((app, index) => (
                    <motion.div 
                      key={app.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      whileHover={{ scale: 1.01, borderColor: "rgba(124, 58, 237, 0.3)" }}
                      onClick={() => router.push("/applications")}
                      className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800 transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <motion.div 
                          whileHover={{ rotate: 10 }}
                          className="w-10 h-10 rounded-2xl bg-zinc-800 flex items-center justify-center"
                        >
                          <Building2 className="w-5 h-5 text-zinc-400" />
                        </motion.div>
                        <div>
                          <p className="font-medium text-sm">{app.company?.company_name}</p>
                          <div className="flex items-center gap-2 text-xs text-zinc-500 mt-0.5">
                            <span>{app.company?.role}</span>
                            <span className="w-1 h-1 rounded-full bg-zinc-700" />
                            <span>Applied {format(new Date(app.applied_at), 'MMM dd')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="mt-3 sm:mt-0">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadge(app.status)}`}>
                          {app.status}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </motion.div>

          <div className="space-y-6">
            {eligibleCompanies.filter(c => new Date(c.deadline) > new Date()).length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"
              >
                <h4 className="font-semibold mb-3 flex items-center gap-2 text-amber-500 text-sm">
                  <Clock className="w-4 h-4" />
                  Upcoming Deadlines
                </h4>
                <div className="space-y-3">
                  {eligibleCompanies
                    .filter(c => new Date(c.deadline) > new Date())
                    .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
                    .slice(0, 3)
                    .map((company) => (
                      <div key={company.id} className="flex items-center justify-between p-2.5 rounded-xl bg-zinc-900 border border-zinc-800">
                        <div>
                          <p className="text-xs font-medium text-zinc-300">{company.company_name}</p>
                          <p className="text-[10px] text-zinc-600">{company.role}</p>
                        </div>
                        <span className="text-[10px] text-amber-500 font-medium">{format(new Date(company.deadline), "MMM d")}</span>
                      </div>
                    ))}
                </div>
              </motion.div>
            )}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               whileHover={{ scale: 1.01 }}
               className="p-6 rounded-2xl bg-gradient-to-br from-primary/20 via-purple-500/10 to-zinc-950 border border-primary/20 relative overflow-hidden group"
            >
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 blur-[60px] rounded-full group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-lg font-semibold mb-2">Success Tips</h3>
              <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
                Students with a complete profile are 3x more likely to be shortlisted. Keep your resume updated!
              </p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full h-10 bg-white text-black rounded-2xl font-medium text-xs hover:shadow-lg hover:shadow-white/10 transition-all"
              onClick={() => router.push("/dashboard/settings")}
              >
                Optimize Profile
              </motion.button>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"
            >
              <h4 className="font-semibold mb-4 flex items-center gap-2 text-primary text-sm">
                <TrendingUp className="w-4 h-4" />
                Operational Feed
              </h4>
              <div className="space-y-4">
                <AnimatePresence>
                  {notifications.slice(0, 3).map((notif, index) => (
                    <motion.div 
                      key={notif.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="relative pl-5 border-l border-zinc-800 space-y-1 group"
                    >
                      <div className="absolute -left-[4px] top-1 w-2 h-2 rounded-full bg-zinc-700 group-hover:bg-primary transition-colors" />
                      <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider">
                        {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                      </p>
                      <p className="text-xs font-medium text-zinc-300">{notif.title}</p>
                      <p className="text-[11px] text-zinc-600 line-clamp-1 italic">"{notif.message}"</p>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {notifications.length === 0 && (
                  <p className="text-xs text-zinc-600 italic text-center py-4">No recent activity</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {!isLoading && (applications.filter(a => a.status === "Shortlisted").length > 0 || applications.filter(a => a.status === "Interview").length > 0) && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {applications.filter(a => a.status === "Shortlisted").length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-4 h-4 text-purple-500" />
                  <h3 className="text-sm font-semibold">Shortlisted</h3>
                </div>
                <div className="space-y-2">
                  {applications.filter(a => a.status === "Shortlisted").map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div>
                        <p className="text-sm font-medium text-zinc-300">{app.company?.company_name}</p>
                        <p className="text-xs text-zinc-600">{app.company?.role}</p>
                      </div>
                      <span className="text-xs text-purple-500 font-medium">{app.status}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {applications.filter(a => a.status === "Interview").length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-4 h-4 text-amber-500" />
                  <h3 className="text-sm font-semibold">Interview</h3>
                </div>
                <div className="space-y-2">
                  {applications.filter(a => a.status === "Interview").map((app) => (
                    <div key={app.id} className="flex items-center justify-between p-3 rounded-xl bg-zinc-900 border border-zinc-800">
                      <div>
                        <p className="text-sm font-medium text-zinc-300">{app.company?.company_name}</p>
                        <p className="text-xs text-zinc-600">{app.company?.role}</p>
                      </div>
                      <span className="text-xs text-amber-500 font-medium">{app.status}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
