import { useEffect, useMemo, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DeptStatsTable } from "@/components/dept-stats-table"
import { SectionCards } from "@/components/section-cards"
import type { RootState } from "@/redux/reducers/rootReducer"
import type { AppDispatch } from "@/redux/store/store"
import { fetchCompanyJobs, fetchJobApplications } from "@/redux/thunks/companyThunk"
import { fetchUpcomingEvents } from "@/redux/thunks/upcomingEventThunks"
import { toast } from "sonner"

import Loader from "@/components/Loader"
import CountdownTimer from "@/components/CountdownTimer"
import CompanyApprovalPending from "@/components/status/CompanyApprovalPending"
import { Building2, Calendar, Clock, MapPin, Sparkles } from "lucide-react"
import { useSocket } from "@/socket/SocketProvider"
import { SOCKET_EVENTS } from "@/socket/socket.events"
import { DashboardUpcomingEventsDialog } from "@/components/dashboard/DashboardUpcomingEventsDialog"

export default function Dashboard() {
  const [showAllEvents, setShowAllEvents] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { jobs, applications, loading, error } = useSelector((state: RootState) => state.company)
const upcomingEvents = useSelector(
  (state: RootState) => state.upcomingEvents?.data?.items ?? []
)

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null
  const { socket } = useSocket()

 const handleUpdate = () => {
  console.log("🔄 Company Dashboard: Refreshing data...");

  toast.success("Dashboard Synchronized", {
    description: "Latest applications and job status have been updated."
  });

  dispatch(fetchCompanyJobs({ page: 1, limit: 100 }));
  dispatch(fetchJobApplications({ page: 1 }));

  dispatch(fetchUpcomingEvents({
    page: 1,
    limit: 10,
  }));
};

  useEffect(() => {
    if (!socket) return

    socket.on(SOCKET_EVENTS.NEW_APPLICATION, handleUpdate)
    socket.on(SOCKET_EVENTS.OFFER_ACCEPTED, handleUpdate)

    return () => {
      socket.off(SOCKET_EVENTS.NEW_APPLICATION, handleUpdate)
      socket.off(SOCKET_EVENTS.OFFER_ACCEPTED, handleUpdate)
    }
  }, [socket, dispatch])

  useEffect(() => {
    handleUpdate()
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
    if (error.includes("Account not approved")) {
     return <CompanyApprovalPending isOpen={true} />
    }
    return (
      <div className="flex flex-1 items-center justify-center p-4 text-destructive font-bold">
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
              <div className="flex items-center gap-3 mb-6 flex-wrap">
                <div className="p-3 bg-white/10 rounded-2xl">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-black text-lg leading-tight">Next Event</h3>
                  <p className="text-white/60 text-[10px] font-bold uppercase tracking-widest mt-0.5">Upcoming Schedule</p>
                </div>
                <div className="flex items-center gap-3 ml-auto flex-wrap justify-end">
                  <CountdownTimer targetDate={nextEvent.startTime} />
                  <button
                    type="button"
                    onClick={() => setShowAllEvents(true)}
                    className="text-[10px] font-black uppercase tracking-widest text-white/90 hover:text-white border border-white/25 rounded-full px-3 py-1.5 bg-white/10 hover:bg-white/15 transition-colors"
                  >
                    View all
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-white font-bold text-xl truncate">{nextEvent?.title}</p>
                    <div className="flex flex-wrap items-center gap-4 mt-3">
                      <div className="flex items-center gap-1.5 text-white/70 text-xs font-medium">
                        <Clock size={14} className="text-blue-400" />
                        {new Date(nextEvent?.startTime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
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
                    {/* ── Upcoming Events Section ── */}
<div className="saas-card overflow-hidden">
  <div className="flex items-center justify-between mb-6">
    <div>
      <h3 className="text-lg font-black text-foreground tracking-tight flex items-center gap-2">
        <Calendar className="size-5 text-primary" />
        Upcoming Events
      </h3>
      <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest mt-1">
        Next scheduled drives & interviews
      </p>
    </div>

    <button
      onClick={() => setShowAllEvents(true)}
      className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/10 px-3 py-1.5 rounded-lg hover:bg-primary hover:text-white transition-all"
    >
      View All
    </button>
  </div>

  {/* Countdown + List Grid */}
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
    
    {/* LEFT: Countdown Card */}
    <div className="saas-card bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
      {nextEvent ? (
        <>
          <div className="flex items-center gap-2 mb-3">
            <Clock className="size-4" />
            <span className="text-[10px] font-black uppercase tracking-widest">
              Next Event Countdown
            </span>
          </div>

          <h4 className="text-lg font-black mb-2 truncate">
            {nextEvent.title}
          </h4>

          <p className="text-white/80 text-xs font-medium mb-4 flex items-center gap-2">
            <MapPin className="size-3" />
            {nextEvent.company?.name || "Company Drive"}
          </p>

          {/* Countdown Timer */}
          <div className="bg-white/10 rounded-2xl p-4">
            <CountdownTimer targetDate={nextEvent.startTime} />
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full py-10 text-center">
          <Calendar className="size-8 mb-3 opacity-60" />
          <p className="font-bold">No Upcoming Event</p>
          <p className="text-xs text-white/70">Schedule will appear here</p>
        </div>
      )}
    </div>

    {/* RIGHT: Event List */}
    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
      {upcomingEvents.length > 0 ? (
        upcomingEvents.slice(0, 5).map((event: any) => (
          <div
            key={event.id}
            className="flex items-center gap-4 p-4 rounded-2xl bg-muted/30 hover:bg-muted/50 transition-all border border-transparent hover:border-primary/20"
          >
            {/* Date */}
            <div className="text-center min-w-[50px]">
              <p className="text-[10px] font-bold text-muted-foreground uppercase">
                {new Date(event.startTime).toLocaleDateString([], {
                  month: "short",
                })}
              </p>
              <p className="text-lg font-black">
                {new Date(event.startTime).getDate()}
              </p>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{event.title}</p>
              <p className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Building2 className="size-3" />
                {event.company?.name || "Company"}
              </p>
            </div>

            {/* Time */}
            <div className="text-right">
              <p className="text-[11px] font-bold text-primary">
                {new Date(event.startTime).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          </div>
        ))
      ) : (
        <div className="flex flex-col items-center justify-center py-10 text-center opacity-60">
          <Calendar className="size-6 mb-2" />
          <p className="text-sm font-bold">No Events Scheduled</p>
        </div>
      )}
    </div>
  </div>
</div>
      </div>

      <DashboardUpcomingEventsDialog open={showAllEvents} onOpenChange={setShowAllEvents} />
    </div>
  )
}
