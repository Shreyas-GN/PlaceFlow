import { TableSkeleton } from "@/components/shared/Skeleton";

export default function AdminApplicantsLoading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-7 w-36 rounded-md bg-zinc-900 animate-pulse" />
      <TableSkeleton rows={6} />
    </div>
  );
}
