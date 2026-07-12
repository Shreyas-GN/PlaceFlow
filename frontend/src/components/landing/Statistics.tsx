import { Section } from "./Section";

const stats = [
  { value: "120,000+", label: "Applications Processed" },
  { value: "15,000+", label: "Active Students" },
  { value: "450+", label: "Companies Hosted" },
  { value: "99%", label: "Placement Workflow Accuracy" },
];

export function Statistics() {
  return (
    <Section className="bg-[#FAFAF8]">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-0">
        {stats.map((stat, i) => (
          <div 
            key={i} 
            className={`flex flex-col items-center text-center ${
              i !== stats.length - 1 ? "md:border-r md:border-gray-200" : ""
            }`}
          >
            <p className="text-[clamp(32px,4vw,48px)] font-semibold tracking-[-0.03em] text-gray-900 mb-2">
              {stat.value}
            </p>
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </Section>
  );
}
