"use client";

import { PropsWithChildren, useState } from "react";
import { ATMMap } from "./atm-map";
import { useQuery } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";

// Type for ATM data returned from the RPC function
type ATMWithCoordinates = {
  id: string;
  atm: string;
  district_extracted: string;
  address_extracted: string;
  latitude: number;
  longitude: number;
  image_src?: string;
  services?: string;
  service_1?: string;
  service_2?: string;
  service_3?: string;
  service_4?: string;
  service_5?: string;
  distance_meters?: number; // Added when filtering by location
};

const supabase = createClient();

const getAtms = async (filterByLocation?: {
  latitude: number;
  longitude: number;
} | null): Promise<ATMWithCoordinates[]> => {
  const { data: response, error } = await supabase.rpc("get_nearby_atms", {
    nearby_location: filterByLocation,
  });

  if (error) {
    console.error(error);
    throw error;
  }
  return response?.data ?? [];
};

const AtmMapClient = ({ children, filterByLocation }: PropsWithChildren<{
  filterByLocation?: {
    latitude: number;
    longitude: number;
  } | null;
}>) => {
  const { data: atms, isLoading } = useQuery({
    queryKey: ["atms", "main-page", filterByLocation],
    queryFn: () => getAtms(filterByLocation),
  });

  if (isLoading) return null;

  const validATMs = (atms || []).filter(
    (atm: ATMWithCoordinates) =>
      atm.latitude &&
      atm.longitude &&
      !isNaN(atm.latitude) &&
      !isNaN(atm.longitude)
  );

  return (
    <ATMMap height="100%" atms={validATMs}>
      {children}
    </ATMMap>
  );
};

export { AtmMapClient };
