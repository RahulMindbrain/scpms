import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Briefcase,
  Building2,
  CheckCircle,
  XCircle,
  MapPin,
  IndianRupee,
  Search,
  Clock,
  ExternalLink,
  Filter,
  ArrowUpDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ListChecks,
  Eye,
  Building,
  Target,
  FileText,
  UserCheck
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, updateJobStatus } from '@/redux/thunks/driveThunk';
import { fetchCompanies } from '@/redux/thunks/companyThunk';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import Loader from '@/components/Loader';
import { AdminPageLayout } from '@/components/layout/AdminPageLayout';
import { PageHeader } from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';

const STATUS_STYLES = {
  PENDING: {
    color: 'amber',
    icon: Clock,
  },
  APPROVED: {
    color: 'emerald',
    icon: CheckCircle2,
  },
  REJECTED: {
    color: 'rose',
    icon: XCircle,
  },
} as const;

const AdminJobManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, meta, loading } = useSelector((state: RootState) => state.drive);
  const { companies: reduxCompanies } = useSelector((state: RootState) => state.company);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [page, setPage] = useState(1);
  const PAGE_LIMIT = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');
  const [searchParams] = useSearchParams();
  const initialCompany = searchParams.get('companyId') || 'all';
  const [filterCompany, setFilterCompany] = useState<string>(initialCompany);

  // Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleShowDetails = (job: any) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchCompanies({ limit: 100 })); // Fetch companies for filter
  }, [dispatch]);

  useEffect(() => {
    const params: any = { status: activeTab, page, limit: PAGE_LIMIT };
    if (filterCompany !== 'all') {
      params.companyId = Number(filterCompany);
    }
    dispatch(fetchJobs(params));
  }, [dispatch, activeTab, page, filterCompany]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleStatusUpdate = async (jobUniversityIds: number[], status: string) => {
    const toastId = toast.loading(`Processing ${status.toLowerCase()}...`);
    try {
      let reason: string | undefined;
      if (status === "REJECTED") {
        reason =
          window.prompt("Rejection reason (required):")?.trim() || undefined;
        if (!reason) {
          toast.error("Rejection reason is required", { id: toastId });
          return;
        }
      }
      await dispatch(
        updateJobStatus({ jobIds: jobUniversityIds, status, reason }),
      ).unwrap();
      toast.success(`Job(s) ${status.toLowerCase()} successfully`, { id: toastId });
      dispatch(fetchJobs({ status: activeTab, page, limit: PAGE_LIMIT }));
    } catch (error: any) {
      toast.error(error || "Failed to update job status", { id: toastId });
    }
  };

  const filteredAndSortedJobs = useMemo(() => {
    const getSalaryValue = (salary: unknown): number => {
      if (typeof salary === 'number') return salary;
      if (typeof salary === 'string') {
        const parsed = parseInt((salary.match(/\d+/g) || []).join(''), 10);
        return Number.isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    };

    let result = (Array.isArray(jobs) ? jobs : []).filter((row) => {
      const title = row.job?.title ?? "";
      const uniName = row.university?.name ?? "";
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uniName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (filterDepartment !== 'all') {
      result = result.filter((row) =>
        (Array.isArray(row.job?.eligibleDepartments) ? row.job.eligibleDepartments : []).some(
          (dept: { id: number; name?: string }) =>
            (dept?.name?.toLowerCase() === filterDepartment.toLowerCase()) || 
            (dept?.id?.toString() === filterDepartment)
        ),
      );
    }

    if (filterLocation !== 'all') {
      result = result.filter((row) =>
        (row.job?.location ?? "")
          .toLowerCase()
          .includes(filterLocation.toLowerCase()),
      );
    }

    result = [...result].map(row => {
      const companyId = row.job?.companyId ?? row.companyId;
      const foundCompany = reduxCompanies.find(c => c.id === companyId);
      return {
        ...row,
        displayCompany: row.job?.company || foundCompany
      };
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.sentAt || b.id).getTime() - new Date(a.sentAt || a.id).getTime();
      if (sortBy === 'oldest') return new Date(a.sentAt || a.id).getTime() - new Date(b.sentAt || b.id).getTime();
      if (sortBy === 'salary-high') {
        const salaryA = getSalaryValue(a.salary);
        const salaryB = getSalaryValue(b.salary);
        return salaryB - salaryA;
      }
      return 0;
    });

    return result;
  }, [jobs, searchTerm, sortBy, filterDepartment, filterLocation, reduxCompanies]);

  const locations = useMemo(() => {
    const locs = new Set(
      (Array.isArray(jobs) ? jobs : [])
        .map((j) => j.job?.location)
        .filter(Boolean),
    );
    return Array.from(locs);
  }, [jobs]);

  const departments = useMemo(() => {
    const allDepartments = (Array.isArray(jobs) ? jobs : []).flatMap((j) =>
      Array.isArray(j.job?.eligibleDepartments) ? j.job.eligibleDepartments : [],
    );
    const names = allDepartments.map((dept: { id: number; name?: string }) => dept?.name || `Dept #${dept.id}`).filter(Boolean);
    return Array.from(new Set(names));
  }, [jobs]);

  return (
    <AdminPageLayout>
      <PageHeader
        title="Job Moderation"
        description="Review and manage job listings submitted by corporate partners."
        badge="Recruitment Ops"
        icon={ListChecks}
        variant="sky"
      >
        <div className="relative w-full sm:w-[280px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search listings..."
            className="pl-9 bg-background/50 border-border rounded-xl h-10 text-sm focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </PageHeader>

      {/* Tabs & Filters Bar */}
      <div className="flex flex-col xl:flex-row items-center justify-between gap-6 pb-8">
        <div className="flex bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/50 w-full xl:w-auto overflow-x-auto scrollbar-hide shadow-inner">
          {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => {
            const config = STATUS_STYLES[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${isActive
                  ? `bg-white text-${config.color}-600 shadow-md shadow-slate-200/50 border border-slate-200`
                  : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                  }`}
              >
                <config.icon className={`size-3.5 ${isActive ? `text-${config.color}-500` : 'text-slate-300'}`} />
                {tab}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full xl:w-auto">
          <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-50 rounded-2xl border border-slate-200/50 shadow-sm w-full xl:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="flex-1 sm:w-[130px] h-9 rounded-xl bg-white border-slate-200 shadow-sm text-[9px] font-black uppercase tracking-widest hover:border-primary/30 transition-all">
                <ArrowUpDown className="size-3 mr-2 text-slate-400" />
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="newest" className="text-[10px] font-bold uppercase tracking-widest">Newest First</SelectItem>
                <SelectItem value="oldest" className="text-[10px] font-bold uppercase tracking-widest">Oldest First</SelectItem>
                <SelectItem value="salary-high" className="text-[10px] font-bold uppercase tracking-widest">Salary: High</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="flex-1 sm:w-[130px] h-9 rounded-xl bg-white border-slate-200 shadow-sm text-[9px] font-black uppercase tracking-widest hover:border-primary/30 transition-all">
                <Filter className="size-3 mr-2 text-slate-400" />
                <SelectValue placeholder="Dept" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest">All Depts</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept} className="text-[10px] font-bold uppercase tracking-widest">{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="flex-1 sm:w-[130px] h-9 rounded-xl bg-white border-slate-200 shadow-sm text-[9px] font-black uppercase tracking-widest hover:border-primary/30 transition-all">
                <MapPin className="size-3 mr-2 text-slate-400" />
                <SelectValue placeholder="Loc" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest">All Locations</SelectItem>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc || 'Remote'} className="text-[10px] font-bold uppercase tracking-widest">{loc || 'Remote'}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterCompany} onValueChange={setFilterCompany}>
              <SelectTrigger className="flex-1 sm:w-[130px] h-9 rounded-xl bg-white border-slate-200 shadow-sm text-[9px] font-black uppercase tracking-widest hover:border-primary/30 transition-all">
                <Building2 className="size-3 mr-2 text-slate-400" />
                <SelectValue placeholder="Brand" />
              </SelectTrigger>
              <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                <SelectItem value="all" className="text-[10px] font-bold uppercase tracking-widest">All Brands</SelectItem>
                {reduxCompanies.map((company: any) => (
                  <SelectItem key={company.id} value={company.id.toString()} className="text-[10px] font-bold uppercase tracking-widest">{company.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {loading ? (
          <div className="col-span-full py-32 flex justify-center">
            <Loader text="Retrieving job listings..." />
          </div>
        ) : filteredAndSortedJobs.length > 0 ? (
          <AnimatePresence mode="popLayout">
            {filteredAndSortedJobs.map((row) => (
              <motion.div
                layout
                key={row.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="group saas-card overflow-hidden h-full flex flex-col p-6 bg-white"
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:border-primary/20 transition-all duration-300 shadow-sm overflow-hidden shrink-0">
                      {(row as any).displayCompany?.logo ? (
                        <img src={(row as any).displayCompany.logo} alt={(row as any).displayCompany.name} className="w-8 h-8 object-contain" />
                      ) : (
                        <Building2 className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors truncate tracking-tight leading-tight">
                        {row.job?.title ?? '—'}
                      </h3>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 truncate">{row.university?.name}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-xl hover:bg-slate-100">
                        <MoreVertical className="size-4 text-slate-300" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-slate-100 shadow-xl">
                      <DropdownMenuItem className="text-[10px] font-black uppercase tracking-widest text-rose-500 cursor-pointer p-2.5">
                        Delete Record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                <div className="grid grid-cols-2 gap-2.5 mb-5">
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50/80 border border-slate-100/50 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                    <MapPin className="size-3 text-primary/50 shrink-0" />
                    <span className="truncate">{row.job?.location || 'Remote'}</span>
                  </div>
                  <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50/80 border border-emerald-100/50 text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                    <IndianRupee className="size-3 shrink-0" />
                    <span className="truncate">{(row.salary / 100000).toFixed(1)} LPA</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-5">
                  <div className="p-3 bg-slate-900 rounded-2xl text-white">
                    <p className="text-[8px] font-black text-white/30 uppercase tracking-widest mb-0.5">Min. CGPA</p>
                    <p className="text-xs font-black tracking-tight">{row.minCgpa}</p>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                    <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest mb-0.5">Backlogs</p>
                    <p className="text-xs font-black text-slate-800 tracking-tight">{row.maxBacklogs}</p>
                  </div>
                </div>

                <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-1 mb-5 font-medium px-1">
                  {row.description || "No specific job description provided."}
                </p>

                <div className="flex flex-wrap gap-1.5 mb-6 mt-auto">
                  {(Array.isArray(row.job?.eligibleDepartments) ? row.job.eligibleDepartments : []).slice(0, 2).map((dept: any) => (
                    <Badge
                      key={dept.id}
                      variant="outline"
                      className="bg-white border-slate-100 text-slate-400 font-bold text-[8px] uppercase tracking-widest px-2 py-1 rounded-lg"
                    >
                      {dept.name || `Dept #${dept.id}`}
                    </Badge>
                  ))}
                  {(row.job?.eligibleDepartments?.length ?? 0) > 2 && (
                    <Badge variant="outline" className="bg-slate-50 border-slate-100 text-slate-300 font-bold text-[8px] uppercase tracking-widest px-2 py-1 rounded-lg">
                      +{(row.job?.eligibleDepartments?.length ?? 0) - 2}
                    </Badge>
                  )}
                </div>

                <div className="flex gap-2">
                  {row.status === 'PENDING' ? (
                    <>
                      <Button 
                        className="flex-1 bg-slate-900 hover:bg-primary text-white rounded-xl h-10 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-slate-900/10"
                        onClick={() => handleShowDetails(row)}
                      >
                          <CheckCircle className="size-3.5 mr-1.5" /> Approve
                        </Button>
                        <Button
                          variant="outline"
                          className="flex-1 border-rose-500/20 text-rose-600 hover:bg-rose-500/10 rounded-xl h-10 font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all"
                          onClick={() => handleStatusUpdate([row.id], 'REJECTED')}
                        >
                          <XCircle className="size-3.5 mr-1.5" /> Reject
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={() => handleShowDetails(row)}
                      className="w-full border-border hover:bg-primary/5 hover:text-primary rounded-xl h-10 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group/btn active:scale-[0.98] transition-all"
                    >
                      View Details
                      <ExternalLink className="size-3.5 transition-transform group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5" />
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        ) : (
          <div className="col-span-full py-32 flex flex-col items-center justify-center saas-card border-dashed bg-muted/10 text-center">
            <div className="size-20 bg-muted/30 rounded-[2.5rem] flex items-center justify-center mb-6">
              <Briefcase className="size-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No listings found</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-8">
              We couldn't find any job listings matching your current criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchTerm('');
                setFilterDepartment('all');
                setFilterLocation('all');
                setFilterCompany('all');
              }}
              className="rounded-xl px-8 border-border font-bold text-xs uppercase tracking-widest h-11"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && filteredAndSortedJobs.length > 0 && (
        <div className="flex items-center justify-between pt-12">
          <p className="text-xs font-black text-muted-foreground uppercase tracking-widest">
            Showing <span className="text-foreground">{filteredAndSortedJobs.length}</span> of{' '}
            <span className="text-foreground">{meta?.total ?? filteredAndSortedJobs.length}</span> listings
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              className="rounded-xl size-10 p-0 border-border"
              disabled={(meta?.page ?? page) <= 1}
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <div className="flex items-center justify-center size-10 rounded-xl bg-primary text-white font-black text-xs shadow-lg shadow-primary/20">
              {meta?.page ?? page}
            </div>
            <Button
              variant="outline"
              className="rounded-xl size-10 p-0 border-border"
              disabled={(meta?.page ?? page) >= (meta?.totalPages ?? 1)}
              onClick={() => setPage(prev => Math.min(prev + 1, meta?.totalPages ?? prev))}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
      {/* Job Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => setIsDetailsModalOpen(false)}
        title="Job Specification Details"
        subtitle="Comprehensive breakdown of the job opportunity and institutional requirements"
        maxWidth="max-w-4xl"
      >
        {selectedJob && (
          <div className="space-y-10 py-4">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden text-white">
              <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                <Briefcase size={120} />
              </div>
              <div className="flex items-center gap-6 relative z-10">
                <div className="size-20 bg-white/10 rounded-3xl flex items-center justify-center border border-white/20 backdrop-blur-xl">
                   {selectedJob.displayCompany?.logo ? (
                     <img src={selectedJob.displayCompany.logo} alt="" className="size-14 object-contain" />
                   ) : (
                     <Building2 className="size-10 text-white/60" />
                   )}
                </div>
                <div>
                   <h2 className="text-2xl font-black tracking-tight">{selectedJob.job?.title}</h2>
                   <p className="text-primary font-bold uppercase tracking-widest text-xs mt-1">
                     {selectedJob.displayCompany?.name} • {selectedJob.university?.name}
                   </p>
                </div>
              </div>
              <div className="flex flex-col items-end gap-2 relative z-10">
                <Badge className={cn(
                  "px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em]",
                  selectedJob.status === 'APPROVED' ? "bg-emerald-500 text-white" : 
                  selectedJob.status === 'PENDING' ? "bg-amber-500 text-white" : "bg-rose-500 text-white"
                )}>
                  {selectedJob.status}
                </Badge>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Job ID: #{selectedJob.id}</span>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: MapPin, label: "Location", value: selectedJob.job?.location || 'Remote', color: 'slate' },
                { icon: IndianRupee, label: "Salary Package", value: `${(selectedJob.salary/100000).toFixed(1)} LPA`, color: 'emerald' },
                { icon: UserCheck, label: "Min. CGPA", value: selectedJob.minCgpa, color: 'blue' },
                { icon: Clock, label: "Max Backlogs", value: selectedJob.maxBacklogs, color: 'amber' }
              ].map((item, idx) => (
                <div key={idx} className="p-5 rounded-3xl border border-slate-100 bg-slate-50/50 flex flex-col gap-3">
                  <div className={`size-10 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-${item.color}-600 shadow-sm`}>
                    <item.icon size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                    <p className="text-sm font-black text-slate-900 mt-0.5">{item.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Main Content Sections */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <FileText size={16} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Description</h4>
                  </div>
                  <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100 text-slate-600 text-sm leading-relaxed font-medium">
                    {selectedJob.job?.description || selectedJob.description || "No job description provided."}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <Target size={16} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Skills & Expertise</h4>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(selectedJob.job?.skills || []).map((skill: any) => (
                      <Badge key={skill.id} className="bg-white border-slate-200 text-slate-600 px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
                      <Building size={16} />
                    </div>
                    <h4 className="text-sm font-black text-slate-900 uppercase tracking-widest">Target Depts</h4>
                  </div>
                  <div className="space-y-2">
                    {(selectedJob.job?.eligibleDepartments || selectedJob.eligibleDepartments || []).map((dept: any, idx: number) => {
                      const deptName = typeof dept === 'string' ? dept : (dept?.name || `Dept #${dept?.id || idx}`);
                      return (
                        <div key={dept?.id || idx} className="p-3 bg-white border border-slate-100 rounded-2xl flex items-center justify-between shadow-sm">
                          <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{deptName}</span>
                          <div className="size-1.5 rounded-full bg-emerald-500" />
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="p-6 rounded-[2rem] bg-primary/[0.03] border border-primary/10 space-y-4">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em] text-center">Institutional Action</h4>
                  {selectedJob.status === 'PENDING' ? (
                    <div className="flex flex-col gap-3">
                       <Button 
                         className="w-full bg-emerald-500 hover:bg-emerald-600 text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]"
                         onClick={() => {
                           handleStatusUpdate([selectedJob.id], 'APPROVED');
                           setIsDetailsModalOpen(false);
                         }}
                       >
                         Approve Role
                       </Button>
                       <Button 
                         variant="outline" 
                         className="w-full border-rose-500/20 text-rose-600 hover:bg-rose-500/10 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]"
                         onClick={() => {
                           handleStatusUpdate([selectedJob.id], 'REJECTED');
                           setIsDetailsModalOpen(false);
                         }}
                       >
                         Decline Role
                       </Button>
                    </div>
                  ) : (
                      <div className="text-center py-4">
                         <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status Finalized on</p>
                         <p className="text-xs font-black text-slate-900 mt-1">
                           {selectedJob.updatedAt || selectedJob.approvedAt || selectedJob.sentAt 
                             ? new Date(selectedJob.updatedAt || selectedJob.approvedAt || selectedJob.sentAt).toLocaleDateString() 
                             : 'N/A'}
                         </p>
                      </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminPageLayout>
  );
};

export default AdminJobManagement;
