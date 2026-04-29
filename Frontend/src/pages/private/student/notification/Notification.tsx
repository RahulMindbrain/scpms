import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bell,
  Briefcase,
  Calendar,
  Clock,
  Info,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import {
  fetchNotifications,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  deleteNotification,
} from '@/redux/thunks/notificationThunks';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type NotificationFilter = 'all' | 'unread' | 'read';
type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

const Notification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const {
    items: notifications = [],
    loading = false,
    pagination = { page: 1, limit: 10, totalPages: 0 },
  } = useSelector((state: RootState) => state.notification || {});

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      toast.success('All notifications marked as read.');
    } catch (error: any) {
      toast.error(error?.toString() || 'Failed to mark all as read');
    }
  };

  const handleMarkAsRead = async (id: number, showToast = true) => {
    try {
      await dispatch(markNotificationAsRead(id)).unwrap();
      if (showToast) toast.success('Notification marked as read');
    } catch (error: any) {
      toast.error(error?.toString() || 'Failed to mark as read');
    }
  };

  const handleViewDetails = async (notification: NotificationItem) => {
    if (!notification.read) {
      await handleMarkAsRead(notification.id, false);
    }
    setSelectedNotification(notification);
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success('Notification removed');
    } catch (error: any) {
      toast.error(error?.toString() || 'Failed to remove notification');
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  const getTagConfig = (type: string) => {
    switch (type) {
      case 'APPLICATION_SELECTED':
      case 'OFFER_ACCEPTED':
        return { label: 'Selected', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'JOB_POSTED':
      case 'JOB_UPDATED':
        return { label: 'Job', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
      case 'SCHEDULE_CREATED':
      case 'SCHEDULE_UPDATED':
        return { label: 'Interview', icon: Calendar, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' };
      case 'APPLICATION_REJECTED':
      case 'OFFER_REJECTED':
        return { label: 'Update', icon: Info, color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100' };
      default: return { label: 'System', icon: Bell, color: 'text-slate-600', bg: 'bg-slate-50', border: 'border-slate-100' };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.28 } },
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);
  const readCount = useMemo(() => notifications.filter(n => n.read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    if (activeFilter === 'unread') return notifications.filter((n) => !n.read);
    if (activeFilter === 'read') return notifications.filter((n) => n.read);
    return notifications;
  }, [notifications, activeFilter]);

  const filterTabs: { key: NotificationFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'read', label: 'Read', count: readCount },
  ];

  const renderSkeleton = () => (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          key={index}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm animate-pulse"
        >
          <div className="flex gap-4">
            <div className="h-11 w-11 rounded-xl bg-slate-100" />
            <div className="flex-1 space-y-3">
              <div className="h-4 w-1/3 rounded bg-slate-100" />
              <div className="h-3 w-3/4 rounded bg-slate-100" />
              <div className="h-3 w-1/2 rounded bg-slate-100" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-white to-blue-50/40 p-4 sm:p-6 lg:p-10 text-slate-900">
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="mx-auto max-w-5xl space-y-6"
      >
        <div className="rounded-3xl border border-slate-200/70 bg-white/95 p-5 sm:p-6 shadow-[0_8px_30px_rgba(15,23,42,0.06)] backdrop-blur">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Notifications</h1>
                <Badge className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700 hover:bg-blue-100">
                  {unreadCount} unread
                </Badge>
              </div>
              <p className="mt-2 text-sm text-slate-500">
                Stay updated with placements, interviews, and application status.
              </p>
            </div>

            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || loading}
              className="h-10 rounded-xl border-slate-200 px-4 text-sm font-medium"
            >
              Mark all as read
            </Button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  'inline-flex items-center gap-2 rounded-xl border px-3 py-1.5 text-sm transition-all',
                  activeFilter === tab.key
                    ? 'border-blue-200 bg-blue-50 text-blue-700 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                )}
              >
                {tab.label}
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {loading && notifications.length === 0 ? (
          renderSkeleton()
        ) : filteredNotifications.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-3xl border border-slate-200 bg-white p-12 text-center shadow-sm"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50">
              <Bell className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-xl font-semibold text-slate-900">No notifications found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              {activeFilter === 'all'
                ? "You're all caught up. New notifications will appear here."
                : `No ${activeFilter} notifications right now.`}
            </p>
          </motion.div>
        ) : (
          <AnimatePresence mode="popLayout">
            <div className="space-y-4">
              {filteredNotifications.map((notification) => {
                const config = getTagConfig(String(notification.type));
                const TagIcon = config.icon;

                return (
                  <motion.div
                    layout
                    key={notification.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, y: 8 }}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    className={cn(
                      'group cursor-pointer rounded-2xl border p-4 sm:p-5 transition-all duration-200',
                      !notification.read
                        ? 'border-blue-200 bg-blue-50/45 shadow-[0_10px_24px_rgba(37,99,235,0.10)]'
                        : 'border-slate-200/90 bg-linear-to-br from-white to-slate-50/70 shadow-[0_6px_16px_rgba(15,23,42,0.04)] hover:shadow-[0_10px_24px_rgba(15,23,42,0.08)]'
                    )}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border',
                        !notification.read
                          ? cn(config.bg, config.color, config.border)
                          : 'bg-slate-100 text-slate-500 border-slate-200'
                      )}>
                        <TagIcon size={18} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div className="min-w-0 space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                              <Badge variant="outline" className={cn('rounded-full text-[10px]', config.bg, config.color, config.border)}>
                                {config.label}
                              </Badge>
                              {!notification.read && (
                                <>
                                  <span className="h-2 w-2 rounded-full bg-blue-500" />
                                  <Badge className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] text-white hover:bg-blue-600">
                                    NEW
                                  </Badge>
                                </>
                              )}
                            </div>

                            <h3 className={cn('truncate text-base', notification.read ? 'font-semibold text-slate-700' : 'font-semibold text-slate-900')}>
                              {String(notification.title)}
                            </h3>
                            <p className={cn('text-sm leading-relaxed', notification.read ? 'text-slate-500' : 'text-slate-600')}>
                              {String(notification.message)}
                            </p>
                          </div>

                          <div className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs text-slate-500">
                            <Clock size={12} />
                            {formatTime(String(notification.createdAt))}
                          </div>
                        </div>

                        <div className="mt-4 flex flex-wrap items-center gap-4">
                          {!notification.read ? (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              Mark as read
                            </button>
                          ) : (
                            <Badge className="rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[11px] font-medium text-emerald-700 hover:bg-emerald-50">
                              Read
                            </Badge>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(notification);
                            }}
                            className={cn(
                              'inline-flex items-center gap-1 text-sm font-medium transition-colors',
                              notification.read ? 'text-slate-600 hover:text-slate-800' : 'text-slate-700 hover:text-slate-900'
                            )}
                          >
                            View details
                            <ArrowUpRight size={14} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="inline-flex items-center gap-1 text-sm font-medium text-rose-500 hover:text-rose-600"
                          >
                            <Trash2 size={14} />
                            Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {pagination.totalPages > pagination.page && (
              <motion.div variants={itemVariants} className="pt-2">
                <Button
                  onClick={() => dispatch(fetchNotifications({ page: pagination.page + 1, limit: pagination.limit }))}
                  className="h-11 w-full rounded-xl border border-slate-200 bg-white text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
                  disabled={loading}
                >
                  {loading ? 'Loading...' : 'Load older notifications'}
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </motion.main>

      <AnimatePresence>
        {selectedNotification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4"
            onClick={() => setSelectedNotification(null)}
          >
            <motion.div
              initial={{ y: 16, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 16, opacity: 0, scale: 0.98 }}
              className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="mb-4 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">{selectedNotification.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">{formatTime(selectedNotification.createdAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              </div>

              <div className="rounded-xl bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
                {selectedNotification.message}
              </div>

              <div className="mt-5 flex justify-end">
                <Button
                  onClick={() => setSelectedNotification(null)}
                  className="h-9 rounded-lg bg-blue-600 px-4 text-sm text-white hover:bg-blue-700"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
