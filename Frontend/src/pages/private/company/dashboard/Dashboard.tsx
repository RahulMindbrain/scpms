import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DeptStatsTable } from "@/components/dept-stats-table"
import { SectionCards } from "@/components/section-cards"
import type { RootState } from "@/redux/reducers/rootReducer"
import type { AppDispatch } from "@/redux/store/store"
import { fetchCompanyJobs, fetchJobApplications } from "@/redux/thunks/companyThunk"

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { jobs, applications, loading, error } = useSelector((state: RootState) => state.company)

  useEffect(() => {
    dispatch(fetchCompanyJobs({ page: 1, limit: 100 }))
    dispatch(fetchJobApplications({ page: 1 }))
  }, [dispatch])

  const metrics = useMemo(() => {
    const totalJobs = jobs.length
    const avgSalary =
      totalJobs > 0
        ? jobs.reduce((sum: number, job: any) => sum + (Number(job.salary) || 0), 0) / totalJobs
        : 0

    const selectedApps = applications.filter((app: any) => app.status === "SELECTED")
    const uniqueStudents = new Set(
      applications.map((app: any) => app.student?.id).filter(Boolean)
    ).size

    const departmentMap = new Map<
      string,
      { students: Set<number>; selectedStudents: Set<number> }
    >()

    applications.forEach((app: any) => {
      const department = app.student?.department?.name || "Unknown"
      const studentId = app.student?.id
      if (!studentId) return

      if (!departmentMap.has(department)) {
        departmentMap.set(department, { students: new Set(), selectedStudents: new Set() })
      }

      const current = departmentMap.get(department)!
      current.students.add(studentId)
      if (app.status === "SELECTED") {
        current.selectedStudents.add(studentId)
      }
    })

    const deptStats = Array.from(departmentMap.entries()).map(([department, data]) => {
      const totalStudents = data.students.size
      const placedStudents = data.selectedStudents.size
      const percentage = totalStudents ? (placedStudents / totalStudents) * 100 : 0

      return { department, totalStudents, placedStudents, percentage }
    })

    return {
      totalJobs,
      avgSalary,
      totalApplicants: uniqueStudents,
      totalPlaced: new Set(selectedApps.map((app: any) => app.student?.id).filter(Boolean)).size,
      deptStats,
    }
  }, [applications, jobs])

  if (loading && jobs.length === 0 && applications.length === 0) {
    return (
      <div className="flex flex-1 items-center justify-center p-20">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-destructive">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards
            totalPlaced={metrics.totalPlaced}
            avgSalary={metrics.avgSalary}
            totalStudents={metrics.totalApplicants}
            totalDepartments={metrics.deptStats.length}
          />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={metrics.deptStats} />
          </div>
          <DeptStatsTable deptStats={metrics.deptStats} />
        </div>
      </div>
    </div>
  )
}
