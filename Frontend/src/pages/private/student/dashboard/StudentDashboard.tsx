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
  MapPin,
  Clock3,
  Calendar,
  LayoutDashboard,
  ArrowUpRight,
} from "lucide-react"
import CountdownTimer from "@/components/CountdownTimer"
import type { AppDispatch } from "@/redux/store/store"
import type { RootState } from "@/redux/reducers/rootReducer"
import { fetchUpcomingEvents, fetchUnreadCount } from "@/redux/thunks/notificationThunks"
import { useSocket } from "@/socket/SocketProvider"
import { SOCKET_EVENTS } from "@/socket/socket.events"
import Loader from "@/components/Loader"

export default function StudentDashboard() {
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocket()

  const { upcomingEvents = [], unreadCount = 0, loading = false } = useSelector(
    (state: RootState) => state.notification || {}
  )

  const { user } = useSelector((state: RootState) => state.auth)
  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null

  useEffect(() => {
    dispatch(fetchUpcomingEvents())
    dispatch(fetchUnreadCount())
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
    <div className="flex-1 flex flex-col bg-[#F8FAFC] dark:bg-[#0B0E14] min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full p-4 md:p-8 space-y-8 student-hero-animate">

        {/* Hero Section */}
        <section className="student-hero-banner relative overflow-hidden">
          <div className="student-hero-mesh">
            <div className="bubble-indigo"></div>
            <div className="bubble-sky"></div>
          </div>
          <div className="student-hero-texture"></div>
          
          <div className="relative z-10">
            <div className="student-hero-badge mb-6">
              <Sparkles className="h-3.5 w-3.5" /> 
              <span>Student Overview</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome back, <span className="text-indigo-500">{user?.firstname || "Student"}</span> 👋
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-500 dark:text-slate-400 font-medium">
              Your personalized workspace for tracking interviews, applications, and upcoming placement milestones.
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { 
              label: "Upcoming Events", 
              value: upcomingEvents.length, 
              icon: CalendarClock, 
              color: "indigo",
              bg: "bg-indigo-50",
              iconColor: "text-indigo-500"
            },
            { 
              label: "Unread Updates", 
              value: unreadCount, 
              icon: Bell, 
              color: "amber",
              bg: "bg-amber-50",
              iconColor: "text-amber-500"
            },
            { 
              label: "Next Scheduled", 
              isNext: true,
              icon: Calendar, 
              color: "emerald",
              bg: "bg-emerald-50",
              iconColor: "text-emerald-500"
            }
          ].map((stat, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#11141B] rounded-[1.5rem] p-7 shadow-sm border border-gray-100 dark:border-white/5 transition-all hover:shadow-md group"
            >
              <div className="flex items-center justify-between">
                <div className={`p-3 rounded-xl ${stat.bg} dark:bg-white/5 transition-transform group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                </div>
                {stat.isNext && nextEvent && (
                  <div className="text-[10px] font-bold text-indigo-500 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider">
                    Next Up
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <p className="text-sm font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                  {stat.label}
                </p>
                {stat.isNext ? (
                  <div className="mt-2">
                    <p className="text-xl font-bold text-slate-900 dark:text-white truncate">
                      {nextEvent ? nextEvent.title : "No events"}
                    </p>
                    <p className="text-xs font-medium text-slate-500 mt-1">
                      {nextEvent ? new Date(nextEvent.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : "All caught up"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-4xl font-extrabold text-slate-900 dark:text-white">
                    {stat.value}
                  </p>
                )}
              </div>
            </div>
          ))}
        </section>

        {/* Main Content Grid */}
        <section className="grid gap-10 lg:grid-cols-12">
          
          {/* Upcoming Schedule */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Upcoming Schedule</h3>
              <Link to="/student/calendar" className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors">
                View All
              </Link>
            </div>

            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="border-2 border-dashed border-gray-200 dark:border-white/5 rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-center bg-gray-50/20">
                  <div className="bg-white dark:bg-white/5 p-6 rounded-3xl shadow-sm mb-6 transition-transform hover:scale-105">
                    <Calendar className="h-10 w-10 text-indigo-400/40" />
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-bold text-lg tracking-tight">Your schedule is clear</p>
                  <p className="text-sm text-slate-400 dark:text-slate-500 mt-2 max-w-xs mx-auto">
                    We couldn't find any upcoming events. Stay tuned for new placement activities and interviews!
                  </p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-[#11141B] border border-gray-100 dark:border-white/5 rounded-2xl p-5 flex items-center gap-5 transition-all hover:border-indigo-100 dark:hover:border-indigo-500/20 group"
                  >
                    <div className="h-14 w-14 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                      <Briefcase className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 transition-colors">{event.title}</h4>
                      <p className="text-sm text-slate-500 font-medium">{event.company}</p>
                    </div>
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mt-0.5">
                        {new Date(event.startTime).toLocaleDateString([], { day: 'numeric', month: 'short' })}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-indigo-400 transition-all group-hover:translate-x-1" />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">Navigation</h3>
            <div className="grid gap-4">
              {[
                { to: "/student/profile", icon: User, label: "My Profile", color: "indigo", bg: "bg-indigo-50" },
                { to: "/student/jobs", icon: Briefcase, label: "Job Portal", color: "emerald", bg: "bg-emerald-50" },
                { to: "/student/application", icon: FileText, label: "Applications", color: "cyan", bg: "bg-cyan-50" },
                { to: "/student/notifications", icon: Bell, label: "Notifications", color: "amber", bg: "bg-amber-50" },
              ].map((nav) => (
                <Link
                  key={nav.to}
                  to={nav.to}
                  className="bg-white dark:bg-[#11141B] border border-gray-100 dark:border-white/5 rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:translate-y-[-2px] group"
                >
                  <div className={`h-11 w-11 rounded-xl ${nav.bg} dark:bg-white/5 flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <nav.icon className={`h-5 w-5 text-${nav.color}-500`} />
                  </div>
                  <span className="font-bold text-slate-700 dark:text-slate-300 flex-1">{nav.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </Link>
              ))}
            </div>

            {/* Recruiter Insight Card */}
            <div className="bg-indigo-600 rounded-[2rem] p-8 text-white relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform group-hover:scale-110">
                <Sparkles size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-indigo-200" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-200">Pro Insight</span>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  Update your skills bi-weekly to increase visibility by <span className="font-bold text-indigo-200">40%</span> to top recruiters.
                </p>
              </div>
            </div>
          </div>

        </section>
      </div>
    </div>

  )
}