import { PropsWithChildren } from "react";
import { getAtmsWithCoordinates } from "../data";
import { AtmsLayer, ATMMap } from "./atm-map";

const AtmMapServer = async ({ children }: PropsWithChildren) => {
  const { data: atmsWithCoords } = await getAtmsWithCoordinates();
  return (
    <ATMMap height="100%">
      <AtmsLayer atms={atmsWithCoords} />
      {children}
    </ATMMap>
  );
};

export { AtmMapServer };
