"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { ReactNode } from "react";
import { useForm } from "react-hook-form";

import {
  AtmFormData,
  atmFormSchema,
  CreateAtmPayload,
  useCreateAtmData,
  useUpdateAtmData,
} from "./atm-api";
import { AtmData } from "./types";

const supabase = createClient();

const AtmDataForm = ({
  onSuccess,
  initialData,
}: {
  onSuccess?: () => void;
  initialData?: AtmData;
}) => {
  const createMutation = useCreateAtmData();
  const updateMutation = useUpdateAtmData();
  const isEditing = !!initialData;

  const form = useForm<AtmFormData>({
    resolver: zodResolver(atmFormSchema),
    defaultValues: {
      id: initialData?.id || "",
      atm: initialData?.atm || "",
      district_extracted: initialData?.district_extracted || "",
      address_extracted: initialData?.address_extracted || "",
      image_src: initialData?.image_src || "",
      services: initialData?.services || "",
      service_1: initialData?.service_1 || "",
      service_2: initialData?.service_2 || "",
      service_3: initialData?.service_3 || "",
      service_4: initialData?.service_4 || "",
      service_5: initialData?.service_5 || "",
      latitude:
        initialData?.coordinates && initialData.coordinates.coordinates[1]
          ? initialData.coordinates.coordinates[1].toString()
          : undefined,
      longitude:
        initialData?.coordinates && initialData.coordinates.coordinates[0]
          ? initialData.coordinates.coordinates[0].toString()
          : undefined,
    },
  });

  const onSubmit = async (data: AtmFormData) => {
    try {
      const { latitude, longitude, ...formData } = data;

      if (isEditing) {
        // Update existing ATM
        const atmPayload = {
          ...formData,
          id: data.id!,
          coordinates:
            latitude && longitude
              ? {
                  coordinates: [
                    parseFloat(longitude),
                    parseFloat(latitude),
                  ] as [number, number],
                  type: "Point" as const,
                }
              : null,
        };

        await updateMutation.mutateAsync(atmPayload);
      } else {
        // Create new ATM
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
      }

      form.reset();
      onSuccess?.();
    } catch (error) {
      console.error(
        `Failed to ${isEditing ? "update" : "create"} ATM data:`,
        error
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {isEditing && (
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ID</FormLabel>
                <FormControl>
                  <Input {...field} disabled className="bg-muted" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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
                <Input placeholder="Enter image URL" type="text" {...field} />
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

        <FormField
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
        />

        <div className="space-y-2">
          <FormLabel>Individual Services</FormLabel>
          <div className="grid grid-cols-1 gap-2">
            {[1, 2, 3, 4, 5].map((num) => (
              <FormField
                key={num}
                control={form.control}
                name={`service_${num}` as keyof AtmFormData}
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
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            Reset
          </Button>
          <Button
            type="submit"
            disabled={createMutation.isPending || updateMutation.isPending}
          >
            {createMutation.isPending || updateMutation.isPending
              ? `${isEditing ? "Updating" : "Creating"}...`
              : `${isEditing ? "Update" : "Create"} ATM`}
          </Button>
        </div>

        {(createMutation.error || updateMutation.error) && (
          <p className="text-sm text-red-500">
            Failed to {isEditing ? "update" : "create"} ATM data. Please try
            again.
          </p>
        )}
      </form>
    </Form>
  );
};

const AtmDataDialog = ({
  children,
  initialData,
  open: openProp,
  defaultOpen = false,
  onOpenChange,
}: {
  children?: ReactNode;
  initialData?: AtmData;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}) => {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen,
    onChange: onOpenChange,
  });
  const isEditing = !!initialData;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEditing ? "Edit" : "Create"} ATM Data</DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the ATM record"
              : "Add a new ATM record to the database"}
            . Fields marked with * are required.
          </DialogDescription>
        </DialogHeader>

        <AtmDataForm
          initialData={initialData}
          onSuccess={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export { AtmDataDialog };
