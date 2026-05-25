"use client";

import { useAdminStore } from "@/store/admin.store";
import { Settings, Shield, User, Lock } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  const { admin } = useAdminStore();

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-zinc-500 text-sm mt-0.5">Manage your admin profile and system preferences.</p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"
          >
            <h2 className="text-base font-semibold mb-5 flex items-center gap-2 text-zinc-200">
              <User className="w-4 h-4 text-primary" /> Profile Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Full Name</label>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-400">
                    {admin?.full_name}
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Email Address</label>
                  <div className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-400">
                    {admin?.email}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-2xl bg-zinc-950 border border-zinc-800"
          >
            <h2 className="text-base font-semibold mb-5 flex items-center gap-2 text-zinc-200">
              <Lock className="w-4 h-4 text-orange-500" /> Security
            </h2>
            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl px-5 py-2.5 text-sm font-medium transition-all text-zinc-400"
            >
              Change Password
            </motion.button>
          </motion.div>
        </div>

        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.15 }}
          className="space-y-6"
        >
          <div className="p-6 rounded-2xl bg-gradient-to-br from-primary/10 via-purple-500/5 to-zinc-950 border border-primary/20">
            <motion.div 
              whileHover={{ rotate: 10, scale: 1.1 }}
              className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mb-4"
            >
              <Shield className="w-5 h-5 text-primary" />
            </motion.div>
            <h3 className="text-base font-semibold text-zinc-200 mb-1">Admin Status</h3>
            <p className="text-xs text-zinc-500 mb-5">You have super-admin privileges.</p>
            <div className="bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-xl px-3 py-1.5 text-[10px] font-semibold inline-block uppercase tracking-wider">
              System Level Access
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
