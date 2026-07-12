"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { GraduationCap, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { FormField } from "@/components/shared/FormField";

const registerSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Enter a valid email address"),
  department: z.string().min(1, "Department is required"),
  cgpa: z.coerce
    .number({ message: "Enter a valid CGPA" })
    .min(0, "CGPA must be 0 or above")
    .max(10, "CGPA must be 10 or below"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type RegisterForm = z.infer<typeof registerSchema>;

const INPUT_CLS =
  "w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";

export default function RegisterPage() {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema) as any,
    mode: "onBlur",
  });

  const onSubmit = async (data: RegisterForm) => {
    try {
      await authService.register(data);
      toast.success("Account created. Please sign in.");
      router.push("/login");
    } catch (error: any) {
      const detail = error.response?.data?.detail;
      const message =
        typeof detail === "string"
          ? detail
          : Array.isArray(detail)
          ? detail[0]?.msg || "Validation error"
          : "Registration failed. Please try again.";
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
          <h1 className="text-2xl font-semibold text-gray-900">Create account</h1>
          <p className="text-gray-500 mt-1.5 text-sm">
            Join the campus placement platform.
          </p>
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-card">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
            <FormField label="Full Name" error={errors.full_name} required>
              {(id) => (
                <input
                  id={id}
                  type="text"
                  {...register("full_name")}
                  placeholder="Jane Doe"
                  className={INPUT_CLS}
                />
              )}
            </FormField>

            <FormField label="Email" error={errors.email} required>
              {(id) => (
                <input
                  id={id}
                  type="email"
                  {...register("email")}
                  placeholder="jane@university.edu"
                  className={INPUT_CLS}
                />
              )}
            </FormField>

            <div className="grid grid-cols-2 gap-3">
              <FormField label="Department" error={errors.department} required>
                {(id) => (
                  <input
                    id={id}
                    type="text"
                    {...register("department")}
                    placeholder="CSE"
                    className={INPUT_CLS}
                  />
                )}
              </FormField>

              <FormField label="CGPA" error={errors.cgpa} required>
                {(id) => (
                  <input
                    id={id}
                    type="number"
                    step="0.01"
                    min="0"
                    max="10"
                    {...register("cgpa")}
                    placeholder="9.5"
                    className={INPUT_CLS}
                  />
                )}
              </FormField>
            </div>

            <FormField label="Password" error={errors.password} required>
              {(id) => (
                <input
                  id={id}
                  type="password"
                  {...register("password")}
                  placeholder="••••••••"
                  className={INPUT_CLS}
                />
              )}
            </FormField>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 bg-blue-600 text-white rounded-[10px] font-medium text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSubmitting ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{" "}
              <Link href="/login" className="text-blue-600 font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
