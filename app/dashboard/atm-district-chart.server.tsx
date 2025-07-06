import { ATMDistrictChart } from "./atm-district-chart";
import { getAtmByDistrict } from "./data";

const AtmDistrictChartServer = async () => {
  const atmByDistrict = (await getAtmByDistrict()) ?? [];
  return <ATMDistrictChart data={atmByDistrict} />;
};

export { AtmDistrictChartServer };
