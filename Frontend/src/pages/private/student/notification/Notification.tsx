import React from 'react';
import { 
  Bell, CheckCircle2, Briefcase, Calendar, Mail, 
  BellRing, MoreVertical, Filter, PanelLeftOpen,
  Check, Info, ArrowRight
} from 'lucide-react';

const Notification = () => {
  const notifications = [
    {
      id: 1,
      type: 'Shortlist',
      title: 'Shortlisted for Amazon — Data Analyst',
      description: 'You have been shortlisted for the technical round. Prepare accordingly.',
      time: '2 hours ago',
      unread: true,
      status: 'success',
      icon: <CheckCircle2 size={18} />
    },
    {
      id: 2,
      type: 'Drive',
      title: 'New Drive: Infosys — System Engineer',
      description: 'A new placement drive has been posted. Check eligibility and apply before Apr 25.',
      time: '5 hours ago',
      unread: true,
      status: 'info',
      icon: <Briefcase size={18} />
    },
    {
      id: 3,
      type: 'Interview',
      title: 'Interview Scheduled: Google',
      description: 'Your Technical Round 1 interview with Google is scheduled for Apr 12 at 10:00 AM.',
      time: '1 day ago',
      unread: false,
      status: 'warning',
      icon: <Calendar size={18} />
    },
    {
      id: 7,
      type: 'Offer',
      title: 'Microsoft Results Announced',
      description: 'Congratulations! You have been selected for Full Stack Developer at Microsoft.',
      time: '5 days ago',
      unread: false,
      status: 'success',
      icon: <CheckCircle2 size={18} />
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  const getStatusStyles = (status:any) => {
    switch (status) {
      case 'success': return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'warning': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'info': return 'bg-blue-50 text-blue-700 border-blue-100';
      default: return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Navbar */}
      <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="flex justify-between items-center max-w-6xl mx-auto px-6 h-16">
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg lg:hidden transition-colors">
              <PanelLeftOpen size={20} />
            </button>
            <h1 className="text-lg font-semibold text-slate-900 tracking-tight">Notifications</h1>
          </div>
          
          <div className="flex items-center gap-5">
            <div className="hidden md:flex items-center gap-2 text-sm font-medium text-slate-500">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              System Live
            </div>
            <div className="h-4 w-px bg-slate-200" />
            <div className="relative group cursor-pointer">
              <div className="w-9 h-9 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-bold ring-2 ring-white shadow-sm group-hover:ring-indigo-100 transition-all">
                AS
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Activity Center</h2>
            <p className="text-slate-500 mt-1 text-sm">Manage your application updates and drive alerts.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-all shadow-sm">
              <Filter size={14} /> Filter
            </button>
            <button className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
              Mark all read
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`group relative p-5 flex gap-5 transition-all border-l-4 ${
                notification.unread 
                  ? 'bg-indigo-50/30 border-indigo-500' 
                  : 'border-transparent hover:bg-slate-50/50'
              }`}
            >
              {/* Icon */}
              <div className={`mt-0.5 h-10 w-10 shrink-0 rounded-lg flex items-center justify-center border ${getStatusStyles(notification.status)}`}>
                {notification.icon}
              </div>

              {/* Content */}
              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-1 mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getStatusStyles(notification.status)}`}>
                      {notification.type}
                    </span>
                    <h3 className={`text-slate-900 font-semibold leading-tight ${notification.unread ? 'text-[16px]' : 'text-[15px]'}`}>
                      {notification.title}
                    </h3>
                  </div>
                  <span className="text-xs font-medium text-slate-400 whitespace-nowrap">
                    {notification.time}
                  </span>
                </div>
                
                <p className="text-slate-600 text-sm leading-relaxed max-w-2xl">
                  {notification.description}
                </p>

                {/* Actions (Visible on Hover) */}
                <div className="mt-3 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                   <button className="text-xs font-bold text-indigo-600 flex items-center gap-1 hover:underline">
                     View Details <ArrowRight size={12} />
                   </button>
                   <button className="text-xs font-bold text-slate-400 hover:text-slate-600 transition-colors">
                     Dismiss
                   </button>
                </div>
              </div>

              {/* Context Menu Button */}
              <button className="text-slate-300 hover:text-slate-600 p-1 rounded transition-colors self-start">
                <MoreVertical size={18} />
              </button>
            </div>
          ))}
          
          {/* Footer of card */}
          <div className="bg-slate-50 p-4 border-t border-slate-100 text-center">
            <button className="text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors">
              Load older notifications
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Notification;