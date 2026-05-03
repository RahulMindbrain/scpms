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
    <div className="flex flex-1 flex-col bg-background dark:bg-[#111319] min-h-screen">
      <div className="@container/main flex flex-1 flex-col">
        <div className="space-y-6 px-4 py-4 md:py-6">

          {/* Hero Banner aligned with Student Profile Style */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-8 text-white shadow-xl md:p-10 border border-white/5">
            {/* Mesh Background Elements from Profile */}
            <div className="absolute inset-0">
              <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[80px]"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-500/15 rounded-full blur-[80px]"></div>
            </div>
            {/* Subtle Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider shadow-lg">
                  <Sparkles className="h-3 w-3 text-yellow-400" /> 
                  <span className="opacity-90">Student Portal</span>
                </div>
                <h1 className="mt-4 text-2xl md:text-4xl font-bold text-white tracking-tight drop-shadow-md">
                  {user?.firstname ? `Welcome back, ${user.firstname} 👋` : "Track your placement journey"}
                </h1>
                <p className="mt-2 max-w-lg text-base text-slate-300 leading-relaxed font-medium">
                  Your personalized command center for interviews, career opportunities, and campus placements.
                </p>
              </div>
              
              <div className="hidden lg:block">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-inner">
                  <LayoutDashboard className="h-12 w-12 text-white/30" />
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards Section */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { 
                label: "Upcoming Events", 
                value: upcomingEvents.length, 
                sub: "Next 7 days activity", 
                icon: CalendarClock, 
                color: "indigo", 
                accent: "stat-card-indigo" 
              },
              { 
                label: "Unread Updates", 
                value: unreadCount, 
                sub: "Messages & alerts", 
                icon: Bell, 
                color: "amber", 
                accent: "stat-card-amber" 
              },
              { 
                label: "Next Scheduled", 
                isNext: true,
                icon: Calendar, 
                color: "emerald", 
                accent: "stat-card-emerald" 
              }
            ].map((stat, idx) => (
              <div
                key={idx}
                className={`group relative bg-white dark:bg-[#1e1f26] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-6 transition-all duration-300 hover:shadow-md dark:hover:bg-[#25262e] shadow-sm`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-widest">{stat.label}</p>
                    {stat.isNext ? (
                      <div className="mt-3">
                        <p className="line-clamp-1 text-base font-bold text-slate-900 dark:text-slate-200">
                          {nextEvent ? nextEvent.title : "All caught up!"}
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-3">
                          <p className="text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                            {nextEvent ? new Date(nextEvent.startTime).toLocaleDateString() : "No pending tasks"}
                          </p>
                          {nextEvent && <CountdownTimer targetDate={nextEvent.startTime} />}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-2 text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                          {stat.value}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500 font-bold uppercase tracking-tighter">{stat.sub}</p>
                      </>
                    )}
                  </div>
                  <div className={`rounded-xl bg-${stat.color}-500/10 p-3`}>
                    <stat.icon className={`h-5 w-5 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid gap-6 lg:grid-cols-12">

            {/* Upcoming Events Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between px-2">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Upcoming Schedule</h3>
                  <p className="text-sm text-slate-500 mt-1">Interviews and placement activities</p>
                </div>
                <button className="text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors uppercase tracking-widest">
                  View All
                </button>
              </div>

              <div className="space-y-3">
                {loading && upcomingEvents.length === 0 ? (
                  <div className="bg-white dark:bg-[#1e1f26] border border-slate-200 dark:border-white/[0.05] rounded-2xl p-12 shadow-sm">
                    <Loader size="md" text="Fetching your schedule..." />
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="bg-white dark:bg-[#1e1f26] border border-slate-200 dark:border-white/[0.05] flex flex-col items-center justify-center rounded-2xl py-16 px-6 text-center shadow-sm">
                    <div className="mb-4 rounded-full bg-indigo-500/5 p-4">
                      <Calendar className="h-8 w-8 text-indigo-400/30" />
                    </div>
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest">No upcoming events right now.</p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group relative flex items-start gap-4 rounded-2xl border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#1e1f26] p-5 transition-all hover:shadow-md dark:hover:bg-[#25262e] hover:border-indigo-500/20"
                    >
                      <div className="hidden sm:flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                        <Briefcase className="h-6 w-6" />
                      </div>
                      
                      <div className="flex-1 space-y-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-base font-bold text-slate-900 dark:text-slate-200 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{event.title}</h4>
                            <p className="text-sm font-bold text-slate-500 mt-0.5">{event.company}</p>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            <span className="badge-indigo inline-flex items-center rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider">
                              Interview
                            </span>
                            <CountdownTimer targetDate={event.startTime} />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-[11px] font-bold text-slate-500 uppercase tracking-tighter">
                          <div className="flex items-center gap-2">
                            <Clock3 className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-500/70" />
                            <span>
                              {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-500/70" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Calendar className="h-3.5 w-3.5 text-indigo-600 dark:text-indigo-500/70" />
                            <span>{new Date(event.startTime).toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ChevronRight className="h-5 w-5 text-indigo-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="px-2">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">Navigation</h3>
                <p className="text-sm text-slate-500 mt-1">Frequently used sections</p>
              </div>

              <div className="grid gap-3">
                {[
                  { to: "/student/profile", icon: User, label: "My Profile", sub: "Personal & Academic", color: "indigo" },
                  { to: "/student/jobs", icon: Briefcase, label: "Job Portal", sub: "Explore opportunities", color: "emerald" },
                  { to: "/student/application", icon: FileText, label: "Applications", sub: "Track your status", color: "cyan" },
                  { to: "/student/notifications", icon: Bell, label: "My Alerts", sub: "Recent updates", color: "amber" },
                ].map(({ to, icon: Icon, label, sub, color }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex items-center gap-4 rounded-2xl border border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#1e1f26] p-4 transition-all hover:shadow-md dark:hover:bg-[#25262e] hover:border-indigo-500/20"
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl bg-${color}-500/10 text-${color}-600 dark:text-${color}-400`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-bold text-slate-900 dark:text-slate-200">{label}</p>
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">{sub}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                ))}
              </div>

              {/* Bonus Tip Card */}
              <div className="rounded-3xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 p-6 mt-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-indigo-100 dark:bg-indigo-500/20 rounded-lg text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="h-4 w-4" />
                  </div>
                  <h4 className="text-xs font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-widest">Pro Tip</h4>
                </div>
                <p className="text-[12px] text-slate-600 dark:text-indigo-100/60 leading-relaxed font-medium">
                  Keep your profile updated with latest certificates to increase your visibility to recruiters by up to 40%.
                </p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}