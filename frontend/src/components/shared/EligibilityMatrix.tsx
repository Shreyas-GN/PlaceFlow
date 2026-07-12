"use client";

import { cn } from "@/lib/utils";

interface EligibilityRow {
  label: string;
  value: string | number;
  meets: boolean;
  detail?: string;
}

export function EligibilityMatrix({
  rows,
  compact,
}: {
  rows: EligibilityRow[];
  compact?: boolean;
}) {
  return (
    <div className={cn("space-y-1", compact && "space-y-0")}>
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Eligibility Matrix</div>
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-lg",
            row.meets ? "bg-green-50" : "bg-red-50",
            compact && "py-1.5"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                row.meets ? "bg-green-500" : "bg-red-500"
              )}
            />
            <span className="text-xs text-gray-600">{row.label}</span>
          </div>
          <div className="text-right">
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                row.meets ? "text-green-700" : "text-red-600"
              )}
            >
              {row.value}
            </span>
            {row.detail && (
              <p className="text-[10px] text-gray-400">{row.detail}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export function CompactEligibilityGrid({
  rows,
}: {
  rows: { label: string; value: string | number; meets: boolean }[];
}) {
  return (
    <div className="grid grid-cols-2 gap-1.5">
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider col-span-2 mb-1">Eligibility Matrix</div>
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            "flex items-center justify-between px-2 py-1.5 rounded-lg",
            row.meets ? "bg-green-50" : "bg-red-50"
          )}
        >
          <span className="text-[11px] text-gray-600">{row.label}</span>
          <span
            className={cn(
              "text-[11px] font-medium tabular-nums",
              row.meets ? "text-green-700" : "text-red-600"
            )}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
