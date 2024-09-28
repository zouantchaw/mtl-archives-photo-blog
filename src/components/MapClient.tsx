"use client";

import { useCallback, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useQueryStates, parseAsFloat, parseAsInteger } from "nuqs";
import { Photo } from "@/photo";

interface MapClientProps {
  photos: Photo[];
}

const MapClient = ({ photos }: MapClientProps) => {
  const [{ lat, lng, zoom, activeMarker }, setMapState] = useQueryStates(
    {
      lat: parseAsFloat.withDefault(45.5017),
      lng: parseAsFloat.withDefault(-73.5673),
      zoom: parseAsInteger.withDefault(11),
      activeMarker: parseAsInteger.withDefault(-1),
    },
    { history: "push" }
  );

  const handlePhotoClick = useCallback(
    (index: number) => {
      const photo = photos[index];
      if (photo.latitude && photo.longitude) {
        setMapState({
          lat: photo.latitude,
          lng: photo.longitude,
          zoom: 14,
          activeMarker: index,
        });
      }
    },
    [photos, setMapState]
  );

  const MapUpdater = () => {
    const map = useMap();

    useEffect(() => {
      map.setView([lat, lng], zoom);
    }, [lat, lng, zoom, map]);

    return null;
  };

  return (
    <>
      <div className="w-full md:w-1/3 h-48 md:h-full overflow-y-auto p-4 bg-white dark:bg-gray-800">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">
          Photos
        </h2>
        <ul>
          {photos.map((photo, index) => (
            <li
              key={photo.id}
              className={`mb-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded ${
                index === activeMarker ? "bg-blue-100 dark:bg-blue-900" : ""
              }`}
              onClick={() => handlePhotoClick(index)}
            >
              <h3 className="font-semibold text-gray-800 dark:text-white">
                {photo.title || "Untitled"}
              </h3>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full md:w-2/3 h-[calc(100vh-6rem-12rem)] md:h-full">
        <MapContainer center={[lat, lng]} zoom={zoom} className="w-full h-full">
          <MapUpdater />
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          {photos.map((photo, index) => {
            if (photo.latitude && photo.longitude) {
              return (
                <Marker
                  key={photo.id}
                  position={[photo.latitude, photo.longitude]}
                  eventHandlers={{
                    click: () => handlePhotoClick(index),
                  }}
                >
                  <Popup>
                    <div className="text-sm max-w-xs">
                      <h3 className="font-bold mb-1">
                        {photo.title || "Untitled"}
                      </h3>
                      <div className="w-full h-32 relative">
                        <img
                          src={photo.url}
                          alt={photo.title || "Untitled"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </Popup>
                </Marker>
              );
            }
            return null;
          })}
        </MapContainer>
      </div>
    </>
  );
};

export default MapClient;
