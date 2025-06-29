import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ATMMap } from "@/app/dashboard/map/atm-map";
import { ATMHeatmap } from "@/app/dashboard/map/atm-heatmap";
import { ATMDistrictChart } from "@/app/dashboard/atm-district-chart";

import { getAtmByDistrict, getAtmsWithCoordinates } from "../data";

export default async function MapPage() {
  const [atmByDistrict, { data: atmsWithCoords }] = await Promise.all([
    getAtmByDistrict(),
    getAtmsWithCoordinates(),
  ]);

  return (
    <div className="px-6 space-y-6">
      {/* Map Visualizations */}
      <div className="space-y-4">
        <h2 className="text-lg font-medium">Map</h2>
        <ATMMap atms={atmsWithCoords} showHeatmap={true} height="600px" />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-medium">Heatmap</h2>
        <ATMHeatmap
          atms={atmsWithCoords}
          height="600px"
          intensityMode="uniform"
        />
      </div>
    </div>
  );
}
