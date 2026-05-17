import { useEffect } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  Bell,
  CalendarClock,
  FileText,
  User,
  Briefcase,
  ChevronRight,
  Sparkles,
  ArrowUpRight,
} from "lucide-react"
import { UpcomingEventsList } from "@/components/dashboard/UpcomingEventsList"

import type { AppDispatch } from "@/redux/store/store"
import type { RootState } from "@/redux/reducers/rootReducer"
import { fetchUpcomingEvents, fetchUnreadCount } from "@/redux/thunks/notificationThunks"
import { fetchJobApplications } from "@/redux/thunks/studentThunk"
import { useSocket } from "@/socket/SocketProvider"
import { SOCKET_EVENTS } from "@/socket/socket.events"
import { StudentPageLayout } from "@/components/layout/StudentPageLayout"

export default function StudentDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocket()

  const { upcomingEvents = [], unreadCount = 0 } = useSelector(
    (state: RootState) => state.notification || {}
  )

  const { applications = [] } = useSelector((state: RootState) => state.student)
  const { user } = useSelector((state: RootState) => state.auth)

  useEffect(() => {
    dispatch(fetchUpcomingEvents())
    dispatch(fetchUnreadCount())
    dispatch(fetchJobApplications({ page: 1, limit: 100 }))
  }, [dispatch])

  useEffect(() => {
    if (!socket || !user) return;
    const handleConnect = () => {
      socket.emit("join", { userId: user.id, role: user.role });
    };
    if (socket.connected) handleConnect();
    socket.on("connect", handleConnect);
    return () => { socket.off("connect", handleConnect); };
  }, [socket, user]);

  useEffect(() => {
    if (!socket) return;
    const handleUpdate = () => {
      dispatch(fetchUpcomingEvents());
      dispatch(fetchUnreadCount());
    };
    socket.on(SOCKET_EVENTS.APPLICATION_STATUS_UPDATED, handleUpdate);
    socket.on(SOCKET_EVENTS.NEW_JOB, handleUpdate);
    socket.on(SOCKET_EVENTS.SCHEDULE_APPROVED, handleUpdate);
    socket.on(SOCKET_EVENTS.SCHEDULE_CREATED, handleUpdate);
    return () => {
      socket.off(SOCKET_EVENTS.APPLICATION_STATUS_UPDATED, handleUpdate);
      socket.off(SOCKET_EVENTS.NEW_JOB, handleUpdate);
      socket.off(SOCKET_EVENTS.SCHEDULE_APPROVED, handleUpdate);
      socket.off(SOCKET_EVENTS.SCHEDULE_CREATED, handleUpdate);
    };
  }, [dispatch, socket]);

  return (
    <StudentPageLayout containerClassName="student-hero-animate">
      <div className="space-y-6 md:space-y-8 w-full pb-8">
        {/* Hero Section */}
        <section className="student-hero-banner group">
          <div className="student-hero-mesh">
            <div className="bubble-indigo"></div>
            <div className="bubble-sky"></div>
          </div>
          <div className="student-hero-texture"></div>
          <div className="student-hero-overlay"></div>

          <div className="relative z-10 w-full">
            <div className="student-hero-badge">
              <span>Dashboard Overview</span>
            </div>

            <h1 className="student-hero-title">
              Welcome back, <span>{user?.firstname || "Student"}</span>
            </h1>

            <p className="student-hero-description">
              Your personalized workspace for tracking interviews, applications, and upcoming placement milestones.
            </p>

            <div className="mt-6 sm:mt-8 flex flex-wrap gap-4">
              <Link to="/student/jobs" className="student-hero-cta hover:scale-[1.02] active:scale-[0.98]">
                Browse Jobs <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              label: "Upcoming Events",
              value: upcomingEvents.length,
              icon: CalendarClock,
              gradient: "from-blue-500 to-indigo-600",
              iconBg: "bg-blue-500/10",
              iconColor: "text-blue-600"
            },
            {
              label: "Unread Updates",
              value: unreadCount,
              icon: Bell,
              gradient: "from-amber-400 to-orange-500",
              iconBg: "bg-amber-500/10",
              iconColor: "text-amber-600"
            },
            { 
              label: "Applied Jobs", 
              value: applications.length, 
              icon: Briefcase, 
              gradient: "from-emerald-400 to-teal-500",
              iconBg: "bg-emerald-500/10",
              iconColor: "text-emerald-600"
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className="saas-card group"
            >
              <div className="flex items-start justify-between">
                <div className={`p-3 sm:p-4 rounded-xl sm:rounded-2xl ${stat.iconBg} transition-all group-hover:scale-110 duration-500`}>
                  <stat.icon className={`h-6 w-6 sm:h-7 sm:w-7 ${stat.iconColor}`} />
                </div>
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground/30 group-hover:border-primary/30 group-hover:text-primary/30 transition-colors">
                  <ArrowUpRight size={20} className="h-4 w-4 sm:h-5 sm:w-5" />
                </div>
              </div>

              <div className="mt-6 sm:mt-8">
                <p className="text-[10px] sm:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1 sm:mt-2">
                  <p className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tighter">
                    {stat.value}
                  </p>
                  <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-primary animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Main Content Grid */}
        <section className="grid gap-6 sm:gap-8 grid-cols-1 lg:grid-cols-12">

          {/* Upcoming Schedule */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Upcoming Schedule</h3>
              <Link to="/student/interview" className="text-xs sm:text-sm font-semibold text-primary hover:opacity-80 transition-opacity">
                View All
              </Link>
            </div>

            <UpcomingEventsList events={upcomingEvents.map(e => ({ ...e, status: 'SCHEDULED' }))} showApprovalStatus={false} />
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">Navigation</h3>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { to: "/student/profile", icon: User, label: "My Profile", color: "text-blue-600", bg: "bg-blue-500/10", desc: "View and edit your personal details" },
                { to: "/student/jobs", icon: Briefcase, label: "Job Portal", color: "text-emerald-600", bg: "bg-emerald-500/10", desc: "Discover new opportunities" },
                { to: "/student/application", icon: FileText, label: "Applications", color: "text-purple-600", bg: "bg-purple-500/10", desc: "Track your active status" },
                { to: "/student/notifications", icon: Bell, label: "Notifications", color: "text-amber-600", bg: "bg-amber-500/10", desc: "Stay updated with latest news" },
              ].map((nav) => (
                <Link
                  key={nav.to}
                  to={nav.to}
                  className="bg-card border border-border/60 rounded-2xl p-4 sm:p-5 flex items-center gap-4 sm:gap-5 transition-all hover:shadow-premium hover:-translate-y-1 group"
                >
                  <div className={`h-11 w-11 sm:h-14 sm:w-14 rounded-xl sm:rounded-2xl ${nav.bg} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shrink-0`}>
                    <nav.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="block font-black text-sm sm:text-base text-foreground tracking-tight truncate">{nav.label}</span>
                    <span className="text-[9px] sm:text-[10px] text-muted-foreground font-bold uppercase tracking-wider block truncate">{nav.desc}</span>
                  </div>
                  <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all shrink-0">
                    <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Recruiter Insight Card */}
            <div className="bg-slate-900 dark:bg-[#161b22]/30 border border-slate-800 dark:border-white/[0.06] rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 sm:p-8 opacity-20 transition-transform group-hover:scale-125 duration-1000 rotate-12 pointer-events-none">
                <Sparkles className="w-16 h-16 sm:w-24 sm:h-24 text-primary" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4 sm:mb-6">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse"></div>
                  <span className="text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Pro Insight</span>
                </div>
                <p className="text-base sm:text-lg font-bold leading-snug">
                  Update your skills <span className="text-primary italic">bi-weekly</span> to increase visibility by <span className="text-white px-2 py-0.5 rounded bg-primary/20 border border-primary/30">40%</span> to top recruiters.
                </p>
                <button className="mt-6 sm:mt-8 text-[10px] sm:text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2">
                  Learn More <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

        </section>
      </div>
    </StudentPageLayout>
  )
}