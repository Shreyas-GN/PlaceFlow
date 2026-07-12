"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Plus, Search, Building2, Calendar, Target, IndianRupee, AlertTriangle, Clock, ChevronDown, ChevronUp, Users, Layers, X, Ban, Archive, Copy, MapPin } from "lucide-react";
import { adminService } from "@/services/admin.service";
import { toast } from "sonner";
import { format, formatDistanceToNow, isPast } from "date-fns";
import CompanyFormModal from "@/components/admin/CompanyFormModal";
import DriveCloseModal from "@/components/admin/DriveCloseModal";
import { CompanyCardSkeleton } from "@/components/shared/Skeleton";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { cn } from "@/lib/utils";

const DEPARTMENT_COLORS: Record<string, string> = {
  CSE: "bg-blue-50 text-blue-700 border-blue-200",
  ISE: "bg-emerald-50 text-emerald-700 border-emerald-200",
  ECE: "bg-violet-50 text-violet-700 border-violet-200",
  EEE: "bg-amber-50 text-amber-700 border-amber-200",
  ME: "bg-rose-50 text-rose-700 border-rose-200",
  CE: "bg-cyan-50 text-cyan-700 border-cyan-200",
  CSBS: "bg-indigo-50 text-indigo-700 border-indigo-200",
  AIDS: "bg-pink-50 text-pink-700 border-pink-200",
  AIML: "bg-orange-50 text-orange-700 border-orange-200",
};

interface DuplicateState {
  id: string;
  name: string;
  deadline: string;
}

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [closingCompany, setClosingCompany] = useState<{ id: string; name: string } | null>(null);
  const [duplicating, setDuplicating] = useState<DuplicateState | null>(null);
  const [archivingId, setArchivingId] = useState<string | null>(null);
  const [showArchived, setShowArchived] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => { loadCompanies(); }, []);

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

  useEffect(() => {
    if (searchParams.get("create") === "drive") {
      setIsModalOpen(true);
    }
  }, [searchParams]);

  const handleModalClose = () => {
    setIsModalOpen(false);
    if (searchParams.get("create") === "drive") {
      router.replace("/admin/companies");
    }
  };

  const loadCompanies = async () => {
    setIsLoading(true);
    try {
      const data = await adminService.getAllCompanies();
      setCompanies(data);
    } catch {
      toast.error("Failed to load companies");
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = async (company: any) => {
    setArchivingId(company.id);
    try {
      await adminService.archiveDrive(company.id);
      toast.success(`"${company.company_name}" archived.`);
      loadCompanies();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to archive drive");
    } finally {
      setArchivingId(null);
    }
  };

  const handleDuplicate = async () => {
    if (!duplicating) return;
    try {
      await adminService.duplicateDrive(duplicating.id, new Date(duplicating.deadline).toISOString());
      toast.success("Drive duplicated successfully!");
      setDuplicating(null);
      loadCompanies();
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Failed to duplicate drive");
    }
  };

  const activeCompanies = companies.filter((c: any) => c.status !== "closed" && c.status !== "archived");
  const archivedCompanies = companies.filter((c: any) => c.status === "closed" || c.status === "archived");

  const filteredCompanies = (showArchived ? archivedCompanies : activeCompanies).filter((c: any) =>
    c.company_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Placement Drives</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Manage active and past company recruitment drives.{" "}
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-mono text-gray-500">E</kbd> to create.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowArchived(!showArchived)}
            className={cn(
              "h-10 px-4 rounded-[10px] font-medium flex items-center justify-center gap-2 text-sm border transition-colors",
              showArchived
                ? "bg-gray-100 border-gray-200 text-gray-700"
                : "bg-white border-gray-300 text-gray-600 hover:bg-gray-50"
            )}
          >
            <Archive className="w-3.5 h-3.5" />
            {showArchived ? "Active Drives" : `Archived (${archivedCompanies.length})`}
          </button>
          <button
            onClick={() => setIsModalOpen(true)}
            className="h-10 px-5 rounded-[10px] bg-blue-600 text-white font-medium flex items-center justify-center gap-2 text-sm hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Drive
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          data-search="drives"
          type="text"
          placeholder={showArchived ? "Search archived drives..." : "Search companies or roles... (press / to focus)"}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white border border-gray-300 rounded-[10px] pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400"
        />
      </div>

      {/* Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <CompanyCardSkeleton key={i} />)}
        </div>
      ) : filteredCompanies.length === 0 && !showArchived ? (
        <div className="py-16 rounded-xl border border-dashed border-gray-200 bg-white text-center">
          <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
            <Building2 className="w-6 h-6 text-gray-400" />
          </div>
          <h2 className="text-base font-medium text-gray-900 mb-1">No drives yet</h2>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">Create your first placement drive to start receiving applications from students.</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 h-9 px-4 rounded-[10px] bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors inline-flex items-center gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create Drive
          </button>
        </div>
      ) : filteredCompanies.length === 0 ? (
        <div className="py-14 rounded-xl border border-dashed border-gray-200 bg-white text-center">
          <Search className="w-8 h-8 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-900 text-sm font-medium">No matches</p>
          <p className="text-gray-500 text-sm mt-1">No drives match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filteredCompanies.map((company: any) => {
            const isExpired = isPast(new Date(company.deadline)) && company.status !== "closed" && company.status !== "archived";
            const isExpanded = expandedId === company.id;
            const departments = company.eligible_departments.split(",").map((d: string) => d.trim());
            const ctcDisplay = company.ctc || company.package;
            const isArchiving = archivingId === company.id;

            return (
              <div
                key={company.id}
                className={cn(
                  "rounded-xl border transition-all group bg-white",
                  company.status === "closed" || company.status === "archived"
                    ? "border-gray-200 opacity-60"
                    : isExpired
                    ? "border-amber-200 hover:border-amber-300"
                    : "border-gray-200 hover:border-blue-200 hover:shadow-sm"
                )}
              >
                <div className="p-4">
                  {/* Top row */}
                  <div className="flex items-start justify-between mb-3">
                    <CompanyLogo name={company.company_name} size="lg" />
                    <div className="flex items-center gap-1">
                      {company.status === "closed" ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 font-medium">Closed</span>
                      ) : company.status === "archived" ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 border border-gray-200 font-medium">Archived</span>
                      ) : isExpired ? (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-medium">Expired</span>
                      ) : (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-50 text-green-700 border border-green-200 font-medium">Active</span>
                      )}
                      {!showArchived && (
                        <>
                          <button
                            onClick={() => setDuplicating({ id: company.id, name: company.company_name, deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16) })}
                            className="p-1 rounded hover:bg-blue-50 text-gray-400 hover:text-blue-600 opacity-0 group-hover:opacity-100 transition-all"
                            title="Duplicate drive"
                          >
                            <Copy className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => handleArchive(company)}
                            disabled={isArchiving}
                            className="p-1 rounded hover:bg-amber-50 text-gray-400 hover:text-amber-600 opacity-0 group-hover:opacity-100 transition-all disabled:opacity-50"
                            title="Archive drive"
                          >
                            <Archive className="w-3 h-3" />
                          </button>
                          <button
                            onClick={() => setClosingCompany({ id: company.id, name: company.company_name })}
                            className="p-1 rounded hover:bg-red-50 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                            title="Close drive"
                          >
                            <Ban className="w-3 h-3" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Primary info */}
                  <div className="mb-3">
                    <h3 className="text-base font-semibold text-gray-900 mb-0.5">{company.company_name}</h3>
                    <p className="text-blue-600 text-xs font-medium mb-1">{company.role}</p>
                    {(company.location || company.company_type) && (
                      <div className="flex items-center gap-2 mb-2">
                        {company.location && (
                          <span className="flex items-center gap-1 text-[11px] text-gray-500">
                            <MapPin className="w-2.5 h-2.5" />
                            {company.location}
                          </span>
                        )}
                        {company.company_type && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-gray-100 text-gray-500 border border-gray-200">
                            {company.company_type}
                          </span>
                        )}
                      </div>
                    )}
                    <div className="flex flex-wrap gap-x-3 gap-y-1">
                      <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                        <IndianRupee className="w-3 h-3 text-green-600" />
                        <span>{ctcDisplay}</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                        <Target className="w-3 h-3" />
                        <span>{company.min_cgpa} CGPA</span>
                      </div>
                      <div className="flex items-center gap-1 text-gray-500 text-[11px]">
                        <Clock className="w-3 h-3" />
                        <span>{isPast(new Date(company.deadline)) ? "Past" : formatDistanceToNow(new Date(company.deadline), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingCompany(company)}
                      className="flex-1 text-xs font-medium text-gray-600 hover:text-gray-900 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg py-1.5 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setExpandedId(isExpanded ? null : company.id)}
                      className="px-2 py-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors"
                    >
                      {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                {/* Expanded details */}
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-100">
                    <div className="mt-3">
                      <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Eligible Departments</span>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {departments.map((dept: string) => (
                          <span key={dept} className={cn(
                            "px-2 py-0.5 rounded-md text-[10px] font-medium border",
                            DEPARTMENT_COLORS[dept] || "bg-gray-50 text-gray-600 border-gray-200"
                          )}>
                            {dept}
                          </span>
                        ))}
                      </div>
                    </div>

                    {company.hiring_process && (
                      <div className="mt-2.5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Hiring Process</span>
                        <p className="text-[11px] text-gray-600 mt-1">{company.hiring_process}</p>
                      </div>
                    )}

                    {company.required_skills && (
                      <div className="mt-2.5">
                        <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Required Skills</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {company.required_skills.split(",").map((skill: string) => (
                            <span key={skill.trim()} className="px-1.5 py-0.5 rounded bg-gray-100 text-[10px] text-gray-600 border border-gray-200">
                              {skill.trim()}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-2.5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3 h-3 text-gray-400" />
                        <span className="text-[11px] text-gray-500">Deadline: {format(new Date(company.deadline), 'MMM dd, yyyy HH:mm')}</span>
                      </div>
                      {isExpired && !showArchived && (
                        <span className="text-[10px] text-amber-600 flex items-center gap-1">
                          <AlertTriangle className="w-2.5 h-2.5" />
                          Past deadline
                        </span>
                      )}
                    </div>

                    <div className="mt-3 pt-2 border-t border-gray-100">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-gray-400">Created {format(new Date(company.created_at), 'MMM dd, yyyy')}</span>
                        <span className="text-gray-400 tabular-nums font-mono">ID: {company.id.slice(0, 8)}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <CompanyFormModal mode="create" isOpen={isModalOpen} onClose={handleModalClose} onSuccess={loadCompanies} />
      <CompanyFormModal mode="edit" isOpen={!!editingCompany} onClose={() => setEditingCompany(null)} onSuccess={loadCompanies} company={editingCompany} />
      <DriveCloseModal companyId={closingCompany?.id || ""} companyName={closingCompany?.name || ""} isOpen={!!closingCompany} onClose={() => setClosingCompany(null)} onSuccess={loadCompanies} />

      {/* Duplicate modal */}
      {duplicating && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40" onClick={() => setDuplicating(null)} />
          <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-2xl shadow-floating p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-200 flex items-center justify-center">
                <Copy className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Duplicate Drive</h3>
                <p className="text-xs text-gray-500">Clone "{duplicating.name}" with a new deadline</p>
              </div>
              <button onClick={() => setDuplicating(null)} className="ml-auto text-gray-400 hover:text-gray-600 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">New Deadline</label>
            <input
              type="datetime-local"
              value={duplicating.deadline}
              onChange={(e) => setDuplicating({ ...duplicating, deadline: e.target.value })}
              className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all mb-5 text-gray-900"
            />
            <div className="flex gap-3">
              <button
                onClick={() => setDuplicating(null)}
                className="flex-1 h-10 rounded-[10px] border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleDuplicate}
                className="flex-1 h-10 rounded-[10px] bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Copy className="w-3.5 h-3.5" />
                Duplicate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
