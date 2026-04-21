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
import { Checkbox } from '@/components/ui/checkbox';
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
import { Skeleton } from '@/components/ui/skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';

const AdminJobManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading } = useSelector((state: RootState) => state.drive);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLocation, setFilterLocation] = useState<string>('all');

  useEffect(() => {
    dispatch(fetchJobs({ status: activeTab }));
  }, [dispatch, activeTab]);

  const handleStatusUpdate = async (jobIds: number[], status: string) => {
    try {
      await dispatch(updateJobStatus({ jobIds, status })).unwrap();
      toast.success(`Job(s) ${status.toLowerCase()} successfully`);
      dispatch(fetchJobs({ status: activeTab }));
      setSelectedJobIds([]);
    } catch (error: any) {
      toast.error(error || "Failed to update job status");
    }
  };

  const toggleSelectJob = (id: number) => {
    setSelectedJobIds(prev =>
      prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
    );
  };

  const filteredAndSortedJobs = useMemo(() => {
    let result = (Array.isArray(jobs) ? jobs : []).filter(job =>
      job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType !== 'all') {
      result = result.filter(job => job.jobType?.toLowerCase() === filterType.toLowerCase());
    }

    if (filterLocation !== 'all') {
      result = result.filter(job => job.location?.toLowerCase().includes(filterLocation.toLowerCase()));
    }

    // Sorting logic
    result = [...result].sort((a, b) => {
      if (sortBy === 'newest') return b.id - a.id;
      if (sortBy === 'oldest') return a.id - b.id;
      if (sortBy === 'salary-high') {
        const salaryA = parseInt(a.salary?.replace(/[^0-9]/g, '') || '0');
        const salaryB = parseInt(b.salary?.replace(/[^0-9]/g, '') || '0');
        return salaryB - salaryA;
      }
      return 0;
    });

    return result;
  }, [jobs, searchTerm, sortBy, filterType, filterLocation]);

  const locations = useMemo(() => {
    const locs = new Set((Array.isArray(jobs) ? jobs : []).map(j => j.location).filter(Boolean));
    return Array.from(locs);
  }, [jobs]);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">

        {/* Top Header Section */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Jobs</h1>
            <p className="text-slate-500 mt-1">Manage and moderate job listings across the platform.</p>
          </div>
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
            <Input
              placeholder="Search by title, company..."
              className="pl-11 h-12 bg-white border-slate-200 rounded-2xl shadow-sm focus-visible:ring-indigo-500/10 focus-visible:border-indigo-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </header>

        {/* Filters & Tabs Bar */}
        <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-slate-200/60 rounded-3xl p-3 shadow-sm flex flex-col lg:flex-row items-center justify-between gap-4">
          <div className="flex p-1 bg-slate-100/80 rounded-2xl w-full lg:w-auto">
            {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`relative flex-1 lg:flex-none px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${activeTab === tab
                    ? 'bg-white text-indigo-600 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700'
                  }`}
              >
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {tab === 'PENDING' && <Clock className="w-4 h-4" />}
                  {tab === 'APPROVED' && <CheckCircle className="w-4 h-4" />}
                  {tab === 'REJECTED' && <XCircle className="w-4 h-4" />}
                  {tab.charAt(0) + tab.slice(1).toLowerCase()}
                </span>
                {activeTab === tab && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-white rounded-xl shadow-sm"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] h-10 rounded-xl bg-white border-slate-200">
                <ArrowUpDown className="w-3.5 h-3.5 mr-2 text-slate-400" />
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="salary-high">Highest Salary</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-[140px] h-10 rounded-xl bg-white border-slate-200">
                <Filter className="w-3.5 h-3.5 mr-2 text-slate-400" />
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="full-time">Full-time</SelectItem>
                <SelectItem value="part-time">Part-time</SelectItem>
                <SelectItem value="internship">Internship</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterLocation} onValueChange={setFilterLocation}>
              <SelectTrigger className="w-[140px] h-10 rounded-xl bg-white border-slate-200">
                <MapPin className="w-3.5 h-3.5 mr-2 text-slate-400" />
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

        {/* Batch Actions Bar */}
        <AnimatePresence>
          {selectedJobIds.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-6 min-w-[400px]"
            >
              <span className="text-sm font-medium">
                {selectedJobIds.length} items selected
              </span>
              <div className="h-4 w-px bg-slate-700" />
              <div className="flex items-center gap-3">
                {activeTab !== 'APPROVED' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-emerald-400 hover:text-emerald-300 hover:bg-emerald-400/10 rounded-xl"
                    onClick={() => handleStatusUpdate(selectedJobIds, 'APPROVED')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" /> Approve
                  </Button>
                )}
                {activeTab !== 'REJECTED' && (
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-rose-400 hover:text-rose-300 hover:bg-rose-400/10 rounded-xl"
                    onClick={() => handleStatusUpdate(selectedJobIds, 'REJECTED')}
                  >
                    <XCircle className="w-4 h-4 mr-2" /> Reject
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  className="text-slate-400 hover:text-white rounded-xl"
                  onClick={() => setSelectedJobIds([])}
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode='popLayout'>
            {loading ? (
              Array(6).fill(0).map((_, i) => <JobCardSkeleton key={i} />)
            ) : filteredAndSortedJobs.length > 0 ? (
              filteredAndSortedJobs.map((job) => (
                <JobCard
                  key={job.id}
                  job={job}
                  isSelected={selectedJobIds.includes(job.id)}
                  onSelect={() => toggleSelectJob(job.id)}
                  onStatusUpdate={handleStatusUpdate}
                  activeTab={activeTab}
                />
              ))
            ) : (
              <EmptyState onReset={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterLocation('all');
              }} />
            )}
          </AnimatePresence>
        </div>

        {/* Pagination Placeholder */}
        {!loading && filteredAndSortedJobs.length > 0 && (
          <div className="flex items-center justify-between pt-8 border-t border-slate-200">
            <p className="text-sm text-slate-500">
              Showing <span className="font-medium text-slate-900">{filteredAndSortedJobs.length}</span> results
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="rounded-xl h-9 w-9 p-0" disabled>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl h-9 w-9 p-0 bg-white border-indigo-200 text-indigo-600">
                1
              </Button>
              <Button variant="outline" size="sm" className="rounded-xl h-9 w-9 p-0 hover:bg-white" disabled>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const JobCard = ({ job, isSelected, onSelect, onStatusUpdate, activeTab }: any) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className={`group relative bg-white rounded-[20px] border p-5 transition-all duration-300 ${isSelected
          ? 'border-indigo-500 ring-4 ring-indigo-500/5 shadow-lg'
          : 'border-slate-200 hover:shadow-xl hover:shadow-slate-200/50'
        }`}
    >
      {/* Top Controls */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
          className="rounded-md border-slate-300 data-[state=checked]:bg-indigo-600 data-[state=checked]:border-indigo-600"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical className="w-4 h-4 text-slate-400" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="rounded-xl">
            <DropdownMenuItem className="text-sm cursor-pointer">Edit Listing</DropdownMenuItem>
            <DropdownMenuItem className="text-sm cursor-pointer text-rose-600">Delete Job</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-4">
        {/* Company & Title */}
        <div className="flex items-start gap-4 pr-10">
          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-indigo-600 shrink-0">
            {job.company?.logo ? (
              <img src={job.company.logo} alt={job.company.name} className="w-8 h-8 object-contain" />
            ) : (
              <Building2 className="w-6 h-6" />
            )}
          </div>
          <div className="min-w-0">
            <h3 className="text-base font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors truncate">
              {job.title}
            </h3>
            <p className="text-sm text-slate-500 font-medium truncate">{job.company?.name}</p>
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex flex-wrap items-center gap-y-2 gap-x-4">
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            {job.location || 'Remote'}
          </div>
          <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg">
            <DollarSign className="w-3.5 h-3.5" />
            {job.salary}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-slate-600 leading-relaxed line-clamp-2 min-h-[40px]">
          {job.description || 'Join our team as a professional developer and help us build the next generation of software products.'}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">
            {job.jobType || 'Full-time'}
          </Badge>
          <Badge variant="secondary" className="bg-slate-100 text-slate-600 border-none font-semibold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md">
            {job.experience || 'Entry-level'}
          </Badge>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 flex items-center gap-3 border-t border-slate-100">
          {activeTab === 'PENDING' ? (
            <>
              <Button
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-10 shadow-sm"
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
    </motion.div>
  );
};

const JobCardSkeleton = () => (
  <div className="bg-white rounded-[20px] border border-slate-200 p-5 space-y-4">
    <div className="flex items-start gap-4">
      <Skeleton className="w-12 h-12 rounded-xl" />
      <div className="space-y-2 flex-1">
        <Skeleton className="h-5 w-3/4 rounded-md" />
        <Skeleton className="h-4 w-1/2 rounded-md" />
      </div>
    </div>
    <div className="flex gap-4">
      <Skeleton className="h-4 w-24 rounded-md" />
      <Skeleton className="h-4 w-24 rounded-md" />
    </div>
    <div className="space-y-2">
      <Skeleton className="h-4 w-full rounded-md" />
      <Skeleton className="h-4 w-5/6 rounded-md" />
    </div>
    <div className="flex gap-2">
      <Skeleton className="h-6 w-16 rounded-md" />
      <Skeleton className="h-6 w-16 rounded-md" />
    </div>
    <div className="pt-4 border-t border-slate-50 gap-3 flex">
      <Skeleton className="h-10 flex-1 rounded-xl" />
      <Skeleton className="h-10 flex-1 rounded-xl" />
    </div>
  </div>
);

const EmptyState = ({ onReset }: { onReset: () => void }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="col-span-full py-20 flex flex-col items-center justify-center bg-white rounded-[32px] border border-dashed border-slate-200 text-center px-6"
  >
    <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
      <Briefcase className="w-10 h-10 text-indigo-200" />
    </div>
    <h3 className="text-xl font-bold text-slate-900 mb-2">No jobs found</h3>
    <p className="text-slate-500 max-w-xs mb-8">
      We couldn't find any job listings matching your current criteria. Try adjusting your filters.
    </p>
    <Button
      variant="outline"
      onClick={onReset}
      className="rounded-xl px-8 border-slate-200"
    >
      Clear all filters
    </Button>
  </motion.div>
);

export default AdminJobManagement;
