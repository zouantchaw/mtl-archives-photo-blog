import { Skeleton } from "@/components/ui/skeleton";

export function UploadsSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-40" />
        <div className="flex space-x-2">
          <Skeleton className="h-10 w-[180px]" />
          <Skeleton className="h-10 w-[180px]" />
        </div>
      </div>

      {/* Table header skeleton */}
      <div className="grid grid-cols-3 gap-4 py-2 border-b">
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
        <Skeleton className="h-6 w-full" />
      </div>

      {/* Table rows skeleton */}
      {[...Array(5)].map((_, index) => (
        <div key={index} className="grid grid-cols-3 gap-4 py-4 border-b">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-6 w-1/2" />
        </div>
      ))}

      {/* Pagination skeleton */}
      <div className="flex justify-center mt-6">
        <Skeleton className="h-10 w-64" />
      </div>
    </div>
  );
}
