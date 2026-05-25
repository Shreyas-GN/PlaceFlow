"use client";

import { useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { RefreshCw, Check, Clock, AlertTriangle } from "lucide-react";

/* ── Auto-save indicator ── */
export function AutoSaveIndicator({
  lastSaved,
  isSaving,
}: {
  lastSaved: Date | null;
  isSaving: boolean;
}) {
  const [display, setDisplay] = useState<"saving" | "saved" | "idle">("idle");

  useEffect(() => {
    if (isSaving) {
      setDisplay("saving");
    } else if (lastSaved) {
      setDisplay("saved");
      const timer = setTimeout(() => setDisplay("idle"), 3000);
      return () => clearTimeout(timer);
    }
  }, [isSaving, lastSaved]);

  if (display === "idle") return null;

  return (
    <div className="flex items-center gap-1.5 text-[11px] text-zinc-600">
      {display === "saving" ? (
        <>
          <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
          <span>Saving changes...</span>
        </>
      ) : (
        <>
          <Check className="w-3 h-3 text-emerald-500" />
          <span>Changes saved automatically</span>
        </>
      )}
    </div>
  );
}

/* ── Syncing indicator ── */
export function SyncIndicator({
  lastSynced,
  isSyncing,
  onRefresh,
}: {
  lastSynced: Date;
  isSyncing: boolean;
  onRefresh?: () => void;
}) {
  const [timeAgo, setTimeAgo] = useState("");

  useEffect(() => {
    const update = () => {
      const seconds = Math.floor((Date.now() - lastSynced.getTime()) / 1000);
      if (seconds < 5) setTimeAgo("just now");
      else if (seconds < 60) setTimeAgo(`${seconds}s ago`);
      else if (seconds < 3600) setTimeAgo(`${Math.floor(seconds / 60)}m ago`);
      else setTimeAgo(`${Math.floor(seconds / 3600)}h ago`);
    };
    update();
    const interval = setInterval(update, 5000);
    return () => clearInterval(interval);
  }, [lastSynced]);

  return (
    <div className="flex items-center gap-2 text-[11px] text-zinc-700">
      <div
        className={cn(
          "w-1.5 h-1.5 rounded-full",
          isSyncing
            ? "bg-amber-500 animate-pulse"
            : "bg-emerald-500/60"
        )}
      />
      <span>
        {isSyncing
          ? "Syncing records..."
          : `Updated ${timeAgo}`}
      </span>
      {isSyncing && (
        <RefreshCw className="w-3 h-3 text-zinc-600 animate-spin" />
      )}
      {onRefresh && !isSyncing && (
        <button
          onClick={onRefresh}
          className="hover:text-zinc-500 transition-colors"
        >
          <RefreshCw className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}

/* ── Timestamp display for system feedback ── */
export function Timestamp({
  date,
  prefix,
}: {
  date: Date;
  prefix?: string;
}) {
  const [label, setLabel] = useState("");

  useEffect(() => {
    const update = () => {
      const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
      if (seconds < 5) setLabel("just now");
      else if (seconds < 60) setLabel(`${seconds} seconds ago`);
      else if (seconds < 120) setLabel("1 minute ago");
      else if (seconds < 3600)
        setLabel(`${Math.floor(seconds / 60)} minutes ago`);
      else if (seconds < 7200) setLabel("1 hour ago");
      else setLabel(`${Math.floor(seconds / 3600)} hours ago`);
    };
    update();
    const interval = setInterval(update, 10000);
    return () => clearInterval(interval);
  }, [date]);

  return (
    <span className="text-[11px] text-zinc-600">
      {prefix && `${prefix} `}{label}
    </span>
  );
}

/* ── Validation state indicator ── */
export function ValidationIndicator({
  state,
  message,
}: {
  state: "valid" | "invalid" | "validating";
  message?: string;
}) {
  return (
    <div className="flex items-center gap-1.5 text-[11px]">
      {state === "validating" && (
        <>
          <RefreshCw className="w-3 h-3 text-amber-500 animate-spin" />
          <span className="text-zinc-600">Validating...</span>
        </>
      )}
      {state === "valid" && (
        <>
          <Check className="w-3 h-3 text-emerald-500" />
          <span className="text-emerald-500">{message || "Valid"}</span>
        </>
      )}
      {state === "invalid" && (
        <>
          <AlertTriangle className="w-3 h-3 text-red-500" />
          <span className="text-red-500">{message || "Invalid"}</span>
        </>
      )}
    </div>
  );
}

/* ── Optimistic update wrapper ── */
export function useOptimistic<T>(initial: T) {
  const [optimisticState, setOptimistic] = useState<T>(initial);
  const [serverState, setServer] = useState<T>(initial);
  const [status, setStatus] = useState<"idle" | "pending" | "confirmed" | "error">("idle");

  const apply = useCallback(
    async (update: T, confirm: () => Promise<T>) => {
      setOptimistic(update);
      setStatus("pending");
      try {
        const result = await confirm();
        setServer(result);
        setOptimistic(result);
        setStatus("confirmed");
        setTimeout(() => setStatus("idle"), 2000);
      } catch {
        setOptimistic(serverState);
        setStatus("error");
        setTimeout(() => setStatus("idle"), 3000);
      }
    },
    [serverState]
  );

  return { state: optimisticState, status, apply };
}
