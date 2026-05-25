"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
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
        <span className="op-label text-zinc-500">Application Conversion Funnel</span>
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60" />
          <span className="text-[10px] text-zinc-600 tabular-nums">{total} total entries</span>
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
                  <span className="text-zinc-400 truncate">{stage.label}</span>
                </div>
                <div className="flex items-center gap-3 shrink-0 ml-3">
                  <span className="text-zinc-200 font-semibold tabular-nums w-12 text-right">{stage.count}</span>
                  <span className="text-zinc-600 w-10 text-right tabular-nums">{overallPct.toFixed(1)}%</span>
                  {dropPct !== null && (
                    <span className={cn(
                      "text-[10px] w-10 text-right tabular-nums",
                      dropPct > 30 ? "text-rose-500" : dropPct > 10 ? "text-amber-500" : "text-emerald-500"
                    )}>
                      -{dropPct.toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>
              <div className="relative h-2 rounded-full bg-zinc-800/60 overflow-hidden">
                <motion.div
                  className={cn("absolute inset-y-0 left-0 rounded-full", stage.color.replace("bg-", "bg-").replace("500", "500/80"))}
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6, ease: "easeOut", delay: i * 0.08 }}
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
    <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-zinc-800/20">
      {metrics.map((m) => (
        <div key={m.label} className="text-center">
          <p className="text-[18px] font-bold text-zinc-200 tabular-nums">{m.value}</p>
          <p className="text-[10px] text-zinc-600">{m.label}</p>
        </div>
      ))}
    </div>
  );
}
