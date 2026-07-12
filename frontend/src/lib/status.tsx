const STATUS_COLORS: Record<string, string> = {
  Applied: "bg-gray-100 text-gray-600 border-gray-200",
  Shortlisted: "bg-blue-50 text-blue-700 border-blue-200",
  Interview: "bg-amber-50 text-amber-700 border-amber-200",
  Rejected: "bg-red-50 text-red-700 border-red-200",
  Selected: "bg-green-50 text-green-700 border-green-200",
  Screening: "bg-indigo-50 text-indigo-700 border-indigo-200",
  Technical: "bg-violet-50 text-violet-700 border-violet-200",
  HR: "bg-orange-50 text-orange-700 border-orange-200",
  Offer: "bg-green-50 text-green-700 border-green-200",
  Accepted: "bg-green-50 text-green-700 border-green-200",
  Declined: "bg-gray-100 text-gray-500 border-gray-200",
  Expiring: "bg-rose-50 text-rose-700 border-rose-200",
  Archived: "bg-gray-100 text-gray-500 border-gray-200",
  approval_pending: "bg-amber-50 text-amber-700 border-amber-200",
  eligibility_conflict: "bg-red-50 text-red-700 border-red-200",
  recruiter_delay: "bg-orange-50 text-orange-700 border-orange-200",
  slot_conflict: "bg-yellow-50 text-yellow-700 border-yellow-200",
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
  const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return STATUS_COLORS[status] || STATUS_COLORS[normalized] || "bg-gray-100 text-gray-500 border-gray-200";
}

export function getStatusLabel(status: string): string {
  const normalized = status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
  return STATUS_LABELS[status] || STATUS_LABELS[normalized] || status;
}

export function StatusBadge({ status, friction }: { status: string; friction?: boolean }) {
  const label = getStatusLabel(status);
  return (
    <span className={`
      px-2.5 py-0.5 rounded-full text-[11px] font-medium border
      ${getStatusColor(status)}
      ${friction ? "ring-1 ring-inset ring-current/20" : ""}
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
  const colorMap = {
    approval_pending: "bg-amber-50 border-amber-200 text-amber-700",
    eligibility_conflict: "bg-red-50 border-red-200 text-red-700",
    recruiter_delay: "bg-orange-50 border-orange-200 text-orange-700",
    slot_conflict: "bg-yellow-50 border-yellow-200 text-yellow-700",
  };
  const dotMap = {
    approval_pending: "bg-amber-500",
    eligibility_conflict: "bg-red-500",
    recruiter_delay: "bg-orange-500",
    slot_conflict: "bg-yellow-500",
  };
  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${colorMap[state.type]}`}>
      <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${dotMap[state.type]}`} />
      <div className="min-w-0">
        <p className="text-[11px] font-semibold">{state.label}</p>
        <p className="text-[11px] opacity-70">{state.description}</p>
      </div>
    </div>
  );
}
