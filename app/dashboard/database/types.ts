export type AtmData = {
    id: string;
    atm: string;
    district_extracted: string;
    address_extracted: string;
    image_src?: string;
    services?: string;
    service_1?: string;
    service_2?: string;
    service_3?: string;
    service_4?: string;
    service_5?: string;
    coordinates: {
      coordinates: [number, number];
      type: "Point";
    } | null;
    // coordinates:
    //   | null
    //   | {
    //       lat: number;
    //       lng: number;
    //     }
    //   | [number, number]
    //   | {
    //       coordinates: [number, number];
    //       type: "Point";
    //     };
  };