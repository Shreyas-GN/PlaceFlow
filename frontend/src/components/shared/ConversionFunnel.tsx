"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";

interface FunnelStage {
  key: string;
  label: string;
  count: number;
  color: string;
}

interface ConversionFunnelProps {
  stages: FunnelStage[];
  total: number;
  className?: string;
}

export function ConversionFunnel({ stages, total, className }: ConversionFunnelProps) {
  const maxCount = useMemo(() => Math.max(...stages.map(s => s.count), 1), [stages]);

  return (
    <div className={cn("space-y-0.5", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-500">Application Conversion Funnel</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
          <span className="text-[10px] text-gray-400 tabular-nums">{total} total entries</span>
        </div>
      </div>
      <div className="space-y-1.5">
        {stages.map((stage, i) => {
          const pct = maxCount > 0 ? (stage.count / maxCount) * 100 : 0;
          const overallPct = total > 0 ? (stage.count / total) * 100 : 0;
          const dropPct = i > 0 && stages[i - 1].count > 0
            ? ((stages[i - 1].count - stage.count) / stages[i - 1].count) * 100
            : null;

          return (
            <div key={stage.key} className="space-y-0.5">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 min-w-0">
                  <div className={cn("w-2 h-2 rounded-full shrink-0", stage.color)} />
                  <span className="text-gray-500 truncate">{stage.label}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-gray-900 font-semibold tabular-nums w-12 text-right">{stage.count}</span>
                  <span className="text-gray-400 w-10 text-right tabular-nums">{overallPct.toFixed(1)}%</span>
                  {dropPct !== null && (
                    <span className={cn(
                      "text-[10px] w-10 text-right tabular-nums",
                      dropPct > 30 ? "text-red-500" : dropPct > 10 ? "text-amber-500" : "text-green-500"
                    )}>
                      -{dropPct.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-2 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className={cn("absolute inset-y-0 left-0 rounded-full transition-all duration-500", stage.color)}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function FunnelMetrics({ stages, total }: { stages: FunnelStage[]; total: number }) {
  const metrics = useMemo(() => {
    if (stages.length < 2 || total === 0) return [];
    const first = stages[0].count;
    const last = stages[stages.length - 1].count;
    return [
      { label: "Overall conversion", value: total > 0 ? `${((last / first) * 100).toFixed(1)}%` : "—" },
      { label: "Average drop-off", value: stages.length > 1 ? `${((1 - (last / first) ** (1 / (stages.length - 1))) * 100).toFixed(1)}%/stage` : "—" },
      { label: "Largest drop", value: (() => {
        let maxDrop = 0;
        for (let i = 1; i < stages.length; i++) {
          if (stages[i - 1].count > 0) {
            const drop = (stages[i - 1].count - stages[i].count) / stages[i - 1].count;
            maxDrop = Math.max(maxDrop, drop);
          }
        }
        return `${(maxDrop * 100).toFixed(0)}%`;
      })() },
    ];
  }, [stages, total]);

  return (
    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-gray-100">
      {metrics.map((m) => (
        <div key={m.label} className="text-center">
          <p className="text-[18px] font-bold text-gray-900 tabular-nums">{m.value}</p>
          <p className="text-[10px] text-gray-400">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
