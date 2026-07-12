import Link from "next/link";
import { Section } from "./Section";

export function CTA() {
  return (
    <Section className="bg-white py-32 text-center">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-[clamp(32px,5vw,48px)] font-semibold leading-[1.1] tracking-[-0.02em] text-gray-900 mb-6">
          Simplify your placement workflow.
        </h2>
        
        <p className="text-lg text-gray-500 mb-10 max-w-[480px] mx-auto">
          Centralize student data, automate eligibility, and track every application in one secure institutional platform.
        </p>
        
        <Link
          href="/register"
          className="inline-flex h-12 px-8 items-center justify-center gap-2 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-[0_1px_2px_rgba(0,0,0,0.05)]"
        >
          Start Placement Season
        </Link>
      </div>
    </Section>
  );
}
