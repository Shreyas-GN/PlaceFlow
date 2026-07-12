"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { companyService, Company } from "@/services/company.service";
import { applicationService, Application } from "@/services/application.service";
import { useAuthStore } from "@/store/auth.store";
import { toast } from "sonner";
import {
  Building2, Briefcase, CheckCircle2, AlertCircle, Loader2,
  Clock, GraduationCap, Users, MapPin, ChevronRight,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { CompanyCardSkeleton } from "@/components/shared/Skeleton";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { cn } from "@/lib/utils";

const DEPARTMENTS = ["All", "CSE", "ISE", "ECE", "EEE", "ME", "CE", "CSBS", "AIDS", "AIML"];

function getEligibility(company: Company, cgpa: number, department: string) {
  const depts = company.eligible_departments.split(",").map((d) => d.trim().toUpperCase());
  const cgpaMet = cgpa >= company.min_cgpa;
  const deptMet = depts.includes(department.toUpperCase());
  const daysLeft = differenceInDays(new Date(company.deadline), new Date());
  const deadlineMet = daysLeft >= 0;
  return { cgpaMet, deptMet, deadlineMet, daysLeft };
}

export default function CompaniesPage() {
  const { user } = useAuthStore();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [appliedIds, setAppliedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState<"all" | "open" | "applied">("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [companiesData, applicationsData] = await Promise.all([
          companyService.getEligibleCompanies(),
          applicationService.getApplications(),
        ]);
        setCompanies(companiesData);
        setAppliedIds(new Set((applicationsData as Application[]).map((a) => a.company_id)));
      } catch {
        toast.error("Failed to load companies");
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleApply = async (companyId: string) => {
    setApplyingId(companyId);
    try {
      await applicationService.applyToCompany(companyId);
      toast.success("Application submitted!");
      setAppliedIds((prev) => new Set([...prev, companyId]));
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  const filteredAndSorted = useMemo(() => {
    let result = [...companies];
    if (filterDept !== "All") {
      result = result.filter((c) =>
        c.eligible_departments.split(",").map((d) => d.trim().toUpperCase()).includes(filterDept)
      );
    }
    if (filterStatus === "open") {
      result = result.filter((c) => !appliedIds.has(c.id));
    } else if (filterStatus === "applied") {
      result = result.filter((c) => appliedIds.has(c.id));
    }
    return result.sort((a, b) => {
      const aApplied = appliedIds.has(a.id);
      const bApplied = appliedIds.has(b.id);
      if (aApplied !== bApplied) return aApplied ? 1 : -1;
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [companies, appliedIds, filterDept, filterStatus]);

  const availableCount = companies.filter((c) => !appliedIds.has(c.id)).length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Eligible Companies</h1>
            <p className="text-gray-500 mt-1 text-sm">Drives matched with your profile and academic standing.</p>
          </div>
          <div className="flex items-center gap-2">
            {appliedIds.size > 0 && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-600" />
                <span className="text-xs font-medium text-green-700">{appliedIds.size} Applied</span>
              </div>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-full">
              <Building2 className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-xs font-medium text-blue-700">{availableCount} Available</span>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <div className="flex gap-2">
            {(["all", "open", "applied"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "px-3 py-1.5 rounded-[10px] text-sm font-medium border transition-all",
                  filterStatus === s
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50"
                )}
              >
                {s === "all" ? "All" : s === "open" ? "Not Applied" : "Applied"}
              </button>
            ))}
          </div>
          <div className="flex gap-1.5 flex-wrap">
            {DEPARTMENTS.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDept(dept)}
                className={cn(
                  "px-2.5 py-1 rounded-lg text-xs font-medium border transition-all",
                  filterDept === dept
                    ? "bg-blue-50 border-blue-200 text-blue-700"
                    : "border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                )}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => <CompanyCardSkeleton key={i} />)}
          </div>
        ) : filteredAndSorted.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-200 rounded-xl text-center">
            <Building2 className="w-10 h-10 text-gray-300 mb-3" />
            <h3 className="text-base font-medium text-gray-900">No companies found</h3>
            <p className="text-gray-500 mt-1 text-sm">
              {companies.length > 0 ? "Try adjusting your filters." : "Check back later for newly announced placement drives."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSorted.map((company) => {
              const isApplied = appliedIds.has(company.id);
              const { cgpaMet, deptMet, deadlineMet, daysLeft } = getEligibility(
                company,
                user?.cgpa ?? 0,
                user?.department ?? ""
              );
              const allMet = cgpaMet && deptMet && deadlineMet;
              const isUrgent = daysLeft <= 2 && daysLeft >= 0;
              const isWarning = daysLeft <= 7 && daysLeft > 2;
              const ctcDisplay = company.ctc || company.package;

              return (
                <div
                  key={company.id}
                  className={cn(
                    "group relative p-5 rounded-xl bg-white border transition-all",
                    isApplied
                      ? "border-gray-200 opacity-70"
                      : "border-gray-200 hover:border-blue-300 hover:shadow-card"
                  )}
                >
                  {isApplied && (
                    <div className="absolute top-4 right-4 flex items-center gap-1 bg-green-50 border border-green-200 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3 h-3 text-green-600" />
                      <span className="text-[11px] font-medium text-green-700">Applied</span>
                    </div>
                  )}

                  <div className="flex items-start justify-between mb-4">
                    <CompanyLogo name={company.company_name} size="lg" />
                    <div className="text-right">
                      <p className="text-xs text-gray-400 mb-0.5">Annual CTC</p>
                      <span className="text-green-700 font-semibold text-base">{ctcDisplay}</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    <h3 className={cn("text-base font-semibold text-gray-900 transition-colors", !isApplied && "group-hover:text-blue-700")}>
                      {company.company_name}
                    </h3>
                    <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                      <Briefcase className="w-3.5 h-3.5" />
                      <span>{company.role}</span>
                    </div>
                    {(company.location || company.company_type) && (
                      <div className="flex items-center gap-2 flex-wrap mt-1">
                        {company.location && (
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <MapPin className="w-3 h-3" />
                            {company.location}
                          </span>
                        )}
                        {company.company_type && (
                          <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200">
                            {company.company_type}
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Eligibility */}
                  <div className="mb-4">
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", allMet ? "bg-green-500" : "bg-amber-500")} />
                      <span className="text-xs text-gray-500">
                        {allMet ? "Eligible" : "Partially eligible"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <EligibilityChip icon={<GraduationCap className="w-3 h-3" />} label={`CGPA ${company.min_cgpa}`} met={cgpaMet} />
                      <EligibilityChip icon={<Users className="w-3 h-3" />} label={user?.department ?? "Dept"} met={deptMet} />
                      <EligibilityChip
                        icon={<Clock className="w-3 h-3" />}
                        label={daysLeft === 0 ? "Today" : daysLeft < 0 ? "Closed" : `${daysLeft}d left`}
                        met={deadlineMet}
                        urgent={isUrgent}
                        warning={isWarning}
                      />
                    </div>
                  </div>

                  {/* Deadline urgency message */}
                  {!isApplied && deadlineMet && (
                    <p className={cn(
                      "text-xs font-medium mb-3",
                      isUrgent ? "text-red-600" : isWarning ? "text-amber-600" : "text-gray-400"
                    )}>
                      {isUrgent
                        ? `Closes in ${daysLeft === 0 ? "less than a day" : `${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}`
                        : isWarning
                          ? `Deadline ${format(new Date(company.deadline), "MMM d")} — ${daysLeft} days left`
                          : `Deadline: ${format(new Date(company.deadline), "MMM d, yyyy")}`}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <button
                      onClick={() => !isApplied && handleApply(company.id)}
                      disabled={isApplied || applyingId === company.id}
                      className={cn(
                        "flex-1 h-9 rounded-[10px] font-medium flex items-center justify-center gap-2 text-sm transition-all",
                        isApplied
                          ? "bg-gray-100 text-gray-400 cursor-default"
                          : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                      )}
                    >
                      {applyingId === company.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isApplied ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Application Submitted
                        </>
                      ) : (
                        "Apply Now"
                      )}
                    </button>
                    <Link
                      href={`/companies/${company.id}`}
                      className="h-9 w-9 flex items-center justify-center rounded-[10px] border border-gray-200 text-gray-400 hover:text-gray-700 hover:border-gray-300 transition-colors"
                      title="View details"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function EligibilityChip({
  icon, label, met, urgent, warning,
}: {
  icon: React.ReactNode;
  label: string;
  met: boolean;
  urgent?: boolean;
  warning?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border",
        met && urgent
          ? "bg-red-50 border-red-200 text-red-700"
          : met && warning
            ? "bg-amber-50 border-amber-200 text-amber-700"
            : met
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-700"
      )}
    >
      {icon}
      {label}
    </span>
  );
}
