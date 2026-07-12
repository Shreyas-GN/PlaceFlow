"use client";

import { useId } from "react";
import type { FieldError } from "react-hook-form";
import { cn } from "@/lib/utils";

interface FormFieldProps {
  label: string;
  error?: FieldError;
  required?: boolean;
  hint?: string;
  children: (id: string) => React.ReactNode;
  className?: string;
}

export function FormField({ label, error, required, hint, children, className }: FormFieldProps) {
  const id = useId();

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label
        htmlFor={id}
        className="text-sm font-medium text-gray-700 flex items-center gap-1"
      >
        {label}
        {required && <span className="text-red-500" aria-hidden>*</span>}
      </label>

      {children(id)}

      {error ? (
        <p role="alert" className="text-[12px] text-red-600 leading-none">
          {error.message}
        </p>
      ) : hint ? (
        <p className="text-[12px] text-gray-500 leading-none">{hint}</p>
      ) : null}
    </div>
  );
}
