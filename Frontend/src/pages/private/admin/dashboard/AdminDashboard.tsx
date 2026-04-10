import React from 'react';
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  MoreVertical,
  ChevronRight,
  Plus,
  ArrowUpRight
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';

const AdminDashboard: React.FC = () => {
  const deptData = [
    { name: 'CSE', applied: 85, placed: 120 },
    { name: 'ECE', applied: 60, placed: 100 },
    { name: 'ME', applied: 40, placed: 90 },
    { name: 'CE', applied: 35, placed: 80 },
    { name: 'EE', applied: 50, placed: 85 },
    { name: 'IT', applied: 70, placed: 95 },
  ];

  const placementStatusData = [
    { name: 'Placed', value: 340, color: '#2563eb' },
    { name: 'In Process', value: 120, color: '#14b8a6' },
    { name: 'Unplaced', value: 110, color: '#94a3b8' },
  ];

  const recentDrives = [
    { id: 1, company: 'Google', role: 'SDE Intern', date: 'Apr 10', applied: 145, status: 'active' },
    { id: 2, company: 'Microsoft', role: 'Full Stack Dev', date: 'Apr 8', applied: 198, status: 'completed' },
    { id: 3, company: 'Amazon', role: 'Data Analyst', date: 'Apr 5', applied: 89, status: 'completed' },
    { id: 4, company: 'Infosys', role: 'System Engineer', date: 'Apr 3', applied: 156, status: 'upcoming' },
  ];

  const topStudents = [
    { id: 1, name: 'Priya Sharma', branch: 'CSE', cgpa: 9.4, offers: 3, rank: 1 },
    { id: 2, name: 'Rahul Verma', branch: 'IT', cgpa: 9.2, offers: 2, rank: 2 },
    { id: 3, name: 'Ananya Patel', branch: 'ECE', cgpa: 9.1, offers: 2, rank: 3 },
    { id: 4, name: 'Vikram Singh', branch: 'CSE', cgpa: 8.9, offers: 1, rank: 4 },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in mt-2">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 font-medium tracking-tight">Welcome back, Admin. Real-time metrics for campus placements.</p>
        </div>
        <div className="flex gap-3">
          <button className="flex-1 md:flex-none px-6 py-2.5 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all">
            Download Report
          </button>
          <button className="flex-1 md:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Create Drive
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <StatCard 
          label="Total Students" 
          value="1,240" 
          trend="+12%" 
          subtext="vs last batch" 
          icon={Users} 
        />
        <StatCard 
          label="Students Placed" 
          value="485" 
          trend="39%" 
          subtext="Current placement rate" 
          icon={Briefcase} 
        />
        <StatCard 
          label="Top Package" 
          value="₹45 LPA" 
          trend="New Record" 
          subtext="By Google Ltd." 
          icon={TrendingUp} 
        />
        <StatCard 
          label="Avg Package" 
          value="₹8.2 LPA" 
          trend="+8%" 
          subtext="Steady growth" 
          icon={ArrowUpRight} 
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Department Performance</h3>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} 
                  dy={15}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 11, fontWeight: 700 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '20px', border: 'none', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                />
                <Bar dataKey="applied" fill="#2563eb" radius={[6, 6, 0, 0]} barSize={25} />
                <Bar dataKey="placed" fill="#e2e8f0" radius={[6, 6, 0, 0]} barSize={25} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Placement Ratio</h3>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
          <div className="h-[250px] relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={placementStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={95}
                  paddingAngle={8}
                  dataKey="value"
                >
                  {placementStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-black text-slate-900 tracking-tighter">64%</span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Growth</span>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            {placementStatusData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                  <span className="text-sm font-bold text-slate-600">{item.name}</span>
                </div>
                <span className="text-sm font-black text-slate-900">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        {/* Recent Placement Drives */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Recent Drives</h3>
            <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline underline-offset-4">
              Explore All <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {recentDrives.map((drive) => (
              <div key={drive.id} className="p-8 hover:bg-blue-50/30 transition-all group cursor-pointer">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-center text-xl font-black text-slate-400 group-hover:bg-white group-hover:border-blue-200 group-hover:text-blue-600 transition-all uppercase">
                      {drive.company[0]}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{drive.company}</h4>
                      <p className="text-sm font-bold text-slate-400">{drive.role} • <span className="text-slate-500">{drive.date}</span></p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="hidden sm:block text-right">
                      <p className="text-sm font-black text-slate-900">{drive.applied}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">applied</p>
                    </div>
                    <Badge variant={drive.status === 'active' ? 'primary' : drive.status === 'completed' ? 'success' : 'secondary'}>
                      {drive.status}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Students */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Top Performing</h3>
            <button className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline underline-offset-4">
              Full List <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="divide-y divide-slate-50">
            {topStudents.map((student) => (
              <div key={student.id} className="p-8 hover:bg-blue-50/30 transition-all group cursor-pointer">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg ${
                      student.rank === 1 ? 'bg-amber-100 text-amber-600 shadow-inner' :
                      student.rank === 2 ? 'bg-slate-100 text-slate-500' :
                      student.rank === 3 ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-50 text-blue-400'
                    }`}>
                      {student.rank}
                    </div>
                    <div>
                      <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</h4>
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-tighter">{student.branch} • <span className="text-indigo-600">CGPA: {student.cgpa}</span></p>
                    </div>
                  </div>
                  <Badge variant="ghost" className="font-black text-blue-600 bg-blue-50/50 px-4">
                    {student.offers} {student.offers > 1 ? 'offers' : 'offer'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Box */}
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 relative overflow-hidden group">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-600/20 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-blue-600/30 transition-all duration-700"></div>
        <div className="absolute left-1/4 bottom-0 w-40 h-40 bg-teal-500/10 rounded-full blur-2xl group-hover:bg-teal-500/20 transition-all duration-700"></div>
        
        <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-black text-white tracking-tight">Ready to launch a new drive?</h2>
            <p className="text-slate-400 font-medium">Auto-filter eligible candidates and notify them instantly via portal & email.</p>
          </div>
          <button className="w-full lg:w-auto px-10 py-5 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-blue-500/20 uppercase tracking-widest text-sm">
            Launch Drive Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
