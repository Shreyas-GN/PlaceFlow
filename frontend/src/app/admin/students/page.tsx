"use client";

import { useEffect, useState } from "react";
import api from "@/lib/api";
import { Users, Search, Download, ExternalLink } from "lucide-react";
import { toast } from "sonner";

interface Student {
  id: string;
  full_name: string;
  email: string;
  department: string;
  cgpa: number;
  roll_number: string | null;
  graduation_year: number | null;
  placement_eligible: boolean | null;
  resume_url: string | null;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const INPUT_CLS = "bg-white border border-gray-300 rounded-[10px] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-gray-900 placeholder:text-gray-400";

export default function AdminStudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [department, setDepartment] = useState("");
  const [eligibleFilter, setEligibleFilter] = useState<string>("");
  const [page, setPage] = useState(0);
  const limit = 50;

  const load = (pg = 0) => {
    setLoading(true);
    const params: Record<string, string | number | boolean> = { skip: pg * limit, limit };
    if (search) params.search = search;
    if (department) params.department = department;
    if (eligibleFilter !== "") params.placement_eligible = eligibleFilter === "true";

    api.get("/admin/students/", { params })
      .then((res) => { setStudents(res.data.items); setTotal(res.data.total); })
      .catch(() => toast.error("Failed to load students"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(page); }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    load(0);
  };

  const updateEligibility = async (id: string, eligible: boolean) => {
    try {
      await api.patch(`/admin/students/${id}/eligibility`, null, { params: { placement_eligible: eligible } });
      toast.success("Eligibility updated");
      load(page);
    } catch {
      toast.error("Failed to update eligibility");
    }
  };

  const downloadCsv = () => {
    const adminStorage = localStorage.getItem("admin-auth-storage");
    let token = "";
    try { token = JSON.parse(adminStorage || "{}").state?.token || ""; } catch {}
    window.open(`${API_BASE}/admin/students/export/csv?token=${token}`, "_blank");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Students</h1>
          <p className="text-gray-500 text-sm mt-1">{total} registered students</p>
        </div>
        <button onClick={downloadCsv}
          className="flex items-center gap-1.5 text-sm border border-gray-300 text-gray-600 px-4 py-2 rounded-[10px] hover:bg-gray-50 transition-colors font-medium">
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
        <div className="relative flex-1 min-w-40">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input className={`${INPUT_CLS} pl-9`} placeholder="Search name, email, roll number…"
            value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <input className={INPUT_CLS} placeholder="Department"
          value={department} onChange={(e) => setDepartment(e.target.value)} />
        <select className={`${INPUT_CLS} cursor-pointer`} value={eligibleFilter} onChange={(e) => setEligibleFilter(e.target.value)}>
          <option value="">All eligibility</option>
          <option value="true">Eligible</option>
          <option value="false">Ineligible</option>
        </select>
        <button type="submit" className="text-sm bg-blue-600 text-white px-4 py-2 rounded-[10px] hover:bg-blue-700 transition-colors font-medium">
          Search
        </button>
      </form>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50">
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Student</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden sm:table-cell">Department</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">CGPA</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500 hidden md:table-cell">Year</th>
              <th className="text-left px-4 py-3 text-xs font-medium text-gray-500">Eligible</th>
              <th className="text-left px-5 py-3 text-xs font-medium text-gray-500">Resume</th>
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">Loading…</td></tr>
            )}
            {!loading && students.length === 0 && (
              <tr><td colSpan={6} className="px-5 py-10 text-center text-gray-400 text-sm">No students found</td></tr>
            )}
            {students.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-3">
                  <p className="font-medium text-sm text-gray-900">{s.full_name}</p>
                  <p className="text-xs text-gray-400">{s.email}</p>
                  {s.roll_number && <p className="text-xs text-gray-400">{s.roll_number}</p>}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden sm:table-cell">{s.department}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{s.cgpa}</td>
                <td className="px-4 py-3 text-sm text-gray-500 hidden md:table-cell">{s.graduation_year ?? "—"}</td>
                <td className="px-4 py-3">
                  <select
                    className="bg-white border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none focus:border-blue-400 cursor-pointer text-gray-700"
                    value={s.placement_eligible === null ? "" : String(s.placement_eligible)}
                    onChange={(e) => { if (e.target.value !== "") updateEligibility(s.id, e.target.value === "true"); }}
                  >
                    <option value="">—</option>
                    <option value="true">✓ Eligible</option>
                    <option value="false">✗ Ineligible</option>
                  </select>
                </td>
                <td className="px-5 py-3">
                  {s.resume_url ? (
                    <a href={s.resume_url} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-blue-600 hover:underline text-xs">
                      <ExternalLink className="w-3 h-3" /> View
                    </a>
                  ) : (
                    <span className="text-gray-300 text-xs">—</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {total > limit && (
        <div className="flex items-center justify-between text-sm text-gray-500">
          <span>Showing {page * limit + 1}–{Math.min((page + 1) * limit, total)} of {total}</span>
          <div className="flex gap-2">
            <button disabled={page === 0} onClick={() => setPage(page - 1)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm">Prev</button>
            <button disabled={(page + 1) * limit >= total} onClick={() => setPage(page + 1)}
              className="px-3 py-1.5 border border-gray-300 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-colors text-sm">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
