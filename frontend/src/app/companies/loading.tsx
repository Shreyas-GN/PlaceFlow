import { CompanyCardSkeleton } from "@/components/shared/Skeleton";

export default function CompaniesLoading() {
  return (
    <div className="space-y-6">
      <div className="h-7 w-44 rounded-md bg-gray-200 animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <CompanyCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
