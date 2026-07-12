"use client";

import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

interface Section {
  id: string;
  label: string;
}

interface LegalPageProps {
  title: string;
  subtitle: string;
  lastUpdated: string;
  sections: Section[];
  children: React.ReactNode;
}

export default function LegalPage({ title, subtitle, lastUpdated, sections, children }: LegalPageProps) {
  return (
    <div className="min-h-screen bg-[#FAFAF8] text-gray-900">
      <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="text-sm">PlaceFlow</span>
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center">
              <Shield className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-tight text-gray-500">PlaceFlow</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16 flex gap-12">
        <aside className="hidden lg:block w-48 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <div className="pb-3 mb-3 border-b border-gray-200">
              <h2 className="text-xs text-gray-400 uppercase tracking-[0.08em] font-semibold">{title}</h2>
            </div>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-xs text-gray-500 hover:text-gray-700 transition-colors py-0.5"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 max-w-2xl">
          <div className="mb-10">
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">{title}</h1>
            <p className="text-sm text-gray-500 mt-1.5">{subtitle}</p>
            <p className="text-xs text-gray-400 mt-2">Last updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-sm max-w-none [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-gray-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-gray-800 [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-gray-600 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_li]:leading-relaxed [&_strong]:text-gray-900 [&_a]:text-blue-600 [&_a:hover]:text-blue-700">
            {children}
          </div>
        </main>
      </div>

      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-xs text-gray-400">
          <span>&copy; {new Date().getFullYear()} PlaceFlow. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-gray-600 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-gray-600 transition-colors">Terms</Link>
            <Link href="/security" className="hover:text-gray-600 transition-colors">Security</Link>
            <a href="mailto:support@placeflow.app" className="hover:text-gray-600 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
