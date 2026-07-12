"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Download, CheckCircle, AlertTriangle, Info } from "lucide-react";

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
  info: { icon: Info, color: "text-blue-700 bg-blue-50 border-blue-200" },
  warning: { icon: AlertTriangle, color: "text-amber-700 bg-amber-50 border-amber-200" },
  success: { icon: CheckCircle, color: "text-green-700 bg-green-50 border-green-200" },
  export: { icon: Download, color: "text-violet-700 bg-violet-50 border-violet-200" },
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
      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all text-left group"
    >
      <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
        <Download className="w-4 h-4 text-blue-600" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-medium text-gray-900">{label}</p>
        <p className="text-[10px] text-gray-400 tabular-nums">{fileFormat} · {recordCount.toLocaleString()} records</p>
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
