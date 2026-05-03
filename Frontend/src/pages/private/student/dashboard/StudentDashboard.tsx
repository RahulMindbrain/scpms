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
  Timer,
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
    <div className="flex flex-1 flex-col bg-[#111319]">
      <div className="@container/main flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8">

          {/* Hero Banner */}
          <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 p-6 text-white shadow-xl shadow-indigo-900/30">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-cyan-300/10 blur-2xl" />
            <p className="relative inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3 py-1 text-xs text-indigo-100">
              <Sparkles className="h-3.5 w-3.5" /> Student Portal
            </p>
            <h1 className="mt-2 text-2xl font-bold md:text-3xl">
              {user?.firstname ? `Welcome back, ${user.firstname} 👋` : "Track your placement journey"}
            </h1>
            <p className="mt-1 text-sm text-indigo-200">
              Stay updated with interviews, notifications, and important actions.
            </p>
          </div>

          {/* Stat Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1e1f26] p-5 border-t-2 border-t-indigo-500/70">
              <div className="flex items-start justify-between">
                <p className="text-sm text-[#908fa0] font-medium">Upcoming Events</p>
                <div className="p-1.5 bg-indigo-500/10 rounded-lg">
                  <CalendarClock className="h-4 w-4 text-indigo-400" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-[#e2e2eb]">{upcomingEvents.length}</p>
              <p className="mt-1 text-xs text-[#908fa0]">Interviews and schedule events</p>
            </div>

            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1e1f26] p-5 border-t-2 border-t-amber-500/70">
              <div className="flex items-start justify-between">
                <p className="text-sm text-[#908fa0] font-medium">Unread Notifications</p>
                <div className="p-1.5 bg-amber-500/10 rounded-lg">
                  <Bell className="h-4 w-4 text-amber-400" />
                </div>
              </div>
              <p className="mt-3 text-3xl font-bold text-[#e2e2eb]">{unreadCount}</p>
              <p className="mt-1 text-xs text-[#908fa0]">Check your latest updates</p>
            </div>

            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1e1f26] p-5 border-t-2 border-t-emerald-500/70 sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between">
                <p className="text-sm text-[#908fa0] font-medium">Next Event</p>
                <div className="p-1.5 bg-emerald-500/10 rounded-lg">
                  <ChevronRight className="h-4 w-4 text-emerald-400" />
                </div>
              </div>
              <div className="mt-3">
                <p className="line-clamp-1 text-base font-semibold text-slate-900">
                  {nextEvent ? nextEvent.title : "No event scheduled"}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-slate-500">
                    {nextEvent ? new Date(nextEvent.startTime).toLocaleString() : "You are all caught up"}
                  </p>
                  {nextEvent && <CountdownTimer targetDate={nextEvent.startTime} />}
                </div>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Upcoming Events Panel */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1e1f26] p-5 lg:col-span-2">
              <h3 className="text-base font-semibold text-[#e2e2eb]">Upcoming Events</h3>
              <p className="mt-1 text-sm text-[#908fa0]">Your upcoming interviews and placement activities</p>

              <div className="mt-4 space-y-3">
                {loading && upcomingEvents.length === 0 ? (
                  <Loader size="sm" text="Loading events..." />
                ) : upcomingEvents.length === 0 ? (
                  <p className="text-sm text-[#908fa0] py-6 text-center">No upcoming events right now.</p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#191b22] p-4 transition hover:-translate-y-0.5 hover:border-indigo-500/30 hover:shadow-md hover:shadow-indigo-900/20"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-[#e2e2eb]">{event.title}</p>
                          <p className="text-sm text-[#908fa0]">{event.company}</p>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 group-hover:bg-blue-100">
                            Event
                          </span>
                          <CountdownTimer targetDate={event.startTime} />
                        </div>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-[#908fa0] md:grid-cols-2">
                        <p className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-[#908fa0]" />
                          {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                        </p>
                        <p className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-[#908fa0]" />
                          {event.venue}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1e1f26] p-5">
              <h3 className="text-base font-semibold text-[#e2e2eb]">Quick Actions</h3>
              <p className="mt-1 text-sm text-[#908fa0]">Open key student sections quickly</p>

              <div className="mt-4 space-y-2">
                {[
                  { to: "/student/profile", icon: User, label: "Update Profile", color: "text-indigo-400", bg: "bg-indigo-500/10" },
                  { to: "/student/jobs", icon: Briefcase, label: "Explore Jobs", color: "text-emerald-400", bg: "bg-emerald-500/10" },
                  { to: "/student/application", icon: FileText, label: "Track Applications", color: "text-cyan-400", bg: "bg-cyan-500/10" },
                  { to: "/student/notifications", icon: Bell, label: "View Notifications", color: "text-amber-400", bg: "bg-amber-500/10" },
                ].map(({ to, icon: Icon, label, color, bg }) => (
                  <Link
                    key={to}
                    to={to}
                    className="flex items-center justify-between rounded-xl border border-[rgba(255,255,255,0.06)] bg-[#191b22] p-3 text-sm text-[#c7c4d7] transition hover:border-indigo-500/25 hover:bg-[rgba(99,102,241,0.05)]"
                  >
                    <span className="flex items-center gap-2.5">
                      <span className={`p-1 rounded-lg ${bg}`}>
                        <Icon className={`h-4 w-4 ${color}`} />
                      </span>
                      {label}
                    </span>
                    <ChevronRight className="h-4 w-4 text-[#908fa0]" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}