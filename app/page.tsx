import { Suspense } from "react";

import { AtmMapServer } from "./dashboard/map/atm-map.server";
import { FloatingMenu } from "./floating-menu";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center relative">
      <div className="w-screen h-screen z-10">
        <Suspense>
          <AtmMapServer />
        </Suspense>
      </div>
      <FloatingMenu />
    </div>
  );
}
