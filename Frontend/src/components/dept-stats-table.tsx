import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DeptStat } from "@/redux/slices/dashboardSlice"
import { Badge } from "@/components/ui/badge"

interface DeptStatsTableProps {
  deptStats: DeptStat[];
}

export function DeptStatsTable({ deptStats }: DeptStatsTableProps) {
  return (
    <div className="px-4 lg:px-6">
      <div className="rounded-lg border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Department</TableHead>
              <TableHead className="text-right">Total Students</TableHead>
              <TableHead className="text-right">Placed Students</TableHead>
              <TableHead className="text-right">Placement %</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deptStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No department data available.
                </TableCell>
              </TableRow>
            ) : (
              deptStats.map((stat) => (
                <TableRow key={stat.department}>
                  <TableCell className="font-medium">{stat.department}</TableCell>
                  <TableCell className="text-right">{stat.totalStudents}</TableCell>
                  <TableCell className="text-right">{stat.placedStudents}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={stat.percentage > 70 ? "default" : stat.percentage > 40 ? "secondary" : "outline"}>
                      {stat.percentage.toFixed(1)}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
