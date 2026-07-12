import { Section, SectionHeader } from "./Section";
import { ArrowRight } from "lucide-react";

const steps = [
  "Registration",
  "Profile",
  "Eligibility",
  "Applications",
  "Assessment",
  "Interview",
  "Offer",
  "Placement"
];

export function Workflow() {
  return (
    <Section id="workflow" className="bg-[#FAFAF8]">
      <SectionHeader 
        subtitle="The Workflow"
        title="A standardized, transparent placement journey."
      />

      {/* Desktop Horizontal Workflow */}
      <div className="hidden lg:flex items-center justify-between mt-12 bg-white p-8 rounded-xl border border-gray-200 overflow-x-auto">
        {steps.map((step, i) => (
          <div key={step} className="flex items-center shrink-0">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center text-sm font-semibold text-blue-700">
                {i + 1}
              </div>
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <ArrowRight className="w-5 h-5 text-gray-300 mx-6 mb-6" />
            )}
          </div>
        ))}
      </div>

      {/* Mobile/Tablet Vertical Workflow */}
      <div className="lg:hidden flex flex-col mt-8">
        {steps.map((step, i) => (
          <div key={step} className="flex flex-col items-center">
            <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-xl border border-gray-200 w-full max-w-xs shadow-sm">
              <div className="w-8 h-8 rounded-full border border-blue-200 bg-blue-50 flex items-center justify-center text-sm font-semibold text-blue-700 shrink-0">
                {i + 1}
              </div>
              <span className="text-sm font-semibold uppercase tracking-wider text-gray-900">
                {step}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="h-8 w-px bg-gray-200 my-2" />
            )}
          </div>
        ))}
      </div>
    </Section>
  );
}
