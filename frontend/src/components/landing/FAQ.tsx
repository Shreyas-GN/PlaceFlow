"use client";

import { useState } from "react";
import { Section, SectionHeader } from "./Section";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const faqs = [
  {
    question: "Can eligibility rules be customized?",
    answer: "Yes. You can configure custom eligibility criteria for every individual placement drive, filtering students by CGPA, branch, active backlogs, gender, or custom tags automatically."
  },
  {
    question: "Can reports be exported?",
    answer: "All tables, student lists, shortlists, and annual placement statistics can be securely exported to CSV or Excel for internal auditing and university record-keeping."
  },
  {
    question: "Can recruiters access the platform?",
    answer: "Recruiters can be granted restricted access to specific drives to view shortlists, update interview statuses, and communicate final offers directly within the platform."
  },
  {
    question: "Can the system integrate with existing ERP?",
    answer: "PlaceFlow provides standard import/export tools and REST APIs designed to sync student academic data securely with most major university ERP systems."
  },
  {
    question: "How secure is student information?",
    answer: "We follow institutional-grade security practices. Data is encrypted in transit and at rest, and access is strictly governed by role-based permissions."
  }
];

export function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <Section id="faq" className="bg-[#FAFAF8]">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <SectionHeader 
            subtitle="FAQ"
            title="Frequently asked questions"
          />
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div 
                key={i} 
                className={cn(
                  "border border-gray-200 rounded-xl bg-white overflow-hidden transition-all duration-200",
                  isOpen ? "shadow-sm" : ""
                )}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="w-full flex items-center justify-between p-6 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  <span className="text-base font-medium text-gray-900">{faq.question}</span>
                  <ChevronDown className={cn(
                    "w-5 h-5 text-gray-400 transition-transform duration-200 shrink-0 ml-4",
                    isOpen ? "rotate-180" : ""
                  )} />
                </button>
                <div 
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    isOpen ? "max-h-40" : "max-h-0"
                  )}
                >
                  <p className="px-6 pb-6 text-sm text-gray-500 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}
