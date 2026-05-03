import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import type { DeptStat } from "@/redux/slices/dashboardSlice"

interface DeptStatsTableProps {
  deptStats: DeptStat[];
}

function PlacementBadge({ pct }: { pct: number }) {
  if (pct >= 70) return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
      {pct.toFixed(1)}%
    </span>
  )
  if (pct >= 40) return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
      {pct.toFixed(1)}%
    </span>
  )
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">
      {pct.toFixed(1)}%
    </span>
  )
}

export function DeptStatsTable({ deptStats }: DeptStatsTableProps) {
  return (
    <div className="saas-table-container border-0 shadow-none">
      <Table className="saas-table">
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30 border-0">
            <TableHead className="text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground h-10">
              Department
            </TableHead>
            <TableHead className="text-right text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground h-10">
              Total
            </TableHead>
            <TableHead className="text-right text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground h-10">
              Placed
            </TableHead>
            <TableHead className="text-right text-[10px] font-extrabold uppercase tracking-widest text-muted-foreground h-10">
              Success
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="divide-y divide-border/30">
          {deptStats.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center text-muted-foreground text-xs font-medium">
                No department data available.
              </TableCell>
            </TableRow>
          ) : (
            deptStats.map((stat) => (
              <TableRow
                key={stat.department}
                className="hover:bg-muted/20 transition-colors border-0"
              >
                <TableCell className="font-bold text-foreground py-3 text-xs">{stat.department}</TableCell>
                <TableCell className="text-right text-muted-foreground font-medium tabular-nums text-xs">{stat.totalStudents}</TableCell>
                <TableCell className="text-right text-muted-foreground font-medium tabular-nums text-xs">{stat.placedStudents}</TableCell>
                <TableCell className="text-right">
                  <PlacementBadge pct={stat.percentage} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
