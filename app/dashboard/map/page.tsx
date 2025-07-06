import { SiteHeader } from "@/components/site-header";
import { SiteMain } from "@/components/site-main";
import { SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { AtmHeatmapServer } from "./atm-heatmap.server";
import { AtmMapServer } from "./atm-map.server";

export default async function MapPage() {
  return (
    <SidebarInset>
      <SiteHeader>
        <h1 className="text-base font-medium">Bản đồ ATM</h1>
      </SiteHeader>
      <SiteMain>
        <div className="px-6 space-y-6">
          {/* Map Visualizations */}
          <div className="space-y-4">
            <h2 className="text-lg font-medium">Map</h2>
            <Suspense
              fallback={
                <Skeleton className="min-h-[600px] w-full flex items-center justify-center">
                  <span>Loading map...</span>
                </Skeleton>
              }
            >
              <AtmMapServer />
            </Suspense>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-medium">Heatmap</h2>
            <Suspense
              fallback={
                <Skeleton className="min-h-[600px] w-full flex items-center justify-center">
                  <span>Loading heatmap...</span>
                </Skeleton>
              }
            >
              <AtmHeatmapServer />
            </Suspense>
          </div>
        </div>
      </SiteMain>
    </SidebarInset>
  );
}
