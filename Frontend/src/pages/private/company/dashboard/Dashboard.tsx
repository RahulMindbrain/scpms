import { useEffect, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DeptStatsTable } from "@/components/dept-stats-table"
import { SectionCards } from "@/components/section-cards"
import type { RootState } from "@/redux/reducers/rootReducer"
import type { AppDispatch } from "@/redux/store/store"
import { fetchCompanyJobs, fetchJobApplications } from "@/redux/thunks/companyThunk"
import { fetchUpcomingEvents } from "@/redux/thunks/notificationThunks"

import Loader from "@/components/Loader"
import CountdownTimer from "@/components/CountdownTimer"
import { Calendar, Clock, MapPin, Sparkles } from "lucide-react"

export default function Dashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { jobs, applications, loading, error } = useSelector((state: RootState) => state.company)
  const { upcomingEvents = [] } = useSelector((state: RootState) => state.notification || {})

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null

  useEffect(() => {
    dispatch(fetchCompanyJobs({ page: 1, limit: 100 }))
    dispatch(fetchJobApplications({ page: 1 }))
    dispatch(fetchUpcomingEvents())
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
    return <Loader text="Loading dashboard data..." />
  }

  if (error) {
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-destructive">
        Error: {error}
      </div>
    )
  }

  return (
    <div className="flex flex-1 flex-col gap-6 p-4 md:p-8 animate-in fade-in duration-700">
      {/* ── Company Hero ── */}
      <div className="company-hero-banner min-h-[320px] flex flex-col justify-center">
        <div className="hero-mesh">
          <div className="bubble-primary" />
          <div className="bubble-secondary" />
        </div>
        <div className="hero-texture" />
        
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="hero-badge mb-4">
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
              Company Command Center
            </div>
            <h1 className="hero-title text-4xl lg:text-5xl font-black mb-4">
              Welcome back to <span className="text-blue-400">SCPMS</span>
            </h1>
            <p className="hero-description text-base opacity-90 max-w-lg mb-0">
              Monitor your job drives, track applicant progress, and discover top talent effortlessly.
            </p>
          </div>

          {nextEvent && (
            <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2.5rem] p-6 lg:p-8 shadow-2xl animate-in zoom-in-95 duration-700">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-black text-lg leading-tight">Next Event</h3>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-0.5">Upcoming Schedule</p>
                </div>
                <div className="ml-auto">
                   <CountdownTimer targetDate={nextEvent.startTime} />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-xl truncate">{nextEvent.title}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                       <div className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                          <Clock size={14} className="text-blue-400" />
                          {new Date(nextEvent.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                       </div>
                       <div className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                          <MapPin size={14} className="text-blue-400" />
                          Virtual / On-campus
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="@container/main flex flex-1 flex-col gap-8">
        <SectionCards
          totalPlaced={metrics.totalPlaced}
          avgSalary={metrics.avgSalary}
          totalStudents={metrics.totalApplicants}
          totalDepartments={metrics.deptStats.length}
        />
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-7 saas-card flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-foreground tracking-tight">Placement Performance</h3>
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">Analytics Overview</p>
              </div>
              <div className="p-2 bg-primary/5 rounded-xl border border-primary/10">
                <Sparkles className="size-5 text-primary" />
              </div>
            </div>
            <div className="flex-1">
              <ChartAreaInteractive data={metrics.deptStats} />
            </div>
          </div>
          
          <div className="xl:col-span-5 saas-card p-0 overflow-hidden flex flex-col">
             <div className="px-8 py-6 border-b border-border/50 bg-muted/10 flex items-center justify-between">
                <div>
                   <h3 className="text-sm font-black text-foreground uppercase tracking-[0.15em]">Dept Insights</h3>
                   <p className="text-[10px] text-muted-foreground font-bold mt-0.5">Real-time status</p>
                </div>
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                      <div key={i} className="size-6 rounded-full border-2 border-card bg-muted animate-pulse" />
                   ))}
                </div>
             </div>
             <div className="flex-1 overflow-auto p-2">
                <DeptStatsTable deptStats={metrics.deptStats} />
             </div>
          </div>
        </div>
      </div>

    </div>
  )
}
