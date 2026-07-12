import { Section, SectionHeader } from "./Section";
import { Users, GitBranch, Briefcase, BarChart3, Bell, CalendarDays } from "lucide-react";

const solutions = [
  {
    icon: Users,
    title: "Centralized Student Profiles",
    problem: "Scattered student records and manual verification.",
    benefit: "Every student's academic history remains available from one centralized profile, removing duplicate verification loops.",
  },
  {
    icon: GitBranch,
    title: "Application Pipeline",
    problem: "Tracking candidate progress across spreadsheets.",
    benefit: "Track every application from submission to final offer using a structured, visible recruitment workflow.",
  },
  {
    icon: Briefcase,
    title: "Placement Drives",
    problem: "Fragmented company interactions and timelines.",
    benefit: "Create, manage, and monitor recruitment drives collaboratively without relying on external documents.",
  },
  {
    icon: BarChart3,
    title: "Reports",
    problem: "Compiling end-of-year statistics manually.",
    benefit: "Generate placement reports instantly for departments, companies, and academic years with full auditability.",
  },
  {
    icon: Bell,
    title: "Announcements",
    problem: "Urgent updates getting lost in chat groups.",
    benefit: "Broadcast official updates, deadlines, and shortlists directly to student dashboards with read receipts.",
  },
  {
    icon: CalendarDays,
    title: "Calendar",
    problem: "Overlapping interview schedules and missed tests.",
    benefit: "A unified timeline for all upcoming tests, pre-placement talks, and interviews to prevent conflicts.",
  },
];

export function Solution() {
  return (
    <Section id="solutions" className="bg-white">
      <SectionHeader 
        subtitle="The Solution"
        title="Everything your placement team needs — in one workflow."
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {solutions.map((solution, i) => (
          <div key={i} className="flex flex-col">
            <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center mb-5">
              <solution.icon className="w-5 h-5 text-blue-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-4">
              {solution.title}
            </h4>
            
            <div className="space-y-4 flex-1">
              <div>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-gray-400 mb-1">
                  Solves
                </p>
                <p className="text-sm text-gray-600">
                  {solution.problem}
                </p>
              </div>
              
              <div className="h-px w-full bg-gray-100" />
              
              <div>
                <p className="text-[11px] font-semibold tracking-wider uppercase text-blue-600 mb-1">
                  Operational Benefit
                </p>
                <p className="text-sm text-gray-900 leading-relaxed">
                  {solution.benefit}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
