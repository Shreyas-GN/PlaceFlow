"use client";

import { useEffect, useState } from "react";
import { reportService, PlacementSummary, CompanyReport, BranchReport } from "@/services/report.service";
import { BarChart2, Download, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function AdminReportsPage() {
  const [summary, setSummary] = useState<PlacementSummary | null>(null);
  const [companyData, setCompanyData] = useState<CompanyReport[]>([]);
  const [branchData, setBranchData] = useState<BranchReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"company" | "branch">("company");

  const load = () => {
    setLoading(true);
    Promise.all([
      reportService.getSummary(),
      reportService.getCompanyReport(),
      reportService.getBranchReport(),
    ])
      .then(([s, c, b]) => { setSummary(s); setCompanyData(c); setBranchData(b); })
      .catch(() => toast.error("Failed to load reports"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <BarChart2 className="w-5 h-5 text-blue-600" />
        <h1 className="text-lg font-semibold text-gray-900">Reports</h1>
        <button
          onClick={load}
          className="ml-auto p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition-colors"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {summary && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Students", value: summary.total_students },
            { label: "Applied", value: summary.total_applied },
            { label: "Placed", value: summary.total_placed },
            { label: "Placement %", value: `${summary.placement_percentage}%` },
            { label: "Companies", value: summary.total_companies },
            { label: "Active Drives", value: summary.active_drives },
            { label: "Total Offers", value: summary.total_offers },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl border border-gray-200 bg-white px-4 py-3">
              <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">{label}</p>
              <p className="text-xl font-semibold text-gray-900 mt-0.5 tabular-nums">{value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-0 border-b border-gray-200">
        {(["company", "branch"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "text-xs px-4 py-2 border-b-2 transition-colors capitalize font-medium",
              tab === t ? "border-blue-600 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            )}
          >
            {t === "company" ? "By Company" : "By Branch"}
          </button>
        ))}
        <button
          onClick={() => tab === "company" ? reportService.downloadCompanyCsv() : reportService.downloadBranchCsv()}
          className="ml-auto flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 transition-colors mb-1 px-2"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>

      {loading ? (
        <div className="space-y-2 animate-pulse">
          {[1,2,3,4,5].map((i) => <div key={i} className="h-10 rounded-lg bg-gray-100" />)}
        </div>
      ) : tab === "company" ? (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Company</th>
                <th className="text-left px-3 py-2.5 text-gray-500 font-medium hidden sm:table-cell">Role</th>
                <th className="text-right px-3 py-2.5 text-gray-500 font-medium">Applications</th>
                <th className="text-right px-3 py-2.5 text-gray-500 font-medium hidden sm:table-cell">Shortlisted</th>
                <th className="text-right px-3 py-2.5 text-gray-500 font-medium">Offers</th>
                <th className="text-right px-4 py-2.5 text-gray-500 font-medium hidden sm:table-cell">Rejected</th>
              </tr>
            </thead>
            <tbody>
              {companyData.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No data</td></tr>
              )}
              {companyData.map((r) => (
                <tr key={r.company_id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.company_name}</td>
                  <td className="px-3 py-2.5 text-gray-500 hidden sm:table-cell">{r.role}</td>
                  <td className="px-3 py-2.5 text-right text-gray-700 tabular-nums">{r.total_applications}</td>
                  <td className="px-3 py-2.5 text-right text-gray-500 hidden sm:table-cell tabular-nums">{r.shortlisted}</td>
                  <td className="px-3 py-2.5 text-right text-green-600 font-medium tabular-nums">{r.offers}</td>
                  <td className="px-4 py-2.5 text-right text-red-500 hidden sm:table-cell tabular-nums">{r.rejected}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="rounded-xl border border-gray-200 overflow-hidden bg-white">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-4 py-2.5 text-gray-500 font-medium">Department</th>
                <th className="text-right px-3 py-2.5 text-gray-500 font-medium">Students</th>
                <th className="text-right px-3 py-2.5 text-gray-500 font-medium">Applied</th>
                <th className="text-right px-3 py-2.5 text-gray-500 font-medium">Placed</th>
                <th className="text-right px-3 py-2.5 text-gray-500 font-medium">Placement %</th>
                <th className="text-right px-4 py-2.5 text-gray-500 font-medium hidden sm:table-cell">Avg CGPA</th>
              </tr>
            </thead>
            <tbody>
              {branchData.length === 0 && (
                <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No data</td></tr>
              )}
              {branchData.map((r) => (
                <tr key={r.department} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-2.5 font-medium text-gray-900">{r.department}</td>
                  <td className="px-3 py-2.5 text-right text-gray-700 tabular-nums">{r.total_students}</td>
                  <td className="px-3 py-2.5 text-right text-gray-500 tabular-nums">{r.applied}</td>
                  <td className="px-3 py-2.5 text-right text-green-600 font-medium tabular-nums">{r.placed}</td>
                  <td className="px-3 py-2.5 text-right tabular-nums">
                    <span className={cn(
                      "font-medium",
                      r.placement_percentage >= 50 ? "text-green-600" : r.placement_percentage >= 25 ? "text-amber-600" : "text-red-500"
                    )}>
                      {r.placement_percentage}%
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-right text-gray-500 hidden sm:table-cell tabular-nums">{r.average_cgpa ?? "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
