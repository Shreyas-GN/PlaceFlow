"use client";

import { useEffect, useState } from "react";
import { announcementService, Announcement, AnnouncementCreate } from "@/services/announcement.service";
import { Bell, Plus, Trash2, Edit2, Check, X } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BLANK: AnnouncementCreate = { title: "", content: "", category: "Notice", priority: "Normal", active: true };

const INPUT_CLS = "w-full bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Announcement | null>(null);
  const [form, setForm] = useState<AnnouncementCreate>(BLANK);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    setLoading(true);
    announcementService.adminList()
      .then((res) => setAnnouncements(res.items ?? res))
      .catch(() => toast.error("Failed to load announcements"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Title and content are required");
      return;
    }
    setSubmitting(true);
    try {
      if (editing) {
        await announcementService.update(editing.id, form);
        toast.success("Announcement updated");
      } else {
        await announcementService.create(form);
        toast.success("Announcement created");
      }
      setShowForm(false);
      setEditing(null);
      setForm(BLANK);
      load();
    } catch {
      toast.error("Failed to save announcement");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this announcement?")) return;
    try {
      await announcementService.delete(id);
      toast.success("Deleted");
      load();
    } catch {
      toast.error("Failed to delete");
    }
  };

  const startEdit = (a: Announcement) => {
    setEditing(a);
    setForm({ title: a.title, content: a.content, category: a.category, priority: a.priority, active: a.active });
    setShowForm(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Bell className="w-5 h-5 text-blue-600" />
        <h1 className="text-lg font-semibold text-gray-900">Announcements</h1>
        <button
          onClick={() => { setEditing(null); setForm(BLANK); setShowForm(true); }}
          className="ml-auto flex items-center gap-1.5 text-xs bg-blue-600 text-white px-3 py-1.5 rounded-[10px] hover:bg-blue-700 transition-colors font-medium"
        >
          <Plus className="w-3.5 h-3.5" /> New
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl border border-gray-200 bg-white p-5 space-y-3 shadow-sm">
          <h2 className="text-sm font-semibold text-gray-900">{editing ? "Edit Announcement" : "New Announcement"}</h2>
          <input
            className={INPUT_CLS}
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <textarea
            className={`${INPUT_CLS} resize-none`}
            placeholder="Content"
            rows={4}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <div className="flex gap-3 flex-wrap items-center">
            <select
              className="bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              {["Drive", "Update", "Deadline", "Notice"].map((c) => <option key={c}>{c}</option>)}
            </select>
            <select
              className="bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-xs text-gray-700 focus:outline-none focus:border-blue-500 cursor-pointer"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              {["Normal", "Important", "Urgent"].map((p) => <option key={p}>{p}</option>)}
            </select>
            <label className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm({ ...form, active: e.target.checked })}
                className="accent-blue-600"
              />
              Active (notify students)
            </label>
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
              onClick={() => { setShowForm(false); setEditing(null); setForm(BLANK); }}
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
          {announcements.length === 0 && (
            <p className="text-gray-400 text-sm text-center py-8">No announcements yet</p>
          )}
          {announcements.map((a) => (
            <div key={a.id} className="flex items-start gap-3 rounded-xl border border-gray-200 bg-white p-4 hover:bg-gray-50 transition-colors">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-gray-900">{a.title}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 text-gray-500 uppercase font-medium">{a.category}</span>
                  <span className={cn(
                    "text-[10px] px-1.5 py-0.5 rounded uppercase font-medium",
                    a.priority === "Urgent"
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : a.priority === "Important"
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-gray-50 text-gray-500 border border-gray-200"
                  )}>
                    {a.priority}
                  </span>
                  {!a.active && <span className="text-[10px] text-gray-400">[inactive]</span>}
                </div>
                <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{a.content}</p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button onClick={() => startEdit(a)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors">
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => handleDelete(a.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-gray-400 hover:text-red-500 transition-colors">
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
