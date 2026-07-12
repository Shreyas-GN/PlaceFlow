import { Navigation } from "@/components/landing/Navigation";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { Platform } from "@/components/landing/Platform";
import { Capabilities } from "@/components/landing/Capabilities";
import { Workflow } from "@/components/landing/Workflow";
import { Institutional } from "@/components/landing/Institutional";
import { Statistics } from "@/components/landing/Statistics";
import { Testimonials } from "@/components/landing/Testimonials";
import { FAQ } from "@/components/landing/FAQ";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900 selection:bg-blue-100 selection:text-blue-900">
      <Navigation />
      
      <main>
        <Hero />
        <Problem />
        <Solution />
        <Platform />
        <Capabilities />
        <Workflow />
        <Institutional />
        <Statistics />
        <Testimonials />
        <FAQ />
        <CTA />
      </main>

      <Footer />
    </div>
  );
}
