"use client";

import { useEffect, useRef, useState } from "react";
import { useNotificationStore } from "@/store/notification.store";
import { Bell, Check, Clock, MessageSquare, Briefcase, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

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
    if (title.includes("Submitted")) return <Briefcase className="w-4 h-4 text-blue-600" />;
    if (title.includes("Shortlisted")) return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    if (title.includes("Status Update")) return <MessageSquare className="w-4 h-4 text-blue-600" />;
    return <Bell className="w-4 h-4 text-gray-400" />;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative p-2 rounded-lg transition-colors",
          isOpen ? "bg-gray-100 text-gray-900" : "text-gray-500 hover:bg-gray-100 hover:text-gray-700"
        )}
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 w-4 h-4 bg-blue-600 text-[10px] font-semibold text-white rounded-full flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-gray-200 rounded-xl shadow-floating overflow-hidden z-[100]">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-gray-900">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                className="text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1 transition-colors"
              >
                <Check className="w-3 h-3" /> Mark all read
              </button>
            )}
          </div>

          {/* Body */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading && notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                <p className="text-xs text-gray-400">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-10 text-center">
                <Bell className="w-8 h-8 text-gray-200 mx-auto mb-3" />
                <p className="text-sm font-medium text-gray-900">All caught up</p>
                <p className="text-xs text-gray-400 mt-1">No new notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    onClick={() => { if (!notif.is_read) markAsRead(notif.id); }}
                    className={cn(
                      "p-4 transition-colors cursor-pointer hover:bg-gray-50 relative",
                      !notif.is_read ? "bg-blue-50/40" : ""
                    )}
                  >
                    <div className="flex gap-3">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border",
                        !notif.is_read ? "bg-blue-50 border-blue-200" : "bg-gray-50 border-gray-200"
                      )}>
                        {getIcon(notif.title)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className={cn(
                            "text-sm font-medium truncate",
                            !notif.is_read ? "text-gray-900" : "text-gray-500"
                          )}>
                            {notif.title}
                          </p>
                          <span className="text-[10px] text-gray-400 shrink-0 flex items-center gap-1 whitespace-nowrap mt-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {formatDistanceToNow(new Date(notif.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{notif.message}</p>
                      </div>
                      {!notif.is_read && (
                        <div className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            <p className="text-xs text-gray-400">Live updates enabled</p>
          </div>
        </div>
      )}
    </div>
  );
}
