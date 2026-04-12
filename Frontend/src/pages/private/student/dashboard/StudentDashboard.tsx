import { 
  Briefcase, 
  Calendar, 
  Bell, 
  FileText, 
  Clock,
  ChevronRight,
  Target
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import useAuth from '@/redux/hooks/useAuth';

const StudentDashboard = () => {
  const { firstName, initials, fullName, studentData } = useAuth();

  const applicationStatus = [
    { label: 'Applied', count: 8, color: 'bg-blue-600', percentage: 100 },
    { label: 'Shortlisted', count: 4, color: 'bg-indigo-500', percentage: 50 },
    { label: 'Interview', count: 2, color: 'bg-purple-500', percentage: 25 },
    { label: 'Selected', count: 1, color: 'bg-emerald-500', percentage: 12 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in mt-2 p-4 md:p-0">
      {/* Header Area */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Welcome, {firstName}! 👋</h1>
          <p className="text-slate-500 font-medium">Elevate your carrier. Here's your placement progress.</p>
        </div>
        <div className="hidden md:flex items-center gap-3 bg-white p-2 pr-6 rounded-2xl shadow-sm border border-slate-100 transition-all hover:shadow-md">
          <div className="w-10 h-10 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-white font-black text-xs shadow-lg shadow-blue-500/20">{initials}</div>
          <div>
            <p className="text-xs font-black text-slate-900 leading-tight uppercase tracking-tight">{fullName}</p>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {studentData?.department ?? 'Student'} • {studentData?.batch ?? 'Batch 2026'}
            </p>
          </div>
        </div>
      </header>

      {/* Hero Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard label="Active Drives" value="12" subtext="+3 this week" icon={Briefcase} />
        <StatCard label="Applications" value="08" subtext="4 shortlisted" icon={FileText} />
        <StatCard label="Interviews" value="02" subtext="Next: Apr 12" icon={Calendar} />
        <StatCard label="Alerts" value="05" subtext="2 unread" icon={Bell} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        
        {/* Progress Tracker Card */}
        <div className="lg:col-span-2 bg-white p-6 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
          
          <div className="relative flex items-center justify-between mb-10">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
                <Target size={24} />
              </div>
              <h3 className="text-xl font-black text-slate-900 tracking-tight">Application Pipeline</h3>
            </div>
            <button className="text-xs font-black text-indigo-600 hover:bg-indigo-50 px-5 py-2.5 rounded-xl transition-all uppercase tracking-widest border border-indigo-100">Analytics</button>
          </div>
          
          <div className="relative space-y-8">
            {applicationStatus.map((status) => (
              <div key={status.label} className="group">
                <div className="flex justify-between items-end mb-3">
                  <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{status.label}</span>
                  <span className="text-sm font-black text-slate-900">{status.count} <span className="text-slate-400 font-bold ml-1">leads</span></span>
                </div>
                <div className="h-3.5 bg-slate-50 rounded-full overflow-hidden border border-slate-100/50">
                  <div 
                    className={`h-full ${status.color} rounded-full transition-all duration-1000 shadow-sm group-hover:brightness-110`}
                    style={{ width: `${status.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interviews & Notifications Sidebar */}
        <div className="space-y-6 md:space-y-8">
          {/* Upcoming Interview Card */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-900/40 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-blue-500/20 blur-3xl group-hover:bg-blue-500/30 transition-colors duration-700"></div>
            <h3 className="text-lg font-black mb-8 flex items-center gap-3 relative z-10">
              <div className="w-2 h-2 bg-indigo-400 rounded-full animate-pulse"></div>
              NEXT INTERVIEW
            </h3>
            <div className="relative z-10 space-y-4">
              <div className="bg-white/10 backdrop-blur-xl p-5 rounded-[2rem] border border-white/10 group cursor-pointer hover:bg-white/15 transition-all shadow-xl">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-900 font-black text-lg">Go</div>
                  <Badge variant="success" size="xs" className="bg-emerald-500/20 text-emerald-400 border-none px-3">Online</Badge>
                </div>
                <h4 className="text-lg font-black tracking-tight">Google India</h4>
                <p className="text-xs font-bold text-slate-400 mb-5 uppercase tracking-wide">SDE Intern • 10:00 AM</p>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs font-black text-indigo-400 uppercase tracking-widest">Apr 12, 2026</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ChevronRight size={18} className="text-white" />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3">
              <Clock size={20} className="text-slate-400" /> RECENT UPDATES
            </h3>
            <div className="space-y-8">
              {[
                { title: 'Shortlisted', company: 'Amazon', time: '2h ago', color: 'bg-emerald-500' },
                { title: 'New Drive', company: 'Infosys', time: '5h ago', color: 'bg-blue-600' },
                { title: 'Interview', company: 'Microsoft', time: '1d ago', color: 'bg-amber-500' },
              ].map((update, i) => (
                <div key={i} className="flex gap-5 group cursor-pointer">
                  <div className="relative flex flex-col items-center">
                    <div className={`w-3.5 h-3.5 rounded-full ${update.color} ring-4 ring-white shadow-sm group-hover:scale-125 transition-all duration-300 z-10`} />
                    {i !== 2 && <div className="absolute top-4 w-[2px] h-12 bg-slate-50 group-hover:bg-slate-100 transition-colors" />}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-black text-slate-900 leading-none tracking-tight">
                      {update.title} <span className="text-slate-400 font-bold mx-1">·</span> <span className="text-slate-500 font-bold">{update.company}</span>
                    </p>
                    <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{update.time}</p>
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
