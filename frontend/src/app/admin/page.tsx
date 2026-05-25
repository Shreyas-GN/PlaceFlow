"use client";

import { useEffect, useState, useMemo, startTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Users, Building2, ChevronRight,
  AlertCircle, RefreshCw, Archive,
  Timer, Download,
} from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { format, formatDistanceToNow, subDays } from "date-fns";
import { Skeleton } from "@/components/shared/Skeleton";
import { getStatusColor, FRICTION_STATES, FrictionBadge } from "@/lib/status";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { ActivityStream, generateMockActivity } from "@/components/shared/ActivityStream";
import { SyncIndicator, AutoSaveIndicator, Timestamp } from "@/components/shared/SystemFeedback";
import { InterviewPipeline, PIPELINE_STAGES, CompactPipelineStages } from "@/components/shared/InterviewPipeline";
import { OfferTracker, OfferSummaryBar } from "@/components/shared/OfferTracker";
import { EligibilityMatrix, CompactEligibilityGrid } from "@/components/shared/EligibilityMatrix";
import { useMemoryStore } from "@/store/memory.store";
import {
  ArchivedDrivesBar,
  ExpiringRecords,
  NotificationOverflow,
  CrowdedTimeline,
  StatusDistribution,
  DelayedActions,
  useOperationalWear,
} from "@/components/shared/OperationalWear";
import { ConversionFunnel, FunnelMetrics } from "@/components/shared/ConversionFunnel";
import { RoleTensionCard } from "@/components/shared/RoleTension";
import { SeasonalityIndicator, ActiveDriveCountdown } from "@/components/shared/SeasonalityIndicator";
import { SystemNotices, ExportButton, useSystemNotices } from "@/components/shared/SystemNotices";

interface AdminStudent {
  id: string;
  full_name: string;
  email: string;
  department: string;
  cgpa: number;
}

interface AdminCompany {
  id: string;
  company_name: string;
  role: string;
  package: string;
  min_cgpa: number;
  eligible_departments: string;
  deadline: string;
  created_at: string;
}

interface AdminApplication {
  id: string;
  student_id: string;
  company_id: string;
  status: string;
  applied_at: string;
  student?: AdminStudent;
  company?: AdminCompany;
}

const PLACEMENT_COORDINATORS = [
  "Dr. Ananya Verma",
  "Prof. Rajesh Nair",
  "Dr. Sneha Gupta",
  "Prof. Arjun Rao",
  "Ms. Priya Kulkarni",
];

const RECRUITER_NAMES = [
  "Rahul Mehta (Adobe)",
  "Ananya Krishnan (Amazon)",
  "Siddharth Patel (Google)",
  "Vikram Iyer (Goldman Sachs)",
  "Kavita Joshi (JP Morgan)",
  "Priya Sharma (Microsoft)",
  "Arun Nair (Flipkart)",
];

type DashboardPhase = "loading" | "ready";

export default function AdminDashboard() {
  const router = useRouter();
  const wear = useOperationalWear();
  const memory = useMemoryStore();

  const [stats, setStats] = useState({
    totalApplicants: 0,
    activeDrives: 0,
    selectedStudents: 0,
    pendingReviews: 0,
  });
  const [recentApplications, setRecentApplications] = useState<AdminApplication[]>([]);
  const [phase, setPhase] = useState<DashboardPhase>("loading");
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [syncing, setSyncing] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const mockActivity = useMemo(() => generateMockActivity(), []);
  const systemNotices = useSystemNotices();

  useEffect(() => {
    startTransition(async () => {
      try {
        const [apps, companies] = await Promise.all([
          adminService.getAllApplications() as Promise<AdminApplication[]>,
          adminService.getAllCompanies(),
        ]);
        setRecentApplications(apps.slice(0, 20));
        setStats({
          totalApplicants: apps.length,
          activeDrives: (companies as AdminCompany[]).length,
          selectedStudents: apps.filter((a) => a.status === "Selected").length,
          pendingReviews: apps.filter((a) => a.status === "Applied").length,
        });
        setLastSynced(new Date());
        setPhase("ready");
      } catch {
        toast.error("Failed to load dashboard data");
        setPhase("ready");
      }
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSynced(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const interviewStage = useMemo(
    () => recentApplications.filter((a) => a.status === "Interview").length,
    [recentApplications]
  );

  const shortlisted = useMemo(
    () => recentApplications.filter((a) => a.status === "Shortlisted").length,
    [recentApplications]
  );

  const stageCounts = useMemo(() => ({
    Applied: recentApplications.filter((a) => a.status === "Applied").length,
    Screening: recentApplications.filter((a) => a.status === "Screening" || a.status === "Shortlisted").length,
    Technical: recentApplications.filter((a) => a.status === "Technical" || a.status === "Interview").length,
    HR: recentApplications.filter((a) => a.status === "HR").length,
    Offer: recentApplications.filter((a) => a.status === "Selected" || a.status === "Offer").length,
  }), [recentApplications]);

  const funnelStages = useMemo(() => [
    { key: "applied", label: "Applied", count: stageCounts.Applied, color: "bg-blue-500" },
    { key: "screening", label: "Screening / Shortlisted", count: stageCounts.Screening, color: "bg-indigo-500" },
    { key: "technical", label: "Technical / Interview", count: stageCounts.Technical, color: "bg-violet-500" },
    { key: "hr", label: "HR Round", count: stageCounts.HR, color: "bg-pink-500" },
    { key: "offer", label: "Offer / Selected", count: stageCounts.Offer, color: "bg-emerald-500" },
  ], [stageCounts]);

  const selectionRate =
    stats.totalApplicants > 0
      ? Math.round((stats.selectedStudents / stats.totalApplicants) * 100)
      : 0;

  const handleRefresh = async () => {
    setSyncing(true);
    try {
      const [apps, companies] = await Promise.all([
        adminService.getAllApplications() as Promise<AdminApplication[]>,
        adminService.getAllCompanies(),
      ]);
      startTransition(() => {
        setRecentApplications(apps.slice(0, 20));
        setStats({
          totalApplicants: apps.length,
          activeDrives: (companies as AdminCompany[]).length,
          selectedStudents: apps.filter((a) => a.status === "Selected").length,
          pendingReviews: apps.filter((a) => a.status === "Applied").length,
        });
        setLastSynced(new Date());
      });
      memory.addActivity({ type: "filter_applied", label: "Refreshed admin dashboard", path: "/admin" });
    } catch {
      toast.error("Failed to refresh dashboard data");
    } finally {
      startTransition(() => setSyncing(false));
    }
  };

  const commandItems = useMemo(() => {
    const items: {
      id: string;
      label: string;
      urgency: "high" | "medium" | "low";
      action: string;
      actionLabel: string;
    }[] = [];
    if (stats.pendingReviews > 0) {
      items.push({
        id: "review",
        label: `${stats.pendingReviews} applicant${stats.pendingReviews !== 1 ? "s" : ""} pending recruiter review`,
        urgency: "high",
        action: "/admin/applicants?status=Applied",
        actionLabel: "Review",
      });
    }
    if (shortlisted > 0) {
      items.push({
        id: "schedule",
        label: `${shortlisted} student${shortlisted !== 1 ? "s" : ""} awaiting interview scheduling`,
        urgency: "high",
        action: "/admin/applicants?status=Shortlisted",
        actionLabel: "Schedule",
      });
    }
    if (stats.activeDrives === 0) {
      items.push({
        id: "create",
        label: "No active placement drives — start one to begin collecting applications",
        urgency: "medium",
        action: "/admin/companies",
        actionLabel: "Create Drive",
      });
    }
    return items;
  }, [stats.pendingReviews, shortlisted, stats.activeDrives]);

  /* ── Simulate auto-save ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastAutoSave(new Date());
      }, 800);
    }, 10000);
    return () => clearTimeout(timer);
  }, [lastAutoSave]);

  if (phase === "loading") {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-48" />
        <Skeleton className="h-8 w-full" />
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          <Skeleton className="h-96 w-full rounded-xl" />
          <div className="space-y-5">
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-64 w-full rounded-xl" />
            <Skeleton className="h-48 w-full rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* ── System Status Bar ── */}
      <motion.div
        className="flex items-center justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SyncIndicator
          lastSynced={lastSynced}
          isSyncing={syncing}
          onRefresh={handleRefresh}
        />
        <AutoSaveIndicator lastSaved={lastAutoSave} isSaving={isSaving} />
      </motion.div>

      {/* ── DENSITY VARIATION: Dense Left + Wide Right ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">

        {/* ══════════ DENSE OPERATIONAL SIDEBAR ══════════ */}
        <div className="space-y-3">
          {/* Friction States */}
          <div className="bg-layer-2 border border-zinc-800/40 rounded-xl p-3">
            <div className="op-label text-zinc-500 mb-2">Active Frictions</div>
            <div className="space-y-1.5">
              {FRICTION_STATES.slice(0, 3).map((f) => (
                <FrictionBadge key={f.type} state={f} />
              ))}
            </div>
          </div>

          {/* System Memory - Recent Activity */}
          <div className="bg-layer-2 border border-zinc-800/40 rounded-xl p-3">
            <div className="op-label text-zinc-500 mb-2">Recent</div>
            <div className="space-y-1">
              {memory.recentActivities.slice(0, 4).map((a) => (
                <div key={a.id} className="flex items-center gap-1.5">
                  <div className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
                  <span className="text-[11px] text-zinc-500 truncate">{a.label}</span>
                </div>
              ))}
              {memory.recentActivities.length === 0 && (
                <p className="text-[11px] text-zinc-600">No recent activity</p>
              )}
            </div>
          </div>

          {/* Quick Metrics (dense) */}
          <div className="bg-layer-2 border border-zinc-800/40 rounded-xl p-3">
            <div className="op-label text-zinc-500 mb-2">Metrics</div>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Selection rate</span>
                <span className="text-xs font-semibold text-zinc-300 tabular-nums">{selectionRate}%</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Interview stage</span>
                <span className="text-xs font-semibold text-zinc-300 tabular-nums">{interviewStage}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-zinc-500">Shortlisted</span>
                <span className="text-xs font-semibold text-zinc-300 tabular-nums">{shortlisted}</span>
              </div>
            </div>
          </div>

          {/* Role Tension — conflicting stakeholder priorities */}
          <div className="bg-layer-2 border border-zinc-800/40 rounded-xl p-3">
            <RoleTensionCard activeConflict="officer" />
          </div>

          {/* Archived Drives + Notification Overflow */}
          <ArchivedDrivesBar count={3} />
          <NotificationOverflow total={47} unread={12} />

          {/* Exports — institutional trust signals */}
          <div className="bg-layer-2 border border-zinc-800/40 rounded-xl p-3">
            <div className="op-label text-zinc-500 mb-2">Exports</div>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Download className="w-3 h-3 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors">Applicant Data</p>
                  <p className="text-[9px] text-zinc-600 tabular-nums">CSV · {stats.totalApplicants} records</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-zinc-800/30 transition-colors cursor-pointer group">
                <div className="w-6 h-6 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Download className="w-3 h-3 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors">Drive Report</p>
                  <p className="text-[9px] text-zinc-600 tabular-nums">PDF · {stats.activeDrives} drives</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ══════════ WIDE MAIN CONTENT ══════════ */}
        <div className="space-y-5 min-w-0">

          {/* ── SPACIOUS HERO INSIGHT ── */}
          <motion.div
            className="bg-layer-2 border border-zinc-800/40 rounded-xl p-5"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h1 className="text-xl font-semibold tracking-tight">Admin Console</h1>
                <p className="text-zinc-500 text-xs mt-0.5">
                  Placement workflow management —{" "}
                  <Timestamp date={lastSynced} prefix="Last activity" />
                </p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <div className="flex items-center gap-1.5 bg-zinc-800/30 border border-zinc-800/40 rounded-lg px-2.5 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
                  <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-[0.08em]">
                    System Online
                  </span>
                </div>
              </div>
            </div>

            {/* Command Center */}
            {commandItems.length > 0 && (
              <div className="mt-4 p-3 rounded-lg bg-zinc-800/20 border border-zinc-800/40">
                <div className="flex items-center gap-2 mb-2">
                  <AlertCircle className="w-3 h-3 text-primary" />
                  <span className="op-label text-zinc-500">Requires Attention</span>
                </div>
                <div className="space-y-1">
                  {commandItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 px-3 py-1.5 rounded bg-zinc-800/30"
                    >
                      <div
                        className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          item.urgency === "high" ? "bg-amber-500" : "bg-blue-500"
                        )}
                      />
                      <span className="text-xs text-zinc-400 flex-1">{item.label}</span>
                      <Link
                        href={item.action}
                        className="text-[11px] font-medium text-primary hover:text-primary/80 transition-colors shrink-0"
                      >
                        {item.actionLabel}
                      </Link>
                      <ChevronRight className="w-3 h-3 text-zinc-700 shrink-0" />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metrics bar */}
            <div className="flex items-center gap-3 flex-wrap mt-4">
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-layer-3 border border-zinc-800/60">
                <Users className="w-3 h-3 text-zinc-500" />
                <span className="text-[12px] text-zinc-400">
                  <strong className="text-zinc-200 tabular-nums">{stats.totalApplicants}</strong> applicants
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-layer-3 border border-zinc-800/60">
                <Building2 className="w-3 h-3 text-zinc-500" />
                <span className="text-[12px] text-zinc-400">
                  <strong className="text-zinc-200 tabular-nums">{stats.activeDrives}</strong> active drives
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2 py-1 rounded bg-layer-3 border border-zinc-800/60">
                <Timer className="w-3 h-3 text-zinc-500" />
                <span className="text-[12px] text-zinc-400">
                  <strong className="text-zinc-200 tabular-nums">{stats.pendingReviews}</strong> awaiting review
                </span>
              </div>
            </div>
          </motion.div>

          {/* ── PIPELINE + DOMAIN COMPONENTS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
            {/* Interview Pipeline (wide) */}
            <motion.div
              className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <InterviewPipeline
                currentStage={stageCounts.Offer > 0 ? "Offer" : stageCounts.HR > 0 ? "HR" : stageCounts.Technical > 0 ? "Technical" : stageCounts.Screening > 0 ? "Screening" : "Applied"}
              />
              <div className="mt-3 pt-3 border-t border-zinc-800/20">
                <CompactPipelineStages currentStage="Applied" stageCounts={stageCounts} />
              </div>
            </motion.div>

            {/* Offer Tracker */}
            <motion.div
              className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 }}
            >
              <OfferSummaryBar accepted={12} pending={5} declined={3} expiring={2} />
              <div className="mt-3">
                <OfferTracker
                  offers={[
                    { id: "1", company: "Adobe", role: "SDE-1", package: "24 LPA", status: "accepted" },
                    { id: "2", company: "Amazon", role: "SDE-1", package: "32 LPA", status: "pending", daysLeft: 2 },
                    { id: "3", company: "Google", role: "SWE Intern", package: "12 LPA", status: "expiring", daysLeft: 1 },
                  ]}
                />
              </div>
            </motion.div>
          </div>

          {/* ── SEASONALITY + SYSTEM NOTICES ── */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <SeasonalityIndicator />
              <div className="mt-2">
                <ActiveDriveCountdown activeDrives={stats.activeDrives} peakDays={stats.activeDrives > 3 ? 5 : 0} />
              </div>
            </motion.div>

            <motion.div
              className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="op-label text-zinc-500 mb-2">System Notices</div>
              <SystemNotices notices={systemNotices} compact />
            </motion.div>
          </div>

          {/* ── COMPRESSED ACTIVITY FEED ── */}
          <motion.div
            className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <ActivityStream events={mockActivity} max={6} compact />
          </motion.div>

          {/* ── CONVERSION FUNNEL — WORKFLOW ANALYTICS ── */}
          <motion.div
            className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.12 }}
          >
            <ConversionFunnel stages={funnelStages} total={stats.totalApplicants} />
            <FunnelMetrics stages={funnelStages} total={stats.totalApplicants} />
          </motion.div>

          {/* ── OPERATIONAL WEAR: Crowded Timeline + Delays + Statuses ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <motion.div
              className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14 }}
            >
              <div className="op-label text-zinc-500 mb-2">Today's Timeline</div>
              <CrowdedTimeline items={wear.crowdedTimeline.slice(0, 6)} />
            </motion.div>

            <motion.div
              className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.16 }}
            >
              <StatusDistribution statuses={wear.mixedStatuses} />
            </motion.div>

            <motion.div
              className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.18 }}
            >
              <DelayedActions actions={wear.delayedActions} />
            </motion.div>
          </div>

          {/* ── Recent Applications Table (compact) ── */}
          <motion.div
            className="bg-layer-2 border border-zinc-800/40 rounded-xl overflow-hidden"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 }}
          >
            <div className="px-4 py-3 flex items-center justify-between border-b border-zinc-800/40">
              <span className="op-label text-zinc-500">Recent Applications</span>
              <Link
                href="/admin/applicants"
                className="text-[11px] text-primary hover:text-primary/80 transition-colors"
              >
                View all
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-zinc-800/40">
                    <th className="text-left op-label text-zinc-600 pb-2 px-4 pt-2">Candidate</th>
                    <th className="text-left op-label text-zinc-600 pb-2 px-4 pt-2">Company</th>
                    <th className="text-left op-label text-zinc-600 pb-2 px-4 pt-2">Applied</th>
                    <th className="text-right op-label text-zinc-600 pb-2 px-4 pt-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApplications.slice(0, 8).map((app) => (
                    <tr
                      key={app.id}
                      className="border-b border-zinc-800/20 hover:bg-white/[0.01] transition-colors"
                    >
                      <td className="py-2 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center text-primary text-[10px] font-semibold shrink-0">
                            {app.student?.full_name?.[0]}
                          </div>
                          <div>
                            <p className="text-[13px] text-zinc-300 leading-tight">
                              {app.student?.full_name}
                            </p>
                            <p className="text-[11px] text-zinc-600">{app.student?.department}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-4 text-[13px] text-zinc-500">{app.company?.company_name}</td>
                      <td className="py-2 px-4 text-[12px] text-zinc-600">
                        {format(new Date(app.applied_at), "MMM dd")}
                      </td>
                      <td className="py-2 px-4 text-right">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[11px] font-medium border ${getStatusColor(app.status)}`}
                        >
                          {app.status === "Applied" ? "Awaiting review" : app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
}
