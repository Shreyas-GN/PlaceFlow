"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AlertItem {
  id: string;
  label: string;
  urgency: "high" | "medium" | "low";
  action: string;
  actionLabel: string;
}

interface AlertCardProps {
  item: AlertItem;
}

export function AlertCard({ item }: AlertCardProps) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-gray-300 transition-colors">
      <div
        className={cn(
          "w-1.5 h-1.5 rounded-full shrink-0",
          item.urgency === "high" ? "bg-amber-500" : item.urgency === "medium" ? "bg-blue-500" : "bg-gray-400"
        )}
      />
      <span className="text-sm text-gray-600 flex-1">{item.label}</span>
      <Link
        href={item.action}
        className="text-xs font-medium text-blue-600 hover:text-blue-700 transition-colors shrink-0"
      >
        {item.actionLabel}
      </Link>
      <ChevronRight className="w-3.5 h-3.5 text-gray-300 shrink-0" />
    </div>
  );
}
