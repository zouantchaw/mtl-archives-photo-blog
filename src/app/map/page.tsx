import dynamic from 'next/dynamic';
import { Suspense } from 'react';

const MapClient = dynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function MapPage() {
  return (
    <div className="w-full h-screen">
      <Suspense fallback={<p>Loading map...</p>}>
        <MapClient />
      </Suspense>
    </div>
  );
}