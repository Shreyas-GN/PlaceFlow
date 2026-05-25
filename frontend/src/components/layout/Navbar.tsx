"use client";

import { Search, User, LogOut, Menu } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import NotificationDropdown from "../notifications/NotificationDropdown";
import { motion } from "framer-motion";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-xl sticky top-0 z-10 px-4 md:px-6 flex items-center justify-between">
      <div className="flex items-center gap-3 flex-1">
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-xl bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 transition-colors"
        >
          <Menu className="w-4 h-4 text-zinc-400" />
        </motion.button>

        <div className="relative max-w-xs w-full hidden md:block group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-zinc-700 transition-colors" />
          <input 
            type="text" 
            placeholder="Universal search..."
            className="w-full bg-zinc-900 border border-zinc-800 rounded-xl py-2 pl-10 pr-4 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all placeholder:text-zinc-700"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <NotificationDropdown />
        
        <div className="flex items-center gap-3 pl-3 border-l border-zinc-800">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-zinc-300">{user?.full_name || "Loading..."}</p>
            <p className="text-xs text-zinc-500">{user?.department || "Student"}</p>
          </div>
          
          <div className="group relative">
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-purple-500 flex items-center justify-center"
            >
              <User className="w-4 h-4 text-white" />
            </motion.button>
            
            <motion.div 
              initial={{ opacity: 0, y: 5, scale: 0.95 }}
              whileHover={{ opacity: 1, y: 0, scale: 1 }}
              className="absolute right-0 mt-2 w-44 bg-zinc-900 border border-zinc-800 rounded-xl shadow-2xl py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50"
            >
              <motion.button 
                whileHover={{ x: 2 }}
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-400 hover:bg-zinc-800 transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                Sign Out
              </motion.button>
            </motion.div>
          </div>
        </div>
      </div>
    </header>
  );
}
