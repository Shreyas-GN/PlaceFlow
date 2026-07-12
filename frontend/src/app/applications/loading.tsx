import { TableSkeleton } from "@/components/shared/Skeleton";

export default function ApplicationsLoading() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-44 rounded-md bg-gray-200 animate-pulse" />
      <TableSkeleton rows={6} />
    </div>
  );
}
