import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { fetchDashboardStats } from "@/redux/thunks/dashboardThunk"
import type { RootState, AppDispatch } from "@/redux/store/store"

import { LayoutDashboard, TrendingUp, TrendingDown, Users } from "lucide-react"
import { AdminPageLayout } from "@/components/layout/AdminPageLayout"
import { PageHeader } from "@/components/PageHeader"
import Loader from "@/components/Loader"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const DeptStatsTable = ({ deptStats }: { deptStats: any[] }) => {
  return (
    <div className="saas-card overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Department</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Total Students</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">Placed</TableHead>
            <TableHead className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-right">Placement Rate</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deptStats.map((dept, idx) => {
            const rate = ((dept.placedStudents / dept.totalStudents) * 100).toFixed(1)
            return (
              <TableRow key={idx} className="border-border hover:bg-muted/30 transition-colors group">
                <TableCell className="font-bold text-foreground group-hover:text-primary transition-colors">
                  {dept.departmentName}
                </TableCell>
                <TableCell className="text-center font-medium text-muted-foreground">
                  {dept.totalStudents}
                </TableCell>
                <TableCell className="text-center font-medium text-foreground">
                  {dept.placedStudents}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    <span className={`text-xs font-black ${Number(rate) > 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                      {rate}%
                    </span>
                    <div className="w-16 h-1.5 bg-muted rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${Number(rate) > 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
                        style={{ width: `${rate}%` }}
                      />
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            )
          })}
        </TableBody>
      </Table>
    </div>
  )
}

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: dashboardData, loading, error } = useSelector((state: RootState) => state.dashboard)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (loading && !dashboardData) {
    return <Loader text="Loading dashboard statistics..." />
  }

  if (error) {
    return (
      <AdminPageLayout>
        <div className="flex flex-1 flex-col items-center justify-center p-8 space-y-4 min-h-[400px]">
          <div className="text-rose-400 font-bold uppercase tracking-widest text-sm bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20">
            Error: {error}
          </div>
          <button
            onClick={() => dispatch(fetchDashboardStats())}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
          >
            Retry Fetching Data
          </button>
        </div>
      </AdminPageLayout>
    )
  }

  const stats = dashboardData || {
    totalPlacedStudents: 0,
    avgSalary: 0,
    deptStats: [],
    deptAvgSalary: []
  }

  const totalStudents = stats.deptStats.reduce((acc, curr) => acc + curr.totalStudents, 0)
  const totalDepartments = stats.deptStats.length

  return (
    <AdminPageLayout>
      <PageHeader
        title={`Welcome back, ${user?.firstname || "Admin"}`}
        description="Comprehensive placement insights and system-wide statistics at a glance."
        badge="Admin Dashboard"
        icon={LayoutDashboard}
        variant="indigo"
      />

      <div className="space-y-10">
        <SectionCards
          totalPlaced={stats.totalPlacedStudents}
          avgSalary={stats.avgSalary}
          totalStudents={totalStudents}
          totalDepartments={totalDepartments}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-12">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Placement Trends</h3>
            </div>
            <ChartAreaInteractive data={stats.deptStats} />
          </div>
          
          <div className="lg:col-span-12">
             <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Department Performance</h3>
            </div>
            <DeptStatsTable deptStats={stats.deptStats} />
          </div>
        </div>
      </div>
    </AdminPageLayout>
  )
}