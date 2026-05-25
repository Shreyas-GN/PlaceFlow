"use client";

import { ErrorFallback } from "@/components/shared/ErrorFallback";

export default function AdminError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <div className="p-6"><ErrorFallback error={error} reset={reset} /></div>;
}
