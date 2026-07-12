"use client";

import type { LucideIcon } from "lucide-react";

interface MetricsBadgeProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
}

export function MetricsBadge({ icon: Icon, value, label }: MetricsBadgeProps) {
  return (
    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gray-50 border border-gray-200">
      <Icon className="w-3.5 h-3.5 text-gray-400" />
      <span className="text-sm text-gray-500">
        <strong className="text-gray-900 tabular-nums font-semibold">{value}</strong>{" "}
        {label}
      </span>
    </div>
  );
}
