import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { Button } from "@/components/ui/button";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { IconCode } from "@tabler/icons-react";
import { batchGeocodeATMs } from "./batch-geocode-atms";
import NavConsoleClient from "./nav-console.client";
import NavMainClient from "./nav-main.client";

const ENV = process.env.NODE_ENV;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset">
        <NavMainClient />
        <NavConsoleClient />

        {ENV === "development" && (
          <div className="flex p-4">
            <Button
              variant="outline"
              onClick={async () => {
                "use server";
                await batchGeocodeATMs();
              }}
            >
              <IconCode className="mr-2 h-4 w-4" />
              Start geocoding data
            </Button>
          </div>
        )}
      </AppSidebar>

      <SidebarInset>
        <SiteHeader />
        <div className="flex flex-1 flex-col">
          <div className="@container/main flex flex-1 flex-col gap-2">
            <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
              {children}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
