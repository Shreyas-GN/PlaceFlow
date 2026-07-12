"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import DashboardLayout from "@/components/layout/DashboardLayout";
import {
  User, Lock, Bell, Save, Loader2, Eye, EyeOff,
  CheckCircle2, Mail, Calendar, ShieldCheck, AlertCircle,
  Phone, FileText, Briefcase, Award, Plus, X, ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import type { ProjectItem, CertificationItem } from "@/store/auth.store";
import { authService } from "@/services/auth.service";
import { studentService } from "@/services/student.service";
import { toast } from "sonner";
import { FormField } from "@/components/shared/FormField";
import { AnimatePresence, motion } from "framer-motion";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const Github = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const Linkedin = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const passwordSchema = z.object({
  current_password: z.string().min(1, "Current password is required"),
  new_password: z.string().min(6, "Must be at least 6 characters"),
  confirm_password: z.string().min(1, "Confirm your new password"),
}).refine((d) => d.new_password === d.confirm_password, {
  message: "Passwords do not match",
  path: ["confirm_password"],
});

const contactSchema = z.object({
  whatsapp_number: z.string().min(10, "Enter a valid number").optional().or(z.literal("")),
  parent_contact: z.string().min(10, "Enter a valid number").optional().or(z.literal("")),
  alternative_email: z.string().email("Enter a valid email").optional().or(z.literal("")),
  resume_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
  github_url: z.string().url("Enter a valid URL").optional().or(z.literal("")),
});

type PasswordForm = z.infer<typeof passwordSchema>;
type ContactForm = z.infer<typeof contactSchema>;

const INPUT_CLS =
  "w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";

const READONLY_CLS =
  "w-full bg-gray-50 border border-gray-200 rounded-[10px] px-4 py-2.5 text-sm text-gray-500 cursor-not-allowed select-none";

function ReadOnlyField({ label, value }: { label: string; value?: string | number | null }) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className={READONLY_CLS}>{value ?? "—"}</div>
    </div>
  );
}

const tabs = [
  { id: "profile", name: "Profile", icon: User },
  { id: "portfolio", name: "Portfolio", icon: Briefcase },
  { id: "security", name: "Security", icon: Lock },
  { id: "notifications", name: "Notifications", icon: Bell },
];

export default function SettingsPage() {
  const { user, setUser } = useAuthStore();
  const [activeTab, setActiveTab] = useState("profile");
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [notifSettings, setNotifSettings] = useState({
    application_updates: true,
    new_opportunities: true,
    deadline_reminders: true,
    system_alerts: false,
  });

  const [skills, setSkills] = useState<string[]>(user?.skills ?? []);
  const [skillInput, setSkillInput] = useState("");
  const [projects, setProjects] = useState<ProjectItem[]>(user?.projects ?? []);
  const [certifications, setCertifications] = useState<CertificationItem[]>(user?.certifications ?? []);
  const [portfolioSaving, setPortfolioSaving] = useState(false);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) setSkills([...skills, trimmed]);
    setSkillInput("");
  };
  const removeSkill = (skill: string) => setSkills(skills.filter((s) => s !== skill));
  const addProject = () => setProjects([...projects, { name: "", description: "", link: "" }]);
  const updateProject = (i: number, field: keyof ProjectItem, value: string) =>
    setProjects(projects.map((p, idx) => (idx === i ? { ...p, [field]: value } : p)));
  const removeProject = (i: number) => setProjects(projects.filter((_, idx) => idx !== i));
  const addCertification = () => setCertifications([...certifications, { name: "", issuer: "", year: "" }]);
  const updateCertification = (i: number, field: keyof CertificationItem, value: string) =>
    setCertifications(certifications.map((c, idx) => (idx === i ? { ...c, [field]: value } : c)));
  const removeCertification = (i: number) => setCertifications(certifications.filter((_, idx) => idx !== i));

  const savePortfolio = async () => {
    setPortfolioSaving(true);
    try {
      const updated = await studentService.updateProfile({ skills, projects, certifications });
      setUser(updated);
      toast.success("Portfolio saved.");
    } catch {
      toast.error("Failed to save portfolio.");
    } finally {
      setPortfolioSaving(false);
    }
  };

  const contactForm = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    mode: "onBlur",
    defaultValues: {
      whatsapp_number: user?.whatsapp_number ?? "",
      parent_contact: user?.parent_contact ?? "",
      alternative_email: user?.alternative_email ?? "",
      resume_url: user?.resume_url ?? "",
      linkedin_url: user?.linkedin_url ?? "",
      github_url: user?.github_url ?? "",
    },
  });

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
    mode: "onBlur",
  });

  const onContactSubmit = async (data: ContactForm) => {
    try {
      const updated = await studentService.updateProfile({
        whatsapp_number: data.whatsapp_number || undefined,
        parent_contact: data.parent_contact || undefined,
        alternative_email: data.alternative_email || undefined,
        resume_url: data.resume_url || undefined,
        linkedin_url: data.linkedin_url || undefined,
        github_url: data.github_url || undefined,
      });
      setUser(updated);
      toast.success("Contact information updated.");
    } catch (err: any) {
      const detail = err.response?.data?.detail;
      toast.error(typeof detail === "string" ? detail : "Update failed. Please try again.");
    }
  };

  const onPasswordSubmit = async (data: PasswordForm) => {
    try {
      await authService.changePassword(data.current_password, data.new_password);
      toast.success("Password changed successfully.");
      setShowPasswordForm(false);
      passwordForm.reset();
    } catch (err: any) {
      toast.error(err.response?.data?.detail || "Failed to change password.");
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your profile and account settings.</p>
        </div>

        {/* Tab bar */}
        <div className="border-b border-gray-200">
          <div className="flex gap-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px",
                  activeTab === tab.id
                    ? "border-blue-600 text-blue-700"
                    : "border-transparent text-gray-500 hover:text-gray-700"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab content */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 md:p-8">

          {/* ── Profile Tab ── */}
          {activeTab === "profile" && (
            <div className="space-y-8">
              {/* Avatar + identity */}
              <div className="flex items-center gap-5 pb-6 border-b border-gray-100">
                <div className="w-16 h-16 rounded-xl bg-blue-600 flex items-center justify-center text-2xl font-semibold text-white shrink-0">
                  {user?.full_name?.[0]}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{user?.full_name}</h3>
                  <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                    <Mail className="w-3.5 h-3.5" /> {user?.email}
                  </p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-blue-700 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-200">
                      Student
                    </span>
                    {user?.created_at && (
                      <span className="text-xs text-gray-400 flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> Joined {format(new Date(user.created_at), "MMM yyyy")}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Academic Record */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Academic Record</h4>
                  <p className="text-xs text-gray-500 mt-0.5">These fields reflect your official institutional data.</p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <ReadOnlyField label="Roll Number" value={user?.roll_number} />
                  <ReadOnlyField label="Degree" value={user?.degree} />
                  <ReadOnlyField label="Department" value={user?.department} />
                  <ReadOnlyField label="Current Semester" value={user?.current_semester} />
                  <ReadOnlyField label="Graduation Year" value={user?.graduation_year} />
                  <ReadOnlyField label="CGPA" value={user?.cgpa} />
                  <ReadOnlyField label="Active Backlogs" value={user?.active_backlogs ?? 0} />
                  <ReadOnlyField label="Historical Backlogs" value={user?.historical_backlogs ?? 0} />
                  <ReadOnlyField label="10th %" value={user?.tenth_percentage} />
                  <ReadOnlyField label="12th %" value={user?.twelfth_percentage} />
                </div>
                <div className="flex items-start gap-2.5 p-3 rounded-lg bg-amber-50 border border-amber-200">
                  <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
                  <p className="text-xs text-amber-700 leading-relaxed">
                    To update official academic records, contact your Placement Coordinator.
                  </p>
                </div>
              </div>

              {/* Contact & Links */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">Contact & Professional Links</h4>
                  <p className="text-xs text-gray-500 mt-0.5">Update your contact details and professional profiles.</p>
                </div>
                <form onSubmit={contactForm.handleSubmit(onContactSubmit)} className="grid grid-cols-1 md:grid-cols-2 gap-5" noValidate>
                  <FormField label="WhatsApp Number" error={contactForm.formState.errors.whatsapp_number}>
                    {(id) => (
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input id={id} type="tel" {...contactForm.register("whatsapp_number")} className={`${INPUT_CLS} pl-9`} placeholder="+91 9876543210" />
                      </div>
                    )}
                  </FormField>
                  <FormField label="Parent / Guardian Contact" error={contactForm.formState.errors.parent_contact}>
                    {(id) => (
                      <div className="relative">
                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input id={id} type="tel" {...contactForm.register("parent_contact")} className={`${INPUT_CLS} pl-9`} placeholder="+91 9876543210" />
                      </div>
                    )}
                  </FormField>
                  <FormField label="Alternative Email" error={contactForm.formState.errors.alternative_email}>
                    {(id) => (
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input id={id} type="email" {...contactForm.register("alternative_email")} className={`${INPUT_CLS} pl-9`} placeholder="personal@gmail.com" />
                      </div>
                    )}
                  </FormField>
                  <FormField label="Resume URL" error={contactForm.formState.errors.resume_url} hint="Public PDF link (e.g. Google Drive)">
                    {(id) => (
                      <div className="relative">
                        <FileText className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input id={id} type="url" {...contactForm.register("resume_url")} className={`${INPUT_CLS} pl-9`} placeholder="https://drive.google.com/..." />
                      </div>
                    )}
                  </FormField>
                  <FormField label="LinkedIn URL" error={contactForm.formState.errors.linkedin_url}>
                    {(id) => (
                      <div className="relative">
                        <Linkedin className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input id={id} type="url" {...contactForm.register("linkedin_url")} className={`${INPUT_CLS} pl-9`} placeholder="https://linkedin.com/in/username" />
                      </div>
                    )}
                  </FormField>
                  <FormField label="GitHub URL" error={contactForm.formState.errors.github_url}>
                    {(id) => (
                      <div className="relative">
                        <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                        <input id={id} type="url" {...contactForm.register("github_url")} className={`${INPUT_CLS} pl-9`} placeholder="https://github.com/username" />
                      </div>
                    )}
                  </FormField>
                  <div className="md:col-span-2 flex justify-end pt-2">
                    <button
                      type="submit"
                      disabled={contactForm.formState.isSubmitting}
                      className="h-10 px-6 bg-blue-600 text-white rounded-[10px] font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                    >
                      {contactForm.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* ── Portfolio Tab ── */}
          {activeTab === "portfolio" && (
            <div className="space-y-8">
              {/* Skills */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                    <Award className="w-4 h-4 text-blue-600" /> Skills
                  </h4>
                  <p className="text-xs text-gray-500 mt-0.5">Add technical and soft skills that describe your strengths.</p>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" || e.key === ",") { e.preventDefault(); addSkill(); } }}
                    placeholder="Type a skill and press Enter"
                    className={INPUT_CLS}
                  />
                  <button type="button" onClick={addSkill} className="h-[42px] px-4 bg-white border border-gray-300 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shrink-0 flex items-center gap-1.5">
                    <Plus className="w-3.5 h-3.5" /> Add
                  </button>
                </div>
                {skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {skills.map((skill) => (
                      <span key={skill} className="flex items-center gap-1.5 px-3 py-1 bg-blue-50 border border-blue-200 rounded-full text-sm text-blue-700 font-medium">
                        {skill}
                        <button type="button" onClick={() => removeSkill(skill)} className="text-blue-400 hover:text-blue-700 transition-colors">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Projects */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Briefcase className="w-4 h-4 text-blue-600" /> Projects
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">Showcase relevant projects with links to repos or demos.</p>
                  </div>
                  <button type="button" onClick={addProject} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Project
                  </button>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {projects.map((project, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Project {i + 1}</span>
                          <button type="button" onClick={() => removeProject(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <input type="text" placeholder="Project name" value={project.name} onChange={(e) => updateProject(i, "name", e.target.value)} className={INPUT_CLS} />
                          <div className="relative">
                            <ExternalLink className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                            <input type="url" placeholder="https://github.com/..." value={project.link} onChange={(e) => updateProject(i, "link", e.target.value)} className={`${INPUT_CLS} pl-9`} />
                          </div>
                        </div>
                        <textarea placeholder="Short description…" value={project.description} onChange={(e) => updateProject(i, "description", e.target.value)} rows={2} className={`${INPUT_CLS} resize-none`} />
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {projects.length === 0 && <p className="text-sm text-gray-400">No projects added yet.</p>}
                </div>
              </div>

              {/* Certifications */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                      <Award className="w-4 h-4 text-blue-600" /> Certifications
                    </h4>
                    <p className="text-xs text-gray-500 mt-0.5">List professional certifications and credentials.</p>
                  </div>
                  <button type="button" onClick={addCertification} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-300 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    <Plus className="w-3.5 h-3.5" /> Add Certification
                  </button>
                </div>
                <div className="space-y-3">
                  <AnimatePresence>
                    {certifications.map((cert, i) => (
                      <motion.div key={i} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="p-4 bg-gray-50 border border-gray-200 rounded-xl space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-medium text-gray-500">Certification {i + 1}</span>
                          <button type="button" onClick={() => removeCertification(i)} className="text-gray-400 hover:text-red-500 transition-colors">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                          <input type="text" placeholder="Certification name" value={cert.name} onChange={(e) => updateCertification(i, "name", e.target.value)} className={INPUT_CLS} />
                          <input type="text" placeholder="Issuing body (e.g. AWS)" value={cert.issuer} onChange={(e) => updateCertification(i, "issuer", e.target.value)} className={INPUT_CLS} />
                          <input type="text" placeholder="Year (e.g. 2024)" value={cert.year} onChange={(e) => updateCertification(i, "year", e.target.value)} className={INPUT_CLS} />
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {certifications.length === 0 && <p className="text-sm text-gray-400">No certifications added yet.</p>}
                </div>
              </div>

              <div className="flex justify-end pt-2 border-t border-gray-100">
                <button type="button" onClick={savePortfolio} disabled={portfolioSaving} className="h-10 px-6 bg-blue-600 text-white rounded-[10px] font-medium text-sm flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50">
                  {portfolioSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                  Save Portfolio
                </button>
              </div>
            </div>
          )}

          {/* ── Security Tab ── */}
          {activeTab === "security" && (
            <div className="space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Authentication</h3>
                  <p className="text-gray-500 text-sm">Manage your password and account security.</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">Password</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Last changed: {user?.created_at ? format(new Date(user.created_at), "MMM yyyy") : "N/A"}
                    </p>
                  </div>
                  {!showPasswordForm && (
                    <button
                      onClick={() => setShowPasswordForm(true)}
                      className="h-9 px-4 bg-white border border-gray-300 rounded-[10px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Change Password
                    </button>
                  )}
                </div>

                <AnimatePresence>
                  {showPasswordForm && (
                    <motion.form
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      onSubmit={passwordForm.handleSubmit(onPasswordSubmit)}
                      className="space-y-4 pt-5 border-t border-gray-100"
                      noValidate
                    >
                      {(
                        [
                          { name: "current_password", label: "Current Password", show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
                          { name: "new_password", label: "New Password", show: showNew, toggle: () => setShowNew(!showNew) },
                          { name: "confirm_password", label: "Confirm New Password", show: showConfirm, toggle: () => setShowConfirm(!showConfirm) },
                        ] as const
                      ).map(({ name, label, show, toggle }) => (
                        <FormField key={name} label={label} error={passwordForm.formState.errors[name]} required>
                          {(id) => (
                            <div className="relative">
                              <input
                                id={id}
                                type={show ? "text" : "password"}
                                {...passwordForm.register(name)}
                                className={`${INPUT_CLS} pr-10`}
                              />
                              <button type="button" onClick={toggle} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                              </button>
                            </div>
                          )}
                        </FormField>
                      ))}

                      <div className="flex gap-3 pt-2">
                        <button
                          type="button"
                          onClick={() => { setShowPasswordForm(false); passwordForm.reset(); }}
                          className="h-10 px-4 rounded-[10px] border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={passwordForm.formState.isSubmitting}
                          className="h-10 px-5 rounded-[10px] bg-blue-600 text-white text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                          {passwordForm.formState.isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                          {passwordForm.formState.isSubmitting ? "Updating…" : "Update Password"}
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-3 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-green-600" />
                  <p className="text-sm font-semibold text-gray-900">Account Security</p>
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Strong password set
                </div>
                <div className="flex items-center gap-2.5 text-sm text-gray-600">
                  <div className="w-2 h-2 rounded-full bg-green-500" />
                  Account active since {user?.created_at ? format(new Date(user.created_at), "MMM yyyy") : "N/A"}
                </div>
              </div>
            </div>
          )}

          {/* ── Notifications Tab ── */}
          {activeTab === "notifications" && (
            <div className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                  <Bell className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-gray-900">Notification Preferences</h3>
                  <p className="text-gray-500 text-sm">Configure which alerts you receive on the platform.</p>
                </div>
              </div>

              {(
                [
                  { key: "application_updates", name: "Application Updates", desc: "Notifications when your application status changes." },
                  { key: "new_opportunities", name: "New Opportunities", desc: "Daily digest of new companies matching your profile." },
                  { key: "deadline_reminders", name: "Deadline Reminders", desc: "Reminders before application deadlines close." },
                  { key: "system_alerts", name: "System Alerts", desc: "Platform maintenance and technical updates." },
                ] as const
              ).map((notif) => (
                <div key={notif.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="space-y-0.5">
                    <p className="font-medium text-sm text-gray-900">{notif.name}</p>
                    <p className="text-xs text-gray-500">{notif.desc}</p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={notifSettings[notif.key]}
                    aria-label={`${notif.name} notifications`}
                    onClick={() => setNotifSettings({ ...notifSettings, [notif.key]: !notifSettings[notif.key] })}
                    className={cn(
                      "w-11 h-6 rounded-full p-0.5 transition-colors shrink-0",
                      notifSettings[notif.key] ? "bg-blue-600" : "bg-gray-200"
                    )}
                  >
                    <motion.div
                      animate={{ x: notifSettings[notif.key] ? 20 : 0 }}
                      transition={{ duration: 0.15 }}
                      className="w-5 h-5 bg-white rounded-full shadow-sm"
                    />
                  </button>
                </div>
              ))}
            </div>
          )}

        </div>
      </div>
    </DashboardLayout>
  );
}
