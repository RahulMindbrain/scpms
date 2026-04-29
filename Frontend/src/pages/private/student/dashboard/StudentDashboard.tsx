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
} from "lucide-react"
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

  // ✅ ADDED: get user
  const { user } = useSelector((state: RootState) => state.auth)

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null

  useEffect(() => {
    dispatch(fetchUpcomingEvents())
    dispatch(fetchUnreadCount())
  }, [dispatch])

  // ✅ ADDED: JOIN SOCKET LOGIC
  useEffect(() => {
    if (!socket || !user) return;

    const handleConnect = () => {
      socket.emit("join", {
        userId: user.id,
        role: user.role,
      });

      console.log("✅ Joined socket:", user.id, user.role);
    };

    // if already connected
    if (socket.connected) {
      handleConnect();
    }

    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket, user]);

  // ✅ EXISTING LISTENERS (unchanged)
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
    <div className="flex flex-1 flex-col bg-linear-to-b from-slate-50 via-blue-50/30 to-indigo-50/40">
      <div className="@container/main flex flex-1 flex-col">
        <div className="mx-auto w-full max-w-7xl space-y-6 px-4 py-6 md:px-6 md:py-8">
          <div className="relative overflow-hidden rounded-3xl border border-blue-200/70 bg-linear-to-r from-blue-600 via-indigo-600 to-violet-600 p-6 text-white shadow-lg shadow-blue-900/20">
            <div className="absolute -right-16 -top-16 h-44 w-44 rounded-full bg-white/10 blur-2xl" />
            <div className="absolute -bottom-16 left-1/3 h-40 w-40 rounded-full bg-cyan-300/20 blur-2xl" />
            <p className="relative inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-3 py-1 text-xs text-blue-100">
              <Sparkles className="h-3.5 w-3.5" /> Student Dashboard
            </p>
            <h1 className="mt-1 text-2xl font-semibold md:text-3xl">Track your placement journey</h1>
            <p className="mt-2 text-sm text-blue-100">
              Stay updated with interviews, notifications, and important actions.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur">
              <div className="flex items-start justify-between">
                <p className="text-sm text-slate-500">Upcoming Events</p>
                <CalendarClock className="h-4 w-4 text-blue-600" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{upcomingEvents.length}</p>
              <p className="mt-1 text-xs text-slate-500">Interviews and schedule events</p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur">
              <div className="flex items-start justify-between">
                <p className="text-sm text-slate-500">Unread Notifications</p>
                <Bell className="h-4 w-4 text-amber-600" />
              </div>
              <p className="mt-3 text-2xl font-semibold text-slate-900">{unreadCount}</p>
              <p className="mt-1 text-xs text-slate-500">Check your latest updates</p>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/90 p-4 shadow-sm backdrop-blur sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between">
                <p className="text-sm text-slate-500">Next Event</p>
                <ChevronRight className="h-4 w-4 text-emerald-600" />
              </div>
              <p className="mt-3 line-clamp-1 text-base font-semibold text-slate-900">
                {nextEvent ? nextEvent.title : "No event scheduled"}
              </p>
              <p className="mt-1 text-xs text-slate-500">
                {nextEvent ? new Date(nextEvent.startTime).toLocaleString() : "You are all caught up"}
              </p>
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm backdrop-blur lg:col-span-2">
              <h3 className="text-lg font-semibold text-slate-900">Upcoming Events</h3>
              <p className="mt-1 text-sm text-slate-500">Your upcoming interviews and placement activities</p>

              <div className="mt-4 space-y-3">
                {loading && upcomingEvents.length === 0 ? (
                  <Loader size="sm" text="Loading events..." />
                ) : upcomingEvents.length === 0 ? (
                  <p className="text-sm text-slate-500">No upcoming events right now.</p>
                ) : (
                  upcomingEvents.map((event) => (
                    <div
                      key={event.id}
                      className="group rounded-xl border border-slate-200/80 bg-white p-4 transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-md"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-slate-900">{event.title}</p>
                          <p className="text-sm text-slate-600">{event.company}</p>
                        </div>
                        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-700 group-hover:bg-blue-100">
                          Event
                        </span>
                      </div>
                      <div className="mt-3 grid gap-2 text-sm text-slate-500 md:grid-cols-2">
                        <p className="inline-flex items-center gap-1.5">
                          <Clock3 className="h-3.5 w-3.5 text-slate-400" />
                          {new Date(event.startTime).toLocaleString()} - {new Date(event.endTime).toLocaleString()}
                        </p>
                        <p className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5 text-slate-400" />
                          {event.venue}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-white/60 bg-white/90 p-5 shadow-sm backdrop-blur">
              <h3 className="text-lg font-semibold text-slate-900">Quick Actions</h3>
              <p className="mt-1 text-sm text-slate-500">Open key student sections quickly</p>

              <div className="mt-4 space-y-2">
                <Link to="/student/profile" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/40">
                  <span className="flex items-center gap-2"><User className="h-4 w-4" /> Update Profile</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link to="/student/jobs" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/40">
                  <span className="flex items-center gap-2"><Briefcase className="h-4 w-4" /> Explore Jobs</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link to="/student/application" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/40">
                  <span className="flex items-center gap-2"><FileText className="h-4 w-4" /> Track Applications</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
                <Link to="/student/notifications" className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-3 text-sm text-slate-700 transition hover:border-blue-300 hover:bg-blue-50/40">
                  <span className="flex items-center gap-2"><Bell className="h-4 w-4" /> View Notifications</span>
                  <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}