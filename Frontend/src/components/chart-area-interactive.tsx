"use client"

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"
import type { DeptStat } from "@/redux/slices/dashboardSlice"

interface PlacementChartProps {
  data: DeptStat[];
}

const chartConfig = {
  totalStudents: {
    label: "Total Students",
    color: "#6366f1",
  },
  placedStudents: {
    label: "Placed Students",
    color: "#4edea3",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ data }: PlacementChartProps) {
  return (
    <Card className="@container/card bg-[#1e1f26] border border-[rgba(255,255,255,0.07)] shadow-none">
      <CardHeader className="border-b border-[rgba(255,255,255,0.06)] pb-3">
        <CardTitle className="text-sm font-semibold text-[#e2e2eb]">Placement Overview by Department</CardTitle>
        <CardDescription className="text-xs text-[#908fa0]">
          Comparison of total students vs placed students across departments
        </CardDescription>
      </CardHeader>

      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalStudents)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalStudents)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillPlaced" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-placedStudents)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-placedStudents)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="rgba(255,255,255,0.05)" />
            <XAxis
              dataKey="department"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#908fa0", fontSize: 11 }}
              tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 10)}...` : value}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tick={{ fill: "#908fa0", fontSize: 11 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="totalStudents"
              type="natural"
              fill="url(#fillTotal)"
              stroke="var(--color-totalStudents)"
              stackId="a"
            />
            <Area
              dataKey="placedStudents"
              type="natural"
              fill="url(#fillPlaced)"
              stroke="var(--color-placedStudents)"
              stackId="b"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
