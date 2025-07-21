"use client";
import { useState } from "react";

import { AtmMapClient } from "./dashboard/map/atm-map.client";
import { MyLocationLayer } from "./dashboard/map/atm-map";
import { FloatingMenu } from "./floating-menu";

export const MainAtmMap = () => {
  const [filterByLocation, setFilterByLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  return (
    <>
      <div className="w-screen h-screen z-10">
        <AtmMapClient filterByLocation={filterByLocation}>
          <MyLocationLayer />
        </AtmMapClient>
      </div>
      <FloatingMenu
        filterByLocation={filterByLocation}
        onFilterByLocation={setFilterByLocation}
      />
    </>
  );
};
