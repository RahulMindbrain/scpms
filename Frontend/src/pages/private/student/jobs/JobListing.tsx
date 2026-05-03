import {
  Briefcase,
  Search,
  MapPin,
  Clock,
  BriefcaseBusiness,
  ChevronRight,
  IndianRupee,
  Calendar,
  Sparkles,
  Trophy,
  Building2,
  ChevronLeft
} from 'lucide-react';
import { useState, useEffect } from 'react';
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
import { Card, CardContent } from "@/components/ui/card";

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
  const { jobs, profile, applications = [], loading } = useSelector((state: RootState) => state.student);

  const [searchQuery, setSearchQuery] = useState('');
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

  const formatSalary = (salary: number) => {
    if (!salary) return 'Not disclosed';
    return (salary / 100000).toFixed(1) + ' LPA';
  };

  const appliedJobIds = new Set(
    applications.map((app: any) => Number(app?.jobId || app?.job?.id)).filter(Boolean)
  );

  const filteredJobs = jobs.filter((job: any) => {
    const notApplied = !appliedJobIds.has(Number(job.id));
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    return notApplied && matchesSearch;
  });

  // Paginated data
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const paginatedJobs = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const checkEligibility = (job: Job) => {
    if (!profile) return true;
    if (job.minCgpa && profile.cgpa < job.minCgpa) return false;
    return true;
  };

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
    return <Loader text="Fetching opportunities..." fullScreen />;
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] dark:bg-background pb-20 selection:bg-indigo-500/30 selection:text-indigo-200">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-10 px-4 lg:px-10 pt-6 w-full max-w-[1600px] mx-auto"
      >
        {/* Modern Header Section */}
        <motion.div variants={itemVariants} className="relative group/hero">
          <div className="h-40 md:h-44 w-full rounded-[2.5rem] bg-[#0f172a] shadow-2xl relative overflow-hidden flex items-center px-8 md:px-12">
            <div className="absolute inset-0">
              <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/30 rounded-full blur-[80px] animate-pulse"></div>
              <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-500/20 rounded-full blur-[80px] animate-pulse delay-1000"></div>
            </div>
            
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-14 h-14 bg-white/10 backdrop-blur-xl rounded-2xl flex items-center justify-center text-white border border-white/20 shadow-xl">
                <Briefcase className="w-7 h-7 text-indigo-400" />
              </div>
              <div className="space-y-1">
                <h1 className="text-2xl md:text-4xl font-bold text-white tracking-tight">Career Opportunities</h1>
                <p className="text-indigo-200/60 text-xs md:text-sm font-medium flex items-center gap-2 uppercase tracking-[0.2em]">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  Your next milestone awaits
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Search Bar - High Contrast Border */}
        <motion.div variants={itemVariants} className="flex justify-start">
          <div className="relative w-full max-w-lg group">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-indigo-600 transition-colors" />
            <input
              type="text"
              placeholder="Search by role, company, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white dark:bg-slate-900/60 border-2 border-slate-200 dark:border-white/10 rounded-2xl shadow-lg focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all font-bold text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
            />
          </div>
        </motion.div>

        {/* Jobs Grid - Maximum Card Visibility */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 md:gap-10">
          <AnimatePresence mode='popLayout'>
            {paginatedJobs.map((job: Job) => {
              const isEligible = checkEligibility(job);
              return (
                <motion.div
                  key={job.id}
                  layout
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="h-full border-none bg-white dark:bg-slate-900/50 backdrop-blur-md rounded-[2rem] overflow-hidden shadow-[0_12px_45px_rgb(0,0,0,0.08)] dark:shadow-none hover:shadow-[0_20px_60px_rgb(99,102,241,0.15)] transition-all duration-500 border-2 border-slate-100 dark:border-white/5 hover:border-indigo-500/40">
                    <CardContent className="p-0">
                      <div className="p-8">
                        <div className="flex gap-5">
                          {/* Company Branding */}
                          <div className={`w-14 h-14 md:w-16 md:h-16 ${job.logoBg || 'bg-indigo-600/15'} rounded-2xl flex items-center justify-center text-indigo-700 dark:text-indigo-400 font-black text-xl shadow-sm group-hover:scale-110 transition-transform duration-500 shrink-0 border-2 border-indigo-500/10`}>
                            {job.logo || job.company.name.substring(0, 2)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-col gap-2 mb-3">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-tight group-hover:text-indigo-600 transition-colors">
                                {job.title}
                              </h3>
                              <Badge 
                                className={`shrink-0 w-fit px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border-none ${
                                  isEligible 
                                  ? 'bg-emerald-500/15 text-emerald-700' 
                                  : 'bg-rose-500/15 text-rose-700'
                                }`}
                              >
                                {isEligible ? 'Eligible' : 'Ineligible'}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-2 text-slate-800 dark:text-slate-400 font-bold text-sm">
                              <Building2 className="w-4 h-4 text-indigo-600" />
                              <span className="truncate">{job.company.name}</span>
                            </div>
                          </div>
                        </div>

                        {/* Visual Stats Grid - Maximum Contrast */}
                        <div className="grid grid-cols-2 gap-3 mt-8">
                          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border-2 border-slate-200 dark:border-white/5 group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">
                            <div className="p-2 rounded-xl bg-blue-600/15 text-blue-800 dark:text-blue-400">
                              <MapPin className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 truncate">{job.location}</span>
                          </div>
                          <div className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-white/[0.03] rounded-2xl border-2 border-slate-200 dark:border-white/5 group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">
                            <div className="p-2 rounded-xl bg-emerald-600/15 text-emerald-800 dark:text-emerald-400">
                              <IndianRupee className="w-4 h-4" />
                            </div>
                            <span className="text-[11px] font-black text-slate-900 dark:text-slate-100 truncate">{formatSalary(job.salary)}</span>
                          </div>
                        </div>

                        {!isEligible && job.minCgpa && (
                          <div className="mt-6 flex items-center gap-3 text-rose-800 dark:text-rose-400 text-[11px] font-black bg-rose-500/10 p-4 rounded-xl border-2 border-rose-500/20">
                            <Trophy className="w-4 h-4" />
                            Required CGPA: {job.minCgpa}+
                          </div>
                        )}
                      </div>

                      {/* Card Footer Actions - Refined Button */}
                      <div className="px-8 py-5 bg-slate-100/50 dark:bg-white/[0.04] border-t-2 border-slate-200 dark:border-white/5 flex items-center justify-between group-hover:bg-white dark:group-hover:bg-white/10 transition-colors">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-500">
                          <Clock className="w-4 h-4 text-indigo-600" />
                          <span className="text-[10px] font-black uppercase tracking-tighter">
                            {new Date(job.postedAt || (job as any).createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <Button
                          onClick={() => {
                            setSelectedJob(job);
                            setIsModalOpen(true);
                          }}
                          disabled={!isEligible}
                          className={`rounded-xl font-bold text-xs px-6 py-2.5 h-auto transition-all ${isEligible
                              ? '!bg-indigo-600 !text-white dark:!bg-white dark:!text-slate-900 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20 dark:shadow-none border-none'
                              : 'bg-slate-200 text-slate-500 dark:bg-slate-800 dark:text-slate-500 cursor-not-allowed border-2 border-slate-300 dark:border-transparent'
                            }`}
                        >
                          View Job <ChevronRight className="w-3.5 h-3.5 ml-1.5" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Pagination UI - Refined Styled */}
        {totalPages > 1 && (
          <motion.div variants={itemVariants} className="flex items-center justify-center gap-3 pt-10 pb-10">
            <Button
              variant="outline"
              size="icon"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="rounded-xl border-2 border-slate-300 dark:border-white/10 w-10 h-10 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500/20 transition-all shadow-sm disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </Button>
            
            <div className="flex items-center gap-2">
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-10 h-10 rounded-xl text-xs font-black transition-all shadow-sm active:scale-90 ${
                    currentPage === idx + 1
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
                    : 'bg-white dark:bg-slate-900/50 text-slate-900 dark:text-slate-400 border-2 border-slate-300 dark:border-white/10 hover:border-indigo-500/50'
                  }`}
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
              className="rounded-xl border-2 border-slate-300 dark:border-white/10 w-10 h-10 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500/20 transition-all shadow-sm disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </Button>
          </motion.div>
        )}

        {/* Empty Search State */}
        {filteredJobs.length === 0 && !loading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 bg-white dark:bg-white/5 rounded-[2.5rem] shadow-2xl flex items-center justify-center mb-6 border-2 border-slate-200 dark:border-white/5">
              <Search className="w-10 h-10 text-slate-400 dark:text-slate-800" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">No matching opportunities</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2 text-base font-medium">Try broadening your search or check back later.</p>
          </motion.div>
        )}

        {/* Premium Details Modal - Refined Visibility */}
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={selectedJob?.title || "Job Details"}
          subtitle={`${selectedJob?.company?.name} • ${selectedJob?.location}`}
        >
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/5 flex gap-4 items-center">
                <div className="p-2.5 bg-indigo-600/15 rounded-xl">
                  <Calendar className="w-5 h-5 text-indigo-700 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest">Deadline</p>
                  <p className="text-sm font-bold text-slate-950 dark:text-slate-50">{selectedJob?.deadline || 'To be announced'}</p>
                </div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-100 dark:bg-white/5 border-2 border-slate-200 dark:border-white/10 flex gap-4 items-center">
                <div className="p-2.5 bg-emerald-600/15 rounded-xl">
                  <IndianRupee className="w-5 h-5 text-emerald-700 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-600 dark:text-slate-500 uppercase tracking-widest">Expected LPA</p>
                  <p className="text-sm font-bold text-slate-950 dark:text-slate-50">{selectedJob?.salary ? formatSalary(selectedJob.salary) : 'Competitive'}</p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[10px] font-black text-slate-950 dark:text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <div className="w-1.5 h-4 bg-indigo-700 rounded-full"></div>
                About the Opportunity
              </h4>
              <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-2xl border-2 border-slate-200 dark:border-white/5">
                <p className="text-slate-900 dark:text-slate-100 leading-relaxed font-semibold text-[14px]">
                  {selectedJob?.description}
                </p>
              </div>
            </div>

            <div className="pt-4 pb-2">
              <Button
                className="w-full !bg-indigo-600 !text-white py-6 rounded-xl font-bold text-base tracking-tight shadow-xl shadow-indigo-500/30 hover:!bg-indigo-700 hover:scale-[1.01] active:scale-[0.99] transition-all border-none"
                onClick={handleApply}
                disabled={isApplying}
              >
                {isApplying ? <Loader size="sm" /> : 'Confirm Application'}
              </Button>
              <p className="text-center text-[10px] font-black text-slate-600 uppercase tracking-widest mt-4">Verified application process</p>
            </div>
          </div>
        </Modal>
      </motion.div>
    </div>
  );
};

export default JobListing;

