"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuthStore } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { FormField } from "@/components/shared/FormField";

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginForm = z.infer<typeof loginSchema>;

const INPUT_CLS =
  "w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";

export default function LoginPage() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    mode: "onBlur",
  });

  useEffect(() => {
    const hasToken = localStorage.getItem("auth-storage");
    if (hasToken) {
      try {
        const { state } = JSON.parse(hasToken);
        if (!state.isAuthenticated) {
          localStorage.removeItem("auth-storage");
          localStorage.removeItem("admin-auth-storage");
        }
      } catch {
        localStorage.clear();
      }
    }
  }, []);

  const onSubmit = async (data: LoginForm) => {
    try {
      const res = await authService.login(data.email, data.password);
      login(res.access_token);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail[0]?.msg || "Validation error"
          : "Invalid email or password";
      toast.error(message);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="font-semibold text-xl text-gray-900">PlaceFlow</span>
          </Link>
          <h1 className="text-2xl font-semibold text-gray-900">Sign in</h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            Track your applications, interviews, and offers.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
            <FormField label="Email" error={errors.email} required>
              {(id) => (
                <input
                  id={id}
                  type="email"
                  {...register("email")}
                  placeholder="you@university.edu"
                  className={INPUT_CLS}
                />
              )}
            </FormField>

            <FormField label="Password" error={errors.password} required>
              {(id) => (
                <div className="space-y-1.5">
                  <input
                    id={id}
                    type="password"
                    {...register("password")}
                    placeholder="••••••••"
                    className={INPUT_CLS}
                  />
                  <div className="flex justify-end">
                    <Link
                      href="/forgot-password"
                      className="text-sm text-blue-600 hover:underline"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>
              )}
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-blue-600 text-white rounded-[10px] font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}
              <Link href="/register" className="text-blue-600 font-medium hover:underline">
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
