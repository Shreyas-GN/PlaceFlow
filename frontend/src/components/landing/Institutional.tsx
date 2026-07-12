import { Section } from "./Section";

const benefits = [
  {
    title: "Operational efficiency",
    description: "Eliminate manual data entry and repetitive verification tasks, saving hundreds of administrative hours each semester.",
  },
  {
    title: "Transparency",
    description: "Provide students with real-time status updates and visibility into the placement process, reducing inquiry emails.",
  },
  {
    title: "Standardized workflows",
    description: "Ensure every placement drive follows the same consistent, structured process regardless of the company or department.",
  },
  {
    title: "Reporting",
    description: "Generate instant, accurate reports on placement statistics, offers, and department performance without spreadsheet formulas.",
  },
  {
    title: "Auditability",
    description: "Maintain a complete, searchable history of every application, communication, and offer for compliance and reference.",
  },
  {
    title: "Student experience",
    description: "Offer a centralized, professional portal where students can confidently manage their most important career milestones.",
  },
];

export function Institutional() {
  return (
    <Section className="bg-white border-t-0">
      <div className="max-w-3xl mx-auto text-center mb-16">
        <h2 className="text-sm font-semibold text-blue-600 mb-3 uppercase tracking-widest">
          Institutional Benefits
        </h2>
        <h3 className="text-[clamp(28px,4vw,40px)] font-semibold leading-[1.15] tracking-[-0.02em] text-gray-900">
          Why leading universities adopt PlaceFlow
        </h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
        {benefits.map((benefit, i) => (
          <div key={i}>
            <div className="w-8 h-px bg-blue-600 mb-4" />
            <h4 className="text-base font-semibold text-gray-900 mb-3">
              {benefit.title}
            </h4>
            <p className="text-sm text-gray-500 leading-relaxed">
              {benefit.description}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
