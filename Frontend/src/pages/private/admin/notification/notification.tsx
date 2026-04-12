import React, { useState } from 'react';
import {
  AlertTriangle, Info,
  Settings, MoreVertical, ExternalLink, Search,
  ShieldAlert, Clock
} from 'lucide-react';

// --- Types ---
type NotificationPriority = 'low' | 'medium' | 'high' | 'critical';

interface AdminNotification {
  id: string;
  category: 'System' | 'Placement' | 'User Activity';
  title: string;
  message: string;
  time: string;
  priority: NotificationPriority;
  isRead: boolean;
  actionLabel?: string;
}

const AdminNotificationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Critical' | 'System'>('All');

  const notifications: AdminNotification[] = [
    {
      id: '1',
      category: 'Placement',
      title: 'New Student Registration',
      message: 'Anjali (B.Tech CSE) has uploaded a new resume for verification.',
      time: '2 mins ago',
      priority: 'medium',
      isRead: false,
      actionLabel: 'Verify Profile'
    },

    {
      id: '3',
      category: 'User Activity',
      title: 'Batch Selection Completed',
      message: 'Microsoft has finalized the shortlist for the Full Stack Developer role.',
      time: '2 hours ago',
      priority: 'low',
      isRead: true,
      actionLabel: 'Download List'
    },
    {
      id: '4',
      category: 'System',
      title: 'Database Backup Failed',
      message: 'The scheduled daily backup at 03:00 AM failed due to a timeout error.',
      time: '12 hours ago',
      priority: 'critical',
      isRead: false,
      actionLabel: 'Retry Backup'
    }
  ];

  const getPriorityStyles = (priority: NotificationPriority) => {
    switch (priority) {
      case 'critical': return 'bg-rose-50 text-rose-600 border-rose-100';
      case 'high': return 'bg-orange-50 text-orange-600 border-orange-100';
      case 'medium': return 'bg-blue-50 text-blue-600 border-blue-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  const getPriorityIcon = (priority: NotificationPriority) => {
    switch (priority) {
      case 'critical': return <ShieldAlert size={18} />;
      case 'high': return <AlertTriangle size={18} />;
      case 'medium': return <Info size={18} />;
      default: return <Clock size={18} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-10 px-6">
      <div className="max-w-5xl mx-auto">
        {/* Header Area */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">


          <div className="flex items-center gap-3">
            <button className="p-2.5 bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-all">
              <Settings size={20} />
            </button>
            <button className="px-5 py-2.5 bg-indigo-600 text-white text-sm font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md active:scale-95">
              Mark all as read
            </button>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {['All', 'Critical', 'System'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === tab 
                    ? 'bg-white text-indigo-600 shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Search notifications..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Notifications List */}
        <div className="space-y-4">
          {notifications.map((notif) => (
            <div 
              key={notif.id}
              className={`group bg-white rounded-2xl border-l-4 p-5 flex gap-5 transition-all hover:shadow-md ${
                notif.isRead ? 'border-transparent' : 'border-indigo-500 shadow-sm'
              }`}
            >
              {/* Icon Container */}
              <div className={`h-12 w-12 shrink-0 rounded-2xl flex items-center justify-center border ${getPriorityStyles(notif.priority)}`}>
                {getPriorityIcon(notif.priority)}
              </div>

              {/* Content Area */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500">{notif.category}</span>
                    <span className="w-1 h-1 bg-slate-300 rounded-full" />
                    <h3 className={`text-slate-900 leading-tight ${notif.isRead ? 'font-semibold' : 'font-bold text-lg'}`}>
                      {notif.title}
                    </h3>
                  </div>
                  <span className="text-xs font-bold text-slate-400">{notif.time}</span>
                </div>
                
                <p className="text-slate-600 text-sm font-medium mb-4 max-w-2xl">
                  {notif.message}
                </p>

                {/* Footer / Actions */}
                <div className="flex items-center gap-3">
                  {notif.actionLabel && (
                    <button className="flex items-center gap-2 px-4 py-1.5 bg-slate-900 text-white text-[11px] font-bold rounded-lg hover:bg-slate-800 transition-all">
                      {notif.actionLabel} <ExternalLink size={12} />
                    </button>
                  )}
                  <button className="text-[11px] font-bold text-slate-400 hover:text-indigo-600 transition-colors">
                    Dismiss
                  </button>
                </div>
              </div>

              {/* Interaction Menu */}
              <div className="flex flex-col justify-between items-end">
                <button className="text-slate-300 hover:text-slate-600 p-1 rounded transition-colors">
                  <MoreVertical size={20} />
                </button>
                {!notif.isRead && (
                   <div className="h-2.5 w-2.5 bg-indigo-500 rounded-full animate-pulse shadow-sm shadow-indigo-200" />
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer / Stats */}
        <div className="mt-8 flex items-center justify-between px-2">
           <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
             Showing {notifications.length} notifications
           </p>
           <button className="text-xs font-bold text-rose-500 hover:underline">
             Clear all logs
           </button>
        </div>
      </div>
    </div>
  );
};

export default AdminNotificationPage;