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
    <div className="min-h-screen bg-layer-1 text-zinc-200">
      <nav className="sticky top-0 z-50 border-b border-zinc-800/40 bg-layer-1/90 backdrop-blur-xl">
        <div className="max-w-4xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 text-zinc-500 hover:text-zinc-300 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              <span className="text-sm">PlaceFlow</span>
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-primary flex items-center justify-center">
              <Shield className="w-2.5 h-2.5 text-white" />
            </div>
            <span className="text-xs font-semibold tracking-tight text-zinc-400">PlaceFlow</span>
          </Link>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-12 lg:py-16 flex gap-12">
        <aside className="hidden lg:block w-48 shrink-0">
          <nav className="sticky top-24 space-y-1">
            <div className="pb-3 mb-3 border-b border-zinc-800/40">
              <h2 className="text-xs text-zinc-600 uppercase tracking-[0.08em] font-semibold">{title}</h2>
            </div>
            {sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                className="block text-xs text-zinc-500 hover:text-zinc-300 transition-colors py-0.5"
              >
                {s.label}
              </a>
            ))}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 max-w-2xl">
          <div className="mb-10">
            <h1 className="text-xl font-semibold text-white tracking-tight">{title}</h1>
            <p className="text-sm text-zinc-500 mt-1.5">{subtitle}</p>
            <p className="text-xs text-zinc-600 mt-2">Last updated: {lastUpdated}</p>
          </div>

          <div className="prose prose-invert prose-sm max-w-none [&_h2]:text-base [&_h2]:font-semibold [&_h2]:text-white [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:tracking-tight [&_h3]:text-sm [&_h3]:font-semibold [&_h3]:text-zinc-200 [&_h3]:mt-8 [&_h3]:mb-3 [&_p]:text-zinc-400 [&_p]:leading-relaxed [&_p]:mb-4 [&_ul]:text-zinc-400 [&_ul]:space-y-1.5 [&_ul]:mb-4 [&_li]:leading-relaxed [&_strong]:text-zinc-200 [&_a]:text-primary [&_a:hover]:text-primary/80">
            {children}
          </div>
        </main>
      </div>

      <footer className="border-t border-zinc-800/40 py-8 mt-16">
        <div className="max-w-4xl mx-auto px-6 flex items-center justify-between text-xs text-zinc-600">
          <span>&copy; {new Date().getFullYear()} PlaceFlow. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="hover:text-zinc-400 transition-colors">Terms</Link>
            <Link href="/security" className="hover:text-zinc-400 transition-colors">Security</Link>
            <a href="mailto:support@placeflow.app" className="hover:text-zinc-400 transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
