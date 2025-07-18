import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { AtmAnalytics } from "./types";

const getAtmAnalytics = async (): Promise<AtmAnalytics> => {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.rpc("get_atm_analytics");

  if (error) {
    console.error("Error fetching ATM analytics:", error);
    throw error;
  }

  return data;
};

export async function SectionCards() {
  const atmAnalytics = await getAtmAnalytics();
  
  // Calculate percentage of ATMs with coordinates
  const coordinatesPercentage = atmAnalytics.geographic_coverage.coordinates_coverage;
  
  // Calculate recent activity percentage (comparing week vs 24h)
  const recentActivityTrend = atmAnalytics.recent_activity.added_last_week > 0 
    ? ((atmAnalytics.recent_activity.added_last_24h / atmAnalytics.recent_activity.added_last_week) * 100 * 7).toFixed(1)
    : "0";

  // Format numbers with commas
  const formatNumber = (num: number) => num.toLocaleString();

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Total ATMs</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(atmAnalytics.overview.total_atms)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {atmAnalytics.overview.atms_with_coordinates} mapped
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {coordinatesPercentage.toFixed(1)}% have coordinates <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Geographic coverage across {atmAnalytics.geographic_coverage.unique_districts} districts
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Data Quality</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {atmAnalytics.data_quality.completeness_score}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {atmAnalytics.data_quality.completeness_score >= 80 ? (
                <><IconTrendingUp /> Excellent</>
              ) : atmAnalytics.data_quality.completeness_score >= 60 ? (
                <><IconTrendingUp /> Good</>
              ) : (
                <><IconTrendingDown /> Needs attention</>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {atmAnalytics.data_quality.completeness_score >= 80 ? (
              <>High data completeness <IconTrendingUp className="size-4" /></>
            ) : (
              <>Data quality improvement needed <IconTrendingDown className="size-4" /></>
            )}
          </div>
          <div className="text-muted-foreground">
            Missing: {atmAnalytics.data_quality.missing_coordinates} coords, {atmAnalytics.data_quality.missing_images} images
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Recent Activity</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(atmAnalytics.recent_activity.added_last_week)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {atmAnalytics.recent_activity.added_last_24h > 0 ? (
                <><IconTrendingUp /> +{atmAnalytics.recent_activity.added_last_24h} today</>
              ) : (
                <><IconTrendingDown /> No new today</>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {atmAnalytics.recent_activity.updated_last_24h} updated today{" "}
            {atmAnalytics.recent_activity.updated_last_24h > 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            New ATMs added in the last week
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Coverage Rate</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {atmAnalytics.geographic_coverage.unique_districts}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {coordinatesPercentage.toFixed(0)}% mapped
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Districts covered nationwide <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Geographic distribution analysis
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
