"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Tabs } from "radix-ui";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { applicationService, Application } from "@/services/application.service";
import { toast } from "sonner";
import { format } from "date-fns";
import { Briefcase, Filter, ChevronRight } from "lucide-react";
import { TableSkeleton } from "@/components/shared/Skeleton";
import { CompanyLogo } from "@/components/shared/CompanyLogo";
import { getStatusColor } from "@/lib/status";
import { cn } from "@/lib/utils";

const TABS = ["All", "Applied", "Shortlisted", "Interview", "Selected", "Rejected"] as const;
type TabValue = (typeof TABS)[number];

export default function ApplicationsPage() {
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabValue>("All");

  useEffect(() => {
    applicationService
      .getApplications()
      .then(setApplications)
      .catch(() => toast.error("Failed to load applications"))
      .finally(() => setIsLoading(false));
  }, []);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = { All: applications.length };
    for (const app of applications) {
      const key = app.status.charAt(0).toUpperCase() + app.status.slice(1).toLowerCase();
      counts[key] = (counts[key] || 0) + 1;
    }
    return counts;
  }, [applications]);

  const filtered = useMemo(() => {
    if (activeTab === "All") return applications;
    return applications.filter(
      (a) => a.status.toLowerCase() === activeTab.toLowerCase()
    );
  }, [applications, activeTab]);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Page Header */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">My Applications</h1>
          <p className="text-gray-500 mt-1 text-sm">Track your placement journey.</p>
        </div>

        <Tabs.Root value={activeTab} onValueChange={(v) => setActiveTab(v as TabValue)}>
          {/* Tab bar */}
          <Tabs.List className="flex items-center gap-1 border-b border-gray-200 mb-5">
            {TABS.map((tab) => {
              const count = statusCounts[tab];
              return (
                <Tabs.Trigger
                  key={tab}
                  value={tab}
                  className={cn(
                    "relative px-3 py-2.5 text-sm font-medium transition-colors",
                    "text-gray-500 hover:text-gray-900",
                    "data-[state=active]:text-blue-700",
                    "focus-visible:outline-none"
                  )}
                >
                  <span>{tab}</span>
                  {count !== undefined && count > 0 && (
                    <span
                      className={cn(
                        "ml-1.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold tabular-nums",
                        activeTab === tab
                          ? "bg-blue-100 text-blue-700"
                          : "bg-gray-100 text-gray-500"
                      )}
                    >
                      {count}
                    </span>
                  )}
                  <span
                    className={cn(
                      "absolute bottom-0 left-0 right-0 h-0.5 rounded-full transition-all",
                      activeTab === tab ? "bg-blue-600" : "bg-transparent"
                    )}
                  />
                </Tabs.Trigger>
              );
            })}
          </Tabs.List>

          {TABS.map((tab) => (
            <Tabs.Content key={tab} value={tab} className="focus-visible:outline-none">
              {isLoading ? (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <TableSkeleton rows={4} />
                </div>
              ) : applications.length === 0 ? (
                <EmptyState
                  icon={<Briefcase className="w-8 h-8 text-gray-300" />}
                  title="No applications yet"
                  description="Start your placement journey by applying to companies that match your profile."
                  action={{ label: "Browse Companies", onClick: () => router.push("/companies") }}
                />
              ) : filtered.length === 0 ? (
                <EmptyState
                  icon={<Filter className="w-8 h-8 text-gray-300" />}
                  title={`No ${tab.toLowerCase()} applications`}
                  description="No applications match this filter. Try a different status."
                  action={{ label: "View All", onClick: () => setActiveTab("All") }}
                />
              ) : (
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100 bg-gray-50">
                        <th className="text-left text-xs text-gray-500 font-medium py-3 px-4">Company</th>
                        <th className="text-left text-xs text-gray-500 font-medium py-3 pr-4 hidden sm:table-cell">Role</th>
                        <th className="text-left text-xs text-gray-500 font-medium py-3 pr-4 hidden md:table-cell">Applied</th>
                        <th className="text-right text-xs text-gray-500 font-medium py-3 pr-4">Status</th>
                        <th className="w-8" />
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((app) => (
                        <tr
                          key={app.id}
                          onClick={() => router.push(`/applications/${app.id}`)}
                          className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors cursor-pointer group"
                        >
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2.5">
                              <CompanyLogo name={app.company?.company_name || "Company"} size="sm" />
                              <span className="text-sm font-medium text-gray-900">{app.company?.company_name}</span>
                            </div>
                          </td>
                          <td className="py-3 pr-4 text-sm text-gray-500 hidden sm:table-cell">{app.company?.role}</td>
                          <td className="py-3 pr-4 text-sm text-gray-400 hidden md:table-cell">
                            {format(new Date(app.applied_at), "MMM d, yyyy")}
                          </td>
                          <td className="py-3 pr-4 text-right">
                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(app.status)}`}>
                              {app.status}
                            </span>
                          </td>
                          <td className="py-3 pr-3">
                            <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 transition-colors" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </Tabs.Content>
          ))}
        </Tabs.Root>
      </div>
    </DashboardLayout>
  );
}

function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: { label: string; onClick: () => void };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 bg-white border border-dashed border-gray-200 rounded-xl text-center">
      <div className="mb-4">{icon}</div>
      <h3 className="text-base font-medium text-gray-900">{title}</h3>
      <p className="text-gray-500 mt-1 text-sm max-w-sm">{description}</p>
      <button
        onClick={action.onClick}
        className="mt-5 h-9 px-5 rounded-[10px] bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        {action.label}
      </button>
    </div>
  );
}
