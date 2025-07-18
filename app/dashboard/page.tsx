import { SectionCards } from "@/app/dashboard/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SiteMain } from "@/components/site-main";
import { SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { AtmDistrictChartServer } from "./atm-district-chart.server";
import { AtmHeatmapServer } from "./map/atm-heatmap.server";

export default async function DashboardPage() {
  return (
    <SidebarInset>
      <SiteHeader>
        <h1 className="text-base font-medium">Phân tích dữ liệu</h1>
      </SiteHeader>

      <SiteMain>
        <SectionCards />

        <div className="px-4 lg:px-6 flex-1">
          <Suspense fallback={<Skeleton className="min-h-[650px] w-full" />}>
            <AtmDistrictChartServer />
          </Suspense>
        </div>

        <div className="px-4 lg:px-6 flex-1 min-h-[600px]">
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
      </SiteMain>
    </SidebarInset>
  );
}
