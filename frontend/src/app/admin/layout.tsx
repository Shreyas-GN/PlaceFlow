"use client";

import { useEffect, useState } from "react";
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
  ChevronRight
} from "lucide-react";
import { useAdminStore } from "@/store/admin.store";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { admin, isAuthenticated, logout } = useAdminStore();
  const router = useRouter();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted && !isAuthenticated && pathname !== "/admin/login") {
      router.push("/admin/login");
    }
  }, [mounted, isAuthenticated, pathname, router]);

  if (!mounted) return null;

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  if (!isAuthenticated && pathname !== "/admin/login") {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary animate-spin" />
      </div>
    );
  }

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/admin" },
    { icon: Building2, label: "Placement Drives", href: "/admin/companies" },
    { icon: Users, label: "Applicants", href: "/admin/applicants" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
  ];

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/admin/login");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-200 flex">
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

      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -280 }}
        animate={{ x: isSidebarOpen ? 0 : -280 }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 left-0 z-50 w-64 bg-zinc-950 border-r border-zinc-800 lg:translate-x-0 lg:static lg:z-auto"
      >
        <div className="p-5 flex flex-col h-full">
          <Link href="/admin" className="flex items-center gap-2.5 font-bold text-xl tracking-tight mb-10">
            <motion.div 
              whileHover={{ rotate: 15, scale: 1.1 }}
              className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20"
            >
              <Shield className="w-5 h-5 text-primary-foreground" />
            </motion.div>
            <div>
              <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">PlaceFlow</span>
              <span className="text-primary font-light text-[10px] ml-1 uppercase tracking-wider">Admin</span>
            </div>
          </Link>

          <nav className="flex-1 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative block"
                >
                  <motion.div
                    whileHover={{ x: 3 }}
                    whileTap={{ scale: 0.98 }}
                    className={cn(
                      "group flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-all relative z-10",
                      isActive 
                        ? 'text-primary' 
                        : 'text-zinc-500 hover:text-zinc-300'
                    )}
                  >
                    <item.icon className={cn("w-4 h-4", isActive && "text-primary")} />
                    <span>{item.label}</span>
                    
                    {isActive && (
                      <motion.div 
                        layoutId="adminActiveNav"
                        className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                      />
                    )}

                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="ml-auto"
                      >
                        <ChevronRight className="w-3.5 h-3.5 text-primary" />
                      </motion.div>
                    )}
                  </motion.div>
                </Link>
              );
            })}
          </nav>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-6 border-t border-zinc-800"
          >
            <div className="flex items-center gap-3 px-3 py-3 mb-3">
              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="w-9 h-9 rounded-full bg-orange-500/20 flex items-center justify-center text-orange-500 font-bold border border-orange-500/20 text-sm"
              >
                {admin?.full_name?.[0] || 'A'}
              </motion.div>
              <div className="overflow-hidden">
                <p className="font-medium text-sm text-zinc-300 truncate">{admin?.full_name || 'Admin User'}</p>
                <p className="text-xs text-zinc-600 truncate">{admin?.email}</p>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.01, x: 2 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLogout}
              className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl w-full text-zinc-500 hover:text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </motion.button>
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-30 px-4 sm:px-6 flex items-center justify-between">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 -ml-2 hover:bg-zinc-900 rounded-xl lg:hidden"
          >
            {isSidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </motion.button>
          
          <div className="flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-2 bg-zinc-900/50 border border-zinc-800 rounded-xl px-3 py-1.5">
              <div className="relative">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-ping absolute inset-0" />
                <div className="w-2 h-2 rounded-full bg-emerald-500 relative" />
              </div>
              <span className="text-[10px] font-semibold text-emerald-500 uppercase tracking-wider">Online</span>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
