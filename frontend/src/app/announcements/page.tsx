"use client";

import { useEffect, useState } from "react";
import { announcementService, Announcement } from "@/services/announcement.service";
import { Bell, AlertTriangle, Info, Calendar } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const PRIORITY_STYLES: Record<string, string> = {
  Urgent: "border-red-200 bg-red-50",
  Important: "border-amber-200 bg-amber-50",
  Normal: "border-gray-200 bg-white",
};

const PRIORITY_ICON: Record<string, React.ReactNode> = {
  Urgent: <AlertTriangle className="w-4 h-4 text-red-500" />,
  Important: <Bell className="w-4 h-4 text-amber-500" />,
  Normal: <Info className="w-4 h-4 text-gray-400" />,
};

const CATEGORY_LABEL: Record<string, string> = {
  Drive: "Placement Drive",
  Update: "Update",
  Deadline: "Deadline",
  Notice: "Notice",
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    announcementService.getActive()
      .then(setAnnouncements)
      .catch(() => toast.error("Failed to load announcements"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-3 animate-pulse">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 rounded-xl bg-gray-100" />
        ))}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="flex items-center gap-2 mb-6">
        <Bell className="w-5 h-5 text-blue-600" />
        <h1 className="text-lg font-semibold text-gray-900">Announcements</h1>
        <span className="ml-auto text-xs text-gray-400">{announcements.length} active</span>
      </div>

      {announcements.length === 0 && (
        <p className="text-center text-gray-400 text-sm py-12">No active announcements</p>
      )}

      {announcements.map((a) => (
        <div key={a.id} className={cn("rounded-xl border p-4", PRIORITY_STYLES[a.priority])}>
          <div className="flex items-start gap-3">
            <div className="shrink-0 mt-0.5">{PRIORITY_ICON[a.priority]}</div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="font-medium text-sm text-gray-900">{a.title}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 font-medium uppercase tracking-wide">
                  {CATEGORY_LABEL[a.category] ?? a.category}
                </span>
                {a.priority !== "Normal" && (
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide border",
                    a.priority === "Urgent"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : "bg-amber-50 text-amber-700 border-amber-200"
                  )}>
                    {a.priority}
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{a.content}</p>
              <div className="flex items-center gap-1 mt-2 text-[10px] text-gray-400">
                <Calendar className="w-3 h-3" />
                <span>{new Date(a.created_at).toLocaleDateString()}</span>
                <span className="mx-1">·</span>
                <span>{a.created_by}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
