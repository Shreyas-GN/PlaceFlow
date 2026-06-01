"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Building2, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  Shield,
  Loader2,
  Clock,
  Archive,
  Bell,
  ScrollText,
  Command,
} from "lucide-react";
import { useAdminStore } from "@/store/admin.store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemoryStore } from "@/store/memory.store";
import CommandPalette from "@/components/search/CommandPalette";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, isAuthenticated, logout } = useAdminStore();
  const memory = useMemoryStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const handlePaletteAction = useCallback((action: string) => {
    if (action === "create-drive") {
      router.push("/admin/companies?create=drive");
    }
  }, [router]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [mounted, isAuthenticated, pathname, router]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (pathname !== "/admin/login") setPaletteOpen(true);
        return;
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey && pathname !== "/admin/login") {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.isContentEditable) {
          e.preventDefault();
          setPaletteOpen(true);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pathname]);

  if (!mounted) return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-layer-1 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Building2, label: "Placement Drives", href: "/admin/companies" },
    { icon: Users, label: "Applicants", href: "/admin/applicants" },
    { icon: ScrollText, label: "Audit Trail", href: "/admin/audit-log" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-layer-1 text-zinc-200 flex">
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar — Dense operational sidebar with system memory */}
      <aside className="fixed inset-y-0 left-0 z-50 w-52 bg-layer-2 border-r border-zinc-800/60 lg:static lg:z-auto">
        <div className="p-2 flex flex-col h-full">
          {/* Brand — compact */}
          <Link href="/admin" className="flex items-center gap-2 px-2 py-1.5 mb-3">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <Shield className="w-3 h-3 text-primary-foreground" />
            </div>
            <div className="leading-tight">
              <span className="font-semibold text-sm text-foreground">PlaceFlow</span>
              <span className="text-primary text-[9px] ml-1 uppercase tracking-[0.12em]">Admin</span>
            </div>
          </Link>

          {/* Navigation — compact */}
          <nav className="space-y-0.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}>
                  <div className={cn(
                    "flex items-center gap-2.5 px-2 py-1 text-xs relative rounded hover:bg-zinc-800/30 transition-colors",
                    isActive ? "text-zinc-200 font-medium bg-zinc-800/20" : "text-zinc-500 hover:text-zinc-300"
                  )}>
                    {isActive && <div className="absolute inset-y-1 left-0 w-[2px] bg-primary rounded-r" />}
                    <item.icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{item.label}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* System Memory — recent items */}
          <div className="mt-3 pt-3 border-t border-zinc-800/40">
            <div className="flex items-center gap-1.5 px-2 mb-1.5">
              <Clock className="w-2.5 h-2.5 text-zinc-600" />
              <span className="text-[10px] text-zinc-600 uppercase tracking-[0.08em] font-semibold">Recent</span>
            </div>
            {memory.recentActivities.slice(0, 3).map((a) => (
              <div key={a.id} className="flex items-center gap-1.5 px-2 py-0.5">
                <div className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
                <span className="text-[10px] text-zinc-500 truncate">{a.label}</span>
              </div>
            ))}
            {memory.recentActivities.length === 0 && (
              <p className="text-[10px] text-zinc-600 px-2">No recent activity</p>
            )}
          </div>

          {/* Storage status */}
          <div className="mt-2 pt-2 border-t border-zinc-800/40">
            <div className="flex items-center gap-1.5 px-2 py-0.5">
              <Archive className="w-2.5 h-2.5 text-zinc-600" />
              <span className="text-[10px] text-zinc-600">3 archived drives</span>
            </div>
            <div className="flex items-center gap-1.5 px-2 py-0.5">
              <Bell className="w-2.5 h-2.5 text-amber-500/60" />
              <span className="text-[10px] text-amber-500/60">12 unread notifications</span>
            </div>
          </div>

          {/* User section — compact */}
          <div className="mt-auto pt-3 border-t border-zinc-800/40">
            <div className="flex items-center gap-2 px-2 py-1">
              <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold text-[10px] shrink-0">
                {admin?.full_name?.[0] || 'A'}
              </div>
              <div className="overflow-hidden min-w-0">
                <p className="font-medium text-[11px] text-zinc-300 truncate">{admin?.full_name || 'Admin User'}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-2 py-1 w-full text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors rounded mt-0.5"
            >
              <LogOut className="w-3 h-3" />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-12 border-b border-zinc-800/60 bg-layer-2/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 -ml-2 hover:bg-zinc-800/50 rounded-lg lg:hidden"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
          
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 text-[10px] text-zinc-600 bg-zinc-800/30 border border-zinc-800/40 rounded px-2 py-1 hover:text-zinc-500 hover:border-zinc-700/60 transition-colors"
            >
              <Command className="w-3 h-3" />
              <span>Search</span>
              <kbd className="font-mono text-[9px] text-zinc-700">⌘K</kbd>
            </button>
            <div className="hidden sm:flex items-center gap-1 text-[10px] text-zinc-600 bg-zinc-800/30 border border-zinc-800/40 rounded px-2 py-1">
              <kbd className="font-mono text-[9px]">/</kbd>
              <span>Quick</span>
            </div>
            <div className="flex items-center gap-1.5 bg-zinc-800/30 border border-zinc-800/40 rounded-lg px-2.5 py-1">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500/60 animate-pulse" />
              <span className="text-[10px] font-medium text-emerald-500 uppercase tracking-[0.08em]">Online</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto bg-layer-1">
          <div className="p-4 sm:p-5">
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.15 }}
            >
              {children}
            </motion.div>
          </div>
        </main>
      </div>

      <CommandPalette
        open={paletteOpen}
        onClose={() => setPaletteOpen(false)}
        isAdmin={true}
        onAction={handlePaletteAction}
      />
    </div>
  );
}
