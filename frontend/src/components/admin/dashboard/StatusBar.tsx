"use client";

import { RefreshCw } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface StatusBarProps {
  lastSynced: Date;
  isSyncing: boolean;
  lastAutoSave: Date | null;
  isSaving: boolean;
  onRefresh: () => void;
}

export function StatusBar({ lastSynced, isSyncing, lastAutoSave, isSaving, onRefresh }: StatusBarProps) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-xs text-gray-400">
        Last synced {formatDistanceToNow(lastSynced, { addSuffix: true })}
      </p>
      <button
        onClick={onRefresh}
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
      >
        <RefreshCw className={cn("w-3.5 h-3.5", isSyncing && "animate-spin")} />
        Refresh
      </button>
    </div>
  );
}
