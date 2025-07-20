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

export function SectionCardsSkeleton() {
  return;
}

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
          <CardDescription>Tổng số ATM</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(atmAnalytics.overview.total_atms)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {atmAnalytics.overview.atms_with_coordinates} đã định vị
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {coordinatesPercentage.toFixed(1)}% có tọa độ{" "}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">
            Phủ sóng địa lý trên{" "}
            {atmAnalytics.geographic_coverage.unique_districts} quận/huyện
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Chất lượng dữ liệu</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {atmAnalytics.data_quality.completeness_score}%
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {atmAnalytics.data_quality.completeness_score >= 80 ? (
                <>
                  <IconTrendingUp /> Xuất sắc
                </>
              ) : atmAnalytics.data_quality.completeness_score >= 60 ? (
                <>
                  <IconTrendingUp /> Tốt
                </>
              ) : (
                <>
                  <IconTrendingDown /> Cần cải thiện
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {atmAnalytics.data_quality.completeness_score >= 80 ? (
              <>
                Dữ liệu hoàn thiện cao <IconTrendingUp className="size-4" />
              </>
            ) : (
              <>
                Cần cải thiện chất lượng dữ liệu{" "}
                <IconTrendingDown className="size-4" />
              </>
            )}
          </div>
          <div className="text-muted-foreground">
            Thiếu: {atmAnalytics.data_quality.missing_coordinates} tọa độ,{" "}
            {atmAnalytics.data_quality.missing_images} hình ảnh
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Hoạt động gần đây</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatNumber(atmAnalytics.recent_activity.added_last_week)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {atmAnalytics.recent_activity.added_last_24h > 0 ? (
                <>
                  <IconTrendingUp /> +
                  {atmAnalytics.recent_activity.added_last_24h} hôm nay
                </>
              ) : (
                <>
                  <IconTrendingDown /> Không có mới hôm nay
                </>
              )}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            {atmAnalytics.recent_activity.updated_last_24h} cập nhật hôm nay{" "}
            {atmAnalytics.recent_activity.updated_last_24h > 0 ? (
              <IconTrendingUp className="size-4" />
            ) : (
              <IconTrendingDown className="size-4" />
            )}
          </div>
          <div className="text-muted-foreground">
            ATM mới được thêm trong tuần qua
          </div>
        </CardFooter>
      </Card>

      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Tỷ lệ phủ sóng</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {atmAnalytics.geographic_coverage.unique_districts}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <IconTrendingUp />
              {coordinatesPercentage.toFixed(0)}% đã bản đồ
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Quận/huyện được phủ sóng toàn quốc{" "}
            <IconTrendingUp className="size-4" />
          </div>
          <div className="text-muted-foreground">Phân tích phân bố địa lý</div>
        </CardFooter>
      </Card>
    </div>
  );
}
