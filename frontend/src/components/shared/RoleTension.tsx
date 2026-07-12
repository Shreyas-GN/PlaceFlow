"use client";

import { cn } from "@/lib/utils";

interface Stakeholder {
  role: string;
  label: string;
  priority: string;
  description: string;
  color: string;
  icon: string;
}

interface RoleTensionProps {
  stakeholders: Stakeholder[];
  activeConflict?: string;
  className?: string;
}

const STAKEHOLDER_CONFIG = {
  recruiter: {
    role: "recruiter",
    label: "Recruiter",
    priority: "Faster approvals",
    description: "Wants quick hiring decisions and minimal administrative friction",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    border: "border-blue-200",
    icon: "R",
  },
  officer: {
    role: "officer",
    label: "Placement Officer",
    priority: "Better filtering",
    description: "Needs thorough evaluation and fair selection processes",
    color: "text-amber-700",
    bgColor: "bg-amber-50",
    border: "border-amber-200",
    icon: "P",
  },
  student: {
    role: "student",
    label: "Student",
    priority: "Visibility + Fairness",
    description: "Expects transparent processes and equal opportunity",
    color: "text-green-700",
    bgColor: "bg-green-50",
    border: "border-green-200",
    icon: "S",
  },
};

export function RoleTensionCard({ activeConflict }: { activeConflict?: string }) {
  const stakeholders = Object.values(STAKEHOLDER_CONFIG);

  return (
    <div className="space-y-2">
      <div className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Role Tensions</div>
      <div className="grid grid-cols-3 gap-2">
        {stakeholders.map((s) => (
          <div
            key={s.role}
            className={cn(
              "p-2.5 rounded-xl border text-center transition-all",
              s.bgColor,
              s.border,
              activeConflict === s.role && "ring-2 ring-inset ring-current"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-1.5 border",
              s.color,
              s.bgColor,
              s.border,
            )}>
              {s.icon}
            </div>
            <p className={cn("text-[11px] font-semibold", s.color)}>{s.label}</p>
            <p className="text-[10px] text-gray-500 mt-0.5">{s.priority}</p>
            <p className="text-[9px] text-gray-400 mt-1 leading-tight">{s.description}</p>
          </div>
        ))}
      </div>
      {activeConflict && (
        <div className="p-2 rounded-lg bg-red-50 border border-red-200 mt-1">
          <p className="text-[10px] text-red-600 text-center">
            Tension detected: {STAKEHOLDER_CONFIG[activeConflict as keyof typeof STAKEHOLDER_CONFIG]?.label || activeConflict} priorities conflicting with current workflow
          </p>
        </div>
      )}
    </div>
  );
}
