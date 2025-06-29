"use server";

import { createClient } from "@/lib/supabase/server";

import { cookies } from "next/headers";

const token = process.env.MAPBOX_ACCESS_TOKEN;
const ENV = process.env.NODE_ENV;

async function geocodeMapbox(address: string) {
  if (!token) throw new Error("MAPBOX_ACCESS_TOKEN is not set");

  if (ENV === "production")
    throw new Error("Geocoding is only allowed in development mode");

  try {
    const params = new URLSearchParams({
      access_token: token!,
      country: "VN",
      place: "Ho Chi Minh City",
      q: address,
    });

    const response = await fetch(
      `https://api.mapbox.com/search/geocode/v6/forward?${params}`
    );

    const data = (await response.json()) as {
      features: Array<{
        type: string;
        id: string;
        geometry: { type: "Point"; coordinates: [number, number] };
        properties: {
          place_formatted: string;
        };
      }>;
    };

    const feature = data.features?.[0];

    return feature
      ? {
          lat: feature.geometry.coordinates[1],
          lng: feature.geometry.coordinates[0],
          place_name: feature.properties.place_formatted,
        }
      : null;
  } catch (error) {
    console.error("MapBox geocoding error:", error);
    return null;
  }
}

export async function batchGeocodeATMs() {
  const cookieStore = await cookies();

  const supabase = createClient(cookieStore);

  const { data: atms, error } = await supabase
    .from("atm_refined")
    .select("id, address_extracted")
    .is("coordinates", null);

  if (error || !atms) {
    console.error("Error fetching ATMs:", error);
    return;
  }

  console.log(`Processing ${atms.length} ATMs...`);
  let count = 0;
  for (let i = 0; i < atms.length; i++) {
    const atm = atms[i];

    const result = await geocodeMapbox(atm.address_extracted);

    if (result) {
      await supabase.rpc("update_atm_coordinates", {
        atm_id: atm.id,
        latitude: result.lat,
        longitude: result.lng,
      });

      console.log(`Progress: ${count}/${atms.length}`);

      count++;
    }

    // Wait for 1 second between requests, rate-limit MapBox: allows ~600 requests/minute
    await new Promise((resolve) => setTimeout(resolve, 200));
  }
}
