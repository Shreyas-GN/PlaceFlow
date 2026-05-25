"use client";

import { useEffect, useState, useMemo, startTransition } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ArrowRight, Building2, AlertCircle, CheckCircle2,
  Clock, RefreshCw, ChevronRight, FileText, Timer,
  GraduationCap, Briefcase,
} from "lucide-react";
import { applicationService, Application } from "@/services/application.service";
import { companyService, Company } from "@/services/company.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import { useNotificationStore } from "@/store/notification.store";
import { formatDistanceToNow, differenceInDays, format } from "date-fns";
import { Skeleton } from "@/components/shared/Skeleton";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

import { ActivityStream, generateMockActivity } from "@/components/shared/ActivityStream";
import { SyncIndicator, AutoSaveIndicator, Timestamp } from "@/components/shared/SystemFeedback";
import { InterviewPipeline, PIPELINE_STAGES } from "@/components/shared/InterviewPipeline";
import { OfferTracker, OfferSummaryBar } from "@/components/shared/OfferTracker";
import { useMemoryStore } from "@/store/memory.store";
import { getStatusColor, FRICTION_STATES, FrictionBadge } from "@/lib/status";
import {
  CrowdedTimeline,
  StatusDistribution,
  DelayedActions,
  useOperationalWear,
} from "@/components/shared/OperationalWear";

const STAGES = [
  { key: "Applied", label: "Applied", color: "bg-blue-500", barColor: "bg-blue-500/60" },
  { key: "Shortlisted", label: "Shortlisted", color: "bg-emerald-500", barColor: "bg-emerald-500/60" },
  { key: "Interview", label: "Interview", color: "bg-amber-500", barColor: "bg-amber-500/60" },
  { key: "Selected", label: "Offer", color: "bg-violet-500", barColor: "bg-violet-500/60" },
];

function getStatusAction(status: string): string {
  switch (status) {
    case "Applied": return "Awaiting recruiter review";
    case "Shortlisted": return "Interview to be scheduled";
    case "Interview": return "Awaiting decision";
    case "Selected": return "Offer in progress";
    case "Rejected": return "Not selected this round";
    default: return "Under review";
  }
}

function countByStatus(apps: Application[], key: string) {
  return apps.filter((a) => a.status === key).length;
}

function getWeekStart() {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

type DashboardState = "loading" | "empty" | "ready";

export default function DashboardPage() {
  const { user } = useAuthStore();
  const notifications = useNotificationStore((s) => s.notifications);
  const fetchNotifications = useNotificationStore((s) => s.fetchNotifications);
  const router = useRouter();
  const wear = useOperationalWear();
  const memory = useMemoryStore();

  const [applications, setApplications] = useState<Application[]>([]);
  const [eligibleCompanies, setEligibleCompanies] = useState<Company[]>([]);
  const [dashboardState, setDashboardState] = useState<DashboardState>("loading");
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [syncing, setSyncing] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const mockActivity = useMemo(() => generateMockActivity(), []);

  useEffect(() => {
    startTransition(async () => {
      try {
        const [apps, companies] = await Promise.all([
          applicationService.getApplications(),
          companyService.getEligibleCompanies(),
          fetchNotifications(),
        ]);
        setApplications(apps);
        setEligibleCompanies(companies);
        setLastSynced(new Date());
        setDashboardState(apps.length === 0 ? "empty" : "ready");
      } catch {
        toast.error("Failed to load dashboard data");
        setDashboardState("ready");
      }
    });
  }, [fetchNotifications]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLastSynced(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const userFirstName = user?.full_name?.split(" ")[0] || "Student";
  const totalApps = applications.length;

  const stageCounts = useMemo(
    () => ({
      Applied: countByStatus(applications, "Applied"),
      Shortlisted: countByStatus(applications, "Shortlisted"),
      Interview: countByStatus(applications, "Interview"),
      Selected: countByStatus(applications, "Selected"),
    }),
    [applications]
  );

  const thisWeekApps = useMemo(
    () =>
      applications.filter((a) => new Date(a.applied_at) >= getWeekStart()).length,
    [applications]
  );

  const needsReview = stageCounts.Applied;
  const interviewsToSchedule = stageCounts.Shortlisted;
  const responseRate =
    totalApps > 0
      ? Math.round(((totalApps - stageCounts.Applied) / totalApps) * 100)
      : 0;
  const maxStage = Math.max(...Object.values(stageCounts), 1);
  const hasReplied = applications.filter((a) => a.status !== "Applied").length > 0;

  const recentActivity = useMemo(
    () =>
      [...applications].sort(
        (a, b) =>
          new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()
      ),
    [applications]
  );

  const timelineEvents = useMemo(() => {
    const events: {
      id: string;
      time: Date;
      label: string;
      company: string;
      status: string;
    }[] = [];
    for (const app of recentActivity.slice(0, 10)) {
      const appliedDate = new Date(app.applied_at);
      events.push({
        id: `applied-${app.id}`,
        time: appliedDate,
        label: `Applied to ${app.company?.company_name || "Company"}`,
        company: app.company?.company_name || "",
        status: "Applied",
      });
    }
    const shortlistedApps = applications.filter(
      (a) =>
        a.status === "Shortlisted" ||
        a.status === "Interview" ||
        a.status === "Selected"
    );
    for (const app of shortlistedApps) {
      const d = new Date(app.applied_at);
      d.setHours(d.getHours() + 2);
      events.push({
        id: `shortlisted-${app.id}`,
        time: d,
        label: `Shortlisted at ${app.company?.company_name || "Company"}`,
        company: app.company?.company_name || "",
        status: "Shortlisted",
      });
    }
    const interviewApps = applications.filter(
      (a) => a.status === "Interview" || a.status === "Selected"
    );
    for (const app of interviewApps) {
      const d = new Date(app.applied_at);
      d.setHours(d.getHours() + 4);
      events.push({
        id: `interview-${app.id}`,
        time: d,
        label: `Interview scheduled at ${app.company?.company_name || "Company"}`,
        company: app.company?.company_name || "",
        status: "Interview",
      });
    }
    const selectedApps = applications.filter((a) => a.status === "Selected");
    for (const app of selectedApps) {
      const d = new Date(app.applied_at);
      d.setHours(d.getHours() + 6);
      events.push({
        id: `selected-${app.id}`,
        time: d,
        label: `Offer received from ${app.company?.company_name || "Company"}`,
        company: app.company?.company_name || "",
        status: "Selected",
      });
    }
    return events
      .sort((a, b) => b.time.getTime() - a.time.getTime())
      .slice(0, 8);
  }, [applications, recentActivity]);

  const upcomingDeadlines = useMemo(
    () =>
      eligibleCompanies
        .filter((c) => new Date(c.deadline) > new Date())
        .sort(
          (a, b) =>
            new Date(a.deadline).getTime() - new Date(b.deadline).getTime()
        )
        .slice(0, 4),
    [eligibleCompanies]
  );

  const urgentDeadlines = upcomingDeadlines.filter(
    (c) => differenceInDays(new Date(c.deadline), new Date()) <= 3
  );

  const recentNotifications = notifications.slice(0, 3);
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const needsProfile = !user?.cgpa;

  const commandItems = useMemo(() => {
    const items: {
      id: string;
      label: string;
      urgency: "high" | "medium" | "low";
      action: () => void;
    }[] = [];
    if (needsReview > 0) {
      items.push({
        id: "review",
        label: `${needsReview} application${needsReview !== 1 ? "s" : ""} awaiting recruiter review`,
        urgency: "high",
        action: () => router.push("/applications"),
      });
    }
    if (interviewsToSchedule > 0) {
      items.push({
        id: "schedule",
        label: `${interviewsToSchedule} interview${interviewsToSchedule !== 1 ? "s" : ""} to be scheduled`,
        urgency: "high",
        action: () => router.push("/applications?status=shortlisted"),
      });
    }
    if (needsProfile) {
      items.push({
        id: "profile",
        label: "Complete your profile to unlock more companies",
        urgency: "medium",
        action: () => router.push("/dashboard/settings"),
      });
    }
    if (urgentDeadlines.length > 0) {
      items.push({
        id: "deadlines",
        label: `${urgentDeadlines.length} deadline${urgentDeadlines.length !== 1 ? "s" : ""} closing within 3 days`,
        urgency: "high",
        action: () => router.push("/companies"),
      });
    }
    return items;
  }, [needsReview, interviewsToSchedule, needsProfile, urgentDeadlines, router]);

  const handleRefresh = async () => {
    setSyncing(true);
    try {
      const [apps, companies] = await Promise.all([
        applicationService.getApplications(),
        companyService.getEligibleCompanies(),
        fetchNotifications(),
      ]);
      startTransition(() => {
        setApplications(apps);
        setEligibleCompanies(companies);
        setLastSynced(new Date());
      });
    } catch {
      toast.error("Failed to refresh dashboard data");
    } finally {
      startTransition(() => setSyncing(false));
    }
  };

  /* ── Simulate auto-save ── */
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => {
        setIsSaving(false);
        setLastAutoSave(new Date());
      }, 800);
    }, 15000);
    return () => clearTimeout(timer);
  }, [lastAutoSave]);

  if (dashboardState === "loading") {
    return (
      <DashboardLayout>
        <div className="space-y-5">
          <Skeleton className="h-28 w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5">
            <div className="space-y-5">
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-64 w-full rounded-xl" />
            </div>
            <div className="space-y-5">
              <Skeleton className="h-40 w-full rounded-xl" />
              <Skeleton className="h-48 w-full rounded-xl" />
              <Skeleton className="h-36 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (dashboardState === "empty") {
    return (
      <DashboardLayout>
        <motion.div
          className="space-y-5"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="bg-layer-2 border border-zinc-800/40 rounded-xl p-6">
            <h1 className="op-heading">Welcome, {userFirstName}</h1>
            <p className="op-compact text-zinc-500 mt-1">
              Your placement journey starts here. No active drives yet — apply to start collecting responses
              and tracking your interview workflow.
            </p>
            <div className="mt-4 flex items-center gap-3">
              <button
                onClick={() => router.push("/companies")}
                className="flex items-center gap-1.5 bg-primary text-primary-foreground text-xs font-medium px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
              >
                Browse eligible companies
                <ArrowRight className="w-3 h-3" />
              </button>
              <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
                <Building2 className="w-3 h-3" />
                <span>{eligibleCompanies.length} companies accepting applications</span>
              </div>
            </div>
          </div>
          <div className="border border-dashed border-zinc-800/40 rounded-xl p-12 text-center">
            <div className="w-12 h-12 bg-layer-3 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FileText className="w-5 h-5 text-zinc-600" />
            </div>
            <p className="text-zinc-500 text-sm font-medium">No applications submitted yet</p>
            <p className="text-zinc-700 text-xs mt-1 max-w-sm mx-auto">
              Browse eligible companies and submit your first application. Status, interviews, and
              offers will appear here.
            </p>
            <button
              onClick={() => router.push("/companies")}
              className="mt-5 inline-flex items-center gap-1.5 bg-primary/10 text-primary text-xs font-medium px-4 py-2 rounded-lg hover:bg-primary/20 transition-colors"
            >
              <Building2 className="w-3 h-3" />
              Browse {eligibleCompanies.length} companies
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </motion.div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* ── System Status Bar ── */}
        <div className="flex items-center justify-between">
          <SyncIndicator
            lastSynced={lastSynced}
            isSyncing={syncing}
            onRefresh={handleRefresh}
          />
          <AutoSaveIndicator lastSaved={lastAutoSave} isSaving={isSaving} />
        </div>

        {/* ── DENSITY VARIATION: Dense Left + Wide Right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          {/* ══════ DENSE LEFT SIDEBAR ══════ */}
          <div className="space-y-3">
            {/* Profile Card (compact) */}
            <div className="bg-layer-2 border border-zinc-800/40 rounded-xl p-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-primary/30 flex items-center justify-center text-primary text-[11px] font-semibold shrink-0">
                  {user?.full_name?.[0] || "S"}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-300 truncate font-medium">{userFirstName}</p>
                  <p className="text-[10px] text-zinc-600 truncate">{user?.department || "Student"}</p>
                </div>
              </div>
              {needsProfile && (
                <div className="mt-2 flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-1 rounded">
                  <AlertCircle className="w-2.5 h-2.5" />
                  <span>CGPA not set</span>
                </div>
              )}
            </div>

            {/* Friction States */}
            <div className="bg-layer-2 border border-zinc-800/40 rounded-xl p-3">
              <div className="op-label text-zinc-500 mb-2">Status</div>
              {stageCounts.Applied > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {stageCounts.Applied} awaiting review
                </div>
              )}
              {stageCounts.Shortlisted > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400 mb-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  {stageCounts.Shortlisted} shortlisted
                </div>
              )}
              {stageCounts.Interview > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                  {stageCounts.Interview} interviews
                </div>
              )}
              {totalApps === 0 && (
                <p className="text-[11px] text-zinc-600">No activity yet</p>
              )}
            </div>

            {/* Quick Stats (dense) */}
            <div className="bg-layer-2 border border-zinc-800/40 rounded-xl p-3">
              <div className="op-label text-zinc-500 mb-2">Stats</div>
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">Applications</span>
                  <span className="text-xs font-semibold text-zinc-300 tabular-nums">{totalApps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">This week</span>
                  <span className="text-xs font-semibold text-zinc-300 tabular-nums">{thisWeekApps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-500">Response rate</span>
                  <span className="text-xs font-semibold text-zinc-300 tabular-nums">{responseRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ══════ WIDE RIGHT CONTENT ══════ */}
          <div className="space-y-5 min-w-0">
            {/* ── SPACIOUS HERO ── */}
            <motion.div
              className="bg-layer-2 border-l-2 border-primary rounded-xl p-5"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold tracking-tight">
                    Welcome back, {userFirstName}
                  </h1>
                  <div className="flex items-center gap-3 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1.5 text-sm">
                      <Building2 className="w-3 h-3 text-zinc-500" />
                      <span className="text-zinc-400 font-medium tabular-nums">{totalApps}</span>
                      <span className="text-zinc-600">applications submitted</span>
                      {thisWeekApps > 0 && (
                        <span className="text-emerald-500 text-xs font-medium">
                          +{thisWeekApps} this week
                        </span>
                      )}
                    </span>
                    {hasReplied && (
                      <span className="flex items-center gap-1.5 text-sm">
                        <GraduationCap className="w-3 h-3 text-violet-500" />
                        <span className="text-violet-400 font-medium tabular-nums">
                          {responseRate}%
                        </span>
                        <span className="text-zinc-600">response rate</span>
                      </span>
                    )}
                  </div>
                  {needsProfile && (
                    <div className="mt-3 flex items-center gap-2 text-[11px] text-amber-400 bg-amber-500/10 px-3 py-1.5 rounded-md w-fit">
                      <AlertCircle className="w-3 h-3" />
                      CGPA not set — some companies may be hidden
                      <button
                        onClick={() => router.push("/dashboard/settings")}
                        className="underline font-medium ml-1"
                      >
                        Update
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => router.push("/companies")}
                  className="hidden sm:flex items-center gap-1.5 bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-medium px-3.5 py-2 rounded-lg transition-colors shrink-0"
                >
                  Explore Companies
                  <ArrowRight className="w-3 h-3" />
                </button>
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
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="w-full flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-zinc-800/30 transition-colors text-left group"
                      >
                        <div
                          className={cn(
                            "w-1.5 h-1.5 rounded-full shrink-0",
                            item.urgency === "high"
                              ? "bg-amber-500"
                              : item.urgency === "medium"
                                ? "bg-blue-500"
                                : "bg-zinc-600"
                          )}
                        />
                        <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors flex-1">
                          {item.label}
                        </span>
                        <ChevronRight className="w-3 h-3 text-zinc-700 group-hover:text-zinc-500 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* ── WORKFLOW PIPELINE + DOMAIN COMPONENTS ── */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-5">
              {/* Pipeline */}
              <motion.div
                className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.05 }}
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="op-label text-zinc-500">Workflow Pipeline</span>
                  <button
                    onClick={() => router.push("/applications")}
                    className="text-[11px] text-zinc-600 hover:text-zinc-400 transition-colors"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-2.5">
                  {STAGES.map((stage) => {
                    const count = stageCounts[stage.key as keyof typeof stageCounts];
                    const pct = maxStage > 0 ? (count / maxStage) * 100 : 0;
                    return (
                      <div key={stage.key} className="space-y-1">
                        <div className="flex items-center justify-between text-[12px]">
                          <div className="flex items-center gap-2">
                            <span
                              className={cn("w-1.5 h-1.5 rounded-full shrink-0", stage.color)}
                            />
                            <span className="text-zinc-500">{stage.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            {count > 0 && (
                              <span className="text-[10px] text-zinc-600">
                                {getStatusAction(stage.key)}
                              </span>
                            )}
                            <span
                              className={cn(
                                "font-semibold tabular-nums text-sm",
                                count > 0 ? "text-zinc-200" : "text-zinc-600"
                              )}
                            >
                              {count}
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-zinc-800/60 rounded-full overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", stage.barColor)}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {hasReplied && (
                  <div className="mt-3 pt-3 border-t border-zinc-800/20">
                    <div className="flex items-center justify-between text-[12px]">
                      <span className="text-zinc-600">Overall response rate</span>
                      <span
                        className={cn(
                          "font-semibold tabular-nums",
                          responseRate > 30 ? "text-emerald-400" : "text-zinc-400"
                        )}
                      >
                        {responseRate}%
                      </span>
                    </div>
                  </div>
                )}
              </motion.div>

              {/* Interview Pipeline + Offer Tracker */}
              <motion.div
                className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.08 }}
              >
                <InterviewPipeline
                  currentStage={
                    stageCounts.Selected > 0
                      ? "Offer"
                      : stageCounts.Interview > 0
                        ? "Interview"
                        : stageCounts.Shortlisted > 0
                          ? "Shortlisted"
                          : "Applied"
                  }
                />
                <div className="mt-4 pt-3 border-t border-zinc-800/20">
                  <OfferTracker offers={[]} />
                </div>
              </motion.div>
            </div>

            {/* ── COMPRESSED ACTIVITY FEED ── */}
            <motion.div
              className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <ActivityStream events={mockActivity} max={5} compact />
            </motion.div>

            {/* ── DEADLINES + NOTIFICATIONS + RECENT ACTIVITY ── */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Priority Deadlines */}
              <motion.div
                className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12 }}
              >
                <div className="op-label text-zinc-500 mb-2">Priority Deadlines</div>
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-xs text-zinc-600 py-2">No upcoming deadlines</p>
                ) : (
                  <div className="space-y-1.5">
                    {upcomingDeadlines.map((c) => {
                      const daysLeft = differenceInDays(new Date(c.deadline), new Date());
                      const urgent = daysLeft <= 3;
                      return (
                        <div
                          key={c.id}
                          onClick={() => router.push("/companies")}
                          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-zinc-800/20 transition-colors cursor-pointer"
                        >
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full shrink-0",
                              urgent ? "bg-rose-500" : "bg-zinc-600"
                            )}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-[12px] text-zinc-400 truncate">{c.company_name}</p>
                            <p className="text-[11px] text-zinc-600 truncate">{c.role}</p>
                          </div>
                          <div className="text-right shrink-0">
                            <p
                              className={cn(
                                "text-[11px] font-semibold tabular-nums",
                                urgent ? "text-rose-400" : "text-zinc-600"
                              )}
                            >
                              {daysLeft === 0 ? "Today" : `${daysLeft}d`}
                            </p>
                            <p className="text-[10px] text-zinc-700">remaining</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>

              {/* System Updates */}
              <motion.div
                className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.14 }}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="op-label text-zinc-500">System Updates</span>
                  {unreadCount > 0 && (
                    <span className="text-[10px] font-medium text-primary bg-primary/10 px-1.5 py-0.5 rounded">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  {recentNotifications.map((n) => (
                    <div
                      key={n.id}
                      className="pb-2 border-b border-zinc-800/20 last:border-0 last:pb-0"
                    >
                      <p className="text-[12px] text-zinc-500 leading-relaxed">{n.message}</p>
                      <p className="text-[10px] text-zinc-700 mt-0.5">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                  {recentNotifications.length === 0 && (
                    <p className="text-xs text-zinc-600 py-2">No updates</p>
                  )}
                </div>
              </motion.div>

              {/* Activity Timeline (compact) */}
              <motion.div
                className="bg-layer-2 border border-zinc-800/40 rounded-xl p-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.16 }}
              >
                <div className="op-label text-zinc-500 mb-2">Your Timeline</div>
                <div className="space-y-0">
                  {timelineEvents.slice(0, 5).map((event, i) => {
                    const isLast = i === Math.min(timelineEvents.length, 5) - 1;
                    const stageColor =
                      STAGES.find((s) => s.key === event.status)?.color || "bg-zinc-600";
                    return (
                      <div key={event.id} className="flex gap-2">
                        <div className="flex flex-col items-center shrink-0">
                          <div
                            className={cn(
                              "w-1.5 h-1.5 rounded-full ring-2 ring-layer-2",
                              stageColor,
                              "opacity-80"
                            )}
                          />
                          {!isLast && <div className="w-px flex-1 bg-zinc-800/30 my-0.5" />}
                        </div>
                        <div className={cn("pb-2 flex-1 min-w-0", isLast && "pb-0")}>
                          <div className="flex items-center gap-1.5">
                            <CompanyLogo name={event.company || "Company"} size="sm" />
                            <div className="min-w-0 flex-1">
                              <p className="text-[12px] text-zinc-400 leading-tight">
                                {event.label}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <p className="text-[10px] text-zinc-600 font-medium tabular-nums">
                                {format(event.time, "HH:mm")}
                              </p>
                              <p className="text-[9px] text-zinc-700">
                                {format(event.time, "MMM dd")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {timelineEvents.length === 0 && (
                  <p className="text-[12px] text-zinc-600 py-2 text-center">
                    No activity to display yet.
                  </p>
                )}
              </motion.div>
            </div>

            {/* ── SYSTEM MEMORY: Resume where you left off ── */}
            {memory.lastOpenedDriveName && (
              <motion.div
                className="bg-layer-2 border border-zinc-800/40 rounded-xl p-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                <div className="op-label text-zinc-500 mb-1.5">Pick up where you left off</div>
                <div className="flex items-center gap-2 px-2 py-1.5 rounded bg-zinc-800/30">
                  <Briefcase className="w-3 h-3 text-primary" />
                  <span className="text-[12px] text-zinc-400 flex-1">
                    {memory.lastOpenedDriveName}
                  </span>
                  <button
                    onClick={() => memory.addActivity({ type: "viewed_application", label: `Resumed viewing ${memory.lastOpenedDriveName}`, path: "/applications" })}
                    className="text-[11px] text-primary hover:text-primary/80 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
