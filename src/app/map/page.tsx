import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { getPhotosCached, getPhotosCountCached } from '@/photo/cache';
import { PaginationParams, getPaginationForSearchParams } from '@/site/pagination';

const MapClient = dynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => <MapSkeleton />
});

function MapSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <Skeleton className="w-full h-full" />
    </div>
  );
}

export default async function MapPage({ searchParams }: PaginationParams) {
  const { offset, limit } = getPaginationForSearchParams(searchParams, 12);
  const [
    photos,
    count,
  ] = await Promise.all([
    // Make homepage queries resilient to error on first time setup
    getPhotosCached({ limit }).catch(() => []),
    getPhotosCountCached().catch(() => 0),
  ]);
  return (
    <div className="w-full h-[calc(100vh-6rem)] flex flex-col md:flex-row">
      <Suspense fallback={<MapSkeleton />}>
        <MapClient />
      </Suspense>
    </div>
  );
}