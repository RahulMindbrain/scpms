import {
  Search,
  MapPin,
  Clock,
  ChevronRight,
  IndianRupee,
  Calendar,
  Building2,
  ChevronLeft,
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
import { fetchJobs, applyJob, fetchStudentProfile, fetchJobApplications, fetchJobUniversities } from '@/redux/thunks/studentThunk';
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
  const { jobs = [], jobUniversities = [], profile, applications = [], loading } = useSelector((state: RootState) => state.student);
  const { user } = useSelector((state: RootState) => state.auth);
  const isApproved = user?.status === 'ACTIVE';

  // Enrich jobUniversities with full company object from show-all-jobs
  // job-universities only has companyId; show-all-jobs has the full company { name, ... }
  const normalizedJobs = useMemo(() => {
    return jobUniversities.map((ju: any) => {
      const matchedJob = jobs.find((j: any) => j.id === ju.jobId || j.id === ju.job?.id);
      return {
        ...ju,
        job: {
          ...ju.job,
          company: matchedJob?.company ?? ju.job?.company ?? null,
        },
      };
    });
  }, [jobUniversities, jobs]);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'applied' | 'eligible'>('all');
  const [selectedJob, setSelectedJob] = useState<JobUniversity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchJobs({}));
    dispatch(fetchJobUniversities({}));
    dispatch(fetchJobApplications({}));
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
    return (normalizedJobs || []).filter((job: any) => {
      if (!job?.job) return false;
      
      const matchesSearch =
        job.job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.university?.name?.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      const eligibility = checkEligibility(job);
      
      if (activeTab === 'applied') return appliedJobIds.has(Number(job.id));
      if (activeTab === 'eligible') return eligibility.eligible && !appliedJobIds.has(Number(job.id));
      
      // In 'all' tab, we show everything but mark them
      return true;
    });
  }, [normalizedJobs, searchQuery, activeTab, appliedJobIds, profile]);

  // Paginated data
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, activeTab]);

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

  const selectedCompanyName = selectedJob?.job?.company?.name ?? 'Hiring Partner';

  if (loading && (jobUniversities?.length || 0) === 0) {
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
        {(jobUniversities?.length || 0) > 0 && (
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

        {/* ─── Jobs Grid - Less Bulky Rows ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {paginatedJobs.map((job: JobUniversity, idx) => {
              const isApplied = appliedJobIds.has(Number(job.id));
              const eligibility = checkEligibility(job);
              
              const companyName = job.job?.company?.name ?? 'Hiring Partner';
              
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

        {/* ─── Premium Modal ─── */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
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
      </div>
    </StudentPageLayout>
  );
};

export default JobListing;
