"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Search, Building2, Calendar, Target, IndianRupee, AlertTriangle, Clock, ChevronDown, ChevronUp, Users, Layers, X, Ban, Archive } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { format, formatDistanceToNow, isPast } from "date-fns";
import CompanyFormModal from "@/components/admin/CompanyFormModal";
import DriveCloseModal from "@/components/admin/DriveCloseModal";
import { CompanyCardSkeleton } from "@/components/shared/Skeleton";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENT_COLORS: Record<string, string> = {
  CSE: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  ISE: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  ECE: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  EEE: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  ME: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  CE: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  CSBS: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
  AIDS: "bg-pink-500/10 text-pink-400 border-pink-500/20",
  AIML: "bg-orange-500/10 text-orange-400 border-orange-500/20",
};

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [closingCompany, setClosingCompany] = useState<{ id: string; name: string } | null>(null);
  const [showArchived, setShowArchived] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "E" && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.isContentEditable) {
          e.preventDefault();
          setIsModalOpen(true);
        }
      }
      if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA" && !target.isContentEditable) {
          e.preventDefault();
          const searchInput = document.querySelector<HTMLInputElement>('[data-search="drives"]');
          searchInput?.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
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

  const activeCompanies = companies.filter((c: any) => c.status !== "closed");
  const archivedCompanies = companies.filter((c: any) => c.status === "closed");

  const filteredCompanies = (showArchived ? archivedCompanies : activeCompanies).filter((c: any) => 
    c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold tracking-tight">Placement Drives</h1>
          <p className="text-zinc-500 text-xs mt-0.5">
            Manage active and past company recruitment drives. Press <kbd className="px-1 py-0.5 bg-zinc-800 rounded text-[10px] font-mono">E</kbd> to create.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={cn(
              "h-10 px-4 rounded font-medium flex items-center justify-center gap-2 text-xs border transition-all",
              showArchived
                ? "bg-zinc-800/30 border-zinc-700/60 text-zinc-400"
                : "border-zinc-800/60 text-zinc-500 hover:border-zinc-700/60"
            )}
          >
            <Archive className="w-3.5 h-3.5" />
            {showArchived ? "Active Drives" : `Archived (${archivedCompanies.length})`}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-primary text-primary-foreground h-10 px-5 rounded font-medium flex items-center justify-center gap-2 text-xs hover:opacity-90 transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Create New Drive
          </button>
        </div>
      </div>

      <div className="flex gap-4">
        <div className="flex-1 relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600 group-focus-within:text-primary transition-colors" />
          <input
            data-search="drives"
            type="text"
            placeholder={showArchived ? "Search archived drives..." : "Search companies or roles... (press / to focus)"}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-layer-2 border border-zinc-800/60 rounded-lg pl-11 pr-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 transition-all"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <CompanyCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredCompanies.length === 0 && !showArchived ? (
        <div className="py-14 rounded border border-dashed border-zinc-800/60 bg-layer-2 text-center">
          <div className="w-12 h-12 bg-layer-3 rounded flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6 text-zinc-700" />
          </div>
          <h2 className="text-sm font-medium text-zinc-400 mb-0.5">No drives yet</h2>
          <p className="text-zinc-600 text-xs max-w-sm mx-auto">Create your first placement drive to start receiving applications from students.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 h-9 px-4 rounded bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-all inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Drive
          </button>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="py-14 rounded border border-dashed border-zinc-800/60 bg-layer-2 text-center">
          <div className="w-10 h-10 bg-layer-3 rounded flex items-center justify-center mx-auto mb-3">
            <Search className="w-5 h-5 text-zinc-700" />
          </div>
          <p className="text-zinc-500 text-xs font-medium">No matches</p>
          <p className="text-zinc-600 text-[11px] mt-0.5">No drives match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanies.map((company: any) => {
            const isExpired = isPast(new Date(company.deadline)) && company.status !== "closed";
            const isExpanded = expandedId === company.id;
            const departments = company.eligible_departments.split(",").map((d: string) => d.trim());

            return (
              <motion.div
                layout
                key={company.id}
                className={cn(
                  "rounded border transition-all group",
                  company.status === "closed"
                    ? "bg-zinc-900/30 border-zinc-800/40 opacity-70"
                    : isExpired
                    ? "bg-layer-2 border-amber-900/30 hover:border-amber-700/40"
                    : "bg-layer-2 border-zinc-800/60 hover:border-primary/20"
                )}
              >
                <div className="p-4">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <CompanyLogo name={company.company_name} size="lg" />
                    <div className="flex items-center gap-1.5">
                      {company.status === "closed" ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-zinc-500/10 text-zinc-500 border border-zinc-500/20 font-medium">Closed</span>
                      ) : isExpired ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium">Expired</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">Active</span>
                      )}
                      {!showArchived && (
                        <button
                          onClick={() => setClosingCompany({ id: company.id, name: company.company_name })}
                          className="p-1 rounded hover:bg-rose-500/10 text-zinc-600 hover:text-rose-400 opacity-0 group-hover:opacity-100 transition-all"
                          title="Close drive"
                        >
                          <Ban className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Primary info */}
                  <div className="mb-3">
                    <h3 className="text-base font-medium mb-0.5">{company.company_name}</h3>
                    <p className="text-primary text-xs font-medium mb-2">{company.role}</p>

                    {/* Compact info row */}
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1 text-zinc-500 text-[11px]">
                        <IndianRupee className="w-3 h-3 text-emerald-500" />
                        <span>{company.package}</span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-500 text-[11px]">
                        <Target className="w-3 h-3" />
                        <span>{company.min_cgpa} CGPA</span>
                      </div>
                      <div className="flex items-center gap-1 text-zinc-500 text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{isPast(new Date(company.deadline)) ? "Past" : formatDistanceToNow(new Date(company.deadline), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCompany(company)}
                      className="flex-1 text-[11px] font-medium text-zinc-500 hover:text-zinc-300 bg-zinc-800/30 hover:bg-zinc-800/60 rounded py-1.5 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : company.id)}
                      className="px-2 py-1.5 text-zinc-600 hover:text-zinc-400 hover:bg-zinc-800/30 rounded transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Progressive disclosure - expanded info */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="px-4 pb-4 pt-0 border-t border-zinc-800/20">
                        {/* Department eligibility */}
                        <div className="mt-3">
                          <span className="text-[10px] text-zinc-600 uppercase tracking-wider font-semibold">Eligible Departments</span>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {departments.map((dept: string) => (
                              <span key={dept} className={cn(
                                "px-2 py-0.5 rounded text-[10px] font-medium border",
                                DEPARTMENT_COLORS[dept] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                              )}>
                                {dept}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Deadline */}
                        <div className="mt-2.5 flex items-center justify-between">
                          <div className="flex items-center gap-1.5">
                            <Calendar className="w-3 h-3 text-zinc-600" />
                            <span className="text-[11px] text-zinc-500">Deadline: {format(new Date(company.deadline), 'MMM dd, yyyy HH:mm')}</span>
                          </div>
                          {isExpired && !showArchived && (
                            <span className="text-[10px] text-amber-500 flex items-center gap-1">
                              <AlertTriangle className="w-2.5 h-2.5" />
                              Past deadline
                            </span>
                          )}
                        </div>

                        {/* Status info — layer 3 */}
                        <div className="mt-3 pt-2 border-t border-zinc-800/20">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-zinc-600">Created {format(new Date(company.created_at), 'MMM dd, yyyy')}</span>
                            <span className="text-zinc-600 tabular-nums">ID: {company.id.slice(0, 8)}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      <CompanyFormModal
        mode="create"
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadCompanies}
      />

      <CompanyFormModal
        mode="edit"
        isOpen={!!editingCompany}
        onClose={() => setEditingCompany(null)}
        onSuccess={loadCompanies}
        company={editingCompany}
      />

      <DriveCloseModal
        companyId={closingCompany?.id || ""}
        companyName={closingCompany?.name || ""}
        isOpen={!!closingCompany}
        onClose={() => setClosingCompany(null)}
        onSuccess={loadCompanies}
      />
    </div>
  );
}
