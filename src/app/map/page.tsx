import dynamic from "next/dynamic";
import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MapClient = dynamic(() => import("@/components/MapClient"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

function MapSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

export default function MapPage() {
  return (
    <div className="w-full h-[calc(100vh-6rem)] flex flex-col md:flex-row">
      <Suspense fallback={<MapSkeleton />}>
        <MapClient />
      </Suspense>
    </div>
  );
}
