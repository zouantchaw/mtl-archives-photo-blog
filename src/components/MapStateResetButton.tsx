"use client";

import { useCallback } from "react";
import SwitcherItem from "@/components/SwitcherItem";
import { RotateCcw } from "lucide-react";
import { useQueryStates, parseAsFloat, parseAsInteger } from "nuqs";

export function MapStateResetButton() {
  const [, setMapState] = useQueryStates(
    {
      lat: parseAsFloat,
      lng: parseAsFloat,
      zoom: parseAsInteger,
      activeMarker: parseAsInteger,
    },
    { history: "push" }
  );

  const handleReset = useCallback(() => {
    setMapState({
      lat: null,
      lng: null,
      zoom: null,
      activeMarker: null,
    });
  }, [setMapState]);

  return (
    <SwitcherItem
      icon={
        <div className="p-2 hover:bg-gray-100 rounded-md transition-colors">
          <RotateCcw size={20} className="text-gray-600" />
        </div>
      }
      onClick={handleReset}
      noPadding
    />
  );
}