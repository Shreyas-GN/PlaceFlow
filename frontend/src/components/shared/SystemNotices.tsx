"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Download, FileText, CheckCircle, Clock, AlertTriangle, Info } from "lucide-react";

interface SystemNotice {
  id: string;
  type: "info" | "warning" | "success" | "export";
  message: string;
  detail?: string;
  timestamp: Date;
  action?: { label: string; onClick: () => void };
}

interface SystemNoticesProps {
  notices: SystemNotice[];
  compact?: boolean;
}

const TYPE_STYLES = {
  info: { icon: Info, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  warning: { icon: AlertTriangle, color: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
  success: { icon: CheckCircle, color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  export: { icon: Download, color: "text-violet-400 bg-violet-500/10 border-violet-500/20" },
};

export function SystemNotices({ notices, compact }: SystemNoticesProps) {
  return (
    <div className={cn("space-y-1.5", compact && "space-y-0")}>
      {notices.map((notice) => {
        const style = TYPE_STYLES[notice.type];
        const Icon = style.icon;
        return (
          <div
            key={notice.id}
            className={cn(
              "flex items-start gap-2.5 px-3 py-2 rounded-lg border",
              style.color,
              compact && "py-1.5"
            )}
          >
            <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className={cn("text-xs font-medium", compact && "text-[11px]")}>{notice.message}</p>
              {notice.detail && (
                <p className={cn("text-[11px] opacity-70 mt-0.5", compact && "text-[10px]")}>{notice.detail}</p>
              )}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[10px] opacity-50">
                  {format(notice.timestamp, "MMM dd, HH:mm")}
                </span>
                {notice.action && (
                  <button
                    onClick={notice.action.onClick}
                    className="text-[10px] font-medium underline opacity-80 hover:opacity-100 transition-opacity"
                  >
                    {notice.action.label}
                  </button>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ExportButton({ label, recordCount, format: fileFormat }: { label: string; recordCount: number; format: string }) {
  return (
    <button
      onClick={() => {/* Export logic */}}
      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-layer-2 border border-zinc-800/60 hover:border-primary/30 hover:bg-primary/5 transition-all text-left group"
    >
      <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
        <Download className="w-4 h-4 text-primary" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-zinc-300">{label}</p>
        <p className="text-[10px] text-zinc-600 tabular-nums">{fileFormat} · {recordCount.toLocaleString()} records</p>
      </div>
    </button>
  );
}

export function useSystemNotices(): SystemNotice[] {
  return useMemo(() => [
    {
      id: "export-1",
      type: "export",
      message: "Export generated successfully",
      detail: "CSV · 3,842 records · Placement data Q2 2026",
      timestamp: new Date(),
    },
    {
      id: "sync-1",
      type: "success",
      message: "All data synced across placement drives",
      detail: "Last sync completed without errors",
      timestamp: new Date(Date.now() - 1000 * 60 * 5),
    },
    {
      id: "warning-1",
      type: "warning",
      message: "3 drives approaching deadline within 48 hours",
      detail: "Adobe, Amazon, Goldman Sachs applications closing soon",
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
    },
  ], []);
}
