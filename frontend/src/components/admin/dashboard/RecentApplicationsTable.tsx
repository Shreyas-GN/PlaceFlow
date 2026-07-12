"use client";

import Link from "next/link";
import { format } from "date-fns";
import { getStatusColor } from "@/lib/status";

interface Application {
  id: string;
  status: string;
  applied_at: string;
  student?: { full_name?: string; department?: string };
  company?: { company_name?: string };
}

interface RecentApplicationsTableProps {
  applications: Application[];
}

export function RecentApplicationsTable({ applications }: RecentApplicationsTableProps) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
      <div className="px-5 py-4 flex items-center justify-between border-b border-gray-100">
        <h2 className="text-sm font-semibold text-gray-700">Recent Applications</h2>
        <Link href="/admin/applicants" className="text-sm text-blue-600 hover:underline">
          View all
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100">
              <th className="text-left text-xs font-medium text-gray-500 px-5 py-3">Candidate</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Company</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Applied</th>
              <th className="text-right text-xs font-medium text-gray-500 px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.slice(0, 8).map((app) => (
              <tr key={app.id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
                <td className="py-3 px-5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center text-blue-700 text-xs font-semibold shrink-0">
                      {app.student?.full_name?.[0]}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{app.student?.full_name}</p>
                      <p className="text-xs text-gray-500">{app.student?.department}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-sm text-gray-600">{app.company?.company_name}</td>
                <td className="py-3 px-4 text-sm text-gray-400">
                  {format(new Date(app.applied_at), "MMM d")}
                </td>
                <td className="py-3 px-5 text-right">
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                    {app.status === "Applied" ? "Awaiting review" : app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
