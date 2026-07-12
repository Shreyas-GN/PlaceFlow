"use client";

import { useState, useRef, useEffect, useId, useMemo } from "react";
import { ChevronDown, Check, X } from "lucide-react";

const DEPARTMENTS = [
  { category: "Engineering", courses: ["CSE", "ISE", "ECE", "EEE", "ME", "CV", "AI", "AIML", "IOT"] },
  { category: "Commerce", courses: ["BCOM", "MCOM", "BBA"] },
  { category: "Management", courses: ["MBA", "MHA", "PGDM"] },
  { category: "Science", courses: ["BSC", "MSC", "BCA", "MCA"] },
  { category: "Arts", courses: ["BA", "MA", "BFA", "MFA"] },
];

const FLAT: { category: string; course: string }[] = DEPARTMENTS.flatMap((g) =>
  g.courses.map((c) => ({ category: g.category, course: c }))
);

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export default function DepartmentSelect({ value, onChange }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIdx, setFocusedIdx] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const listboxId = useId();

  const selected = useMemo(
    () => (value ? value.split(",").map((s) => s.trim()).filter(Boolean) : []),
    [value]
  );

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setFocusedIdx(-1);
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    if (!isOpen || focusedIdx < 0) return;
    containerRef.current
      ?.querySelector(`[data-flat-idx="${focusedIdx}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [focusedIdx, isOpen]);

  const toggle = (course: string) => {
    const set = new Set(selected);
    if (set.has(course)) set.delete(course);
    else set.add(course);
    onChange(Array.from(set).join(", "));
  };

  const remove = (course: string) => {
    onChange(selected.filter((s) => s !== course).join(", "));
  };

  const open = () => { setIsOpen(true); setFocusedIdx(0); };
  const close = () => { setIsOpen(false); setFocusedIdx(-1); triggerRef.current?.focus(); };

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) open();
        else if (focusedIdx >= 0) toggle(FLAT[focusedIdx].course);
        break;
      case "Escape": e.preventDefault(); close(); break;
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) open();
        else setFocusedIdx((i) => Math.min(i + 1, FLAT.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) setFocusedIdx((i) => Math.max(i - 1, 0));
        break;
      case "Tab":
        if (isOpen) close();
        break;
    }
  };

  const indexMap = useMemo(() => {
    const map = new Map<string, number>();
    FLAT.forEach((entry, idx) => { map.set(`${entry.category}:${entry.course}`, idx); });
    return map;
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        ref={triggerRef}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-controls={listboxId}
        aria-label="Select eligible departments"
        tabIndex={0}
        onClick={() => (isOpen ? close() : open())}
        onKeyDown={handleTriggerKeyDown}
        className="w-full bg-white border border-gray-300 rounded-[10px] px-4 py-2.5 text-sm text-left focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all flex items-center justify-between gap-2 min-h-[42px] cursor-pointer"
      >
        <div className="flex flex-wrap gap-1.5 flex-1">
          {selected.length === 0 ? (
            <span className="text-gray-400">Select departments...</span>
          ) : (
            selected.map((s) => (
              <span key={s} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-200 text-xs font-medium">
                {s}
                <button type="button" aria-label={`Remove ${s}`}
                  onClick={(e) => { e.stopPropagation(); remove(s); }}
                  className="hover:text-blue-900 focus:outline-none rounded">
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>
        <ChevronDown className={`w-4 h-4 text-gray-400 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </div>

      {isOpen && (
        <div
          id={listboxId}
          role="listbox"
          aria-multiselectable="true"
          aria-label="Departments"
          className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-xl shadow-elevated overflow-hidden"
        >
          <div className="max-h-72 overflow-y-auto p-2 space-y-1" style={{ overscrollBehavior: "contain" }}>
            {DEPARTMENTS.map((group) => (
              <div key={group.category}>
                <div className="px-3 py-2 text-xs text-gray-400 font-semibold uppercase tracking-wider">{group.category}</div>
                <div className="grid grid-cols-3 gap-1 px-2 pb-2">
                  {group.courses.map((course) => {
                    const flatIdx = indexMap.get(`${group.category}:${course}`) ?? -1;
                    const isSelected = selected.includes(course);
                    const isFocused = focusedIdx === flatIdx;

                    return (
                      <button key={`${group.category}:${course}`} type="button" role="option" aria-selected={isSelected}
                        data-flat-idx={flatIdx}
                        onClick={() => toggle(course)}
                        onMouseEnter={() => setFocusedIdx(flatIdx)}
                        className={`flex items-center gap-1.5 px-2.5 py-2 rounded-lg text-xs font-medium transition-colors focus:outline-none border ${
                          isSelected
                            ? "bg-blue-50 text-blue-700 border-blue-200"
                            : isFocused
                            ? "bg-gray-100 text-gray-900 border-gray-200"
                            : "bg-white text-gray-500 border-gray-100 hover:bg-gray-50 hover:border-gray-200"
                        }`}>
                        {isSelected && <Check className="w-3 h-3 shrink-0" />}
                        {course}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
