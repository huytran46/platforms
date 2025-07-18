"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

type AtmByDistrict = {
  district_extracted: string;
  count: number;
};

interface ATMDistrictChartProps {
  data: AtmByDistrict[];
}

const chartConfig = {
  count: {
    label: "ATM Count",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ATMDistrictChart({ data }: ATMDistrictChartProps) {
  // Transform data for the chart
  const chartData = data.map((item) => ({
    district: item.district_extracted.trim(),
    count: item.count,
  }));

  return (
    <ChartContainer config={chartConfig}>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="district"
            angle={-45}
            textAnchor="end"
            height={100}
            fontSize={12}
          />
          <YAxis />
          <ChartTooltip
            content={
              <ChartTooltipContent
                formatter={(value, name) => [value, " ", "ATMs"]}
                labelFormatter={(label) => `District: ${label}`}
              />
            }
          />
          <Bar
            dataKey="count"
            fill="var(--color-count)"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
