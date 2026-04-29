import { useEffect, useMemo } from 'react';
import { 
  Briefcase, Calendar, 
  MoreVertical, Filter, 
  ArrowUpRight, Bell, Trash2,
  Sparkles, Clock, Info,
  ShieldCheck
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import { 
  fetchNotifications, 
  markAllNotificationsAsRead, 
  markNotificationAsRead,
  deleteNotification 
} from '@/redux/thunks/notificationThunks';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { cn } from '@/lib/utils';

const Notification = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    items: notifications = [], 
    loading = false, 
    pagination = { page: 1, limit: 10, totalPages: 0 } 
  } = useSelector((state: RootState) => state.notification || {});

  useEffect(() => {
    dispatch(fetchNotifications({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      toast.success("Inbox cleared! All caught up.");
    } catch (error: any) {
      toast.error(error?.toString() || "Failed to sync updates");
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await dispatch(markNotificationAsRead(id)).unwrap();
    } catch (error: any) {
      toast.error(error?.toString() || "Sync failed");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteNotification(id)).unwrap();
      toast.success("Activity removed");
    } catch (error: any) {
      toast.error(error?.toString() || "Failed to remove activity");
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
        return { label: 'Offer Received', icon: Sparkles, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' };
      case 'JOB_POSTED':
      case 'JOB_UPDATED':
        return { label: 'New Drive', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' };
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
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } }
  };

  const itemVariants: any = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 lg:p-10 font-sans text-slate-900 relative overflow-hidden">
      {/* Decorative Background Blurs */}
      <div className="absolute top-0 right-0 -mr-24 -mt-24 h-96 w-96 rounded-full bg-blue-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-24 -mb-24 h-96 w-96 rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />

      <motion.main 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="max-w-4xl mx-auto space-y-10 relative z-10"
      >
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <Badge variant="secondary" className="bg-indigo-100 text-indigo-700 hover:bg-indigo-100 px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-widest border-none">
              Activity Hub
            </Badge>
            <h1 className="text-4xl font-black tracking-tight text-slate-900">Notifications <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Center</span></h1>
            <p className="text-slate-500 font-medium italic">Your central command for all placement and career updates.</p>
          </div>
          
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button 
                variant="ghost"
                onClick={handleMarkAllRead}
                className="text-xs font-black text-blue-600 uppercase tracking-widest hover:bg-blue-50 px-6 h-12 rounded-2xl transition-all"
              >
                Clear Inbox ({unreadCount})
              </Button>
            )}
            <Button className="bg-white text-slate-900 border border-slate-100 hover:bg-slate-50 h-12 w-12 p-0 rounded-2xl shadow-sm">
              <Filter size={18} />
            </Button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {loading && notifications.length === 0 ? (
            <div className="py-20">
               <Loader text="Syncing Activity..." />
            </div>
          ) : notifications.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-24 flex flex-col items-center text-center bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50"
            >
              <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mb-6 shadow-inner">
                <Bell className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Inbox Clean</h3>
              <p className="text-slate-400 text-sm font-bold italic mt-2 max-w-xs">You're all caught up! New updates will appear here in real-time.</p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {notifications.map((notification) => {
                const config = getTagConfig(String(notification.type));
                const TagIcon = config.icon;
                
                return (
                  <motion.div 
                    layout
                    key={notification.id}
                    variants={itemVariants}
                    onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                    className={cn(
                      "group relative bg-white p-6 lg:p-8 rounded-[2rem] border transition-all duration-500 cursor-pointer flex gap-6 overflow-hidden",
                      !notification.read 
                        ? 'border-blue-200 shadow-2xl shadow-blue-100/50 bg-gradient-to-br from-white to-blue-50/30 ring-4 ring-blue-500/5' 
                        : 'border-slate-100 hover:border-slate-200 hover:shadow-xl hover:shadow-slate-200/30'
                    )}
                  >
                    {!notification.read && (
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-blue-500 rounded-r-full" />
                    )}

                    {/* Icon */}
                    <div className={cn(
                      "mt-0.5 h-16 w-16 shrink-0 rounded-2xl flex items-center justify-center border shadow-sm transition-transform group-hover:scale-105 duration-500",
                      config.bg, config.color, config.border
                    )}>
                      <TagIcon size={24} strokeWidth={2.5} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <Badge variant="outline" className={cn("text-[9px] font-black uppercase tracking-widest border px-2", config.bg, config.color, config.border)}>
                                {config.label}
                             </Badge>
                             {!notification.read && (
                               <Badge className="bg-blue-600 text-white font-black text-[9px] uppercase tracking-widest px-1.5 h-4 flex items-center justify-center animate-pulse border-none">
                                 NEW
                               </Badge>
                             )}
                          </div>
                          <h3 className={cn(
                            "text-lg tracking-tight leading-tight transition-all",
                            !notification.read ? 'font-black text-slate-900' : 'font-bold text-slate-600'
                          )}>
                            {String(notification.title)}
                          </h3>
                        </div>
                        <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-widest bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 h-fit">
                          <Clock size={12} className="text-slate-300" />
                          {formatTime(String(notification.createdAt))}
                        </div>
                      </div>
                      
                      <p className={cn(
                        "text-sm leading-relaxed max-w-2xl transition-all",
                        !notification.read ? 'text-slate-600 font-semibold' : 'text-slate-400 font-medium'
                      )}>
                        {String(notification.message)}
                      </p>

                      {/* Actions */}
                      <div className="mt-6 flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <button className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-600 flex items-center gap-1.5 group/btn transition-all">
                            View Details 
                            <ArrowUpRight size={14} className="transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(notification.id);
                            }}
                            className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-300 hover:text-rose-500 transition-colors flex items-center gap-1.5"
                          >
                            <Trash2 size={14} /> Remove
                          </button>
                        </div>
                        
                        <div className="flex items-center">
                          <button className="text-slate-200 hover:text-slate-400 p-2 rounded-xl transition-all hover:bg-slate-50">
                            <MoreVertical size={18} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
              
              {/* Pagination Info */}
              {pagination.totalPages > pagination.page && (
                <motion.div variants={itemVariants} className="pt-6">
                  <Button 
                    onClick={() => dispatch(fetchNotifications({ page: pagination.page + 1, limit: pagination.limit }))}
                    className="w-full h-16 rounded-[2rem] bg-white border border-slate-100 text-slate-400 font-black text-xs uppercase tracking-widest hover:bg-slate-50 hover:text-slate-600 shadow-sm transition-all"
                    disabled={loading}
                  >
                    {loading ? <Loader size="sm" /> : 'Sync older activities'}
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          )}
        </div>

        {/* Quick Help Footer */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/80 backdrop-blur-md border border-white rounded-[2.5rem] p-6 shadow-2xl shadow-slate-200/50 flex flex-col sm:flex-row items-start sm:items-center gap-6"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
            <ShieldCheck size={28} />
          </div>
          <div className="flex-1">
            <h4 className="text-lg font-black text-slate-900 tracking-tight">Security Alert</h4>
            <p className="text-sm text-slate-500 font-bold italic">Never share your OTP or profile credentials with anyone. Career notifications will only ever appear here or on your official email.</p>
          </div>
          <Button
            variant="ghost"
            className="text-blue-600 font-black text-xs uppercase tracking-widest h-14 px-8 rounded-2xl hover:bg-blue-50"
          >
            Learn More
          </Button>
        </motion.div>
      </motion.main>
    </div>
  );
};

export default Notification;
