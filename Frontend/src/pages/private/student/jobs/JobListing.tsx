import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  ChevronRight,
  IndianRupee,
  Calendar,
  Sparkles,
  Trophy,
  Building2,
  ChevronLeft,
  Filter,
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

interface Job {
  id: number;
  title: string;
  company: {
    id: number;
    name: string;
  };
  location: string;
  salary: number;
  deadline?: string;
  eligible?: boolean;
  postedAt: string;
  logo?: string;
  logoBg?: string;
  description: string;
  minCgpa?: number;
  maxCgpa?: number;
}

const JobListing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { jobs, profile, applications = [], loading } = useSelector((state: RootState) => state.student);

  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'applied' | 'eligible'>('all');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
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
    applications.map((app: any) => Number(app?.jobId || app?.job?.id)).filter(Boolean)
  ), [applications]);

  const formatSalary = (salary: number) => {
    if (!salary) return 'Not disclosed';
    return (salary / 100000).toFixed(1) + ' LPA';
  };

  const checkEligibility = (job: Job) => {
    if (!profile) return true;
    if (job.minCgpa && profile.cgpa < job.minCgpa) return false;
    return true;
  };

  const filteredJobs = useMemo(() => {
    return jobs.filter((job: any) => {
      const matchesSearch =
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchesSearch) return false;

      if (activeTab === 'applied') return appliedJobIds.has(Number(job.id));
      if (activeTab === 'eligible') return checkEligibility(job) && !appliedJobIds.has(Number(job.id));
      
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
      toast.success("Application submitted!", { id: toastId });
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error || "Failed to apply", { id: toastId });
    } finally {
      setIsApplying(false);
    }
  };

  if (loading && jobs.length === 0) {
    return <Loader text="Syncing career opportunities..." fullScreen />;
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-[1600px] mx-auto w-full p-4 md:p-8 space-y-8 student-hero-animate fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Adaptive Hero Banner */}
        <div className="student-hero-banner group">
          <div className="student-hero-mesh">
            <div className="bubble-indigo"></div>
            <div className="bubble-sky"></div>
          </div>

          <div className="student-hero-texture"></div>
          <div className="student-hero-overlay"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="student-hero-badge">
                <Sparkles /> 
                <span>Career Opportunities</span>
              </div>
              <h1 className="student-hero-title">
                Find Your <span>Dream Career</span> 🚀
              </h1>
              <p className="student-hero-description">
                Explore the latest job openings, internships, and placement opportunities from top-tier companies.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
                <Briefcase className="h-16 w-16 text-white/40" />
              </div>
            </div>
          </div>
        </div>

        {/* ─── Compact Controls Bar ─── */}
        {jobs.length > 0 && (
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl p-6 rounded-[2rem] border border-slate-200/60 dark:border-white/[0.08] shadow-sm">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.05] w-fit">
              {[
                { id: 'all', label: 'All Jobs' },
                { id: 'eligible', label: 'Recommended' },
                { id: 'applied', label: 'My Applications' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={cn(
                    "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                    activeTab === tab.id
                      ? "bg-white dark:bg-[#1e1f26] text-indigo-600 dark:text-indigo-400 shadow-xl border border-slate-200/50 dark:border-white/10 scale-105"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-4 w-full lg:w-auto">
              <div className="relative flex-1 lg:w-96 group">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                <Input
                  placeholder="Search by role, company, or tech stack..."
                  className="pl-14 h-14 bg-slate-100 dark:bg-white/5 border-none rounded-2xl text-sm font-semibold focus-visible:ring-indigo-500/30 shadow-inner transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
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
            {paginatedJobs.map((job: Job, idx) => {
              const isEligible = checkEligibility(job);
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
                  <Card className="h-full border-none bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-200/60 dark:border-white/[0.08] hover:border-indigo-500/30">
                    <CardContent className="p-0 flex flex-col h-full">
                      {/* Top Info */}
                      <div className="p-8 flex-1 space-y-8">
                        <div className="flex items-start justify-between gap-4">
                          <div className={cn(
                            "w-16 h-16 rounded-2xl flex items-center justify-center font-black text-2xl text-white shadow-2xl shrink-0 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3",
                            isApplied ? "bg-indigo-500" : isEligible ? "bg-gradient-to-br from-indigo-500 to-blue-600" : "bg-slate-400 grayscale"
                          )}>
                            {job.company.name[0]}
                          </div>
                          <div className="flex flex-col items-end gap-3">
                            {isApplied ? (
                              <Badge className="bg-indigo-500/10 text-indigo-500 border-indigo-500/20 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm">
                                Applied
                              </Badge>
                            ) : isEligible ? (
                              <Badge className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm">
                                Recommended
                              </Badge>
                            ) : (
                              <Badge className="bg-rose-500/10 text-rose-500 border-rose-500/20 text-[9px] font-black uppercase tracking-[0.2em] px-4 py-1.5 rounded-full shadow-sm">
                                Ineligible
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">
                            {job.title}
                          </h3>
                          <p className="text-[10px] font-black text-slate-500 flex items-center gap-2 uppercase tracking-[0.15em]">
                            <Building2 size={14} className="text-indigo-500" />
                            {job.company.name}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner">
                            <MapPin size={16} className="text-blue-500" />
                            <span className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-white/5 rounded-2xl border border-slate-200/50 dark:border-white/5 shadow-inner">
                            <IndianRupee size={16} className="text-emerald-500" />
                            <span className="text-[10px] font-black text-slate-900 dark:text-slate-100 uppercase tracking-widest truncate">{formatSalary(job.salary)}</span>
                          </div>
                        </div>
                      </div>

                      {/* Footer Actions */}
                      <div className="px-8 py-6 bg-slate-50 dark:bg-black/20 border-t border-slate-200/60 dark:border-white/[0.05] flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2 text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">
                          <Clock size={16} className="text-indigo-500" />
                          {new Date(job.postedAt || (job as any).createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedJob(job);
                            setIsModalOpen(true);
                          }}
                          className={cn(
                            "rounded-[1.25rem] font-black text-[10px] uppercase tracking-[0.2em] px-8 h-12 transition-all duration-500 border-none shadow-xl",
                            isApplied 
                              ? "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-none hover:bg-indigo-500/20" 
                              : isEligible
                              ? "bg-indigo-600 text-white shadow-indigo-500/30 hover:scale-105 hover:shadow-indigo-500/50"
                              : "bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed shadow-none"
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
          <div className="flex items-center justify-center gap-3 pt-6 pb-12">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="rounded-xl border-2 border-slate-200 dark:border-white/10 w-12 h-12 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronLeft size={20} />
            </Button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={cn(
                    "w-12 h-12 rounded-xl text-xs font-black transition-all shadow-sm",
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
              className="rounded-xl border-2 border-slate-200 dark:border-white/10 w-12 h-12 hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
            >
              <ChevronRight size={20} />
            </Button>
          </div>
        )}

        {/* Empty State */}
        {filteredJobs.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center mb-6 border-2 border-slate-200 dark:border-white/5 text-slate-300 dark:text-slate-700">
              <Search size={48} />
            </div>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">No matching opportunities</h3>
            <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Try broadening your search or switching tabs.</p>
          </div>
        )}

        {/* ─── Premium Modal ─── */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedJob?.title}
          subtitle={`${selectedJob?.company.name} • ${selectedJob?.location}`}
          maxWidth="sm:max-w-lg"
        >
          <div className="space-y-8 py-4">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl flex items-center justify-center text-white font-black text-3xl shadow-xl border border-white/10">
                {selectedJob?.company.name[0]}
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-black text-indigo-600 uppercase tracking-widest">Company Overview</p>
                <h4 className="text-xl font-black text-slate-900 dark:text-white">{selectedJob?.company.name}</h4>
                <div className="flex items-center gap-2 text-slate-500 font-bold text-sm">
                  <MapPin size={14} className="text-indigo-500" />
                  <span>{selectedJob?.location}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Deadline</span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">{selectedJob?.deadline || 'Open'}</p>
              </div>
              <div className="p-5 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-2 mb-2">
                  <IndianRupee className="w-4 h-4 text-emerald-600" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Expected CTC</span>
                </div>
                <p className="text-sm font-black text-slate-900 dark:text-slate-100">{selectedJob?.salary ? formatSalary(selectedJob.salary) : 'Competitive'}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Job Description</h4>
              <div className="bg-slate-50 dark:bg-white/[0.02] p-6 rounded-2xl border border-slate-100 dark:border-white/5 max-h-48 overflow-y-auto no-scrollbar">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-medium text-sm">
                  {selectedJob?.description}
                </p>
              </div>
            </div>

            <div className="pt-2">
              <Button
                className="w-full !bg-indigo-600 !text-white py-8 rounded-2xl font-black text-base uppercase tracking-widest shadow-xl shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all border-none"
                onClick={handleApply}
                disabled={isApplying || (selectedJob && appliedJobIds.has(Number(selectedJob.id)))}
              >
                {isApplying ? <Loader size="sm" /> : appliedJobIds.has(Number(selectedJob?.id)) ? 'Already Applied' : 'Confirm Application'}
              </Button>
            </div>
          </div>
        </Modal>

      </div>
    </div>
  );
};

export default JobListing;
