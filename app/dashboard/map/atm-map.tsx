"use client";

import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";
import { HeatmapLayer } from "react-leaflet-heatmap-layer-v3";

// Fix for default markers in react-leaflet
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
  address_extracted: string;
  latitude: number;
  longitude: number;
  // coordinates_text: string;
  services?: string;
  service_1?: string;
  service_2?: string;
  service_3?: string;
  service_4?: string;
  service_5?: string;
};

interface ATMMapProps {
  atms: ATMWithCoordinates[];
  showHeatmap?: boolean;
  height?: string;
}

export function ATMMap({
  atms,
  showHeatmap = false,
  height = "100%",
}: ATMMapProps) {
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
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Filter ATMs with valid coordinates
  const validATMs = atms.filter(
    (atm) =>
      atm.latitude &&
      atm.longitude &&
      !isNaN(atm.latitude) &&
      !isNaN(atm.longitude)
  );

  // Default center (Ho Chi Minh City)
  const center: [number, number] = [10.8231, 106.6297];

  // Prepare heatmap data
  const heatmapPoints = validATMs.map((atm) => ({
    lat: atm.latitude,
    lng: atm.longitude,
    intensity: 1, // Could be based on number of services
  }));

  // const countServices = (atm: ATMWithCoordinates) => {
  //   return [
  //     atm.service_1,
  //     atm.service_2,
  //     atm.service_3,
  //     atm.service_4,
  //     atm.service_5,
  //   ].filter((service) => service && service.trim() !== "").length;
  // };

  return (
    <div style={{ height }} className="overflow-hidden border">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <LayersControl position="topright">
          {/* Base Layer */}
          <LayersControl.BaseLayer checked name="OpenStreetMap">
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
          </LayersControl.BaseLayer>

          {/* MapBox Satellite (if you want to add it) */}
          <LayersControl.BaseLayer name="Satellite">
            <TileLayer
              attribution='&copy; <a href="https://www.mapbox.com/">Mapbox</a>'
              url="https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/{z}/{x}/{y}?access_token={process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}"
            />
          </LayersControl.BaseLayer>

          {/* ATM Markers Layer */}
          <LayersControl.Overlay checked name="ATM Locations">
            <>
              {validATMs.map((atm) => {
                const services = [
                  atm.service_1,
                  atm.service_2,
                  atm.service_3,
                  atm.service_4,
                  atm.service_5,
                ].filter((service) => service && service.trim() !== "");

                return (
                  <Marker key={atm.id} position={[atm.latitude, atm.longitude]}>
                    <Popup>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-lg mb-2">{atm.atm}</h3>

                        <div className="flex items-baseline space-x-2">
                          {/* <span
                            style={{ textDecoration: "none" }}
                            className="text-lg"
                          >
                            🛵
                          </span> */}
                          <span className="text-sm text-gray-500">
                            {atm.address_extracted}
                          </span>
                        </div>

                        {services.length > 0 && (
                          <div className="space-y-1">
                            <p className="text-sm font-medium">Dịch vụ:</p>
                            <div className="flex flex-wrap gap-1">
                              {services.map((service, idx) => (
                                <span
                                  key={idx}
                                  className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                >
                                  {service?.trim()}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex items-baseline mt-5">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="cursor-pointer w-full"
                            onClick={() => {
                              window.open(
                                `https://www.google.com/maps/dir/?api=1&destination=${atm.latitude},${atm.longitude}`,
                                "_blank",
                                "width=800,height=600"
                              );
                            }}
                          >
                            <span
                              style={{ textDecoration: "none" }}
                              className="text-lg"
                            >
                              🛵
                            </span>
                            <span>Dẫn đường</span>
                          </Button>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                );
              })}
            </>
          </LayersControl.Overlay>

          {/* Heatmap Layer */}
          {showHeatmap && (
            <LayersControl.Overlay name="ATM Density Heatmap">
              <HeatmapLayer
                points={heatmapPoints}
                longitudeExtractor={(point: any) => point.lng}
                latitudeExtractor={(point: any) => point.lat}
                intensityExtractor={(point: any) => point.intensity}
                fitBoundsOnLoad={false}
                fitBoundsOnUpdate={false}
                radius={25}
                blur={15}
                max={3.0}
                gradient={{
                  0.4: "blue",
                  0.6: "cyan",
                  0.7: "lime",
                  0.8: "yellow",
                  1.0: "red",
                }}
              />
            </LayersControl.Overlay>
          )}
        </LayersControl>

        {/* Map Statistics */}
        <div className="leaflet-bottom leaflet-left">
          <div className="bg-white p-3 m-2 rounded shadow-md">
            <h4 className="font-semibold text-sm mb-1">Statistics</h4>
            <p className="text-xs text-gray-600">
              Total ATMs:{" "}
              <span className="font-medium">{validATMs.length}</span>
            </p>
            <p className="text-xs text-gray-600">
              Districts:{" "}
              <span className="font-medium">
                {
                  new Set(validATMs.map((atm) => atm.district_extracted.trim()))
                    .size
                }
              </span>
            </p>
          </div>
        </div>
      </MapContainer>
    </div>
  );
}
