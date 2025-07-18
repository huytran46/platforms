import { getAtmsWithCoordinates } from "../data";
import { ATMMap } from "./atm-map";

const AtmMapServer = async () => {
  const { data: atmsWithCoords } = await getAtmsWithCoordinates();
  return <ATMMap height="100%" atms={atmsWithCoords} showHeatmap />;
};

export { AtmMapServer };