"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAdminStore } from "@/store/admin.store";
import { Shield, User, Lock, Eye, EyeOff, Loader2, CheckCircle2, Bell, Calendar, Mail, Clock, Globe } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { FormField } from "@/components/shared/FormField";
import { format } from "date-fns";

const passwordSchema = z
  .object({
    current_password: z.string().min(1, "Current password is required"),
    new_password: z.string().min(6, "Must be at least 6 characters"),
    confirm_password: z.string().min(1, "Confirm your new password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type PasswordForm = z.infer<typeof passwordSchema>;

const INPUT_CLS = "w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";
const READONLY_CLS = "w-full bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed flex items-center";

export default function AdminSettingsPage() {
  const { admin } = useAdminStore();
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [notifications, setNotifications] = useState({
    new_applications: true,
    daily_summary: true,
    system_alerts: true,
    marketing: false,
  });

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
  });

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      await adminService.changePassword(data.current_password, data.new_password);
      toast.success("Password changed successfully");
      setShowPasswordForm(false);
      reset();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to change password");
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-500 text-sm mt-0.5">Manage your admin profile and system preferences.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Profile */}
          <div className="p-6 rounded-xl bg-white border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" /> Profile Information
            </h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Full Name</label>
                  <div className={READONLY_CLS}>{admin?.full_name}</div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Email Address</label>
                  <div className={`${READONLY_CLS} gap-2`}>
                    <Mail className="w-3.5 h-3.5 text-gray-400" />
                    {admin?.email}
                  </div>
                </div>
              </div>
              {admin?.created_at && (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Account Created</label>
                  <div className={`${READONLY_CLS} gap-2`}>
                    <Calendar className="w-3.5 h-3.5 text-gray-400" />
                    {format(new Date(admin.created_at), 'MMMM dd, yyyy')}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Security */}
          <div className="p-6 rounded-xl bg-white border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Lock className="w-4 h-4 text-blue-600" /> Security
            </h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-sm text-gray-900">Password</p>
                  <p className="text-xs text-gray-500 mt-0.5">Last changed: {admin?.created_at ? format(new Date(admin.created_at), 'MMM yyyy') : 'N/A'}</p>
                </div>
                {!showPasswordForm && (
                  <button
                    onClick={() => setShowPasswordForm(true)}
                    className="px-4 py-2 rounded-[10px] bg-white border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    Change Password
                  </button>
                )}
              </div>

              {showPasswordForm && (
                <form
                  onSubmit={handleSubmit(onPasswordSubmit)}
                  className="space-y-4 mt-4 pt-4 border-t border-gray-100"
                  noValidate
                >
                  <FormField label="Current Password" error={errors.current_password} required>
                    {(id) => (
                      <div className="relative">
                        <input id={id} type={showCurrent ? "text" : "password"} {...register("current_password")} className={INPUT_CLS} />
                        <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showCurrent ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </FormField>

                  <FormField label="New Password" error={errors.new_password} required>
                    {(id) => (
                      <div className="relative">
                        <input id={id} type={showNew ? "text" : "password"} {...register("new_password")} className={INPUT_CLS} />
                        <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </FormField>

                  <FormField label="Confirm New Password" error={errors.confirm_password} required>
                    {(id) => (
                      <div className="relative">
                        <input id={id} type={showConfirm ? "text" : "password"} {...register("confirm_password")} className={INPUT_CLS} />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    )}
                  </FormField>

                  <div className="flex gap-3 pt-1">
                    <button
                      type="button"
                      onClick={() => { setShowPasswordForm(false); reset(); }}
                      className="px-5 py-2.5 rounded-[10px] border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="px-5 py-2.5 rounded-[10px] bg-blue-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                      {isSubmitting ? "Updating..." : "Update Password"}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

          {/* Notifications */}
          <div className="p-6 rounded-xl bg-white border border-gray-200">
            <h2 className="text-base font-semibold text-gray-900 mb-5 flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" /> Notification Preferences
            </h2>
            <div className="space-y-4">
              {[
                { key: "new_applications", name: "New Applications", desc: "Alert when a student submits a new application." },
                { key: "daily_summary", name: "Daily Summary", desc: "End-of-day digest of all platform activity." },
                { key: "system_alerts", name: "System Alerts", desc: "Technical alerts and maintenance notifications." },
                { key: "marketing", name: "Marketing & Updates", desc: "Product updates and feature announcements." },
              ].map((notif) => (
                <div key={notif.key} className="flex items-center justify-between py-1">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{notif.name}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{notif.desc}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setNotifications({ ...notifications, [notif.key]: !(notifications as any)[notif.key] })}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${(notifications as any)[notif.key] ? "bg-blue-600" : "bg-gray-200"}`}
                  >
                    <div
                      className="w-4 h-4 bg-white rounded-full shadow-sm transition-transform"
                      style={{ transform: (notifications as any)[notif.key] ? "translateX(20px)" : "translateX(0)" }}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="p-6 rounded-xl bg-white border border-gray-200">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">Admin Status</h3>
            <p className="text-xs text-gray-500 mb-4">You have super-admin privileges.</p>
            <div className="bg-green-50 text-green-700 border border-green-200 rounded-lg px-3 py-1.5 text-xs font-medium inline-block">
              System Level Access
            </div>
            {admin?.created_at && (
              <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-400 flex items-center gap-2">
                <Clock className="w-3.5 h-3.5" />
                Admin since {format(new Date(admin.created_at), 'MMM yyyy')}
              </div>
            )}
          </div>

          <div className="p-6 rounded-xl bg-white border border-gray-200">
            <div className="flex items-center gap-2.5 mb-4">
              <Globe className="w-4 h-4 text-blue-600" />
              <h3 className="text-base font-semibold text-gray-900">Placement Season</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Semester</span>
                <span className="text-gray-900 font-medium">Odd 2025-26</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Status</span>
                <span className="text-green-700 font-medium text-xs bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">Active</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Applications</span>
                <span className="text-gray-900 font-medium">Open</span>
              </div>
              <button className="w-full mt-3 bg-white hover:bg-gray-50 border border-gray-300 rounded-[10px] py-2.5 text-sm font-medium transition-colors text-gray-700">
                Configure Season
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
