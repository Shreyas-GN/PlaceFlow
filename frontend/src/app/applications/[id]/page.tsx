"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { applicationService, Application } from "@/services/application.service";
import { InterviewPipeline, PIPELINE_STAGES } from "@/components/shared/InterviewPipeline";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { getStatusColor } from "@/lib/status";
import { Skeleton } from "@/components/shared/Skeleton";
import { toast } from "sonner";
import { ChevronLeft, GraduationCap, Briefcase, Calendar, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

const STAGE_MESSAGES: Record<string, string> = {
  Applied: "Your application is under review — shortlisting typically takes 3–5 business days.",
  Screening: "You've passed initial screening — a technical assessment may follow shortly.",
  Technical: "A technical round is in progress — prepare for coding or case-study questions.",
  HR: "You're in the HR round — focus on cultural fit and salary discussion.",
  Offer: "Congratulations! An offer is being prepared. Review the terms carefully before accepting.",
  Shortlisted: "You've been shortlisted — an interview invitation should arrive soon.",
  Interview: "An interview has been scheduled — check your email for timing and instructions.",
  Selected: "You have been selected! An offer letter will be issued shortly.",
  Rejected: "This application was not progressed further. Keep applying — the right role is ahead.",
};

function mapStatusToStage(status: string): string {
  const map: Record<string, string> = {
    Applied: "Applied",
    Shortlisted: "Screening",
    Interview: "Technical",
    Selected: "Offer",
    Rejected: "Applied",
  };
  return map[status] ?? status;
}

export default function ApplicationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [application, setApplication] = useState<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    applicationService
      .getApplication(id)
      .then(setApplication)
      .catch(() => {
        toast.error("Application not found");
        router.push("/applications");
      })
      .finally(() => setIsLoading(false));
  }, [id, router]);

  const company = application?.company;
  const currentStage = application ? mapStatusToStage(application.status) : "Applied";
  const statusMessage = application ? (STAGE_MESSAGES[application.status] ?? STAGE_MESSAGES.Applied) : "";

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-5">
        {/* Breadcrumb */}
        <button
          onClick={() => router.push("/applications")}
          className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Applications
          {company && (
            <>
              <span className="text-gray-300">/</span>
              <span className="text-gray-500">{company.company_name}</span>
            </>
          )}
        </button>

        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-24 w-full rounded-xl" />
            <Skeleton className="h-32 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : application && company ? (
          <>
            {/* Company header */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="flex items-start gap-4">
                <CompanyLogo name={company.company_name} size="lg" />
                <div className="flex-1 min-w-0">
                  <h1 className="text-lg font-semibold text-gray-900">{company.company_name}</h1>
                  <p className="text-gray-500 text-sm mt-0.5">{company.role}</p>
                  <div className="mt-2">
                    <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-medium border", getStatusColor(application.status))}>
                      {application.status}
                    </span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[11px] text-gray-400">Annual CTC</p>
                  <p className="text-green-600 font-semibold text-xl mt-0.5">{company.package}</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
                <CompanyDetail icon={<GraduationCap className="w-3.5 h-3.5" />} label="Min CGPA" value={String(company.min_cgpa)} />
                <CompanyDetail icon={<Users className="w-3.5 h-3.5" />} label="Departments" value={company.eligible_departments} />
                <CompanyDetail
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  label="Applied"
                  value={format(new Date(application.applied_at), "MMM d, yyyy")}
                />
                <CompanyDetail
                  icon={<Calendar className="w-3.5 h-3.5" />}
                  label="Deadline"
                  value={format(new Date(company.deadline), "MMM d, yyyy")}
                />
              </div>
            </div>

            {/* Interview pipeline */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <InterviewPipeline currentStage={currentStage} />
              <div className="mt-4 pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-500 leading-relaxed">{statusMessage}</p>
              </div>
            </div>

            {/* Stage breakdown */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
              <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Stage Breakdown</div>
              <div className="space-y-2">
                {PIPELINE_STAGES.map((stage, i) => {
                  const currentIdx = PIPELINE_STAGES.findIndex(
                    (s) => s.key.toLowerCase() === currentStage.toLowerCase()
                  );
                  const isReached = i <= currentIdx;
                  const isCurrent = i === currentIdx;
                  return (
                    <div
                      key={stage.key}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-lg text-xs",
                        isCurrent
                          ? "bg-blue-50 border border-blue-200"
                          : isReached
                            ? "bg-gray-50"
                            : "opacity-40"
                      )}
                    >
                      <div className={cn("w-2 h-2 rounded-full shrink-0", isReached ? stage.color : "bg-gray-200")} />
                      <span className={cn("flex-1 font-medium", isReached ? "text-gray-900" : "text-gray-400")}>
                        {stage.label}
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] text-blue-600 font-medium">Current stage</span>
                      )}
                      {isReached && !isCurrent && (
                        <span className="text-[10px] text-gray-400">Completed</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </DashboardLayout>
  );
}

function CompanyDetail({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-1.5 text-gray-400 mb-0.5">
        {icon}
        <span className="text-[10px]">{label}</span>
      </div>
      <p className="text-xs font-medium text-gray-900 truncate">{value}</p>
    </div>
  );
}
