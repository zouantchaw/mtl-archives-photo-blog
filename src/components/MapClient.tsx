"use client";

import { useCallback } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useQueryStates, parseAsFloat, parseAsInteger } from "nuqs";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "/images/marker-icon-2x.png",
  iconUrl: "/images/marker-icon.png",
  shadowUrl: "/images/marker-shadow.png",
});

interface Site {
  name: string;
  position: [number, number];
  description: string;
}

const montrealSites: Site[] = [
  {
    name: "Mount Royal",
    position: [45.5048, -73.5874],
    description: "Iconic hill in the heart of Montreal",
  },
  {
    name: "Old Montreal",
    position: [45.5079, -73.554],
    description: "Historic neighborhood with cobblestone streets",
  },
  {
    name: "Notre-Dame Basilica",
    position: [45.5046, -73.5566],
    description: "Gothic Revival church with stunning interiors",
  },
  {
    name: "Jean-Talon Market",
    position: [45.5364, -73.6157],
    description: "Vibrant open-air market",
  },
  {
    name: "Montreal Botanical Garden",
    position: [45.5592, -73.5628],
    description: "Extensive gardens and greenhouses",
  },
  {
    name: "Olympic Stadium",
    position: [45.5579, -73.5515],
    description: "Iconic stadium from the 1976 Olympics",
  },
  {
    name: "Parc La Fontaine",
    position: [45.5225, -73.5695],
    description: "Beautiful urban park with a lake",
  },
  {
    name: "St. Joseph's Oratory",
    position: [45.4922, -73.6177],
    description: "Majestic basilica on Mount Royal",
  },
  {
    name: "Plateau Mont-Royal",
    position: [45.5227, -73.5816],
    description: "Trendy neighborhood with colorful houses",
  },
  {
    name: "Montreal Museum of Fine Arts",
    position: [45.4986, -73.5795],
    description: "Renowned art museum",
  },
  {
    name: "YUL Airport",
    position: [45.4707, -73.7407],
    description: "Montreal-Pierre Elliott Trudeau International Airport",
  },
];

function ChangeView({
  center,
  zoom,
}: {
  center: L.LatLngExpression;
  zoom: number;
}) {
  const map = useMap();
  map.setView(center, zoom);
  return null;
}

const MapClient = () => {
  const [{ lat, lng, zoom, activeMarker }, setMapState] = useQueryStates(
    {
      lat: parseAsFloat.withDefault(45.5017),
      lng: parseAsFloat.withDefault(-73.5673),
      zoom: parseAsInteger.withDefault(11),
      activeMarker: parseAsInteger.withDefault(-1),
    },
    { history: "push" }
  );

  const handleSiteClick = useCallback(
    (index: number) => {
      const [newLat, newLng] = montrealSites[index].position;
      setMapState({
        lat: newLat,
        lng: newLng,
        zoom: 14,
        activeMarker: index,
      });
    },
    [setMapState]
  );

  return (
    <>
      <div className="w-full md:w-1/3 h-48 md:h-full overflow-y-auto p-4 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Montreal Sites
        </h2>
        <ul>
          {montrealSites.map((site, index) => (
            <li
              key={index}
              className={`mb-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded ${
                index === activeMarker ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
              onClick={() => handleSiteClick(index)}
            >
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {site.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {site.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-2/3 h-[calc(100vh-6rem-12rem)] md:h-full">
        <MapContainer center={[lat, lng]} zoom={zoom} className="w-full h-full">
          <ChangeView center={[lat, lng]} zoom={zoom} />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {montrealSites.map((site, index) => (
            <Marker
              key={index}
              position={site.position}
              eventHandlers={{
                click: () => handleSiteClick(index),
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
      </div>
    </>
  );
};

export default MapClient;
