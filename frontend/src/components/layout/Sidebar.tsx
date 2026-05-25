"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Briefcase,
  Building2,
  Settings,
  LogOut,
  GraduationCap,
  Clock,
  FileText,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useMemoryStore } from "@/store/memory.store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Companies", href: "/companies", icon: Building2 },
  { name: "My Applications", href: "/applications", icon: Briefcase },
  { name: "Settings", href: "/dashboard/settings", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const memory = useMemoryStore();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <div className="flex h-full w-52 flex-col bg-layer-2 border-r border-zinc-800/60 relative z-20">
      {/* Brand */}
      <div className="flex h-12 items-center px-3 border-b border-zinc-800/40">
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
            <GraduationCap className="w-3 h-3 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm tracking-tight text-foreground">PlaceFlow</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="space-y-0.5 px-1.5 py-3">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-2.5 px-2 py-1 text-xs relative rounded hover:bg-zinc-800/30 transition-colors",
                  isActive
                    ? "text-zinc-200 font-medium bg-zinc-800/20"
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {isActive && (
                  <div className="absolute inset-y-1 left-0 w-[2px] bg-primary rounded-r" />
                )}
                <item.icon className="w-3.5 h-3.5 shrink-0" />
                <span>{item.name}</span>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* System Memory — Resume context */}
      {memory.lastOpenedDriveName && (
        <div className="px-3 py-2 mx-1.5 mb-1 rounded-lg bg-zinc-800/20 border border-zinc-800/40">
          <div className="flex items-center gap-1.5 mb-1">
            <Clock className="w-2.5 h-2.5 text-zinc-600" />
            <span className="text-[10px] text-zinc-600 uppercase tracking-[0.08em] font-semibold">
              Continue
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FileText className="w-3 h-3 text-primary shrink-0" />
            <span className="text-[11px] text-zinc-400 truncate">{memory.lastOpenedDriveName}</span>
          </div>
        </div>
      )}

      {/* Recent activity */}
      <div className="px-3 py-1.5 mx-1.5 mb-1">
        <div className="flex items-center gap-1.5 mb-1">
          <Clock className="w-2.5 h-2.5 text-zinc-600" />
          <span className="text-[10px] text-zinc-600 uppercase tracking-[0.08em] font-semibold">
            Recent
          </span>
        </div>
        {memory.recentActivities.slice(0, 3).map((a) => (
          <div key={a.id} className="flex items-center gap-1.5 py-0.5">
            <div className="w-1 h-1 rounded-full bg-zinc-700 shrink-0" />
            <span className="text-[10px] text-zinc-500 truncate">{a.label}</span>
          </div>
        ))}
        {memory.recentActivities.length === 0 && (
          <p className="text-[10px] text-zinc-600">No recent activity</p>
        )}
      </div>

      {/* User + Sign Out */}
      <div className="mt-auto p-2 border-t border-zinc-800/40">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 px-2 py-1 text-xs text-zinc-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors rounded"
        >
          <LogOut className="w-3 h-3" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
