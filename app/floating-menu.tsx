"use client";

import { Button } from "@/components/ui/button";
import { LocateIcon } from "lucide-react";

const FloatingMenu = () => {
  return (
    <div className="absolute right-5 bottom-10 shadow-lg z-[1000]">
      <Button
        variant="default"
        size="icon"
        className="size-8 cursor-pointer"
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
  );
};

export { FloatingMenu };
