import React, { useEffect, useState, useMemo } from 'react';
import {
  Briefcase,
  Building2,
  CheckCircle,
  XCircle,
  MapPin,
  DollarSign,
  Search,
  Clock,
  ExternalLink,
  Filter,
  ArrowUpDown,
  MoreVertical,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, updateJobStatus } from '@/redux/thunks/driveThunk';
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

const STATUS_STYLES = {
  PENDING: {
    tabActive: 'bg-amber-50 text-amber-700 shadow-sm ring-1 ring-amber-200',
    tabInactive: 'text-amber-700/70 hover:text-amber-700 hover:bg-amber-50/70',
    icon: 'text-amber-600',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
  },
  APPROVED: {
    tabActive: 'bg-emerald-50 text-emerald-700 shadow-sm ring-1 ring-emerald-200',
    tabInactive: 'text-emerald-700/70 hover:text-emerald-700 hover:bg-emerald-50/70',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  },
  REJECTED: {
    tabActive: 'bg-rose-50 text-rose-700 shadow-sm ring-1 ring-rose-200',
    tabInactive: 'text-rose-700/70 hover:text-rose-700 hover:bg-rose-50/70',
    icon: 'text-rose-600',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
  },
} as const;

const AdminJobManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, meta, loading } = useSelector((state: RootState) => state.drive);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [page, setPage] = useState(1);
  const PAGE_LIMIT = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchJobs({ status: activeTab, page, limit: PAGE_LIMIT }));
  }, [dispatch, activeTab, page]);

  useEffect(() => {
    setPage(1);
  }, [activeTab]);

  const handleStatusUpdate = async (jobIds: number[], status: string) => {
    try {
      await dispatch(updateJobStatus({ jobIds, status })).unwrap();
      toast.success(`Job(s) ${status.toLowerCase()} successfully`);
      dispatch(fetchJobs({ status: activeTab, page, limit: PAGE_LIMIT }));
    } catch (error: any) {
      toast.error(error || "Failed to update job status");
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

    let result = (Array.isArray(jobs) ? jobs : []).filter(job =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterDepartment !== 'all') {
      result = result.filter(job =>
        (Array.isArray(job.eligibleDepartments) ? job.eligibleDepartments : []).some(
          (dept: any) => dept?.name?.toLowerCase() === filterDepartment.toLowerCase()
        )
      );
    }

    if (filterLocation !== 'all') {
      result = result.filter(job => job.location?.toLowerCase().includes(filterLocation.toLowerCase()));
    }

    // Sorting logic
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'salary-high') {
        const salaryA = getSalaryValue(a.salary);
        const salaryB = getSalaryValue(b.salary);
        return salaryB - salaryA;
      }
      return 0;
    });

    return result;
  }, [jobs, searchTerm, sortBy, filterDepartment, filterLocation]);

  const locations = useMemo(() => {
    const locs = new Set((Array.isArray(jobs) ? jobs : []).map(j => j.location).filter(Boolean));
    return Array.from(locs);
  }, [jobs]);

  const departments = useMemo(() => {
    const allDepartments = (Array.isArray(jobs) ? jobs : []).flatMap(j =>
      Array.isArray(j.eligibleDepartments) ? j.eligibleDepartments : []
    );
    const names = allDepartments.map((dept: any) => dept?.name).filter(Boolean);
    return Array.from(new Set(names));
  }, [jobs]);

  return (
    <div className="min-h-screen bg-[#111319] pb-12">
      <div className="px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Top Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-[#e2e2eb] tracking-tight">Jobs</h1>
            <p className="text-[#908fa0] mt-1">Manage and moderate job listings across the platform.</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#908fa0] group-focus-within:text-indigo-600 transition-colors" />
            <Input
              placeholder="Search by title, company..."
              className="pl-11 h-12 bg-[#1e1f26] border-[rgba(255,255,255,0.08)] rounded-2xl shadow-sm focus-visible:ring-indigo-500/10 focus-visible:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Filters & Tabs Bar */}
        <div className="sticky top-4 z-40 bg-[#1e1f26]/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-3 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex p-1 bg-slate-100/80 rounded-2xl w-full lg:w-auto">
            {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab
                  ? STATUS_STYLES[tab].tabActive
                  : STATUS_STYLES[tab].tabInactive
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {tab === 'PENDING' && <Clock className={`w-4 h-4 ${STATUS_STYLES.PENDING.icon}`} />}
                  {tab === 'APPROVED' && <CheckCircle className={`w-4 h-4 ${STATUS_STYLES.APPROVED.icon}`} />}
                  {tab === 'REJECTED' && <XCircle className={`w-4 h-4 ${STATUS_STYLES.REJECTED.icon}`} />}
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-10 rounded-xl bg-[#1e1f26] border-[rgba(255,255,255,0.08)]">
                <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-[#908fa0]" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterDepartment} onValueChange={setFilterDepartment}>
              <SelectTrigger className="w-[140px] h-10 rounded-xl bg-[#1e1f26] border-[rgba(255,255,255,0.08)]">
                <Filter className="w-3.5 h-3.5 mr-2 text-[#908fa0]" />
                <SelectValue placeholder="Department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((department) => (
                  <SelectItem key={department} value={department}>
                    {department}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-[140px] h-10 rounded-xl bg-[#1e1f26] border-[rgba(255,255,255,0.08)]">
                <MapPin className="w-3.5 h-3.5 mr-2 text-[#908fa0]" />
                <SelectValue placeholder="Location" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Locations</SelectItem>
                {locations.map(loc => (
                  <SelectItem key={loc} value={loc || 'Remote'}>{loc || 'Remote'}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full py-20">
              <Loader text="Retrieving job listings..." />
            </div>
          ) : filteredAndSortedJobs.length > 0 ? (
            filteredAndSortedJobs.map((job) => (
              <JobCard
                key={job.id}
                job={job}
                onStatusUpdate={handleStatusUpdate}
                activeTab={activeTab}
              />
            ))
          ) : (
            <EmptyState onReset={() => {
              setSearchTerm('');
              setFilterDepartment('all');
              setFilterLocation('all');
            }} />
          )}
        </div>

        {/* Pagination */}
        {!loading && filteredAndSortedJobs.length > 0 && (
          <div className="flex items-center justify-between pt-8 border-t border-[rgba(255,255,255,0.08)]">
            <p className="text-sm text-[#908fa0]">
              Showing <span className="font-medium text-[#e2e2eb]">{filteredAndSortedJobs.length}</span> of{' '}
              <span className="font-medium text-[#e2e2eb]">{meta?.total ?? filteredAndSortedJobs.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-9 w-9 p-0"
                disabled={(meta?.page ?? page) <= 1}
                onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl h-9 w-9 p-0 bg-[#1e1f26] border-indigo-200 text-indigo-600">
                {meta?.page ?? page}
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="rounded-xl h-9 w-9 p-0 hover:bg-[#1e1f26]"
                disabled={(meta?.page ?? page) >= (meta?.totalPages ?? page)}
                onClick={() => setPage(prev => {
                  const totalPages = meta?.totalPages ?? prev;
                  return Math.min(prev + 1, totalPages);
                })}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const JobCard = ({ job, onStatusUpdate, activeTab }: any) => {
  return (
    <div
      className="group relative bg-[#1e1f26] rounded-[20px] border p-5 transition-all duration-300 border-[rgba(255,255,255,0.08)] hover:shadow-xl hover:shadow-slate-200/50"
    >
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4 text-[#908fa0]" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem className="text-sm cursor-pointer text-rose-600">Delete Job</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between pr-10">
          <Badge
            variant="outline"
            className={`text-[11px] font-bold tracking-wide px-2.5 py-1 rounded-md border ${(job.status && STATUS_STYLES[job.status as keyof typeof STATUS_STYLES]?.badge) || 'bg-slate-100 text-[#c7c4d7] border-[rgba(255,255,255,0.08)]'}`}
          >
            {job.status || 'UNKNOWN'}
          </Badge>
        </div>

        {/* Company & Title */}
        <div className="flex items-start gap-4 pr-10">
          <div className="w-12 h-12 rounded-xl bg-[#111319] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-indigo-600 shrink-0">
            {job.company?.logo ? (
              <img src={job.company.logo} alt={job.company.name} className="w-8 h-8 object-contain" />
            ) : (
              <Building2 className="w-6 h-6" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-[#e2e2eb] leading-tight group-hover:text-indigo-600 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-sm text-[#908fa0] font-medium truncate">{job.company?.name}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-[#908fa0]">
            <MapPin className="w-3.5 h-3.5 text-[#908fa0]" />
            {job.location || '-'}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
            <DollarSign className="w-3.5 h-3.5" />
            {job.salary}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-[#c7c4d7] leading-relaxed line-clamp-2 min-h-[40px]">
          {job.description || '-'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          {(Array.isArray(job.eligibleDepartments) ? job.eligibleDepartments : []).slice(0, 2).map((dept: any) => (
            <Badge
              key={dept.id}
              variant="secondary"
              className="bg-slate-100 text-[#c7c4d7] border-none font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md"
            >
              {dept.name}
            </Badge>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center gap-3 border-t border-[rgba(255,255,255,0.06)]">
          {activeTab === 'PENDING' ? (
            <>
              <Button
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-10 shadow-sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate([job.id], 'APPROVED');
                }}
              >
                <CheckCircle className="w-4 h-4 mr-2" /> Approve
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-rose-100 text-rose-600 hover:bg-rose-50 rounded-xl h-10"
                onClick={(e) => {
                  e.stopPropagation();
                  onStatusUpdate([job.id], 'REJECTED');
                }}
              >
                <XCircle className="w-4 h-4 mr-2" /> Reject
              </Button>
            </>
          ) : (
            <Button
              className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-xl h-10 shadow-sm flex items-center justify-center gap-2 group/btn"
              onClick={(e) => e.stopPropagation()}
            >
              View Details
              <ExternalLink className="w-4 h-4 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};


const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <div className="col-span-full py-20 flex flex-col items-center justify-center bg-[#1e1f26] rounded-[32px] border border-dashed border-[rgba(255,255,255,0.08)] text-center px-6">
    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
      <Briefcase className="w-10 h-10 text-indigo-200" />
    </div>
    <h3 className="text-xl font-bold text-[#e2e2eb] mb-2">No jobs found</h3>
    <p className="text-[#908fa0] max-w-xs mb-8">
      We couldn't find any job listings matching your current criteria. Try adjusting your filters.
    </p>
    <Button
      variant="outline"
      onClick={onReset}
      className="rounded-xl px-8 border-[rgba(255,255,255,0.08)]"
    >
      Clear all filters
    </Button>
  </div>
);

export default AdminJobManagement;
