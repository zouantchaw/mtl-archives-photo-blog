import dynamic from 'next/dynamic';

const MapClient = dynamic(() => import('@/components/MapClient'), {
  ssr: false,
  loading: () => <p>Loading map...</p>
});

export default function MapPage() {
  return (
    <div className="w-full h-screen">
      <MapClient />
    </div>
  );
}
