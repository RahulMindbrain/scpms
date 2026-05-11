import { useEffect, useState, useMemo } from "react"
import { DashboardUpcomingEventsDialog } from "@/components/dashboard/DashboardUpcomingEventsDialog"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { SectionCards } from "@/components/section-cards"
import { fetchDashboardStats } from "@/redux/thunks/dashboardThunk"
import { fetchSchedules } from "@/redux/thunks/interviewThunk"
import type { RootState, AppDispatch } from "@/redux/store/store"

import {
  LayoutDashboard,
  Activity,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  Zap,
  FileText,
  UserPlus,
  Mail,
  Calendar,
  Timer,
  Building2
} from "lucide-react"
import { fetchNotifications } from "@/redux/thunks/notificationThunks"
import { AdminPageLayout } from "@/components/layout/AdminPageLayout"
import { PageHeader } from "@/components/PageHeader"
import Loader from "@/components/Loader"
import { useSocket } from "@/socket/SocketProvider"
import { SOCKET_EVENTS } from "@/socket/socket.events"
import { toast } from "sonner"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const NextInterviewCountdown = ({ schedules }: { schedules: any[] }) => {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);

  const nextSchedule = useMemo(() => {
    if (!schedules || schedules.length === 0) return null;
    const now = new Date().getTime();
    return schedules
      .filter(s => new Date(s.startTime).getTime() > now)
      .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];
  }, [schedules]);

  useEffect(() => {
    if (!nextSchedule) return;

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(nextSchedule.startTime).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft({
          d: Math.floor(distance / (1000 * 60 * 60 * 24)),
          h: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          m: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          s: Math.floor((distance % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextSchedule]);

  if (!nextSchedule) {
    return (
      <div className="saas-card h-full bg-muted/50 dark:bg-slate-900 text-foreground dark:text-white border-none overflow-hidden group relative min-h-[180px]">
        <div className="relative z-10 h-full flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="size-4 text-indigo-500 dark:text-indigo-400" />
              <h3 className="text-[10px] font-black uppercase tracking-widest text-indigo-500 dark:text-indigo-400">Next Event</h3>
            </div>
            <h3 className="text-xl font-black mb-1 text-foreground dark:text-white">No Upcoming Drives</h3>
            <p className="text-muted-foreground dark:text-white/50 text-[10px] font-medium leading-relaxed">All systems operational. No interview schedules pending for the immediate future.</p>
          </div>
          <div className="mt-6 flex items-end justify-between">
            <div className="text-3xl font-black text-foreground/5 dark:text-white/5">--:--:--</div>
            <div className="size-10 rounded-full bg-foreground/5 dark:bg-white/10 flex items-center justify-center backdrop-blur-md">
              <ShieldCheck className="size-5 text-foreground/20 dark:text-white/30" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="saas-card h-full bg-indigo-600 dark:bg-indigo-700 text-white border-none overflow-hidden group relative">
      <div className="relative z-10 h-full flex flex-col justify-between">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Timer className="size-4 text-sky-300 animate-pulse" />
              <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-sky-300">Countdown Initiated</h3>
            </div>
            <span className="px-2 py-0.5 rounded-md bg-white/10 border border-white/20 text-[9px] font-black uppercase text-white">Next Drive</span>
          </div>

          <div>
            <h3 className="text-xl font-black leading-tight mb-1 truncate text-white">{nextSchedule.title}</h3>
            <p className="text-white/80 text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Building2 className="size-3" /> {nextSchedule.company?.name}
            </p>
          </div>

          {timeLeft && (
            <div className="grid grid-cols-4 gap-2 pt-2">
              {[
                { label: 'Days', val: timeLeft.d },
                { label: 'Hrs', val: timeLeft.h },
                { label: 'Min', val: timeLeft.m },
                { label: 'Sec', val: timeLeft.s }
              ].map((t, i) => (
                <div key={i} className="flex flex-col items-center p-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/10">
                  <span className="text-lg font-black tabular-nums text-white">{String(t.val).padStart(2, '0')}</span>
                  <span className="text-[8px] font-bold uppercase tracking-widest text-white/60">{t.label}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-indigo-200 uppercase tracking-widest">Venue</span>
            <span className="text-xs font-bold text-white truncate max-w-[120px]">{nextSchedule.venue}</span>
          </div>
          <div className="size-10 rounded-full bg-white text-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform cursor-pointer">
            <ArrowUpRight className="size-5" />
          </div>
        </div>
      </div>
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-sky-400/20 rounded-full -ml-10 -mb-10 blur-xl" />
    </div>
  )
}

const DeptStatsTable = ({ deptStats }: { deptStats: any[] }) => {
  return (
    <div className="saas-card overflow-hidden h-full">
      <div className="flex items-center justify-between mb-6 px-2">
        <div>
          <h3 className="text-lg font-black text-foreground tracking-tight">Departmental ROI</h3>
          <p className="text-xs font-medium text-muted-foreground">Detailed performance metrics across divisions</p>
        </div>
        <div className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-1.5">
          <div className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-bold text-emerald-600 uppercase">Live Performance</span>
        </div>
      </div>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-border/50 hover:bg-transparent">
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-4">Department</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center py-4">Students</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-center py-4">Placement</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground text-right py-4 pr-6">Success Rate</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deptStats.map((dept, idx) => {
              const rate = ((dept.placedStudents / dept.totalStudents) * 100).toFixed(1)
              return (
                <TableRow key={idx} className="border-border/50 hover:bg-muted/30 transition-all group cursor-default">
                  <TableCell className="font-bold text-foreground py-4 group-hover:text-primary transition-colors">
                    {dept.departmentName}
                  </TableCell>
                  <TableCell className="text-center font-medium text-muted-foreground py-4 tabular-nums">
                    {dept.totalStudents}
                  </TableCell>
                  <TableCell className="text-center py-4">
                    <span className="px-2 py-0.5 rounded-md bg-muted font-black text-[10px] text-foreground tabular-nums">
                      {dept.placedStudents}
                    </span>
                  </TableCell>
                  <TableCell className="text-right py-4 pr-6">
                    <div className="flex items-center justify-end gap-3">
                      <span className={`text-[11px] font-black tabular-nums ${Number(rate) > 50 ? 'text-emerald-500' : 'text-amber-500'}`}>
                        {rate}%
                      </span>
                      <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full transition-all duration-1000 ease-out ${Number(rate) > 50 ? 'bg-emerald-500' : 'bg-amber-500'}`}
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
    </div>
  )
}

const ActivityFeed = ({ notifications, loading }: { notifications: any[]; loading: boolean }) => {
  const getNotificationStyles = (type: string) => {
    switch (type?.toUpperCase()) {
      case 'PLACEMENT':
      case 'JOB_POSTED':
        return { icon: Zap, color: 'text-amber-500', bg: 'bg-amber-500/10' };
      case 'INTERVIEW':
      case 'SCHEDULED':
        return { icon: ShieldCheck, color: 'text-indigo-500', bg: 'bg-indigo-500/10' };
      case 'SYSTEM':
      case 'USER_REGISTERED':
        return { icon: UserPlus, color: 'text-emerald-500', bg: 'bg-emerald-500/10' };
      default:
        return { icon: Activity, color: 'text-slate-500', bg: 'bg-slate-500/10' };
    }
  };

  const formatTime = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHrs = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) return `${diffInMins}m ago`;
    if (diffInHrs < 24) return `${diffInHrs}h ago`;
    return `${diffInDays}d ago`;
  };

  return (
    <div className="saas-card h-full flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-black text-foreground tracking-tight">Recent Activity</h3>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">View All</button>
      </div>

      <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-2 max-h-[400px]">
        {loading ? (
          <div className="flex flex-col gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start gap-4 animate-pulse">
                <div className="size-10 rounded-2xl bg-muted" />
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-16 bg-muted rounded" />
                  <div className="h-3 w-full bg-muted rounded" />
                </div>
              </div>
            ))}
          </div>
        ) : notifications.length > 0 ? (
          notifications.slice(0, 8).map((item) => {
            const styles = getNotificationStyles(item.type);
            return (
              <div key={item.id} className="flex items-start gap-4 group cursor-pointer">
                <div className={`size-10 shrink-0 rounded-2xl ${styles.bg} flex items-center justify-center transition-transform group-hover:scale-110 duration-300`}>
                  <styles.icon className={`size-5 ${styles.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground/60">{item.type?.replace('_', ' ')}</span>
                    <span className="text-[10px] font-bold text-muted-foreground flex items-center gap-1">
                      <Clock className="size-3" /> {formatTime(item.createdAt)}
                    </span>
                  </div>
                  <p className="text-sm font-bold text-foreground truncate group-hover:text-primary transition-colors">{item.title || item.message}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center opacity-50">
            <Activity className="size-10 mb-4" />
            <p className="text-xs font-black uppercase tracking-widest">No recent activity</p>
          </div>
        )}
      </div>

      <div className="mt-8 pt-6 border-t border-border/50">
        <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex items-center gap-4">
          <div className="size-2 rounded-full bg-primary animate-ping" />
          <p className="text-xs font-bold text-primary">Live Notification Sync Active</p>
        </div>
      </div>
    </div>
  );
};

const QuickActions = () => {
  const navigate = useNavigate()
  const actions = [
    { label: 'Schedule Interview', icon: UserPlus, color: 'bg-indigo-500', path: '/admin/event-management' },
    { label: 'Generate Report', icon: FileText, color: 'bg-emerald-500', path: '/admin/report' },
    { label: 'Send Announcement', icon: Mail, color: 'bg-amber-500', path: '/admin/bulk-email' },
  ]

  return (
    <div className="saas-card h-full">
      <h3 className="text-lg font-black text-foreground tracking-tight mb-6">Quick Operations</h3>
      <div className="grid grid-cols-1 gap-3">
        {actions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => navigate(action.path)}
            className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 hover:bg-primary hover:text-white transition-all duration-300 group text-left"
          >
            <div className="flex items-center gap-3">
              <div className={`size-8 rounded-xl ${action.color} text-white flex items-center justify-center group-hover:bg-white group-hover:text-primary transition-colors`}>
                <action.icon className="size-4" />
              </div>
              <span className="text-sm font-black">{action.label}</span>
            </div>
            <ArrowUpRight className="size-4 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>
        ))}
      </div>
    </div>
  )
}

export default function AdminDashboard() {
  const [showAllUpcoming, setShowAllUpcoming] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { data: dashboardData, loading: dashLoading, error } = useSelector((state: RootState) => state.dashboard)
  const { schedules, loading: schedLoading } = useSelector((state: RootState) => state.interview)
  const { items: notifications, loading: notifLoading } = useSelector((state: RootState) => state.notification)
  const { user } = useSelector((state: RootState) => state.auth)
  const { socket } = useSocket()

  const handleRefresh = () => {
    console.log("🔄 Admin Dashboard: Tactical Refresh Initiated...");
    toast.info("Tactical Data Synchronized", {
      description: "Real-time updates have been applied to your command center."
    });
    dispatch(fetchDashboardStats())
    dispatch(fetchSchedules(undefined))
    dispatch(fetchNotifications({ page: 1, limit: 10 }))
  }

  useEffect(() => {
    if (!socket) {
      console.log("⚠️ Admin Dashboard: No socket connection found.");
      return
    }

    console.log("🛠️ Admin Dashboard: Attaching socket listeners...");
    socket.on(SOCKET_EVENTS.NEW_USER_REGISTERED, handleRefresh)
    socket.on(SOCKET_EVENTS.NEW_APPLICATION, handleRefresh)
    socket.on(SOCKET_EVENTS.OFFER_ACCEPTED, handleRefresh)
    socket.on(SOCKET_EVENTS.SYSTEM_ALERT, handleRefresh)

    return () => {
      console.log("🧹 Admin Dashboard: Detaching socket listeners...");
      socket.off(SOCKET_EVENTS.NEW_USER_REGISTERED, handleRefresh)
      socket.off(SOCKET_EVENTS.NEW_APPLICATION, handleRefresh)
      socket.off(SOCKET_EVENTS.OFFER_ACCEPTED, handleRefresh)
      socket.off(SOCKET_EVENTS.SYSTEM_ALERT, handleRefresh)
    }
  }, [socket, dispatch])

  useEffect(() => {
    handleRefresh()
  }, [dispatch])

  if ((dashLoading || schedLoading || notifLoading) && !dashboardData) {
    return <Loader text="Synchronizing tactical data..." />
  }

  if (error) {
    return (
      <AdminPageLayout>
        <div className="flex flex-1 flex-col items-center justify-center p-8 space-y-4 min-h-[400px]">
          <div className="text-rose-400 font-bold uppercase tracking-widest text-sm bg-rose-500/10 px-4 py-2 rounded-lg border border-rose-500/20">
            Error Synchronizing: {error}
          </div>
          <button
            onClick={() => {
              dispatch(fetchDashboardStats())
              dispatch(fetchSchedules(undefined))
              dispatch(fetchNotifications({ page: 1, limit: 10 }))
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-black py-3 px-8 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-95 flex items-center gap-2"
          >
            <Zap className="size-4" />
            Retry Connection
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
        title={`Command Center, ${user?.firstname || "Admin"}`}
        description="Unified interface for campus-wide placement operations and analytical intelligence."
        badge="Enterprise Control"
        icon={LayoutDashboard}
        variant="indigo"
      >
        <div className="flex items-center gap-3">
          <div className="hidden md:flex flex-col items-end mr-4">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Network Status</span>
            <div className="flex items-center gap-1.5 text-emerald-500 font-black text-xs uppercase">
              <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Synchronized
            </div>
          </div>

        </div>
      </PageHeader>

      <div className="space-y-8 pb-10">
        {/* Row 1: Key Metrics */}
        <SectionCards
          totalPlaced={stats.totalPlacedStudents}
          avgSalary={stats.avgSalary}
          totalStudents={totalStudents}
          totalDepartments={totalDepartments}
        />

        {/* Row 2: Analytics & Feed */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8 flex flex-col">
            <div className="saas-card flex-1">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h3 className="text-xl font-black text-foreground tracking-tight">Placement Velocity</h3>
                  <p className="text-xs font-medium text-muted-foreground mt-0.5">Rolling trends for current academic session</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-500 text-[10px] font-black uppercase tracking-wider border border-indigo-500/20">Active Session</span>
                </div>
              </div>
              <div className="h-[400px]">
                <ChartAreaInteractive data={stats.deptStats} />
              </div>
            </div>
          </div>

          <div className="xl:col-span-4">
            <ActivityFeed notifications={notifications} loading={notifLoading} />
          </div>
        </div>

        {/* Row 3: Department Performance & Quick Actions */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
          <div className="xl:col-span-8">
            <DeptStatsTable deptStats={stats.deptStats} />
          </div>

          <div className="xl:col-span-4 flex flex-col gap-8">
            <QuickActions />
            <div className="space-y-3">
              <div className="flex items-center justify-end">
                <button
                  type="button"
                  onClick={() => setShowAllUpcoming(true)}
                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline"
                >
                  View all upcoming
                </button>
              </div>
              <NextInterviewCountdown schedules={schedules} />
            </div>
          </div>
        </div>
      </div>

      <DashboardUpcomingEventsDialog open={showAllUpcoming} onOpenChange={setShowAllUpcoming} />
    </AdminPageLayout>
  )
}
