declare module "react-leaflet-heatmap-layer-v3" {
  import { ComponentType } from "react";

  interface HeatmapLayerProps {
    points: any[];
    longitudeExtractor: (point: any) => number;
    latitudeExtractor: (point: any) => number;
    intensityExtractor: (point: any) => number;
    fitBoundsOnLoad?: boolean;
    fitBoundsOnUpdate?: boolean;
    max?: number;
    radius?: number;
    maxZoom?: number;
    opacity?: number;
    minOpacity?: number;
    useLocalExtrema?: boolean;
    blur?: number;
    gradient?: Record<number, string>;
    onStatsUpdate?: (stats: { min: number; max: number }) => void;
  }

  export const HeatmapLayer: ComponentType<HeatmapLayerProps>;
}
