import { useEffect } from 'react';
import { 
  CheckCircle2, Briefcase, Calendar, 
  MoreVertical, Filter, 
  ArrowRight, Award, Bell, Loader2, Trash2
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

import Loader from '@/components/Loader';

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

  console.log("Notifications state:", notifications);

  const handleMarkAllRead = async () => {
    try {
      await dispatch(markAllNotificationsAsRead()).unwrap();
      toast.success("All notifications marked as read");
    } catch (error: any) {
      toast.error(error?.toString() || "Failed to mark all as read");
    }
  };

  const handleMarkAsRead = async (id: number) => {
    try {
      await dispatch(markNotificationAsRead(id)).unwrap();
    } catch (error: any) {
      toast.error(error?.toString() || "Failed to mark as read");
    }
  };

  const handleDelete = async (id: number) => {
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

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return date.toLocaleDateString();
  };

  // Color-coded tag badges by type
  const getTagStyles = (type: string) => {
    switch (type) {
      case 'APPLICATION_SELECTED':
      case 'OFFER_ACCEPTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'JOB_POSTED':
      case 'JOB_UPDATED':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'SCHEDULE_CREATED':
      case 'SCHEDULE_UPDATED':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'APPLICATION_REJECTED':
      case 'OFFER_REJECTED':
        return 'bg-red-50 text-red-700 border-red-200';
      default: return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  const getIcon = (type: string) => {
    const iconSize = 18;
    switch (type) {
      case 'APPLICATION_SELECTED':
      case 'OFFER_ACCEPTED':
        return <Award size={iconSize} />;
      case 'JOB_POSTED':
      case 'JOB_UPDATED':
        return <Briefcase size={iconSize} />;
      case 'SCHEDULE_CREATED':
      case 'SCHEDULE_UPDATED':
        return <Calendar size={iconSize} />;
      case 'APPLICATION_REJECTED':
        return <CheckCircle2 size={iconSize} className="text-red-500" />;
      default: return <Bell size={iconSize} />;
    }
  };

  const getIconStyles = (type: string) => {
    switch (type) {
      case 'APPLICATION_SELECTED':
      case 'OFFER_ACCEPTED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'SCHEDULE_CREATED':
      case 'SCHEDULE_UPDATED':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'JOB_POSTED':
      case 'JOB_UPDATED':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'APPLICATION_REJECTED':
        return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Activity Center</h2>
            <p className="text-slate-500 mt-1 text-sm">Manage your application updates and drive alerts.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={14} /> Filter
            </button>
            <button 
              onClick={handleMarkAllRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
            >
              Mark all read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {loading && notifications.length === 0 ? (
            <Loader text="Syncing your latest updates..." />
          ) : notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white">
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                <Bell className="w-8 h-8 text-slate-300" />
              </div>
              <p className="text-slate-500 font-medium">No notifications yet</p>
              <p className="text-slate-400 text-sm mt-1">We'll notify you when something important happens.</p>
            </div>
          ) : (
            <>
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  onClick={() => !notification.read && handleMarkAsRead(notification.id)}
                  className={`group relative p-5 flex gap-5 transition-all cursor-pointer border-l-4 hover:bg-slate-50/60 ${
                    !notification.read 
                      ? 'bg-blue-50/20 border-blue-500' 
                      : 'border-transparent'
                  }`}
                >
                  {/* Icon */}
                  <div className={`mt-0.5 h-10 w-10 shrink-0 rounded-lg flex items-center justify-center border ${getIconStyles(String(notification.type))}`}>
                    {getIcon(String(notification.type))}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getTagStyles(String(notification.type))}`}>
                          {String(notification.type).replace(/_/g, ' ')}
                        </span>
                        <h3 className={`text-slate-900 font-semibold leading-tight ${!notification.read ? 'text-[16px]' : 'text-[15px]'}`}>
                          {String(notification.title)}
                        </h3>
                      </div>
                      <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                        {formatTime(String(notification.createdAt))}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                      {String(notification.message)}
                    </p>

                    {/* Actions (Visible on Hover) */}
                    <div className="mt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="text-xs font-bold text-blue-600 flex items-center gap-1 hover:underline">
                        View Details <ArrowRight size={12} />
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(notification.id);
                        }}
                        className="text-xs font-bold text-red-400 hover:text-red-600 transition-colors flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>

                  {/* Context Menu Button */}
                  <button className="text-slate-300 hover:text-slate-600 p-1 rounded transition-colors self-start">
                    <MoreVertical size={18} />
                  </button>
                </div>
              ))}
              
              {/* Pagination Info */}
              {pagination.totalPages > pagination.page && (
                <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
                  <button 
                    onClick={() => dispatch(fetchNotifications({ page: pagination.page + 1, limit: pagination.limit }))}
                    className={`text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Load older notifications'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
};

export default Notification;