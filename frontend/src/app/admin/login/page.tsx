"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, Loader2, GraduationCap, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin.service";
import { useAdminStore } from "@/store/admin.store";
import { motion } from "framer-motion";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setAdmin, setToken } = useAdminStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const loginRes = await adminService.login(email, password);
      const token = loginRes.access_token;
      setToken(token);

      const adminData = await adminService.getMe(token);
      setAdmin(adminData);

      toast.success("Welcome back, Admin!");
      router.push("/admin");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-layer-1 flex items-center justify-center p-6 relative overflow-hidden">


      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="inline-flex items-center gap-2 font-semibold text-xl mb-4"
          >
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-white">PlaceFlow</span>
          </motion.div>
          <div className="flex items-center justify-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <h1 className="text-2xl font-semibold tracking-tight">Admin Portal</h1>
          </div>
          <p className="text-zinc-500 mt-1 text-sm">Placement coordination management</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-layer-2 border border-zinc-800/60 rounded-2xl p-8 shadow-elevated"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@placeflow.io"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-zinc-700"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-primary text-white rounded-md font-semibold flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-all disabled:opacity-50 mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Authenticating..." : (
                <>
                  Enter Admin Dashboard
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              Student?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Login here
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
