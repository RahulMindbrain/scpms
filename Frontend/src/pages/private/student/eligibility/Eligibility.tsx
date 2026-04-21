import { 
  CheckCircle2, 
  XCircle,
  Info,
  TrendingUp,
  Search,
  User,
  ArrowUpRight,
  Globe,
  Loader2
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import { fetchJobApplications, fetchJobs, fetchStudentProfile } from '@/redux/thunks/studentThunk';
import { useNavigate } from 'react-router-dom';

const Eligibility = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { jobs = [], applications = [], profile, loading } = useSelector((state: RootState) => state.student);
  const [activeFilter, setActiveFilter] = useState<'all' | 'eligible' | 'applied'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    dispatch(fetchJobs({ status: 'APPROVED' }));
    dispatch(fetchJobApplications({}));
    if (!profile) {
      dispatch(fetchStudentProfile());
    }
  }, [dispatch, profile]);

  // Brand color map for company initials
  const companyColors: Record<string, { bg: string; text: string }> = {
    'Google': { bg: 'bg-blue-600', text: 'text-white' },
    'Microsoft': { bg: 'bg-emerald-600', text: 'text-white' },
    'Amazon': { bg: 'bg-orange-500', text: 'text-white' },
    'Goldman Sachs': { bg: 'bg-blue-900', text: 'text-white' },
    'Apple': { bg: 'bg-slate-800', text: 'text-white' },
  };

  const studentCgpa = Number(profile?.cgpa || 0);
  const studentBranch = String(profile?.department?.name || profile?.branch || 'N/A');
  const studentBacklogs = Number(profile?.activeBacklogs || 0);

  const normalizedApplications = useMemo(
    () => new Set(applications.map((app: any) => Number(app?.jobId || app?.job?.id)).filter(Boolean)),
    [applications]
  );

  const companies = useMemo(
    () =>
      jobs.map((job: any) => {
        const jobBranches =
          job?.departments?.map((d: any) => d?.name).filter(Boolean) ||
          job?.branches ||
          [];
        const minCGPA = Number(job?.minCgpa || 0);
        const maxActiveBacklogs = Number(job?.maxActiveBacklogs ?? Number.MAX_SAFE_INTEGER);
        const branchEligible =
          jobBranches.length === 0 ||
          jobBranches.some((b: string) => b.toLowerCase() === studentBranch.toLowerCase());
        const cgpaEligible = !minCGPA || studentCgpa >= minCGPA;
        const backlogEligible = studentBacklogs <= maxActiveBacklogs;
        const active = branchEligible && cgpaEligible && backlogEligible;

        let reason = "";
        if (!active) {
          if (!cgpaEligible) {
            reason = `CGPA required: ${minCGPA}`;
          } else if (!branchEligible) {
            reason = "Branch criteria not matched";
          } else if (!backlogEligible) {
            reason = `Backlogs allowed: ${maxActiveBacklogs}`;
          }
        }

        return {
          id: job.id,
          name: job?.company?.name || "Company",
          role: job?.title || "Role",
          minCGPA,
          branches: jobBranches,
          active,
          status: active ? "Eligible" : "Ineligible",
          reason,
          applied: normalizedApplications.has(Number(job.id)),
        };
      }),
    [jobs, normalizedApplications, studentBacklogs, studentBranch, studentCgpa]
  );

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          company.role.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'eligible') return matchesSearch && company.active;
    if (activeFilter === 'applied') return matchesSearch && company.applied;
    return matchesSearch;
  });

  const filterTabs = [
    { key: 'all' as const, label: 'All', count: companies.length },
    { key: 'eligible' as const, label: 'Eligible', count: companies.filter((c) => c.active).length },
    { key: 'applied' as const, label: 'Applied', count: companies.filter((c) => c.applied).length },
  ];

  const eligibilitySummary = [
    {
      label: 'Eligible Opportunities',
      value: String(filterTabs[1].count).padStart(2, "0"),
      icon: CheckCircle2,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50'
    },
    {
      label: 'Ineligible Roles',
      value: String(Math.max(0, companies.length - filterTabs[1].count)).padStart(2, "0"),
      icon: XCircle,
      color: 'text-slate-400',
      bg: 'bg-slate-50'
    },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 lg:p-10 font-sans text-slate-900">
      <div className="max-w-6xl mx-auto">

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar / Profile Info */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <h2 className="font-bold text-slate-800">Academic Profile</h2>
              </div>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase mb-2">Current Standing</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl font-black text-slate-900">{studentCgpa || 0}</span>
                    <span className="text-slate-400 font-medium text-sm">/ 10.0 CGPA</span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Branch</p>
                    <p className="font-bold text-slate-800">{studentBranch}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase mb-1">Backlogs</p>
                    <p className={`font-bold ${studentBacklogs > 0 ? "text-amber-600" : "text-emerald-600"}`}>
                      {studentBacklogs}
                    </p>
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

            {loading && companies.length === 0 && (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-2 text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading eligibility data...
              </div>
            )}

            {/* Quick Stats */}
            <div className="space-y-3">
              {eligibilitySummary.map((stat) => (
                <div key={stat.label} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
                  <div className={`${stat.bg} ${stat.color} p-3 rounded-xl`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
                    <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Content / Company List */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-slate-100">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <h3 className="font-bold text-slate-800 text-lg">Company Opportunities</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search company..." 
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 w-full sm:w-64 transition-all"
                    />
                  </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex items-center gap-2">
                  {filterTabs.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveFilter(tab.key)}
                      className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all ${
                        activeFilter === tab.key
                          ? 'bg-blue-50 border-blue-200 text-blue-700 shadow-sm'
                          : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300 hover:text-slate-700'
                      }`}
                    >
                      {tab.label}
                      <span className={`ml-1.5 text-[10px] ${activeFilter === tab.key ? 'text-blue-500' : 'text-slate-400'}`}>
                        {tab.count}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="divide-y divide-slate-100">
                {filteredCompanies.map((company, index) => {
                  const colors = companyColors[company.name] || { bg: 'bg-slate-600', text: 'text-white' };
                  return (
                    <div 
                      key={index} 
                      className={`p-6 transition-all group ${
                        !company.active 
                          ? 'opacity-50 bg-slate-50/50' 
                          : 'hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg shadow-sm ${colors.bg} ${colors.text}`}>
                            {company.name[0]}
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className={`font-bold ${company.active ? 'text-slate-900' : 'text-slate-500'}`}>{company.name}</h4>
                              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-500 tracking-tight">
                                {company.role}
                              </span>
                              {company.applied && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-600 tracking-tight">
                                  Applied
                                </span>
                              )}
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
                            <div className="bg-slate-100 text-slate-400 px-3 py-1 rounded-full text-[11px] font-bold border border-slate-200">
                              Not Eligible
                            </div>
                          )}
                          
                          {company.active ? (
                            <button
                              onClick={() => navigate('/student/jobs')}
                              className="flex items-center gap-1 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform"
                            >
                              Apply Now <ArrowUpRight className="w-3 h-3" />
                            </button>
                          ) : (
                            <span className="text-[10px] text-slate-400 italic">{company.reason}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredCompanies.length === 0 && (
                  <div className="p-12 text-center text-slate-400">
                    <Search className="w-8 h-8 mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No companies match your filter</p>
                  </div>
                )}
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eligibility;