import "server-only";

import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";

const DATABASES = {
  ATM: "atm_refined",
};

export type AtmData = {
  id: string;
  atm: string;
  district_extracted: string;
  address_extracted: string;
  image_src: string;
  services: string;
  service_1: string;
  service_2: string;
  service_3: string;
  service_4: string;
  service_5: string;
  coordinates:
    | null
    | {
        lat: number;
        lng: number;
      }
    | [number, number];
};

export const getAtmData = async (): Promise<AtmData[] | null> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  let { data: atmData, error } = await supabase
    .from(DATABASES["ATM"])
    .select("*")
    .range(0, 9);
  return atmData;
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
