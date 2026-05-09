import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Building2,
  Search,
  CheckCircle2,
  Mail,
  XCircle,
  ExternalLink,
  Briefcase,
  Users,
  LayoutGrid
} from 'lucide-react';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCompanies, activateCompanies, fetchJobsByCompanyId } from '@/redux/thunks/companyThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import Loader from '@/components/Loader';
import { AdminPageLayout } from '@/components/layout/AdminPageLayout';
import { PageHeader } from '@/components/PageHeader';

interface Company {
  id: number;
  userId: number;
  name: string;
  status: 'active' | 'upcoming' | 'completed' | 'inactive';
  approval: 'Approved' | 'Pending';
  logo?: string;
  email?: string;
  description?: string;
  createdAt?: string;
  userStatus?: string;
}

const CompanyManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies: reduxCompanies, loading, error } = useSelector((state: RootState) => state.company);

  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const { jobs: companyJobs } = useSelector((state: RootState) => state.company);
  const [jobsStatusFilter, setJobsStatusFilter] = useState('APPROVED');

  useEffect(() => {
    dispatch(fetchCompanies({}));
  }, [dispatch]);

  const companies = useMemo<Company[]>(() => {
    const mapCompany = (c: any): Company => {
      const userStatus = c.user?.status || 'UNKNOWN';

      return {
        id: c.id,
        userId: c.user?.id,
        name: c.name || 'N/A',
        status: userStatus === 'ACTIVE' ? 'active' : 'inactive',
        approval: userStatus === 'ACTIVE' ? 'Approved' : 'Pending',
        logo: undefined,
        email: c.user?.email || 'N/A',
        description: c.description || '',
        createdAt: c.createdAt,
        userStatus
      };
    };

    return reduxCompanies.map(mapCompany);
  }, [reduxCompanies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch = c.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === 'All' ||
        (filter === 'Active' && c.userStatus === 'ACTIVE') ||
        (filter === 'Inactive' && c.userStatus === 'INACTIVE');

      return matchesSearch && matchesFilter;
    });
  }, [companies, searchTerm, filter]);


  const toggleApproval = async (_id: number, userId: number, currentStatus: string) => {
    if (currentStatus === 'Pending') {
      try {
        await dispatch(activateCompanies([userId])).unwrap();
        toast.success("Company activated successfully!");
        dispatch(fetchCompanies({}));
      } catch (err: any) {
        toast.error(err || "Failed to activate company");
      }
    } else {
      toast.info("Deactivation is coming soon.");
    }
  };

  const handleViewJobs = (companyId: number) => {
    setSelectedCompanyId(companyId);
    setIsJobsModalOpen(true);
    dispatch(fetchJobsByCompanyId({ id: companyId, params: { page: 1, limit: 10, status: 'APPROVED' } }));
  };

  if (loading && reduxCompanies.length === 0) {
    return <Loader text="Loading partner network..." />;
  }

  if (error) {
    return (
      <AdminPageLayout>
        <div className="flex h-[400px] flex-col items-center justify-center space-y-4">
          <div className="p-4 bg-rose-500/10 rounded-full">
            <XCircle className="w-12 h-12 text-rose-500" />
          </div>
          <div className="text-center">
            <h3 className="text-lg font-bold text-foreground">Error Loading Data</h3>
            <p className="text-muted-foreground text-sm max-w-sm mx-auto">{error}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => dispatch(fetchCompanies({}))}
            className="rounded-xl border-border"
          >
            Retry Connection
          </Button>
        </div>
      </AdminPageLayout>
    );
  }

  return (
    <AdminPageLayout>
      <PageHeader
        title="Partner Network"
        description="Oversee corporate partnerships and monitor live recruitment activities."
        badge="Company Management"
        icon={Building2}
        variant="indigo"
      >
        <div className="relative w-full sm:w-[320px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search partners by name..."
            className="w-full pl-10 pr-4 h-11 bg-background/50 border border-border rounded-2xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all placeholder:text-muted-foreground/50 shadow-sm"
          />
        </div>
      </PageHeader>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Total Partners", value: companies.length, icon: Building2, color: "indigo" },
          { label: "Verified Brands", value: companies.filter(c => c.approval === 'Approved').length, icon: CheckCircle2, color: "emerald" },
          { label: "Pending Verification", value: companies.filter(c => c.approval === 'Pending').length, icon: Users, color: "amber" },
          { label: "Live Engagements", value: companies.filter(c => c.status === 'active').length, icon: Briefcase, color: "sky" },
        ].map((stat, idx) => (
          <div key={idx} className={`premium-stat-card stat-glow-${stat.color} group`}>
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl ${
                stat.color === 'indigo' ? 'bg-primary/10 text-primary' : 
                stat.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-500' :
                stat.color === 'amber' ? 'bg-amber-500/10 text-amber-500' :
                'bg-sky-500/10 text-sky-500'
              }`}>
                <stat.icon className="size-5" />
              </div>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{stat.label}</p>
            <h2 className="text-3xl font-black text-foreground mt-1 tracking-tight">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex bg-muted/20 p-1 rounded-2xl border border-border/50 w-full sm:w-auto overflow-x-auto no-scrollbar">
          {['All', 'Active', 'Inactive'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`flex-1 sm:flex-none px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap ${filter === opt
                ? 'bg-primary text-white shadow-lg shadow-primary/20'
                : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 text-muted-foreground text-[10px] font-black uppercase tracking-widest bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
          <LayoutGrid className="w-3.5 h-3.5" />
          <span>{filteredCompanies.length} entities found</span>
        </div>
      </div>

      {/* Grid of Companies */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        <AnimatePresence mode="popLayout">
          {filteredCompanies.map((company) => (
            <motion.div
              layout
              key={company.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="group saas-card overflow-hidden flex flex-col h-full"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-start gap-4 overflow-hidden">
                  <div className="shrink-0 w-14 h-14 bg-muted/50 rounded-2xl flex items-center justify-center border border-border group-hover:border-primary/30 transition-all duration-300">
                    <Building2 className="w-7 h-7 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors truncate pr-2 tracking-tight">
                      {company.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-[8px] font-black uppercase tracking-widest bg-muted/30 px-1.5 py-0">
                        {company.userStatus}
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <div className={`size-1.5 rounded-full ${company.status === 'active' ? 'bg-emerald-500 animate-pulse' : 'bg-muted-foreground'}`} />
                        <span className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">{company.status}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => handleViewJobs(company.id)}
                  className="shrink-0 p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all active:scale-90"
                  title="View Jobs"
                >
                  <ExternalLink size={18} />
                </button>
              </div>

              <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed min-h-[32px] mb-6">
                {company.description || "No corporate bio provided for this entity."}
              </p>

              <div className="p-4 bg-muted/10 rounded-2xl border border-border/50 mb-6 group-hover:bg-primary/5 transition-colors mt-auto">
                <div className="flex items-center gap-2 mb-1.5">
                  <Mail className="size-3 text-primary/60" />
                  <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Registry ID</p>
                </div>
                <p className="text-sm font-black text-foreground tracking-tight">
                  REG-{company.id.toString().padStart(4, '0')}
                </p>
              </div>

              <div className="flex items-center justify-between pt-5 border-t border-border mt-auto gap-4">
                <div className="flex flex-col">
                   <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest mb-0.5">Partnership</p>
                   <p className="text-[10px] font-bold text-foreground">{company.approval}</p>
                </div>

                {company.approval === 'Approved' ? (
                  <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-[9px] font-black uppercase tracking-widest shadow-sm">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                  </div>
                ) : (
                  <button
                    onClick={() => toggleApproval(company.id, company.userId, 'Pending')}
                    className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/10 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                  </button>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

 

      {/* Jobs Modal */}
      <Modal
        isOpen={isJobsModalOpen}
        onClose={() => setIsJobsModalOpen(false)}
        title="Directives Registry"
        subtitle="Internal log of job opportunities and campaign status"
      >
        <div className="space-y-6 pt-4">
          <div className="flex bg-muted/30 p-1 rounded-xl w-fit">
            {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
              <button
                key={status}
                onClick={() => {
                  setJobsStatusFilter(status);
                  if (selectedCompanyId) {
                    dispatch(fetchJobsByCompanyId({ id: selectedCompanyId, params: { page: 1, limit: 10, status } }));
                  }
                }}
                className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${jobsStatusFilter === status
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                  }`}
              >
                {status}
              </button>
            ))}
          </div>

          {loading ? (
            <Loader text="Retrieving job directives..." />
          ) : companyJobs.length > 0 ? (
            <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 custom-scrollbar">
              {companyJobs.map((job: any) => (
                <div key={job.id} className="p-5 bg-muted/10 rounded-2xl border border-border hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-foreground text-base tracking-tight">{job.title}</h4>
                      <p className="text-xs text-muted-foreground font-medium mt-1">ID: #{job.id} • {job.location || 'Remote'}</p>
                    </div>
                    <Badge variant="outline" className="text-[10px] font-black tracking-widest bg-muted/50">
                      {job.status}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Compensation</p>
                      <p className="text-sm font-bold text-emerald-500">₹{job.salary} LPA</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest mb-1">Eligibility</p>
                      <p className="text-sm font-bold text-foreground">{job.minCgpa} CGPA</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/20 rounded-3xl border border-dashed border-border">
              <LayoutGrid className="size-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="font-bold text-foreground">No directives found</p>
              <p className="text-xs text-muted-foreground mt-1">No jobs match the current status filter.</p>
            </div>
          )}
        </div>
      </Modal>
    </AdminPageLayout>
  );
};

export default CompanyManagement;
