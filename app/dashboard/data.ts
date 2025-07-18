import "server-only";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import { cache } from "react";
import { AtmData } from "./database/types";

const DATABASES = {
  ATM: "atm_refined",
};

export type PaginatedAtmData = {
  data: AtmData[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

export const getAtmData = async (
  supabase: ReturnType<typeof createClient>,
  page: number = 1,
  pageSize: number = 10
): Promise<PaginatedAtmData | null> => {
  // const cookieStore = await cookies();
  // const supabase = createClient(cookieStore);

  // Calculate range for pagination (Supabase uses 0-based indexing)
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  // Get data with count
  let {
    data: atmData,
    error,
    count,
  } = await supabase
    .from(DATABASES["ATM"])
    .select("*", { count: "exact" })
    .range(from, to);

  if (error) {
    console.error("Error fetching ATM data:", error);
    return null;
  }

  if (!atmData || count === null) {
    return null;
  }

  const totalPages = Math.ceil(count / pageSize);

  return {
    data: atmData,
    count,
    page,
    pageSize,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

export type AtmByDistrict = {
  district_extracted: string;
  count: number;
};

export const getAtmByDistrict = async (): Promise<AtmByDistrict[] | null> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  let { data: atmData, error } = await supabase.rpc("get_atm_by_district");
  return atmData;
};

export const getAtmsWithCoordinates = cache(async () => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("get_atm_coordinates");
  return { data, error } as {
    data: Array<
      Pick<
        AtmData,
        | "id"
        | "atm"
        | "district_extracted"
        | "address_extracted"
        | "coordinates"
      > & { latitude: number; longitude: number }
    >;
    error: any;
  };
});
