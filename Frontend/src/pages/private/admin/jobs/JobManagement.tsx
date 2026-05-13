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
  ListChecks
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, updateJobStatus } from '@/redux/thunks/driveThunk';
import { fetchCompanies } from '@/redux/thunks/companyThunk';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
      <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pb-6 border-b border-border">
        <div className="flex bg-muted/30 p-1 rounded-2xl border border-border w-full lg:w-auto overflow-x-auto scrollbar-hide">
          {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => {
            const config = STATUS_STYLES[tab];
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${isActive
                  ? `bg-${config.color}-500/10 text-${config.color}-600 border border-${config.color}-500/20 shadow-sm`
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                  }`}
              >
                <config.icon className={`size-3.5 ${isActive ? `text-${config.color}-600` : 'text-muted-foreground'}`} />
                {tab}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl bg-background/50 border-border text-xs font-bold uppercase tracking-widest">
              <ArrowUpDown className="size-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="salary-high">Salary: High</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl bg-background/50 border-border text-xs font-bold uppercase tracking-widest">
              <Filter className="size-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Department" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Depts</SelectItem>
              {departments.map((dept) => (
                <SelectItem key={dept} value={dept}>{dept}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterLocation} onValueChange={setFilterLocation}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl bg-background/50 border-border text-xs font-bold uppercase tracking-widest">
              <MapPin className="size-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Location" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Locations</SelectItem>
              {locations.map(loc => (
                <SelectItem key={loc} value={loc || 'Remote'}>{loc || 'Remote'}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-[160px] h-10 rounded-xl bg-background/50 border-border text-xs font-bold uppercase tracking-widest">
              <Building2 className="size-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Companies</SelectItem>
              {reduxCompanies.map((company: any) => (
                <SelectItem key={company.id} value={company.id.toString()}>{company.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                className="group saas-card overflow-hidden h-full flex flex-col"
              >
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center border border-border group-hover:border-primary/30 transition-all duration-300 shadow-sm overflow-hidden">
                      {(row as any).displayCompany?.logo ? (
                        <img src={(row as any).displayCompany.logo} alt={(row as any).displayCompany.name} className="w-10 h-10 object-contain" />
                      ) : (
                        <Building2 className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                      )}
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate tracking-tight pr-4">
                        {row.job?.title ?? '—'}
                      </h3>
                      <p className="text-sm text-muted-foreground font-medium truncate">{row.university?.name}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="size-8 rounded-full">
                        <MoreVertical className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl border-border">
                      <DropdownMenuItem className="text-xs font-bold uppercase tracking-widest text-rose-500 cursor-pointer">
                        Delete Record
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>

                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/50 border border-border text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                      <MapPin className="size-3 text-muted-foreground" />
                      {row.job?.location || 'Remote'}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                      <IndianRupee className="size-3" />
                      {row.salary > 100000 ? (row.salary / 100000).toFixed(1) : row.salary} LPA
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-[10px] font-black text-blue-600 uppercase tracking-widest">
                      <Clock className="size-3" />
                      Sent {new Date(row.sentAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[10px] font-black text-amber-600 uppercase tracking-widest">
                      <Briefcase className="size-3" />
                      {row.openings} Openings
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 mb-6">
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Min. CGPA</p>
                      <p className="text-xs font-bold text-foreground">{row.minCgpa}</p>
                    </div>
                    <div className="p-3 bg-muted/20 rounded-xl border border-border/50">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Max Backlogs</p>
                      <p className="text-xs font-bold text-foreground">{row.maxBacklogs}</p>
                    </div>
                  </div>

                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 min-h-[40px] mb-6">
                  {row.description || "No specific job description provided for this listing."}
                </p>

                  <div className="flex flex-wrap gap-2 mb-6 mt-auto">
                    {(Array.isArray(row.job?.eligibleDepartments) ? row.job.eligibleDepartments : []).slice(0, 3).map((dept: { id: number; name?: string }) => (
                      <Badge
                        key={dept.id}
                        variant="outline"
                        className="bg-muted/30 border-border font-black text-[9px] uppercase tracking-widest"
                      >
                        {dept.name || `Dept #${dept.id}`}
                      </Badge>
                    ))}
                    {(row.job?.eligibleDepartments?.length ?? 0) > 3 && (
                      <Badge variant="outline" className="bg-muted/30 border-border font-black text-[9px] uppercase tracking-widest">
                        +{(row.job?.eligibleDepartments?.length ?? 0) - 3}
                      </Badge>
                    )}
                  </div>

                <div className="pt-5 border-t border-border mt-auto">
                  {activeTab === 'PENDING' ? (
                    <div className="flex items-center gap-3">
                      <Button
                        className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl h-10 font-black uppercase tracking-widest text-[10px] shadow-lg shadow-emerald-500/10 active:scale-95 transition-all"
                        onClick={() => handleStatusUpdate([row.id], 'APPROVED')}
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
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full border-border hover:bg-primary/5 hover:text-primary rounded-xl h-10 font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 group/btn active:scale-[0.98] transition-all"
                    >
                      Details
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
    </AdminPageLayout>
  );
};

export default AdminJobManagement;
