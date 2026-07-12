"use client";

import { useEffect, useState, useMemo, startTransition } from "react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { Skeleton } from "@/components/shared/Skeleton";
import { StatusBar } from "@/components/admin/dashboard/StatusBar";
import { ActionQueue } from "@/components/admin/dashboard/ActionQueue";
import { AnalyticsPanel } from "@/components/admin/dashboard/AnalyticsPanel";
import { RecentApplicationsTable } from "@/components/admin/dashboard/RecentApplicationsTable";

interface AdminApplication {
  id: string;
  student_id: string;
  company_id: string;
  status: string;
  applied_at: string;
  student?: { full_name?: string; department?: string };
  company?: { company_name?: string };
}

export default function AdminDashboard() {
  const [apps, setApps] = useState<AdminApplication[]>([]);
  const [stats, setStats] = useState({ totalApplicants: 0, activeDrives: 0, selectedStudents: 0, pendingReviews: 0 });
  const [lastSynced, setLastSynced] = useState(new Date());
  const [syncing, setSyncing] = useState(false);
  const [lastAutoSave, setLastAutoSave] = useState<Date | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [ready, setReady] = useState(false);

  const loadData = async () => {
    try {
      const [allApps, companies] = await Promise.all([
        adminService.getAllApplications() as Promise<AdminApplication[]>,
        adminService.getAllCompanies(),
      ]);
      startTransition(() => {
        setApps(allApps.slice(0, 20));
        setStats({
          totalApplicants: allApps.length,
          activeDrives: (companies as any[]).length,
          selectedStudents: allApps.filter((a) => a.status === "Selected").length,
          pendingReviews: allApps.filter((a) => a.status === "Applied").length,
        });
        setLastSynced(new Date());
      });
    } catch {
      toast.error("Failed to load dashboard data");
    }
  };

  useEffect(() => {
    startTransition(async () => { await loadData(); setReady(true); });
  }, []);

  useEffect(() => {
    const t = setInterval(() => setLastSynced(new Date()), 30000);
    return () => clearInterval(t);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => {
      setIsSaving(true);
      setTimeout(() => { setIsSaving(false); setLastAutoSave(new Date()); }, 800);
    }, 10000);
    return () => clearTimeout(t);
  }, [lastAutoSave]);

  const handleRefresh = async () => {
    setSyncing(true);
    await loadData();
    setSyncing(false);
  };

  const shortlisted = useMemo(() => apps.filter((a) => a.status === "Shortlisted").length, [apps]);

  const stageCounts = useMemo(() => ({
    Applied: apps.filter((a) => a.status === "Applied").length,
    Screening: apps.filter((a) => a.status === "Screening" || a.status === "Shortlisted").length,
    Technical: apps.filter((a) => a.status === "Technical" || a.status === "Interview").length,
    HR: apps.filter((a) => a.status === "HR").length,
    Offer: apps.filter((a) => a.status === "Selected" || a.status === "Offer").length,
  }), [apps]);

  const funnelStages = useMemo(() => [
    { key: "applied", label: "Applied", count: stageCounts.Applied, color: "bg-blue-500" },
    { key: "screening", label: "Screening / Shortlisted", count: stageCounts.Screening, color: "bg-indigo-500" },
    { key: "technical", label: "Technical / Interview", count: stageCounts.Technical, color: "bg-violet-500" },
    { key: "hr", label: "HR Round", count: stageCounts.HR, color: "bg-pink-500" },
    { key: "offer", label: "Offer / Selected", count: stageCounts.Offer, color: "bg-emerald-500" },
  ], [stageCounts]);

  if (!ready) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-7 w-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <Skeleton className="h-64 w-full rounded-xl" />
          <Skeleton className="h-64 w-full rounded-xl" />
        </div>
        <Skeleton className="h-48 w-full rounded-xl" />
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Zone 1 — Status Bar */}
      <StatusBar
        lastSynced={lastSynced}
        isSyncing={syncing}
        lastAutoSave={lastAutoSave}
        isSaving={isSaving}
        onRefresh={handleRefresh}
      />

      {/* Zone 2 + 3 — Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <ActionQueue stats={stats} shortlisted={shortlisted} lastSynced={lastSynced} />
        <AnalyticsPanel stageCounts={stageCounts} funnelStages={funnelStages} totalApplicants={stats.totalApplicants} />
      </div>

      {/* Recent applications */}
      <RecentApplicationsTable applications={apps} />
    </div>
  );
}
