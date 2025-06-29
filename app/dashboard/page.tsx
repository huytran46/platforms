import { SectionCards } from "@/components/section-cards";
import { ATMDistrictChart } from "./atm-district-chart";
import { getAtmByDistrict } from "./data";

export default async function DashboardPage() {
  const atmByDistrict = (await getAtmByDistrict()) ?? [];
  return (
    <>
      {/* <SectionCards /> */}
      <div className="px-4 lg:px-6">
        <ATMDistrictChart data={atmByDistrict} />
      </div>
    </>
  );
}
