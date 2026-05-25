const STATUS_COLORS: Record<string, string> = {
  Applied: "bg-blue-500/[0.08] text-blue-400 border-blue-500/10",
  Shortlisted: "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/10",
  Interview: "bg-amber-500/[0.08] text-amber-400 border-amber-500/10",
  Rejected: "bg-red-500/[0.08] text-red-400 border-red-500/10",
  Selected: "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/10",
  /* Friction states */
  approval_pending: "bg-amber-500/[0.08] text-amber-400 border-amber-500/10",
  eligibility_conflict: "bg-red-500/[0.08] text-red-400 border-red-500/10",
  recruiter_delay: "bg-orange-500/[0.08] text-orange-400 border-orange-500/10",
  slot_conflict: "bg-yellow-500/[0.08] text-yellow-400 border-yellow-500/10",
  /* Extended workflow states */
  Screening: "bg-indigo-500/[0.08] text-indigo-400 border-indigo-500/10",
  Technical: "bg-violet-500/[0.08] text-violet-400 border-violet-500/10",
  HR: "bg-pink-500/[0.08] text-pink-400 border-pink-500/10",
  Offer: "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/10",
  Accepted: "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/10",
  Declined: "bg-zinc-500/[0.08] text-zinc-400 border-zinc-500/10",
  Expiring: "bg-rose-500/[0.08] text-rose-400 border-rose-500/10",
  Archived: "bg-zinc-500/[0.08] text-zinc-400 border-zinc-500/10",
};

const STATUS_LABELS: Record<string, string> = {
  Applied: "Applied",
  Shortlisted: "Shortlisted",
  Interview: "Interview",
  Rejected: "Rejected",
  Selected: "Selected",
  approval_pending: "Approval Pending",
  eligibility_conflict: "Eligibility Conflict",
  recruiter_delay: "Recruiter Delay",
  slot_conflict: "Slot Conflict",
  Screening: "Screening",
  Technical: "Technical",
  HR: "HR Round",
  Offer: "Offer",
  Accepted: "Accepted",
  Declined: "Declined",
  Expiring: "Expiring Soon",
  Archived: "Archived",
};

export function getStatusColor(status: string): string {
  const key = status.toLowerCase();
  return STATUS_COLORS[key] || "bg-zinc-500/[0.08] text-zinc-400 border-zinc-500/10";
}

export function getStatusLabel(status: string): string {
  const key = status.toLowerCase();
  return STATUS_LABELS[key] || status;
}

export function StatusBadge({ status, friction }: { status: string; friction?: boolean }) {
  const label = getStatusLabel(status);
  return (
    <span className={`
      px-2.5 py-0.5 rounded-full text-[11px] font-medium border
      ${getStatusColor(status)}
      ${friction ? 'ring-1 ring-inset ring-current/20' : ''}
    `}>
      {label}
    </span>
  );
}

/* ── Friction State Helpers ── */
export interface FrictionState {
  type: "approval_pending" | "eligibility_conflict" | "recruiter_delay" | "slot_conflict";
  label: string;
  description: string;
  severity: "low" | "medium" | "high";
}

export const FRICTION_STATES: FrictionState[] = [
  { type: "approval_pending", label: "Approval Pending", description: "Waiting for placement coordinator approval", severity: "medium" },
  { type: "eligibility_conflict", label: "Eligibility Conflict", description: "CGPA criteria updated after application submission", severity: "high" },
  { type: "recruiter_delay", label: "Recruiter Delays", description: "Interview schedule delayed by recruiter", severity: "high" },
  { type: "slot_conflict", label: "Slot Conflicts", description: "Students have overlapping interview slots", severity: "high" },
];

export function FrictionBadge({ state }: { state: FrictionState }) {
  return (
    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-layer-3 border border-current/10 text-current"
      style={{
        color: state.type === "approval_pending" ? "#f59e0b"
          : state.type === "eligibility_conflict" ? "#ef4444"
          : state.type === "recruiter_delay" ? "#f97316"
          : "#eab308"
      }}
    >
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${
        state.type === "approval_pending" ? "bg-amber-500"
          : state.type === "eligibility_conflict" ? "bg-red-500"
          : state.type === "recruiter_delay" ? "bg-orange-500"
          : "bg-yellow-500"
      }`} />
      <div className="min-w-0">
        <p className="op-label text-current opacity-90">{state.label}</p>
        <p className="text-[11px] text-current opacity-60">{state.description}</p>
      </div>
    </div>
  );
}
