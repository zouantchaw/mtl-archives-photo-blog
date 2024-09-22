import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MapClient = dynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function MapPage() {
  return (
    <div className="w-full h-[calc(100vh-6rem)]">
      <Suspense fallback={<p className="text-center py-4">Loading map...</p>}>
        <MapClient />
      </Suspense>
    </div>
  );
}