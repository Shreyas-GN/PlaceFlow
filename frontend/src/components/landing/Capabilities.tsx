import { Section, SectionHeader } from "./Section";
import { GraduationCap, Building2, BriefcaseBusiness, CheckCircle2 } from "lucide-react";

const capabilities = [
  {
    role: "Student Experience",
    icon: GraduationCap,
    features: [
      "Personalized Dashboard",
      "Resume Management",
      "Company Discovery",
      "Application Tracking",
      "Interview Timelines",
    ],
  },
  {
    role: "Placement Cell",
    icon: Building2,
    features: [
      "Student Management",
      "Company Management",
      "Recruitment Pipeline",
      "Advanced Reports",
      "Eligibility Rules",
    ],
  },
  {
    role: "Recruiters",
    icon: BriefcaseBusiness,
    features: [
      "Candidate Review",
      "Interview Pipeline",
      "Hiring Updates",
      "Secure Document Access",
      "Direct Communication",
    ],
  },
];

export function Capabilities() {
  return (
    <Section id="capabilities" className="bg-white">
      <SectionHeader 
        subtitle="Capabilities"
        title="Comprehensive tools for every stakeholder."
      />

      <div className="grid md:grid-cols-3 gap-8">
        {capabilities.map((category, i) => (
          <div key={i} className="p-8 rounded-xl border border-gray-200 bg-[#FAFAF8]">
            <div className="w-10 h-10 rounded-lg border border-gray-200 bg-white flex items-center justify-center mb-6">
              <category.icon className="w-5 h-5 text-gray-700" />
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-6">
              {category.role}
            </h4>
            <ul className="space-y-4">
              {category.features.map((feature, j) => (
                <li key={j} className="flex items-center gap-3">
                  <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                  <span className="text-sm text-gray-600">{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </Section>
  );
}
