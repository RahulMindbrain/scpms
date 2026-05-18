import {
  Search,
  MapPin,
  Clock,
  ChevronRight,
  IndianRupee,
  Calendar,
  Building2,
  ChevronLeft,
  Zap,
  Sparkles,
  Brain,
  CheckCircle2,
  Upload,
  ArrowRight,
  X,
  Loader2,
  FileText
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, applyJob, fetchStudentProfile, fetchJobApplications } from '@/redux/thunks/studentThunk';
import { fetchCompanies } from '@/redux/thunks/companyThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import { Modal } from '@/components/ui/modal';
import Loader from '@/components/Loader';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from '@/lib/utils';
import { StudentPageLayout } from '@/components/layout/StudentPageLayout';

interface JobUniversity {
  id: number;
  salary: number;
  description?: string;
  minCgpa?: number;
  maxBacklogs?: number;
  openings?: number;
  deadline?: string;
  postedAt?: string;
  sentAt: string;
  status: string;
  job: {
    id: number;
    title: string;
    location: string;
    companyId?: number;
    company?: {
      id: number;
      name: string;
    };
    skills?: { id: number; name: string }[];
    eligibleDepartments?: { id: number; name: string }[];
  };
  university?: {
    id: number;
    name: string;
  };
}

const getCompanyInitials = (name?: string) => {
  if (!name) return 'CO';
  const cleanName = name.trim();
  const parts = cleanName.split(/\s+/);
  if (parts.length > 1) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return cleanName.slice(0, 2).toUpperCase();
};

const formatDate = (dateString?: string) => {
  if (!dateString) return 'No Deadline';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return 'No Deadline';
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch (e) {
    return 'No Deadline';
  }
};

const getPostedAgo = (dateString?: string) => {
  if (!dateString) return 'Posted recently';
  try {
    const postedDate = new Date(dateString);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - postedDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Posted today';
    if (diffDays === 1) return 'Posted 1 day ago';
    return `Posted ${diffDays} days ago`;
  } catch (e) {
    return 'Posted recently';
  }
};

const JobListing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, profile, applications = [], loading } = useSelector((state: RootState) => state.student);
  const { companies: reduxCompanies = [] } = useSelector((state: RootState) => state.company);
  const { user } = useSelector((state: RootState) => state.auth);
  const isApproved = user?.status === 'ACTIVE';

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'applied' | 'eligible'>('all');
  const [selectedJob, setSelectedJob] = useState<JobUniversity | null>(null);
  
  // Custom states for separate modals
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);
  
  // ATS multi-state application flow
  const [applyStep, setApplyStep] = useState<'resume' | 'loading' | 'report'>('resume');
  const [selectedResumeOption, setSelectedResumeOption] = useState<'latest' | 'fresh'>('latest');
  const [loadingStage, setLoadingStage] = useState(0);
  const [loadingProgress, setLoadingProgress] = useState(0);
  
  const [isApplying, setIsApplying] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchJobs({ status: 'APPROVED' }));
    dispatch(fetchJobApplications({}));
    dispatch(fetchCompanies({ limit: 100 }));
    if (!profile) {
      dispatch(fetchStudentProfile());
    }
  }, [dispatch, profile]);

  const appliedJobIds = useMemo(() => new Set(
    applications.map((app: any) => Number(app?.jobUniversityId || app?.jobUniversity?.id)).filter(Boolean)
  ), [applications]);

  const formatSalary = (salary: number) => {
    if (!salary) return 'Not disclosed';
    return (salary / 100000).toFixed(1) + ' LPA';
  };

  const getLogoInitials = (name: string) => {
    if (!name) return 'Go';
    if (name.toLowerCase() === 'google') return 'Go';
    
    const clean = name.replace(/[^a-zA-Z\s]/g, '').trim();
    if (!clean) return 'Go';
    
    const words = clean.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    if (clean.length >= 2) {
      return clean[0].toUpperCase() + clean[1].toLowerCase();
    }
    return clean[0].toUpperCase();
  };

  const getCompanyGradient = (companyName: string) => {
    const name = companyName || 'Google';
    const charCode = name.charCodeAt(0) + (name.charCodeAt(1) || 0);
    const gradients = [
      "from-blue-600 via-indigo-600 to-violet-600",
      "from-emerald-500 via-teal-600 to-cyan-600",
      "from-amber-500 via-orange-600 to-rose-600",
      "from-fuchsia-500 via-purple-600 to-indigo-600",
      "from-rose-500 via-pink-600 to-purple-600"
    ];
    return gradients[charCode % gradients.length];
  };

  const getRelativeTime = (dateStr: string) => {
    if (!dateStr) return 'Posted 2 days ago';
    const posted = new Date(dateStr);
    const now = new Date();
    
    const postedDate = new Date(posted.getFullYear(), posted.getMonth(), posted.getDate());
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const diffTime = nowDate.getTime() - postedDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 0) return 'Posted today';
    if (diffDays === 1) return 'Posted 1 day ago';
    return `Posted ${diffDays} days ago`;
  };

  const checkEligibility = (job: JobUniversity | null) => {
    if (!job || !profile) return { eligible: true, reasons: [] };
    
    const reasons: string[] = [];
    const studentCgpa = profile.cgpa ?? 0;
    const studentBacklogs = profile.activeBacklogs ?? 0;
    const studentDeptId = profile.department?.id || profile.departmentId;

    if (job.minCgpa && studentCgpa < job.minCgpa) {
      reasons.push(`Minimum CGPA required: ${job.minCgpa} (Your CGPA: ${studentCgpa})`);
    }
    if (job.maxBacklogs !== undefined && studentBacklogs > job.maxBacklogs) {
      reasons.push(`Maximum backlogs allowed: ${job.maxBacklogs} (Your backlogs: ${studentBacklogs})`);
    }
    
    const eligibleDeptIds = job.job.eligibleDepartments?.map((d: any) => d.id) || [];
    if (eligibleDeptIds.length > 0 && !eligibleDeptIds.includes(studentDeptId)) {
      reasons.push(`Your department is not eligible for this role`);
    }
    
    return {
      eligible: reasons.length === 0,
      reasons
    };
  };

  const filteredJobs = useMemo(() => {
    return (jobs || []).filter((job: any) => {
      if (!job?.job) return false;
      
      const matchesSearch =
        job.job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.university?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      const eligibility = checkEligibility(job);
      
      if (activeTab === 'applied') return appliedJobIds.has(Number(job.id));
      if (activeTab === 'eligible') return eligibility.eligible && !appliedJobIds.has(Number(job.id));
      
      return true;
    });
  }, [jobs, searchQuery, activeTab, appliedJobIds, profile]);

  // Paginated data
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

  // Simulate loading stages for the custom ATS resume scanner
  useEffect(() => {
    let interval: any;
    let timer1: any;
    let timer2: any;
    let timer3: any;
    let timer4: any;
    let timer5: any;
    
    if (applyStep === 'loading') {
      setLoadingStage(0);
      setLoadingProgress(0);
      
      // Step 1 finishes at 900ms
      timer1 = setTimeout(() => setLoadingStage(1), 900);
      
      // Step 2 finishes at 1800ms
      timer2 = setTimeout(() => setLoadingStage(2), 1800);
      
      // Step 3 finishes at 2700ms
      timer3 = setTimeout(() => setLoadingStage(3), 2700);
      
      // Active loading progress bar for step 4 starts at 2700ms
      timer4 = setTimeout(() => {
        interval = setInterval(() => {
          setLoadingProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval);
              return 100;
            }
            return prev + 5;
          });
        }, 80);
      }, 2750);
      
      // Auto-transition to report after progress completes
      timer5 = setTimeout(() => {
        setApplyStep('report');
      }, 4600);
    }

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
      clearTimeout(timer5);
      if (interval) clearInterval(interval);
    };
  }, [applyStep]);

  const handleApply = async () => {
    if (!selectedJob) return;

    setIsApplying(true);
    setIsModalOpen(false);
    const toastId = toast.loading(`Submitting application for ${selectedJob.job.title}...`);
    
    dispatch(applyJob(selectedJob.id))
      .unwrap()
      .then(() => {
        toast.success("Application submitted successfully!", { id: toastId });
        dispatch(fetchJobApplications({}));
      })
      .catch((error: any) => {
        toast.error(error || "Failed to submit application.", { id: toastId });
      })
      .finally(() => {
        setIsApplying(false);
      });
  };

  const selectedCompanyId = selectedJob?.job?.companyId ?? (selectedJob as any)?.companyId;
  const selectedFoundCompany = reduxCompanies.find((c: any) => c.id === selectedCompanyId);
  const selectedCompanyName = selectedJob?.job?.company?.name ?? selectedFoundCompany?.name ?? 'Hiring Partner';

  if (loading && (jobs?.length || 0) === 0) {
    return <Loader text="Syncing career opportunities..." fullScreen />;
  }

  return (
    <StudentPageLayout>
      <div className="space-y-6 student-hero-animate fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Adaptive Hero Banner */}
        <div className="student-hero-banner group">
          <div className="student-hero-mesh">
            <div className="bubble-blue"></div>
            <div className="bubble-sky"></div>
          </div>

          <div className="student-hero-texture"></div>
          <div className="student-hero-overlay"></div>
          
          <div className="relative z-10 w-full">
            <div className="student-hero-badge">
              <span>Career Opportunities</span>
            </div>
            <h1 className="student-hero-title">
              Find Your <span>Dream Career</span>
            </h1>
            <p className="student-hero-description">
              Explore the latest job openings, internships, and placement opportunities from top-tier companies.
            </p>
          </div>
        </div>

        {/* ─── Compact Controls Bar ─── */}
        {(jobs?.length || 0) > 0 && (
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white/70 dark:bg-[#161b22]/30 backdrop-blur-xl p-4 rounded-2xl border border-slate-200/50 dark:border-white/[0.06] shadow-sm">
            <div className="flex items-center gap-1 bg-slate-100/80 dark:bg-[#0f172a]/60 p-1 rounded-xl border border-slate-200/10 dark:border-white/[0.02] overflow-x-auto no-scrollbar w-full md:w-auto">
              {[
                { id: 'all', label: 'All Jobs' },
                { id: 'eligible', label: 'Recommended' },
                { id: 'applied', label: 'Applied' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 py-2 rounded-lg text-xs font-semibold tracking-wide transition-all duration-300 whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-white dark:bg-[#1e1f26] text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200/40 dark:border-white/[0.05]"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-80 group">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-4 h-4"
                />
                <Input
                  placeholder="Search role or company..."
                  className="pl-10 h-10 bg-slate-50 dark:bg-[#0f172a]/60 border border-slate-200/60 dark:border-slate-800 rounded-xl text-xs md:text-sm font-semibold focus-visible:ring-indigo-500/20 shadow-sm transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* ─── Jobs Grid - Compact & Beautiful Card Design ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {paginatedJobs.map((job: JobUniversity, idx) => {
              const isApplied = appliedJobIds.has(Number(job.id));
              const eligibility = checkEligibility(job);
              
              const companyId = job.job?.companyId ?? (job as any).companyId;
              const foundCompany = reduxCompanies.find((c: any) => c.id === companyId);
              const companyName = job.job?.company?.name ?? foundCompany?.name ?? 'Hiring Partner';
              
              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.05 }}
                  whileHover={{ y: -4 }}
                  className="group"
                >
                  <Card className="h-full border border-slate-100 dark:border-white/[0.06] bg-white dark:bg-[#161b22]/30 rounded-[1.25rem] shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 hover:border-indigo-500/20">
                    <CardContent className="p-6 flex flex-col h-full justify-between gap-5">
                      
                      {/* Top Row: Logo, Title, Badge */}
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-4">
                          {/* Gradient Rounded Square Icon */}
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-600 to-emerald-500 flex items-center justify-center font-bold text-lg text-white shadow-md shadow-indigo-500/10 shrink-0">
                            {getCompanyInitials(companyName)}
                          </div>
                          
                          {/* Title & Company */}
                          <div className="pt-0.5">
                            <h3 className="text-[17px] font-bold text-slate-800 dark:text-white leading-snug tracking-tight hover:text-indigo-600 transition-colors line-clamp-1">
                              {job.job?.title}
                            </h3>
                            <div className="flex flex-col gap-0.5 mt-1">
                              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5 truncate">
                                <Building2 size={14} className="text-slate-400 shrink-0" />
                                {companyName}
                              </p>
                              {job.university?.name && (
                                <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1 truncate">
                                  <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700"></span>
                                  {job.university.name} Drive
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Top-Right Pill Badge */}
                        <div>
                          {isApplied ? (
                            <span className="bg-indigo-600 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                              Applied
                            </span>
                          ) : eligibility.eligible ? (
                            <span className="bg-indigo-600 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                              Eligible
                            </span>
                          ) : (
                            <span className="bg-rose-500 text-white text-[11px] font-bold px-3.5 py-1.5 rounded-full shadow-sm whitespace-nowrap">
                              Ineligible
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Middle row: MapPin, Rupee, Clock */}
                      <div className="flex items-center gap-x-5 gap-y-2 flex-wrap text-slate-500 dark:text-slate-400 text-[13px] font-medium pt-1">
                        <div className="flex items-center gap-1.5">
                          <MapPin size={15} className="text-slate-400 shrink-0" />
                          <span>{job.job?.location}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-slate-400 font-semibold shrink-0">₹</span>
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock size={15} className="text-slate-400 shrink-0" />
                          <span>{formatDate(job.deadline)}</span>
                        </div>
                      </div>

                      {/* Skills tags preview (discreet & premium) */}
                      {job.job?.skills && job.job.skills.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 pt-0.5">
                          {job.job.skills.slice(0, 3).map((skill) => (
                            <span key={skill.id} className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-white/5 px-2.5 py-1 rounded-lg">
                              {skill.name}
                            </span>
                          ))}
                          {job.job.skills.length > 3 && (
                            <span className="text-[10px] font-bold text-slate-400 px-1 py-0.5">
                              +{job.job.skills.length - 3} more
                            </span>
                          )}
                        </div>
                      )}

                      {/* Bottom Row: Posted Ago & Buttons */}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100 dark:border-slate-800/50">
                        <div className="text-xs text-slate-400 dark:text-slate-500 font-medium">
                          {getPostedAgo(job.postedAt || job.sentAt || (job as any).createdAt)}
                        </div>
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setSelectedJob(job);
                              setIsModalOpen(true);
                            }}
                            className="bg-white dark:bg-[#161b22]/30 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 px-4 h-10 rounded-xl font-bold text-xs md:text-sm shadow-sm transition-all duration-200"
                          >
                            Details
                          </Button>
                          <Button
                            onClick={() => {
                              setSelectedJob(job);
                              setIsModalOpen(true);
                            }}
                            className={cn(
                              "px-4 h-10 rounded-xl font-bold text-xs md:text-sm flex items-center gap-2 shadow-md transition-all duration-200 text-white",
                              isApplied
                                ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/10 hover:shadow-emerald-500/20"
                                : "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/10 hover:shadow-indigo-500/20"
                            )}
                          >
                            {isApplied ? (
                              <>
                                <CheckCircle2 size={15} className="shrink-0" />
                                Applied
                              </>
                            ) : (
                              <>
                                <Zap size={14} className="fill-white shrink-0" />
                                Apply Now
                              </>
                            )}
                          </Button>
                        </div>
                      </div>

                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* ─── Pagination ─── */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-6 pb-12">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="rounded-xl border border-slate-200 dark:border-white/10 w-9 h-9 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={16} />
            </Button>
            
            <div className="flex items-center gap-1">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={cn(
                    "w-9 h-9 rounded-xl text-xs font-semibold transition-all shadow-sm",
                    currentPage === idx + 1
                    ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "bg-white dark:bg-[#1e1f26] text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-white/10 hover:border-indigo-500/50"
                  )}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              className="rounded-xl border border-slate-200 dark:border-white/10 w-9 h-9 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredJobs.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 text-center px-4">
            <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-2xl flex items-center justify-center mb-5 border border-slate-200 dark:border-white/5 text-slate-300 dark:text-slate-700">
              <Search size={32} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">No matching opportunities</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 font-medium">Try broadening your search or switching tabs.</p>
          </div>
        )}

        {/* ─── Premium Details Modal (Original details overlay but styled nicely) ─── */}
        <Modal
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
          title={selectedJob?.job.title}
          subtitle={`${selectedCompanyName} • ${selectedJob?.job?.location || 'Remote'}`}
          maxWidth="sm:max-w-lg"
        >
          <div className="space-y-5 py-1">
            
            {/* Quick Specs Grid */}
            <div className="grid grid-cols-3 gap-2.5">
              <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-white/[0.04] flex flex-col items-center justify-center text-center">
                <Calendar className="w-4 h-4 text-indigo-500 mb-1" />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Deadline</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{formatDate(selectedJob?.deadline)}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-white/[0.04] flex flex-col items-center justify-center text-center">
                <IndianRupee className="w-4 h-4 text-emerald-500 mb-1" />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Expected CTC</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedJob?.salary ? formatSalary(selectedJob.salary) : 'Competitive'}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-900/30 rounded-xl border border-slate-100 dark:border-white/[0.04] flex flex-col items-center justify-center text-center">
                <Building2 className="w-4 h-4 text-indigo-500 mb-1" />
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Openings</span>
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-0.5">{selectedJob?.openings ? `${selectedJob.openings} Seats` : 'Multiple'}</span>
              </div>
            </div>

            {/* Eligibility Report Section */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between border-b border-slate-100 dark:border-white/[0.04] pb-2">
                <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Eligibility Status</h4>
                {selectedJob && (
                  <span className={cn(
                    "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-none border",
                    checkEligibility(selectedJob).eligible 
                      ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" 
                      : "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20"
                  )}>
                    {checkEligibility(selectedJob).eligible ? (
                      <>
                        <CheckCircle2 size={10} className="text-emerald-500" />
                        Eligible to Apply
                      </>
                    ) : (
                      <>
                        <XCircle size={10} className="text-rose-500" />
                        Ineligible
                      </>
                    )}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl border border-slate-100 dark:border-white/[0.03] flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Academic CGPA</span>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {profile?.cgpa ?? '0.0'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Req: {selectedJob?.minCgpa || '0.0'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        (profile?.cgpa || 0) >= (selectedJob?.minCgpa || 0) ? "bg-emerald-500" : "bg-rose-500"
                      )}
                      style={{ width: `${Math.min(100, ((profile?.cgpa || 0) / 10) * 100)}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50/50 dark:bg-slate-900/10 rounded-xl border border-slate-100 dark:border-white/[0.03] flex flex-col justify-between">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider">Active Backlogs</span>
                  <div className="flex items-baseline justify-between mt-1.5">
                    <span className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {profile?.activeBacklogs ?? '0'}
                    </span>
                    <span className="text-[10px] font-semibold text-slate-400">
                      Max: {selectedJob?.maxBacklogs ?? 'None'}
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-800 h-1 rounded-full mt-2 overflow-hidden">
                    <div 
                      className={cn(
                        "h-full rounded-full transition-all duration-300",
                        (profile?.activeBacklogs ?? 0) <= (selectedJob?.maxBacklogs ?? 99) ? "bg-emerald-500" : "bg-rose-500"
                      )}
                      style={{ width: `${(profile?.activeBacklogs ?? 0) === 0 ? 100 : Math.max(0, 100 - ((profile?.activeBacklogs ?? 0) * 20))}%` }}
                    />
                  </div>
                </div>
              </div>

              {selectedJob && !checkEligibility(selectedJob).eligible && (
                <div className="p-3 bg-rose-50/60 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-xl">
                  <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                    <AlertTriangle size={11} className="text-rose-500" /> Ineligibility Reasons
                  </p>
                  <ul className="space-y-1">
                    {checkEligibility(selectedJob).reasons.map((reason, i) => (
                      <li key={i} className="text-xs text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                        {reason}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Required Skills */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Required Skills</h4>
              <div className="flex flex-wrap gap-1.5">
                {selectedJob?.job?.skills?.map((skill) => (
                  <Badge key={skill.id} variant="secondary" className="bg-slate-100/80 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-none px-2.5 py-1 text-xs font-semibold rounded-lg shadow-none">
                    {skill.name}
                  </Badge>
                ))}
                {(!selectedJob?.job?.skills || selectedJob.job.skills.length === 0) && (
                  <span className="text-xs text-slate-400 italic">No specific skills listed</span>
                )}
              </div>
            </div>

            {/* Job Description */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Job Description</h4>
              <div className="bg-slate-50/50 dark:bg-slate-900/10 p-4 rounded-xl border border-slate-100 dark:border-white/5 max-h-36 overflow-y-auto custom-scrollbar">
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs md:text-sm whitespace-pre-wrap font-medium">
                  {selectedJob?.description}
                </p>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-2">
              <Button
                className={cn(
                  "w-full h-11 md:h-12 text-xs md:text-sm font-semibold tracking-wider uppercase rounded-xl transition-all duration-300 border shadow-md",
                  appliedJobIds.has(Number(selectedJob?.id))
                    ? "bg-emerald-500/10 dark:bg-emerald-500/20 border-emerald-500/20 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 cursor-not-allowed shadow-none"
                    : !isApproved 
                    ? "bg-amber-500/10 text-amber-600 border-amber-500/20 cursor-not-allowed shadow-none"
                    : !checkEligibility(selectedJob).eligible
                    ? "bg-rose-500/10 text-rose-500 border-rose-500/20 cursor-not-allowed shadow-none"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white border-transparent shadow-indigo-500/20 hover:shadow-indigo-500/30 hover:scale-[1.01] active:scale-[0.99]"
                )}
                onClick={handleApply}
                disabled={isApplying || !selectedJob || appliedJobIds.has(Number(selectedJob.id)) || !checkEligibility(selectedJob).eligible || !isApproved}
              >
                {isApplying ? (
                  <Loader size="sm" />
                ) : (selectedJob && appliedJobIds.has(Number(selectedJob.id))) ? (
                  <span className="flex items-center justify-center gap-1.5 text-emerald-600 dark:text-emerald-400">
                    <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                    Already Applied
                  </span>
                ) : !isApproved ? (
                  'Account Pending Approval'
                ) : (selectedJob && !checkEligibility(selectedJob).eligible) ? (
                  'Not Eligible to Apply'
                ) : (
                  'Confirm Application'
                )}
              </Button>
            </div>
          </div>
        </Modal>

        {/* ─── Customizable Multi-stage Apply & ATS Modal ─── */}
        <Modal
          isOpen={isApplyModalOpen}
          onClose={() => {
            // Prevent close only during loading
            if (applyStep !== 'loading') {
              setIsApplyModalOpen(false);
            }
          }}
          maxWidth={applyStep === 'report' ? "sm:max-w-2xl" : "sm:max-w-lg"}
          preventOutsideClick={applyStep === 'loading'}
        >
          <div className="relative py-2 px-1">
            {/* Custom Close Button for premium feel */}
            {applyStep !== 'loading' && (
              <button
                onClick={() => setIsApplyModalOpen(false)}
                className="absolute -right-2 -top-2 w-8 h-8 rounded-full bg-slate-50 dark:bg-white/5 border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-400 hover:text-slate-900 dark:hover:text-white transition-all duration-200 z-50 hover:rotate-90"
              >
                <X size={14} />
              </button>
            )}

            {/* ─── State 2: Resume Selection Modal (Overlay) ─── */}
            {applyStep === 'resume' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em]">
                    Application Portal
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                    {selectedJob?.job.title ? selectedJob.job.title.toUpperCase() : "SDE INTERN"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1.5">
                    <Building2 size={13} className="text-slate-400 shrink-0" />
                    {selectedJob?.job?.company?.name || "Google"}
                    <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                    <MapPin size={13} className="text-slate-400 shrink-0" />
                    {selectedJob?.job?.location || "Mountain View, CA"}
                  </p>
                </div>

                {/* Grid selectable cards */}
                <div className="grid grid-cols-2 gap-4">
                  {/* Card A: Compare with Latest Resume */}
                  <div
                    onClick={() => setSelectedResumeOption('latest')}
                    className={cn(
                      "p-5 rounded-[1.75rem] border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center justify-between gap-4 h-full",
                      selectedResumeOption === 'latest'
                        ? "border-blue-600 bg-blue-500/[0.03] dark:bg-blue-500/[0.02] shadow-lg shadow-blue-500/5 scale-[1.02]"
                        : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:scale-[1.01]"
                    )}
                  >
                    <div className="flex items-center justify-between w-full">
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all shrink-0",
                        selectedResumeOption === 'latest'
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 dark:border-white/20"
                      )}>
                        {selectedResumeOption === 'latest' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                      <Badge className="bg-blue-500/10 text-blue-500 border-none text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                        Latest
                      </Badge>
                    </div>
                    
                    <div className="flex flex-col items-center gap-2 flex-1 justify-center py-2">
                      <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                        <FileText size={22} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider leading-tight">
                          Compare with Latest Resume
                        </h5>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate max-w-[130px]">
                          Resume_v4.pdf
                        </p>
                      </div>
                    </div>
                    
                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
                      Updated 3 days ago
                    </span>
                  </div>

                  {/* Card B: Upload Fresh Resume */}
                  <div
                    onClick={() => setSelectedResumeOption('fresh')}
                    className={cn(
                      "p-5 rounded-[1.75rem] border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center text-center justify-between gap-4 h-full",
                      selectedResumeOption === 'fresh'
                        ? "border-blue-600 bg-blue-500/[0.03] dark:bg-blue-500/[0.02] shadow-lg shadow-blue-500/5 scale-[1.02]"
                        : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:scale-[1.01]"
                    )}
                  >
                    <div className="flex items-center justify-start w-full">
                      <div className={cn(
                        "w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all shrink-0",
                        selectedResumeOption === 'fresh'
                          ? "border-blue-600 bg-blue-600 text-white"
                          : "border-slate-300 dark:border-white/20"
                      )}>
                        {selectedResumeOption === 'fresh' && (
                          <div className="w-1.5 h-1.5 rounded-full bg-white" />
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 flex-1 justify-center py-2">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400">
                        <Upload size={20} />
                      </div>
                      <div className="space-y-1">
                        <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider leading-tight">
                          Upload Fresh Resume
                        </h5>
                        <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium max-w-[120px] mx-auto leading-tight">
                          Drag & drop or select PDF/DOCX
                        </p>
                      </div>
                    </div>

                    <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
                      Upload Icon
                    </span>
                  </div>
                </div>

                {/* Bottom link and buttons */}
                <div className="flex flex-col gap-5 pt-3">
                  <div className="text-center">
                    <button
                      onClick={() => {
                        toast.success("Redirecting to premium Resume Maker...", {
                          icon: <Sparkles size={16} className="text-blue-500 animate-pulse" />
                        });
                      }}
                      className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1.5 group"
                    >
                      <Sparkles size={12} className="text-blue-500 group-hover:scale-110 transition-transform fill-blue-500/10" />
                      Or create tailored resume with Resume Maker
                      <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  </div>

                  <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/[0.04] pt-4">
                    <button
                      onClick={() => setIsApplyModalOpen(false)}
                      className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2"
                    >
                      Cancel
                    </button>
                    <Button
                      onClick={() => setApplyStep('loading')}
                      className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl px-6 h-11 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-slate-900/10 transition-all border-none"
                    >
                      <Zap size={11} className="fill-current" />
                      Analyze Now
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* ─── State 3: Loading/Analysis Modal State ─── */}
            {applyStep === 'loading' && (
              <div className="space-y-8 py-4 flex flex-col items-center">
                {/* Pulse brain animation in circularprogress track */}
                <div className="relative w-28 h-28 flex items-center justify-center">
                  {/* Spinning outer progress track */}
                  <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-white/5" />
                  <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin" />
                  
                  {/* Glowing backdrop */}
                  <motion.div 
                    className="absolute w-16 h-16 rounded-full bg-blue-500/10 filter blur-md"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                  />
                  
                  {/* Centered brain/AI icon */}
                  <motion.div
                    animate={{ 
                      scale: [1, 1.12, 1],
                      filter: [
                        "drop-shadow(0 0 4px rgba(37, 99, 235, 0.2))",
                        "drop-shadow(0 0 16px rgba(37, 99, 235, 0.6))",
                        "drop-shadow(0 0 4px rgba(37, 99, 235, 0.2))"
                      ]
                    }}
                    transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                    className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl"
                  >
                    <Brain size={30} className="stroke-[1.5]" />
                  </motion.div>
                </div>

                <div className="text-center space-y-1">
                  <h4 className="text-sm md:text-base font-black text-slate-800 dark:text-white uppercase tracking-wider leading-snug max-w-xs mx-auto">
                    AI is analyzing your resume...
                  </h4>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                    This will only take a moment...
                  </p>
                </div>

                {/* Checklist showing dynamic progress tracking */}
                <div className="space-y-4 w-full max-w-xs mt-2 border-t border-slate-100 dark:border-white/[0.04] pt-6">
                  {checklistItems.map((text, idx) => {
                    const isCompleted = loadingStage > idx;
                    const isActive = loadingStage === idx;
                    
                    return (
                      <div key={idx} className="flex flex-col gap-2">
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/10">
                              <CheckCircle2 size={14} className="stroke-[2.5]" />
                            </div>
                          ) : isActive ? (
                            <div className="w-5.5 h-5.5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/10 animate-spin">
                              <Loader2 size={13} className="stroke-[2.5]" />
                            </div>
                          ) : (
                            <div className="w-5.5 h-5.5 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200 dark:border-white/10">
                              <span className="text-[9px] font-black">{idx + 1}</span>
                            </div>
                          )}
                          <span className={cn(
                            "text-xs font-semibold transition-all duration-300",
                            isCompleted && "text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-800",
                            isActive && "text-blue-600 dark:text-blue-400 font-extrabold tracking-wide",
                            !isCompleted && !isActive && "text-slate-400 dark:text-slate-650"
                          )}>
                            {text}
                          </span>
                        </div>
                        
                        {/* Dynamic progress bar below the 4th checklist item when active */}
                        {isActive && idx === 3 && (
                          <div className="pl-8.5 w-full space-y-1.5">
                            <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-100 ease-out" 
                                style={{ width: `${loadingProgress}%` }}
                              />
                            </div>
                            <div className="flex justify-between items-center text-[8px] font-black tracking-widest text-blue-500">
                              <span>CALCULATING ATS...</span>
                              <span>{loadingProgress}%</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ─── State 4: ATS Report & Suggestions Modal State ─── */}
            {applyStep === 'report' && (
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em]">
                    ATS Analysis Report
                  </span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                    {selectedJob?.job.title ? selectedJob.job.title.toUpperCase() : "SDE INTERN"}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                    {selectedJob?.job?.company?.name || "Google"} Match Assessment
                  </p>
                </div>

                {/* Score Circular Progress Chart */}
                <div className="flex flex-col items-center justify-center py-2 text-center">
                  <div className="relative w-36 h-36 flex items-center justify-center">
                    {/* Glowing back mesh */}
                    <div className="absolute inset-0 bg-amber-500/5 dark:bg-amber-500/10 rounded-full filter blur-xl animate-pulse" />
                    
                    {/* SVG progress wheel */}
                    <svg className="w-full h-full transform -rotate-90">
                      <circle
                        cx="72"
                        cy="72"
                        r="52"
                        stroke="currentColor"
                        className="text-slate-100 dark:text-white/5"
                        strokeWidth="8"
                        fill="transparent"
                      />
                      <motion.circle
                        cx="72"
                        cy="72"
                        r="52"
                        stroke="#f59e0b" // Amber ATS color
                        strokeWidth="8"
                        fill="transparent"
                        strokeDasharray={326.7}
                        initial={{ strokeDashoffset: 326.7 }}
                        animate={{ strokeDashoffset: 326.7 - (326.7 * 38) / 100 }}
                        transition={{ duration: 1.6, ease: "easeOut" }}
                        strokeLinecap="round"
                      />
                    </svg>

                    {/* Numeric Score */}
                    <div className="absolute flex flex-col items-center justify-center text-center">
                      <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">
                        38%
                      </span>
                      <span className="text-[7.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mt-1.5">
                        ATS SCORE
                      </span>
                    </div>
                  </div>

                  <div className="mt-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-[9px] uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full border border-amber-500/20">
                    Moderate Match
                  </div>
                </div>

                {/* Middle Sections: Side-by-side Metric Containers */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Left: Matched Skills */}
                  <div className="p-4.5 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] border border-emerald-500/20 rounded-2xl flex flex-col h-full min-h-[140px]">
                    <h5 className="text-[9.5px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-3.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                      Matched Skills
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {["React", "TypeScript", "AWS", "REST APIs"].map((skill, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Missing Keywords */}
                  <div className="p-4.5 bg-rose-500/[0.03] dark:bg-rose-500/[0.01] border border-rose-500/20 rounded-2xl flex flex-col h-full min-h-[140px]">
                    <h5 className="text-[9.5px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] mb-3.5 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm" />
                      Missing Keywords
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {["Docker", "Kubernetes", "CI/CD"].map((keyword, i) => (
                        <span
                          key={i}
                          className="text-[9px] font-extrabold text-rose-600 dark:text-rose-400/80 border border-rose-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-rose-500/5"
                        >
                          {keyword}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Section: AI Suggestions alert box */}
                <div className="p-4.5 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 rounded-2xl relative overflow-hidden">
                  <div className="absolute -right-2 -bottom-2 opacity-5 dark:opacity-10 text-indigo-500 pointer-events-none">
                    <Sparkles size={64} />
                  </div>
                  
                  <div className="flex items-start gap-3 relative z-10">
                    <div className="w-7 h-7 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5 border border-amber-500/20">
                      <Sparkles size={14} className="fill-amber-500/20" />
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <h6 className="text-[10px] font-black text-slate-800 dark:text-[#f8fafc] uppercase tracking-widest">
                        AI Suggestions
                      </h6>
                      <ul className="space-y-1.5 text-slate-650 dark:text-slate-400 font-medium text-[11px] md:text-xs">
                        <li className="flex items-start gap-2 leading-relaxed">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>Integrate keywords like <strong className="text-slate-900 dark:text-white font-extrabold">Docker</strong> and <strong className="text-slate-900 dark:text-white font-extrabold">Kubernetes</strong> into your recent projects.</span>
                        </li>
                        <li className="flex items-start gap-2 leading-relaxed">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>Tailor your professional summary to highlight <strong className="text-slate-900 dark:text-white font-extrabold">CI/CD</strong> and cloud experience.</span>
                        </li>
                        <li className="flex items-start gap-2 leading-relaxed">
                          <span className="text-amber-500 font-bold">•</span>
                          <span>Quantify your achievements to showcase impact in scaling <strong className="text-slate-900 dark:text-white font-extrabold">REST APIs</strong>.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.04]">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setApplyStep('resume');
                      setSelectedResumeOption('fresh');
                    }}
                    className="rounded-xl border border-slate-200 dark:border-white/10 px-6 h-11 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:text-slate-950 dark:hover:text-white"
                  >
                    Improve Resume
                  </Button>
                  <Button
                    onClick={handleApply}
                    disabled={isApplying}
                    className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl px-6 h-11 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all border-none"
                  >
                    {isApplying ? <Loader2 size={12} className="animate-spin" /> : "Apply Anyway"}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Modal>

      </div>
    </StudentPageLayout>
  );
};

export default JobListing;
