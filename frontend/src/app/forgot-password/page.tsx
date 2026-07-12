"use client";

import { useState } from "react";
import Link from "next/link";
import { GraduationCap, Loader2, ArrowLeft, Mail } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { FormField } from "@/components/shared/FormField";

const schema = z.object({
  email: z.string().email("Enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

const INPUT_CLS = "w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onBlur",
  });

  const onSubmit = async (data: FormData) => {
    try {
      await authService.forgotPassword(data.email);
      setSubmitted(true);
    } catch {
      toast.error("Something went wrong — please try again");
    }
  };

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
          <h1 className="text-2xl font-semibold text-gray-900">Reset your password</h1>
          <p className="text-gray-500 mt-2 text-sm">Enter your email and we'll send you a reset link.</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 rounded-full bg-blue-50 border border-blue-200 flex items-center justify-center mx-auto">
                <Mail className="w-7 h-7 text-blue-600" />
              </div>
              <h2 className="text-gray-900 font-semibold text-lg">Check your inbox</h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                If that email is registered, a password reset link has been sent. The link expires in 15 minutes.
              </p>
              <Link href="/login" className="inline-flex items-center gap-2 text-sm text-blue-600 font-medium hover:underline mt-2">
                <ArrowLeft className="w-4 h-4" />
                Back to login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
              <FormField label="Email" error={errors.email} required>
                {(id) => (
                  <input id={id} type="email" {...register("email")} placeholder="you@university.edu" className={INPUT_CLS} />
                )}
              </FormField>

              <button type="submit" disabled={isSubmitting}
                className="w-full h-11 bg-blue-600 text-white rounded-[10px] font-medium flex items-center justify-center gap-2 text-sm hover:bg-blue-700 transition-colors disabled:opacity-50">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {isSubmitting ? "Sending..." : "Send Reset Link"}
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
