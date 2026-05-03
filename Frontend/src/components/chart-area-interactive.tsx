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
    color: "#10b981",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ data }: PlacementChartProps) {
  return (
    <div className="w-full">
      <div className="flex flex-col gap-1 mb-6">
        <h3 className="text-base font-bold text-foreground">Placement Overview</h3>
        <p className="text-xs text-muted-foreground font-medium">
          Comparison of total students vs placed students across departments
        </p>
      </div>

      <div className="px-0">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={data} margin={{ left: -20, right: 0, top: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="fillTotal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-totalStudents)"
                  stopOpacity={0.15}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-totalStudents)"
                  stopOpacity={0.01}
                />
              </linearGradient>
              <linearGradient id="fillPlaced" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-placedStudents)"
                  stopOpacity={0.25}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-placedStudents)"
                  stopOpacity={0.01}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="var(--border)" strokeDasharray="3 3" opacity={0.5} />
            <XAxis
              dataKey="department"
              tickLine={false}
              axisLine={false}
              tickMargin={12}
              tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 600 }}
              tickFormatter={(value) => value.length > 8 ? `${value.substring(0, 8)}...` : value}
            />
            <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={12}
                tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontWeight: 600 }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator="line"
                  className="bg-card border-border/50 shadow-xl"
                />
              }
            />
            <Area
              dataKey="totalStudents"
              type="monotone"
              fill="url(#fillTotal)"
              stroke="var(--color-totalStudents)"
              strokeWidth={2}
              stackId="a"
              animationDuration={1500}
            />
            <Area
              dataKey="placedStudents"
              type="monotone"
              fill="url(#fillPlaced)"
              stroke="var(--color-placedStudents)"
              strokeWidth={4}
              stackId="b"
              animationDuration={2000}
              strokeLinecap="round"
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  )
}
