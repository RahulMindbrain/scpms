import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
// import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { fetchDashboardStats } from "@/redux/thunks/dashboardThunk"
import type { RootState, AppDispatch } from "@/redux/store/store"

import Loader from "@/components/Loader"
import { DeptStatsTable } from "@/components/dept-stats-table"

export default function AdminDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { data: dashboardData, loading, error } = useSelector((state: RootState) => state.dashboard)

  useEffect(() => {
    dispatch(fetchDashboardStats())
  }, [dispatch])

  if (loading && !dashboardData) {
    return <Loader text="Loading dashboard statistics..." />
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center text-destructive p-4">
        Error: {error}
      </div>
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
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards 
            totalPlaced={stats.totalPlacedStudents}
            avgSalary={stats.avgSalary}
            totalStudents={totalStudents}
            totalDepartments={totalDepartments}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={stats.deptStats} />
          </div>
          <DeptStatsTable deptStats={stats.deptStats} />
        </div>
      </div>
    </div>
  )
}