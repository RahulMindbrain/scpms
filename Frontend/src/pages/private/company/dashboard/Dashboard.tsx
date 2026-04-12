import React from 'react';
import { Briefcase, Users, CheckCircle, Clock, ChevronRight } from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import useAuth from '@/redux/hooks/useAuth';

const Dashboard: React.FC = () => {
  const { fullName, companyData } = useAuth();

  const recentDrives = [
    { id: 1, title: "Software Engineer", deadline: "2026-04-20", applicants: 124, status: "Active" },
    { id: 2, title: "Data Analyst", deadline: "2026-04-25", applicants: 87, status: "Active" },
    { id: 3, title: "DevOps Engineer", deadline: "2026-04-10", applicants: 56, status: "Closed" },
    { id: 4, title: "UI/UX Designer", deadline: "2026-05-01", applicants: 43, status: "Upcoming" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">
          {companyData?.companyName ?? fullName} Dashboard
        </h1>
        <p className="text-slate-500 font-medium">
          Overview of your recruitment activities and performance.
        </p>
      </div>
      
      {/* Statistics Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard 
          label="Posted Drives" 
          value="8" 
          icon={Briefcase} 
          subtext="2 active" 
        />
        <StatCard 
          label="Total Applicants" 
          value="310" 
          icon={Users} 
          trend="+45 this week" 
          trendColor="text-emerald-500" 
        />
        <StatCard 
          label="Shortlisted" 
          value="48" 
          icon={CheckCircle} 
          subtext="15.5% rate" 
        />
        <StatCard 
          label="Pending Reviews" 
          value="67" 
          icon={Clock} 
          subtext="Needs action" 
        />
      </div>

      {/* Recent Drives Section */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Recent Placement Drives</h2>
          <button className="text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="p-2">
          {recentDrives.map((drive) => (
            <div 
              key={drive.id} 
              className="group flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all duration-200 border border-transparent hover:border-slate-100 mb-2 last:mb-0"
            >
              <div className="flex flex-col gap-1">
                <h3 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                  {drive.title}
                </h3>
                <p className="text-sm text-slate-500 font-medium">
                  Deadline: {drive.deadline}
                </p>
              </div>
              <div className="flex items-center gap-6">
                <span className="text-sm font-bold text-slate-400">
                  {drive.applicants} applicants
                </span>
                <Badge 
                  variant={
                    drive.status === 'Active' ? 'primary' : 
                    drive.status === 'Closed' ? 'secondary' : 
                    'outline'
                  }
                  className="w-20 justify-center"
                >
                  {drive.status}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

