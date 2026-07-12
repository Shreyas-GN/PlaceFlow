"use client";

import { useState, forwardRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import {
  GraduationCap, BarChart2, Phone, Link2, FileCheck,
  ChevronRight, ChevronLeft, Loader2, CheckCircle2,
} from "lucide-react";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { studentService } from "@/services/student.service";
import { FormField } from "@/components/shared/FormField";

const onboardingSchema = z.object({
  roll_number: z.string().min(1, "Roll number is required"),
  degree: z.string().min(1, "Degree is required"),
  current_semester: z.coerce.number({ message: "Enter a valid semester" }).int().min(1).max(10),
  graduation_year: z.coerce.number({ message: "Enter a valid year" }).int().min(2020).max(2035),
  active_backlogs: z.coerce.number({ message: "Enter a number" }).int().min(0, "Cannot be negative"),
  historical_backlogs: z.coerce.number({ message: "Enter a number" }).int().min(0, "Cannot be negative"),
  tenth_percentage: z.coerce.number({ message: "Enter a valid percentage" }).min(0).max(100),
  twelfth_percentage: z.coerce.number({ message: "Enter a valid percentage" }).min(0).max(100),
  whatsapp_number: z.string().min(10, "Enter a valid WhatsApp number"),
  parent_contact: z.string().min(10, "Enter a valid contact number"),
  alternative_email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  resume_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  policy_agreement: z.boolean().refine((v) => v, "You must accept the placement policy"),
  data_consent: z.boolean().refine((v) => v, "You must consent to data usage"),
  eligibility_rules: z.boolean().refine((v) => v, "You must acknowledge eligibility rules"),
});

type OnboardingForm = z.infer<typeof onboardingSchema>;

const STEP_FIELDS: (keyof OnboardingForm)[][] = [
  ["roll_number", "degree", "current_semester", "graduation_year"],
  ["active_backlogs", "historical_backlogs", "tenth_percentage", "twelfth_percentage"],
  ["whatsapp_number", "parent_contact", "alternative_email"],
  ["resume_url", "linkedin_url", "github_url"],
  ["policy_agreement", "data_consent", "eligibility_rules"],
];

const STEPS = [
  { label: "Academic Info", icon: GraduationCap },
  { label: "Metrics", icon: BarChart2 },
  { label: "Contact", icon: Phone },
  { label: "Documents", icon: Link2 },
  { label: "Declaration", icon: FileCheck },
];

const INPUT_CLS = "w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";
const READONLY_CLS = "w-full bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed";

export function StudentOnboardingForm() {
  const router = useRouter();
  const { user, setUser } = useAuthStore();
  const [step, setStep] = useState(0);

  const form = useForm<OnboardingForm>({
    resolver: zodResolver(onboardingSchema) as any,
    mode: "onBlur",
    defaultValues: {
      active_backlogs: 0,
      historical_backlogs: 0,
      policy_agreement: false,
      data_consent: false,
      eligibility_rules: false,
    },
  });

  const { register, handleSubmit, trigger, formState: { errors, isSubmitting } } = form;

  const advance = async () => {
    const valid = await trigger(STEP_FIELDS[step] as any);
    if (valid) setStep((s) => s + 1);
  };

  const onSubmit = async (data: OnboardingForm) => {
    try {
      const { policy_agreement, data_consent, eligibility_rules, ...payload } = data;
      const updated = await studentService.submitOnboarding({
        ...payload,
        alternative_email: payload.alternative_email || undefined,
        resume_url: payload.resume_url || undefined,
        linkedin_url: payload.linkedin_url || undefined,
        github_url: payload.github_url || undefined,
      });
      setUser(updated);
      toast.success("Profile completed — welcome to PlaceFlow.");
      router.push("/dashboard");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Submission failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-semibold text-gray-900">Complete your profile</h1>
          <p className="text-gray-500 text-sm">
            Hey {user?.full_name?.split(" ")[0]}, fill in your placement details to get started.
          </p>
        </div>

        {/* Step progress */}
        <div className="flex items-center gap-2">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = i < step;
            const active = i === step;
            return (
              <div key={s.label} className="flex-1 flex flex-col items-center gap-1.5">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors border ${
                  done ? "bg-green-50 border-green-200 text-green-600"
                    : active ? "bg-blue-50 border-blue-200 text-blue-600"
                    : "bg-white border-gray-200 text-gray-400"
                }`}>
                  {done ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] font-medium hidden sm:block ${active ? "text-gray-900" : "text-gray-400"}`}>
                  {s.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="space-y-5">
              {/* Step 1: Academic Info */}
              {step === 0 && (
                <>
                  <StepTitle icon={GraduationCap} title="Academic Information" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="Roll Number" error={errors.roll_number} required>
                      {(id) => <input id={id} {...register("roll_number")} className={INPUT_CLS} placeholder="e.g. 1RV21CS001" />}
                    </FormField>
                    <FormField label="Degree" error={errors.degree} required>
                      {(id) => <input id={id} {...register("degree")} className={INPUT_CLS} placeholder="e.g. B.E. / B.Tech" />}
                    </FormField>
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">Department</label>
                      <div className={READONLY_CLS}>{user?.department ?? "—"}</div>
                      <p className="text-[11px] text-gray-400">Set during registration</p>
                    </div>
                    <FormField label="Current Semester" error={errors.current_semester} required>
                      {(id) => <input id={id} type="number" min={1} max={10} {...register("current_semester")} className={INPUT_CLS} placeholder="1 – 10" />}
                    </FormField>
                    <FormField label="Graduation Year" error={errors.graduation_year} required>
                      {(id) => <input id={id} type="number" min={2020} max={2035} {...register("graduation_year")} className={INPUT_CLS} placeholder="e.g. 2026" />}
                    </FormField>
                  </div>
                </>
              )}

              {/* Step 2: Metrics */}
              {step === 1 && (
                <>
                  <StepTitle icon={BarChart2} title="Academic Metrics" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label className="text-sm font-medium text-gray-700">CGPA</label>
                      <div className={READONLY_CLS}>{user?.cgpa ?? "—"}</div>
                      <p className="text-[11px] text-gray-400">Set during registration</p>
                    </div>
                    <FormField label="Active Backlogs" error={errors.active_backlogs} required>
                      {(id) => <input id={id} type="number" min={0} {...register("active_backlogs")} className={INPUT_CLS} placeholder="0" />}
                    </FormField>
                    <FormField label="Historical Backlogs" error={errors.historical_backlogs} required>
                      {(id) => <input id={id} type="number" min={0} {...register("historical_backlogs")} className={INPUT_CLS} placeholder="0" />}
                    </FormField>
                    <FormField label="10th Percentage (%)" error={errors.tenth_percentage} required>
                      {(id) => <input id={id} type="number" step="0.01" min={0} max={100} {...register("tenth_percentage")} className={INPUT_CLS} placeholder="e.g. 92.5" />}
                    </FormField>
                    <FormField label="12th Percentage (%)" error={errors.twelfth_percentage} required>
                      {(id) => <input id={id} type="number" step="0.01" min={0} max={100} {...register("twelfth_percentage")} className={INPUT_CLS} placeholder="e.g. 88.0" />}
                    </FormField>
                  </div>
                </>
              )}

              {/* Step 3: Contact */}
              {step === 2 && (
                <>
                  <StepTitle icon={Phone} title="Contact Details" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <FormField label="WhatsApp Number" error={errors.whatsapp_number} required>
                      {(id) => <input id={id} type="tel" {...register("whatsapp_number")} className={INPUT_CLS} placeholder="+91 9876543210" />}
                    </FormField>
                    <FormField label="Parent / Guardian Contact" error={errors.parent_contact} required>
                      {(id) => <input id={id} type="tel" {...register("parent_contact")} className={INPUT_CLS} placeholder="+91 9876543210" />}
                    </FormField>
                    <FormField label="Alternative Email" error={errors.alternative_email} hint="Optional personal email">
                      {(id) => <input id={id} type="email" {...register("alternative_email")} className={INPUT_CLS} placeholder="personal@gmail.com" />}
                    </FormField>
                  </div>
                </>
              )}

              {/* Step 4: Documents */}
              {step === 3 && (
                <>
                  <StepTitle icon={Link2} title="Documents & Professional Links" />
                  <div className="space-y-5">
                    <FormField label="Resume URL" error={errors.resume_url} hint="Enter a publicly accessible PDF URL (e.g. Google Drive link).">
                      {(id) => <input id={id} type="url" {...register("resume_url")} className={INPUT_CLS} placeholder="https://drive.google.com/..." />}
                    </FormField>
                    <FormField label="LinkedIn Profile URL" error={errors.linkedin_url}>
                      {(id) => <input id={id} type="url" {...register("linkedin_url")} className={INPUT_CLS} placeholder="https://linkedin.com/in/username" />}
                    </FormField>
                    <FormField label="GitHub Profile URL" error={errors.github_url}>
                      {(id) => <input id={id} type="url" {...register("github_url")} className={INPUT_CLS} placeholder="https://github.com/username" />}
                    </FormField>
                  </div>
                </>
              )}

              {/* Step 5: Declaration */}
              {step === 4 && (
                <>
                  <StepTitle icon={FileCheck} title="Policy & Declaration" />
                  <p className="text-gray-500 text-sm">Please read and accept the following before completing your registration.</p>
                  <div className="space-y-4 mt-2">
                    <DeclarationCheckbox id="policy_agreement" label="I have read and agree to the Institutional Placement Policy." error={errors.policy_agreement?.message} {...register("policy_agreement")} />
                    <DeclarationCheckbox id="data_consent" label="I consent to the placement cell sharing my profile data with recruiting companies." error={errors.data_consent?.message} {...register("data_consent")} />
                    <DeclarationCheckbox id="eligibility_rules" label="I acknowledge that I am aware of and comply with all placement eligibility rules." error={errors.eligibility_rules?.message} {...register("eligibility_rules")} />
                  </div>
                </>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => setStep((s) => s - 1)} disabled={step === 0}
                className="flex items-center gap-2 px-4 py-2.5 rounded-[10px] border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-30 disabled:cursor-not-allowed">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>

              <span className="text-xs text-gray-400">Step {step + 1} of {STEPS.length}</span>

              {step < STEPS.length - 1 ? (
                <button type="button" onClick={advance}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-[10px] bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {isSubmitting ? "Submitting…" : "Complete Registration"}
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function StepTitle({ icon: Icon, title }: { icon: React.ElementType; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
        <Icon className="w-4 h-4 text-blue-600" />
      </div>
      <h2 className="text-base font-semibold text-gray-900">{title}</h2>
    </div>
  );
}

const DeclarationCheckbox = forwardRef<
  HTMLInputElement,
  { id: string; label: string; error?: string } & React.InputHTMLAttributes<HTMLInputElement>
>(({ id, label, error, ...props }, ref) => (
  <div className="space-y-1">
    <label htmlFor={id} className="flex items-start gap-3 cursor-pointer group">
      <input id={id} type="checkbox" ref={ref} className="mt-0.5 w-4 h-4 rounded border-gray-300 accent-blue-600 cursor-pointer" {...props} />
      <span className="text-sm text-gray-600 group-hover:text-gray-900 transition-colors leading-snug">{label}</span>
    </label>
    {error && <p role="alert" className="text-[11px] text-red-600 pl-7">{error}</p>}
  </div>
));
DeclarationCheckbox.displayName = "DeclarationCheckbox";
