import { 
  Bell, CheckCircle2, Briefcase, Calendar, Mail, 
  BellRing, MoreVertical, Filter,
  PanelLeftOpen
} from 'lucide-react';

const Notification = () => {
  const notifications = [
    {
      id: 1,
      type: 'shortlist',
      title: 'Shortlisted for Amazon — Data Analyst',
      description: 'You have been shortlisted for the technical round. Prepare accordingly.',
      time: '2 hours ago',
      unread: true,
      icon: <CheckCircle2 size={20} className="text-emerald-500" />
    },
    {
      id: 2,
      type: 'drive',
      title: 'New Drive: Infosys — System Engineer',
      description: 'A new placement drive has been posted. Check eligibility and apply before Apr 25.',
      time: '5 hours ago',
      unread: true,
      icon: <Briefcase size={20} className="text-blue-600" />
    },
    {
      id: 3,
      type: 'interview',
      title: 'Interview Scheduled: Google',
      description: 'Your Technical Round 1 interview with Google is scheduled for Apr 12 at 10:00 AM.',
      time: '1 day ago',
      unread: false,
      icon: <Calendar size={20} className="text-amber-500" />
    },
    {
      id: 4,
      type: 'application',
      title: 'Application Received: TCS',
      description: 'Your application for Software Dev at TCS has been received successfully.',
      time: '2 days ago',
      unread: false,
      icon: <Mail size={20} className="text-slate-500" />
    },
    {
      id: 5,
      type: 'verification',
      title: 'Profile Verification Complete',
      description: 'Your academic profile has been verified by the TPO. You can now apply for drives.',
      time: '3 days ago',
      unread: false,
      icon: <CheckCircle2 size={20} className="text-emerald-500" />
    },
    {
      id: 6,
      type: 'reminder',
      title: 'Reminder: Upload Updated Resume',
      description: 'Please upload your latest resume before the upcoming Google placement drive.',
      time: '4 days ago',
      unread: false,
      icon: <BellRing size={20} className="text-amber-500" />
    },
    {
      id: 7,
      type: 'results',
      title: 'Microsoft Results Announced',
      description: 'Congratulations! You have been selected for Full Stack Developer at Microsoft.',
      time: '5 days ago',
      unread: false,
      icon: <CheckCircle2 size={20} className="text-emerald-500" />
    }
  ];

  const unreadCount = notifications.filter(n => n.unread).length;

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Header */}
      <nav className="sticky top-0 z-30 w-full bg-white border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors lg:hidden">
              <PanelLeftOpen size={22} />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <Bell size={20} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Notifications</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-slate-600">
            <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={22} />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-[10px] text-white flex items-center justify-center font-bold rounded-full border-2 border-white">
                  {unreadCount}
                </span>
              )}
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1.5 rounded-full px-3 transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                PS
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <span className="bg-emerald-600 px-3 py-1 text-xs font-bold text-white rounded-full shadow-sm">
              {unreadCount} unread
            </span>
          </div>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-semibold text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all">
              <Filter size={16} /> Filter
            </button>
            <button className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 px-3 py-1.5 rounded-lg transition-colors">
              Mark all as read
            </button>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden divide-y divide-slate-100">
          {notifications.map((notification) => (
            <div 
              key={notification.id}
              className={`p-6 flex gap-6 transition-all cursor-pointer hover:bg-slate-50/80 group relative ${notification.unread ? 'bg-indigo-50/20' : ''}`}
            >
              <div className={`mt-1 h-10 w-10 shrink-0 rounded-xl flex items-center justify-center shadow-sm border ${
                notification.unread ? 'bg-white border-indigo-100' : 'bg-slate-50 border-slate-100'
              }`}>
                {notification.icon}
              </div>

              <div className="flex-1">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`font-bold text-slate-800 text-lg transition-colors group-hover:text-indigo-600 ${
                    notification.unread ? 'font-extrabold' : ''
                  }`}>
                    {notification.title}
                  </h3>
                  {notification.unread && (
                    <div className="h-2.5 w-2.5 bg-blue-600 rounded-full shadow-sm shadow-blue-200" />
                  )}
                </div>
                <p className={`text-slate-600 mb-2 leading-relaxed ${notification.unread ? 'font-medium' : ''}`}>
                  {notification.description}
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                  <span className={notification.unread ? 'text-indigo-600' : ''}>
                    {notification.time}
                  </span>
                </div>
              </div>

              <button className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-slate-600 transition-all rounded-lg">
                <MoreVertical size={18} />
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Notification;