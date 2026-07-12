"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { getMonth, getWeek } from "date-fns";
import { Activity, AlertTriangle } from "lucide-react";

type SeasonPhase = "pre-placement" | "peak" | "mid" | "low" | "off-season";

interface SeasonConfig {
  phase: SeasonPhase;
  label: string;
  description: string;
  intensity: number;
  color: string;
  bgColor: string;
  borderColor: string;
  barColor: string;
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
      color: "text-green-700",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      barColor: "bg-green-500",
    };
  }
  if (MONTH >= 6 || MONTH === 10) {
    return {
      phase: "mid",
      label: "Mid Placement Season",
      description: "Moderate recruitment activity — active drives ongoing",
      intensity: 0.7,
      color: "text-blue-700",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      barColor: "bg-blue-500",
    };
  }
  if (MONTH >= 0 && MONTH <= 2) {
    return {
      phase: "pre-placement",
      label: "Pre-placement Season",
      description: "Preparation phase — companies finalizing recruitment plans",
      intensity: 0.4,
      color: "text-amber-700",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      barColor: "bg-amber-500",
    };
  }
  if (MONTH >= 3 && MONTH <= 5) {
    return {
      phase: "low",
      label: "Low Activity Period",
      description: "Between placement cycles — minimal active drives",
      intensity: 0.2,
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      barColor: "bg-gray-400",
    };
  }
  return {
    phase: "off-season",
    label: "Off Season",
    description: "No active placement activity",
    intensity: 0.1,
    color: "text-gray-400",
    bgColor: "bg-gray-50",
    borderColor: "border-gray-100",
    barColor: "bg-gray-300",
  };
}

export function SeasonalityIndicator() {
  const season = useMemo(() => getCurrentSeason(), []);

  return (
    <div className={cn("px-3 py-2 rounded-xl border", season.bgColor, season.borderColor)}>
      <div className="flex items-center gap-2">
        <div className={cn("w-2 h-2 rounded-full shrink-0", season.barColor)} />
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <span className={cn("text-[11px] font-semibold", season.color)}>{season.label}</span>
            <span className="text-[10px] text-gray-400 tabular-nums">W{WEEK}</span>
          </div>
          <p className="text-[10px] text-gray-500 mt-0.5">{season.description}</p>
        </div>
        <div className="ml-auto shrink-0 flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-1.5 h-4 rounded-full transition-all",
                i / 5 < season.intensity ? season.barColor : "bg-gray-200"
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
      <div className="flex items-center gap-1.5 text-gray-500">
        <Activity className="w-3 h-3" />
        <span className="tabular-nums">{activeDrives}</span> active drives
      </div>
      {peakDays !== undefined && peakDays > 0 && (
        <div className="flex items-center gap-1.5 text-amber-600">
          <AlertTriangle className="w-3 h-3" />
          <span>
            Peak placement activity — <strong className="tabular-nums">{peakDays}</strong> days this week
          </span>
        </div>
      )}
    </div>
  );
}
