import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  MapPin,
  GraduationCap,
  ChevronDown,
  Building2,
  Search,
  Filter,
  IndianRupee,
  ChevronRight,
  Target,
  Clock,
  Info
} from 'lucide-react';
import Loader from '@/components/Loader';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/redux/thunks/driveThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import { cn } from '@/lib/utils';

interface DriveStatus {
  label: string;
  color: string;
  bg: string;
}

interface Department {
  id: number;
  name: string;
}

interface Company {
  id: number;
  name: string;
  description?: string;
}

interface Job {
  id: number;
  title: string;
  description?: string;
  salary?: number | string | null;
  salaryRange?: number | string | null;
  location?: string | null;
  status?: string;
  minCgpa?: number | null;
  maxCgpa?: number | null;
  maxBacklogs?: number | null;
  interviewScheduleId?: number | null;
  createdAt?: string;
  company?: Company;
  eligibleDepartments?: Department[];
  _count?: {
    applications?: number;
  };
}

const statusConfig: Record<string, DriveStatus> = {
  active: { label: 'Active', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-100' },
  upcoming: { label: 'Upcoming', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-100' },
  completed: { label: 'Completed', color: 'text-[#c7c4d7]', bg: 'bg-[#111319] border-[rgba(255,255,255,0.06)]' },
};

const PlacementDriveManagement: React.FC = () => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [activeFilter, setActiveFilter] = useState('All Drives');
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedCompanies, setExpandedCompanies] = useState<Record<number, boolean>>({});

  const filterRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch<AppDispatch>();
  const { jobs: reduxJobs, loading } = useSelector((state: RootState) => state.drive);

  useEffect(() => {
    dispatch(fetchJobs({ status: 'APPROVED' }));
  }, [dispatch]);

  // Click outside to close filter dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleCompany = (companyId: number) => {
    setExpandedCompanies(prev => ({
      ...prev,
      [companyId]: !prev[companyId]
    }));
  };

  const processedDrives = useMemo(() => {
    const now = new Date();

    // 1. Map and Enrich Jobs
    const enrichedJobs = reduxJobs.map((job: Job) => {
      const scheduleDate = job.createdAt ? new Date(job.createdAt) : null;

      let status: 'active' | 'completed' | 'upcoming' = 'active';
      if (job.status === 'CLOSED' || job.status === 'REJECTED') {
        status = 'completed';
      } else if (scheduleDate && scheduleDate.getTime() - now.getTime() > 14 * 24 * 60 * 60 * 1000) {
        status = 'upcoming';
      }

      // Handle both salary and salaryRange fields
      const salaryValue = job.salary || job.salaryRange;
      const formattedSalary = salaryValue
        ? `₹${Number(salaryValue).toLocaleString('en-IN')}`
        : 'N/A';

      return {
        ...job,
        status,
        formattedSalary,
        formattedDate: job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric'
        }) : 'TBD',
        departments: job.eligibleDepartments?.map((d: Department) => d.name) || []
      };
    });

    // 2. Filter Jobs
    const filteredJobs = enrichedJobs.filter(job => {
      const matchesFilter = activeFilter === 'All Drives' || job.status.toLowerCase() === activeFilter.toLowerCase();
      const matchesSearch =
        job.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company?.name?.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesFilter && matchesSearch;
    });

    // 3. Group by Company
    const groups: Record<number, { company: any, jobs: any[] }> = {};
    filteredJobs.forEach(job => {
      const companyId = job.company?.id;
      if (!companyId) return;

      if (!groups[companyId]) {
        groups[companyId] = {
          company: job.company,
          jobs: []
        };
      }
      groups[companyId].jobs.push(job);
    });

    return Object.values(groups);
  }, [reduxJobs, activeFilter, searchQuery]);

  const handleViewDetails = (job: any) => {
    setSelectedJob(job);
    setIsDetailsOpen(true);
  };


  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className=" px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold text-[#e2e2eb] tracking-tight">Placement Drives</h1>
            <p className="text-lg text-[#908fa0] font-medium">Manage and monitor recruitment cycles with ease.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            {/* Search Bar */}
            <div className="relative group w-full sm:w-auto sm:min-w-[300px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#908fa0] group-focus-within:text-blue-500 transition-colors" />
              <input
                type="text"
                placeholder="Search company or role..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-[#1e1f26] border border-[rgba(255,255,255,0.08)] rounded-2xl text-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all shadow-sm"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative" ref={filterRef}>
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center justify-between gap-3 px-5 py-3.5 bg-[#1e1f26] border border-[rgba(255,255,255,0.08)] rounded-2xl text-sm font-semibold text-[#c7c4d7] hover:border-slate-300 transition-all shadow-sm active:scale-95"
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-blue-600" />
                  {activeFilter}
                </div>
                <ChevronDown className={cn("w-4 h-4 text-[#908fa0] transition-transform", isFilterOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {isFilterOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 mt-3 w-56 bg-[#1e1f26] border border-[rgba(255,255,255,0.08)] rounded-2xl shadow-2xl z-50 overflow-hidden p-1.5"
                  >
                    {['All Drives', 'Active', 'Upcoming', 'Completed'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => {
                          setActiveFilter(opt);
                          setIsFilterOpen(false);
                        }}
                        className={cn(
                          "w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex items-center justify-between",
                          activeFilter === opt ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-[#c7c4d7] hover:bg-[#111319]"
                        )}
                      >
                        {opt}
                        {activeFilter === opt && <div className="w-2 h-2 bg-[#1e1f26] rounded-full" />}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-[#1e1f26] rounded-3xl p-5 border border-[rgba(255,255,255,0.06)] shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#908fa0]">Total Drives</p>
            <p className="text-3xl font-black text-[#e2e2eb] mt-2">{reduxJobs.length}</p>
          </div>
          <div className="bg-[#1e1f26] rounded-3xl p-5 border border-[rgba(255,255,255,0.06)] shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#908fa0]">Companies</p>
            <p className="text-3xl font-black text-[#e2e2eb] mt-2">{processedDrives.length}</p>
          </div>
          <div className="bg-[#1e1f26] rounded-3xl p-5 border border-[rgba(255,255,255,0.06)] shadow-sm">
            <p className="text-xs font-bold uppercase tracking-widest text-[#908fa0]">Scheduled Interviews</p>
            <p className="text-3xl font-black text-[#e2e2eb] mt-2">
              {reduxJobs.filter((job: Job) => !!job.interviewScheduleId).length}
            </p>
          </div>
        </div>

        {/* Status Content */}
        {/* {error && (
          <div className="flex flex-col items-center justify-center p-12 bg-rose-50 border border-rose-100 rounded-[2rem] text-center space-y-4">
            <div className="w-12 h-12 bg-[#1e1f26] rounded-2xl flex items-center justify-center shadow-sm mx-auto">
              <AlertCircle className="w-6 h-6 text-rose-500" />
            </div>
            <div className="space-y-1">
              <h3 className="text-rose-900 font-bold uppercase tracking-tight">Data Fetching Failed</h3>
              <p className="text-rose-600 text-sm font-medium">{error}</p>
            </div>
            <button
              onClick={() => dispatch(fetchJobs({ status: 'APPROVED' }))}
              className="px-8 py-3 bg-rose-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-rose-700 transition-all shadow-lg active:scale-95"
            >
              Retry Connection
            </button>
          </div>
        )} */}

        {loading && reduxJobs.length === 0 ? (
          <div className="py-20">
            <Loader text="Gathering placement drive details..." />
          </div>
        ) : (
          <div className="space-y-6">
            {processedDrives.length > 0 ? (
              processedDrives.map((group) => {
                const isExpanded = expandedCompanies[group.company.id] ?? true;

                return (
                  <div key={group.company.id} className="group/company space-y-4">
                    {/* Company Card */}
                    <button
                      onClick={() => toggleCompany(group.company.id)}
                      className={cn(
                        "w-full flex flex-col md:flex-row md:items-center gap-6 p-6 rounded-[2.5rem] text-left transition-all duration-300",
                        "bg-[#1e1f26] border-2 border-transparent hover:border-blue-100/50 shadow-sm hover:shadow-xl hover:-translate-y-1",
                        !isExpanded && "opacity-80 grayscale-[0.2]"
                      )}
                    >
                      <div className="w-20 h-20 bg-[#111319] rounded-3xl flex items-center justify-center text-blue-600 border border-[rgba(255,255,255,0.06)] shrink-0 group-hover/company:scale-110 transition-transform">
                        <Building2 className="w-10 h-10" />
                      </div>

                      <div className="flex-1 space-y-1">
                        <div className="flex flex-wrap items-center gap-3">
                          <h2 className="text-3xl font-black text-[#e2e2eb] tracking-tight">{group.company.name}</h2>
                          <Badge variant="secondary" className="bg-blue-50 text-blue-700 border-blue-100 px-3 py-1 rounded-full text-xs font-bold">
                            {group.jobs.length} {group.jobs.length === 1 ? 'Job Opening' : 'Job Openings'}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-[#908fa0]">
                          <div className="flex items-center gap-1.5 text-sm font-medium">
                            <MapPin className="w-4 h-4 text-[#908fa0]" />
                            {group.company.location || 'PAN India'}
                          </div>
                          <div className="w-1 h-1 bg-slate-300 rounded-full" />
                          <p className="text-sm font-medium line-clamp-1 italic max-w-xl">
                            {group.company.description || "Leading industry partner specializing in innovation."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 ml-auto">
                        <div className={cn(
                          "w-12 h-12 rounded-2xl flex items-center justify-center border transition-all",
                          isExpanded ? "bg-blue-50 border-blue-100 text-blue-600" : "bg-[#111319] border-[rgba(255,255,255,0.06)] text-[#908fa0]"
                        )}>
                          <ChevronDown className={cn("w-6 h-6 transition-transform duration-500", !isExpanded && "-rotate-90")} />
                        </div>
                      </div>
                    </button>

                    {/* Jobs Container */}
                    <AnimatePresence initial={false}>
                      {isExpanded && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="grid grid-cols-1 gap-5 pl-0  pr-2">
                            {group.jobs.map((job) => (
                              <motion.div
                                key={job.id}
                                layout
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="relative bg-[#1e1f26] rounded-[2rem] p-6 md:p-8 border border-[rgba(255,255,255,0.06)] shadow-sm hover:shadow-lg transition-all group/job overflow-hidden"
                              >
                                {/* Decorative Gradient */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-br from-blue-50/50 to-transparent rounded-full -mr-16 -mt-16 group-hover/job:scale-150 transition-transform duration-700" />

                                <div className="relative flex flex-col xl:flex-row gap-8">
                                  {/* Job Core Info */}
                                  <div className="flex-1 space-y-6">
                                    <div className="flex flex-wrap items-start justify-between gap-4">
                                      <div className="space-y-1.5">
                                        <h3 className="text-2xl font-bold text-[#e2e2eb] group-hover/job:text-blue-600 transition-colors uppercase tracking-tight">
                                          {job.title}
                                        </h3>
                                        <Badge className={cn("px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", statusConfig[job.status].bg, statusConfig[job.status].color)}>
                                          {statusConfig[job.status].label}
                                        </Badge>
                                      </div>

                                      <div className="flex flex-wrap gap-2 pt-1">
                                        {job.departments.length > 0 ? job.departments.map((dept: string) => (
                                          <span key={dept} className="px-3 py-1.5 bg-[#111319] text-[#908fa0] border border-[rgba(255,255,255,0.08)] rounded-xl text-[10px] font-bold uppercase tracking-wider">
                                            {dept}
                                          </span>
                                        )) : (
                                          <span className="px-3 py-1.5 bg-[#111319] text-[#908fa0] border border-[rgba(255,255,255,0.08)] rounded-xl text-[10px] font-bold uppercase tracking-wider">
                                            All Departments
                                          </span>
                                        )}
                                      </div>
                                    </div>

                                    <p className="text-[#908fa0] text-base leading-relaxed line-clamp-2 font-medium max-w-3xl">
                                      {job.description}
                                    </p>

                                    {/* Attributes Grid */}
                                    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 pt-2">
                                      <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest flex items-center gap-1.5">
                                          <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Salary
                                        </span>
                                        <span className="text-lg font-bold text-[#e2e2eb]">{job.formattedSalary}</span>
                                      </div>
                                      <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest flex items-center gap-1.5">
                                          <MapPin className="w-3.5 h-3.5 text-rose-500" /> Location
                                        </span>
                                        <span className="text-lg font-bold text-[#e2e2eb] truncate">{job.location || 'Remote'}</span>
                                      </div>
                                      <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest flex items-center gap-1.5">
                                          <Target className="w-3.5 h-3.5 text-indigo-500" /> Min CGPA
                                        </span>
                                        <span className="text-lg font-bold text-[#e2e2eb]">{job.minCgpa ?? 'N/A'}</span>
                                      </div>
                                      <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest flex items-center gap-1.5">
                                          <GraduationCap className="w-3.5 h-3.5 text-violet-500" /> Max Backlogs
                                        </span>
                                        <span className="text-lg font-bold text-[#e2e2eb]">{job.maxBacklogs ?? 'No limit'}</span>
                                      </div>
                                      <div className="flex flex-col gap-1.5">
                                        <span className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest flex items-center gap-1.5">
                                          <Clock className="w-3.5 h-3.5 text-amber-500" /> Posted On
                                        </span>
                                        <span className="text-lg font-bold text-[#e2e2eb]">{job.formattedDate}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {/* Stats & Actions */}
                                  <div className="flex flex-col sm:flex-row xl:flex-col items-stretch xl:items-end justify-center gap-8 w-full xl:w-auto xl:min-w-[260px] border-t xl:border-t-0 xl:border-l border-[rgba(255,255,255,0.06)] pt-8 xl:pt-0 xl:pl-10">
                                    <div className="flex items-center gap-3 w-full sm:w-auto xl:w-full">
                                      <button
                                        onClick={() => handleViewDetails(job)}
                                        className="flex-1 flex items-center justify-center gap-2 px-6 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg active:scale-95"
                                      >
                                        <span>View Details</span>
                                        <ChevronRight className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="py-24 text-center bg-[#1e1f26] rounded-[3rem] border-2 border-[rgba(255,255,255,0.06)] border-dashed animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-[#111319] rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-xl font-bold text-[#e2e2eb] mb-2 uppercase tracking-tight">No drives matches your search</h3>
                <p className="text-[#908fa0] font-medium max-w-xs mx-auto">Try adjusting your filters or search keywords to find what you're looking for.</p>
                <button
                  onClick={() => { setSearchQuery(''); setActiveFilter('All Drives'); }}
                  className="mt-8 text-blue-600 font-bold text-xs uppercase tracking-widest hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
        title="Job Listing Details"
        maxWidth="sm:max-w-3xl"
      >
        {selectedJob && (
          <div className="space-y-8 py-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-[#e2e2eb] uppercase tracking-tight leading-none">
                      {selectedJob.company?.name}
                    </h2>
                    <p className="text-sm font-bold text-blue-600 pt-1 tracking-widest uppercase">
                      {selectedJob.title}
                    </p>
                  </div>
                </div>
              </div>
              <Badge className={cn("px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest border", statusConfig[selectedJob.status].bg, statusConfig[selectedJob.status].color)}>
                {statusConfig[selectedJob.status].label}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="p-6 bg-[#111319] rounded-3xl border border-[rgba(255,255,255,0.06)] space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#908fa0] uppercase tracking-widest">
                  <IndianRupee className="w-3.5 h-3.5 text-emerald-500" /> Package
                </div>
                <p className="text-xl font-black text-[#e2e2eb]">{selectedJob.formattedSalary}</p>
              </div>
              <div className="p-6 bg-[#111319] rounded-3xl border border-[rgba(255,255,255,0.06)] space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#908fa0] uppercase tracking-widest">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Location
                </div>
                <p className="text-xl font-black text-[#e2e2eb]">{selectedJob.location || 'Remote'}</p>
              </div>
              <div className="p-6 bg-[#111319] rounded-3xl border border-[rgba(255,255,255,0.06)] space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#908fa0] uppercase tracking-widest">
                  <GraduationCap className="w-3.5 h-3.5 text-indigo-500" /> CGPA Req.
                </div>
                <p className="text-xl font-black text-[#e2e2eb]">
                  {selectedJob.minCgpa ?? 'N/A'} - {selectedJob.maxCgpa ?? 'N/A'}
                </p>
              </div>
              <div className="p-6 bg-[#111319] rounded-3xl border border-[rgba(255,255,255,0.06)] space-y-1">
                <div className="flex items-center gap-2 text-[10px] font-black text-[#908fa0] uppercase tracking-widest">
                  <Clock className="w-3.5 h-3.5 text-amber-500" /> Backlogs
                </div>
                <p className="text-xl font-black text-[#e2e2eb]">{selectedJob.maxBacklogs ?? 'No limit'}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#e2e2eb] uppercase tracking-[0.2em]">
                <Info className="w-4 h-4 text-blue-500" /> Job Description
              </div>
              <div className="p-8 bg-[#1e1f26] border border-[rgba(255,255,255,0.06)] rounded-[2.5rem] shadow-sm">
                <p className="text-[#c7c4d7] leading-relaxed font-medium whitespace-pre-line text-lg">
                  {selectedJob.description}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-xs font-black text-[#e2e2eb] uppercase tracking-[0.2em]">
                <Target className="w-4 h-4 text-indigo-500" /> Eligible Departments
              </div>
              <div className="flex flex-wrap gap-2">
                {(selectedJob.departments?.length ? selectedJob.departments : ['All Departments']).map((dept: string) => (
                  <span key={dept} className="px-5 py-2.5 bg-[#111319] text-[#c7c4d7] border border-[rgba(255,255,255,0.08)] rounded-2xl text-[10px] font-black uppercase tracking-widest">
                    {dept}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end pt-4">
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="px-10 py-4 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl active:scale-95"
              >
                Close Details
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default PlacementDriveManagement;