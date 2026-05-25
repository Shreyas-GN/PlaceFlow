"use client";

import { useEffect, useState } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { companyService, Company } from "@/services/company.service";
import { applicationService } from "@/services/application.service";
import { toast } from "sonner";
import { Building2, Briefcase, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";
import { CompanyCardSkeleton } from "@/components/shared/Skeleton";

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
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Eligible Opportunities</h1>
            <p className="text-zinc-500 mt-1 text-sm">Drives matched with your profile and academic standing.</p>
          </div>
          <motion.div 
            whileHover={{ scale: 1.02 }}
            className="bg-primary/10 border border-primary/20 px-4 py-2 rounded-2xl flex items-center gap-2"
          >
            <AlertCircle className="w-4 h-4 text-primary" />
            <span className="text-xs font-medium text-primary">{companies.length} Companies Available</span>
          </motion.div>
        </motion.div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <CompanyCardSkeleton key={i} />
            ))}
          </div>
        ) : companies.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center p-16 rounded-2xl border border-dashed border-zinc-800 bg-zinc-950"
          >
            <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mb-4">
              <Building2 className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-lg font-semibold text-zinc-400">No new opportunities</h3>
            <p className="text-zinc-600 mt-1 text-sm">Check back later for newly announced placement drives.</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnimatePresence mode="popLayout">
              {companies.map((company, index) => (
                <motion.div 
                  layout
                  key={company.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  transition={{ delay: index * 0.05 }}
                  whileHover={{ y: -2 }}
                  className="group relative p-6 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-primary/40 transition-all"
                >
                  <div className="flex items-start justify-between mb-6">
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-purple-500/20 flex items-center justify-center"
                    >
                      <Building2 className="w-6 h-6 text-primary" />
                    </motion.div>
                    <div className="text-right">
                      <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider mb-0.5">Annual CTC</p>
                      <span className="text-emerald-400 font-bold text-xl tracking-tight">{company.package}</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-6">
                    <h3 className="text-lg font-semibold tracking-tight group-hover:text-primary transition-colors">{company.company_name}</h3>
                    <div className="flex items-center gap-1.5 text-zinc-500 text-sm">
                      <Briefcase className="w-3.5 h-3.5 text-primary" />
                      <span>{company.role}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                      <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider mb-1 text-center">CGPA Requirement</p>
                      <p className="text-base font-semibold text-center">{company.min_cgpa}</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                      <p className="text-[10px] text-zinc-600 font-medium uppercase tracking-wider mb-1 text-center">Deadline</p>
                      <p className="text-xs font-medium text-center">{format(new Date(company.deadline), "MMM d, yyyy")}</p>
                    </div>
                  </div>

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleApply(company.id)}
                    disabled={applyingId === company.id}
                    className="w-full h-12 bg-white text-black rounded-2xl font-medium flex items-center justify-center gap-2 text-sm hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                  >
                    {applyingId === company.id ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" />
                        Apply Now
                      </>
                    )}
                  </motion.button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
