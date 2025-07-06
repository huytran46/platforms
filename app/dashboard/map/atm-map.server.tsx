import { getAtmsWithCoordinates } from "../data";
import { ATMMap } from "./atm-map";

const AtmMapServer = async () => {
  const { data: atmsWithCoords } = await getAtmsWithCoordinates();
  return  <ATMMap atms={atmsWithCoords} showHeatmap={true} height="600px" />;
};

export { AtmMapServer };