import { useEffect, useState } from "react"
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
  Calendar,
  ArrowUpRight,
} from "lucide-react"

import type { AppDispatch } from "@/redux/store/store"
import type { RootState } from "@/redux/reducers/rootReducer"
import { fetchUnreadCount } from "@/redux/thunks/notificationThunks"
import { fetchUpcomingEvents } from "@/redux/thunks/upcomingEventThunks"
import { useSocket } from "@/socket/SocketProvider"
import { SOCKET_EVENTS } from "@/socket/socket.events"
import { toast } from "sonner"
import CountdownTimer from "@/components/CountdownTimer"
import { DashboardUpcomingEventsDialog } from "@/components/dashboard/DashboardUpcomingEventsDialog"

export default function StudentDashboard() {
  const [showAllEvents, setShowAllEvents] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { socket } = useSocket()

const { unreadCount = 0 } = useSelector(
  (state: RootState) => state.notification || {}
)

const upcomingEvents = useSelector(
  (state: RootState) => state.upcomingEvents?.data?.items || []
)


 // ✅ ADDED: get user
  const { user } = useSelector((state: RootState) => state.auth)

  const nextEvent = upcomingEvents.length > 0 ? upcomingEvents[0] : null
useEffect(() => {
  dispatch(fetchUpcomingEvents({ page: 1, limit: 10 }))
  dispatch(fetchUnreadCount())
}, [dispatch])


  // 🔍 DIAGNOSTIC: Log state changes
  useEffect(() => {
    console.log("📊 UI STATE UPDATE:", {
      upcomingEventsCount: upcomingEvents.length,
      unreadCount,
      socketConnected: socket?.connected,
      socketId: socket?.id
    });
  }, [upcomingEvents, unreadCount, socket]);

  // 🔍 DIAGNOSTIC: Log socket events
  useEffect(() => {
    if (!socket) return;
    
    const onAny = (event: string, ...args: any[]) => {
      console.log(`📡 RAW SOCKET EVENT: ${event}`, args);
    };
    
    socket.onAny(onAny);
    return () => { socket.offAny(onAny); };
  }, [socket]);

useEffect(() => {
  if (!socket) {
    console.log("⚠️ No socket instance available in StudentDashboard");
    return;
  }

  const handleUpdate = () => {
    console.log("🔄 Socket Event Received: Refreshing Dashboard Data...");
   
    dispatch(fetchUnreadCount());
  };

  const handleNewJob = (data: any) => {
    console.log("🆕 New Job Event Received:", data);
    handleUpdate();
    toast.success("New Job Opportunity", {
      description: data?.title ? `A new position "${data.title}" has been posted.` : "A new job opportunity is available."
    });
  };

  const handleScheduleUpdate = (data: any) => {
    console.log("📅 Schedule Event Received:", data);
    handleUpdate();
    toast.info("Schedule Updated", {
      description: `New event: ${data?.title || "Check your dashboard"}`
    });
  };

  const handleStatusUpdate = (data: any) => {
    console.log("📝 Application Status Updated:", data);
    // Refresh data but don't show toast here as SocketProvider handles the global notification
    handleUpdate();
  };

  socket.on(SOCKET_EVENTS.NEW_JOB, handleNewJob);
  socket.on(SOCKET_EVENTS.APPLICATION_STATUS_UPDATED, handleStatusUpdate);
  socket.on(SOCKET_EVENTS.SCHEDULE_CREATED, handleScheduleUpdate);
  socket.on(SOCKET_EVENTS.SCHEDULE_APPROVED, handleScheduleUpdate);

  console.log("✅ Socket Listeners Attached in StudentDashboard");

  return () => {
    console.log("🚿 Cleaning up socket listeners in StudentDashboard");
    socket.off(SOCKET_EVENTS.NEW_JOB, handleNewJob);
    socket.off(SOCKET_EVENTS.APPLICATION_STATUS_UPDATED, handleStatusUpdate);
    socket.off(SOCKET_EVENTS.SCHEDULE_CREATED, handleScheduleUpdate);
    socket.off(SOCKET_EVENTS.SCHEDULE_APPROVED, handleScheduleUpdate);
  };
}, [socket, dispatch]);

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full p-4 md:p-8 space-y-8 student-hero-animate">

        {/* Hero Section */}
        <section className="student-hero-banner relative overflow-hidden">
          <div className="student-hero-mesh">
            <div className="bubble-indigo"></div>
            <div className="bubble-sky"></div>
          </div>
          <div className="student-hero-texture"></div>
          <div className="student-hero-glass-stroke"></div>
          <div className="hero-scanline"></div>
          
          <div className="relative z-10">
            <div className="student-hero-badge mb-6">
              <span>Student Overview</span>
            </div>
            <h1 
              className="student-hero-title text-3xl md:text-5xl cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => toast.success("Toast System Operational ✅", { description: "You just triggered a manual test toast." })}
            >
              Welcome back, <span className="text-primary">{user?.firstname || "Student"}</span>
            </h1>
            <p className="student-hero-description mt-4 text-base md:text-lg">
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
              color: "blue",
              bg: "bg-blue-50",
              iconColor: "text-blue-500"
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
              className="bg-card rounded-[1.5rem] p-7 shadow-sm border border-border transition-all hover:shadow-md group"
            >
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className={`p-3 rounded-xl ${stat.bg} dark:bg-primary/10 transition-transform group-hover:scale-110`}>
                  <stat.icon className={`h-6 w-6 ${stat.iconColor} dark:text-primary`} />
                </div>
                {stat.isNext && nextEvent && (
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    <div className="text-[10px] font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                      Next Up
                    </div>
                    <CountdownTimer targetDate={nextEvent.startTime} />
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </p>
                {stat.isNext ? (
                  <div className="mt-2">
                    <p className="text-xl font-bold text-foreground truncate">
                      {nextEvent ? nextEvent.title : "No events"}
                    </p>
                    <p className="text-xs font-medium text-muted-foreground mt-1">
                      {nextEvent ? new Date(nextEvent.startTime).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : "All caught up"}
                    </p>
                  </div>
                ) : (
                  <p className="mt-2 text-4xl font-extrabold text-foreground">
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
              <h3 className="text-2xl font-bold text-foreground tracking-tight">Upcoming Schedule</h3>
              <button
                type="button"
                onClick={() => setShowAllEvents(true)}
                className="text-sm font-semibold text-primary hover:opacity-80 transition-opacity"
              >
                View all
              </button>
            </div>

            <div className="space-y-4">
              {upcomingEvents.length === 0 ? (
                <div className="border-2 border-dashed border-border rounded-[2.5rem] py-24 flex flex-col items-center justify-center text-center bg-muted/20">
                  <div className="bg-card p-6 rounded-3xl shadow-sm mb-6 transition-transform hover:scale-105">
                    <Calendar className="h-10 w-10 text-primary/40" />
                  </div>
                  <p className="text-foreground font-bold text-lg tracking-tight">Your schedule is clear</p>
                  <p className="text-sm text-muted-foreground mt-2 max-w-xs mx-auto">
                    We couldn't find any upcoming events. Stay tuned for new placement activities and interviews!
                  </p>
                </div>
              ) : (
                upcomingEvents.map((event) => (
                 <div
  key={event.id}
  className="bg-card border border-border rounded-2xl p-5 flex items-center gap-5 transition-all hover:border-primary/50 group shadow-sm"
>
  {/* Icon */}
  <div className="h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
    <Briefcase className="h-6 w-6" />
  </div>

  {/* Content */}
  <div className="flex-1 min-w-0">
    <h4 className="text-base font-bold text-foreground truncate">
      {event.title}
    </h4>

    <p className="text-sm text-muted-foreground truncate">
      {event.company?.name || "Placement Event"}
    </p>

    {event.description && (
      <p className="text-xs text-muted-foreground mt-1 line-clamp-1">
        {event.description}
      </p>
    )}
  </div>

  {/* Time */}
  <div className="text-right hidden sm:block shrink-0">
    <p className="text-sm font-bold text-foreground">
      {new Date(event.startTime).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}
    </p>

    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mt-0.5">
      {new Date(event.startTime).toLocaleDateString([], {
        day: "numeric",
        month: "short",
      })}
    </p>
  </div>

  <ChevronRight className="h-5 w-5 text-muted-foreground/40 group-hover:text-primary transition-all group-hover:translate-x-1 shrink-0" />
</div>
                ))
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="lg:col-span-4 space-y-6">
            <h3 className="text-2xl font-bold text-foreground tracking-tight">Navigation</h3>
            <div className="grid gap-4">
              {[
                { to: "/student/profile", icon: User, label: "My Profile", color: "blue", bg: "bg-blue-50" },
                { to: "/student/jobs", icon: Briefcase, label: "Job Portal", color: "emerald", bg: "bg-emerald-50" },
                { to: "/student/application", icon: FileText, label: "Applications", color: "cyan", bg: "bg-cyan-50" },
                { to: "/student/notifications", icon: Bell, label: "Notifications", color: "amber", bg: "bg-amber-50" },
              ].map((nav) => (
                <Link
                  key={nav.to}
                  to={nav.to}
                  className="bg-card border border-border rounded-2xl p-4 flex items-center gap-4 transition-all hover:shadow-md hover:translate-y-[-2px] group"
                >
                  <div className={`h-11 w-11 rounded-xl ${nav.bg} dark:bg-primary/10 flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <nav.icon className={`h-5 w-5 text-${nav.color}-500 dark:text-primary`} />
                  </div>
                  <span className="font-bold text-foreground/80 dark:text-foreground flex-1">{nav.label}</span>
                  <ArrowUpRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                </Link>
              ))}
            </div>

            {/* Recruiter Insight Card */}
            <div className="bg-primary rounded-[2rem] p-8 text-white relative overflow-hidden group">
              <div className="glass-texture"></div>
              <div className="absolute top-0 right-0 p-6 opacity-10 transition-transform group-hover:scale-110">
                <Sparkles size={80} />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="h-4 w-4 text-primary-foreground/60" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary-foreground/60">Pro Insight</span>
                </div>
                <p className="text-sm font-medium leading-relaxed opacity-90">
                  Update your skills bi-weekly to increase visibility by <span className="font-bold text-primary-foreground">40%</span> to top recruiters.
                </p>
              </div>
            </div>
          </div>

        </section>
      </div>

      <DashboardUpcomingEventsDialog open={showAllEvents} onOpenChange={setShowAllEvents} />
    </div>

  )
}