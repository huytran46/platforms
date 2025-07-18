import { SiteHeader } from "@/components/site-header";
import { SiteMain } from "@/components/site-main";
import { SidebarInset } from "@/components/ui/sidebar";
import { Suspense } from "react";
import { AtmMapServer } from "./atm-map.server";

export default async function MapPage() {
  return (
    <SidebarInset>
      <SiteHeader>
        <h1 className="text-base font-medium">Bản đồ ATM</h1>
      </SiteHeader>
      <SiteMain className="py-0">
        <div className="flex-1">
          <Suspense>
            <AtmMapServer />
          </Suspense>
        </div>
      </SiteMain>
    </SidebarInset>
  );
}
