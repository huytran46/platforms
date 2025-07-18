import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { authGuard } from "@/app/auth-guard";

import NavConsoleClient from "./nav-console.client";
import NavMainClient from "./nav-main.client";

const ENV = process.env.NODE_ENV;

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  await authGuard();

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

        {/* {ENV === "development" && (
          <div className="flex p-4">
            <Button
              variant="outline"
              // onClick={async () => {
              //   "use server";
              //   await batchGeocodeATMs();
              // }}
            >
              <IconCode className="mr-2 h-4 w-4" />
              Start geocoding data
            </Button>
          </div>
        )} */}
      </AppSidebar>

      {children}
    </SidebarProvider>
  );
}
