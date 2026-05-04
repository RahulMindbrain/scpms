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
    <div className="flex flex-col bg-background min-h-screen">
      <div className="max-w-[1400px] mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
        
        {/* Adaptive Hero Banner */}
        <div className="company-hero-banner group">
          <div className="hero-mesh">
            <div className="bubble-primary"></div>
            <div className="bubble-secondary"></div>
          </div>

          <div className="hero-texture"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="hero-badge">
                <Bell size={12} className="text-white" /> 
                <span>Notification Center</span>
              </div>
              <h1 className="hero-title">
                Pulse <span>Dashboard</span> 🔔
              </h1>
              <p className="hero-description text-white/70">
                {unreadCount > 0 
                  ? `You have ${unreadCount} unread updates that require your attention. Stay synchronized with your recruitment drives.`
                  : "Track all applicant milestones, interview scheduling updates, and system alerts in one centralized feed."}
              </p>
            </div>
            
            {/* <div className="hidden lg:block">
              <div className="flex h-32 w-32 items-center justify-center rounded-[2.5rem] bg-white/10 backdrop-blur-2xl border border-white/20 shadow-2xl relative">
                <Bell className={cn("h-14 w-14 text-white/50", unreadCount > 0 && "animate-[bell-swing_2s_infinite]")} />
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-9 h-9 bg-rose-500 rounded-full flex items-center justify-center text-[10px] font-black text-white shadow-2xl border-4 border-white dark:border-[#0f172a]">
                    {unreadCount}
                  </div>
                )}
              </div>
            </div> */}
          </div>
        </div>

        {/* ─── Controls & Filters ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-200/60 dark:border-white/[0.08] shadow-xl shadow-primary/5">
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.05] overflow-x-auto no-scrollbar">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveFilter(tab.key)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 flex items-center gap-2 whitespace-nowrap",
                  activeFilter === tab.key
                    ? "bg-white dark:bg-[#1e1f26] text-primary dark:text-primary-foreground shadow-lg border border-slate-200/50 dark:border-white/10 scale-105"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {tab.label}
                <span className={cn(
                  "px-2 py-0.5 rounded-lg text-[9px] font-black transition-colors shadow-inner",
                  activeFilter === tab.key ? "bg-primary/10" : "bg-slate-200 dark:bg-white/5"
                )}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 flex-col sm:flex-row">
            <div className="relative w-full sm:w-[300px] group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search alerts..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-slate-100/50 dark:bg-white/5 border-transparent focus:bg-white dark:focus:bg-card focus:border-primary/20 rounded-2xl transition-all font-black text-[11px] uppercase tracking-wider"
              />
            </div>
            
            <Button
              variant="outline"
              onClick={handleMarkAllRead}
              disabled={unreadCount === 0 || loading}
              className="w-full sm:w-auto rounded-2xl border-none bg-primary/10 text-primary font-black text-[10px] uppercase tracking-widest px-8 h-12 hover:bg-primary hover:text-white transition-all shadow-xl shadow-primary/5 active:scale-95"
            >
              Mark all read
            </Button>
          </div>
        </div>

        {/* ─── Notifications List ─── */}
        <div className="space-y-4 pb-20">
          {loading && notifications.length === 0 ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 w-full animate-pulse rounded-[2.5rem] bg-muted/20 border border-border/50" />
              ))}
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-[3rem] border-4 border-dashed border-border/50 bg-muted/5 py-32 text-center group">
              <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-[2.5rem] bg-muted/50 text-muted-foreground transition-transform group-hover:scale-110 duration-500 shadow-inner">
                <Bell size={40} className="opacity-30" />
              </div>
              <h3 className="text-2xl font-black text-foreground tracking-tight uppercase">Clear Skies</h3>
              <p className="text-sm text-muted-foreground font-medium mt-2 max-w-xs mx-auto">You've cleared all your updates. We'll let you know when something new arrives.</p>
              <Button 
                variant="ghost" 
                onClick={() => { setActiveFilter('all'); setSearchQuery(''); }}
                className="mt-8 font-black text-[10px] uppercase tracking-[0.2em] text-primary hover:bg-primary/5 rounded-xl"
              >
                Reset Dashboard
              </Button>
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
                    exit={{ opacity: 0, scale: 0.98, transition: { duration: 0.2 } }}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    className={cn(
                      'group saas-card relative overflow-hidden p-0 transition-all duration-500 cursor-pointer border-2',
                      !notification.read 
                        ? 'border-primary/30 shadow-2xl shadow-primary/5 bg-gradient-to-br from-primary/[0.03] to-transparent' 
                        : 'border-border/30 opacity-70 grayscale-[0.5] hover:grayscale-0 hover:opacity-100 hover:border-primary/20'
                    )}
                  >
                    {!notification.read && (
                      <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-primary animate-pulse" />
                    )}

                    <div className="flex flex-col md:flex-row items-stretch">
                      <div className={cn(
                        'flex items-center justify-center p-8 md:w-[120px] transition-colors border-b md:border-b-0 md:border-r border-border/30',
                        !notification.read ? 'bg-primary/5' : 'bg-muted/30'
                      )}>
                        <div className={cn(
                          'flex h-14 w-14 items-center justify-center rounded-2xl border shadow-xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-6',
                          !notification.read ? cn(config.bg, config.color, config.border) : 'bg-card text-muted-foreground border-border/50'
                        )}>
                          <Icon size={24} strokeWidth={2.5} />
                        </div>
                      </div>

                      <div className="flex-1 p-8 space-y-4">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-3">
                              <span className={cn(
                                'text-[9px] font-black uppercase tracking-[0.2em] px-2.5 py-1 rounded-lg border shadow-sm', 
                                config.bg, config.color, config.border
                              )}>
                                {config.label}
                              </span>
                              {!notification.read && (
                                <div className="flex items-center gap-1.5">
                                  <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                                  <span className="text-[9px] font-black text-primary uppercase tracking-widest">Priority Update</span>
                                </div>
                              )}
                            </div>
                            <h3 className="text-xl font-black text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">
                              {notification.title}
                            </h3>
                          </div>
                          
                          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-white/5 text-[10px] font-black text-muted-foreground uppercase tracking-widest shrink-0 h-fit border border-border/50 shadow-inner">
                            <Clock size={12} className="text-primary" />
                            {formatTime(notification.createdAt)}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground font-medium leading-relaxed max-w-3xl">
                          {notification.message}
                        </p>

                        <div className="pt-4 flex flex-wrap items-center justify-between gap-6 border-t border-border/30">
                          <div className="flex items-center gap-6">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleViewDetails(notification);
                              }}
                              className="flex items-center gap-2 text-[10px] font-black text-primary uppercase tracking-[0.2em] hover:translate-x-1 transition-transform"
                            >
                              Details <ArrowUpRight size={14} />
                            </button>
                            {!notification.read && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleMarkAsRead(notification.id);
                                }}
                                className="text-[10px] font-black text-muted-foreground hover:text-primary uppercase tracking-[0.2em] transition-colors"
                              >
                                Mark Read
                              </button>
                            )}
                          </div>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="flex items-center gap-2 text-[10px] font-black text-rose-500/60 hover:text-rose-500 uppercase tracking-[0.2em] opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0"
                          >
                            <Trash2 size={14} /> Remove Alert
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
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedNotification(null)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                className="relative w-full max-w-lg overflow-hidden rounded-[2.5rem] border border-slate-200 dark:border-white/10 bg-white dark:bg-[#1e1f26] p-10 shadow-2xl"
              >
                <div className="flex items-start justify-between gap-6 mb-8">
                  <div className="space-y-3">
                     <div className="flex items-center gap-2">
                      <span className={cn(
                        'text-[9px] font-black uppercase tracking-[0.2em] px-3 py-1 rounded-lg border shadow-sm', 
                        getTagConfig(selectedNotification.type).bg, 
                        getTagConfig(selectedNotification.type).color, 
                        getTagConfig(selectedNotification.type).border
                      )}>
                          {getTagConfig(selectedNotification.type).label}
                      </span>
                     </div>
                    <h2 className="text-2xl font-black tracking-tight text-foreground">{selectedNotification.title}</h2>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em]">{new Date(selectedNotification.createdAt).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => setSelectedNotification(null)}
                    className="rounded-2xl p-3 bg-slate-100 dark:bg-white/5 text-muted-foreground hover:text-rose-500 transition-all shadow-inner"
                  >
                    <X size={20} />
                  </button>
                </div>

                <div className="rounded-[1.5rem] bg-slate-50 dark:bg-white/[0.03] p-8 text-sm leading-relaxed text-foreground font-medium border border-border/50 shadow-inner mb-8">
                  {selectedNotification.message}
                </div>

                <div className="flex gap-4">
                  <Button variant="outline" onClick={() => setSelectedNotification(null)} className="flex-1 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-12 border-border/50">
                    Dismiss
                  </Button>
                  <Button className="flex-1 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] h-12 shadow-xl shadow-primary/20">
                    Review Context
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CompanyNotificationPage;
