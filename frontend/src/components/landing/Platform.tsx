"use client";

import { useState } from "react";
import { Section, SectionHeader } from "./Section";
import { cn } from "@/lib/utils";

type WorkspaceType = "student" | "admin";

export function Platform() {
  const [activeTab, setActiveTab] = useState<WorkspaceType>("admin");

  return (
    <Section id="platform" className="bg-[#FAFAF8]">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
        <SectionHeader 
          subtitle="Platform Overview"
          title="Role-based workspaces designed for focus."
        />
        
        <div className="flex p-1 bg-gray-100 rounded-lg border border-gray-200 self-start lg:mb-16">
          <button
            onClick={() => setActiveTab("student")}
            className={cn(
              "px-6 py-2 text-sm font-medium rounded-md transition-all duration-200",
              activeTab === "student"
                ? "bg-white text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Student Workspace
          </button>
          <button
            onClick={() => setActiveTab("admin")}
            className={cn(
              "px-6 py-2 text-sm font-medium rounded-md transition-all duration-200",
              activeTab === "admin"
                ? "bg-white text-gray-900 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
                : "text-gray-500 hover:text-gray-700"
            )}
          >
            Admin Workspace
          </button>
        </div>
      </div>

      <div className="relative w-full rounded-2xl border border-gray-200 bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] overflow-hidden">
        {/* Mockup Header */}
        <div className="h-14 border-b border-gray-200 bg-[#FAFAF8] flex items-center px-6 gap-6">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
            <div className="w-3 h-3 rounded-full bg-gray-300" />
          </div>
          <div className="h-4 w-px bg-gray-200" />
          <span className="text-sm font-semibold text-gray-900">PlaceFlow</span>
          <div className="flex-1" />
          <div className="w-8 h-8 rounded-full bg-gray-200 border border-gray-300 flex items-center justify-center">
            <span className="text-xs font-medium text-gray-600">
              {activeTab === "admin" ? "AD" : "ST"}
            </span>
          </div>
        </div>

        {/* Mockup Body */}
        <div className="flex h-[500px]">
          {/* Mockup Sidebar */}
          <div className="w-60 border-r border-gray-200 bg-[#FAFAF8] p-4 flex flex-col gap-1 hidden md:flex">
            {(activeTab === "admin" 
              ? ["Dashboard", "Students", "Drives", "Applications", "Reports", "Announcements", "Settings"]
              : ["Dashboard", "Companies", "Applications", "Calendar", "Profile"]
            ).map((item, i) => (
              <div
                key={item}
                className={cn(
                  "h-9 rounded-md px-3 flex items-center text-sm transition-colors",
                  i === 0
                    ? "bg-blue-50 text-blue-700 font-medium"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                {item}
              </div>
            ))}
          </div>

          {/* Mockup Content Area */}
          <div className="flex-1 bg-white p-8 overflow-y-auto">
            {activeTab === "admin" ? <AdminMockupContent /> : <StudentMockupContent />}
          </div>
        </div>
      </div>
    </Section>
  );
}

function AdminMockupContent() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Admin Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Manage placement drives and track overall progress.</p>
        </div>
        <button className="h-9 px-4 bg-blue-600 text-white text-sm font-medium rounded-md shadow-sm">
          Create Drive
        </button>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Students", value: "1,240" },
          { label: "Active Drives", value: "14" },
          { label: "Pending Approvals", value: "38" },
          { label: "Offers Made", value: "412" },
        ].map((stat) => (
          <div key={stat.label} className="p-4 rounded-xl border border-gray-200 bg-[#FAFAF8]">
            <p className="text-xs font-medium text-gray-500 mb-1">{stat.label}</p>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="border border-gray-200 rounded-xl overflow-hidden">
        <div className="bg-[#FAFAF8] px-5 py-3 border-b border-gray-200">
          <h3 className="text-sm font-semibold text-gray-900">Recent Drives</h3>
        </div>
        <div className="divide-y divide-gray-100">
          {[
            { company: "Microsoft", role: "Software Engineer", status: "Active", applicants: 450 },
            { company: "Goldman Sachs", role: "Analyst", status: "Active", applicants: 320 },
            { company: "Atlassian", role: "Frontend Engineer", status: "Reviewing", applicants: 210 },
          ].map((drive, i) => (
            <div key={i} className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{drive.company}</p>
                <p className="text-xs text-gray-500 mt-0.5">{drive.role}</p>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{drive.applicants}</p>
                  <p className="text-[10px] uppercase tracking-wider text-gray-400 mt-0.5">Applicants</p>
                </div>
                <div className="px-2.5 py-1 rounded-md bg-green-50 border border-green-100 text-green-700 text-xs font-medium">
                  {drive.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StudentMockupContent() {
  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Welcome back, Student</h2>
          <p className="text-sm text-gray-500 mt-1">You have 2 upcoming interviews this week.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6 mb-8">
        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-[#FAFAF8] px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">My Applications</h3>
            <span className="text-xs text-blue-600 font-medium">View All</span>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { company: "Google", role: "SWE Intern", status: "Interview" },
              { company: "Amazon", role: "SDE 1", status: "Applied" },
              { company: "Stripe", role: "Backend Engineer", status: "Assessment" },
            ].map((app, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-900">{app.company}</p>
                  <p className="text-xs text-gray-500">{app.role}</p>
                </div>
                <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">
                  {app.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border border-gray-200 rounded-xl overflow-hidden">
          <div className="bg-[#FAFAF8] px-5 py-3 border-b border-gray-200 flex justify-between items-center">
            <h3 className="text-sm font-semibold text-gray-900">New Companies</h3>
            <span className="text-xs text-blue-600 font-medium">Explore</span>
          </div>
          <div className="divide-y divide-gray-100">
            {[
              { company: "Uber", deadline: "Closes in 2 days" },
              { company: "Netflix", deadline: "Closes in 4 days" },
              { company: "Airbnb", deadline: "Closes in 1 week" },
            ].map((comp, i) => (
              <div key={i} className="px-5 py-3 flex items-center justify-between">
                <p className="text-sm font-medium text-gray-900">{comp.company}</p>
                <p className="text-xs text-amber-600 font-medium">{comp.deadline}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
