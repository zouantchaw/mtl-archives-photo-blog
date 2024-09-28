import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { getPhotos } from '@/services/vercel-postgres';
import { Photo } from '@/photo';

const MapClient = dynamic(() => import('@/components/MapClient'), {
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

export default async function MapPage() {
  const photos = await getPhotos({
    limit: 100,
    includeHidden: false,
    includeLocation: true,
  });

  return (
    <div className="w-full h-[calc(100vh-6rem)] flex flex-col md:flex-row">
      <Suspense fallback={<MapSkeleton />}>
        <MapClient photos={photos} />
      </Suspense>
    </div>
  );
}