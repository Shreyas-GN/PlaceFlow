import { Section, SectionHeader } from "./Section";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote: "PlaceFlow has transformed our operational workflow. We save over 40 hours a week on manual eligibility checks and our students finally have a centralized place for all their applications.",
    author: "Dr. Ramesh Kumar",
    role: "Training & Placement Officer",
    department: "Computer Science Department",
    institution: "ABC Institute of Technology"
  },
  {
    quote: "The ability to generate accurate, auditable reports instantly has been a game-changer. Recruiters love the transparency, and our coordination is completely centralized.",
    author: "Prof. Sarah Jenkins",
    role: "Head of Career Services",
    department: "Engineering Faculty",
    institution: "National College of Engineering"
  }
];

export function Testimonials() {
  return (
    <Section className="bg-white">
      <SectionHeader 
        subtitle="Trusted by Institutions"
        title="Software that placement cells depend on."
      />

      <div className="grid md:grid-cols-2 gap-8">
        {testimonials.map((testimonial, i) => (
          <div key={i} className="p-8 rounded-xl border border-gray-200 bg-[#FAFAF8] relative">
            <Quote className="w-8 h-8 text-gray-200 absolute top-8 right-8" />
            <p className="text-base text-gray-700 leading-relaxed mb-8 pr-12">
              &quot;{testimonial.quote}&quot;
            </p>
            <div>
              <p className="text-sm font-semibold text-gray-900">{testimonial.author}</p>
              <p className="text-xs text-gray-500 mt-1">{testimonial.role}</p>
              <p className="text-xs text-gray-500">{testimonial.department}, {testimonial.institution}</p>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
