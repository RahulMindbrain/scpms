import { useEffect, useMemo, useState } from 'react';
import {
  ArrowUpRight,
  Bell,
  Clock,
  Info,
  Sparkles,
  Trash2,
  X,
  ShieldAlert,
  AlertTriangle,
  Search,
  CheckCircle2,
  Calendar,
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
import { AdminPageLayout } from '@/components/layout/AdminPageLayout';
import { PageHeader } from '@/components/PageHeader';


type NotificationFilter = 'all' | 'unread' | 'read';
type NotificationItem = {
  id: number;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
};

const AdminNotificationPage = () => {
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
      toast.success('All tactical alerts synchronized');
    } catch (error: any) {
      toast.error(error?.toString() || 'Failed to synchronize alerts');
    }
  };

  const handleMarkAsRead = async (id: number, showToast = true) => {
    try {
      await dispatch(markNotificationAsRead(id)).unwrap();
      if (showToast) toast.success('Alert marked as processed');
    } catch (error: any) {
      toast.error(error?.toString() || 'Failed to update alert status');
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
      toast.success('Alert purged from system');
    } catch (error: any) {
      toast.error(error?.toString() || 'Failed to purge alert');
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
      case 'SYSTEM_ALERT':
      case 'CRITICAL_ERROR':
        return { label: 'System', icon: ShieldAlert, color: 'text-rose-600', bg: 'bg-rose-500/10', border: 'border-rose-500/20' };
      case 'PLACEMENT_UPDATE':
      case 'DRIVE_CREATED':
        return { label: 'Placement', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-500/10', border: 'border-emerald-500/20' };
      case 'USER_ACTIVITY':
      case 'REGISTRATION':
        return { label: 'Activity', icon: Info, color: 'text-indigo-600', bg: 'bg-indigo-500/10', border: 'border-indigo-500/20' };
      case 'WARNING':
        return { label: 'Warning', icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
      default: return { label: 'Notification', icon: Bell, color: 'text-slate-600', bg: 'bg-slate-500/10', border: 'border-slate-500/20' };
    }
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    let filtered = [...notifications].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
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
    { key: 'all', label: 'All Intel', count: notifications.length },
    { key: 'unread', label: 'Pending', count: unreadCount },
    { key: 'read', label: 'Archived', count: notifications.length - unreadCount },
  ];

  return (
    <AdminPageLayout>
      <PageHeader
        title="Intelligence Feed"
        description="Unified log of system-wide events, placement milestones, and tactical alerts."
        badge="Live Signals"
        icon={Bell}
        variant="indigo"
      >
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end mr-2">
            <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest leading-none mb-1">Queue Status</span>
            <div className="flex items-center gap-1.5 text-indigo-500 font-black text-xs uppercase">
              <span className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
              {unreadCount} Alerts Pending
            </div>
          </div>
          <Button
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0 || loading}
            className="h-11 px-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 font-black uppercase text-[10px] tracking-widest"
          >
            <CheckCircle2 className="size-4 mr-2" /> Mark All Processed
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-8 pb-10">
        <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
          <div className="flex flex-wrap gap-2 p-1.5 rounded-2xl bg-card border border-border/50 shadow-sm">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  'flex items-center gap-2 rounded-xl px-5 py-2.5 text-xs font-black uppercase tracking-widest transition-all active:scale-95',
                  activeFilter === tab.key
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                    : 'text-muted-foreground hover:bg-muted transition-colors'
                )}
              >
                {tab.label}
                <span className={cn(
                  'rounded-full px-2 py-0.5 text-[9px] font-black',
                  activeFilter === tab.key ? 'bg-white/20 text-white' : 'bg-muted-foreground/10 text-muted-foreground'
                )}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search signal logs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-card border border-border/50 rounded-2xl pl-11 pr-4 text-sm font-bold focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500/50 outline-none transition-all shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {loading && notifications.length === 0 ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 w-full animate-pulse rounded-[2.5rem] bg-muted/50 border border-border/50" />
                ))}
              </div>
            ) : filteredNotifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 rounded-[3rem] border-2 border-dashed border-border/50 bg-card/50">
                <div className="size-20 rounded-full bg-muted flex items-center justify-center mb-6">
                  <Bell className="size-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-black text-foreground tracking-tight">System Silence</h3>
                <p className="text-sm font-bold text-muted-foreground mt-1">No tactical alerts currently synchronized with your feed.</p>
              </div>
            ) : (
              filteredNotifications.map((notification) => {
                const config = getTagConfig(notification.type);
                const Icon = config.icon;

                return (
                  <motion.div
                    layout
                    key={notification.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id, false)}
                    className={cn(
                      'saas-card p-0 overflow-hidden group cursor-pointer transition-all duration-500',
                      !notification.read ? 'border-indigo-500/50 bg-indigo-50/20 dark:bg-indigo-500/5' : 'bg-card'
                    )}
                  >
                    <div className="p-6 md:p-8">
                      <div className="flex flex-col md:flex-row gap-6">
                        <div className={cn(
                          'size-14 shrink-0 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110 duration-500',
                          !notification.read ? cn(config.bg, config.color) : 'bg-muted text-muted-foreground'
                        )}>
                          <Icon size={24} />
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                'px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border',
                                config.bg, config.color, config.border
                              )}>
                                {config.label}
                              </span>
                              {!notification.read && (
                                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-indigo-600 text-white text-[9px] font-black uppercase">
                                  <span className="size-1.5 rounded-full bg-white animate-ping" />
                                  Pending
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-4 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                              <div className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(notification.createdAt).toLocaleDateString()}</div>
                              <div className="flex items-center gap-1.5"><Clock size={12} /> {formatTime(notification.createdAt)}</div>
                            </div>
                          </div>

                          <h3 className={cn('text-lg font-black tracking-tight mb-2 transition-colors', !notification.read ? 'text-foreground' : 'text-muted-foreground')}>
                            {notification.title}
                          </h3>
                          <p className={cn('text-sm font-bold leading-relaxed max-w-4xl line-clamp-2', !notification.read ? 'text-muted-foreground' : 'text-muted-foreground/60')}>
                            {notification.message}
                          </p>

                          <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-6">
                            <div className="flex items-center gap-6">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewDetails(notification);
                                }}
                                className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-700 transition-colors"
                              >
                                Analyze Detail <ArrowUpRight size={14} />
                              </button>
                              {!notification.read && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleMarkAsRead(notification.id);
                                  }}
                                  className="text-xs font-black uppercase tracking-widest text-muted-foreground hover:text-indigo-600 transition-colors"
                                >
                                  Mark Processed
                                </button>
                              )}
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(notification.id);
                              }}
                              className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-rose-500 opacity-0 group-hover:opacity-100 transition-all hover:text-rose-600"
                            >
                              <Trash2 size={14} /> Purge
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Detail Inspector Modal */}
      <AnimatePresence>
        {selectedNotification && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedNotification(null)}
              className="absolute inset-0 bg-slate-950/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 40 }}
              className="relative w-full max-w-2xl overflow-hidden rounded-[3rem] border-none bg-card shadow-2xl"
            >
              <div className="bg-slate-900 p-10 text-white relative">
                <div className="relative z-10">
                  <Badge variant="outline" className="mb-4 bg-white/10 text-white border-white/20 font-black uppercase tracking-widest py-1 px-3">
                    {selectedNotification.type.replace('_', ' ')}
                  </Badge>
                  <h2 className="text-3xl font-black tracking-tight leading-tight mb-2">{selectedNotification.title}</h2>
                  <div className="flex items-center gap-4 text-[10px] font-black text-indigo-200 uppercase tracking-[0.2em]">
                    <div className="flex items-center gap-1.5"><Calendar size={12} /> {new Date(selectedNotification.createdAt).toLocaleDateString()}</div>
                    <div className="flex items-center gap-1.5"><Clock size={12} /> {new Date(selectedNotification.createdAt).toLocaleTimeString()}</div>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedNotification(null)}
                  className="absolute top-10 right-10 size-12 rounded-2xl bg-white/5 flex items-center justify-center text-white/40 transition-colors hover:bg-white/10 hover:text-white"
                >
                  <X size={20} />
                </button>
                <div className="absolute top-0 right-0 size-64 bg-indigo-600/20 rounded-full -mr-32 -mt-32 blur-3xl" />
              </div>

              <div className="p-10 bg-card">
                <div className="rounded-[2.5rem] bg-muted/30 border border-border/50 p-10 text-sm font-bold leading-relaxed text-foreground min-h-[180px]">
                  {selectedNotification.message}
                </div>

                <div className="mt-10 flex gap-4">
                  <Button variant="outline" onClick={() => setSelectedNotification(null)} className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest border-border/50">
                    Close Inspector
                  </Button>
                  <Button className="flex-1 h-14 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-indigo-500/20">
                    Archive Signal
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </AdminPageLayout>
  );
};

export default AdminNotificationPage;
