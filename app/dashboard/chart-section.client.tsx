"use client";

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AtmByDistrict } from "./data";

const CONFIG = {
  count: {
    label: "ATM",
  },
  district_extracted: {
    label: "District",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

const ChartBar = ({ atmData }: { atmData: AtmByDistrict[] }) => {
  return (
    <ChartContainer
      config={CONFIG}
      className="aspect-auto h-[300px] w-[2000px]"
    >
      <BarChart data={atmData} layout="horizontal">
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          tickLine={false}
          axisLine={false}
          type="category"
          dataKey="district_extracted"
        />
        <YAxis
          tickLine={false}
          axisLine={false}
          type="number"
          dataKey="count"
        />
        <Bar dataKey="count" fill="var(--color-desktop)" />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => value.toString().trim()}
              indicator="dot"
            />
          }
        />
      </BarChart>
    </ChartContainer>
  );
};

export { ChartBar };
