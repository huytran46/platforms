"use client";

import { Button } from "@/components/ui/button";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  LayersControl,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

type ATMWithCoordinates = {
  id: string;
  atm: string;
  district_extracted: string;
  address_extracted: string;
  latitude: number;
  longitude: number;
  // coordinates_text: string;
  services?: string;
  service_1?: string;
  service_2?: string;
  service_3?: string;
  service_4?: string;
  service_5?: string;
};

const AtmData = createContext<{
  atms: ATMWithCoordinates[];
}>({
  atms: [],
});

const MyLocationMarker = () => {
  const [position, setPosition] = useState<[number, number] | null>(null);

  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.log("MyLocationMarker", error);
          // let errorMessage = "Không thể xác định vị trí";

          // switch (error.code) {
          //   case 1: // PERMISSION_DENIED
          //     errorMessage = "Quyền truy cập vị trí bị từ chối";
          //     break;
          //   case 2: // POSITION_UNAVAILABLE
          //     errorMessage =
          //       "Vị trí hiện tại không khả dụng - có thể do kết nối mạng kém hoặc GPS không hoạt động";
          //     break;
          //   case 3: // TIMEOUT
          //     errorMessage = "Hết thời gian chờ lấy vị trí";
          //     break;
          //   default:
          //     errorMessage = `Lỗi định vị không xác định (mã: ${error.code})`;
          //     break;
          // }

          // console.error("Geolocation error:", {
          //   code: error.code,
          //   message: error.message,
          //   userMessage: errorMessage,
          // });
        },
        {
          enableHighAccuracy: false, // Changed to false for better compatibility
          timeout: 10_000, // Increased timeout
          maximumAge: 60_000, // Allow cached location up to 1 minute
        }
      );
    }
  }, []);

  if (!position) return null;

  // Create a custom red icon for user location
  const userLocationIcon = L.divIcon({
    className: "custom-user-marker",
    html: `
      <div class="flex items-center justify-center">
        <span class="text-4xl">📍</span>
      </div>
    `,
    iconSize: [40, 48],
    iconAnchor: [20, 48],
    popupAnchor: [0, -48],
  });

  return <Marker position={position} icon={userLocationIcon} />;
};

export const MyLocationLayer = () => <MyLocationMarker />;

export const AtmsLayer = ({ atms }: { atms?: ATMWithCoordinates[] }) => {
  const props = useMemo(
    () => ({
      atms:
        atms?.filter(
          (atm) =>
            atm.latitude &&
            atm.longitude &&
            !isNaN(atm.latitude) &&
            !isNaN(atm.longitude)
        ) ?? [],
    }),
    [atms]
  );

  console.log("atms in atms layer", props.atms.length);

  return props.atms.map((atm) => {
    const services = [
      atm.service_1,
      atm.service_2,
      atm.service_3,
      atm.service_4,
      atm.service_5,
    ].filter((service) => service && service.trim() !== "");

    return (
      <Marker key={atm.id} position={[atm.latitude, atm.longitude]}>
        <Popup>
          <div className="flex flex-col">
            <h3 className="font-bold text-lg mb-2">{atm.atm}</h3>

            <div className="flex items-baseline space-x-2">
              <span className="text-sm text-gray-500">
                {atm.address_extracted}
              </span>
            </div>

            {services.length > 0 && (
              <div className="space-y-1">
                <p className="text-sm font-medium">Dịch vụ:</p>
                <div className="flex flex-wrap gap-1">
                  {services.map((service, idx) => (
                    <span
                      key={idx}
                      className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                    >
                      {service?.trim()}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-baseline mt-5">
              <Button
                variant="ghost"
                size="sm"
                className="cursor-pointer w-full"
                onClick={() => {
                  window.open(
                    `https://www.google.com/maps/dir/?api=1&destination=${atm.latitude},${atm.longitude}`,
                    "_blank",
                    "width=800,height=600"
                  );
                }}
              >
                <span style={{ textDecoration: "none" }} className="text-lg">
                  🛵
                </span>
                <span>Dẫn đường</span>
              </Button>
            </div>
          </div>
        </Popup>
      </Marker>
    );
  });
};

interface ATMMapProps {
  height?: string;
}

export function ATMMap({
  height = "100%",
  children,
}: PropsWithChildren<ATMMapProps>) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="bg-gray-100 animate-pulse rounded-lg flex items-center justify-center"
        style={{ height }}
      >
        <p className="text-gray-500">Loading map...</p>
      </div>
    );
  }

  // Default center (Ho Chi Minh City)
  const center: [number, number] = [10.8231, 106.6297];

  return (
    // <AtmDataProvider atms={atms}>
    <div style={{ height }} className="overflow-hidden border">
      <MapContainer
        center={center}
        zoom={11}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {children}
      </MapContainer>
    </div>
    // </AtmDataProvider>
  );
}
