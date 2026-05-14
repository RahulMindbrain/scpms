import React, { useEffect, useState, useMemo } from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Search,
  Clock,
  Filter,
  Eye,
  FileText,
  Target,
  Building,
  UserCheck,
  ExternalLink
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/redux/thunks/driveThunk';
import { fetchCompanies } from '@/redux/thunks/companyThunk';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import Loader from '@/components/Loader';
import { AdminPageLayout } from '@/components/layout/AdminPageLayout';
import { PageHeader } from '@/components/PageHeader';
import { motion, AnimatePresence } from 'framer-motion';

const UniversityJobs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading } = useSelector((state: RootState) => state.drive);
  const { companies: reduxCompanies } = useSelector((state: RootState) => state.company);
  const [page, _setPage] = useState();
  const PAGE_LIMIT = 10;
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, _setSortBy] = useState<string>('newest');
  const [filterDepartment, setFilterDepartment] = useState<string>('all');
  const [filterCompany, setFilterCompany] = useState<string>('all');

  // Modal State
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const handleShowDetails = (job: any) => {
    setSelectedJob(job);
    setIsDetailsModalOpen(true);
  };

  useEffect(() => {
    dispatch(fetchCompanies({ limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    const params: any = { status: 'APPROVED', page, limit: PAGE_LIMIT };
    if (filterCompany !== 'all') {
      params.companyId = Number(filterCompany);
    }
    dispatch(fetchJobs(params));
  }, [dispatch, page, filterCompany]);

  const departments = useMemo(() => {
    const allDepartments = (Array.isArray(jobs) ? jobs : []).flatMap((j) =>
      Array.isArray(j.job?.eligibleDepartments) ? j.job.eligibleDepartments : [],
    );
    const names = allDepartments.map((dept: any) => dept?.name || `Dept #${dept.id}`).filter(Boolean);
    return Array.from(new Set(names));
  }, [jobs]);

  const locations = useMemo(() => {
    const allLocations = (Array.isArray(jobs) ? jobs : []).map((j) => j.job?.location).filter(Boolean);
    return Array.from(new Set(allLocations));
  }, [jobs]);

  const filteredAndSortedJobs = useMemo(() => {
    let result = (Array.isArray(jobs) ? jobs : []).filter((row) => {
      const j = row.job;
      const title = j?.title ?? "";
      const uniName = row.university?.name ?? "";
      
      const companyId = j?.companyId ?? row.companyId;
      const foundCompany = reduxCompanies.find(c => c.id === companyId);
      const companyName = j?.company?.name ?? foundCompany?.name ?? "";
      
      return (
        title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        uniName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        companyName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });

    if (filterDepartment !== 'all') {
      result = result.filter((row) =>
        (Array.isArray(row.job?.eligibleDepartments) ? row.job.eligibleDepartments : []).some(
          (dept: any) =>
            (dept?.name?.toLowerCase() === filterDepartment.toLowerCase()) || 
            (dept?.id?.toString() === filterDepartment)
        ),
      );
    }

    if (filterLocation !== 'all') {
      result = result.filter((row) =>
        (row.job?.location ?? "").toLowerCase().includes(filterLocation.toLowerCase())
      );
    }

    return [...result].map(row => {
      const companyId = row.job?.companyId ?? row.companyId;
      const foundCompany = reduxCompanies.find(c => c.id === companyId);
      return {
        ...row,
        displayCompany: row.job?.company || foundCompany
      };
    }).sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.sentAt || b.id).getTime() - new Date(a.sentAt || a.id).getTime();
      if (sortBy === 'oldest') return new Date(a.sentAt || a.id).getTime() - new Date(b.sentAt || b.id).getTime();
      return 0;
    });
  }, [jobs, searchTerm, sortBy, filterDepartment, filterLocation, reduxCompanies]);

  if (loading && jobs.length === 0) return <Loader text="Loading university jobs..." fullScreen />;

  return (
    <AdminPageLayout>
      <PageHeader
        title="University Jobs"
        description="View all approved job opportunities for your institution"
        icon={Briefcase}
        variant="blue"
      />

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-card/50 backdrop-blur-md p-6 rounded-3xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by title or company..."
            className="pl-11 h-11 bg-background/50 border-border rounded-2xl text-sm font-medium focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

                <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={filterDepartment} onValueChange={setFilterDepartment}>
            <SelectTrigger className="w-[160px] h-11 rounded-2xl bg-background/50 border-border text-xs font-bold uppercase tracking-widest">
              <Filter className="size-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Dept" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Depts</SelectItem>
              {departments.map(d => (
                <SelectItem key={d} value={d}>{d}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence>
          {filteredAndSortedJobs.map((row) => (
            <motion.div
              key={row.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-white hover:bg-slate-50/50 border border-slate-100 hover:border-primary/20 rounded-[2rem] p-6 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5 flex flex-col cursor-pointer"
              onClick={() => handleShowDetails(row)}
            >
              <div className="flex justify-between items-start mb-6">
                <div className="size-14 bg-primary/5 rounded-2xl flex items-center justify-center text-primary font-black text-xl border border-primary/10">
                  {row.job?.title?.[0] || 'J'}
                </div>
                <Badge variant="outline" className="bg-emerald-500/5 text-emerald-600 border-emerald-500/10 font-black text-[9px] uppercase tracking-[0.2em] px-3 py-1.5 rounded-lg">
                  Active
                </Badge>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-black text-slate-900 group-hover:text-primary transition-colors line-clamp-1 tracking-tight leading-tight">
                  {row.job?.title}
                </h3>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                  <Building2 size={11} className="text-primary/60" />
                  {(row as any).displayCompany?.name || 'Unknown Company'}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2.5 mb-6">
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100/50 text-[9px] font-bold text-slate-500 uppercase tracking-wider">
                  <MapPin size={12} className="text-slate-400" />
                  <span className="truncate">{row.job?.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-emerald-50 border border-emerald-100/50 text-[9px] font-bold text-emerald-600 uppercase tracking-wider">
                  <IndianRupee size={12} />
                  <span className="truncate">{(row.salary / 100000).toFixed(1)} LPA</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mt-auto">
                {(row.job?.eligibleDepartments || []).slice(0, 2).map((d: any) => (
                  <Badge key={d.id} variant="secondary" className="text-[8px] font-bold uppercase tracking-widest bg-slate-100 text-slate-400 px-2 py-1 rounded-lg border-transparent">
                    {d.name || `Dept #${d.id}`}
                  </Badge>
                ))}
                {(row.job?.eligibleDepartments || []).length > 2 && (
                   <Badge variant="secondary" className="text-[8px] font-bold uppercase tracking-widest bg-slate-50 text-slate-300 px-2 py-1 rounded-lg border-transparent">
                     +{(row.job?.eligibleDepartments || []).length - 2}
                   </Badge>
                )}
              </div>

              <div className="pt-5 border-t border-slate-100 mt-6 flex justify-between items-center text-[9px] font-black text-slate-300 uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Clock size={11} className="text-slate-200" />
                  {new Date(row.approvedAt).toLocaleDateString()}
                </span>
                <span className="bg-primary/5 text-primary/60 px-2.5 py-1 rounded-md text-[8px]">
                  {row.openings} Open
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredAndSortedJobs.length === 0 && !loading && (
        <div className="text-center py-20 bg-card/30 rounded-[3rem] border border-dashed border-border mt-8">
          <Briefcase className="size-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-foreground truncate px-4">No approved jobs found</h3>
          <p className="text-muted-foreground text-sm mt-2">Try adjusting your filters or search terms.</p>
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
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 bg-slate-900 rounded-[2.5rem] relative overflow-hidden text-white text-left">
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
                <Badge className="px-4 py-1.5 rounded-xl font-black text-[10px] uppercase tracking-[0.2em] bg-emerald-500 text-white">
                  {selectedJob.status}
                </Badge>
                <span className="text-[10px] font-bold text-white/40 uppercase tracking-widest">Job ID: #{selectedJob.id}</span>
              </div>
            </div>

            {/* Core Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-left">
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
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 text-left">
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

                <div className="p-6 rounded-[2rem] bg-primary/[0.03] border border-primary/10 space-y-4 text-center">
                  <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Listing Status</h4>
                  <div className="py-4">
                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Approved on</p>
                     <p className="text-xs font-black text-slate-900 mt-1">
                        {selectedJob.approvedAt || selectedJob.updatedAt || selectedJob.sentAt 
                          ? new Date(selectedJob.approvedAt || selectedJob.updatedAt || selectedJob.sentAt).toLocaleDateString() 
                          : 'N/A'}
                     </p>
                  </div>
                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-2xl h-12 font-black uppercase tracking-widest text-[10px]"
                    onClick={() => setIsDetailsModalOpen(false)}
                  >
                    Close Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </AdminPageLayout>
  );
};

export default UniversityJobs;
