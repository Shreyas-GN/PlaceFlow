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
      <div className="op-label text-zinc-500 mb-2">Eligibility Matrix</div>
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            "flex items-center justify-between px-3 py-2 rounded-lg",
            row.meets ? "bg-emerald-500/[0.04]" : "bg-red-500/[0.04]",
            compact && "py-1.5"
          )}
        >
          <div className="flex items-center gap-2 min-w-0">
            <div
              className={cn(
                "w-1.5 h-1.5 rounded-full shrink-0",
                row.meets ? "bg-emerald-500" : "bg-red-500"
              )}
            />
            <span className="text-xs text-zinc-400">{row.label}</span>
          </div>
          <div className="text-right">
            <span
              className={cn(
                "text-xs font-medium tabular-nums",
                row.meets ? "text-emerald-400" : "text-red-400"
              )}
            >
              {row.value}
            </span>
            {row.detail && (
              <p className="text-[10px] text-zinc-600">{row.detail}</p>
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
      <div className="op-label text-zinc-500 col-span-2 mb-1">Eligibility Matrix</div>
      {rows.map((row) => (
        <div
          key={row.label}
          className={cn(
            "flex items-center justify-between px-2 py-1.5 rounded",
            row.meets ? "bg-emerald-500/[0.04]" : "bg-red-500/[0.04]"
          )}
        >
          <span className="text-[11px] text-zinc-500">{row.label}</span>
          <span
            className={cn(
              "text-[11px] font-medium tabular-nums",
              row.meets ? "text-emerald-400" : "text-red-400"
            )}
          >
            {row.value}
          </span>
        </div>
      ))}
    </div>
  );
}
