"use client";

import { useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { User, Lock, Bell, Save, Loader2, Camera } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const [profileData, setProfileData] = useState({
    full_name: user?.full_name || "",
    department: user?.department || "",
    cgpa: user?.cgpa?.toString() || "",
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
          <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage your identity and security protocols.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex gap-2 p-1 bg-zinc-900 border border-zinc-800 rounded-xl w-fit"
        >
          {tabs.map((tab) => (
            <motion.button
              key={tab.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
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
          className="rounded-2xl bg-zinc-950 border border-zinc-800 p-6 md:p-8 relative overflow-hidden"
        >
          {activeTab === "profile" && (
            <div className="space-y-8">
              <div className="flex items-center gap-6 pb-8 border-b border-zinc-800">
                <div className="relative group">
                  <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-primary to-purple-600 flex items-center justify-center text-2xl font-bold text-white">
                    {user?.full_name?.[0]}
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    className="absolute inset-0 bg-black/60 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Camera className="w-5 h-5 text-white" />
                  </motion.button>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-zinc-200">{user?.full_name}</h3>
                  <p className="text-zinc-500 text-sm">{user?.email}</p>
                  <span className="text-primary text-[10px] font-semibold uppercase tracking-wider mt-2 px-2.5 py-1 bg-primary/10 rounded-lg inline-block border border-primary/20">Student</span>
                </div>
              </div>

              <form onSubmit={handleProfileUpdate} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Full Name</label>
                  <input
                    type="text"
                    value={profileData.full_name}
                    onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Department</label>
                  <input
                    type="text"
                    value={profileData.department}
                    onChange={(e) => setProfileData({ ...profileData, department: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-zinc-200"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">CGPA</label>
                  <input
                    type="number"
                    step="0.01"
                    value={profileData.cgpa}
                    onChange={(e) => setProfileData({ ...profileData, cgpa: e.target.value })}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-zinc-200"
                  />
                </div>
                <div className="md:col-span-2 flex justify-end pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="bg-white text-black px-8 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Save Changes
                  </motion.button>
                </div>
              </form>
            </div>
          )}

          {activeTab === "security" && (
            <div className="space-y-6 text-center py-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-zinc-200">Encrypted Credentials</h3>
              <p className="text-zinc-500 text-sm max-w-sm mx-auto">Update your authentication keys to maintain session integrity across the platform.</p>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="bg-zinc-900 border border-zinc-800 px-6 py-3 rounded-xl font-semibold text-xs uppercase tracking-wider hover:bg-zinc-800 transition-all text-zinc-400"
              >
                Rotate Encryption Key
              </motion.button>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-5">
              <h3 className="text-base font-semibold text-zinc-200 mb-4">Communication Channels</h3>
              {[
                { name: "Application Status Alerts", desc: "Real-time signals when your hiring status updates.", default: true },
                { name: "New Opportunity Signals", desc: "Daily digest of new companies matching your profile.", default: true },
                { name: "Operational System Updates", desc: "Technical alerts and platform maintenance signals.", default: false },
              ].map((notif, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center justify-between p-4 rounded-2xl bg-zinc-900 border border-zinc-800"
                >
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm text-zinc-300">{notif.name}</p>
                    <p className="text-xs text-zinc-600">{notif.desc}</p>
                  </div>
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    className={`w-10 h-5 rounded-full p-0.5 cursor-pointer transition-colors ${notif.default ? "bg-primary" : "bg-zinc-800"}`}
                  >
                    <motion.div 
                      animate={{ x: notif.default ? 20 : 0 }}
                      className="w-4 h-4 bg-white rounded-full shadow-sm"
                    />
                  </motion.div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
