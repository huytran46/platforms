import { SiteHeader } from "@/components/site-header";
import { SiteMain } from "@/components/site-main";
import { SidebarInset } from "@/components/ui/sidebar";
import { AtmDataTable } from "./atm-data-table";

const Page = () => {
  return (
    <SidebarInset>
      <SiteHeader>
        <h1 className="text-base font-medium">Cơ sở dữ liệu</h1>
      </SiteHeader>
      <SiteMain>
        <AtmDataTable />
      </SiteMain>
    </SidebarInset>
  );
};

export default Page;
