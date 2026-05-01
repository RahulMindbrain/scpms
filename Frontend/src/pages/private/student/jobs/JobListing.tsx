import { 
  Briefcase, 
  Search,
  MapPin,
  Clock,
  BriefcaseBusiness,
  ChevronRight,
  IndianRupee,
  Calendar
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchJobs, applyJob, fetchStudentProfile, fetchJobApplications } from '@/redux/thunks/studentThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';

import { Modal } from '@/components/ui/modal';

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

import Loader from '@/components/Loader';

const JobListing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, profile, applications = [], loading } = useSelector((state: RootState) => state.student);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'intern' | 'full-time'>('all');

  useEffect(() => {
    dispatch(fetchJobs({ status: 'APPROVED' }));
    dispatch(fetchJobApplications({}));
    if (!profile) {
      dispatch(fetchStudentProfile());
    }
  }, [dispatch, profile]);

  // Format salary in Indian format with ₹ symbol
  const formatSalary = (salary: number) => {
    if (!salary) return 'Not disclosed';
    return '₹' + salary.toLocaleString('en-IN') + ' / yr';
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

  const checkEligibility = (job: Job) => {
    if (!profile) return true; // Assume eligible if profile not loaded yet or let backend handle it
    if (job.minCgpa && profile.cgpa < job.minCgpa) return false;
    return true;
  };

  const handleApply = async () => {
    if (!selectedJob) return;
    
    setIsApplying(true);
    const toastId = toast.loading(`Applying for ${selectedJob.title}...`);
    try {
      await dispatch(applyJob(selectedJob.id)).unwrap();
      toast.success("Applied successfully!", { id: toastId });
      setIsModalOpen(false);
    } catch (error: any) {
      toast.error(error || "Failed to apply", { id: toastId });
    } finally {
      setIsApplying(false);
    }
  };

  if (loading && jobs.length === 0) {
    return <Loader text="Fetching latest career opportunities..." />;
  }

  return (
    <div className="p-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-[#e2e2eb] tracking-tight">Job Opportunities</h2>
            <p className="text-[#908fa0] text-sm font-medium">Explore and apply for the latest recruitment drives.</p>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="mb-8 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-lg group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#908fa0] group-focus-within:text-indigo-400 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by role or company..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-[#0c0e14] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/5 focus:border-blue-500 outline-none transition-all font-medium text-[#e2e2eb]"
          />
        </div>
        <div className="flex items-center gap-2">
          {(['all', 'intern', 'full-time'] as const).map(type => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-4 py-2 text-xs font-bold rounded-xl border transition-all capitalize ${
                filterType === type
                  ? 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                  : 'bg-[#1e1f26] border-[rgba(255,255,255,0.08)] text-[#908fa0] hover:border-[rgba(255,255,255,0.10)]'
              }`}
            >
              {type === 'all' ? 'All Types' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredJobs.map((job: Job) => {
          const isEligible = checkEligibility(job);
          return (
            <div key={job.id} className="bg-[#1e1f26] p-6 rounded-2xl shadow-lg shadow-slate-200/40 border border-[rgba(255,255,255,0.04)] hover:border-indigo-500/30 transition-all duration-300 relative group overflow-hidden">
              {/* Eligibility Decor */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${isEligible ? 'bg-indigo-600' : 'bg-red-600'}`}></div>

              <div className="flex gap-5 relative z-10">
                {/* Logo */}
                <div className={`w-14 h-14 ${job.logoBg || 'bg-indigo-600'} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-black/10 transition-transform duration-500 group-hover:scale-110 shrink-0`}>
                  {job.logo || job.company.name.substring(0, 2)}
                </div>
                
                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1 gap-3">
                    <h3 className="text-lg font-bold text-[#e2e2eb] leading-tight">{job.title}</h3>
                    <Badge variant={isEligible ? 'success' : 'danger'} className="tracking-wider text-[9px] font-bold px-2.5 shrink-0">
                      {isEligible ? 'Eligible' : 'Not Eligible'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#908fa0] font-semibold mb-4">
                    <BriefcaseBusiness className="w-4 h-4 text-blue-500" />
                    <span>{job.company.name}</span>
                  </div>
                  
                  {/* Meta Grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-center gap-2.5 p-2.5 bg-[#191b22] rounded-xl border border-[rgba(255,255,255,0.06)]/50">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-semibold text-[#c7c4d7]">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-2.5 p-2.5 bg-[#191b22] rounded-xl border border-[rgba(255,255,255,0.06)]/50">
                      <IndianRupee className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-semibold text-[#c7c4d7]">{formatSalary(job.salary)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-[rgba(255,255,255,0.04)] flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-[#908fa0]">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">Posted {new Date(job.postedAt || (job as any).createdAt).toLocaleDateString()}</span>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedJob(job);
                    setIsModalOpen(true);
                  }}
                  disabled={!isEligible}
                  className={`rounded-xl font-bold text-xs px-5 py-4 ${
                    isEligible 
                      ? 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20' 
                      : 'bg-[#191b22] text-[#908fa0] cursor-not-allowed border border-[rgba(255,255,255,0.06)]'
                  }`}
                >
                  View & Apply <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {filteredJobs.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-[#c7c4d7]">
          <div className="w-16 h-16 bg-[#191b22] rounded-full flex items-center justify-center mb-4">
            <Search className="w-8 h-8 opacity-30" />
          </div>
          <p className="text-base font-semibold text-[#908fa0]">No matching opportunities</p>
          <p className="text-sm text-[#908fa0] mt-1">Try a different search term or filter</p>
        </div>
      )}

      {/* Job Details Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedJob?.title || "Job Details"}
        subtitle={`${selectedJob?.company?.name} • ${selectedJob?.location}`}
      >
        <div className="space-y-8">
          <div className="flex flex-wrap gap-4">
            <Badge variant="outline" className="px-4 py-2 rounded-xl text-xs font-semibold border-[rgba(255,255,255,0.08)] flex gap-2 items-center">
              <Calendar className="w-4 h-4 text-blue-600" /> Deadline: {selectedJob?.deadline}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 rounded-xl text-xs font-semibold border-[rgba(255,255,255,0.08)] flex gap-2 items-center">
              <IndianRupee className="w-4 h-4 text-emerald-600" /> Package: {selectedJob?.salary ? formatSalary(selectedJob.salary) : 'N/A'}
            </Badge>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-[#e2e2eb] uppercase tracking-wider">About the Role</h4>
            <p className="text-[#c7c4d7] leading-relaxed font-medium">
              {selectedJob?.description || "Detailed job description will be provided shortly. This role involves working with cross-functional teams to deliver high-quality software solutions."}
            </p>
          </div>

          <div className="p-6 bg-indigo-500/10 rounded-[1.5rem] border border-indigo-500/20 space-y-3">
            <h4 className="text-xs font-bold text-indigo-200 uppercase tracking-wider">Application Process</h4>
            <p className="text-indigo-300 text-sm font-medium leading-relaxed">
              Once you apply, your profile will be shared with the recruiter. If shortlisted, you'll be invited for a technical round via the interview scheduler.
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <Button 
              className="flex-1 bg-indigo-600 py-6 rounded-2xl font-bold tracking-wider shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all"
              onClick={handleApply}
              disabled={isApplying}
            >
              {isApplying ? <Loader size="sm" /> : 'Apply Now'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobListing;

