"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown, Check, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const DEPARTMENTS = [
  {
    category: "Engineering",
    courses: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI", "AIML", "IOT"]
  },
  {
    category: "Commerce",
    courses: ["BCOM", "MCOM", "BBA"]
  },
  {
    category: "Management",
    courses: ["BBA", "MBA", "MHA"]
  },
  {
    category: "Science",
    courses: ["BSC", "MSC", "BCA", "MCA"]
  },
  {
    category: "Arts",
    courses: ["BA", "MA", "BFA", "MFA"]
  }
];

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function DepartmentSelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const selected = value ? value.split(",").map(s => s.trim()).filter(Boolean) : [];

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggle = (course: string) => {
    const set = new Set(selected);
    if (set.has(course)) set.delete(course);
    else set.add(course);
    onChange(Array.from(set).join(", "));
  };

  const remove = (course: string) => {
    onChange(selected.filter(s => s !== course).join(", "));
  };

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-900 border border-zinc-800 rounded-md px-4 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all flex items-center justify-between gap-2 min-h-[42px]"
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {selected.length === 0 ? (
            <span className="text-zinc-600">Select departments...</span>
          ) : (
            selected.map(s => (
              <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-primary/10 text-primary text-xs font-medium">
                {s}
                <button type="button" onClick={(e) => { e.stopPropagation(); remove(s); }} className="hover:text-primary-foreground">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 mt-2 w-full bg-zinc-900 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden"
          >
            <div ref={scrollRef} className="max-h-72 overflow-y-auto p-2 space-y-1" style={{ overscrollBehavior: "contain" }}>
              {DEPARTMENTS.map(group => (
                <div key={group.category}>
                  <div className="px-3 py-2 text-xs text-muted-foreground">
                    {group.category}
                  </div>
                  <div className="grid grid-cols-3 gap-1 px-2 pb-2">
                    {group.courses.map(course => {
                      const isSelected = selected.includes(course);
                      return (
                        <button
                          key={course}
                          type="button"
                          onClick={() => toggle(course)}
                          className={`flex items-center gap-1.5 px-2.5 py-2 rounded-md text-xs font-medium transition-all ${
                            isSelected
                              ? "bg-primary/15 text-primary border border-primary/25"
                              : "bg-zinc-800/50 text-zinc-400 border border-transparent hover:bg-zinc-800"
                          }`}
                        >
                          {isSelected && <Check className="w-3 h-3 shrink-0" />}
                          {course}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
