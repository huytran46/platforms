"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix for default markers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type ATMWithCoordinates = {
  id: string;
  atm: string;
  district_extracted: string;
  latitude: number;
  longitude: number;
  services?: string;
  service_1?: string;
  service_2?: string;
  service_3?: string;
  service_4?: string;
  service_5?: string;
};

interface ATMHeatmapProps {
  atms: ATMWithCoordinates[];
  height?: string;
  intensityMode?: "uniform" | "services" | "custom";
}

export function ATMHeatmap({
  atms,
  height = "400px",
  intensityMode = "uniform",
}: ATMHeatmapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="bg-gray-100 animate-pulse rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-500">Loading heatmap...</p>
      </div>
    );
  }

  // Filter valid ATMs
  const validATMs = atms.filter(
    (atm) =>
      atm.latitude &&
      atm.longitude &&
      !isNaN(atm.latitude) &&
      !isNaN(atm.longitude)
  );

  // Calculate intensity based on mode
  const getIntensity = (atm: ATMWithCoordinates) => {
    switch (intensityMode) {
      case "services":
        return (
          [
            atm.service_1,
            atm.service_2,
            atm.service_3,
            atm.service_4,
            atm.service_5,
          ].filter((service) => service && service.trim() !== "").length / 5
        ); // Normalize to 0-1
      case "uniform":
      default:
        return 1;
    }
  };

  // Prepare heatmap data
  const heatmapPoints = validATMs.map((atm) => ({
    lat: atm.latitude,
    lng: atm.longitude,
    intensity: getIntensity(atm),
  }));

  // Calculate bounds for the map
  const latitudes = validATMs.map((atm) => atm.latitude);
  const longitudes = validATMs.map((atm) => atm.longitude);

  const bounds = {
    north: Math.max(...latitudes),
    south: Math.min(...latitudes),
    east: Math.max(...longitudes),
    west: Math.min(...longitudes),
  };

  // Center of the bounds
  const center: [number, number] = [
    (bounds.north + bounds.south) / 2,
    (bounds.east + bounds.west) / 2,
  ];

  return (
    <div style={{ height }} className="rounded-lg overflow-hidden border">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <HeatmapLayer
          points={heatmapPoints}
          longitudeExtractor={(point: any) => point.lng}
          latitudeExtractor={(point: any) => point.lat}
          intensityExtractor={(point: any) => point.intensity}
          fitBoundsOnLoad={true}
          fitBoundsOnUpdate={true}
          radius={30}
          blur={20}
          max={2.0}
          opacity={0.8}
          gradient={{
            0.2: "blue",
            0.4: "cyan",
            0.6: "lime",
            0.8: "yellow",
            1.0: "red",
          }}
        />

        {/* Legend */}
        <div className="leaflet-bottom leaflet-right">
          <div className="bg-white p-3 m-2 rounded shadow-md">
            <h4 className="font-semibold text-sm mb-2">ATM Density</h4>
            <div className="space-y-1">
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded mr-2"></div>
                <span>Low</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-yellow-500 rounded mr-2"></div>
                <span>Medium</span>
              </div>
              <div className="flex items-center text-xs">
                <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                <span>High</span>
              </div>
            </div>
            {intensityMode === "services" && (
              <p className="text-xs text-gray-500 mt-2">
                Intensity based on service count
              </p>
            )}
          </div>
        </div>
      </MapContainer>
    </div>
  );
}
