import { ChartBar } from "./chart-section.client";
import { getAtmByDistrict } from "./data";

const ChartSection = async () => {
  const atmData = await getAtmByDistrict();
  if (!atmData) return null;
  return (
    <div className="overflow-x-auto">
      <ChartBar atmData={atmData} />
    </div>
  );
};

export { ChartSection };
