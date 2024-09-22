'use client';

import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: '/images/marker-icon-2x.png',
  iconUrl: '/images/marker-icon.png',
  shadowUrl: '/images/marker-shadow.png',
});

interface Site {
  name: string;
  position: [number, number];
  description: string;
}

const montrealSites: Site[] = [
  { name: "Mount Royal", position: [45.5048, -73.5874], description: "Iconic hill in the heart of Montreal" },
  { name: "Old Montreal", position: [45.5079, -73.5540], description: "Historic neighborhood with cobblestone streets" },
  { name: "Notre-Dame Basilica", position: [45.5046, -73.5566], description: "Gothic Revival church with stunning interiors" },
  { name: "Jean-Talon Market", position: [45.5364, -73.6157], description: "Vibrant open-air market" },
  { name: "Montreal Botanical Garden", position: [45.5592, -73.5628], description: "Extensive gardens and greenhouses" },
  { name: "Olympic Stadium", position: [45.5579, -73.5515], description: "Iconic stadium from the 1976 Olympics" },
  { name: "Parc La Fontaine", position: [45.5225, -73.5695], description: "Beautiful urban park with a lake" },
  { name: "St. Joseph's Oratory", position: [45.4922, -73.6177], description: "Majestic basilica on Mount Royal" },
  { name: "Plateau Mont-Royal", position: [45.5227, -73.5816], description: "Trendy neighborhood with colorful houses" },
  { name: "Montreal Museum of Fine Arts", position: [45.4986, -73.5795], description: "Renowned art museum" },
  { name: "YUL Airport", position: [45.4707, -73.7407], description: "Montreal-Pierre Elliott Trudeau International Airport" },
];

const MapClient = () => {
  const [activeMarker, setActiveMarker] = useState<number | null>(null);

  return (
    <MapContainer
      center={[45.5017, -73.5673]}
      zoom={11}
      className="w-full h-full rounded-lg"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {montrealSites.map((site, index) => (
        <Marker
          key={index}
          position={site.position}
          eventHandlers={{
            click: () => setActiveMarker(index),
          }}
        >
          <Popup>
            <div className="text-sm">
              <h3 className="font-bold mb-1">{site.name}</h3>
              <p>{site.description}</p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapClient;