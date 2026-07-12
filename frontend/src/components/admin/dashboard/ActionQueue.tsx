"use client";

import { useMemo } from "react";
import { AlertCircle, Users, Building2, Timer, RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AlertCard, type AlertItem } from "./AlertCard";
import { MetricsBadge } from "./MetricsBadge";
import { cn } from "@/lib/utils";

interface ActionQueueProps {
  stats: {
    totalApplicants: number;
    activeDrives: number;
    selectedStudents: number;
    pendingReviews: number;
  };
  shortlisted: number;
  lastSynced: Date;
}

export function ActionQueue({ stats, shortlisted, lastSynced }: ActionQueueProps) {
  const alertItems = useMemo<AlertItem[]>(() => {
    const items: AlertItem[] = [];
    if (stats.pendingReviews > 0) {
      items.push({
        id: "review",
        label: `${stats.pendingReviews} applicant${stats.pendingReviews !== 1 ? "s" : ""} pending review`,
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
        label: "No active placement drives — create one to start collecting applications",
        urgency: "medium",
        action: "/admin/companies",
        actionLabel: "Create Drive",
      });
    }
    return items;
  }, [stats.pendingReviews, shortlisted, stats.activeDrives]);

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-start justify-between gap-4 mb-5">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Overview</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Synced {formatDistanceToNow(lastSynced, { addSuffix: true })}
          </p>
        </div>
        <div className="flex items-center gap-1.5 bg-green-50 border border-green-200 rounded-full px-2.5 py-1 shrink-0">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-xs font-medium text-green-700">Online</span>
        </div>
      </div>

      {alertItems.length > 0 && (
        <div className="p-3 rounded-lg bg-gray-50 border border-gray-200 mb-5">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-3.5 h-3.5 text-gray-500" />
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Action Required</span>
          </div>
          <div className="space-y-1.5">
            {alertItems.map((item) => (
              <AlertCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 flex-wrap">
        <MetricsBadge icon={Users} value={stats.totalApplicants} label="applicants" />
        <MetricsBadge icon={Building2} value={stats.activeDrives} label="active drives" />
        <MetricsBadge icon={Timer} value={stats.pendingReviews} label="awaiting review" />
      </div>
    </div>
  );
}
