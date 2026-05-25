"use client";

import { useEffect, useState } from "react";
import { Plus, Search, Building2, Calendar, Target, IndianRupee, Loader2 } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { format } from "date-fns";
import CreateCompanyModal from "@/components/admin/CreateCompanyModal";
import { motion, AnimatePresence } from "framer-motion";
import { CompanyCardSkeleton } from "@/components/shared/Skeleton";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllCompanies();
      setCompanies(data);
    } catch (error) {
      toast.error("Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  };

  const filteredCompanies = companies.filter((c: any) => 
    c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Placement Drives</h1>
          <p className="text-zinc-500 text-sm mt-0.5">Manage active and past company recruitment drives.</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setIsModalOpen(true)}
          className="bg-primary text-primary-foreground h-11 px-6 rounded-2xl font-medium flex items-center justify-center gap-2 text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/20"
        >
          <Plus className="w-4 h-4" />
          Create New Drive
        </motion.button>
      </motion.div>

      <div className="flex gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search companies or roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950 border border-zinc-800 rounded-2xl pl-11 pr-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCompanies.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-16 rounded-2xl bg-zinc-950 border border-zinc-800 text-center"
        >
          <div className="w-16 h-16 bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-zinc-700" />
          </div>
          <h2 className="text-lg font-semibold text-zinc-400 mb-1">No Drives Found</h2>
          <p className="text-zinc-600 text-sm max-w-sm mx-auto">Get started by creating your first placement drive for the students.</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          <AnimatePresence>
            {filteredCompanies.map((company: any, index: number) => (
              <motion.div 
                key={company.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.03 }}
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl bg-zinc-950 border border-zinc-800 hover:border-primary/20 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-all"
                  >
                    <Building2 className="w-6 h-6 text-primary" />
                  </motion.div>
                </div>

                <div className="relative z-10">
                  <h3 className="text-lg font-semibold mb-0.5">{company.company_name}</h3>
                  <p className="text-primary text-sm font-medium mb-4">{company.role}</p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2.5 text-zinc-500">
                      <IndianRupee className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-sm">{company.package}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-zinc-500">
                      <Target className="w-3.5 h-3.5 text-blue-500" />
                      <span className="text-sm">Min. {company.min_cgpa} CGPA</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-zinc-500">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span className="text-sm">Deadline: {format(new Date(company.deadline), 'MMM dd, hh:mm a')}</span>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span className="text-[10px] font-medium text-zinc-600 uppercase tracking-wider">Active</span>
                    </div>
                    <button className="text-xs font-medium text-primary hover:underline">Edit Listing</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <CreateCompanyModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadCompanies}
      />
    </div>
  );
}
