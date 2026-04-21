import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bell, Check, Loader2, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";
import type { AppDispatch } from "@/redux/store/store";
import type { RootState } from "@/redux/reducers/rootReducer";
import {
  fetchNotifications,
  fetchUnreadCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "@/redux/thunks/notificationThunks";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

export function NotificationBell() {
  const dispatch = useDispatch<AppDispatch>();
  const {
    items: notifications = [],
    unreadCount = 0,
    loading = false,
  } = useSelector((state: RootState) => state.notification || {});
  const { userType } = useSelector((state: RootState) => state.auth || {});

  useEffect(() => {
    if (userType === "ADMIN") return;
    dispatch(fetchUnreadCount());
    dispatch(fetchNotifications({ page: 1, limit: 5 }));
  }, [dispatch, userType]);

  if (userType === "ADMIN") return null;

  const handleMarkAsRead = async (id: number) => {
    try {
      await dispatch(markNotificationAsRead(id)).unwrap();
    } catch (error: any) {
      toast.error(error?.toString() || "Failed to mark as read");
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      toast.success("All notifications marked as read");
    } catch (error: any) {
      toast.error(error?.toString() || "Failed to mark all as read");
    }
  };

  const handleDelete = async (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    try {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success("Notification deleted");
    } catch (error: any) {
      toast.error(error?.toString() || "Failed to delete notification");
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-9 w-9 rounded-full bg-muted/50 hover:bg-muted">
          <Bell className="h-[1.1rem] w-[1.1rem]" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 px-1.5 py-0.5 text-[10px] min-w-[1.2rem] h-[1.2rem] flex items-center justify-center rounded-full border-2 border-background animate-in zoom-in duration-300"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 p-0 overflow-hidden rounded-xl border-border shadow-2xl">
        <div className="flex flex-col">
          <div className="flex items-center justify-between p-4 border-b bg-muted/30">
            <h3 className="font-semibold text-sm">Notifications</h3>
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50/50 transition-colors"
                onClick={handleMarkAllRead}
              >
                Mark all read
              </Button>
            )}
          </div>

          <div className="max-h-[350px] overflow-y-auto overflow-x-hidden custom-scrollbar">
            {loading && notifications.length === 0 ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                  <Bell className="h-6 w-6 text-muted-foreground/50" />
                </div>
                <p className="text-sm font-medium text-foreground">No notifications</p>
                <p className="text-xs text-muted-foreground mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border/50">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`relative p-4 flex gap-3 hover:bg-muted/50 transition-colors cursor-pointer group ${
                      !notification.read ? "bg-muted/20" : ""
                    }`}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
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
                          {formatTime(notification.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {notification.message}
                      </p>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, notification.id)}
                      className="opacity-0 group-hover:opacity-100 h-7 w-7 rounded-md flex items-center justify-center text-muted-foreground hover:text-red-500 hover:bg-red-50 transition-all shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="p-2 border-t bg-muted/10">
            <Link to={userType === "COMPANY" ? "/company/dashboard" : "/student/notifications"}>
              <Button variant="ghost" className="w-full h-8 text-xs font-medium text-muted-foreground hover:text-foreground">
                See all notifications
              </Button>
            </Link>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
