import { cn } from "@/lib/utils";

interface PageLoaderProps {
  className?: string;
  fullPage?: boolean;
}

export function PageLoader({ className, fullPage }: PageLoaderProps) {
  return (
    <div className={cn(
      "flex items-center justify-center",
      fullPage ? "min-h-screen" : "min-h-[50vh]",
      className
    )}>
      <div className="relative">
        <div className="w-8 h-8 border-2 border-gray-200 border-t-blue-600 rounded-full animate-spin" />
      </div>
    </div>
  );
}
