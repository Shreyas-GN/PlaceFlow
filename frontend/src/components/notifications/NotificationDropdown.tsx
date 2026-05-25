"use client";

import { useEffect, useRef, useState } from "react";
import { useNotificationStore } from "@/store/notification.store";
import { Bell, Check, Clock, MessageSquare, Briefcase, CheckCircle2, ShieldAlert } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function NotificationDropdown() {
  const { notifications, unreadCount, fetchNotifications, markAsRead, markAllAsRead, isLoading } = useNotificationStore();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getIcon = (title: string) => {
    if (title.includes("Submitted")) return <Briefcase className="w-4 h-4 text-primary" />;
    if (title.includes("Shortlisted")) return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
    if (title.includes("Status Update")) return <MessageSquare className="w-4 h-4 text-blue-500" />;
    return <Bell className="w-4 h-4 text-slate-400" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <motion.button 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-3 rounded-[1rem] transition-all hover:bg-white/[0.03] group border border-transparent hover:border-white/5 shadow-2xl"
      >
        <Bell className={cn(
          "w-6 h-6 transition-colors",
          isOpen || unreadCount > 0 ? "text-primary fill-primary/10" : "text-slate-500 group-hover:text-slate-200"
        )} />
        <AnimatePresence>
          {unreadCount > 0 && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute top-2 right-2 w-4 h-4 bg-primary text-[10px] font-semibold text-primary-foreground rounded-full flex items-center justify-center ring-4 ring-[#050505]"
            >
              {unreadCount > 9 ? '!' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-4 w-80 sm:w-[420px] bg-[#0F0F15] border border-white/5 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden z-[100] backdrop-blur-3xl"
          >
            {/* Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/[0.01]">
              <div className="flex items-center gap-3">
                <ShieldAlert className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-medium">Signals</h3>
              </div>
              {unreadCount > 0 && (
                <button 
                  onClick={() => markAllAsRead()}
                  className="text-xs text-muted-foreground hover:bg-primary/10 px-3 py-1.5 rounded-lg transition-colors flex items-center gap-2"
                >
                  <Check className="w-3 h-3" /> Mark all read
                </button>
              )}
            </div>

            {/* Body */}
            <div className="max-h-[32rem] overflow-y-auto scrollbar-hide">
              {isLoading && notifications.length === 0 ? (
                <div className="p-12 text-center space-y-6">
                  <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="text-xs text-muted-foreground">Synchronizing Infrastructure...</p>
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-16 text-center">
                  <div className="w-20 h-20 bg-white/5 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Bell className="w-8 h-8 text-slate-800" />
                  </div>
                  <p className="text-sm text-zinc-400">All caught up</p>
                  <p className="text-xs text-muted-foreground mt-2">No new notifications</p>
                </div>
              ) : (
                <div className="divide-y divide-white/5">
                  {notifications.map((notif, index) => (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      key={notif.id}
                      onClick={() => {
                        if (!notif.is_read) markAsRead(notif.id);
                      }}
                      className={cn(
                        "p-7 transition-all cursor-pointer group hover:bg-white/[0.03] relative",
                        !notif.is_read ? "bg-primary/[0.01]" : "opacity-40"
                      )}
                    >
                      <div className="flex gap-6">
                        <div className={cn(
                          "w-12 h-12 rounded-lg flex items-center justify-center shrink-0 border transition-all duration-500 shadow-inner",
                          !notif.is_read ? "bg-white/5 border-primary/20 scale-110" : "bg-white/[0.01] border-white/5"
                        )}>
                          {getIcon(notif.title)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-4 mb-1">
                            <p className={cn(
                              "text-sm font-medium truncate",
                              !notif.is_read ? "text-slate-100" : "text-slate-500"
                            )}>
                              {notif.title}
                            </p>
                            <span className="text-xs text-muted-foreground shrink-0 flex items-center gap-1.5">
                              <Clock className="w-2.5 h-2.5" />
                              {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <p className="text-sm text-slate-500 leading-relaxed font-medium line-clamp-2 italic">
                            "{notif.message}"
                          </p>
                        </div>
                        {!notif.is_read && (
                          <div className="absolute right-4 top-1/2 -translate-y-1/2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-white/5 bg-white/[0.01] text-center">
              <div className="flex items-center justify-center gap-2">
                <div className="w-1 h-1 rounded-full bg-emerald-500" />
                <p className="text-xs text-muted-foreground">
                   Operational Stream Active
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
