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
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/25">
      {pct.toFixed(1)}%
    </span>
  )
  if (pct >= 40) return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/25">
      {pct.toFixed(1)}%
    </span>
  )
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-500/15 text-rose-400 ring-1 ring-rose-500/25">
      {pct.toFixed(1)}%
    </span>
  )
}

export function DeptStatsTable({ deptStats }: DeptStatsTableProps) {
  return (
    <div className="">
      <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#1e1f26] overflow-hidden">
        <div className="px-4 py-3 border-b border-[rgba(255,255,255,0.06)] flex items-center gap-2">
          <h3 className="text-sm font-semibold text-[#e2e2eb]">Department-wise Placement Stats</h3>
          <span className="ml-auto text-xs text-[#908fa0]">{deptStats.length} departments</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow className="border-[rgba(255,255,255,0.06)] hover:bg-transparent">
              <TableHead className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#908fa0] bg-[#191b22] h-10">
                Department
              </TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-[#908fa0] bg-[#191b22] h-10">
                Total Students
              </TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-[#908fa0] bg-[#191b22] h-10">
                Placed Students
              </TableHead>
              <TableHead className="text-right text-[10px] font-semibold uppercase tracking-[0.08em] text-[#908fa0] bg-[#191b22] h-10">
                Placement %
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deptStats.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center text-[#908fa0] text-sm">
                  No department data available.
                </TableCell>
              </TableRow>
            ) : (
              deptStats.map((stat) => (
                <TableRow
                  key={stat.department}
                  className="border-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.025)] transition-colors"
                >
                  <TableCell className="font-medium text-[#e2e2eb] py-3">{stat.department}</TableCell>
                  <TableCell className="text-right text-[#c7c4d7] tabular-nums">{stat.totalStudents}</TableCell>
                  <TableCell className="text-right text-[#c7c4d7] tabular-nums">{stat.placedStudents}</TableCell>
                  <TableCell className="text-right">
                    <PlacementBadge pct={stat.percentage} />
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
