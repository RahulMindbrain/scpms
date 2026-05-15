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
      <>
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

            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/student/jobs" className="bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/20 px-6 py-3 rounded-xl font-bold text-xs transition-all flex items-center gap-2">
                Browse Jobs <ChevronRight size={14} />
              </Link>
            </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
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
                <div className={`p-4 rounded-2xl ${stat.iconBg} transition-transform group-hover:scale-110 duration-500`}>
                  <stat.icon className={`h-7 w-7 ${stat.iconColor}`} />
                </div>
                <div className="h-10 w-10 rounded-full border border-border flex items-center justify-center text-muted-foreground/30 group-hover:border-primary/30 group-hover:text-primary/30 transition-colors">
                  <ArrowUpRight size={20} />
                </div>
              </div>

              <div className="mt-8">
                <p className="text-[11px] font-bold text-muted-foreground uppercase tracking-[0.1em]">
                  {stat.label}
                </p>
                <div className="flex items-baseline gap-2 mt-2">
                  <p className="text-5xl font-black text-foreground tracking-tighter">
                    {stat.value}
                  </p>
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse"></div>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Main Content Grid */}
        <section className="grid gap-8 grid-cols-1 lg:grid-cols-12">

          {/* Upcoming Schedule */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Upcoming Schedule</h3>
              <Link to="/student/interview" className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity">
                View All
              </Link>
            </div>

            <UpcomingEventsList events={upcomingEvents.map(e => ({ ...e, status: 'SCHEDULED' }))} showApprovalStatus={false} />
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-2xl font-bold text-foreground tracking-tight">Navigation</h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              {[
                { to: "/student/profile", icon: User, label: "My Profile", color: "text-blue-600", bg: "bg-blue-500/10", desc: "View and edit your personal details" },
                { to: "/student/jobs", icon: Briefcase, label: "Job Portal", color: "text-emerald-600", bg: "bg-emerald-500/10", desc: "Discover new opportunities" },
                { to: "/student/application", icon: FileText, label: "Applications", color: "text-purple-600", bg: "bg-purple-500/10", desc: "Track your active status" },
                { to: "/student/notifications", icon: Bell, label: "Notifications", color: "text-amber-600", bg: "bg-amber-500/10", desc: "Stay updated with latest news" },
              ].map((nav) => (
                <Link
                  key={nav.to}
                  to={nav.to}
                  className="bg-card border border-border/60 rounded-[2rem] p-5 flex items-center gap-5 transition-all hover:shadow-premium hover:-translate-y-1 group"
                >
                  <div className={`h-14 w-14 rounded-2xl ${nav.bg} flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <nav.icon className={`h-6 w-6 ${nav.color}`} />
                  </div>
                  <div className="flex-1">
                    <span className="block font-black text-foreground tracking-tight">{nav.label}</span>
                    <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">{nav.desc}</span>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-muted/50 flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                    <ArrowUpRight className="h-4 w-4" />
                  </div>
                </Link>
              ))}
            </div>

            {/* Recruiter Insight Card */}
            <div className="bg-foreground rounded-[2.5rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-8 opacity-20 transition-transform group-hover:scale-125 duration-1000 rotate-12">
                <Sparkles size={100} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-6">
                  <div className="h-1.5 w-1.5 rounded-full bg-primary"></div>
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/60">Pro Insight</span>
                </div>
                <p className="text-lg font-bold leading-snug">
                  Update your skills <span className="text-primary italic">bi-weekly</span> to increase visibility by <span className="text-white px-2 py-0.5 rounded bg-primary/20 border border-primary/30">40%</span> to top recruiters.
                </p>
                <button className="mt-8 text-xs font-black uppercase tracking-widest text-primary hover:text-white transition-colors flex items-center gap-2">
                  Learn More <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>

        </section>
      </>
    </StudentPageLayout>
  )
}