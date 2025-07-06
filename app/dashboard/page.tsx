import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SiteMain } from "@/components/site-main";
import { SidebarInset } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Suspense } from "react";
import { AtmDistrictChartServer } from "./atm-district-chart.server";

export default async function DashboardPage() {
  return (
    <SidebarInset>
      <SiteHeader>
        <h1 className="text-base font-medium">Phân tích dữ liệu</h1>
      </SiteHeader>
      <SiteMain>
        <SectionCards />
        <div className="px-4 lg:px-6">
          <Suspense fallback={<Skeleton className="min-h-[650px] w-full" />}>
            <AtmDistrictChartServer />
          </Suspense>
        </div>
      </SiteMain>
    </SidebarInset>
  );
}
