import {
  Search,
  MapPin,
  Clock,
  ChevronRight,
  IndianRupee,
  Calendar,
  Building2,
  ChevronLeft,
} from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, applyJob, fetchStudentProfile, fetchJobApplications } from '@/redux/thunks/studentThunk';
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

const JobListing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, profile, applications = [], loading } = useSelector((state: RootState) => state.student);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'applied' | 'eligible'>('all');
  const [selectedJob, setSelectedJob] = useState<JobUniversity | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  
  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  useEffect(() => {
    dispatch(fetchJobs({ status: 'APPROVED' }));
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
      
      // In 'all' tab, we show everything but mark them
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

  const handleApply = async () => {
    if (!selectedJob) return;

    setIsApplying(true);
    const toastId = toast.loading(`Submitting application...`);
    try {
      await dispatch(applyJob(selectedJob.id)).unwrap();
      await dispatch(fetchJobApplications({}));
      toast.success("Application submitted!", { id: toastId });
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error || "Failed to apply", { id: toastId });
    } finally {
      setIsApplying(false);
    }
  };

  if (loading && (jobs?.length || 0) === 0) {
    return <Loader text="Syncing career opportunities..." fullScreen />;
  }

  return (
    <StudentPageLayout>
      <div className="space-y-8 student-hero-animate fade-in slide-in-from-bottom-2 duration-500">
        
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
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 md:gap-6 bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl p-4 md:p-6 rounded-[2rem] border border-slate-200/60 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center gap-1.5 md:gap-2 bg-slate-100 dark:bg-white/5 p-1 md:p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.05] overflow-x-auto no-scrollbar w-full lg:w-fit">
              {[
                { id: 'all', label: 'All Jobs' },
                { id: 'eligible', label: 'Recommended' },
                { id: 'applied', label: 'Applied' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-4 md:px-6 py-2.5 md:py-3 rounded-xl text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 whitespace-nowrap",
                    activeTab === tab.id
                      ? "bg-white dark:bg-[#1e1f26] text-blue-600 dark:text-blue-400 shadow-xl border border-slate-200/50 dark:border-white/10 scale-105"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-96 group">
                <Search
  className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors w-4 h-4 md:w-[18px] md:h-[18px]"
/>
                <Input
                  placeholder="Search role or company..."
                  className="pl-12 md:pl-14 h-12 md:h-14 bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-xs md:text-sm font-semibold focus-visible:ring-blue-500/30 shadow-inner transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
                  <Card className="h-full border-none bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200/60 dark:border-white/[0.08] hover:border-blue-500/30">
                    <CardContent className="p-0 flex flex-col h-full">
                      {/* Top Info */}
                      <div className="p-6 md:p-8 flex-1 space-y-6 md:space-y-8">
                        <div className="flex items-start justify-between gap-4">
                          <div className={cn(
                            "w-14 h-14 md:w-16 md:h-16 rounded-2xl flex items-center justify-center font-black text-xl md:text-2xl text-white shadow-2xl shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                            isApplied ? "bg-blue-500" : "bg-gradient-to-br from-blue-500 to-blue-700"
                          )}>
                            {job.job?.company?.name?.[0] || job.job?.title?.[0] || 'J'}
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            {isApplied ? (
                              <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-sm">
                                Applied
                              </Badge>
                            ) : checkEligibility(job).eligible ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-sm">
                                Recommended
                              </Badge>
                            ) : (
                              <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[8px] md:text-[9px] font-black uppercase tracking-[0.2em] px-3 md:px-4 py-1 md:py-1.5 rounded-full shadow-sm">
                                Ineligible
                              </Badge>
                            )}
                            {job.openings && (
                              <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                {job.openings} Openings
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="space-y-2">
                            <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors tracking-tight line-clamp-2">
                              {job.job?.title}
                            </h3>
                            <div className="flex flex-col gap-1">
                              <p className="text-[9px] md:text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-[0.15em] truncate">
                                <Building2 size={14} className="text-blue-500 shrink-0" />
                                {job.job?.company?.name || 'Top Tier Recruiter'}
                              </p>
                              {job.university?.name && (
                                <p className="text-[8px] font-bold text-slate-400 flex items-center gap-2 uppercase tracking-[0.1em] truncate pl-0.5">
                                  <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                  {job.university.name} Placement
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Skills Preview */}
                          <div className="flex flex-wrap gap-1.5 min-h-[1.5rem]">
                            {job.job?.skills?.slice(0, 3).map((skill) => (
                              <span key={skill.id} className="text-[8px] font-bold text-blue-600/70 dark:text-blue-400/60 bg-blue-500/5 px-2 py-0.5 rounded-md border border-blue-500/10 whitespace-nowrap">
                                {skill.name}
                              </span>
                            ))}
                            {(job.job?.skills?.length || 0) > 3 && (
                              <span className="text-[8px] font-bold text-slate-400 px-1 py-0.5 whitespace-nowrap">
                                +{job.job.skills!.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 md:gap-4">
                          <div className="flex items-center gap-2.5 md:gap-3 p-3 md:p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner min-w-0">
                            <MapPin size={14} className="text-blue-500 shrink-0" />
                            <span className="text-[9px] md:text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest truncate">{job.job?.location}</span>
                          </div>
                          <div className="flex items-center gap-2.5 md:gap-3 p-3 md:p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner min-w-0">
                            <IndianRupee size={14} className="text-emerald-500 shrink-0" />
                            <span className="text-[9px] md:text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest truncate">{formatSalary(job.salary)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-6 md:px-8 py-4 md:py-6 bg-slate-50 dark:bg-black/20 border-t border-slate-200/60 dark:border-white/[0.05] flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <Clock size={14} className="text-indigo-500" />
                          {new Date(job.postedAt || job.sentAt || (job as any).createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedJob(job);
                            setIsModalOpen(true);
                          }}
                          className={cn(
                            "rounded-[1.25rem] font-black text-[9px] md:text-[10px] uppercase tracking-[0.2em] px-6 md:px-8 h-10 md:h-12 transition-all duration-500 border-none shadow-xl",
                            isApplied 
                              ? "bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-none hover:bg-blue-500/20" 
                              : "bg-blue-600 text-white shadow-blue-500/30 hover:scale-105 hover:shadow-blue-500/50"
                          )}
                        >
                          {isApplied ? 'Details' : 'Apply Now'}
                        </Button>
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
          <div className="flex items-center justify-center gap-2 md:gap-3 pt-6 pb-12">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="rounded-xl border-2 border-slate-200 dark:border-white/10 w-10 h-10 md:w-12 md:h-12 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </Button>
            
            <div className="flex items-center gap-1.5 md:gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={cn(
                    "w-10 h-10 md:w-12 md:h-12 rounded-xl text-[10px] md:text-xs font-black transition-all shadow-sm",
                    currentPage === idx + 1
                    ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/30"
                    : "bg-white dark:bg-[#1e1f26] text-slate-600 dark:text-slate-400 border-2 border-slate-200 dark:border-white/10 hover:border-indigo-500/50"
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
              className="rounded-xl border-2 border-slate-200 dark:border-white/10 w-10 h-10 md:w-12 md:h-12 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredJobs.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-20 md:py-32 text-center px-4">
            <div className="w-20 h-20 md:w-24 md:h-24 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-6 border-2 border-slate-200 dark:border-white/5 text-slate-300 dark:text-slate-700">
              <Search size={40} />
            </div>
            <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">No matching opportunities</h3>
            <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 mt-2 font-medium">Try broadening your search or switching tabs.</p>
          </div>
        )}

        {/* ─── Premium Modal ─── */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedJob?.job.title}
          subtitle={`${selectedJob?.job?.company?.name || 'Top Tier Recruiter'} • ${selectedJob?.job?.location}`}
          maxWidth="sm:max-w-lg"
        >
          <div className="space-y-6 md:space-y-8 py-2 md:py-4">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="w-16 h-16 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl md:rounded-3xl flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-xl border border-white/10">
                {selectedJob?.job?.company?.name?.[0] || selectedJob?.job?.title?.[0] || 'J'}
              </div>
              <div className="space-y-1 min-w-0">
                <p className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-widest">Company Overview</p>
                <h4 className="text-lg md:text-xl font-black text-slate-900 dark:text-white truncate">{selectedJob?.job?.company?.name || 'Top Tier Recruiter'}</h4>
                <div className="flex items-center gap-2 text-slate-500 font-bold text-xs md:text-sm">
                  <MapPin size={12} className="text-blue-500" />
                  <span className="truncate">{selectedJob?.job?.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 md:gap-4">
              <div className="p-4 md:p-5 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                  <Calendar className="w-3.5 h-3.5 md:w-4 md:h-4 text-blue-600" />
                  <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Deadline</span>
                </div>
                <p className="text-xs md:text-sm font-black text-slate-900 dark:text-slate-100">{selectedJob?.deadline || 'Open'}</p>
              </div>
              <div className="p-4 md:p-5 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-1.5 md:mb-2">
                  <IndianRupee className="w-3.5 h-3.5 md:w-4 md:h-4 text-emerald-600" />
                  <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">Expected CTC</span>
                </div>
                <p className="text-xs md:text-sm font-black text-slate-900 dark:text-slate-100">{selectedJob?.salary ? formatSalary(selectedJob.salary) : 'Competitive'}</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Eligibility Section */}
              <div className="space-y-2">
                <h4 className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Eligibility Criteria</h4>
                <div className="grid grid-cols-1 gap-2">
                  {selectedJob && (
                    <>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Minimum CGPA</span>
                        <span className={cn(
                          "text-xs font-black",
                          profile?.cgpa >= (selectedJob.minCgpa || 0) ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {selectedJob.minCgpa || 'N/A'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-white/[0.02] rounded-xl border border-slate-100 dark:border-white/5">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Max Backlogs</span>
                        <span className={cn(
                          "text-xs font-black",
                          profile?.activeBacklogs <= (selectedJob.maxBacklogs ?? 99) ? "text-emerald-500" : "text-rose-500"
                        )}>
                          {selectedJob.maxBacklogs ?? 'No limit'}
                        </span>
                      </div>
                    </>
                  )}
                </div>
                {selectedJob && !checkEligibility(selectedJob).eligible && (
                  <div className="p-3 bg-rose-500/5 border border-rose-500/20 rounded-xl mt-2">
                    <p className="text-[9px] font-bold text-rose-500 uppercase tracking-wider mb-1">Ineligibility Reasons:</p>
                    <ul className="space-y-1">
                      {checkEligibility(selectedJob).reasons.map((reason, i) => (
                        <li key={i} className="text-[10px] text-rose-600 dark:text-rose-400 font-medium flex items-center gap-1.5">
                          <span className="w-1 h-1 rounded-full bg-rose-400"></span>
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <h4 className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Required Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedJob?.job?.skills?.map((skill) => (
                    <Badge key={skill.id} variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 border-none px-3 py-1 text-[10px] font-bold">
                      {skill.name}
                    </Badge>
                  ))}
                  {(!selectedJob?.job?.skills || selectedJob.job.skills.length === 0) && (
                    <span className="text-xs text-slate-400 italic">No specific skills listed</span>
                  )}
                </div>
              </div>

              <div className="space-y-2 md:space-y-3">
                <h4 className="text-[8px] md:text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Description</h4>
                <div className="bg-slate-50 dark:bg-white/[0.02] p-4 md:p-6 rounded-2xl border border-slate-100 dark:border-white/5 max-h-40 md:max-h-48 overflow-y-auto no-scrollbar">
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-xs md:text-sm whitespace-pre-wrap">
                    {selectedJob?.description}
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="w-full !bg-blue-600 !text-white py-6 md:py-8 rounded-2xl font-black text-sm md:text-base uppercase tracking-widest shadow-xl shadow-blue-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
                onClick={handleApply}
                disabled={isApplying || !selectedJob || appliedJobIds.has(Number(selectedJob.id)) || !checkEligibility(selectedJob).eligible}
              >
                {isApplying ? <Loader size="sm" /> : (selectedJob && appliedJobIds.has(Number(selectedJob.id))) ? 'Already Applied' : (selectedJob && !checkEligibility(selectedJob).eligible) ? 'Not Eligible to Apply' : 'Confirm Application'}
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </StudentPageLayout>
  );
};

export default JobListing;
