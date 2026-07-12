"use client";

import { useState, useEffect, useCallback } from "react";
import { Search, User, LogOut, Menu, Command } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter, usePathname } from "next/navigation";
import { toast } from "sonner";
import NotificationDropdown from "../notifications/NotificationDropdown";
import CommandPalette from "../search/CommandPalette";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuthStore();
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

  const closePalette = useCallback(() => {
    setPaletteOpen(false);
  }, []);

  return (
    <>
      <header className="h-14 border-b border-gray-200 bg-white sticky top-0 z-10 px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-gray-600"
          >
            <Menu className="w-4 h-4" />
          </button>

          <button
            onClick={() => setPaletteOpen(true)}
            className="relative max-w-xs w-full hidden md:flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-[10px] py-2 pl-9 pr-3 text-sm text-gray-400 hover:border-gray-300 focus:outline-none transition-all cursor-text"
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
            <span className="flex-1 text-left">Search...</span>
            <div className="flex items-center gap-0.5 text-xs text-gray-400 border border-gray-200 rounded px-1 py-0.5">
              <Command className="w-2.5 h-2.5" />
              <span>K</span>
            </div>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <NotificationDropdown />

          <div className="flex items-center gap-3 pl-3 border-l border-gray-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-medium text-gray-900 leading-tight">{user?.full_name || "Student"}</p>
              <p className="text-xs text-gray-500">{user?.department || "Student"}</p>
            </div>

            <div className="group relative">
              <button className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {user?.full_name?.[0] || <User className="w-4 h-4" />}
              </button>

              <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-floating py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <CommandPalette open={paletteOpen} onClose={closePalette} isAdmin={isAdmin} />
    </>
  );
}
