import React, { useEffect, useState, useMemo } from 'react';
import {
  Briefcase,
  Building2,
  MapPin,
  IndianRupee,
  Search,
  Clock,
  Filter,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs } from '@/redux/thunks/driveThunk';
import { fetchCompanies } from '@/redux/thunks/companyThunk';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
  const [filterLocation, _setFilterLocation] = useState<string>('all');
  const [filterCompany, setFilterCompany] = useState<string>('all');

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

        <div className="flex flex-wrap items-center gap-3">
          <Select value={filterCompany} onValueChange={setFilterCompany}>
            <SelectTrigger className="w-[160px] h-11 rounded-2xl bg-background/50 border-border text-xs font-bold uppercase tracking-widest">
              <Building2 className="size-3.5 mr-2 text-muted-foreground" />
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl">
              <SelectItem value="all">All Companies</SelectItem>
              {reduxCompanies.map((c: any) => (
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

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredAndSortedJobs.map((row) => (
            <motion.div
              key={row.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group bg-card hover:bg-card/80 border border-border hover:border-primary/20 rounded-[2.5rem] p-8 transition-all duration-500 shadow-sm hover:shadow-2xl hover:shadow-primary/5 flex flex-col"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="size-14 bg-primary/10 rounded-2xl flex items-center justify-center text-primary font-black text-xl">
                  {row.job?.title?.[0] || 'J'}
                </div>
                <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-black text-[10px] uppercase tracking-[0.2em] px-3 py-1">
                  Active
                </Badge>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {row.job?.title}
                </h3>
                <p className="text-sm font-semibold text-muted-foreground mt-1 flex items-center gap-2">
                  <Building2 size={14} className="text-primary/60" />
                  {(row as any).displayCompany?.name || 'Unknown Company'}
                </p>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground">
                  <MapPin size={14} />
                  {row.job?.location || 'Remote'}
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-emerald-600">
                  <IndianRupee size={14} />
                  {row.salary > 100000 ? (row.salary / 100000).toFixed(1) : row.salary} LPA
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-auto">
                {(row.job?.eligibleDepartments || []).slice(0, 2).map((d: any) => (
                  <Badge key={d.id} variant="secondary" className="text-[9px] font-black uppercase tracking-widest bg-muted/50">
                    {d.name || `Dept #${d.id}`}
                  </Badge>
                ))}
              </div>

              <div className="pt-6 border-t border-border mt-6 flex justify-between items-center text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                <span className="flex items-center gap-1.5">
                  <Clock size={12} />
                  Approved {new Date(row.approvedAt).toLocaleDateString()}
                </span>
                <span className="text-primary/60">
                  {row.openings} Openings
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
    </AdminPageLayout>
  );
};

export default UniversityJobs;
