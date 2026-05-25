"use client";

import { useState } from "react";
import { X, Loader2, Rocket, Building2, Briefcase, IndianRupee, GraduationCap, MapPin, Calendar } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateCompanyModal({ isOpen, onClose, onSuccess }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    company_name: "",
    role: "",
    package: "",
    min_cgpa: "0",
    eligible_departments: "CSE, ISE, ECE",
    deadline: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await adminService.createCompany({
        ...formData,
        min_cgpa: parseFloat(formData.min_cgpa),
        deadline: new Date(formData.deadline).toISOString()
      });
      toast.success("Placement drive created successfully!");
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to create drive");
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
            className="relative w-full max-w-2xl bg-zinc-950 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary via-amber-500 to-orange-500" />
            
            <div className="p-6 sm:p-8">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <motion.div 
                    whileHover={{ rotate: 15 }}
                    className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center"
                  >
                    <Rocket className="w-5 h-5 text-primary" />
                  </motion.div>
                  <div>
                    <h2 className="text-lg font-semibold">New Placement Drive</h2>
                    <p className="text-xs text-zinc-500">Launch a new recruitment opportunity</p>
                  </div>
                </div>
                <motion.button 
                  whileHover={{ rotate: 90 }}
                  transition={{ duration: 0.2 }}
                  onClick={onClose}
                  className="p-2 hover:bg-zinc-900 rounded-xl transition-colors text-zinc-500"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5" /> Company Name
                    </label>
                    <input
                      required
                      value={formData.company_name}
                      onChange={(e) => setFormData({...formData, company_name: e.target.value})}
                      placeholder="e.g. Google"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> Job Role
                    </label>
                    <input
                      required
                      value={formData.role}
                      onChange={(e) => setFormData({...formData, role: e.target.value})}
                      placeholder="e.g. Software Engineer"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                      <IndianRupee className="w-3.5 h-3.5" /> Package (LPA)
                    </label>
                    <input
                      required
                      value={formData.package}
                      onChange={(e) => setFormData({...formData, package: e.target.value})}
                      placeholder="e.g. 12 LPA"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Min. CGPA
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={formData.min_cgpa}
                      onChange={(e) => setFormData({...formData, min_cgpa: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5" /> Eligible Departments
                    </label>
                    <input
                      required
                      value={formData.eligible_departments}
                      onChange={(e) => setFormData({...formData, eligible_departments: e.target.value})}
                      placeholder="e.g. CSE, ISE, ECE (Comma separated)"
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1.5">
                    <label className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5" /> Application Deadline
                    </label>
                    <input
                      type="datetime-local"
                      required
                      value={formData.deadline}
                      onChange={(e) => setFormData({...formData, deadline: e.target.value})}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-3">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 h-12 rounded-xl font-medium border border-zinc-800 hover:bg-zinc-900 transition-all text-sm"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="flex-[2] h-12 px-10 bg-primary text-primary-foreground rounded-xl font-medium flex items-center justify-center gap-2 hover:opacity-90 transition-all disabled:opacity-50 text-sm"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Launching...
                      </>
                    ) : (
                      <>
                        <Rocket className="w-4 h-4" />
                        Launch Drive
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
