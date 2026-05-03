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
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Notifications
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-2 py-0 h-5 text-[10px] font-bold">
              {unreadCount} New
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Stay updated with applicant activity and job drive events.</p>
        </div>
        
        <Button
          onClick={handleMarkAllRead}
          disabled={unreadCount === 0 || loading}
          className="rounded-xl font-bold px-6"
        >
          Mark all as read
        </Button>
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-1 p-1 bg-muted/30 rounded-xl border border-border/50 w-full md:w-auto">
          {filterTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveFilter(tab.key)}
              className={cn(
                'flex items-center gap-2 rounded-lg px-4 py-1.5 text-xs font-bold transition-all',
                activeFilter === tab.key
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {tab.label}
              <span className={cn(
                'rounded-full px-1.5 py-0.5 text-[9px]',
                activeFilter === tab.key ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground'
              )}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-[300px] group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search notifications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="saas-input pl-11 h-10"
          />
        </div>
      </div>

      <div className="space-y-4">
        {loading && notifications.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 w-full animate-pulse rounded-2xl bg-muted/20" />
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border/50 bg-muted/5 py-20">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Bell size={32} />
            </div>
            <h3 className="text-lg font-bold">Inbox is empty</h3>
            <p className="text-sm text-muted-foreground font-medium">You're all caught up with your notifications.</p>
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
                  exit={{ opacity: 0, scale: 0.98 }}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  className={cn(
                    'group saas-card relative overflow-hidden p-5 transition-all duration-300',
                    !notification.read ? 'border-primary/40 bg-primary/[0.03]' : 'opacity-80'
                  )}
                >
                  {!notification.read && (
                    <div className="absolute left-0 top-0 h-full w-1 bg-primary" />
                  )}

                  <div className="flex gap-4">
                    <div className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border transition-colors',
                      !notification.read ? 'bg-primary/10 text-primary border-primary/20' : 'bg-muted/50 text-muted-foreground border-border/50'
                    )}>
                      <Icon size={22} />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className={cn('text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md', !notification.read ? 'bg-primary/10 text-primary' : 'bg-muted text-muted-foreground')}>
                              {config.label}
                            </span>
                            {!notification.read && (
                              <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
                            )}
                          </div>
                          <h3 className="text-base font-bold text-foreground leading-tight">
                            {notification.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60">
                          <Clock size={12} />
                          {formatTime(notification.createdAt)}
                        </div>
                      </div>

                      <p className="mt-2 text-sm text-muted-foreground line-clamp-2 font-medium">
                        {notification.message}
                      </p>

                      <div className="mt-5 flex items-center justify-between pt-4 border-t border-border/30">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleViewDetails(notification);
                            }}
                            className="flex items-center gap-1.5 text-xs font-bold text-primary hover:underline underline-offset-4"
                          >
                            View Details <ArrowUpRight size={14} />
                          </button>
                          {!notification.read && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification.id);
                              }}
                              className="text-xs font-bold text-muted-foreground hover:text-foreground transition-colors"
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
                          className="flex items-center gap-1.5 text-xs font-bold text-destructive/60 hover:text-destructive opacity-0 group-hover:opacity-100 transition-all"
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

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="absolute inset-0 bg-background/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-border bg-card p-8 shadow-2xl"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-1">
                   <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-widest px-2 py-0.5 rounded-md bg-primary/10 text-primary">
                        {selectedNotification.type.replace('_', ' ')}
                    </span>
                   </div>
                  <h2 className="text-2xl font-extrabold tracking-tight text-foreground">{selectedNotification.title}</h2>
                  <div className="flex items-center gap-1.5 text-xs font-bold text-muted-foreground/60">
                    <Clock size={12} />
                    {new Date(selectedNotification.createdAt).toLocaleString()}
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="rounded-xl p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="mt-6 rounded-2xl bg-muted/30 p-6 text-sm leading-relaxed text-foreground font-medium border border-border/50">
                {selectedNotification.message}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button variant="outline" onClick={() => setSelectedNotification(null)} className="rounded-xl font-bold">
                  Close
                </Button>
                <Button className="rounded-xl font-bold px-6">
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
