"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

import { FloatingMenu } from "./floating-menu";

const CONFIG = {
  ssr: false,
  loading: () => (
    <div className="w-screen h-screen flex items-center justify-center bg-gray-100">
      <p className="text-gray-500">Loading map...</p>
    </div>
  ),
};

const AtmMapClient = dynamic(
  () =>
    import("./dashboard/map/atm-map.client").then((mod) => ({
      default: mod.AtmMapClient,
    })),
  { ...CONFIG }
);

const MyLocationLayer = dynamic(
  () =>
    import("./dashboard/map/atm-map").then((mod) => ({
      default: mod.MyLocationLayer,
    })),
  { ...CONFIG }
);

export default function HomePage() {
  const [filterByLocation, setFilterByLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  return (
    <div className="flex min-h-screen flex-col items-center relative">
      <div className="w-screen h-screen z-10">
        <AtmMapClient filterByLocation={filterByLocation}>
          {/* <MyLocationLayer /> */}
        </AtmMapClient>
      </div>
      <FloatingMenu
        filterByLocation={filterByLocation}
        onFilterByLocation={setFilterByLocation}
      />
    </div>
  );
}
