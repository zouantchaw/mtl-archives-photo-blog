import dynamic from 'next/dynamic';
import { getPhotos } from '@/services/vercel-postgres';
import { Skeleton } from '@/components/ui/skeleton';
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
      <MapClient photos={photos} />
    </div>
  );
}