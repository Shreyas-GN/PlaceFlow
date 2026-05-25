"use client";

import { ErrorFallback } from "@/components/shared/ErrorFallback";

export default function AdminLoginError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return <ErrorFallback error={error} reset={reset} fullPage />;
}
