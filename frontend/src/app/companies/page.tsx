"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { companyService, Company } from "@/services/company.service";
import { applicationService } from "@/services/application.service";
import { toast } from "sonner";
import { Building2, Briefcase, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { CompanyCardSkeleton } from "@/components/shared/Skeleton";
import { CompanyLogo } from "@/components/shared/CompanyLogo";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [applyingId, setApplyingId] = useState<string | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await companyService.getEligibleCompanies();
        setCompanies(data);
      } catch (error) {
        toast.error("Failed to load companies");
      } finally {
        setIsLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleApply = async (companyId: string) => {
    setApplyingId(companyId);
    try {
      await applicationService.applyToCompany(companyId);
      toast.success("Applied successfully!");
      setCompanies(prev => prev.filter(c => c.id !== companyId));
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to apply");
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">Eligible Opportunities</h1>
            <p className="text-zinc-500 mt-0.5 text-xs">Drives matched with your profile and academic standing.</p>
          </div>
          <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-medium text-primary">{companies.length} Available</span>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 rounded border border-dashed border-zinc-800/60 bg-layer-2">
            <div className="w-12 h-12 bg-layer-3 rounded flex items-center justify-center mb-3">
              <Building2 className="w-6 h-6 text-zinc-700" />
            </div>
            <h3 className="text-sm font-medium text-zinc-400">No new opportunities</h3>
            <p className="text-zinc-600 mt-0.5 text-xs">Check back later for newly announced placement drives.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {companies.map((company) => (
              <div 
                key={company.id}
                className="group relative p-5 rounded bg-layer-2 border border-zinc-800/60 hover:border-primary/40 transition-all"
              >
                <div className="flex items-start justify-between mb-5">
                  <CompanyLogo name={company.company_name} size="lg" />
                  <div className="text-right">
                    <p className="text-[11px] text-zinc-600 mb-0.5">Annual CTC</p>
                    <span className="text-emerald-400 font-semibold text-lg">{company.package}</span>
                  </div>
                </div>

                <div className="space-y-1 mb-5">
                  <h3 className="text-base font-medium group-hover:text-primary transition-colors">{company.company_name}</h3>
                  <div className="flex items-center gap-1.5 text-zinc-500 text-xs">
                    <Briefcase className="w-3 h-3" />
                    <span>{company.role}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="text-center">
                    <p className="text-[11px] text-zinc-600 mb-0.5">CGPA Requirement</p>
                    <p className="text-sm font-semibold">{company.min_cgpa}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-[11px] text-zinc-600 mb-0.5">Deadline</p>
                    <p className="text-xs">{format(new Date(company.deadline), "MMM d, yyyy")}</p>
                  </div>
                </div>

                <button 
                  onClick={() => handleApply(company.id)}
                  disabled={applyingId === company.id}
                  className="w-full h-10 bg-white text-black rounded font-medium flex items-center justify-center gap-2 text-xs hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                >
                  {applyingId === company.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Apply Now
                    </>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
