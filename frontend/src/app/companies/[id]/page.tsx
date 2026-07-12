"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { companyService, Company } from "@/services/company.service";
import { applicationService, Application } from "@/services/application.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import {
  ArrowLeft, Building2, Briefcase, MapPin, GraduationCap, Users, Clock,
  CheckCircle2, Loader2, ListChecks, Layers, FileText, IndianRupee, Tag
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { cn } from "@/lib/utils";

function EligibilityChip({ label, met, icon }: { label: string; met: boolean; icon: React.ReactNode }) {
  return (
    <span className={cn(
      "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border",
      met
        ? "bg-green-50 border-green-200 text-green-700"
        : "bg-red-50 border-red-200 text-red-600"
    )}>
      {icon}
      {label}
      <span>{met ? "✓" : "✗"}</span>
    </span>
  );
}

export default function CompanyDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuthStore();
  const [company, setCompany] = useState<Company | null>(null);
  const [isApplied, setIsApplied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const [companyData, applicationsData] = await Promise.all([
          companyService.getCompany(id),
          applicationService.getApplications(),
        ]);
        setCompany(companyData);
        const appliedIds = new Set((applicationsData as Application[]).map((a) => a.company_id));
        setIsApplied(appliedIds.has(id));
      } catch {
        toast.error("Failed to load company details");
        router.push("/companies");
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [id, router]);

  const handleApply = async () => {
    if (!company) return;
    setIsApplying(true);
    try {
      await applicationService.applyToCompany(company.id);
      toast.success("Applied successfully!");
      setIsApplied(true);
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to apply");
    } finally {
      setIsApplying(false);
    }
  };

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </DashboardLayout>
    );
  }

  if (!company) return null;

  const ctcDisplay = company.ctc || company.package;
  const daysLeft = differenceInDays(new Date(company.deadline), new Date());
  const deadlineMet = daysLeft >= 0;
  const depts = company.eligible_departments.split(",").map((d) => d.trim().toUpperCase());
  const cgpaMet = (user?.cgpa ?? 0) >= company.min_cgpa;
  const deptMet = depts.includes((user?.department ?? "").toUpperCase());
  const allMet = cgpaMet && deptMet && deadlineMet;
  const isUrgent = daysLeft <= 2 && daysLeft >= 0;
  const isWarning = daysLeft <= 7 && daysLeft > 2;

  const skills = company.required_skills
    ? company.required_skills.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const processSteps = company.hiring_process
    ? company.hiring_process.split(/→|->|>/).map((s) => s.trim()).filter(Boolean)
    : [];

  return (
    <DashboardLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-gray-500 hover:text-gray-700 text-sm transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Opportunities
        </button>

        {/* Header card */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex items-start gap-4">
              <CompanyLogo name={company.company_name} size="lg" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{company.company_name}</h1>
                <div className="flex items-center gap-1.5 text-gray-500 text-sm mt-0.5">
                  <Briefcase className="w-3.5 h-3.5" />
                  <span>{company.role}</span>
                </div>
                <div className="flex items-center gap-2 mt-2 flex-wrap">
                  {company.location && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <MapPin className="w-3 h-3" />
                      {company.location}
                    </span>
                  )}
                  {company.company_type && (
                    <span className="flex items-center gap-1 text-xs text-gray-400">
                      <Tag className="w-3 h-3" />
                      {company.company_type}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right shrink-0">
              <p className="text-[11px] text-gray-400 mb-0.5">Annual CTC</p>
              <span className="text-green-600 font-bold text-2xl">{ctcDisplay}</span>
            </div>
          </div>

          {/* Deadline urgency */}
          <div className={cn(
            "text-xs font-medium px-3 py-2 rounded-lg mb-4 border",
            isUrgent
              ? "bg-red-50 border-red-200 text-red-600"
              : isWarning
              ? "bg-amber-50 border-amber-200 text-amber-600"
              : !deadlineMet
              ? "bg-gray-50 border-gray-200 text-gray-400"
              : "bg-gray-50 border-gray-200 text-gray-500"
          )}>
            <Clock className="inline w-3.5 h-3.5 mr-1.5" />
            {!deadlineMet
              ? "Application deadline has passed"
              : daysLeft === 0
              ? "Deadline: Today — act now"
              : `Deadline: ${format(new Date(company.deadline), "MMMM d, yyyy 'at' h:mm a")} — ${daysLeft} day${daysLeft !== 1 ? "s" : ""} left`}
          </div>

          {/* Eligibility checker */}
          <div className="mb-5">
            <div className="flex items-center gap-2 mb-2">
              <div className={cn("w-2 h-2 rounded-full", allMet ? "bg-green-500" : "bg-amber-400")} />
              <span className="text-sm font-medium text-gray-700">
                {allMet ? "You meet all eligibility criteria" : "Eligibility check"}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <EligibilityChip
                icon={<GraduationCap className="w-3 h-3" />}
                label={`Min CGPA ${company.min_cgpa} (yours: ${user?.cgpa ?? "—"})`}
                met={cgpaMet}
              />
              <EligibilityChip
                icon={<Users className="w-3 h-3" />}
                label={`${user?.department ?? "your dept"} eligible`}
                met={deptMet}
              />
              <EligibilityChip
                icon={<Clock className="w-3 h-3" />}
                label={deadlineMet ? "Open" : "Closed"}
                met={deadlineMet}
              />
            </div>
          </div>

          {/* Apply button */}
          <button
            onClick={handleApply}
            disabled={isApplied || isApplying || !deadlineMet}
            className={cn(
              "w-full h-12 rounded-[10px] font-medium flex items-center justify-center gap-2 transition-all text-sm",
              isApplied
                ? "bg-green-50 border border-green-200 text-green-700 cursor-default"
                : !deadlineMet
                ? "bg-gray-100 text-gray-400 cursor-default border border-gray-200"
                : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
            )}
          >
            {isApplying ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : isApplied ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Application Submitted
              </>
            ) : !deadlineMet ? (
              "Deadline Passed"
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Apply Now
              </>
            )}
          </button>
        </div>

        {/* Description */}
        {company.description && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <FileText className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">About the Role</h2>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">{company.description}</p>
          </div>
        )}

        {/* Hiring Process */}
        {processSteps.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <ListChecks className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Hiring Process</h2>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {processSteps.map((step, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold flex items-center justify-center shrink-0">
                      {i + 1}
                    </span>
                    <span className="text-xs text-gray-700 font-medium">{step}</span>
                  </div>
                  {i < processSteps.length - 1 && (
                    <span className="text-gray-300 text-sm">→</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Required Skills */}
        {skills.length > 0 && (
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Layers className="w-4 h-4 text-gray-400" />
              <h2 className="text-sm font-semibold text-gray-900">Required Skills</h2>
            </div>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span
                  key={skill}
                  className="px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Eligibility details */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Building2 className="w-4 h-4 text-gray-400" />
            <h2 className="text-sm font-semibold text-gray-900">Eligibility Criteria</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5" /> Minimum CGPA
              </span>
              <span className="text-xs font-medium text-gray-900">{company.min_cgpa}</span>
            </div>
            <div className="py-2 border-b border-gray-100">
              <span className="text-xs text-gray-500 flex items-center gap-1.5 mb-2">
                <Users className="w-3.5 h-3.5" /> Eligible Departments
              </span>
              <div className="flex flex-wrap gap-1.5">
                {depts.map((dept) => (
                  <span
                    key={dept}
                    className={cn(
                      "px-2 py-0.5 rounded text-[11px] font-medium border",
                      dept === (user?.department ?? "").toUpperCase()
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-gray-50 text-gray-500 border-gray-200"
                    )}
                  >
                    {dept}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-gray-500 flex items-center gap-1.5">
                <IndianRupee className="w-3.5 h-3.5" /> CTC Offered
              </span>
              <span className="text-xs font-medium text-green-600">{ctcDisplay}</span>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
