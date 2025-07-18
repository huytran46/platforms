export interface AtmAnalytics {
    overview: {
      total_atms: number;
      atms_with_coordinates: number;
      atms_with_images: number;
      atms_with_services: number;
      last_updated: string | null;
      last_created: string | null;
    };
    districts: Array<{
      district: string;
      count: number;
      percentage: number;
    }>;
    services_analysis: {
      service_1_distribution: Array<{
        service: string;
        count: number;
      }>;
      service_2_distribution: Array<{
        service: string;
        count: number;
      }>;
    };
    data_quality: {
      missing_coordinates: number;
      missing_images: number;
      missing_services: number;
      missing_district: number;
      missing_address: number;
      completeness_score: number;
    };
    recent_activity: {
      added_last_24h: number;
      updated_last_24h: number;
      added_last_week: number;
      updated_last_week: number;
    };
    geographic_coverage: {
      coordinates_coverage: number;
      unique_districts: number;
    };
  }
  
  // Individual component types for easier usage
  export interface DistrictStat {
    district: string;
    count: number;
    percentage: number;
  }
  
  export interface ServiceDistribution {
    service: string;
    count: number;
  }
  
  export interface OverviewStats {
    total_atms: number;
    atms_with_coordinates: number;
    atms_with_images: number;
    atms_with_services: number;
    last_updated: string | null;
    last_created: string | null;
  }
  
  export interface DataQuality {
    missing_coordinates: number;
    missing_images: number;
    missing_services: number;
    missing_district: number;
    missing_address: number;
    completeness_score: number;
  }
  
  export interface RecentActivity {
    added_last_24h: number;
    updated_last_24h: number;
    added_last_week: number;
    updated_last_week: number;
  }
  
  export interface GeographicCoverage {
    coordinates_coverage: number;
    unique_districts: number;
  }