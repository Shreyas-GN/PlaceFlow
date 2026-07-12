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
  Bell,
  ScrollText,
  BarChart2,
  CalendarDays,
  GraduationCap,
  Command,
} from "lucide-react";
import { useAdminStore } from "@/store/admin.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import CommandPalette from "@/components/search/CommandPalette";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, isAuthenticated, logout, _hasHydrated } = useAdminStore();
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
    if (mounted && _hasHydrated && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [mounted, _hasHydrated, isAuthenticated, pathname, router]);

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

  if ((!_hasHydrated || !isAuthenticated) && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Building2, label: "Placement Drives", href: "/admin/companies" },
    { icon: Users, label: "Applicants", href: "/admin/applicants" },
    { icon: GraduationCap, label: "Students", href: "/admin/students" },
    { icon: Bell, label: "Announcements", href: "/admin/announcements" },
    { icon: BarChart2, label: "Reports", href: "/admin/reports" },
    { icon: CalendarDays, label: "Calendar", href: "/admin/calendar" },
    { icon: ScrollText, label: "Audit Trail", href: "/admin/audit-log" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Brand */}
      <div className="flex h-14 items-center px-4 border-b border-gray-100">
        <Link href="/admin" className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center">
            <Shield className="w-4 h-4 text-white" />
          </div>
          <div className="leading-tight">
            <span className="font-semibold text-sm text-gray-900">PlaceFlow</span>
            <span className="text-blue-600 text-[10px] ml-1.5 font-semibold uppercase tracking-wider">Admin</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={() => setIsSidebarOpen(false)}>
              <div className={cn(
                "relative flex items-center gap-2.5 px-3 py-2 text-sm rounded-[10px] transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-700 font-medium"
                  : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
              )}>
                {isActive && <div className="absolute inset-y-2 left-0 w-0.5 bg-blue-600 rounded-r" />}
                <item.icon className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Command Palette hint */}
      <div className="px-2 pb-2">
        <button
          onClick={() => setPaletteOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-[10px] border border-dashed border-gray-300 hover:border-gray-400 hover:bg-gray-50 transition-colors group text-sm text-gray-500"
        >
          <div className="flex items-center gap-1.5">
            <Command className="w-3.5 h-3.5" />
            <span>Quick search</span>
          </div>
          <div className="flex items-center gap-0.5">
            <kbd className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1 py-0.5 rounded">⌘</kbd>
            <kbd className="text-[10px] font-mono text-gray-400 bg-gray-100 px-1 py-0.5 rounded">K</kbd>
          </div>
        </button>
      </div>

      {/* User section */}
      <div className="p-2 border-t border-gray-100">
        <div className="flex items-center gap-2 px-3 py-2 mb-1">
          <div className="w-7 h-7 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-semibold text-sm shrink-0">
            {admin?.full_name?.[0] || "A"}
          </div>
          <p className="font-medium text-sm text-gray-900 truncate">{admin?.full_name || "Admin"}</p>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 w-full text-sm text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors rounded-[10px]"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );

  return (
    <div className="h-screen bg-[#FAFAF8] flex overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-52 shrink-0 bg-white border-r border-gray-200">
        {sidebarContent}
      </aside>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <>
          <div
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/30 z-[99] lg:hidden"
          />
          <aside className="fixed inset-y-0 left-0 z-[100] w-52 bg-white border-r border-gray-200 flex flex-col lg:hidden shadow-floating">
            {sidebarContent}
          </aside>
        </>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-14 border-b border-gray-200 bg-white sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-1.5 hover:bg-gray-100 rounded-lg lg:hidden text-gray-600"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>

          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => setPaletteOpen(true)}
              className="hidden sm:flex items-center gap-2 text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-[10px] px-3 py-1.5 hover:bg-gray-100 transition-colors"
            >
              <Command className="w-3.5 h-3.5" />
              <span>Search</span>
              <kbd className="font-mono text-xs text-gray-400">⌘K</kbd>
            </button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5 lg:p-6">
          {children}
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
