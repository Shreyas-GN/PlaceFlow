import Link from "next/link";
import { ArrowRight, CheckCircle, Users, Building2, GitBranch, BarChart3, Clock, Filter, Eye, Layers, Target, ChevronRight } from "lucide-react";

const navLinks = [
  { label: "Product", href: "#product" },
  { label: "For Teams", href: "#roles" },
  { label: "Pricing", href: "#" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-layer-1 text-white selection:bg-primary/30">
      {/* ── Navigation ── */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.04] bg-layer-1/90 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-10">
            <span className="text-base font-semibold tracking-tight">PlaceFlow</span>
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors px-4 py-2"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="h-9 px-5 flex items-center gap-1.5 bg-primary text-primary-foreground text-sm font-medium rounded-md hover:bg-primary/90 transition-all active:scale-95"
            >
              Get Started
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </nav>

      <main>
        {/* ═══════════════════════════════════════════════════════════
           HERO
           ═══════════════════════════════════════════════════════════ */}
        <section className="pt-36 pb-24 px-6">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-[900px]">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-xs font-medium text-primary mb-8">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-primary" />
                </span>
                The operating system for campus placements
              </div>

              <h1 className="text-[clamp(48px,6vw,72px)] font-semibold leading-[0.95] tracking-[-0.05em] text-white mb-6">
                Run campus placements without<br />
                spreadsheets, WhatsApp chaos,<br />
                or manual tracking.
              </h1>

              <p className="text-lg text-zinc-400 leading-relaxed max-w-[620px] mb-10">
                PlaceFlow gives students, placement coordinators, and recruiters a single operational workspace for managing applications, interviews, eligibility, and hiring workflows.
              </p>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link
                  href="/register"
                  className="group h-12 px-8 flex items-center gap-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95"
                >
                  Start Placement Drive
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  href="#product"
                  className="group h-12 px-8 flex items-center gap-2 border border-zinc-800 text-zinc-300 rounded-md font-medium hover:border-zinc-700 hover:text-white transition-all"
                >
                  Watch Demo
                </Link>
              </div>

              <p className="mt-8 text-sm text-zinc-600">
                Trusted by placement cells managing 10,000+ applications every semester.
              </p>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           PROBLEM
           ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-2 gap-16 md:gap-24">
              <div>
                <h2 className="text-sm font-medium text-primary mb-4 uppercase tracking-widest">The Problem</h2>
                <h3 className="text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white mb-6">
                  Placement management<br />
                  breaks at scale
                </h3>
                <p className="text-zinc-400 leading-relaxed max-w-[460px]">
                  Most placement workflows still rely on spreadsheets no one updates, WhatsApp coordination, manual eligibility checks, scattered student data, and disconnected recruiter communication.
                </p>
                <p className="text-zinc-500 leading-relaxed max-w-[460px] mt-4">
                  As application volume grows, operations become slower, messier, and harder to track.
                </p>
              </div>

              <div className="space-y-4">
                {[
                  { icon: FileSpreadsheet, label: "Spreadsheets no one updates", desc: "Version conflicts, broken formulas, lost data" },
                  { icon: MessageSquare, label: "WhatsApp coordination", desc: "Urgent messages buried in group chats" },
                  { icon: Filter, label: "Manual eligibility checks", desc: "Hours spent cross-referencing CGPA and backlogs" },
                  { icon: Database, label: "Scattered student data", desc: "Resumes, transcripts, preferences in 5 different places" },
                  { icon: Users, label: "Disconnected communication", desc: "Recruiters, coordinators, students never on the same page" },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-lg bg-layer-2 border border-white/[0.04]">
                    <div className="w-9 h-9 rounded-md bg-rose-500/10 flex items-center justify-center shrink-0 mt-0.5">
                      <item.icon className="w-4 h-4 text-rose-400" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-zinc-200">{item.label}</p>
                      <p className="text-xs text-zinc-600 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           TRANSFORMATION / WORKFLOW
           ═══════════════════════════════════════════════════════════ */}
        <section id="product" className="py-24 px-6 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-sm font-medium text-primary mb-4 uppercase tracking-widest">The Platform</h2>
              <h3 className="text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white mb-4">
                Everything your placement team needs —<br />
                in one workflow
              </h3>
              <p className="text-zinc-400 leading-relaxed max-w-[620px] mx-auto">
                Centralized application tracking, automated eligibility filtering, recruiter-ready placement drives, and real-time student visibility.
              </p>
            </div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 gap-6 mb-20">
              {[
                {
                  icon: Layers,
                  title: "Centralized application tracking",
                  desc: "Track every applicant, status change, interview stage, and offer from a unified dashboard.",
                },
                {
                  icon: Filter,
                  title: "Automated eligibility filtering",
                  desc: "Instantly identify eligible students based on CGPA, branch, backlog history, and custom rules.",
                },
                {
                  icon: Building2,
                  title: "Recruiter-ready placement drives",
                  desc: "Launch and manage drives with timelines, application windows, interview rounds, and approvals.",
                },
                {
                  icon: Eye,
                  title: "Real-time student visibility",
                  desc: "Students always know where they stand, what's pending, and what's next.",
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="p-8 rounded-lg bg-layer-2 border border-white/[0.04] hover:border-white/[0.08] transition-colors"
                >
                  <div className="w-10 h-10 rounded-md bg-primary/10 flex items-center justify-center mb-5">
                    <feature.icon className="w-5 h-5 text-primary" />
                  </div>
                  <h4 className="text-lg font-medium text-white mb-2">{feature.title}</h4>
                  <p className="text-sm text-zinc-400 leading-relaxed">{feature.desc}</p>
                </div>
              ))}
            </div>

            {/* Pipeline Visualization */}
            <div className="rounded-lg bg-layer-2 border border-white/[0.04] p-8 md:p-12">
              <h4 className="text-sm font-medium text-zinc-500 mb-8 uppercase tracking-widest">Placement Pipeline</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-7 gap-3">
                {[
                  { label: "Drive Created", icon: GitBranch, color: "bg-primary/10 text-primary" },
                  { label: "Eligibility Check", icon: Filter, color: "bg-amber-500/10 text-amber-400" },
                  { label: "Applications Open", icon: Users, color: "bg-emerald-500/10 text-emerald-400" },
                  { label: "Shortlisting", icon: Target, color: "bg-blue-500/10 text-blue-400" },
                  { label: "Interviews", icon: Clock, color: "bg-violet-500/10 text-violet-400" },
                  { label: "Offers Released", icon: CheckCircle, color: "bg-emerald-500/10 text-emerald-400" },
                  { label: "Onboarding", icon: ArrowRight, color: "bg-zinc-500/10 text-zinc-400" },
                ].map((step, i) => (
                  <div key={i} className="relative flex items-center gap-3 p-4 rounded-lg bg-layer-3 border border-white/[0.04]">
                    <div className={`w-8 h-8 rounded-md ${step.color} flex items-center justify-center shrink-0`}>
                      <step.icon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-medium text-zinc-300">{step.label}</p>
                      <p className="text-[10px] text-zinc-600 mt-0.5">Stage {i + 1}</p>
                    </div>
                    {i < 6 && (
                      <ChevronRight className="hidden lg:block w-4 h-4 text-zinc-700 absolute -right-3 top-1/2 -translate-y-1/2" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           DASHBOARD PREVIEW
           ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-12">
              <h2 className="text-sm font-medium text-primary mb-4 uppercase tracking-widest">Dashboard</h2>
              <h3 className="text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                One screen, everything operational
              </h3>
            </div>

            {/* Dense Dashboard Mockup */}
            <div className="rounded-lg border border-white/[0.04] bg-layer-2 overflow-hidden">
              {/* Top bar */}
              <div className="h-10 border-b border-white/[0.04] flex items-center px-4 gap-3">
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500/40" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/40" />
                </div>
                <div className="flex-1" />
                <div className="h-5 w-32 rounded bg-layer-3 border border-white/[0.04]" />
              </div>

              <div className="grid md:grid-cols-4">
                {/* Sidebar */}
                <div className="hidden md:block border-r border-white/[0.04] p-4 space-y-2">
                  {["Overview", "Drives", "Applications", "Students", "Recruiters", "Reports"].map((item) => (
                    <div
                      key={item}
                      className={`h-8 rounded px-3 flex items-center text-xs ${
                        item === "Applications"
                          ? "bg-primary/10 text-primary font-medium"
                          : "text-zinc-600 hover:bg-layer-3"
                      } transition-colors`}
                    >
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main content */}
                <div className="md:col-span-3 p-4 md:p-6 space-y-5">
                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Active Drives", value: "12", color: "text-primary" },
                      { label: "Total Applicants", value: "3,842", color: "text-emerald-400" },
                      { label: "Offers Made", value: "847", color: "text-amber-400" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded bg-layer-3 border border-white/[0.04] p-3">
                        <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{stat.label}</p>
                        <p className={`text-lg font-semibold mt-1 ${stat.color}`}>{stat.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Table preview */}
                  <div className="rounded bg-layer-3 border border-white/[0.04]">
                    <div className="grid grid-cols-5 gap-2 px-4 py-2.5 border-b border-white/[0.04]">
                      {["Name", "Drive", "CGPA", "Status", "Stage"].map((h) => (
                        <span key={h} className="text-[10px] text-zinc-600 uppercase tracking-wider">{h}</span>
                      ))}
                    </div>
                    {[
                      { name: "Ananya Sharma", drive: "Amazon SDE", cgpa: "8.9", status: "Eligible", stage: "Interview" },
                      { name: "Rahul Verma", drive: "Google SWE", cgpa: "9.2", status: "Shortlisted", stage: "Waiting" },
                      { name: "Priya Patel", drive: "Microsoft", cgpa: "8.4", status: "Applied", stage: "Review" },
                      { name: "Arun Kumar", drive: "Amazon SDE", cgpa: "7.8", status: "Eligible", stage: "Scheduled" },
                      { name: "Sneha Reddy", drive: "Google SWE", cgpa: "9.0", status: "Offered", stage: "Offer" },
                    ].map((row, i) => (
                      <div key={i} className="grid grid-cols-5 gap-2 px-4 py-2.5 border-b border-white/[0.02] last:border-0">
                        <span className="text-xs text-zinc-300">{row.name}</span>
                        <span className="text-xs text-zinc-500">{row.drive}</span>
                        <span className="text-xs text-zinc-500">{row.cgpa}</span>
                        <span className={`text-xs ${
                          row.status === "Offered" ? "text-emerald-400" :
                          row.status === "Shortlisted" ? "text-amber-400" :
                          row.status === "Eligible" ? "text-blue-400" :
                          "text-zinc-500"
                        }`}>{row.status}</span>
                        <span className="text-xs text-zinc-500">{row.stage}</span>
                      </div>
                    ))}
                  </div>

                  {/* Bottom row */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="rounded bg-layer-3 border border-white/[0.04] p-3">
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Upcoming Deadlines</p>
                      <div className="mt-2 space-y-1.5">
                        {["Amazon — Interview (Apr 15)", "Google — Application (Apr 18)", "Microsoft — Test (Apr 22)"].map((d) => (
                          <div key={d} className="flex items-center gap-2 text-xs text-zinc-400">
                            <div className="w-1 h-1 rounded-full bg-primary/60" />
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="rounded bg-layer-3 border border-white/[0.04] p-3">
                      <p className="text-[10px] text-zinc-600 uppercase tracking-wider">Recent Activity</p>
                      <div className="mt-2 space-y-1.5">
                        {["Google shortlisted 24 students", "15 new applications for Amazon", "Microsoft interview round rescheduled"].map((d) => (
                          <div key={d} className="flex items-center gap-2 text-xs text-zinc-400">
                            <div className="w-1 h-1 rounded-full bg-emerald-400/60" />
                            {d}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           ROLE-BASED WORKFLOWS
           ═══════════════════════════════════════════════════════════ */}
        <section id="roles" className="py-24 px-6 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-sm font-medium text-primary mb-4 uppercase tracking-widest">For Every Role</h2>
              <h3 className="text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                Role-based workspaces
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {/* Placement Officers */}
              <div className="rounded-lg bg-layer-2 border border-white/[0.04] p-8">
                <div className="w-10 h-10 rounded-md bg-violet-500/10 flex items-center justify-center mb-5">
                  <Building2 className="w-5 h-5 text-violet-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-4">Placement Officers</h4>
                <ul className="space-y-3">
                  {[
                    "Drive management and timelines",
                    "Approval workflows",
                    "Analytics and reporting",
                    "Recruiter coordination",
                    "Bulk eligibility processing",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Students */}
              <div className="rounded-lg bg-layer-2 border border-white/[0.04] p-8">
                <div className="w-10 h-10 rounded-md bg-emerald-500/10 flex items-center justify-center mb-5">
                  <Users className="w-5 h-5 text-emerald-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-4">Students</h4>
                <ul className="space-y-3">
                  {[
                    "Application tracking dashboard",
                    "Deadline calendar",
                    "Interview scheduling",
                    "Document management",
                    "Real-time status updates",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recruiters */}
              <div className="rounded-lg bg-layer-2 border border-white/[0.04] p-8">
                <div className="w-10 h-10 rounded-md bg-blue-500/10 flex items-center justify-center mb-5">
                  <BarChart3 className="w-5 h-5 text-blue-400" />
                </div>
                <h4 className="text-lg font-medium text-white mb-4">Recruiters</h4>
                <ul className="space-y-3">
                  {[
                    "Candidate pipeline view",
                    "Eligibility-based filtering",
                    "Interview scheduling",
                    "Offer management",
                    "Communication tools",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5 text-sm text-zinc-400">
                      <CheckCircle className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           METRICS
           ═══════════════════════════════════════════════════════════ */}
        <section className="py-24 px-6 border-t border-white/[0.04]">
          <div className="max-w-7xl mx-auto">
            <div className="mb-16">
              <h2 className="text-sm font-medium text-primary mb-4 uppercase tracking-widest">Real Results</h2>
              <h3 className="text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                Trusted by placement cells nationwide
              </h3>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  value: "10,000+",
                  label: "applications processed per semester",
                },
                {
                  value: "72%",
                  label: "reduction in manual coordination",
                },
                {
                  value: "4x",
                  label: "faster shortlisting workflows",
                },
              ].map((metric, i) => (
                <div
                  key={i}
                  className="rounded-lg bg-layer-2 border border-white/[0.04] p-8"
                >
                  <p className="text-[clamp(36px,4vw,52px)] font-semibold tracking-[-0.04em] text-white leading-none mb-3">
                    {metric.value}
                  </p>
                  <p className="text-sm text-zinc-500">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ═══════════════════════════════════════════════════════════
           FINAL CTA
           ═══════════════════════════════════════════════════════════ */}
        <section className="py-32 px-6 border-t border-white/[0.04]">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-[clamp(28px,3.5vw,40px)] font-semibold leading-[1.05] tracking-[-0.03em] text-white mb-6">
              Stop managing placements across<br />
              spreadsheets and chats.
            </h2>
            <p className="text-lg text-zinc-400 leading-relaxed max-w-[560px] mx-auto mb-10">
              Bring applications, approvals, interviews, and student workflows into one operational system.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/register"
                className="group h-12 px-8 flex items-center gap-2 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-all hover:scale-[1.02] active:scale-95"
              >
                Request Demo
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/login"
                className="group h-12 px-8 flex items-center gap-2 border border-zinc-800 text-zinc-300 rounded-md font-medium hover:border-zinc-700 hover:text-white transition-all"
              >
                Sign In
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-white/[0.04] py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <span className="text-sm text-zinc-600">
            &copy; {new Date().getFullYear()} PlaceFlow. All rights reserved.
          </span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Privacy</Link>
            <Link href="/terms" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Terms</Link>
            <Link href="/security" className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors">Security</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

/* ── Inline icon components (to avoid importing too many lucide icons) ── */

function FileSpreadsheet({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" x2="16" y1="13" y2="13" />
      <line x1="8" x2="16" y1="17" y2="17" />
      <line x1="8" x2="12" y1="21" y2="21" />
    </svg>
  );
}

function MessageSquare({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
      <line x1="9" x2="15" y1="10" y2="10" />
    </svg>
  );
}

function Database({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M3 5v14a9 3 0 0 0 18 0V5" />
      <path d="M3 12a9 3 0 0 0 18 0" />
    </svg>
  );
}
