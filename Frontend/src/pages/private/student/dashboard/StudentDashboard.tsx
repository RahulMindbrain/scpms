import { 
  LayoutDashboard, 
  User, 
  CheckCircle, 
  Briefcase, 
  FileSearch, 
  Calendar, 
  Bell, 
  FileText, 
  Clock,
  ExternalLink
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import type { SidebarItem } from '@/components/layout/Sidebar';

const StudentDashboard = () => {
  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard', section: 'Main' },
    { icon: User, label: 'My Profile', path: '/student/profile', section: 'Main' },
    { icon: CheckCircle, label: 'Eligibility', path: '/student/eligibility', section: 'Main' },
    { icon: Briefcase, label: 'Job Listings', path: '/student/jobs', section: 'Main' },
    { icon: FileSearch, label: 'My Applications', path: '/student/applications', section: 'Main' },
    { icon: Calendar, label: 'Interview Schedule', path: '/student/interviews', section: 'Tools' },
    { icon: Bell, label: 'Notifications', path: '/student/notifications', section: 'Tools' },
    { icon: FileText, label: 'Documents', path: '/student/documents', section: 'Tools' },
  ];

  const mainStats = [
    { label: 'Active Drives', value: '12', change: '+3 this week', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'My Applications', value: '8', change: '4 shortlisted', icon: FileText, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Upcoming Interviews', value: '2', change: 'Next: Apr 12', icon: Calendar, color: 'text-purple-600', bg: 'bg-purple-50' },
    { label: 'Notifications', value: '5', change: '2 unread', icon: Bell, color: 'text-blue-500', bg: 'bg-blue-50' },
  ];

  const applicationStatus = [
    { label: 'Applied', count: 8, color: 'bg-blue-600', percentage: 100 },
    { label: 'Shortlisted', count: 4, color: 'bg-emerald-500', percentage: 50 },
    { label: 'Interview', count: 2, color: 'bg-blue-400', percentage: 25 },
    { label: 'Selected', count: 1, color: 'bg-cyan-400', percentage: 12 },
    { label: 'Rejected', count: 1, color: 'bg-blue-300', percentage: 12 },
  ];

  const upcomingInterviews = [
    { company: 'Google', role: 'SDE Intern', date: 'Apr 12, 2026', time: '10:00 AM', type: 'Online', logo: 'Go' },
    { company: 'Microsoft', role: 'Full Stack Dev', date: 'Apr 15, 2026', time: '2:00 PM', type: 'On-site', logo: 'Mi' },
  ];

  const notifications = [
    { text: "You've been shortlisted for Amazon - Data Analyst", time: '2 hours ago', type: 'shortlist', dotColor: 'bg-emerald-500' },
    { text: 'New drive posted: Infosys - System Engineer', time: '5 hours ago', type: 'new', dotColor: 'bg-blue-600' },
    { text: 'Interview scheduled with Google on Apr 12', time: '1 day ago', type: 'interview', dotColor: 'bg-amber-500' },
    { text: 'Application received by TCS', time: '2 days ago', type: 'received', dotColor: 'bg-blue-600' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar 
        items={sidebarItems} 
        portalName="Student Portal" 
        onSignOut={() => console.log('Sign Out')} 
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/80 backdrop-blur-md z-10 py-2">
          <div className="flex items-center gap-2 text-gray-600">
            <LayoutDashboard className="w-5 h-5" />
            <h2 className="font-bold text-xl text-gray-800">Student Dashboard</h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer group">
              <Bell className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">5</span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-cyan-600/20 border-2 border-white">PS</div>
            </div>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {mainStats.map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 flex items-start justify-between hover:translate-y-[-4px] transition-all duration-300">
              <div>
                <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                  <span className={`text-xs font-semibold ${stat.label === 'Active Drives' ? 'text-emerald-500' : 'text-gray-400'}`}>
                    {stat.change}
                  </span>
                </div>
              </div>
              <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                <stat.icon className="w-6 h-6" />
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Application Status Chart-like List */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">Application Status</h3>
              </div>
            </div>
            <div className="space-y-6">
              {applicationStatus.map((status) => (
                <div key={status.label} className="flex items-center group">
                  <span className="w-24 text-sm font-medium text-gray-500">{status.label}</span>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full mx-4 overflow-hidden">
                    <div 
                      className={`h-full ${status.color} rounded-full transition-all duration-1000 ease-out`}
                      style={{ width: `${status.percentage}%` }}
                    ></div>
                  </div>
                  <span className="w-4 text-sm font-bold text-gray-800">{status.count}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Interviews */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Calendar className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Upcoming Interviews</h3>
            </div>
            <div className="space-y-4">
              {upcomingInterviews.map((interview) => (
                <div key={interview.company} className="p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all cursor-pointer group">
                  <div className="flex gap-4 items-center">
                    <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-blue-600/10 group-hover:scale-105 transition-transform duration-300">
                      {interview.logo}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-900 leading-tight">{interview.company}</h4>
                      <p className="text-xs text-gray-500 font-medium">{interview.role}</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>{interview.date} • {interview.time}</span>
                      </div>
                    </div>
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                      interview.type === 'Online' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                    }`}>
                      {interview.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Notifications */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Clock className="w-5 h-5 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 tracking-tight">Recent Notifications</h3>
          </div>
          <div className="space-y-8 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-gray-100">
            {notifications.map((notif, index) => (
              <div key={index} className="flex gap-6 relative group">
                <div className={`w-4 h-4 rounded-full ${notif.dotColor} border-4 border-white shadow-sm ring-1 ring-gray-100 z-10 transition-transform group-hover:scale-125`}></div>
                <div className="flex flex-col">
                  <p className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors leading-relaxed">{notif.text}</p>
                  <span className="text-xs text-gray-500 font-medium mt-1">{notif.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default StudentDashboard;
