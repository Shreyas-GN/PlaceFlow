"use client";

import { useEffect, useState, useMemo, startTransition } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  ArrowRight, Building2, AlertCircle, CheckCircle2,
  Clock, RefreshCw, ChevronRight, GraduationCap, Briefcase,
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
import { InterviewPipeline } from "@/components/shared/InterviewPipeline";
import { OfferTracker } from "@/components/shared/OfferTracker";
import { useMemoryStore } from "@/store/memory.store";

const STAGES = [
  { key: "Applied", label: "Applied", dotColor: "bg-gray-400", barColor: "bg-gray-300" },
  { key: "Shortlisted", label: "Shortlisted", dotColor: "bg-blue-500", barColor: "bg-blue-400" },
  { key: "Interview", label: "Interview", dotColor: "bg-amber-500", barColor: "bg-amber-400" },
  { key: "Selected", label: "Offer", dotColor: "bg-green-500", barColor: "bg-green-400" },
];

function getStatusAction(status: string): string {
  switch (status) {
    case "Applied": return "Awaiting review";
    case "Shortlisted": return "Interview to be scheduled";
    case "Interview": return "Awaiting decision";
    case "Selected": return "Offer in progress";
    case "Rejected": return "Not selected";
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
  const memory = useMemoryStore();

  const [applications, setApplications] = useState<Application[]>([]);
  const [eligibleCompanies, setEligibleCompanies] = useState<Company[]>([]);
  const [dashboardState, setDashboardState] = useState<DashboardState>("loading");
  const [lastSynced, setLastSynced] = useState<Date>(new Date());
  const [syncing, setSyncing] = useState(false);

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
    const interval = setInterval(() => setLastSynced(new Date()), 30000);
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
    () => applications.filter((a) => new Date(a.applied_at) >= getWeekStart()).length,
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
    () => [...applications].sort((a, b) => new Date(b.applied_at).getTime() - new Date(a.applied_at).getTime()),
    [applications]
  );

  const timelineEvents = useMemo(() => {
    const events: { id: string; time: Date; label: string; company: string; status: string }[] = [];
    for (const app of recentActivity.slice(0, 10)) {
      const appliedDate = new Date(app.applied_at);
      events.push({ id: `applied-${app.id}`, time: appliedDate, label: `Applied to ${app.company?.company_name || "Company"}`, company: app.company?.company_name || "", status: "Applied" });
    }
    const shortlistedApps = applications.filter((a) => a.status === "Shortlisted" || a.status === "Interview" || a.status === "Selected");
    for (const app of shortlistedApps) {
      const d = new Date(app.applied_at); d.setHours(d.getHours() + 2);
      events.push({ id: `shortlisted-${app.id}`, time: d, label: `Shortlisted at ${app.company?.company_name || "Company"}`, company: app.company?.company_name || "", status: "Shortlisted" });
    }
    const interviewApps = applications.filter((a) => a.status === "Interview" || a.status === "Selected");
    for (const app of interviewApps) {
      const d = new Date(app.applied_at); d.setHours(d.getHours() + 4);
      events.push({ id: `interview-${app.id}`, time: d, label: `Interview scheduled at ${app.company?.company_name || "Company"}`, company: app.company?.company_name || "", status: "Interview" });
    }
    const selectedApps = applications.filter((a) => a.status === "Selected");
    for (const app of selectedApps) {
      const d = new Date(app.applied_at); d.setHours(d.getHours() + 6);
      events.push({ id: `selected-${app.id}`, time: d, label: `Offer received from ${app.company?.company_name || "Company"}`, company: app.company?.company_name || "", status: "Selected" });
    }
    return events.sort((a, b) => b.time.getTime() - a.time.getTime()).slice(0, 8);
  }, [applications, recentActivity]);

  const upcomingDeadlines = useMemo(
    () => eligibleCompanies
      .filter((c) => new Date(c.deadline) > new Date())
      .sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime())
      .slice(0, 4),
    [eligibleCompanies]
  );

  const urgentDeadlines = upcomingDeadlines.filter(
    (c) => differenceInDays(new Date(c.deadline), new Date()) <= 3
  );

  const recentNotifications = notifications.slice(0, 3);
  const unreadCount = notifications.filter((n) => !n.is_read).length;
  const needsProfile = !user?.cgpa;

  const actionItems = useMemo(() => {
    const items: { id: string; label: string; urgency: "high" | "medium" | "low"; action: () => void }[] = [];
    if (needsReview > 0) {
      items.push({ id: "review", label: `${needsReview} application${needsReview !== 1 ? "s" : ""} awaiting recruiter review`, urgency: "high", action: () => router.push("/applications") });
    }
    if (interviewsToSchedule > 0) {
      items.push({ id: "schedule", label: `${interviewsToSchedule} interview${interviewsToSchedule !== 1 ? "s" : ""} to be scheduled`, urgency: "high", action: () => router.push("/applications?status=shortlisted") });
    }
    if (needsProfile) {
      items.push({ id: "profile", label: "Complete your profile to unlock more companies", urgency: "medium", action: () => router.push("/dashboard/settings") });
    }
    if (urgentDeadlines.length > 0) {
      items.push({ id: "deadlines", label: `${urgentDeadlines.length} deadline${urgentDeadlines.length !== 1 ? "s" : ""} closing within 3 days`, urgency: "high", action: () => router.push("/companies") });
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
      toast.error("Failed to refresh");
    } finally {
      startTransition(() => setSyncing(false));
    }
  };

  /* ── Loading State ── */
  if (dashboardState === "loading") {
    return (
      <DashboardLayout>
        <div className="space-y-5">
          <Skeleton className="h-24 w-full rounded-xl" />
          <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
            <div className="space-y-4">
              <Skeleton className="h-32 w-full rounded-xl" />
              <Skeleton className="h-24 w-full rounded-xl" />
              <Skeleton className="h-20 w-full rounded-xl" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-44 w-full rounded-xl" />
              <Skeleton className="h-56 w-full rounded-xl" />
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ── Empty / Onboarding State ── */
  if (dashboardState === "empty") {
    const profileComplete = !!user?.cgpa && !!user?.department;
    const steps = [
      {
        n: 1,
        label: "Complete your profile",
        detail: "Set your CGPA and department so we can match you with the right drives.",
        done: profileComplete,
        action: () => router.push("/dashboard/settings"),
        cta: "Update profile",
      },
      {
        n: 2,
        label: "Browse eligible drives",
        detail: `${eligibleCompanies.length} companies are currently accepting applications.`,
        done: memory.recentActivities.some((a) => a.type === "opened_drive"),
        action: () => router.push("/companies"),
        cta: "Browse companies",
      },
      {
        n: 3,
        label: "Submit your first application",
        detail: "Apply to a drive — your status, interviews, and offers will appear here.",
        done: false,
        action: () => router.push("/companies"),
        cta: "Apply now",
      },
    ];
    const currentStep = steps.findIndex((s) => !s.done);

    return (
      <DashboardLayout>
        <div className="max-w-2xl">
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h1 className="text-xl font-semibold text-gray-900">Welcome, {userFirstName}</h1>
            <p className="text-gray-500 mt-1 text-sm">
              Complete these steps to start your placement journey.
            </p>

            <div className="mt-6 space-y-3">
              {steps.map((step, i) => {
                const isActive = i === currentStep;
                const isPast = step.done;
                return (
                  <div
                    key={step.n}
                    className={cn(
                      "flex items-start gap-4 px-4 py-3.5 rounded-xl border transition-all",
                      isPast
                        ? "border-gray-100 opacity-60"
                        : isActive
                          ? "border-blue-200 bg-blue-50"
                          : "border-gray-100 opacity-50"
                    )}
                  >
                    <div
                      className={cn(
                        "w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 mt-0.5",
                        isPast
                          ? "bg-green-100 text-green-700"
                          : isActive
                            ? "bg-blue-600 text-white"
                            : "bg-gray-100 text-gray-400"
                      )}
                    >
                      {isPast ? <CheckCircle2 className="w-3.5 h-3.5" /> : step.n}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium", isPast ? "text-gray-400 line-through" : "text-gray-900")}>
                        {step.label}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">{step.detail}</p>
                    </div>
                    {isActive && (
                      <button
                        onClick={step.action}
                        className="flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors shrink-0"
                      >
                        {step.cta}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ── Ready State ── */
  return (
    <DashboardLayout>
      <div className="space-y-5">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-400">
            Last synced {formatDistanceToNow(lastSynced, { addSuffix: true })}
          </p>
          <button
            onClick={handleRefresh}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", syncing && "animate-spin")} />
            Refresh
          </button>
        </div>

        {/* Two-column layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-5">
          {/* ── Left column: profile + status + stats ── */}
          <div className="space-y-4">
            {/* Profile card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-semibold shrink-0">
                  {user?.full_name?.[0] || "S"}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{userFirstName}</p>
                  <p className="text-xs text-gray-500 truncate">{user?.department || "Student"}</p>
                </div>
              </div>

              {user?.placement_eligible === true && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-green-700 bg-green-50 border border-green-200 px-2.5 py-1.5 rounded-lg">
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Placement eligible</span>
                </div>
              )}
              {user?.placement_eligible === false && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-red-700 bg-red-50 border border-red-200 px-2.5 py-1.5 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>Not eligible</span>
                </div>
              )}
              {needsProfile && (
                <div className="mt-3 flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1.5 rounded-lg">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>CGPA not set</span>
                </div>
              )}

              {user?.skills && user.skills.length > 0 && (
                <div className="mt-3">
                  <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Skills</p>
                  <div className="flex flex-wrap gap-1">
                    {user.skills.slice(0, 4).map((skill) => (
                      <span key={skill} className="text-xs px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-200">
                        {skill}
                      </span>
                    ))}
                    {user.skills.length > 4 && (
                      <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-500 rounded-full">
                        +{user.skills.length - 4}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Status card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Status</p>
              {stageCounts.Applied > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 shrink-0" />
                  {stageCounts.Applied} awaiting review
                </div>
              )}
              {stageCounts.Shortlisted > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  {stageCounts.Shortlisted} shortlisted
                </div>
              )}
              {stageCounts.Interview > 0 && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  {stageCounts.Interview} interviews
                </div>
              )}
              {totalApps === 0 && (
                <p className="text-sm text-gray-400">No activity yet</p>
              )}
            </div>

            {/* Stats card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Stats</p>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Applications</span>
                  <span className="text-sm font-semibold text-gray-900 tabular-nums">{totalApps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">This week</span>
                  <span className="text-sm font-semibold text-gray-900 tabular-nums">{thisWeekApps}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Response rate</span>
                  <span className="text-sm font-semibold text-gray-900 tabular-nums">{responseRate}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column: main content ── */}
          <div className="space-y-5 min-w-0">
            {/* Welcome + actions banner */}
            <div className="bg-white border-l-4 border-l-blue-600 border border-gray-200 rounded-xl p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl font-semibold text-gray-900">
                    Welcome back, {userFirstName}
                  </h1>
                  <div className="flex items-center gap-4 mt-1.5 flex-wrap">
                    <span className="flex items-center gap-1.5 text-sm text-gray-500">
                      <Building2 className="w-3.5 h-3.5" />
                      <span className="font-semibold text-gray-900 tabular-nums">{totalApps}</span>
                      applications
                      {thisWeekApps > 0 && (
                        <span className="text-green-600 font-medium">+{thisWeekApps} this week</span>
                      )}
                    </span>
                    {hasReplied && (
                      <span className="flex items-center gap-1.5 text-sm text-gray-500">
                        <span className="font-semibold text-gray-900 tabular-nums">{responseRate}%</span>
                        response rate
                      </span>
                    )}
                  </div>

                  {needsProfile && (
                    <div className="mt-3 flex items-center gap-2 text-xs text-amber-700 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg w-fit">
                      <AlertCircle className="w-3.5 h-3.5" />
                      CGPA not set — some companies may be hidden
                      <button onClick={() => router.push("/dashboard/settings")} className="underline font-semibold">
                        Update
                      </button>
                    </div>
                  )}
                </div>
                <button
                  onClick={() => router.push("/companies")}
                  className="hidden sm:flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-[10px] transition-colors shrink-0"
                >
                  Browse Companies
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Action required */}
              {actionItems.length > 0 && (
                <div className="mt-4 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-3.5 h-3.5 text-gray-500" />
                    <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Action Required</span>
                  </div>
                  <div className="space-y-1">
                    {actionItems.map((item) => (
                      <button
                        key={item.id}
                        onClick={item.action}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white transition-colors text-left group border border-transparent hover:border-gray-200"
                      >
                        <div className={cn(
                          "w-1.5 h-1.5 rounded-full shrink-0",
                          item.urgency === "high" ? "bg-amber-500" : item.urgency === "medium" ? "bg-blue-500" : "bg-gray-400"
                        )} />
                        <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors flex-1">
                          {item.label}
                        </span>
                        <ChevronRight className="w-3.5 h-3.5 text-gray-300 group-hover:text-gray-500 transition-colors shrink-0" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Pipeline + Interview panels */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              {/* Application pipeline */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-sm font-semibold text-gray-700">Application Pipeline</h2>
                  <button
                    onClick={() => router.push("/applications")}
                    className="text-xs text-blue-600 hover:underline"
                  >
                    View all
                  </button>
                </div>
                <div className="space-y-3">
                  {STAGES.map((stage) => {
                    const count = stageCounts[stage.key as keyof typeof stageCounts];
                    const pct = maxStage > 0 ? (count / maxStage) * 100 : 0;
                    return (
                      <div key={stage.key} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <span className={cn("w-2 h-2 rounded-full shrink-0", stage.dotColor)} />
                            <span className="text-gray-600">{stage.label}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            {count > 0 && (
                              <span className="text-xs text-gray-400">{getStatusAction(stage.key)}</span>
                            )}
                            <span className={cn("font-semibold tabular-nums text-sm", count > 0 ? "text-gray-900" : "text-gray-300")}>
                              {count}
                            </span>
                          </div>
                        </div>
                        <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className={cn("h-full rounded-full", stage.barColor)}
                            initial={{ width: 0 }}
                            animate={{ width: `${pct}%` }}
                            transition={{ duration: 0.5, ease: "easeOut" }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
                {hasReplied && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between text-sm">
                    <span className="text-gray-500">Response rate</span>
                    <span className={cn("font-semibold tabular-nums", responseRate > 30 ? "text-green-600" : "text-gray-600")}>
                      {responseRate}%
                    </span>
                  </div>
                )}
              </div>

              {/* Interview pipeline */}
              <div className="bg-white border border-gray-200 rounded-xl p-5">
                <InterviewPipeline
                  currentStage={
                    stageCounts.Selected > 0 ? "Offer"
                      : stageCounts.Interview > 0 ? "Interview"
                        : stageCounts.Shortlisted > 0 ? "Shortlisted"
                          : "Applied"
                  }
                />
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <OfferTracker offers={[]} />
                </div>
              </div>
            </div>

            {/* Activity feed */}
            <div className="bg-white border border-gray-200 rounded-xl p-5">
              <ActivityStream events={mockActivity} max={5} compact />
            </div>

            {/* Deadlines + Notifications + Timeline */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Priority Deadlines */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Priority Deadlines</h2>
                {upcomingDeadlines.length === 0 ? (
                  <p className="text-sm text-gray-400">No upcoming deadlines</p>
                ) : (
                  <div className="space-y-2">
                    {upcomingDeadlines.map((c) => {
                      const daysLeft = differenceInDays(new Date(c.deadline), new Date());
                      const urgent = daysLeft <= 3;
                      return (
                        <button
                          key={c.id}
                          onClick={() => router.push("/companies")}
                          className="w-full flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-gray-50 transition-colors text-left"
                        >
                          <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", urgent ? "bg-red-500" : "bg-gray-300")} />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm text-gray-900 truncate font-medium">{c.company_name}</p>
                            <p className="text-xs text-gray-500 truncate">{c.role}</p>
                          </div>
                          <p className={cn("text-xs font-semibold tabular-nums shrink-0", urgent ? "text-red-600" : "text-gray-400")}>
                            {daysLeft === 0 ? "Today" : `${daysLeft}d`}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Notifications */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Notifications</h2>
                  {unreadCount > 0 && (
                    <span className="text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  {recentNotifications.map((n) => (
                    <div key={n.id} className="pb-3 border-b border-gray-100 last:border-0 last:pb-0">
                      <p className="text-sm text-gray-600 leading-relaxed">{n.message}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {formatDistanceToNow(new Date(n.created_at), { addSuffix: true })}
                      </p>
                    </div>
                  ))}
                  {recentNotifications.length === 0 && (
                    <p className="text-sm text-gray-400">No notifications</p>
                  )}
                </div>
              </div>

              {/* Timeline */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Timeline</h2>
                <div className="space-y-0">
                  {timelineEvents.slice(0, 5).map((event, i) => {
                    const isLast = i === Math.min(timelineEvents.length, 5) - 1;
                    const dotColors: Record<string, string> = {
                      Applied: "bg-gray-400",
                      Shortlisted: "bg-blue-500",
                      Interview: "bg-amber-500",
                      Selected: "bg-green-500",
                    };
                    const dotColor = dotColors[event.status] || "bg-gray-300";
                    return (
                      <div key={event.id} className="flex gap-2.5">
                        <div className="flex flex-col items-center shrink-0">
                          <div className={cn("w-2 h-2 rounded-full ring-2 ring-white", dotColor, "mt-1.5")} />
                          {!isLast && <div className="w-px flex-1 bg-gray-100 my-1" />}
                        </div>
                        <div className={cn("pb-3 flex-1 min-w-0", isLast && "pb-0")}>
                          <div className="flex items-start justify-between gap-1">
                            <p className="text-sm text-gray-700 leading-tight">{event.label}</p>
                            <p className="text-xs text-gray-400 font-medium tabular-nums shrink-0">{format(event.time, "MMM d")}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {timelineEvents.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">No activity yet.</p>
                )}
              </div>
            </div>

            {/* Resume where you left off */}
            {memory.lastOpenedDriveName && (
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Continue where you left off</p>
                <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg bg-gray-50 border border-gray-200">
                  <Briefcase className="w-4 h-4 text-blue-600" />
                  <span className="text-sm text-gray-700 flex-1">{memory.lastOpenedDriveName}</span>
                  <button
                    onClick={() => memory.addActivity({ type: "viewed_application", label: `Resumed viewing ${memory.lastOpenedDriveName}`, path: "/applications" })}
                    className="text-sm text-blue-600 hover:underline font-medium"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
