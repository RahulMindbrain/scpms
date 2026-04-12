import { 
  Briefcase, 
  Bell, 
  Search,
  MapPin,
  Clock,
  BriefcaseBusiness,
  ChevronRight,
  DollarSign,
  Calendar
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { fetchJobs, applyJob, fetchStudentProfile } from '@/redux/thunks/studentThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import { Loader2 } from 'lucide-react';
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

const JobListing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs,   profile } = useSelector((state: RootState) => state.student);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApplying, setIsApplying] = useState(false);

  useEffect(() => {
    dispatch(fetchJobs({ status: 'APPROVED' }));
    if (!profile) {
      dispatch(fetchStudentProfile());
    }
  }, [dispatch, profile]);

  const filteredJobs = jobs.filter((job: any) => 
    job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    job.company.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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

  return (
    <div className="p-8 animate-in fade-in duration-700">
      {/* Header */}
      <header className="flex items-center justify-between mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-black text-2xl text-slate-900 tracking-tight">Job Opportunities</h2>
            <p className="text-slate-500 text-sm font-medium">Explore and apply for the latest recruitment drives.</p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="relative cursor-pointer group">
            <div className="p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md transition-all">
              <Bell className="w-6 h-6 text-slate-500 group-hover:text-blue-600" />
              <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-white font-black">5</span>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filters */}
      <div className="mb-10 flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-lg group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            placeholder="Search by role or company..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-slate-100 rounded-[1.5rem] shadow-sm focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 outline-none transition-all font-medium text-slate-800"
          />
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {filteredJobs.map((job: Job) => {
          const isEligible = checkEligibility(job);
          return (
            <div key={job.id} className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-50 hover:border-blue-200 transition-all duration-300 relative group overflow-hidden">
              {/* Eligibility Decor */}
              <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${isEligible ? 'bg-blue-600' : 'bg-red-600'}`}></div>

              <div className="flex gap-6 relative z-10">
                {/* Logo */}
                <div className={`w-16 h-16 ${job.logoBg || 'bg-blue-600'} rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-lg shadow-black/10 transition-transform duration-500 group-hover:scale-110`}>
                  {job.logo || job.company.name.substring(0, 2)}
                </div>
                
                {/* Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-black text-slate-900 leading-tight uppercase tracking-tight">{job.title}</h3>
                    <Badge variant={isEligible ? 'success' : 'danger'} className="uppercase tracking-widest text-[9px] font-black px-3">
                      {isEligible ? 'Eligible' : 'Not Eligible'}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 font-bold mb-6">
                    <BriefcaseBusiness className="w-4 h-4 text-blue-500" />
                    <span>{job.company.name}</span>
                  </div>
                  
                  {/* Meta Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <MapPin className="w-4 h-4 text-blue-500" />
                      <span className="text-xs font-bold text-slate-600">{job.location}</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <DollarSign className="w-4 h-4 text-emerald-500" />
                      <span className="text-xs font-bold text-slate-600">{job.salary}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                <div className="flex items-center gap-2 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span className="text-[10px] font-black uppercase tracking-widest">Posted {new Date(job.postedAt || (job as any).createdAt).toLocaleDateString()}</span>
                </div>
                <Button 
                  onClick={() => {
                    setSelectedJob(job);
                    setIsModalOpen(true);
                  }}
                  disabled={!isEligible}
                  className={`rounded-xl font-black text-xs uppercase tracking-widest px-6 py-5 ${
                    isEligible 
                      ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-xl shadow-blue-500/20' 
                      : 'bg-slate-50 text-slate-300 cursor-not-allowed border border-slate-100'
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
        <div className="flex flex-col items-center justify-center py-20 text-slate-300">
          <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
            <Search className="w-10 h-10 opacity-20" />
          </div>
          <p className="text-xl font-bold uppercase tracking-widest text-slate-400">No matching opportunities</p>
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
            <Badge variant="outline" className="px-4 py-2 rounded-xl text-xs font-bold border-slate-200 flex gap-2 items-center">
              <Calendar className="w-4 h-4 text-blue-600" /> Deadline: {selectedJob?.deadline}
            </Badge>
            <Badge variant="outline" className="px-4 py-2 rounded-xl text-xs font-bold border-slate-200 flex gap-2 items-center">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Package: {selectedJob?.salary}
            </Badge>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">About the Role</h4>
            <p className="text-slate-600 leading-relaxed font-medium">
              {selectedJob?.description || "Detailed job description will be provided shortly. This role involves working with cross-functional teams to deliver high-quality software solutions."}
            </p>
          </div>

          <div className="p-6 bg-blue-50 rounded-[1.5rem] border border-blue-100 space-y-3">
            <h4 className="text-xs font-black text-blue-900 uppercase tracking-[0.2em]">Application Process</h4>
            <p className="text-blue-700 text-sm font-medium leading-relaxed">
              Once you apply, your profile will be shared with the recruiter. If shortlisted, you'll be invited for a technical round via the interview scheduler.
            </p>
          </div>

          <div className="pt-4 flex gap-4">
            <Button 
              className="flex-1 bg-blue-600 py-7 rounded-2xl font-black uppercase tracking-[0.2em] shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform"
              onClick={handleApply}
              disabled={isApplying}
            >
              {isApplying ? <Loader2 className="animate-spin" /> : 'Apply Now'}
            </Button>
            <Button 
               variant="outline"
               className="py-7 rounded-2xl font-black uppercase tracking-[0.2em] border-slate-200"
               onClick={() => setIsModalOpen(false)}
            >
              Save for later
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default JobListing;

