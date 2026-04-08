import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Briefcase, 
  Bell, 
  XCircle,
  Info,
  TrendingUp,
  Search,
  Filter,
  User,
  ChevronRight,
  ArrowUpRight,
  Globe
} from 'lucide-react';

const Eligibility = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const eligibilitySummary = [
    { label: 'Eligible Opportunities', value: '04', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Ineligible Roles', value: '01', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const studentProfile = {
    cgpa: 8.7,
    branch: 'CSE',
    backlogs: 'None'
  };

  const companies = [
    { name: 'Google', role: 'SDE Intern', minCGPA: 8.0, branches: ['CSE', 'IT'], status: 'Eligible', active: true },
    { name: 'Microsoft', role: 'Full Stack Dev', minCGPA: 7.5, branches: ['CSE', 'IT', 'ECE'], status: 'Eligible', active: true },
    { name: 'Amazon', role: 'Data Analyst', minCGPA: 8.5, branches: ['CSE'], status: 'Eligible', active: true },
    { name: 'Goldman Sachs', role: 'Quant Analyst', minCGPA: 9.0, branches: ['CSE', 'Math'], status: 'Ineligible', active: false, reason: 'CGPA threshold: 9.0' },
    { name: 'Apple', role: 'iOS Developer', minCGPA: 8.0, branches: ['CSE'], status: 'Eligible', active: true },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">
        
        {/* Top Navigation / Header */}
        <header className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">Placement Portal</h1>
            <p className="text-slate-500 text-sm font-medium">Academic Year 2024-25</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2.5 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition-all shadow-sm">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-px bg-slate-200 mx-1"></div>
            <div className="flex items-center gap-3 bg-white p-1 pr-4 border border-slate-200 rounded-full shadow-sm">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold">PS</div>
              <span className="text-sm font-semibold text-slate-700">Anjali Sharma</span>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Profile Info */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="font-bold text-slate-800">Academic Profile</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Current Standing</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{studentProfile.cgpa}</span>
                    <span className="text-slate-400 font-medium text-sm">/ 10.0 CGPA</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Branch</p>
                    <p className="font-bold text-slate-800">{studentProfile.branch}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Backlogs</p>
                    <p className="font-bold text-emerald-600">{studentProfile.backlogs}</p>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-slate-100">
                <div className="flex items-start gap-3 p-3 bg-blue-50/50 rounded-2xl border border-blue-100">
                  <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                  <p className="text-xs text-blue-700 leading-relaxed">
                    Eligibility is calculated automatically based on your latest verified university records.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="space-y-3">
              {eligibilitySummary.map((stat) => (
                <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content / Company List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h3 className="font-bold text-slate-800 text-lg">Company Opportunities</h3>
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search company..." 
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full sm:w-64 transition-all"
                    />
                  </div>
                  <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
                    <Filter className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {companies.map((company, index) => (
                  <div key={index} className="p-6 hover:bg-slate-50/50 transition-colors group">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm border ${
                          company.active ? 'bg-white text-slate-800 border-slate-100' : 'bg-slate-50 text-slate-400 border-transparent'
                        }`}>
                          {company.name[0]}
                        </div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`font-bold ${company.active ? 'text-slate-900' : 'text-slate-500'}`}>{company.name}</h4>
                            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 uppercase tracking-tight">
                              {company.role}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs font-medium text-slate-500">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3 h-3" /> Min {company.minCGPA}
                            </span>
                            <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                            <span className="flex items-center gap-1">
                              <Globe className="w-3 h-3" /> {company.branches.join(', ')}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-3">
                        {company.active ? (
                          <div className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-[11px] font-bold border border-emerald-100">
                            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
                            Eligible
                          </div>
                        ) : (
                          <div className="bg-rose-50 text-rose-600 px-3 py-1 rounded-full text-[11px] font-bold border border-rose-100">
                            Not Eligible
                          </div>
                        )}
                        
                        {company.active ? (
                          <button className="flex items-center gap-1 text-xs font-bold text-indigo-600 group-hover:translate-x-1 transition-transform">
                            Apply Now <ArrowUpRight className="w-3 h-3" />
                          </button>
                        ) : (
                          <span className="text-[10px] text-slate-400 italic">{company.reason}</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 bg-slate-50 text-center border-t border-slate-100">
                <button className="text-sm font-semibold text-slate-500 hover:text-indigo-600 transition-colors inline-flex items-center gap-1">
                  View All Companies <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eligibility;