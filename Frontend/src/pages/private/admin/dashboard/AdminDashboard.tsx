import React from 'react';
import { 
  Users, Briefcase, TrendingUp, MoreVertical, 
  ChevronRight, Plus, ArrowUpRight, Search, 
  Bell, Calendar, Download, Filter
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, PieChart, 
  Pie, Cell, AreaChart, Area 
} from 'recharts';
import { motion } from 'framer-motion';

// --- Mock Data ---
const deptData = [
  { name: 'CSE', applied: 85, placed: 120 },
  { name: 'ECE', applied: 60, placed: 100 },
  { name: 'ME', applied: 40, placed: 90 },
  { name: 'CE', applied: 35, placed: 80 },
  { name: 'EE', applied: 50, placed: 85 },
  { name: 'IT', applied: 70, placed: 95 },
];

const placementStatusData = [
  { name: 'Placed', value: 340, color: '#4F46E5' }, // Indigo 600
  { name: 'In Process', value: 120, color: '#06B6D4' }, // Cyan 500
  { name: 'Unplaced', value: 110, color: '#94A3B8' }, // Slate 400
];

const recentDrives = [
  { id: 1, company: 'Google', role: 'SDE Intern', date: 'Apr 10', applied: 145, status: 'active' },
  { id: 2, company: 'Microsoft', role: 'Full Stack Dev', date: 'Apr 8', applied: 198, status: 'completed' },
  { id: 3, company: 'Amazon', role: 'Data Analyst', date: 'Apr 5', applied: 89, status: 'completed' },
];

// --- Custom Components ---

const GlassCard = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`bg-white/70 backdrop-blur-md border border-slate-200/60 rounded-3xl shadow-sm ${className}`}
  >
    {children}
  </motion.div>
);

const StatCard = ({ label, value, trend, icon: Icon, color }: any) => (
  <GlassCard className="p-6 group hover:border-indigo-300 transition-colors duration-300">
    <div className="flex justify-between items-start">
      <div className="p-3 rounded-2xl bg-slate-50 group-hover:bg-indigo-50 transition-colors">
        <Icon className="w-6 h-6 text-slate-600 group-hover:text-indigo-600" />
      </div>
      <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend.includes('+') ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'}`}>
        {trend}
      </span>
    </div>
    <div className="mt-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
    </div>
  </GlassCard>
);

const AdminDashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Navbar-ish Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-slate-900">
              Placement Portal <span className="text-indigo-600">Analytics</span>
            </h1>
            <p className="text-slate-500 font-medium">Thursday, 9 April 2026</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative hidden lg:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search analytics..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64 transition-all"
              />
            </div>
            <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50">
              <Bell className="w-5 h-5" />
            </button>
            
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <StatCard label="Total Candidates" value="1,240" trend="+12.5%" icon={Users} />
          <StatCard label="Placed Students" value="485" trend="39% Rate" icon={Briefcase} />
          <StatCard label="Highest Package" value="₹45.0 LPA" trend="Record" icon={TrendingUp} />
          <StatCard label="Average CTC" value="₹8.2 LPA" trend="+8.2%" icon={ArrowUpRight} />
        </div>

        {/* Main Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main Bar Chart */}
          <GlassCard className="lg:col-span-2 p-6 md:p-8">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Department Performance</h3>
                <p className="text-sm text-slate-500 font-medium">Applied vs Placed ratio per branch</p>
              </div>
              <select className="bg-slate-50 border-none text-xs font-bold rounded-lg px-3 py-2 outline-none">
                <option>Current Batch</option>
                <option>2025 Batch</option>
              </select>
            </div>
            <div className="h-[350px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={deptData} barGap={8}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 12, fontWeight: 600 }} 
                    dy={10}
                  />
                  <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                  <Tooltip 
                    cursor={{ fill: '#f8fafc' }}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="applied" fill="#4F46E5" radius={[4, 4, 0, 0]} barSize={32} />
                  <Bar dataKey="placed" fill="#E2E8F0" radius={[4, 4, 0, 0]} barSize={32} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>

          {/* Donut Chart */}
          <GlassCard className="p-6 md:p-8 flex flex-col">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Placement Status</h3>
            <p className="text-sm text-slate-500 font-medium mb-8">Overall distribution</p>
            <div className="h-[240px] relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={placementStatusData}
                    innerRadius={75}
                    outerRadius={100}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {placementStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-3xl font-bold text-slate-900">570</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total</span>
              </div>
            </div>
            <div className="mt-auto space-y-3">
              {placementStatusData.map((item) => (
                <div key={item.name} className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-sm font-semibold text-slate-600">{item.name}</span>
                  </div>
                  <span className="text-sm font-bold text-slate-900">{item.value}</span>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        {/* Bottom Section: Recent Drives & Student Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Recent Drives List */}
          <GlassCard className="overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
              <h3 className="font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-500" /> Recent Drives
              </h3>
              <button className="text-indigo-600 text-xs font-bold hover:text-indigo-700">View Schedule</button>
            </div>
            <div className="divide-y divide-slate-100">
              {recentDrives.map((drive) => (
                <div key={drive.id} className="p-5 hover:bg-indigo-50/40 transition-all flex items-center justify-between group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white border border-slate-200 rounded-xl flex items-center justify-center text-indigo-600 font-bold shadow-sm group-hover:border-indigo-200">
                      {drive.company[0]}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{drive.company}</h4>
                      <p className="text-xs text-slate-500">{drive.role} • {drive.date}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-slate-900">{drive.applied}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Applied</p>
                    </div>
                    <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded-full ${
                      drive.status === 'active' ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-100 text-slate-600'
                    }`}>
                      {drive.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Quick Actions / CTA */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="bg-indigo-600 rounded-[2rem] p-8 relative overflow-hidden flex flex-col justify-center shadow-xl shadow-indigo-200"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="relative z-10">
              <h3 className="text-2xl font-bold text-white mb-2">Automate Recruitment</h3>
              <p className="text-indigo-100 mb-8 max-w-md">
                Generate AI-driven eligibility reports and notify all students with one click.
              </p>
              <div className="flex flex-wrap gap-3">
                <button className="px-6 py-3 bg-white text-indigo-600 font-bold rounded-xl text-sm shadow-lg hover:bg-slate-50 transition-all">
                  Launch New Drive
                </button>
                <button className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-xl text-sm hover:bg-indigo-400 transition-all border border-indigo-400">
                  Export Summary
                </button>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;