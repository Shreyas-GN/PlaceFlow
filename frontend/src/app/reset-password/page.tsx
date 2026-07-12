"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { GraduationCap, Loader2, ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { FormField } from "@/components/shared/FormField";

const schema = z
  .object({
    new_password: z.string().min(6, "Password must be at least 6 characters"),
    confirm_password: z.string().min(1, "Please confirm your password"),
  })
  .refine((d) => d.new_password === d.confirm_password, {
    message: "Passwords do not match",
    path: ["confirm_password"],
  });

type FormData = z.infer<typeof schema>;

const INPUT_CLS = "w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [done, setDone] = useState(false);
  const [invalidToken, setInvalidToken] = useState(false);

  useEffect(() => { if (!token) setInvalidToken(true); }, [token]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    if (!token) return;
    try {
      await authService.resetPassword(token, data.new_password);
      setDone(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Reset failed — the link may have expired");
    }
  };

  if (invalidToken) {
    return (
      <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-4 shadow-sm">
          <XCircle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-gray-900 font-semibold text-lg">Invalid reset link</h2>
          <p className="text-gray-500 text-sm">This password reset link is missing or malformed. Please request a new one.</p>
          <Link href="/forgot-password" className="inline-flex items-center gap-1.5 text-sm text-blue-600 font-medium hover:underline">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 font-semibold text-xl mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <span className="text-gray-900">PlaceFlow</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">Set a new password</h1>
          <p className="text-gray-500 mt-2 text-sm">Choose a strong password for your account.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {done ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 text-green-600" />
              </div>
              <h2 className="text-gray-900 font-semibold text-lg">Password updated</h2>
              <p className="text-gray-500 text-sm">Your password has been reset successfully. Redirecting to login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <FormField label="New Password" error={errors.new_password} required>
                {(id) => <input id={id} type="password" {...register("new_password")} placeholder="••••••••" className={INPUT_CLS} />}
              </FormField>
              <FormField label="Confirm Password" error={errors.confirm_password} required>
                {(id) => <input id={id} type="password" {...register("confirm_password")} placeholder="••••••••" className={INPUT_CLS} />}
              </FormField>

              <button type="submit" disabled={isSubmitting}
                className="w-full h-11 bg-blue-600 text-white rounded-[10px] font-medium flex items-center justify-center gap-2 text-sm hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Updating..." : "Reset Password"}
              </button>

              <div className="text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors">
                  <ArrowLeft className="w-3.5 h-3.5" />
                  Back to login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
