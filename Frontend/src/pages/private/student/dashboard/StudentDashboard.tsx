import { 
  LayoutDashboard, 
  Briefcase, 
  Calendar, 
  Bell, 
  FileText, 
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  Target
} from 'lucide-react';

const StudentDashboard = () => {
  const mainStats = [
    { label: 'Active Drives', value: '12', change: '+3 this week', icon: Briefcase, color: 'from-blue-600 to-cyan-500', shadow: 'shadow-blue-500/20' },
    { label: 'Applications', value: '08', change: '4 shortlisted', icon: FileText, color: 'from-indigo-600 to-purple-500', shadow: 'shadow-indigo-500/20' },
    { label: 'Interviews', value: '02', change: 'Next: Apr 12', icon: Calendar, color: 'from-violet-600 to-fuchsia-500', shadow: 'shadow-violet-500/20' },
    { label: 'Alerts', value: '05', change: '2 unread', icon: Bell, color: 'from-emerald-500 to-teal-400', shadow: 'shadow-emerald-500/20' },
  ];

  const applicationStatus = [
    { label: 'Applied', count: 8, color: 'bg-blue-600', percentage: 100 },
    { label: 'Shortlisted', count: 4, color: 'bg-indigo-500', percentage: 50 },
    { label: 'Interview', count: 2, color: 'bg-purple-500', percentage: 25 },
    { label: 'Selected', count: 1, color: 'bg-emerald-500', percentage: 12 },
  ];

  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 lg:p-8">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Welcome back, Anjali! 👋</h1>
          <p className="text-slate-500 font-medium">Here's what's happening with your placements today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative p-2.5 bg-white rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:bg-slate-50 transition-colors group">
            <Bell size={20} className="text-slate-600 group-hover:text-indigo-600" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </div>
          <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl shadow-sm border border-slate-200">
            <div className="w-10 h-10 bg-gradient-to-tr from-indigo-600 to-purple-500 rounded-xl flex items-center justify-center text-white font-bold">PS</div>
            <div className="hidden sm:block">
              <p className="text-xs font-bold text-slate-900 leading-tight">Anjali Sharma</p>
              <p className="text-[10px] font-medium text-slate-500">CSE • 2026</p>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {mainStats.map((stat) => (
          <div key={stat.label} className="group relative bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden">
            <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-[0.03] rounded-bl-[4rem] group-hover:scale-110 transition-transform`}></div>
            <div className="relative z-10">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} ${stat.shadow} rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
                <stat.icon size={22} />
              </div>
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
              <div className="flex items-end justify-between">
                <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
                <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-1 rounded-lg mb-1 flex items-center gap-1">
                  <TrendingUp size={12} /> {stat.change.split(' ')[0]}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Progress Tracker Card */}
        <div className="lg:col-span-2 bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                <Target size={20} />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Application Pipeline</h3>
            </div>
            <button className="text-sm font-bold text-indigo-600 hover:bg-indigo-50 px-4 py-2 rounded-xl transition-colors">Full Report</button>
          </div>
          
          <div className="space-y-8">
            {applicationStatus.map((status) => (
              <div key={status.label} className="group">
                <div className="flex justify-between items-end mb-2">
                  <span className="text-sm font-bold text-slate-700">{status.label}</span>
                  <span className="text-sm font-black text-slate-900">{status.count} <span className="text-slate-400 font-medium">files</span></span>
                </div>
                <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${status.color} rounded-full transition-all duration-1000 group-hover:opacity-80`}
                    style={{ width: `${status.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interviews & Notifications Sidebar */}
        <div className="space-y-8">
          {/* Upcoming Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 blur-3xl"></div>
            <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
              <Calendar size={18} className="text-indigo-400" /> Next Interview
            </h3>
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 group cursor-pointer hover:bg-white/15 transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black">Go</div>
                  <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-tighter">Online</span>
                </div>
                <h4 className="font-bold">Google</h4>
                <p className="text-xs text-slate-400 mb-3">SDE Intern • 10:00 AM</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-400">Apr 12, 2026</span>
                  <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Clock size={18} className="text-slate-400" /> Recent Updates
            </h3>
            <div className="space-y-6">
              {[
                { title: 'Shortlisted', company: 'Amazon', time: '2h ago', color: 'bg-emerald-500' },
                { title: 'New Drive', company: 'Infosys', time: '5h ago', color: 'bg-blue-600' },
                { title: 'Interview', company: 'Microsoft', time: '1d ago', color: 'bg-amber-500' },
              ].map((update, i) => (
                <div key={i} className="flex gap-4 group cursor-pointer">
                  <div className="relative">
                    <div className={`w-3 h-3 rounded-full ${update.color} ring-4 ring-white group-hover:scale-125 transition-transform`} />
                    {i !== 2 && <div className="absolute top-3 left-1.5 w-[1px] h-10 bg-slate-100" />}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800 leading-tight">
                      {update.title}: <span className="text-slate-500 font-medium">{update.company}</span>
                    </p>
                    <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">{update.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default StudentDashboard;