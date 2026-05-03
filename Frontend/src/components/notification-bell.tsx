import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useSocket } from "@/socket/SocketProvider";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import type { AppDispatch } from "@/redux/store/store";
import type { RootState } from "@/redux/reducers/rootReducer";
import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/redux/thunks/notificationThunks";
import useAuth from "@/redux/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const { userType } = useAuth();
  const navigate = useNavigate();
  const apiUnreadCount = useSelector((state: RootState) => state.notification.unreadCount);
  const apiNotifications = useSelector((state: RootState) => state.notification.items);
  const isLoggedIn = !!userType;
  const isStudent = userType === "STUDENT";

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchUnreadCount());
      dispatch(fetchNotifications({ page: 1, limit: 10 }));
    }
  }, [dispatch, isLoggedIn]);

  const mappedApiNotifications = apiNotifications.map((notification) => ({
    id: notification.id,
    title: notification.title || "Notification",
    message: notification.message || "No message available.",
    timestamp: notification.createdAt
      ? new Date(notification.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "",
    read: notification.read,
  }));

  const displayedNotifications = mappedApiNotifications.length > 0 ? mappedApiNotifications : notifications;
  const displayedUnreadCount = mappedApiNotifications.length > 0 ? apiUnreadCount : unreadCount;
  const notificationsPagePath =
    userType === "ADMIN"
      ? "/admin/notification"
      : userType === "COMPANY"
        ? "/company/notifications"
        : "/student/notifications";

  const totalUnreadCount = Math.max(unreadCount, apiUnreadCount);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-10 w-10 rounded-2xl bg-white/5 hover:bg-white/10 text-muted-foreground hover:text-foreground transition-all duration-300 border border-white/5 hover:border-white/10 active:scale-90"
        >
          <Bell className={cn("h-5 w-5", totalUnreadCount > 0 && "animate-[bell-swing_2s_infinite]")} />
          {totalUnreadCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[9px] font-black text-white border-4 border-[#0f172a] shadow-xl">
              {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-[380px] p-0 overflow-hidden rounded-[2rem] border border-slate-200/60 dark:border-white/10 bg-white/95 dark:bg-[#1e1f26]/95 backdrop-blur-2xl shadow-2xl shadow-black/40"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 dark:border-white/[0.05] bg-slate-50/50 dark:bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <h3 className="font-black text-xs uppercase tracking-[0.2em] text-foreground">Activity Pulse</h3>
            {totalUnreadCount > 0 && (
              <span className="rounded-lg bg-primary/10 px-2 py-0.5 text-[9px] font-black text-primary uppercase tracking-widest border border-primary/10">
                {totalUnreadCount} New
              </span>
            )}
          </div>
          <div className="flex gap-2">
            {displayedUnreadCount > 0 && (
              <button
                className="text-[9px] font-black uppercase tracking-widest text-primary hover:text-primary/70 transition-colors"
                onClick={() => {
                  dispatch(markAllNotificationsAsRead());
                  markAllAsRead();
                }}
              >
                Clear All
              </button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[420px] overflow-y-auto no-scrollbar">
          {displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-8 text-center group">
              <div className="h-16 w-16 rounded-[1.5rem] bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-500 shadow-inner">
                <Bell className="h-7 w-7 text-muted-foreground opacity-30" />
              </div>
              <p className="text-xs font-black text-foreground uppercase tracking-widest">Feed is Empty</p>
              <p className="text-[10px] text-muted-foreground mt-1 font-medium">We'll notify you about important events.</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-slate-100 dark:divide-white/[0.04]">
              {displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "relative px-6 py-5 flex gap-4 cursor-pointer transition-all duration-300 hover:bg-slate-50 dark:hover:bg-white/[0.03] group",
                    !notification.read ? "bg-primary/[0.03]" : ""
                  )}
                  onClick={async () => {
                    if (!notification.read) {
                      await dispatch(markNotificationAsRead(Number(notification.id)));
                      dispatch(fetchUnreadCount());
                      markAsRead(String(notification.id));
                    }
                    navigate(notificationsPagePath);
                  }}
                >
                  {/* Unread indicator bar */}
                  {!notification.read && (
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                  )}

                  <div className={cn(
                    "mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border shadow-sm transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                    !notification.read ? "bg-primary/10 text-primary border-primary/20" : "bg-muted/50 text-muted-foreground border-border/50"
                  )}>
                    <Bell size={18} strokeWidth={2.5} />
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <p className={cn(
                        "text-xs truncate transition-colors", 
                        !notification.read ? "font-black text-foreground" : "font-bold text-muted-foreground"
                      )}>
                        {notification.title}
                      </p>
                      <span className="text-[9px] font-black text-muted-foreground/40 whitespace-nowrap shrink-0 uppercase tracking-widest">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground font-medium line-clamp-2 leading-relaxed opacity-80 group-hover:opacity-100 transition-opacity">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer link */}
        <div className="p-4 bg-slate-50/50 dark:bg-white/[0.02] border-t border-slate-100 dark:border-white/[0.05]">
          <button
            onClick={() => navigate(notificationsPagePath)}
            className="w-full py-3 rounded-xl bg-white dark:bg-white/5 border border-slate-200 dark:border-white/10 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm"
          >
            View Full Center →
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
