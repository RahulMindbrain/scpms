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
  CheckCircle2,
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
import Loader from '@/components/Loader';

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
  const { user } = useSelector((state: RootState) => state.auth);
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
    setSelectedNotification({ ...notification, read: true });
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
        return { label: 'Selected', icon: Sparkles, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'JOB_POSTED':
      case 'JOB_UPDATED':
        return { label: 'Job', icon: Briefcase, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
      case 'SCHEDULE_CREATED':
      case 'SCHEDULE_UPDATED':
        return { label: 'Interview', icon: Calendar, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'APPLICATION_REJECTED':
      case 'OFFER_REJECTED':
        return { label: 'Update', icon: Info, color: 'text-rose-400', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
      default: return { label: 'System', icon: Bell, color: 'text-slate-400', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
    }
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

  if (loading && notifications.length === 0) {
    return <Loader text="Syncing your updates..." fullScreen />;
  }

  return (
    <div className="flex-1 flex flex-col bg-background dark:bg-[#111319] min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-5xl mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* ─── Hero Header ─── */}
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-8 md:p-12 text-white shadow-2xl border border-white/5">
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-500/15 rounded-full blur-[80px]"></div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                <Bell className="h-3 w-3 text-indigo-400" /> 
                <span className="opacity-90">Notification Hub</span>
              </div>
              <h1 className="mt-6 text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {user?.firstname ? `Hey ${user.firstname}, stay updated` : "Your Updates"}
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed font-medium">
                {unreadCount > 0 
                  ? `You have ${unreadCount} new alerts that require your attention. Stay on top of your journey!`
                  : "Track all your recruitment milestones, interview calls, and placement activities in real-time."}
              </p>
            </div>
            
            <div className="hidden lg:block">
              <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-white/5 backdrop-blur-xl border border-white/10 shadow-inner">
                <div className="relative">
                  <Bell className={cn("h-16 w-16 text-white/30", unreadCount > 0 && "animate-[bell-swing_2s_infinite]")} />
                  {unreadCount > 0 && (
                    <div className="absolute top-0 right-0 w-6 h-6 bg-indigo-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-lg border-2 border-white/10">
                      {unreadCount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ─── Controls & Filters ─── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-2 border-b border-slate-100 dark:border-white/[0.05]">
          <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1 rounded-2xl border border-slate-200 dark:border-white/[0.05]">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2",
                  activeFilter === tab.key
                    ? "bg-white dark:bg-[#1e1f26] text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200 dark:border-white/10"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {tab.label}
                <span className={cn(
                  "px-2 py-0.5 rounded-lg text-[9px] font-black transition-colors",
                  activeFilter === tab.key ? "bg-indigo-500/10" : "bg-slate-200 dark:bg-white/5"
                )}>{tab.count}</span>
              </button>
            ))}
          </div>

          <Button
            variant="outline"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || loading}
            className="rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#1e1f26] font-black text-[10px] uppercase tracking-widest px-6 h-12 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500/20 transition-all"
          >
            Mark all as read <CheckCircle2 className="ml-2 w-4 h-4" />
          </Button>
        </div>

        {/* ─── Notifications List ─── */}
        <AnimatePresence mode="popLayout">
          {filteredNotifications.length > 0 ? (
            <motion.div layout className="space-y-4">
              {filteredNotifications.map((notification) => {
                const config = getTagConfig(String(notification.type));
                const TagIcon = config.icon;

                return (
                  <motion.div
                    layout
                    key={notification.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    className={cn(
                      "group relative cursor-pointer rounded-[2rem] border p-6 transition-all duration-300 overflow-hidden",
                      !notification.read
                        ? "bg-indigo-500/5 border-indigo-500/30 shadow-lg shadow-indigo-500/5"
                        : "bg-white dark:bg-[#1e1f26] border-slate-200 dark:border-white/[0.05] hover:border-indigo-500/20 hover:shadow-xl"
                    )}
                  >
                    <div className="flex items-start gap-6">
                      <div className={cn(
                        "mt-1 flex h-14 w-14 shrink-0 items-center justify-center rounded-[1.25rem] border shadow-sm transition-transform group-hover:scale-110",
                        !notification.read
                          ? cn(config.bg, config.color, config.border)
                          : "bg-slate-100 dark:bg-white/5 text-slate-400 border-slate-200 dark:border-white/10"
                      )}>
                        <TagIcon size={24} strokeWidth={2.5} />
                      </div>

                      <div className="min-w-0 flex-1 space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                "px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                                config.bg, config.color, config.border
                              )}>
                                {config.label}
                              </span>
                              {!notification.read && (
                                <div className="flex items-center gap-1.5">
                                  <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
                                  <span className="text-[9px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">New</span>
                                </div>
                              )}
                            </div>
                            <h3 className={cn(
                              "text-lg font-black tracking-tight transition-colors",
                              notification.read ? "text-slate-600 dark:text-slate-400" : "text-slate-900 dark:text-white"
                            )}>
                              {notification.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black text-slate-500 uppercase tracking-widest shrink-0 h-fit">
                            <Clock size={12} className="text-indigo-500" />
                            {formatTime(notification.createdAt)}
                          </div>
                        </div>

                        <p className={cn(
                          "text-sm leading-relaxed font-medium",
                          notification.read ? "text-slate-500 dark:text-slate-500" : "text-slate-700 dark:text-slate-300"
                        )}>
                          {notification.message}
                        </p>

                        <div className="pt-2 flex flex-wrap items-center gap-6">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(notification);
                            }}
                            className="flex items-center gap-1.5 text-[11px] font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest hover:translate-x-1 transition-transform"
                          >
                            Details <ArrowUpRight size={14} />
                          </button>
                          
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-[11px] font-black text-slate-500 hover:text-indigo-600 uppercase tracking-widest transition-colors"
                            >
                              Mark as read
                            </button>
                          )}

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="flex items-center gap-1.5 text-[11px] font-black text-rose-500 hover:text-rose-700 uppercase tracking-widest transition-colors opacity-0 group-hover:opacity-100"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-32 flex flex-col items-center text-center bg-white dark:bg-[#1e1f26]/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10"
            >
              <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6 border-2 border-slate-200 dark:border-white/5">
                <Bell size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">All caught up!</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mt-2 font-medium">
                {activeFilter === 'all'
                  ? "You don't have any notifications at the moment. Check back later for updates."
                  : `No ${activeFilter} notifications found in your history.`}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {pagination.totalPages > pagination.page && (
          <div className="pt-4 flex justify-center">
            <Button
              onClick={() => dispatch(fetchNotifications({ page: pagination.page + 1, limit: pagination.limit }))}
              disabled={loading}
              className="rounded-2xl border-2 border-slate-200 dark:border-white/10 bg-white dark:bg-[#1e1f26] text-slate-900 dark:text-white font-black text-xs uppercase tracking-widest px-10 h-14 hover:bg-indigo-600 hover:text-white transition-all shadow-lg active:scale-95"
            >
              {loading ? <Loader size="sm" /> : 'Load older notifications'}
            </Button>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
            />
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.95 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 20, opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-lg rounded-[2.5rem] bg-white dark:bg-[#1e1f26] p-10 shadow-2xl border border-slate-200 dark:border-white/10"
            >
              <div className="mb-8 flex items-start justify-between gap-6">
                <div className="space-y-2">
                  <div className={cn(
                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border w-fit",
                    getTagConfig(selectedNotification.type).bg,
                    getTagConfig(selectedNotification.type).color,
                    getTagConfig(selectedNotification.type).border
                  )}>
                    {getTagConfig(selectedNotification.type).label}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">{selectedNotification.title}</h3>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{formatTime(selectedNotification.createdAt)}</p>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="rounded-2xl p-3 bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-rose-500 transition-colors shadow-inner"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] p-8 text-base leading-relaxed text-slate-700 dark:text-slate-200 font-medium border border-slate-100 dark:border-white/5 shadow-inner">
                {selectedNotification.message}
              </div>

              <div className="mt-8">
                <Button
                  onClick={() => setSelectedNotification(null)}
                  className="w-full h-14 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black text-sm uppercase tracking-widest shadow-xl shadow-indigo-500/20"
                >
                  Got it
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Notification;
