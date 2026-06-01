"use client";

import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  Command,
  LayoutDashboard,
  Building2,
  Briefcase,
  Settings,
  Plus,
  Download,
  Archive,
  Users,
  User,
  Clock,
  ArrowUpRight,
  FileText,
  Ban,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useMemoryStore } from "@/store/memory.store";
import { searchService, type SearchStudent, type SearchCompany, type SearchApplication } from "@/services/search.service";
import { useDebounce } from "@/hooks/useDebounce";

interface CommandAction {
  id: string;
  label: string;
  description: string;
  icon: typeof Plus;
  action: () => void;
}

interface CommandPaletteProps {
  open: boolean;
  onClose: () => void;
  isAdmin?: boolean;
  onAction?: (action: string) => void;
}

type Section =
  | { type: "actions"; items: CommandAction[] }
  | { type: "recent"; items: { id: string; label: string; path: string }[] }
  | { type: "students"; items: SearchStudent[] }
  | { type: "companies"; items: SearchCompany[] }
  | { type: "applications"; items: SearchApplication[] }
  | { type: "pages"; items: { id: string; label: string; href: string; icon: typeof Plus }[] }
  | { type: "no_results"; query: string };

const studentPages = [
  { id: "dashboard", label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { id: "companies", label: "Companies", href: "/companies", icon: Building2 },
  { id: "applications", label: "My Applications", href: "/applications", icon: Briefcase },
  { id: "settings", label: "Settings", href: "/dashboard/settings", icon: Settings },
];

const adminPages = [
  { id: "admin-dashboard", label: "Admin Dashboard", href: "/admin", icon: LayoutDashboard },
  { id: "admin-companies", label: "Placement Drives", href: "/admin/companies", icon: Building2 },
  { id: "admin-applicants", label: "Applicants", href: "/admin/applicants", icon: Users },
  { id: "admin-audit", label: "Audit Trail", href: "/admin/audit-log", icon: FileText },
  { id: "admin-settings", label: "Settings", href: "/admin/settings", icon: Settings },
];

export default function CommandPalette({ open, onClose, isAdmin, onAction }: CommandPaletteProps) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [sections, setSections] = useState<Section[]>([]);
  const [loading, setLoading] = useState(false);
  const memory = useMemoryStore();

  const debouncedQuery = useDebounce(query, 150);

  const navigate = useCallback((href: string) => {
    router.push(href);
    onClose();
  }, [router, onClose]);

  const actions: CommandAction[] = useMemo(() => {
    return isAdmin
      ? [
          { id: "create-drive", label: "Create Drive", description: "New placement drive", icon: Plus, action: () => { onClose(); onAction?.("create-drive"); } },
          { id: "export-applicants", label: "Export Applicants", description: "Download applicant data", icon: Download, action: () => { onClose(); onAction?.("export"); } },
          { id: "archive-drive", label: "Archive Closed Drive", description: "Archive completed drives", icon: Archive, action: () => { onClose(); onAction?.("archive"); } },
        ]
      : [
          { id: "view-applications", label: "View Applications", description: "Browse my applications", icon: Briefcase, action: () => navigate("/applications") },
          { id: "browse-companies", label: "Browse Companies", description: "View eligible companies", icon: Building2, action: () => navigate("/companies") },
        ];
  }, [isAdmin, navigate, onClose, onAction]);

  const allPages = useMemo(() => (isAdmin ? adminPages : studentPages), [isAdmin]);

  const flatItems = useCallback(() => {
    const items: { id: string; label: string; icon?: typeof Plus; onSelect: () => void }[] = [];
    for (const section of sections) {
      if (section.type === "actions") {
        for (const a of section.items) {
          items.push({ id: a.id, label: a.label, icon: a.icon, onSelect: a.action });
        }
      } else if (section.type === "recent") {
        for (const r of section.items) {
          items.push({ id: `recent-${r.id}`, label: r.label, onSelect: () => navigate(r.path) });
        }
      } else if (section.type === "students") {
        for (const s of section.items) {
          items.push({ id: `student-${s.id}`, label: s.full_name, onSelect: () => {
            if (isAdmin) {
              navigate(`/admin/applicants?student=${s.id}`);
            }
          } });
        }
      } else if (section.type === "companies") {
        for (const c of section.items) {
          items.push({ id: `company-${c.id}`, label: c.company_name, onSelect: () => {
            navigate(isAdmin ? `/admin/companies` : `/companies`);
          } });
        }
      } else if (section.type === "applications") {
        for (const a of section.items) {
          items.push({ id: `app-${a.id}`, label: `${a.student_name} → ${a.company_name}`, onSelect: () => {
            if (isAdmin) navigate(`/admin/applicants`);
          } });
        }
      } else if (section.type === "pages") {
        for (const p of section.items) {
          items.push({ id: p.id, label: p.label, icon: p.icon, onSelect: () => navigate(p.href) });
        }
      }
    }
    return items;
  }, [sections, navigate, isAdmin, onClose, onAction]);

  const flat = flatItems();

  useEffect(() => {
    setSelectedIndex(0);
  }, [query, sections]);

  const buildSections = useCallback(async (q: string) => {
    const trimmed = q.trim().toLowerCase();

    if (!trimmed) {
      const result: Section[] = [];

      result.push({ type: "actions", items: actions });

      const recentItems = memory.recentActivities.slice(0, 4);
      if (recentItems.length > 0) {
        result.push({
          type: "recent",
          items: recentItems.map((r) => ({ id: r.id, label: r.label, path: r.path })),
        });
      }

      result.push({ type: "pages", items: allPages });

      setSections(result);
      return;
    }

    setLoading(true);
    try {
      const [apiResult] = await Promise.all([
        searchService.search(trimmed, 4),
      ]);

      const result: Section[] = [];

      const filteredActions = actions.filter(
        (a) => a.label.toLowerCase().includes(trimmed) || a.description.toLowerCase().includes(trimmed)
      );
      if (filteredActions.length > 0) {
        result.push({ type: "actions", items: filteredActions });
      }

      const filteredPages = allPages.filter((p) => p.label.toLowerCase().includes(trimmed));
      if (filteredPages.length > 0) {
        result.push({ type: "pages", items: filteredPages });
      }

      if (apiResult.students.length > 0) {
        result.push({ type: "students", items: apiResult.students });
      }
      if (apiResult.companies.length > 0) {
        result.push({ type: "companies", items: apiResult.companies });
      }
      if (apiResult.applications.length > 0) {
        result.push({ type: "applications", items: apiResult.applications });
      }

      if (result.length === 0) {
        result.push({ type: "no_results", query: trimmed });
      }

      setSections(result);
    } catch {
      const result: Section[] = [];
      const filteredActions = actions.filter(
        (a) => a.label.toLowerCase().includes(trimmed) || a.description.toLowerCase().includes(trimmed)
      );
      if (filteredActions.length > 0) {
        result.push({ type: "actions", items: filteredActions });
      }
      const filteredPages = allPages.filter((p) => p.label.toLowerCase().includes(trimmed));
      if (filteredPages.length > 0) {
        result.push({ type: "pages", items: filteredPages });
      }
      if (result.length === 0) {
        result.push({ type: "no_results", query: trimmed });
      }
      setSections(result);
    } finally {
      setLoading(false);
    }
  }, [actions, allPages, memory.recentActivities]);

  useEffect(() => {
    buildSections(debouncedQuery);
  }, [debouncedQuery, buildSections]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (open) onClose();
      }
      if (!open) return;

      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((i) => Math.min(i + 1, flat.length - 1));
        const el = listRef.current?.children[selectedIndex + 1] as HTMLElement | undefined;
        el?.scrollIntoView({ block: "nearest" });
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((i) => Math.max(i - 1, 0));
        const el = listRef.current?.children[selectedIndex - 1] as HTMLElement | undefined;
        el?.scrollIntoView({ block: "nearest" });
      }
      if (e.key === "Enter" && flat[selectedIndex]) {
        e.preventDefault();
        flat[selectedIndex].onSelect();
      }
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, flat, selectedIndex, onClose]);

  const sectionLabels: Record<string, string> = {
    actions: "Actions",
    recent: "Recent",
    students: "Students",
    companies: "Recruiters",
    applications: "Applications",
    pages: "Pages",
  };

  const sectionIcons: Record<string, typeof Plus> = {
    students: User,
    companies: Building2,
    applications: Briefcase,
    recent: Clock,
    actions: Command,
    pages: LayoutDashboard,
  };

  let globalIndex = -1;

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[12vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -8 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative w-full max-w-xl bg-layer-2 border border-zinc-800/60 rounded-xl shadow-floating overflow-hidden"
          >
            <div className="flex items-center gap-3 px-4 h-11 border-b border-zinc-800/40">
              <Search className="w-3.5 h-3.5 text-zinc-500 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search placements, students, recruiters..."
                className="flex-1 bg-transparent text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none"
              />
              {loading && (
                <div className="w-3.5 h-3.5 rounded-full border border-zinc-600 border-t-transparent animate-spin" />
              )}
              <div className="flex items-center gap-1 text-[10px] text-zinc-600 border border-zinc-800/60 rounded-md px-1.5 py-0.5">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
              </div>
            </div>
            <div ref={listRef} className="max-h-80 overflow-y-auto py-2 scrollbar-hide">
              {sections.map((section) => {
                if (section.type === "no_results") {
                  return (
                    <div key="no-results" className="p-6 text-center">
                      <p className="text-sm text-zinc-600">No results for &quot;{section.query}&quot;</p>
                      <p className="text-xs text-zinc-700 mt-1">Try searching for students, companies, or commands</p>
                    </div>
                  );
                }

                const items = section.type === "actions"
                  ? section.items
                  : section.type === "recent"
                  ? section.items
                  : section.type === "students"
                  ? section.items
                  : section.type === "companies"
                  ? section.items
                  : section.type === "applications"
                  ? section.items
                  : section.type === "pages"
                  ? section.items
                  : [];

                if (items.length === 0) return null;

                const SectionIcon = sectionIcons[section.type];

                return (
                  <div key={section.type}>
                    <div className="flex items-center gap-1.5 px-4 pt-3 pb-1">
                      {SectionIcon && <SectionIcon className="w-3 h-3 text-zinc-600" />}
                      <span className="text-[10px] text-zinc-600 uppercase tracking-[0.08em] font-semibold">
                        {sectionLabels[section.type]}
                      </span>
                    </div>
                    {items.map((item: any) => {
                      globalIndex++;
                      const idx = globalIndex;
                      const isSelected = idx === selectedIndex;

                      if (section.type === "students") {
                        const s = item as SearchStudent;
                        return (
                          <button
                            key={`student-${s.id}`}
                            onClick={() => { globalIndex = idx; flat[idx]?.onSelect(); }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                              isSelected ? "bg-zinc-800/40 text-white" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20"
                            }`}
                          >
                            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center shrink-0">
                              <span className="text-[10px] font-medium text-zinc-400">{s.full_name[0]}</span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-zinc-300 truncate">{s.full_name}</div>
                              <div className="text-[11px] text-zinc-600 truncate">{s.department} · {s.email}</div>
                            </div>
                            <span className="text-[11px] text-zinc-600 tabular-nums">{s.cgpa.toFixed(1)}</span>
                          </button>
                        );
                      }

                      if (section.type === "companies") {
                        const c = item as SearchCompany;
                        return (
                          <button
                            key={`company-${c.id}`}
                            onClick={() => { globalIndex = idx; flat[idx]?.onSelect(); }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                              isSelected ? "bg-zinc-800/40 text-white" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20"
                            }`}
                          >
                            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                              <Building2 className="w-3 h-3 text-zinc-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-zinc-300 truncate">{c.company_name}</div>
                              <div className="text-[11px] text-zinc-600 truncate">{c.role} · {c.package}</div>
                            </div>
                            <span className={`text-[11px] ${c.status === "active" ? "text-emerald-500" : "text-zinc-600"}`}>
                              {c.status}
                            </span>
                          </button>
                        );
                      }

                      if (section.type === "applications") {
                        const a = item as SearchApplication;
                        return (
                          <button
                            key={`app-${a.id}`}
                            onClick={() => { globalIndex = idx; flat[idx]?.onSelect(); }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                              isSelected ? "bg-zinc-800/40 text-white" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20"
                            }`}
                          >
                            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center shrink-0">
                              <Briefcase className="w-3 h-3 text-zinc-500" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-zinc-300 truncate">{a.student_name}</div>
                              <div className="text-[11px] text-zinc-600 truncate">{a.company_name} · {a.status}</div>
                            </div>
                            <ArrowUpRight className="w-3 h-3 text-zinc-600 shrink-0" />
                          </button>
                        );
                      }

                      if (section.type === "recent") {
                        const r = item as { id: string; label: string; path: string };
                        return (
                          <button
                            key={`recent-${r.id}`}
                            onClick={() => { globalIndex = idx; flat[idx]?.onSelect(); }}
                            onMouseEnter={() => setSelectedIndex(idx)}
                            className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                              isSelected ? "bg-zinc-800/40 text-white" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20"
                            }`}
                          >
                            <Clock className="w-3.5 h-3.5 text-zinc-600 shrink-0" />
                            <span className="text-sm text-zinc-400 truncate">{r.label}</span>
                          </button>
                        );
                      }

                      const Icon = (item as any).icon || Command;
                      const label = (item as any).label || (item as any).name;
                      const href = (item as any).href;

                      return (
                        <button
                          key={(item as any).id || href}
                          onClick={() => { globalIndex = idx; flat[idx]?.onSelect(); }}
                          onMouseEnter={() => setSelectedIndex(idx)}
                          className={`flex w-full items-center gap-3 px-4 py-2 text-left transition-colors ${
                            isSelected ? "bg-zinc-800/40 text-white" : "text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/20"
                          }`}
                        >
                          <Icon className="w-3.5 h-3.5 shrink-0 text-zinc-500" />
                          <span className="text-sm text-zinc-300">{label}</span>
                          {href && <ArrowUpRight className="w-3 h-3 text-zinc-700 ml-auto shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-3 px-4 h-8 border-t border-zinc-800/40 text-[10px] text-zinc-700">
              <span><kbd className="text-zinc-600">↑↓</kbd> Navigate</span>
              <span><kbd className="text-zinc-600">↵</kbd> Open</span>
              <span><kbd className="text-zinc-600">Esc</kbd> Close</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
