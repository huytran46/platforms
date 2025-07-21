"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { LocateIcon } from "lucide-react";

interface FloatingMenuProps {
  filterByLocation: {
    latitude: number;
    longitude: number;
  } | null;
  onFilterByLocation: (
    location: {
      latitude: number;
      longitude: number;
    } | null
  ) => void;
}

const FloatingMenu = ({
  filterByLocation,
  onFilterByLocation,
}: FloatingMenuProps) => {
  return (
    <div className="absolute right-5 bottom-10 z-[1000]">
      <div className="flex items-center gap-2">
        <Button
          variant="default"
          className={cn(
            "cursor-pointer bg-primary/60 hover:bg-primary shadow-lg",
            filterByLocation ? "bg-primary" : ""
          )}
          onClick={() => {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  onFilterByLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                  });
                },
                (err) => {
                  console.error("geolocation is not available", err);
                },
                {
                  enableHighAccuracy: true,
                  timeout: 5000,
                  maximumAge: 0,
                }
              );
            } else {
              console.error("geolocation is not available");
            }
          }}
        >
          <span className="text-xs">10 trụ ATM gần nhất</span>
        </Button>

        <Button
          variant="default"
          size="icon"
          className="cursor-pointer bg-primary/60 hover:bg-primary shadow-lg"
          onClick={() => {
            if ("geolocation" in navigator) {
              navigator.geolocation.getCurrentPosition(
                (position) => {
                  console.log(
                    position.coords.latitude,
                    position.coords.longitude
                  );
                },
                undefined,
                {
                  enableHighAccuracy: true,
                  timeout: 5000,
                  maximumAge: 0,
                }
              );
            } else {
              console.error("geolocation is not available");
            }
          }}
        >
          <LocateIcon />
        </Button>
      </div>
    </div>
  );
};

export { FloatingMenu };
