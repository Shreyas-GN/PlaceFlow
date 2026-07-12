"use client";

import { useMemo, useState } from "react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import {
  Users, Building2, FileCheck, Clock, AlertTriangle,
  RefreshCw, UserPlus, XCircle, CheckCircle2,
  ArrowRight,
} from "lucide-react";

export interface ActivityEvent {
  id: string;
  type:
    | "shortlisted"
    | "eligibility_update"
    | "panel_assigned"
    | "deadline_expiring"
    | "offer_released"
    | "interview_scheduled"
    | "application_submitted"
    | "drive_opened"
    | "slot_conflict"
    | "recruiter_action";
  actor: string;
  target: string;
  detail?: string;
  timestamp: Date;
  severity?: "info" | "warning" | "error" | "success";
}

const ACTIVITY_ICONS = {
  shortlisted: Users,
  eligibility_update: Building2,
  panel_assigned: UserPlus,
  deadline_expiring: Clock,
  offer_released: CheckCircle2,
  interview_scheduled: FileCheck,
  application_submitted: ArrowRight,
  drive_opened: Building2,
  slot_conflict: AlertTriangle,
  recruiter_action: RefreshCw,
};

const ACTIVITY_COLORS: Record<string, string> = {
  shortlisted: "text-blue-600 bg-blue-50",
  eligibility_update: "text-amber-600 bg-amber-50",
  panel_assigned: "text-violet-600 bg-violet-50",
  deadline_expiring: "text-red-600 bg-red-50",
  offer_released: "text-green-600 bg-green-50",
  interview_scheduled: "text-indigo-600 bg-indigo-50",
  application_submitted: "text-gray-500 bg-gray-100",
  drive_opened: "text-green-600 bg-green-50",
  slot_conflict: "text-red-600 bg-red-50",
  recruiter_action: "text-orange-600 bg-orange-50",
};

export function ActivityStream({
  events,
  max = 8,
  showHeader = true,
  compact,
}: {
  events: ActivityEvent[];
  max?: number;
  showHeader?: boolean;
  compact?: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  const displayed = useMemo(
    () => (showAll ? events : events.slice(0, max)),
    [events, showAll, max]
  );

  return (
    <div className={cn("space-y-3", compact && "space-y-1")}>
      {showHeader && (
        <div className="flex items-center justify-between">
          <div className="text-xs font-medium text-gray-500">Activity Stream</div>
          {events.length > max && (
            <button
              onClick={() => setShowAll(!showAll)}
              className="text-[10px] text-gray-400 hover:text-gray-600 transition-colors"
            >
              {showAll ? "Show less" : `View all (${events.length})`}
            </button>
          )}
        </div>
      )}

      <div className="space-y-0">
        {displayed.map((event, i) => {
          const Icon = ACTIVITY_ICONS[event.type] || ArrowRight;
          const isLast = i === displayed.length - 1;
          return (
            <div key={event.id} className="flex gap-2.5">
              <div className="flex flex-col items-center shrink-0">
                <div
                  className={cn(
                    "w-6 h-6 rounded-md flex items-center justify-center",
                    ACTIVITY_COLORS[event.type] || "bg-gray-100 text-gray-400"
                  )}
                >
                  <Icon className="w-3 h-3" />
                </div>
                {!isLast && <div className="w-px flex-1 bg-gray-100 my-1" />}
              </div>
              <div className={cn("pb-3 flex-1 min-w-0", isLast && "pb-0")}>
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className={cn(
                      "text-gray-700",
                      compact ? "text-[12px] leading-tight" : "text-sm"
                    )}>
                      <span className="font-medium text-gray-900">{event.actor}</span>{" "}
                      <span className="text-gray-500">{event.target}</span>
                    </p>
                    {event.detail && (
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {event.detail}
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] text-gray-400 whitespace-nowrap tabular-nums shrink-0 mt-0.5">
                    {formatDistanceToNow(event.timestamp, { addSuffix: true })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <p className="text-xs text-gray-400 py-4 text-center">No activity recorded yet</p>
      )}
    </div>
  );
}

/* ── Mock operational activity data ── */
export function generateMockActivity(): ActivityEvent[] {
  const now = Date.now();
  const companies = ["Adobe", "Amazon", "Google", "Microsoft", "Goldman Sachs", "JP Morgan", "D.E. Shaw", "Flipkart", "Uber", "Stripe"];
  const recruiters = ["R. Mehta", "A. Krishnan", "S. Patel", "V. Sharma", "K. Iyer", "P. Joshi"];
  const coordinators = ["Dr. Verma", "Prof. Nair", "Dr. Gupta", "Prof. Rao"];

  const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];

  return [
    {
      id: "1",
      type: "shortlisted",
      actor: pick(companies),
      target: "shortlisted 12 candidates",
      detail: "Round 1 screening completed. Moving to technical interviews.",
      timestamp: new Date(now - 1000 * 60 * 45),
      severity: "success",
    },
    {
      id: "2",
      type: "eligibility_update",
      actor: pick(companies),
      target: "updated eligibility requirements",
      detail: "Minimum CGPA changed from 8.0 to 8.5. 23 students affected.",
      timestamp: new Date(now - 1000 * 60 * 120),
      severity: "warning",
    },
    {
      id: "3",
      type: "panel_assigned",
      actor: pick(recruiters),
      target: "assigned to Round 2 panel",
      detail: `${pick(coordinators)} approved panel for ${pick(companies)} technical interviews.`,
      timestamp: new Date(now - 1000 * 60 * 180),
      severity: "info",
    },
    {
      id: "4",
      type: "deadline_expiring",
      actor: pick(companies),
      target: "offer acceptance deadline expires tomorrow",
      detail: "5 offers pending response. Automatic decline if not accepted.",
      timestamp: new Date(now - 1000 * 60 * 240),
      severity: "error",
    },
    {
      id: "5",
      type: "offer_released",
      actor: pick(companies),
      target: "released 3 offer letters",
      detail: "Offers sent to shortlisted candidates for SDE-1 role.",
      timestamp: new Date(now - 1000 * 60 * 300),
      severity: "success",
    },
    {
      id: "6",
      type: "interview_scheduled",
      actor: pick(recruiters),
      target: "scheduled 8 interviews",
      detail: "Technical round scheduled for March 15-16.",
      timestamp: new Date(now - 1000 * 60 * 420),
      severity: "info",
    },
    {
      id: "7",
      type: "application_submitted",
      actor: "New applications",
      target: "received from 15 students",
      detail: `For ${pick(companies)} and ${pick(companies)} drives.`,
      timestamp: new Date(now - 1000 * 60 * 540),
      severity: "info",
    },
    {
      id: "8",
      type: "slot_conflict",
      actor: "System",
      target: "detected overlapping interview slots",
      detail: "3 students have conflicting schedules. Reschedule required.",
      timestamp: new Date(now - 1000 * 60 * 660),
      severity: "error",
    },
    {
      id: "9",
      type: "recruiter_action",
      actor: pick(recruiters),
      target: "requested reschedule for 2 interviews",
      detail: `${pick(companies)} panel unavailable on original dates.`,
      timestamp: new Date(now - 1000 * 60 * 800),
      severity: "warning",
    },
    {
      id: "10",
      type: "drive_opened",
      actor: pick(companies),
      target: "opened new placement drive",
      detail: `Role: ${["SDE-1", "Data Analyst", "Product Manager", "Quant Analyst"][Math.floor(Math.random() * 4)]}. Applications open for 7 days.`,
      timestamp: new Date(now - 1000 * 60 * 1000),
      severity: "success",
    },
  ];
}
