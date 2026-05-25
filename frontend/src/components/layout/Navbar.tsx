"use client";

import { useState, useEffect } from "react";
import { Search, User, LogOut, Menu, Command } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import NotificationDropdown from "../notifications/NotificationDropdown";
import CommandPalette from "../search/CommandPalette";
import { useMemoryStore } from "@/store/memory.store";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const memory = useMemoryStore();
  const router = useRouter();
  const pathname = usePathname();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const isAdmin = pathname?.startsWith("/admin");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setPaletteOpen(true);
        return;
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.isContentEditable) {
          e.preventDefault();
          setPaletteOpen(true);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  const trackSearch = () => {
    setPaletteOpen(true);
    memory.addActivity({ type: "search", label: "Opened command palette", path: pathname });
  };

  return (
    <>
      <header className="h-12 border-b border-zinc-800/60 bg-layer-2/80 backdrop-blur-xl sticky top-0 z-10 px-4 md:px-5 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 rounded bg-layer-2 border border-zinc-800/60 hover:bg-layer-3 transition-colors"
          >
            <Menu className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          <button
            onClick={trackSearch}
            className="relative max-w-xs w-full hidden md:flex items-center gap-2 bg-layer-2 border border-white/[0.04] rounded py-1.5 pl-9 pr-3 text-[11px] text-zinc-600 hover:text-zinc-500 hover:border-white/[0.07] focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all group cursor-text"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3 text-zinc-700 transition-colors group-hover:text-zinc-600" />
            <span className="flex-1">Search pages or type a command...</span>
            <div className="flex items-center gap-0.5 text-[10px] text-zinc-700 border border-zinc-800/40 rounded px-1 py-0.5">
              <Command className="w-2 h-2" />
              <span>K</span>
            </div>
          </button>

          {/* Breadcrumb-style context hint */}
          {memory.lastOpenedDriveName && pathname === "/applications" && (
            <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-zinc-600 bg-zinc-800/30 px-2 py-1 rounded">
              <span>Resume:</span>
              <span className="text-zinc-400 font-medium">{memory.lastOpenedDriveName}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2.5">
          <NotificationDropdown />

          <div className="flex items-center gap-2.5 pl-2.5 border-l border-zinc-800/40">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-zinc-300 leading-tight">{user?.full_name || "Loading..."}</p>
              <p className="text-[10px] text-zinc-500">{user?.department || "Student"}</p>
            </div>

            <div className="group relative">
              <button className="w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                <User className="w-3.5 h-3.5 text-white" />
              </button>

              <div className="absolute right-0 mt-2 w-44 bg-layer-3 border border-zinc-800/60 rounded shadow-elevated py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-rose-400 hover:bg-zinc-800/30 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={() => setPaletteOpen(false)} isAdmin={isAdmin} />
    </>
  );
}
