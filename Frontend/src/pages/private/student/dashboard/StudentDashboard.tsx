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
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <div className="max-w-[1600px] mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">

          {/* Hero Banner aligned with Premium Style */}
          <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-8 text-white shadow-2xl md:p-12 border border-white/5">
            {/* Mesh Background Elements */}
            <div className="absolute inset-0">
              <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/25 rounded-full blur-[100px] animate-pulse"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
            </div>
            {/* Subtle Texture */}
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
            
            <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md">
                  <Sparkles className="h-4 w-4 text-yellow-400" /> 
                  <span className="opacity-90">Student Control Center</span>
                </div>
                <h1 className="mt-6 text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {user?.firstname ? `Welcome back, ${user.firstname} 👋` : "Track your placement journey"}
                </h1>
                <p className="mt-4 max-w-lg text-base md:text-lg text-slate-300 leading-relaxed font-medium opacity-90">
                  Your personalized mission control for interviews, career opportunities, and campus placements.
                </p>
              </div>
              
              <div className="hidden lg:block">
                <div className="flex h-28 w-28 items-center justify-center rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
                  <LayoutDashboard className="h-14 w-14 text-white/40" />
                </div>
              </div>
            </div>
          </div>

          {/* Stat Cards Section */}
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { 
                label: "Upcoming Events", 
                value: upcomingEvents.length, 
                sub: "Next 7 days activity", 
                icon: CalendarClock, 
                color: "indigo", 
              },
              { 
                label: "Unread Updates", 
                value: unreadCount, 
                sub: "Messages & alerts", 
                icon: Bell, 
                color: "amber", 
              },
              { 
                label: "Next Scheduled", 
                isNext: true,
                icon: Calendar, 
                color: "emerald", 
              }
            ].map((stat, idx) => (
              <div
                key={idx}
                className="group relative bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.08] rounded-[2rem] p-8 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-4px] shadow-sm"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-3">
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{stat.label}</p>
                    {stat.isNext ? (
                      <div className="mt-4">
                        <p className="line-clamp-1 text-xl font-black text-slate-900 dark:text-white tracking-tight">
                          {nextEvent ? nextEvent.title : "All caught up!"}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-3">
                          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-2 py-1 rounded-lg">
                            {nextEvent ? new Date(nextEvent.startTime).toLocaleDateString() : "No pending tasks"}
                          </p>
                          {nextEvent && <CountdownTimer targetDate={nextEvent.startTime} />}
                        </div>
                      </div>
                    ) : (
                      <>
                        <p className="mt-2 text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">
                          {stat.value}
                        </p>
                        <p className="mt-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">{stat.sub}</p>
                      </>
                    )}
                  </div>
                  <div className={`rounded-2xl bg-${stat.color}-500/10 p-4 shadow-2xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600 dark:text-${stat.color}-400`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Dashboard Grid */}
          <div className="grid gap-8 lg:grid-cols-12">

            {/* Upcoming Events Column */}
            <div className="lg:col-span-8 space-y-6">
              <div className="flex items-center justify-between px-4">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Upcoming Schedule</h3>
                  <p className="text-sm text-slate-500 mt-1 font-medium">Interviews and placement activities</p>
                </div>
                <button className="text-[10px] font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-all uppercase tracking-[0.2em] bg-indigo-50 dark:bg-indigo-500/10 px-4 py-2 rounded-xl">
                  View Full Calendar
                </button>
              </div>

              <div className="space-y-4">
                {loading && upcomingEvents.length === 0 ? (
                  <div className="bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.08] rounded-[2rem] p-16 shadow-sm">
                    <Loader size="md" text="Fetching your schedule..." />
                  </div>
                ) : upcomingEvents.length === 0 ? (
                  <div className="bg-white/40 dark:bg-white/[0.02] border-2 border-dashed border-slate-200/60 dark:border-white/10 flex flex-col items-center justify-center rounded-[2rem] py-20 px-8 text-center shadow-sm">
                    <div className="mb-6 rounded-3xl bg-indigo-500/5 p-6">
                      <Calendar className="h-10 w-10 text-indigo-400/30" />
                    </div>
                    <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em]">No upcoming events right now.</p>
                    <p className="text-sm text-slate-400 mt-2 font-medium">Your schedule is currently clear.</p>
                  </div>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group relative flex items-center gap-6 rounded-[2rem] border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl p-6 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-2px] hover:border-indigo-500/30"
                    >
                      <div className="hidden sm:flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-inner">
                        <Briefcase className="h-7 w-7" />
                      </div>
                      
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="text-lg font-black text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">{event.title}</h4>
                            <p className="text-sm font-bold text-slate-500 mt-1 uppercase tracking-widest">{event.company}</p>
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            <span className="bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 inline-flex items-center rounded-full px-4 py-1 text-[10px] font-black uppercase tracking-[0.2em] border border-indigo-500/10 shadow-sm">
                              Interview
                            </span>
                            <CountdownTimer targetDate={event.startTime} />
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.15em]">
                          <div className="flex items-center gap-2.5">
                            <Clock3 className="h-4 w-4 text-indigo-500" />
                            <span>
                              {new Date(event.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                              {new Date(event.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <MapPin className="h-4 w-4 text-rose-500" />
                            <span>{event.venue}</span>
                          </div>
                          <div className="flex items-center gap-2.5">
                            <Calendar className="h-4 w-4 text-emerald-500" />
                            <span>{new Date(event.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-2 group-hover:translate-x-0">
                        <ChevronRight className="h-6 w-6 text-indigo-500" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Column */}
            <div className="lg:col-span-4 space-y-6">
              <div className="px-4">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Navigation</h3>
                <p className="text-sm text-slate-500 mt-1 font-medium">Quick access modules</p>
              </div>

              <div className="grid gap-4">
                {[
                  { to: "/student/profile", icon: User, label: "My Profile", sub: "Personal & Academic", color: "indigo" },
                  { to: "/student/jobs", icon: Briefcase, label: "Job Portal", sub: "Explore opportunities", color: "emerald" },
                  { to: "/student/application", icon: FileText, label: "Applications", sub: "Track your status", color: "cyan" },
                  { to: "/student/notifications", icon: Bell, label: "My Alerts", sub: "Recent updates", color: "amber" },
                ].map(({ to, icon: Icon, label, sub, color }) => (
                  <Link
                    key={to}
                    to={to}
                    className="group flex items-center gap-6 rounded-[2rem] border border-slate-200/60 dark:border-white/[0.08] bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl p-6 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-2px] hover:border-indigo-500/30"
                  >
                    <div className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-${color}-500/10 text-${color}-600 dark:text-${color}-400 shadow-inner transition-transform duration-500 group-hover:scale-110`}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-base font-black text-slate-900 dark:text-white tracking-tight">{label}</p>
                      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{sub}</p>
                    </div>
                    <ArrowUpRight className="h-5 w-5 text-slate-400 dark:text-slate-600 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-500" />
                  </Link>
                ))}
              </div>

              {/* Bonus Tip Card */}
              <div className="rounded-[2.5rem] bg-indigo-500/5 dark:bg-indigo-500/10 border border-indigo-500/10 dark:border-indigo-500/20 p-8 mt-8 shadow-inner relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <Sparkles size={120} className="text-indigo-500" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-3 bg-indigo-500/20 rounded-xl text-indigo-600 dark:text-indigo-400 shadow-xl">
                      <Sparkles className="h-5 w-5" />
                    </div>
                    <h4 className="text-[11px] font-black text-indigo-600 dark:text-indigo-300 uppercase tracking-[0.2em]">Recruiter Insight</h4>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-indigo-100/70 leading-relaxed font-semibold">
                    Candidates who update their skills bi-weekly are <span className="text-indigo-600 dark:text-indigo-400 font-black underline decoration-indigo-500/30 underline-offset-4">40% more likely</span> to get noticed by top-tier recruiters.
                  </p>
                </div>
              </div>
            </div>

          </div>
      </div>
    </div>
  )
}