"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import z from "zod";
import { AtmData } from "./types";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

// Zod schema for ATM data create/edit
const atmFormSchema = z.object({
  id: z.string().optional(),
  atm: z.string().min(1, "ATM name is required"),
  district_extracted: z.string().min(1, "District is required"),
  address_extracted: z.string().min(1, "Address is required"),
  image_src: z.string().optional(),
  services: z.string().optional(),
  service_1: z.string().optional(),
  service_2: z.string().optional(),
  service_3: z.string().optional(),
  service_4: z.string().optional(),
  service_5: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type AtmFormData = z.infer<typeof atmFormSchema>;

type CreateAtmPayload = Partial<
  Omit<AtmData, "id" | "coordinates"> & {
    coordinates: {
      lat: number;
      lng: number;
    } | null;
  }
>;

const createAtmData = async (atmData: CreateAtmPayload) => {
  // Extract coordinates if they exist
  const latitude =
    atmData.coordinates &&
    typeof atmData.coordinates === "object" &&
    "lat" in atmData.coordinates
      ? atmData.coordinates.lat
      : null;
  const longitude =
    atmData.coordinates &&
    typeof atmData.coordinates === "object" &&
    "lng" in atmData.coordinates
      ? atmData.coordinates.lng
      : null;

  // Use the PostgreSQL RPC function instead of direct insert
  const { data, error } = await supabase.rpc("create_atm", {
    p_atm: atmData.atm,
    p_district_extracted: atmData.district_extracted,
    p_address_extracted: atmData.address_extracted,
    p_image_src: atmData.image_src || null,
    p_services: atmData.services || null,
    p_service_1: atmData.service_1 || null,
    p_service_2: atmData.service_2 || null,
    p_service_3: atmData.service_3 || null,
    p_service_4: atmData.service_4 || null,
    p_service_5: atmData.service_5 || null,
    p_latitude: latitude,
    p_longitude: longitude,
  });

  if (error) {
    console.error("Error creating ATM data:", error);
    throw error;
  }

  return data;
};

const updateAtmData = async (atmData: AtmData) => {
  // Extract coordinates if they exist
  const latitude =
    atmData.coordinates && atmData.coordinates.coordinates[1]
      ? atmData.coordinates.coordinates[1]
      : null;

  const longitude =
    atmData.coordinates && atmData.coordinates.coordinates[0]
      ? atmData.coordinates.coordinates[0]
      : null;

  // Use the PostgreSQL RPC function instead of direct update
  const { data, error } = await supabase.rpc("update_atm", {
    p_id: atmData.id,
    p_atm: atmData.atm,
    p_district_extracted: atmData.district_extracted,
    p_address_extracted: atmData.address_extracted,
    p_image_src: atmData.image_src || null,
    p_services: atmData.services || null,
    p_service_1: atmData.service_1 || null,
    p_service_2: atmData.service_2 || null,
    p_service_3: atmData.service_3 || null,
    p_service_4: atmData.service_4 || null,
    p_service_5: atmData.service_5 || null,
    p_latitude: latitude,
    p_longitude: longitude,
  });

  if (error) {
    console.error("Error updating ATM data:", error);
    throw error;
  }

  return data;
};

const removeAtmData = async (
  id: string
): Promise<{
  success: boolean;
  message: string;
  data: AtmData | null;
}> => {
  const { data, error } = await supabase.rpc("remove_atm", {
    p_id: id,
  });

  if (error) {
    console.error("Error removing ATM data:", error);
    throw error;
  }

  return data as {
    success: boolean;
    message: string;
    data: AtmData | null;
  };
};

type PaginatedAtmData = {
  data: AtmData[];
  count: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
};

const getAtmData = async (
  page: number = 1,
  pageSize: number = 10,
  searchKeyword?: string
): Promise<PaginatedAtmData | null> => {
  // Calculate range for pagination (Supabase uses 0-based indexing)
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase.from("atm_refined").select("*", { count: "exact" });

  if (searchKeyword && searchKeyword.trim()) {
    const keyword = searchKeyword.trim();
    query = query.or(
      `atm.ilike.%${keyword}%,address_extracted.ilike.%${keyword}%`
    );
  }

  // sort by updated_at in descending order
  query = query.order("updated_at", { ascending: false });

  let { data: atmData, error, count } = await query.range(from, to);

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

const useAtmData = (pageSize: number = 10, searchKeyword?: string) => {
  return useInfiniteQuery({
    queryKey: ["atm-data", pageSize, searchKeyword],
    queryFn: ({ pageParam }) => getAtmData(pageParam, pageSize, searchKeyword),
    getNextPageParam: (lastPage) =>
      lastPage?.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
};

const useCreateAtmData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createAtmData,
    onSuccess: () => {
      // Invalidate the ATM data query to refetch
      queryClient.invalidateQueries({ queryKey: ["atm-data"] });
    },
  });
};

const useUpdateAtmData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAtmData,
    onSettled: () => {
      // Invalidate the ATM data query to refetch
      queryClient.invalidateQueries({ queryKey: ["atm-data"] });
    },
  });
};

const useRemoveAtmData = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeAtmData,
    onSettled: () => {
      // Invalidate the ATM data query to refetch
      queryClient.invalidateQueries({ queryKey: ["atm-data"] });
    },
  });
};

export type { AtmFormData, CreateAtmPayload };
export {
  atmFormSchema,
  useAtmData,
  useCreateAtmData,
  useUpdateAtmData,
  useRemoveAtmData,
};
