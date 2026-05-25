"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  Archive, Clock, AlertTriangle, Ban, FileText,
  FolderClosed, Bell, Timer,
} from "lucide-react";
import { formatDistanceToNow, subDays, subHours } from "date-fns";

/* ── Archived Drives ── */
export function ArchivedDrivesBar({
  count,
  compact,
}: {
  count: number;
  compact?: boolean;
}) {
  return (
    <div className={cn(
      "flex items-center gap-2 px-3 py-2 rounded-lg bg-zinc-800/20 border border-zinc-800/40",
      compact && "px-2 py-1"
    )}>
      <Archive className={cn("text-zinc-600", compact ? "w-3 h-3" : "w-3.5 h-3.5")} />
      <span className={cn("text-zinc-500", compact ? "text-[11px]" : "text-xs")}>
        <strong className="text-zinc-400 tabular-nums">{count}</strong> archived drives
      </span>
    </div>
  );
}

/* ── Expiring Records ── */
export function ExpiringRecords({
  records,
}: {
  records: { id: string; label: string; expiresIn: string }[];
}) {
  return (
    <div className="space-y-1">
      <div className="op-label text-zinc-500">Records Expiring</div>
      {records.map((r) => (
        <div key={r.id} className="flex items-center gap-2 px-3 py-1.5 rounded bg-rose-500/[0.04] border border-rose-500/10">
          <Timer className="w-3 h-3 text-rose-500 shrink-0" />
          <span className="text-[12px] text-zinc-400 flex-1">{r.label}</span>
          <span className="text-[11px] text-rose-400 tabular-nums font-medium">{r.expiresIn}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Notification Overflow ── */
export function NotificationOverflow({
  total,
  unread,
}: {
  total: number;
  unread: number;
}) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-layer-3 border border-zinc-800/40">
      <Bell className="w-3.5 h-3.5 text-zinc-600" />
      <span className="text-xs text-zinc-500">
        <strong className="text-zinc-400 tabular-nums">{total}</strong> notifications
        {unread > 0 && (
          <span className="text-amber-400 ml-1">
            ({unread} unread)
          </span>
        )}
      </span>
    </div>
  );
}

/* ── Crowded Timeline Indicator ── */
export function CrowdedTimeline({
  items,
}: {
  items: { time: string; label: string }[];
}) {
  return (
    <div className="space-y-0.5">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 px-2 py-1 rounded hover:bg-zinc-800/20 transition-colors">
          <div className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
          <span className="text-[11px] text-zinc-600 tabular-nums w-12 shrink-0">{item.time}</span>
          <span className="text-[12px] text-zinc-400 truncate">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Mixed Statuses Grid ── */
export function StatusDistribution({
  statuses,
}: {
  statuses: { label: string; count: number; color: string }[];
}) {
  const total = statuses.reduce((a, b) => a + b.count, 0);
  return (
    <div className="space-y-1">
      {statuses.map((s) => (
        <div key={s.label} className="flex items-center gap-2">
          <div className={cn("w-1.5 h-1.5 rounded-full shrink-0", s.color)} />
          <span className="text-[12px] text-zinc-500 flex-1">{s.label}</span>
          <span className="text-xs text-zinc-400 tabular-nums font-medium">{s.count}</span>
          <div className="w-20 h-1.5 bg-zinc-800/60 rounded-full overflow-hidden">
            <div
              className={cn("h-full rounded-full", s.color)}
              style={{ width: `${total > 0 ? (s.count / total) * 100 : 0}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── Delayed Actions List ── */
export function DelayedActions({
  actions,
}: {
  actions: { label: string; delay: string; assignee: string }[];
}) {
  return (
    <div className="space-y-1">
      <div className="op-label text-zinc-500">Delayed Actions</div>
      {actions.map((a, i) => (
        <div key={i} className="flex items-center gap-2 px-3 py-1.5 rounded bg-orange-500/[0.04] border border-orange-500/10">
          <Clock className="w-3 h-3 text-orange-500 shrink-0" />
          <span className="text-[12px] text-zinc-400 flex-1">{a.label}</span>
          <span className="text-[10px] text-orange-400 tabular-nums">{a.delay}</span>
          <span className="text-[10px] text-zinc-600">{a.assignee}</span>
        </div>
      ))}
    </div>
  );
}

/* ── Generate mock operational wear data ── */
export function useOperationalWear() {
  return useMemo(() => ({
    recentRecruiters: [
      { name: "Rahul Mehta", company: "Adobe", lastActive: subHours(new Date(), 2) },
      { name: "Ananya Krishnan", company: "Amazon", lastActive: subHours(new Date(), 5) },
      { name: "Siddharth Patel", company: "Google", lastActive: subHours(new Date(), 8) },
      { name: "Priya Sharma", company: "Microsoft", lastActive: subDays(new Date(), 1) },
      { name: "Vikram Iyer", company: "Goldman Sachs", lastActive: subDays(new Date(), 2) },
      { name: "Kavita Joshi", company: "JP Morgan", lastActive: subDays(new Date(), 3) },
    ],
    archivedDrives: [
      { name: "D.E. Shaw - SDE-1", archivedDate: subDays(new Date(), 45) },
      { name: "Flipkart - Data Analyst", archivedDate: subDays(new Date(), 30) },
      { name: "Uber - Product Manager", archivedDate: subDays(new Date(), 22) },
    ],
    expiringOffers: [
      { id: "o1", label: "Stripe SDE-1 offer", daysLeft: 2 },
      { id: "o2", label: "Adobe Internship offer", daysLeft: 1 },
    ],
    crowdedTimeline: [
      { time: "09:15", label: "Adobe shortlisted 12 candidates" },
      { time: "09:42", label: "Amazon updated CGPA criteria" },
      { time: "10:00", label: "Interview panel assigned to Round 2" },
      { time: "10:30", label: "3 slot conflicts detected" },
      { time: "11:00", label: "Goldman Sachs panel rescheduled" },
      { time: "11:15", label: "Microsoft released 2 offers" },
      { time: "11:30", label: "5 new applications received" },
      { time: "11:45", label: "System auto-archived completed drives" },
    ],
    mixedStatuses: [
      { label: "Approved", count: 47, color: "bg-emerald-500" },
      { label: "Pending", count: 23, color: "bg-amber-500" },
      { label: "In Review", count: 15, color: "bg-blue-500" },
      { label: "Conflict", count: 8, color: "bg-red-500" },
      { label: "On Hold", count: 5, color: "bg-zinc-600" },
      { label: "Expiring", count: 3, color: "bg-rose-500" },
    ],
    delayedActions: [
      { label: "Interview feedback - Round 2", delay: "Overdue 2d", assignee: "R. Mehta" },
      { label: "Eligibility verification", delay: "Overdue 1d", assignee: "Coord. Desk" },
      { label: "Offer letter approval", delay: "Pending 3d", assignee: "Dean's Office" },
    ],
  }), []);
}
