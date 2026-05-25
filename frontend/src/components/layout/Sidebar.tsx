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
  ChevronRight
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Companies', href: '/companies', icon: Building2 },
  { name: 'My Applications', href: '/applications', icon: Briefcase },
  { name: 'Settings', href: '/dashboard/settings', icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <motion.div 
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="flex h-full w-64 flex-col bg-zinc-950 border-r border-zinc-800 relative z-20"
    >
      <div className="flex h-16 items-center px-5 border-b border-zinc-800">
        <Link href="/dashboard" className="flex items-center gap-2.5 font-bold text-xl tracking-tight group">
          <motion.div 
            whileHover={{ rotate: 15, scale: 1.1 }}
            transition={{ type: "spring", stiffness: 300, damping: 10 }}
            className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20"
          >
            <GraduationCap className="w-5 h-5 text-primary-foreground" />
          </motion.div>
          <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">PlaceFlow</span>
        </Link>
      </div>
      
      <nav className="flex-1 space-y-1 px-3 py-6">
        <p className="px-3 text-[10px] font-semibold text-zinc-600 uppercase tracking-widest mb-3">Main Menu</p>
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className="relative block"
            >
              <motion.div
                whileHover={{ x: 3 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  "group flex items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl transition-all relative z-10",
                  isActive 
                    ? "text-primary" 
                    : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                <item.icon className={cn("w-4 h-4 transition-all", isActive && "text-primary")} />
                <span>{item.name}</span>
                
                {isActive && (
                  <motion.div 
                    layoutId="activeNav"
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
        className="p-4 border-t border-zinc-800 bg-zinc-900/30"
      >
        <motion.button 
          whileHover={{ scale: 1.01, x: 2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleLogout}
          className="flex w-full items-center gap-2.5 px-3 py-2.5 text-sm font-medium rounded-xl text-rose-500/80 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
