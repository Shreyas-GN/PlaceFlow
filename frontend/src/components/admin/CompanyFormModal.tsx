"use client";

import { useEffect, useState } from "react";
import { X, Loader2, Rocket, Edit3, Building2, Briefcase, IndianRupee, GraduationCap, Calendar } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import DepartmentSelect from "./DepartmentSelect";

interface CompanyData {
  id?: string;
  company_name?: string;
  role?: string;
  package?: string;
  min_cgpa?: number;
  eligible_departments?: string;
  deadline?: string;
}

interface Props {
  mode: "create" | "edit";
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  company?: CompanyData | null;
}

export default function CompanyFormModal({ mode, isOpen, onClose, onSuccess, company }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const isEdit = mode === "edit";
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    role: "",
    package: "",
    min_cgpa: "0",
    eligible_departments: "",
    deadline: ""
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        company_name: company?.company_name || "",
        role: company?.role || "",
        package: company?.package || "",
        min_cgpa: company?.min_cgpa?.toString() || "0",
        eligible_departments: company?.eligible_departments || "",
        deadline: company?.deadline ? new Date(company.deadline).toISOString().slice(0, 16) : ""
      });
    }
  }, [isOpen, company]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        min_cgpa: parseFloat(formData.min_cgpa),
        deadline: new Date(formData.deadline).toISOString()
      };

      if (isEdit && company?.id) {
        await adminService.updateCompany(company.id, payload);
        toast.success("Placement drive updated successfully!");
      } else {
        await adminService.createCompany(payload);
        toast.success("Placement drive created successfully!");
      }
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || `Failed to ${isEdit ? "update" : "create"} drive`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-layer-2 border border-zinc-800/60 rounded-2xl shadow-2xl overflow-y-auto"
          >
            
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ rotate: 15 }}
                    className={`w-10 h-10 rounded-md flex items-center justify-center ${isEdit ? "bg-amber-500/10" : "bg-primary/10"}`}
                  >
                    {isEdit ? <Edit3 className="w-5 h-5 text-amber-500" /> : <Rocket className="w-5 h-5 text-primary" />}
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-semibold">{isEdit ? "Edit Placement Drive" : "New Placement Drive"}</h2>
                    <p className="text-xs text-muted-foreground">{isEdit ? "Update recruitment opportunity details" : "Launch a new recruitment opportunity"}</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-900 rounded-md transition-colors text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Company Name
                    </label>
                    <input
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                      placeholder="e.g. Google"
                      className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Job Role
                    </label>
                    <input
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      placeholder="e.g. Software Engineer"
                      className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5" /> Package (LPA)
                    </label>
                    <input
                      required
                      value={formData.package}
                      onChange={(e) => setFormData({...formData, package: e.target.value})}
                      placeholder="e.g. 12 LPA"
                      className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Min. CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.min_cgpa}
                      onChange={(e) => setFormData({...formData, min_cgpa: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Eligible Departments
                    </label>
                    <DepartmentSelect
                      value={formData.eligible_departments}
                      onChange={(v) => setFormData({...formData, eligible_departments: v})}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-sm font-medium text-zinc-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Application Deadline
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800/60 rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 h-12 rounded-md font-medium border border-zinc-800/60 hover:bg-zinc-900 transition-all text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className={`flex-[2] h-12 px-10 rounded-md font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 text-sm ${isEdit ? "bg-amber-500 text-white" : "bg-primary text-primary-foreground"}`}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        {isEdit ? "Updating..." : "Launching..."}
                      </>
                    ) : (
                      <>
                        {isEdit ? <Edit3 className="w-4 h-4" /> : <Rocket className="w-4 h-4" />}
                        {isEdit ? "Update Drive" : "Launch Drive"}
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
