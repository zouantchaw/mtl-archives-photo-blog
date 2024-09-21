'use client';

import { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function MapClient() {
  const mapRef = useRef<L.Map | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!mapRef.current) {
        mapRef.current = L.map('map').setView([0, 0], 2);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(mapRef.current);
      }

      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;
            setUserLocation([latitude, longitude]);
            setAccuracy(accuracy);

            if (mapRef.current) {
              mapRef.current.setView([latitude, longitude], 18);
              
              L.marker([latitude, longitude]).addTo(mapRef.current)
                .bindPopup('You are here')
                .openPopup();

              L.circle([latitude, longitude], {
                color: 'blue',
                fillColor: '#3388ff',
                fillOpacity: 0.2,
                radius: accuracy
              }).addTo(mapRef.current);
            }
          },
          (error) => {
            console.error('Error getting location:', error);
          },
          {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0
          }
        );
      }
    }

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  return (
    <div id="map" className="w-full h-screen">
      {!userLocation && (
        <div className="absolute top-0 left-0 right-0 z-[1000] bg-yellow-100 p-2 text-center">
          Locating you... This may take a moment for higher accuracy.
        </div>
      )}
      {userLocation && accuracy && (
        <div className="absolute bottom-0 left-0 right-0 z-[1000] bg-white p-2 text-center">
          Location accuracy: {accuracy.toFixed(2)} meters
        </div>
      )}
    </div>
  );
}