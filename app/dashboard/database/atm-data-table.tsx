"use client";

import { DataTable } from "@/components/data-table";
import { AtmData } from "../data";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const supabase = createClient();

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
  pageSize: number = 10
): Promise<PaginatedAtmData | null> => {
  // Calculate range for pagination (Supabase uses 0-based indexing)
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let {
    data: atmData,
    error,
    count,
  } = await supabase
    .from("atm_refined")
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

const useAtmData = (pageSize: number = 10) => {
  return useInfiniteQuery({
    queryKey: ["atm-data", pageSize],
    queryFn: ({ pageParam }) => getAtmData(pageParam, pageSize),
    getNextPageParam: (lastPage) =>
      lastPage?.hasNextPage ? lastPage.page + 1 : undefined,
    initialPageParam: 1,
  });
};

// Zod schema for ATM data creation
const createAtmSchema = z.object({
  atm: z.string().min(1, "ATM name is required"),
  district_extracted: z.string().min(1, "District is required"),
  address_extracted: z.string().min(1, "Address is required"),
  image_src: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  services: z.string().optional(),
  service_1: z.string().optional(),
  service_2: z.string().optional(),
  service_3: z.string().optional(),
  service_4: z.string().optional(),
  service_5: z.string().optional(),
  latitude: z.string().optional(),
  longitude: z.string().optional(),
});

type CreateAtmFormData = z.infer<typeof createAtmSchema>;

type CreateAtmPayload = Partial<Omit<AtmData, "id">>;

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

const CreateAtmDataForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const createMutation = useCreateAtmData();

  const form = useForm<CreateAtmFormData>({
    resolver: zodResolver(createAtmSchema),
    defaultValues: {
      atm: "",
      district_extracted: "",
      address_extracted: "",
      image_src: "",
      services: "",
      service_1: "",
      service_2: "",
      service_3: "",
      service_4: "",
      service_5: "",
      latitude: "",
      longitude: "",
    },
  });

  const onSubmit = async (data: CreateAtmFormData) => {
    try {
      // Transform form data to match ATM data structure
      const { latitude, longitude, ...formData } = data;

      const atmPayload: CreateAtmPayload = {
        ...formData,
        coordinates:
          latitude && longitude
            ? {
                lat: parseFloat(latitude),
                lng: parseFloat(longitude),
              }
            : null,
      };

      await createMutation.mutateAsync(atmPayload);
      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error("Failed to create ATM data:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="atm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ATM Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter ATM name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="district_extracted"
            render={({ field }) => (
              <FormItem>
                <FormLabel>District *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter district" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address_extracted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address *</FormLabel>
              <FormControl>
                <Input placeholder="Enter full address" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="image_src"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL</FormLabel>
              <FormControl>
                <Input placeholder="Enter image URL" type="url" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="latitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitude</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter latitude"
                    type="number"
                    step="any"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="longitude"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitude</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter longitude"
                    type="number"
                    step="any"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* <FormField
          control={form.control}
          name="services"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Services</FormLabel>
              <FormControl>
                <Input placeholder="Enter services description" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        /> */}

        <div className="space-y-2">
          <FormLabel>Individual Services</FormLabel>
          <div className="grid grid-cols-1 gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <FormField
                key={num}
                control={form.control}
                name={`service_${num}` as keyof CreateAtmFormData}
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input placeholder={`Service ${num}`} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => form.reset()}
            disabled={createMutation.isPending}
          >
            Reset
          </Button>
          <Button type="submit" disabled={createMutation.isPending}>
            {createMutation.isPending ? "Creating..." : "Create ATM"}
          </Button>
        </div>

        {createMutation.error && (
          <p className="text-sm text-red-500">
            Failed to create ATM data. Please try again.
          </p>
        )}
      </form>
    </Form>
  );
};

const CreateAtmDataDialog = ({ children }: { children?: ReactNode }) => {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create ATM Data</DialogTitle>
          <DialogDescription>
            Add a new ATM record to the database. Fields marked with * are
            required.
          </DialogDescription>
        </DialogHeader>

        <CreateAtmDataForm onSuccess={() => setOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};

const AtmDataTable = () => {
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, fetchNextPage, fetchPreviousPage, isFetching, isLoading } =
    useAtmData(pagination.pageSize);

  const currentPageIndex = pagination.pageIndex;
  const currentPageData =
    data?.pages[pagination.pageIndex]?.data ??
    data?.pages[pagination.pageIndex - 1]?.data ??
    [];

  const totalPages = data?.pages[0]?.totalPages || 0;

  if (isLoading) {
    return (
      <div className="p-4 flex flex-col gap-4">
        <Skeleton className="h-[40px] w-full rounded-lg" />
        <Skeleton className="h-[400px] w-full rounded-lg" />
      </div>
    );
  }

  return (
    <div className={cn("relative flex flex-col", isFetching && "opacity-50")}>
      <DataTable
        stickyHeaderContent={
          <div className="flex flex-1 items-center gap-2">
            <CreateAtmDataDialog>
              <Button size="sm">
                <PlusIcon className="size-4" />
                Create
              </Button>
            </CreateAtmDataDialog>
          </div>
        }
        totalPages={totalPages}
        currentPageIndex={currentPageIndex}
        data={currentPageData}
        hasNextPage={currentPageData?.length >= pagination.pageSize}
        hasPreviousPage={pagination.pageIndex > 1}
        pageSize={pagination.pageSize}
        onPageSizeChange={(pageSize) => {
          setPagination({
            pageIndex: 0,
            pageSize,
          });
        }}
        onFirstPage={() => {
          setPagination((prev) => ({
            ...prev,
            pageIndex: 0,
          }));
        }}
        onLastPage={() => {
          setPagination((prev) => ({
            ...prev,
            pageIndex: totalPages - 1,
          }));
        }}
        onPreviousPage={() => {
          fetchPreviousPage();
          setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex - 1,
          }));
        }}
        onNextPage={() => {
          fetchNextPage();
          setPagination((prev) => ({
            ...prev,
            pageIndex: prev.pageIndex + 1,
          }));
        }}
      />
    </div>
  );
};

export { AtmDataTable };
