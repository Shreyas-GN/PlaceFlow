"use client";

import { useState } from "react";
import { useAdminStore } from "@/store/admin.store";
import { Shield, User, Lock, Eye, EyeOff, Loader2, CheckCircle2, Bell, Calendar, Building2, Mail, Clock, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { format } from "date-fns";

export default function AdminSettingsPage() {
  const { admin } = useAdminStore();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm_password: "" });

  const [notifications, setNotifications] = useState({
    new_applications: true,
    daily_summary: true,
    system_alerts: true,
    marketing: false,
  });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.new_password !== passwordForm.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    if (passwordForm.new_password.length < 6) {
      toast.error("New password must be at least 6 characters");
      return;
    }
    setPasswordLoading(true);
    try {
      await adminService.changePassword(passwordForm.current_password, passwordForm.new_password);
      toast.success("Password changed successfully");
      setShowPasswordForm(false);
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Manage your admin profile and system preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-lg bg-layer-2 border border-zinc-800/60"
          >
            <h2 className="text-lg font-medium mb-5 flex items-center gap-2 text-zinc-200">
              <User className="w-4 h-4 text-primary" /> Profile Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Full Name</label>
                  <div className="bg-layer-3 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm text-zinc-400">
                    {admin?.full_name}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Email Address</label>
                  <div className="bg-layer-3 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm text-zinc-400 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-600" />
                    {admin?.email}
                  </div>
                </div>
              </div>
              {admin?.created_at && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Account Created</label>
                  <div className="bg-layer-3 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm text-zinc-500 flex items-center gap-2">
                    <Calendar className="w-3.5 h-3.5 text-zinc-600" />
                    {format(new Date(admin.created_at), 'MMMM dd, yyyy')}
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-lg bg-layer-2 border border-zinc-800/60"
          >
            <h2 className="text-lg font-medium mb-5 flex items-center gap-2 text-zinc-200">
              <Lock className="w-4 h-4 text-primary" /> Security
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium text-sm text-zinc-300">Password</p>
                  <p className="text-xs text-zinc-600">Last changed: {admin?.created_at ? format(new Date(admin.created_at), 'MMM yyyy') : 'N/A'}</p>
                </div>
                {!showPasswordForm && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowPasswordForm(true)}
                    className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/60 rounded-md px-5 py-2 text-sm font-medium transition-all text-zinc-400"
                  >
                    Change Password
                  </motion.button>
                )}
              </div>

              <AnimatePresence>
                {showPasswordForm && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handlePasswordChange}
                    className="space-y-4 mt-5 pt-5 border-t border-zinc-800/60"
                  >
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-500">Current Password</label>
                      <div className="relative">
                        <input
                          type={showCurrent ? "text" : "password"}
                          value={passwordForm.current_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, current_password: e.target.value })}
                          required
                          className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                        />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-500">New Password</label>
                      <div className="relative">
                        <input
                          type={showNew ? "text" : "password"}
                          value={passwordForm.new_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, new_password: e.target.value })}
                          required
                          minLength={6}
                          className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-zinc-500">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirm ? "text" : "password"}
                          value={passwordForm.confirm_password}
                          onChange={(e) => setPasswordForm({ ...passwordForm, confirm_password: e.target.value })}
                          required
                          className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-300">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => { setShowPasswordForm(false); setPasswordForm({ current_password: "", new_password: "", confirm_password: "" }); }}
                        className="px-5 py-2.5 rounded-md border border-zinc-800/60 text-sm font-medium hover:bg-zinc-900 transition-all"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={passwordLoading}
                        className="px-5 py-2.5 rounded-md bg-primary text-white text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-all disabled:opacity-50"
                      >
                        {passwordLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                        {passwordLoading ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-lg bg-layer-2 border border-zinc-800/60"
          >
            <h2 className="text-lg font-medium mb-5 flex items-center gap-2 text-zinc-200">
              <Bell className="w-4 h-4 text-primary" /> Notification Preferences
            </h2>
            <div className="space-y-1">
              {[
                { key: "new_applications", name: "New Applications", desc: "Alert when a student submits a new application." },
                { key: "daily_summary", name: "Daily Summary", desc: "End-of-day digest of all platform activity." },
                { key: "system_alerts", name: "System Alerts", desc: "Technical alerts and maintenance notifications." },
                { key: "marketing", name: "Marketing & Updates", desc: "Product updates and feature announcements." },
              ].map((notif, i) => (
                <motion.div 
                  key={notif.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center justify-between"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm text-zinc-300">{notif.name}</p>
                    <p className="text-xs text-zinc-600">{notif.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications({ ...notifications, [notif.key]: !(notifications as any)[notif.key] })}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${(notifications as any)[notif.key] ? "bg-primary" : "bg-zinc-800"}`}
                  >
                    <motion.div 
                      animate={{ x: (notifications as any)[notif.key] ? 20 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="p-6 rounded-lg bg-layer-2 border border-zinc-800/60"
          >
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-4"
            >
              <Shield className="w-5 h-5 text-primary" />
            </motion.div>
            <h3 className="text-lg font-medium text-zinc-200 mb-1">Admin Status</h3>
            <p className="text-xs text-zinc-500 mb-5">You have super-admin privileges.</p>
            <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md px-3 py-1.5 text-xs inline-block">
              System Level Access
            </div>
            {admin?.created_at && (
              <div className="mt-4 pt-4 border-t border-primary/10 text-xs text-zinc-500 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Admin since {format(new Date(admin.created_at), 'MMM yyyy')}
              </div>
            )}
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-lg bg-layer-2 border border-zinc-800/60"
          >
            <div className="flex items-center gap-2.5 mb-4">
              <Globe className="w-4 h-4 text-primary" />
              <h3 className="text-lg font-medium text-zinc-200">Placement Season</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Semester</span>
                <span className="text-zinc-300 font-medium">Odd 2025-26</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Status</span>
                <span className="text-emerald-500 font-medium text-xs bg-emerald-500/10 px-2 py-0.5 rounded-md">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-500">Applications</span>
                <span className="text-zinc-300 font-medium">Open</span>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full mt-3 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800/60 rounded-md py-2.5 text-xs font-medium transition-all text-zinc-400"
              >
                Configure Season
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
