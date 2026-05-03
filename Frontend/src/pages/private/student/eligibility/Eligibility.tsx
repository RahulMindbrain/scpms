import { 
  CheckCircle2, 
  XCircle,
  Info,
  TrendingUp,
  Search,
  User,
  ArrowUpRight,
  Sparkles,
  Building2,
  Trophy,
  Filter,
} from 'lucide-react';
import Loader from '@/components/Loader';
import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import { fetchJobApplications, fetchJobs, fetchStudentProfile } from '@/redux/thunks/studentThunk';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const Eligibility = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);
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

  const studentCgpa = Number(profile?.cgpa || 0);
  const studentBranch = String(profile?.department?.name || profile?.branch || 'N/A');
  const studentBacklogs = Number(profile?.activeBacklogs || 0);

  const appliedJobIds = useMemo(
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
            reason = `Min ${minCGPA} CGPA required`;
          } else if (!branchEligible) {
            reason = "Branch not eligible";
          } else if (!backlogEligible) {
            reason = `Max ${maxActiveBacklogs} backlogs allowed`;
          }
        }

        return {
          id: job.id,
          name: job?.company?.name || "Company",
          role: job?.title || "Role",
          minCGPA,
          branches: jobBranches,
          active,
          reason,
          applied: appliedJobIds.has(Number(job.id)),
        };
      }),
    [jobs, appliedJobIds, studentBacklogs, studentBranch, studentCgpa]
  );

  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          company.role.toLowerCase().includes(searchQuery.toLowerCase());
    if (activeFilter === 'eligible') return matchesSearch && company.active;
    if (activeFilter === 'applied') return matchesSearch && company.applied;
    return matchesSearch;
  });

  const stats = {
    total: companies.length,
    eligible: companies.filter((c) => c.active).length,
    applied: companies.filter((c) => c.applied).length,
    ineligible: companies.filter((c) => !c.active).length
  };

  if (loading && jobs.length === 0) {
    return <Loader text="Analyzing eligibility landscape..." fullScreen />;
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-[1600px] mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* ─── Hero Header ─── */}
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-8 md:p-12 text-white shadow-2xl border border-white/5">
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/25 rounded-full blur-[100px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-500/20 rounded-full blur-[100px] animate-pulse delay-1000"></div>
          </div>
          
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-transparent to-transparent"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] shadow-xl backdrop-blur-md">
                <Trophy className="h-4 w-4 text-yellow-400" /> 
                <span className="opacity-90">Eligibility Control Center</span>
              </div>
              <h1 className="mt-6 text-3xl md:text-5xl font-black text-white tracking-tight leading-tight">
                {user?.firstname ? `${user.firstname}'s Potential` : "Placement Eligibility"}
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed font-medium opacity-90">
                {stats.eligible > 0 
                  ? `You are eligible for ${stats.eligible} out of ${stats.total} live opportunities. Let's make them count!`
                  : "Track your academic standing and see which career paths are currently open for your profile."}
              </p>
            </div>
            
            <div className="hidden lg:block">
              <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
                <CheckCircle2 className="h-16 w-16 text-white/40" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* ─── Profile & Stats Sidebar ─── */}
          <div className="lg:col-span-4 space-y-6">
            {/* Academic Card */}
            {/* Academic Card */}
            <div className="bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-200/60 dark:border-white/[0.08] shadow-sm overflow-hidden relative group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 transition-all group-hover:bg-indigo-500/20" />
              
              <div className="relative z-10 space-y-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-500/10 rounded-xl shadow-inner">
                    <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h3 className="font-black text-slate-900 dark:text-white uppercase tracking-[0.2em] text-[10px]">Profile Status</h3>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner">
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-2">Verified Academic Score</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">{studentCgpa || 0}</span>
                      <span className="text-slate-500 font-bold text-sm">/ 10.0</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-6 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner">
                      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Branch</p>
                      <p className="font-black text-slate-900 dark:text-slate-200 truncate tracking-tight">{studentBranch}</p>
                    </div>
                    <div className="p-6 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner">
                      <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-1">Backlogs</p>
                      <p className={cn("font-black tracking-tight", studentBacklogs > 0 ? "text-rose-600" : "text-emerald-600")}>
                        {studentBacklogs} Active
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 flex items-start gap-3">
                  <Info className="w-4 h-4 text-indigo-500 mt-1 shrink-0" />
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed font-medium italic">
                    Criteria is matched against verified academic records.
                  </p>
                </div>
              </div>
            </div>

            {/* Quick Summary Stats */}
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: 'Eligible Opportunities', value: stats.eligible, color: 'text-emerald-500', bg: 'bg-emerald-500/10', icon: CheckCircle2 },
                { label: 'Active Applications', value: stats.applied, color: 'text-indigo-500', bg: 'bg-indigo-500/10', icon: TrendingUp },
                { label: 'Locked Status', value: stats.ineligible, color: 'text-slate-400', bg: 'bg-slate-500/10', icon: XCircle },
              ].map((stat) => (
                <div key={stat.label} className="bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl p-6 rounded-2xl border border-slate-200/60 dark:border-white/[0.08] flex items-center gap-6 transition-all duration-500 hover:shadow-2xl hover:translate-y-[-2px] group">
                  <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner transition-transform group-hover:scale-110 group-hover:rotate-3", stat.bg, stat.color)}>
                    <stat.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">{stat.value.toString().padStart(2, '0')}</p>
                    <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ─── Main Content Area ─── */}
          <div className="lg:col-span-8 space-y-6">
            {/* Filter & Search Bar */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-200/60 dark:border-white/[0.08] shadow-sm">
              <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.05]">
                {["all", "eligible", "applied"].map((filter) => (
                  <button
                    key={filter}
                    onClick={() => setActiveFilter(filter as any)}
                    className={cn(
                      "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                      activeFilter === filter
                        ? "bg-white dark:bg-[#1e1f26] text-indigo-600 dark:text-indigo-400 shadow-xl border border-slate-200/50 dark:border-white/10 scale-105"
                        : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                    )}
                  >
                    {filter}
                  </button>
                ))}
              </div>
              
              <div className="relative flex-1 max-w-sm group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <Input
                  placeholder="Filter by company or role..."
                  className="pl-12 h-12 bg-slate-100 dark:bg-white/5 border-none rounded-xl text-sm font-semibold focus-visible:ring-indigo-500/30 shadow-inner"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Opportunities List */}
            <div className="space-y-4">
              <AnimatePresence mode='popLayout'>
                {filteredCompanies.map((company, idx) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      key={company.id} 
                      className={cn(
                        "group relative bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl rounded-[2rem] p-8 border border-slate-200/60 dark:border-white/[0.08] transition-all duration-500 hover:shadow-2xl hover:translate-y-[-4px] overflow-hidden hover:border-indigo-500/30",
                        !company.active && "opacity-75 grayscale-[0.5]"
                      )}
                    >
                    <div className="flex flex-col sm:flex-row items-center gap-6">
                      <div className={cn(
                        "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-lg shrink-0 transition-transform group-hover:scale-110 duration-500",
                        company.active ? "bg-gradient-to-br from-indigo-500 to-blue-600" : "bg-slate-500/50 grayscale"
                      )}>
                        {company.name[0]}
                      </div>

                      <div className="flex-1 min-w-0 w-full text-center sm:text-left">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
                          <h4 className="text-lg font-black text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                            {company.name}
                          </h4>
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-slate-100 dark:bg-white/5 text-slate-500 border border-slate-200 dark:border-white/5 mx-auto sm:mx-0">
                            {company.role}
                          </span>
                          {company.applied && (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 mx-auto sm:mx-0">
                              Applied
                            </span>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-6 gap-y-2 text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                          <div className="flex items-center gap-1.5">
                            <TrendingUp size={14} className="text-indigo-500" />
                            <span>Min {company.minCGPA} CGPA</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Building2 size={14} className="text-purple-500" />
                            <span className="truncate max-w-[200px]">{company.branches.join(', ') || 'All Branches'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center sm:items-end gap-3 shrink-0">
                        {company.active ? (
                          <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/20 shadow-sm">
                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                            Eligible
                          </div>
                        ) : (
                          <div className="bg-slate-100 dark:bg-white/5 text-slate-400 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-white/10">
                            Ineligible
                          </div>
                        )}
                        
                        {company.active ? (
                          <Button
                            variant="ghost"
                            onClick={() => navigate('/student/jobs')}
                            className="flex items-center gap-2 text-xs font-black text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 hover:bg-transparent p-0 transition-transform hover:translate-x-1"
                          >
                            Apply Portal <ArrowUpRight className="w-4 h-4" />
                          </Button>
                        ) : (
                          <span className="text-[10px] text-rose-500 dark:text-rose-400/80 font-bold italic tracking-tight">{company.reason}</span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {filteredCompanies.length === 0 && (
                <div className="py-24 text-center bg-white dark:bg-[#1e1f26]/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                  <div className="w-20 h-20 bg-slate-100 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700 mx-auto mb-6">
                    <Search size={40} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">No criteria matches found</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-2 max-w-xs mx-auto">Try adjusting your filters or check your academic profile for any updates.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Pro Tip Banner */}
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-gradient-to-br from-indigo-600 to-blue-700 p-8 text-white shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-8">
            <div className="w-16 h-16 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shrink-0 shadow-xl border border-white/10">
              <Sparkles size={32} />
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h4 className="text-xl font-black uppercase tracking-widest mb-2">Maximize your Eligibility</h4>
              <p className="text-indigo-100/80 leading-relaxed font-medium">
                Keep your CGPA above 8.0 and clear any active backlogs to unlock premium tier-1 opportunities from companies like Google, Microsoft, and Amazon.
              </p>
            </div>
            <Button
              onClick={() => navigate('/student/profile')}
              className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl px-10 h-14 font-black shadow-xl transition-all hover:scale-105 active:scale-95 shrink-0"
            >
              Check Profile
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Eligibility;