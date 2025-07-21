import { PropsWithChildren } from "react";
import { getAtmsWithCoordinates } from "../data";
import { ATMMap } from "./atm-map";

const AtmMapServer = async ({ children }: PropsWithChildren) => {
  const { data: atmsWithCoords } = await getAtmsWithCoordinates();
  // Filter ATMs with valid coordinates
  const validATMs = atmsWithCoords.filter(
    (atm) =>
      atm.latitude &&
      atm.longitude &&
      !isNaN(atm.latitude) &&
      !isNaN(atm.longitude)
  );

  return (
    <ATMMap height="100%" atms={validATMs}>
      {children}
    </ATMMap>
  );
};

export { AtmMapServer };
