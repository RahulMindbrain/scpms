import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bell,
  Clock,
  Trash2,
  X,
  Search,
  Building2,
  Users,
  Briefcase,
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

const CompanyNotificationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [activeFilter, setActiveFilter] = useState<NotificationFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNotification, setSelectedNotification] = useState<NotificationItem | null>(null);

  const {
    items: notifications = [],
    loading = false,
  } = useSelector((state: RootState) => state.notification || {});

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 50 }));
  }, [dispatch]);

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      toast.success('All notifications marked as read');
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
      case 'NEW_APPLICANT':
        return { label: 'Applicant', icon: Users, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
      case 'INTERVIEW_SCHEDULED':
      case 'INTERVIEW_UPDATED':
        return { label: 'Interview', icon: Clock, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      case 'JOB_STATUS_CHANGE':
        return { label: 'Job', icon: Briefcase, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'SYSTEM_MESSAGE':
        return { label: 'System', icon: Building2, color: 'text-[#908fa0]', bg: 'bg-[rgba(255,255,255,0.05)]', border: 'border-[rgba(255,255,255,0.06)]' };
      default: return { label: 'Update', icon: Bell, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
  };

  const itemVariants = {
    hidden: { y: 15, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    let filtered = notifications;
    if (activeFilter === 'unread') filtered = filtered.filter((n) => !n.read);
    if (activeFilter === 'read') filtered = filtered.filter((n) => n.read);

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(n =>
        n.title.toLowerCase().includes(query) ||
        n.message.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [notifications, activeFilter, searchQuery]);

  const filterTabs: { key: NotificationFilter; label: string; count: number }[] = [
    { key: 'all', label: 'All', count: notifications.length },
    { key: 'unread', label: 'Unread', count: unreadCount },
    { key: 'read', label: 'Read', count: notifications.length - unreadCount },
  ];

  return (
    <div className="space-y-6">
      <motion.main
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className=" space-y-6"
      >
        {/* Header Section */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1e1f26] p-6">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold tracking-tight">Notifications</h1>
              <Badge className="bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-100 px-2.5">
                {unreadCount} New
              </Badge>
            </div>
            <p className="mt-1 text-sm text-[#908fa0]">
              Stay updated with new applicants, interview schedules, and job status changes.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || loading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-5 h-10 shadow-sm shadow-indigo-500/20"
            >
              Mark all as read
            </Button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="grid gap-4 md:grid-cols-[1fr,300px]">
          <div className="flex flex-wrap gap-2 rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#191b22] p-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                  activeFilter === tab.key
                    ? 'bg-indigo-500/15 text-indigo-300 shadow-sm'
                    : 'text-[#908fa0] hover:bg-[rgba(255,255,255,0.04)] hover:text-[#e2e2eb]'
                )}
              >
                {tab.label}
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[10px]',
                  activeFilter === tab.key ? 'bg-indigo-500/20 text-indigo-300' : 'bg-[rgba(255,255,255,0.06)] text-[#908fa0]'
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#908fa0]" size={18} />
            <input
              type="text"
              placeholder="Search notifications..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0e14] py-2.5 pl-11 pr-4 text-[#e2e2eb] text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all outline-hidden placeholder:text-[#908fa0]"
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading && notifications.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 w-full animate-pulse rounded-2xl bg-[rgba(255,255,255,0.05)]" />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[rgba(255,255,255,0.1)] bg-[#1e1f26] py-20">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-[rgba(255,255,255,0.05)] text-[#908fa0]">
                <Bell size={32} />
              </div>
              <h3 className="text-lg font-semibold">No notifications found</h3>
              <p className="text-sm text-[#908fa0]">Your notification inbox is currently empty.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {filteredNotifications.map((notification) => {
                const config = getTagConfig(notification.type);
                const Icon = config.icon;

                return (
                  <motion.div
                    layout
                    key={notification.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    className={cn(
                      'group relative overflow-hidden rounded-2xl border p-5 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/5',
                      !notification.read
                        ? 'border-indigo-500/30 bg-indigo-500/[0.07]'
                        : 'border-[rgba(255,255,255,0.07)] bg-[#1e1f26]'
                    )}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-0 h-full w-1 bg-indigo-500" />
                    )}

                    <div className="flex gap-4">
                      <div className={cn(
                        'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border transition-colors',
                        !notification.read ? cn(config.bg, config.color, config.border) : 'bg-[rgba(255,255,255,0.05)] text-[#908fa0] border-[rgba(255,255,255,0.06)]'
                      )}>
                        <Icon size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={cn('text-[10px] font-bold uppercase tracking-wider', config.bg, config.color, config.border)}>
                                {config.label}
                              </Badge>
                              {!notification.read && (
                                <span className="h-2 w-2 animate-pulse rounded-full bg-indigo-500" />
                              )}
                            </div>
                            <h3 className={cn('text-base font-bold transition-colors', !notification.read ? "text-[#e2e2eb]" : "text-[#c7c4d7]")}>
                              {notification.title}
                            </h3>
                          </div>
                          <div className="flex items-center gap-1.5 text-xs font-medium text-[#908fa0]">
                            <Clock size={14} />
                            {formatTime(notification.createdAt)}
                          </div>
                        </div>

                        <p className={cn('mt-2 text-sm leading-relaxed max-w-2xl', !notification.read ? "text-[#c7c4d7]" : "text-[#908fa0]")}>
                          {notification.message}
                        </p>

                        <div className="mt-5 flex items-center justify-between border-t border-[rgba(255,255,255,0.05)] pt-4">
                          <div className="flex items-center gap-4">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(notification);
                              }}
                              className="flex items-center gap-1.5 text-sm font-bold text-indigo-400 hover:text-indigo-300 transition-colors"
                            >
                              View Details <ArrowUpRight size={14} />
                            </button>
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="text-sm font-bold text-[#908fa0] hover:text-indigo-400 transition-colors"
                              >
                                Mark as read
                              </button>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="flex items-center gap-1.5 text-sm font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:text-rose-600"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>
      </motion.main>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-[rgba(255,255,255,0.08)] bg-[#1e1f26] p-8 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                  <Badge variant="outline" className="mb-2 bg-indigo-500/10 text-indigo-300 border-indigo-500/20">
                    {selectedNotification.type.replace('_', ' ')}
                  </Badge>
                  <h2 className="text-2xl font-bold">{selectedNotification.title}</h2>
                  <div className="flex items-center gap-1.5 text-sm text-[#908fa0]">
                    <Clock size={14} />
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="rounded-xl p-2 text-[#908fa0] transition-colors hover:bg-[rgba(255,255,255,0.06)] hover:text-[#e2e2eb]"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 rounded-2xl bg-[#111319] p-5 text-sm leading-relaxed text-[#c7c4d7] border border-[rgba(255,255,255,0.07)]">
                {selectedNotification.message}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedNotification(null)} className="rounded-xl">
                  Close
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl">
                  Take Action
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CompanyNotificationPage;
