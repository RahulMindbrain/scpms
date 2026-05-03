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
          className="relative h-9 w-9 rounded-full bg-[rgba(255,255,255,0.04)] hover:bg-[rgba(255,255,255,0.08)] text-[#908fa0] hover:text-[#e2e2eb] transition-colors"
        >
          <Bell className="h-[1.1rem] w-[1.1rem]" />
          {totalUnreadCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-600 text-[9px] font-bold text-white border border-[#111319]">
              {totalUnreadCount > 9 ? "9+" : totalUnreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-80 p-0 overflow-hidden rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1e1f26] shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[rgba(255,255,255,0.06)] bg-[#191b22]">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-sm text-[#e2e2eb]">Notifications</h3>
            {totalUnreadCount > 0 && (
              <span className="rounded-full bg-indigo-500/15 px-2 py-0.5 text-[10px] font-bold text-indigo-400">
                {totalUnreadCount} new
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {!isStudent && notifications.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition-colors"
                onClick={clearNotifications}
              >
                Clear
              </Button>
            )}
            {displayedUnreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 text-xs font-medium text-indigo-400 hover:text-indigo-300 hover:bg-indigo-500/10 transition-colors"
                onClick={() => {
                  dispatch(markAllNotificationsAsRead());
                  markAllAsRead();
                }}
              >
                Mark all read
              </Button>
            )}
          </div>
        </div>

        {/* Notification List */}
        <div className="max-h-[340px] overflow-y-auto">
          {displayedNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
              <div className="h-12 w-12 rounded-full bg-[rgba(255,255,255,0.05)] flex items-center justify-center mb-3">
                <Bell className="h-5 w-5 text-[#908fa0]" />
              </div>
              <p className="text-sm font-medium text-[#c7c4d7]">No notifications</p>
              <p className="text-xs text-[#908fa0] mt-1">You're all caught up!</p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-[rgba(255,255,255,0.04)]">
              {displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`relative px-4 py-3.5 flex gap-3 cursor-pointer transition-colors hover:bg-[rgba(255,255,255,0.04)] group ${
                    !notification.read ? "bg-indigo-500/[0.05]" : ""
                  }`}
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
                    <div className="absolute left-0 top-3 bottom-3 w-0.5 bg-indigo-500 rounded-full" />
                  )}

                  {/* Icon dot */}
                  <div className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${!notification.read ? "bg-indigo-400" : "bg-[rgba(255,255,255,0.15)]"}`} />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-0.5">
                      <p className={`text-sm truncate ${!notification.read ? "font-semibold text-[#e2e2eb]" : "font-medium text-[#c7c4d7]"}`}>
                        {notification.title}
                      </p>
                      <span className="text-[10px] text-[#908fa0] whitespace-nowrap shrink-0 mt-0.5">
                        {notification.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-[#908fa0] line-clamp-2 leading-relaxed">
                      {notification.message}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer link */}
        <div className="border-t border-[rgba(255,255,255,0.06)] bg-[#191b22]">
          <button
            onClick={() => navigate(notificationsPagePath)}
            className="w-full py-2.5 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            View all notifications →
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
