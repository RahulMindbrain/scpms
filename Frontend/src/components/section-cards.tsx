"use client"

import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Users, TrendingUp, GraduationCap, Building2 } from "lucide-react"

interface SectionCardsProps {
  totalPlaced: number;
  avgSalary: number;
  totalStudents: number;
  totalDepartments: number;
}

const cards = [
  {
    label: "Total Placed",
    sub: "Overall Placement Status",
    footer: "Current academic year",
    icon: GraduationCap,
    gradient: "from-indigo-500/10 to-indigo-500/0",
    border: "border-t-2 border-t-indigo-500/80",
    iconBg: "bg-indigo-500/10 text-indigo-400",
    key: "totalPlaced" as const,
    format: (v: number) => String(v),
  },
  {
    label: "Average Salary",
    sub: "Average CTC offered",
    footer: "Across all departments",
    icon: TrendingUp,
    gradient: "from-emerald-500/10 to-emerald-500/0",
    border: "border-t-2 border-t-emerald-500/80",
    iconBg: "bg-emerald-500/10 text-emerald-400",
    key: "avgSalary" as const,
    format: (v: number) => `₹${(v / 100000).toFixed(2)} LPA`,
  },
  {
    label: "Total Students",
    sub: "Registered Students",
    footer: "Total student database",
    icon: Users,
    gradient: "from-cyan-500/10 to-cyan-500/0",
    border: "border-t-2 border-t-cyan-500/80",
    iconBg: "bg-cyan-500/10 text-cyan-400",
    key: "totalStudents" as const,
    format: (v: number) => String(v),
  },
  {
    label: "Departments",
    sub: "Active Departments",
    footer: "Academic divisions",
    icon: Building2,
    gradient: "from-amber-500/10 to-amber-500/0",
    border: "border-t-2 border-t-amber-500/80",
    iconBg: "bg-amber-500/10 text-amber-400",
    key: "totalDepartments" as const,
    format: (v: number) => String(v),
  },
]

export function SectionCards({ totalPlaced, avgSalary, totalStudents, totalDepartments }: SectionCardsProps) {
  const values = { totalPlaced, avgSalary, totalStudents, totalDepartments }

  return (
    <div className="grid grid-cols-1 gap-4 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {cards.map(({ label, sub, footer, icon: Icon, gradient, border, iconBg, key, format }) => (
        <Card
          key={key}
          className={`
            @container/card relative overflow-hidden
            bg-card
            ${border}
            border border-border/50
            hover:shadow-xl hover:shadow-primary/5
            transition-all duration-500 group
          `}
        >
          <CardHeader className="flex flex-row items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <CardDescription className="text-muted-foreground text-[10px] font-bold uppercase tracking-wider mb-1">
                {label}
              </CardDescription>
              <CardTitle className="text-2xl font-black tabular-nums text-foreground @[250px]/card:text-3xl">
                {format(values[key])}
              </CardTitle>
            </div>
            <div className={`p-2.5 rounded-xl shrink-0 ${iconBg}`}>
              <Icon className="size-5" />
            </div>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1 text-sm pt-0">
            <div className="font-bold text-foreground text-xs">{sub}</div>
            <div className="text-muted-foreground text-[10px]">{footer}</div>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
