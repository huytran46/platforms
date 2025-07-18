import { getAtmsWithCoordinates } from "../data";
import { ATMHeatmap } from "./atm-heatmap";

const AtmHeatmapServer = async () => {
  const { data: atmsWithCoords } = await getAtmsWithCoordinates();
  return (
    <ATMHeatmap height="100%" atms={atmsWithCoords} intensityMode="uniform" />
  );
};

export { AtmHeatmapServer };
