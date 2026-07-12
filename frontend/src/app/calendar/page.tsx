"use client";

import { useEffect, useState } from "react";
import { calendarService, CalendarEvent } from "@/services/calendar.service";
import { CalendarDays, Clock } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const TYPE_COLORS: Record<string, string> = {
  Interview:    "bg-blue-50 text-blue-700 border-blue-200",
  OA:           "bg-violet-50 text-violet-700 border-violet-200",
  Deadline:     "bg-red-50 text-red-700 border-red-200",
  CompanyVisit: "bg-emerald-50 text-emerald-700 border-emerald-200",
  Notice:       "bg-gray-100 text-gray-500 border-gray-200",
};

export default function CalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");

  useEffect(() => {
    calendarService.listEvents()
      .then(setEvents)
      .catch(() => toast.error("Failed to load calendar"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === "all" ? events : events.filter((e) => e.event_type === filter);
  const types = ["all", "Interview", "OA", "Deadline", "CompanyVisit", "Notice"];

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => <div key={i} className="h-20 rounded-xl bg-gray-100" />)}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <CalendarDays className="w-5 h-5 text-blue-600" />
        <h1 className="text-lg font-semibold text-gray-900">Calendar</h1>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={cn(
              "text-xs px-2.5 py-1 rounded-full border transition-colors font-medium",
              filter === t
                ? "bg-blue-50 text-blue-700 border-blue-200"
                : "border-gray-200 text-gray-500 hover:border-gray-300 hover:text-gray-700 bg-white"
            )}
          >
            {t === "all" ? "All" : t}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-12">No events scheduled</p>
      )}

      <div className="space-y-2">
        {filtered.map((event) => (
          <div key={event.id} className="rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors">
            <div className="flex items-start gap-3">
              <div className="shrink-0 mt-0.5">
                <span className={cn("text-[10px] px-1.5 py-0.5 rounded border font-medium uppercase tracking-wide", TYPE_COLORS[event.event_type])}>
                  {event.event_type}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-medium text-sm text-gray-900">{event.title}</p>
                {event.description && (
                  <p className="text-xs text-gray-500 mt-0.5">{event.description}</p>
                )}
                <div className="flex items-center gap-3 mt-2 text-[10px] text-gray-400">
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(event.start_time).toLocaleString()}
                  </span>
                  {event.end_time && (
                    <span>→ {new Date(event.end_time).toLocaleString()}</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
