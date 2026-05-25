"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { format, getMonth, getWeek } from "date-fns";
import { Activity, Calendar, Clock, AlertTriangle } from "lucide-react";

type SeasonPhase = "pre-placement" | "peak" | "mid" | "low" | "off-season";

interface SeasonConfig {
  phase: SeasonPhase;
  label: string;
  description: string;
  intensity: number;
  color: string;
  bgColor: string;
  borderColor: string;
}

const MONTH = getMonth(new Date());
const WEEK = getWeek(new Date());

function getCurrentSeason(): SeasonConfig {
  if (MONTH >= 7 && MONTH <= 9) {
    return {
      phase: "peak",
      label: "Peak Placement Season",
      description: "High recruitment activity — multiple active drives and interview cycles",
      intensity: 1.0,
      color: "text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    };
  }
  if (MONTH >= 6 || MONTH === 10) {
    return {
      phase: "mid",
      label: "Mid Placement Season",
      description: "Moderate recruitment activity — active drives ongoing",
      intensity: 0.7,
      color: "text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    };
  }
  if (MONTH >= 0 && MONTH <= 2) {
    return {
      phase: "pre-placement",
      label: "Pre-placement Season",
      description: "Preparation phase — companies finalizing recruitment plans",
      intensity: 0.4,
      color: "text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    };
  }
  if (MONTH >= 3 && MONTH <= 5) {
    return {
      phase: "low",
      label: "Low Activity Period",
      description: "Between placement cycles — minimal active drives",
      intensity: 0.2,
      color: "text-zinc-400",
      bgColor: "bg-zinc-500/10",
      borderColor: "border-zinc-500/20",
    };
  }
  return {
    phase: "off-season",
    label: "Off Season",
    description: "No active placement activity",
    intensity: 0.1,
    color: "text-zinc-500",
    bgColor: "bg-zinc-500/5",
    borderColor: "border-zinc-500/10",
  };
}

export function SeasonalityIndicator() {
  const season = useMemo(() => getCurrentSeason(), []);

  return (
    <div className={cn("px-3 py-2 rounded-lg border", season.bgColor, season.borderColor)}>
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full shrink-0", season.color.replace("text-", "bg-"))} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={cn("text-[11px] font-semibold", season.color)}>{season.label}</span>
            <span className="text-[10px] text-zinc-600 tabular-nums">W{WEEK}</span>
          </div>
          <p className="text-[10px] text-zinc-500 mt-0.5">{season.description}</p>
        </div>
        <div className="ml-auto shrink-0 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-4 rounded-full transition-all",
                i / 5 < season.intensity ? season.color.replace("text-", "bg-").replace("-400", "-500/60") : "bg-zinc-800"
              )}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ActiveDriveCountdown({ activeDrives, peakDays }: { activeDrives: number; peakDays?: number }) {
  return (
    <div className="flex items-center gap-3 text-xs">
      <div className="flex items-center gap-1.5 text-zinc-500">
        <Activity className="w-3 h-3" />
        <span className="tabular-nums">{activeDrives}</span> active drives
      </div>
      {peakDays !== undefined && peakDays > 0 && (
        <div className="flex items-center gap-1.5 text-amber-400">
          <AlertTriangle className="w-3 h-3" />
          <span>
            Peak placement activity — <strong className="tabular-nums">{peakDays}</strong> days this week
          </span>
        </div>
      )}
    </div>
  );
}
