/* ── PlaceFlow Design Language ────────────────────────────────────
 *
 * This file defines the recognizable identity of PlaceFlow.
 * When people see PlaceFlow, they should recognize:
 *  - density style (compact operational)
 *  - workflow structure (pipeline-first)
 *  - information hierarchy (activity over analytics)
 *  - timeline behavior (operational flow)
 *  - placement-native UX (domain-specific)
 *
 * Think: Bloomberg Terminal meets Linear, for placement operations.
 * ──────────────────────────────────────────────────────────────── */

/* ── Operational Typography Scale ── */
export const TYPOGRAPHY = {
  /* Use sparingly — headings are for structural breaks only */
  heading: {
    size: "13px",
    weight: 600,
    tracking: "0.02em",
    lineHeight: 1.3,
  },
  /* Labels are tight, operational, scanable */
  label: {
    size: "11px",
    weight: 600,
    tracking: "0.08em",
    uppercase: true,
    lineHeight: 1.2,
  },
  /* Table data */
  table: {
    size: "13px",
    lineHeight: 1.4,
  },
  /* Metadata — secondary, receded */
  meta: {
    size: "12px",
    opacity: 0.62,
    lineHeight: 1.3,
  },
  /* Compact body — for dense operational regions */
  compact: {
    size: "12px",
    lineHeight: 1.3,
  },
  /* Tabular numbers */
  num: {
    fontVariant: "tabular-nums",
  },
} as const;

/* ── Density Spacing Scale ──
 * PlaceFlow uses aggressive density variation:
 *  - Dense sidebar: 2px/4px gaps
 *  - Spacious hero: 16px/20px padding
 *  - Compressed feed: 8px/12px padding
 *  - Wide analytics: 16px/20px padding
 */
export const DENSITY = {
  sidebar: { padding: "8px", gap: "4px" },
  hero: { padding: "20px", gap: "16px" },
  feed: { padding: "12px", gap: "8px" },
  panel: { padding: "16px", gap: "16px" },
  table: { padding: "8px 16px", gap: "4px" },
  card: { padding: "12px", gap: "8px" },
} as const;

/* ── Workflow Pipeline Stages ──
 * The canonical pipeline — every product surface uses this order.
 */
export const PLACEMENT_PIPELINE = [
  { key: "Applied", label: "Applied", color: "bg-blue-500" },
  { key: "Screening", label: "Screening", color: "bg-indigo-500" },
  { key: "Technical", label: "Technical", color: "bg-violet-500" },
  { key: "HR", label: "HR Round", color: "bg-pink-500" },
  { key: "Offer", label: "Offer", color: "bg-emerald-500" },
] as const;

/* ── Friction State Registry ──
 * These are the operational friction states that make PlaceFlow feel real.
 */
export const FRICTION_STATES_CONFIG = [
  { type: "approval_pending" as const, label: "Approval Pending", description: "Waiting for placement coordinator approval", severity: "medium" as const, color: "amber" },
  { type: "eligibility_conflict" as const, label: "Eligibility Conflict", description: "CGPA criteria updated after application submission", severity: "high" as const, color: "red" },
  { type: "recruiter_delay" as const, label: "Recruiter Delays", description: "Interview schedule delayed by recruiter", severity: "high" as const, color: "orange" },
  { type: "slot_conflict" as const, label: "Slot Conflicts", description: "Students have overlapping interview slots", severity: "high" as const, color: "yellow" },
] as const;

/* ── Activity Types ──
 * Every activity in the stream uses one of these types for consistent icon/color mapping.
 */
export const ACTIVITY_TYPES = [
  "shortlisted",
  "eligibility_update",
  "panel_assigned",
  "deadline_expiring",
  "offer_released",
  "interview_scheduled",
  "application_submitted",
  "drive_opened",
  "slot_conflict",
  "recruiter_action",
] as const;

/* ── Information Hierarchy ──
 * Defines what takes visual priority in each surface area.
 * Activities > Analytics, Operations > Aesthetics.
 */
export const INFO_HIERARCHY = {
  dashboard: ["command_center", "activity_stream", "pipeline", "metrics", "deadlines"],
  admin: ["friction_states", "activity_stream", "pipeline", "offers", "applications"],
  applicant_detail: ["eligibility", "timeline", "pipeline_stage", "documents"],
} as const;

/* ── System Feedback Timing ──
 * Consistent timing for operational feedback across all surfaces.
 */
export const FEEDBACK = {
  autoSaveDelay: 2000,
  syncInterval: 30000,
  optimisticConfirmDuration: 2000,
  errorDisplayDuration: 3000,
  statusUpdateAnimationMs: 600,
} as const;

/* ── Identity Tokens ──
 * The recognizable visual identity of PlaceFlow.
 * These should not change between surfaces.
 */
export const IDENTITY = {
  /* The core metaphor: placement operations infrastructure */
  metaphor: "placement operations infrastructure",
  /* Emotional target: busy institution during placement season */
  emotionalTarget: "busy institution during placement season",
  /* Pattern: compressed, data-dense, operational */
  pattern: "compressed data-dense operational",
  /* Motion: quick, purposeful, never decorative */
  motion: "quick purposeful utilitarian",
  /* Tone: direct, operational, never marketing */
  tone: "direct operational serious",
} as const;
