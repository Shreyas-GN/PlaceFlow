"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  useEffect(() => {
    const hasToken = localStorage.getItem('auth-storage');
    if (hasToken) {
      try {
        const { state } = JSON.parse(hasToken);
        if (!state.isAuthenticated) {
          localStorage.removeItem('auth-storage');
          localStorage.removeItem('admin-auth-storage');
        }
      } catch (e) {
        localStorage.clear();
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await authService.login(email, password);
      login(data.access_token);
      toast.success("Login successful");
      router.push("/dashboard");
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      const errorMessage = typeof detail === "string" 
        ? detail 
        : Array.isArray(detail)
          ? detail[0]?.msg || "Validation error"
          : "Invalid credentials";
      
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[120px] rounded-full" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-10">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="inline-flex items-center gap-3 font-bold text-3xl tracking-tight mb-6 group cursor-default"
          >
            <motion.div 
              whileHover={{ scale: 1.1 }}
              className="w-12 h-12 rounded-2xl bg-primary flex items-center justify-center shadow-2xl shadow-primary/40"
            >
              <GraduationCap className="w-7 h-7 text-primary-foreground" />
            </motion.div>
            <span className="bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">PlaceFlow</span>
          </motion.div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Student Authenticator</h1>
          <p className="text-zinc-500 mt-2 text-sm">Access your placement command center.</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-zinc-950 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
        >
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider ml-1">Academic Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="id@university.edu"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Password</label>
                <Link href="#" className="text-[10px] uppercase font-semibold text-primary hover:underline tracking-wider">Reset</Link>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-zinc-700"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-14 bg-white text-black rounded-2xl font-semibold flex items-center justify-center gap-2 text-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Synchronizing..." : (
                <>
                  Establish Session
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 pt-6 border-t border-zinc-800 text-center">
            <p className="text-sm text-zinc-500">
              New to the platform?{" "}
              <Link href="/register" className="text-primary font-semibold hover:underline ml-1">
                Initialize Account
              </Link>
            </p>
          </div>
        </motion.div>

        <p className="text-center mt-10 text-[10px] font-semibold text-zinc-700 uppercase tracking-[0.3em]">
          Secure Infrastructure v1.0.4
        </p>
      </motion.div>
    </div>
  );
}
