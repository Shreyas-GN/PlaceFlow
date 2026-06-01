"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { authService } from "@/services/auth.service";
import { motion } from "framer-motion";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    password: "",
    department: "",
    cgpa: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await authService.register({
        ...formData,
        cgpa: parseFloat(formData.cgpa),
      });
      toast.success("Account created! Please log in.");
      router.push("/login");
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      const errorMessage = typeof detail === "string" 
        ? detail 
        : Array.isArray(detail)
          ? detail[0]?.msg || "Validation error"
          : "Registration failed";
      
      toast.error(errorMessage);
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
            className="inline-flex items-center gap-2 font-semibold text-2xl mb-4"
          >
            <div className="w-10 h-10 rounded-md bg-primary flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-white">PlaceFlow</span>
          </motion.div>
          <h1 className="text-2xl font-semibold tracking-tight">Create an account</h1>
          <p className="text-zinc-500 mt-1 text-sm">Join the placement coordination platform</p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-layer-2 border border-zinc-800/60 rounded-2xl p-8 shadow-elevated"
        >
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500">Full Name</label>
              <input
                type="text"
                required
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                placeholder="John Doe"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500">Email</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="john@university.edu"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-zinc-700"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">Department</label>
                <input
                  type="text"
                  required
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  placeholder="CSE"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-zinc-700"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-500">CGPA</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="10"
                  required
                  value={formData.cgpa}
                  onChange={(e) => setFormData({ ...formData, cgpa: e.target.value })}
                  placeholder="9.5"
                  className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-zinc-700"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-500">Password</label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all placeholder:text-zinc-700"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="w-full h-12 bg-white text-black rounded-md font-semibold flex items-center justify-center gap-2 text-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50 mt-2"
            >
              {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isLoading ? "Creating account..." : (
                <>
                  Register
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </motion.button>
          </form>

          <div className="mt-8 text-center pt-6 border-t border-zinc-800">
            <p className="text-sm text-zinc-500">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-semibold hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
