"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  error: Error & { digest?: string };
  reset: () => void;
  fullPage?: boolean;
}

export function ErrorFallback({ error, reset, fullPage }: ErrorFallbackProps) {
  return (
    <div className={`flex items-center justify-center ${fullPage ? "min-h-screen" : "min-h-[50vh]"}`}>
      <div className="text-center max-w-md px-6">
        <div className="w-16 h-16 bg-red-50 rounded-xl flex items-center justify-center mx-auto mb-5 border border-red-200">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Something went wrong</h2>
        <p className="text-gray-500 text-sm mb-6 leading-relaxed">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>
        <button
          onClick={reset}
          className="inline-flex items-center gap-2 h-10 px-5 rounded-[10px] bg-blue-600 text-white font-medium text-sm hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
