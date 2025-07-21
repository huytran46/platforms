import { MainAtmMap } from "./main-atm-map";

export default async function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center relative">
      <MainAtmMap />
    </div>
  );
}
