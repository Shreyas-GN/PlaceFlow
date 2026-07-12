import { Section, SectionHeader } from "./Section";
import { FileSpreadsheet, Filter, MessageSquare, Clock, Database } from "lucide-react";

const problems = [
  {
    icon: FileSpreadsheet,
    title: "Spreadsheet management",
    description: "Version conflicts, broken formulas, and manual data entry across dozens of fragmented Excel files.",
  },
  {
    icon: Filter,
    title: "Manual eligibility verification",
    description: "Hours wasted cross-referencing CGPA, backlogs, and branch constraints for every single company drive.",
  },
  {
    icon: MessageSquare,
    title: "Recruiter coordination",
    description: "Important updates, shortlists, and schedules buried in WhatsApp groups and disjointed email threads.",
  },
  {
    icon: Clock,
    title: "Interview scheduling",
    description: "Overlapping interview slots and manual calendar invites that lead to missed opportunities and confusion.",
  },
  {
    icon: Database,
    title: "Scattered records",
    description: "Resumes, transcripts, and placement histories stored in multiple disconnected systems or physical drives.",
  },
];

export function Problem() {
  return (
    <Section id="problem" className="bg-[#FAFAF8]">
      <SectionHeader 
        subtitle="The Problem"
        title="Placement operations become difficult as your campus grows."
      />
      
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {problems.map((problem, i) => (
          <div 
            key={i} 
            className="p-6 rounded-xl bg-white border border-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-50 border border-gray-200 flex items-center justify-center mb-5">
              <problem.icon className="w-5 h-5 text-gray-600" />
            </div>
            <h4 className="text-base font-semibold text-gray-900 mb-2">
              {problem.title}
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              {problem.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
