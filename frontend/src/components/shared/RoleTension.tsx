"use client";

import { useMemo } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

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
    color: "text-blue-400",
    bgColor: "bg-blue-500/10",
    border: "border-blue-500/20",
    icon: "R",
  },
  officer: {
    role: "officer",
    label: "Placement Officer",
    priority: "Better filtering",
    description: "Needs thorough evaluation and fair selection processes",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    border: "border-amber-500/20",
    icon: "P",
  },
  student: {
    role: "student",
    label: "Student",
    priority: "Visibility + Fairness",
    description: "Expects transparent processes and equal opportunity",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    icon: "S",
  },
};

export function RoleTensionCard({ activeConflict }: { activeConflict?: string }) {
  const stakeholders = Object.values(STAKEHOLDER_CONFIG);

  return (
    <div className="space-y-2">
      <div className="op-label text-zinc-500 mb-1">Role Tensions</div>
      <div className="grid grid-cols-3 gap-2">
        {stakeholders.map((s, i) => (
          <motion.div
            key={s.role}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className={cn(
              "p-2.5 rounded-lg border text-center transition-all",
              s.bgColor,
              s.border,
              activeConflict === s.role && "ring-1 ring-inset ring-current"
            )}
          >
            <div className={cn(
              "w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mx-auto mb-1.5",
              s.color,
              s.bgColor,
              "border", s.border,
            )}>
              {s.icon}
            </div>
            <p className={cn("text-[11px] font-semibold", s.color)}>{s.label}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">{s.priority}</p>
            <p className="text-[9px] text-zinc-600 mt-1 leading-tight">{s.description}</p>
          </motion.div>
        ))}
      </div>
      {activeConflict && (
        <div className="p-2 rounded bg-rose-500/10 border border-rose-500/20 mt-1">
          <p className="text-[10px] text-rose-400 text-center">
            Tension detected: {STAKEHOLDER_CONFIG[activeConflict as keyof typeof STAKEHOLDER_CONFIG]?.label || activeConflict} priorities conflicting with current workflow
          </p>
        </div>
      )}
    </div>
  );
}
