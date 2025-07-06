import { getAtmsWithCoordinates } from "../data";
import { ATMHeatmap } from "./atm-heatmap";

const AtmHeatmapServer = async () => {
  const { data: atmsWithCoords } = await getAtmsWithCoordinates();
  return (
    <ATMHeatmap atms={atmsWithCoords} height="600px" intensityMode="uniform" />
  );
};

export { AtmHeatmapServer };
