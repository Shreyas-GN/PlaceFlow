"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Lock, Bell, Save, Loader2, Camera, Eye, EyeOff, CheckCircle2, Mail, Calendar, GraduationCap, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    department: user?.department || "",
    cgpa: user?.cgpa?.toString() || "",
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ current_password: "", new_password: "", confirm_password: "" });

  const [notifications, setNotifications] = useState({
    application_updates: true,
    new_opportunities: true,
    deadline_reminders: true,
    system_alerts: false,
  });

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const updatedUser = await authService.updateMe({
        ...profileData,
        cgpa: parseFloat(profileData.cgpa),
      });
      setUser(updatedUser);
      toast.success("Identity parameters updated successfully.");
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Update failed");
    } finally {
      setIsLoading(false);
    }
  };

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
      await authService.changePassword(passwordForm.current_password, passwordForm.new_password);
      toast.success("Password changed successfully");
      setShowPasswordForm(false);
      setPasswordForm({ current_password: "", new_password: "", confirm_password: "" });
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to change password");
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Core Profile", icon: User },
    { id: "security", name: "Security & Keys", icon: Lock },
    { id: "notifications", name: "Alert Settings", icon: Bell },
  ];

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-2xl font-semibold tracking-tight">Settings</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage your identity and security protocols.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 p-1 bg-layer-3 border border-zinc-800/60 rounded-md w-fit"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-medium transition-all ${
                activeTab === tab.id 
                ? "bg-primary text-white" 
                : "text-zinc-500 hover:text-zinc-300"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.name}
            </motion.button>
          ))}
        </motion.div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          className="rounded-lg bg-layer-2 border border-zinc-800/60 p-6 md:p-8 relative overflow-hidden"
        >
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-zinc-800/60">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-md bg-primary flex items-center justify-center text-2xl font-semibold text-white">
                    {user?.full_name?.[0]}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="absolute inset-0 bg-black/60 rounded-md opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-200">{user?.full_name}</h3>
                  <p className="text-zinc-500 text-sm flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5" /> {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground px-2.5 py-1 bg-primary/10 rounded-md inline-block border border-primary/20">Student</span>
                    {user?.created_at && (
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Joined {format(new Date(user.created_at), 'MMM yyyy')}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-500">Full Name</label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Email</label>
                  <div className="bg-layer-3 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm text-zinc-500 flex items-center gap-2">
                    <Mail className="w-3.5 h-3.5 text-zinc-600" />
                    {user?.email}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">Department</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-zinc-500">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    value={profileData.cgpa}
                    onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-zinc-200"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="bg-white text-black px-8 py-3 rounded-md font-medium text-sm flex items-center gap-2 hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-zinc-200">Authentication</h3>
                  <p className="text-zinc-500 text-sm">Manage your password and account security.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm text-zinc-300">Password</p>
                    <p className="text-xs text-zinc-600">Last changed: {user?.created_at ? format(new Date(user.created_at), 'MMM yyyy') : 'N/A'}</p>
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

              <div className="flex items-center gap-3">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <p className="font-medium text-sm text-zinc-300">Account Security</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-zinc-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Strong Password
                </div>
                <div className="flex items-center gap-2.5 text-xs text-zinc-500">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Account Age: {user?.created_at ? format(new Date(user.created_at), 'MMM yyyy') : 'N/A'}
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-5">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-medium text-zinc-200">Communication Channels</h3>
                  <p className="text-zinc-500 text-sm">Configure which alerts you receive on the platform.</p>
                </div>
              </div>

              {[
                { key: "application_updates", name: "Application Status Alerts", desc: "Real-time signals when your hiring status updates.", icon: CheckCircle2 },
                { key: "new_opportunities", name: "New Opportunity Signals", desc: "Daily digest of new companies matching your profile.", icon: GraduationCap },
                { key: "deadline_reminders", name: "Deadline Reminders", desc: "Reminders 24 hours before application deadlines close.", icon: Calendar },
                { key: "system_alerts", name: "Operational System Updates", desc: "Technical alerts and platform maintenance signals.", icon: ShieldCheck },
              ].map((notif, i) => (
                <motion.div 
                  key={notif.key}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-md bg-zinc-800 flex items-center justify-center">
                      <notif.icon className="w-4 h-4 text-zinc-400" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="font-medium text-sm text-zinc-300">{notif.name}</p>
                      <p className="text-xs text-zinc-600">{notif.desc}</p>
                    </div>
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
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
