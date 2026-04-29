import { Bell } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const { userType } = useAuth();
  const navigate = useNavigate();
  const apiUnreadCount = useSelector((state: RootState) => state.notification.unreadCount);
  const apiNotifications = useSelector((state: RootState) => state.notification.items);
  const isStudent = userType === "STUDENT";

  useEffect(() => {
    if (isStudent) {
      dispatch(fetchUnreadCount());
      dispatch(fetchNotifications({ page: 1, limit: 10 }));
    }
  }, [dispatch, isStudent]);

  const studentNotifications = apiNotifications.map((notification) => ({
    id: notification.id,
    title: notification.title || "Notification",
    message: notification.message || "No message available.",
    timestamp: notification.createdAt
      ? new Date(notification.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      : "",
    read: notification.read,
  }));

  const displayedNotifications = isStudent ? studentNotifications : notifications;
  const displayedUnreadCount = isStudent ? apiUnreadCount : unreadCount;
  const notificationsPagePath =
    userType === "ADMIN"
      ? "/admin/notification"
      : userType === "COMPANY"
        ? "/company/interviews"
        : "/student/notifications";

  const totalUnreadCount = isStudent
    ? Math.max(unreadCount, apiUnreadCount)
    : unreadCount;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-muted/50 hover:bg-muted">
          <Bell className="h-[1.1rem] w-[1.1rem]" />
          {totalUnreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 px-1.5 py-0.5 text-[10px] min-w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in duration-300"
            >
              {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-xl border-border shadow-2xl">
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <h3 className="font-semibold text-sm">Notifications</h3>
            <div className="flex gap-2">
                {!isStudent && notifications.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50/50 transition-colors"
                    onClick={clearNotifications}
                  >
                    Clear all
                  </Button>
                )}
                {displayedUnreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 transition-colors"
                    onClick={() => {
                      if (isStudent) {
                        dispatch(markAllNotificationsAsRead());
                      } else {
                        markAllAsRead();
                      }
                    }}
                  >
                    Mark all read
                  </Button>
                )}
            </div>
          </div>

          <div className="max-h-[350px] overflow-y-auto overflow-x-hidden custom-scrollbar">
            {displayedNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground">No notifications</p>
                <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border/50">
                {displayedNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer group ${
                      !notification.read ? "bg-muted/20" : ""
                    }`}
                    onClick={async () => {
                      if (!notification.read) {
                        if (isStudent) {
                          await dispatch(markNotificationAsRead(Number(notification.id)));
                          dispatch(fetchUnreadCount());
                        } else {
                          markAsRead(String(notification.id));
                        }
                      }
                      navigate(notificationsPagePath);
                    }}
                  >
                    {!notification.read && (
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-full" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`text-sm ${!notification.read ? "font-semibold" : "font-medium"} text-foreground truncate`}>
                          {notification.title}
                        </p>
                        <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0 mt-0.5 font-medium">
                          {notification.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

