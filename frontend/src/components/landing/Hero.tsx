import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-32 pb-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-8 items-center">
          {/* Left Content */}
          <div className="max-w-[560px]">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-md bg-gray-100 border border-gray-200 text-xs font-semibold text-gray-600 mb-6">
              Campus Placement Platform
            </div>

            <h1 className="text-[clamp(40px,5vw,56px)] font-semibold leading-[1.1] tracking-[-0.02em] text-gray-900 mb-6">
              Modern placement management for colleges that have outgrown spreadsheets.
            </h1>

            <p className="text-lg text-gray-500 leading-relaxed mb-10">
              PlaceFlow centralizes placement operations, allowing students, placement officers, and recruiters to coordinate seamlessly in one secure institutional platform.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-10">
              <Link
                href="/register"
                className="h-12 px-6 flex items-center justify-center w-full sm:w-auto gap-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
              >
                Start Placement Season
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#features"
                className="h-12 px-6 flex items-center justify-center w-full sm:w-auto gap-2 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 hover:text-gray-900 transition-colors"
              >
                See How It Works
              </Link>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
              {[
                "Student Management",
                "Placement Tracking",
                "Institutional Reports",
              ].map((feature) => (
                <div key={feature} className="flex items-center gap-2 text-sm text-gray-600">
                  <CheckCircle2 className="w-4 h-4 text-gray-400" />
                  {feature}
                </div>
              ))}
            </div>
          </div>

          {/* Right Content - Interactive UI Mockup */}
          <div className="relative w-full aspect-square md:aspect-[4/3] lg:aspect-auto lg:h-[600px] rounded-2xl border border-gray-200 bg-[#FAFAF8] shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col">
            {/* Window Header */}
            <div className="h-12 border-b border-gray-200 bg-white flex items-center px-4 gap-4 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
                <div className="w-2.5 h-2.5 rounded-full bg-gray-200" />
              </div>
              <div className="flex-1" />
              <div className="h-6 w-48 bg-gray-100 rounded-md" />
              <div className="flex-1" />
              <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                <span className="text-[10px] font-medium text-blue-700">JD</span>
              </div>
            </div>
            
            {/* Window Body */}
            <div className="flex flex-1 overflow-hidden">
              {/* Sidebar */}
              <div className="w-48 border-r border-gray-200 bg-white p-3 flex flex-col gap-1 hidden sm:flex shrink-0">
                {["Overview", "Students", "Companies", "Drives", "Applications", "Reports"].map((item, i) => (
                  <div
                    key={item}
                    className={`h-8 rounded-lg px-3 flex items-center text-sm font-medium ${
                      i === 0
                        ? "bg-gray-100 text-gray-900"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {item}
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 p-6 bg-[#FAFAF8] overflow-y-auto">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Dashboard Overview</h3>
                  <div className="h-8 px-3 rounded-md border border-gray-200 bg-white flex items-center text-xs font-medium text-gray-600">
                    2024-2025 Season
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-6">
                  {[
                    { label: "Active Drives", value: "24", trend: "+2" },
                    { label: "Total Applications", value: "4,210", trend: "+15%" },
                    { label: "Offers Generated", value: "892", trend: "+5%" },
                  ].map((stat) => (
                    <div key={stat.label} className="bg-white border border-gray-200 rounded-xl p-4">
                      <p className="text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-xl font-semibold text-gray-900">{stat.value}</p>
                        <span className="text-[10px] font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded-sm">{stat.trend}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden mb-6">
                  <div className="px-5 py-4 border-b border-gray-200 flex items-center justify-between">
                    <h4 className="text-sm font-semibold text-gray-900">Recent Applications</h4>
                    <span className="text-xs text-blue-600 font-medium">View All</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {[
                      { name: "Arjun Mehta", company: "Microsoft", role: "SDE 1", status: "Interview", statusColor: "text-amber-700 bg-amber-50 border-amber-200" },
                      { name: "Priya Sharma", company: "Google", role: "SWE", status: "Offered", statusColor: "text-green-700 bg-green-50 border-green-200" },
                      { name: "Rahul Verma", company: "Amazon", role: "SDE", status: "Applied", statusColor: "text-gray-700 bg-gray-100 border-gray-200" },
                      { name: "Sneha Iyer", company: "Atlassian", role: "Frontend Eng", status: "Shortlisted", statusColor: "text-blue-700 bg-blue-50 border-blue-200" },
                    ].map((row, i) => (
                      <div key={i} className="flex items-center justify-between px-5 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                            <span className="text-xs font-medium text-gray-600">{row.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{row.name}</p>
                            <p className="text-xs text-gray-500">{row.company} &middot; {row.role}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-md border text-[10px] font-semibold ${row.statusColor}`}>
                          {row.status}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
