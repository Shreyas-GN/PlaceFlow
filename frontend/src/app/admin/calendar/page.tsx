"use client";

import { useEffect, useState } from "react";
import { calendarService, CalendarEvent, CalendarEventCreate } from "@/services/calendar.service";
import { CalendarDays, Plus, Trash2, X, Check } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BLANK: CalendarEventCreate = {
  title: "",
  event_type: "Notice",
  start_time: "",
};

const TYPE_COLORS: Record<string, string> = {
  Interview:    "bg-blue-50 text-blue-700 border border-blue-200",
  OA:           "bg-violet-50 text-violet-700 border border-violet-200",
  Deadline:     "bg-red-50 text-red-700 border border-red-200",
  CompanyVisit: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  Notice:       "bg-gray-100 text-gray-500 border border-gray-200",
};

const INPUT_CLS = "bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";

export default function AdminCalendarPage() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CalendarEventCreate>(BLANK);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    calendarService.adminListEvents()
      .then(setEvents)
      .catch(() => toast.error("Failed to load events"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.start_time) {
      toast.error("Title and start time are required");
      return;
    }
    setSubmitting(true);
    try {
      await calendarService.create(form);
      toast.success("Event created");
      setShowForm(false);
      setForm(BLANK);
      load();
    } catch {
      toast.error("Failed to create event");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this event?")) return;
    try {
      await calendarService.delete(id);
      toast.success("Event deleted");
      load();
    } catch {
      toast.error("Failed to delete event");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="w-5 h-5 text-blue-600" />
        <h1 className="text-lg font-semibold text-gray-900">Calendar</h1>
        <button
          onClick={() => { setForm(BLANK); setShowForm(true); }}
          className="ml-auto flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-[10px] hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> Add Event
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">New Event</h2>
          <input
            className={INPUT_CLS}
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className={`${INPUT_CLS} resize-none`}
            placeholder="Description (optional)"
            rows={2}
            value={form.description || ""}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-3 flex-wrap items-end">
            <select
              className="bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              value={form.event_type}
              onChange={(e) => setForm({ ...form, event_type: e.target.value })}
            >
              {["Interview", "OA", "Deadline", "CompanyVisit", "Notice"].map((t) => <option key={t}>{t}</option>)}
            </select>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 font-medium">Start time</label>
              <input
                type="datetime-local"
                className="bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
                value={form.start_time}
                onChange={(e) => setForm({ ...form, start_time: e.target.value })}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-gray-400 font-medium">End time (optional)</label>
              <input
                type="datetime-local"
                className="bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-blue-500"
                value={form.end_time || ""}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-[10px] hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
            >
              <Check className="w-3.5 h-3.5" /> {submitting ? "Saving…" : "Save"}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="flex items-center gap-1.5 text-xs text-gray-500 border border-gray-300 px-3 py-1.5 rounded-[10px] hover:bg-gray-50 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> Cancel
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1,2,3].map((i) => <div key={i} className="h-16 rounded-xl bg-gray-100" />)}
        </div>
      ) : (
        <div className="space-y-2">
          {events.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">No events scheduled</p>
          )}
          {events.map((e) => (
            <div key={e.id} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors">
              <span className={cn("shrink-0 text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide mt-0.5", TYPE_COLORS[e.event_type])}>
                {e.event_type}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{e.title}</p>
                {e.description && <p className="text-xs text-gray-500 mt-0.5">{e.description}</p>}
                <p className="text-[10px] text-gray-400 mt-1">
                  {new Date(e.start_time).toLocaleString()}
                  {e.end_time && ` → ${new Date(e.end_time).toLocaleString()}`}
                </p>
              </div>
              <button
                onClick={() => handleDelete(e.id)}
                className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors shrink-0"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
