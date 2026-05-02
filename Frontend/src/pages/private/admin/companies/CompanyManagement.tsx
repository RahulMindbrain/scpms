import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  Search,
  CheckCircle2,
  Mail,
  // Trash2,
  XCircle,
  ExternalLink,
  Globe,
  Briefcase,
  Users,
  LayoutGrid
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCompanies, fetchInactiveCompanies, activateCompanies, fetchJobsByCompanyId } from '@/redux/thunks/companyThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';

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

import Loader from '@/components/Loader';

const CompanyManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies: reduxCompanies, inactiveCompanies: reduxInactiveCompanies, loading, error } = useSelector((state: RootState) => state.company);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [newCompany, setNewCompany] = useState({
    name: '',
    sector: '',
    location: '',
    email: '',
    description: ''
  });

  const [selectedCompanyId, setSelectedCompanyId] = useState<number | null>(null);
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const { jobs: companyJobs, meta: jobsMeta } = useSelector((state: RootState) => state.company);
  const [jobsStatusFilter, setJobsStatusFilter] = useState('APPROVED');

  useEffect(() => {
    dispatch(fetchCompanies({}));
    dispatch(fetchInactiveCompanies({}));
  }, [dispatch]);

  const companies = useMemo<Company[]>(() => {
    const active = reduxCompanies.map((c: any): Company => ({
      id: c.id,
      userId: c.user?.id,
      name: c.name || 'N/A',
      status: 'active',
      approval: 'Approved',
      logo: undefined,
      email: c.user?.email || 'N/A',
      description: c.description || '',
      createdAt: c.createdAt,
      userStatus: c.user?.status
    }));

    const inactive = reduxInactiveCompanies.map((c: any): Company => ({
      id: c.id,
      userId: c.id,
      name: c.firstname || 'N/A',
      status: 'inactive',
      approval: 'Pending',
      logo: undefined,
      email: c.email || 'N/A',
      description: '',
      createdAt: c.createdAt,
      userStatus: c.status
    }));

    return [...active, ...inactive];
  }, [reduxCompanies, reduxInactiveCompanies]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'All' || c.status.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [companies, searchTerm, filter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.info("Integration for adding companies is coming soon.");
    setIsAddModalOpen(false);
    setNewCompany({ name: '', sector: '', location: '', email: '', description: '' });
  };

  const toggleApproval = async (_id: number, userId: number, currentStatus: string) => {
    if (currentStatus === 'Pending') {
      try {
        await dispatch(activateCompanies([userId])).unwrap();
        toast.success("Company activated successfully!");
        dispatch(fetchCompanies({}));
        dispatch(fetchInactiveCompanies({}));
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

  // const deleteCompany = (_id: number) => {
  //   toast.info("Integration for deleting companies is coming soon.");
  // };

  if (loading && reduxCompanies.length === 0) {
    return <Loader text="Loading partner network..." />;
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 flex flex-col items-center justify-center space-y-4">
        <div className="p-4 bg-rose-50 rounded-full">
          <XCircle className="w-12 h-12 text-rose-500" />
        </div>
        <div className="text-center">
          <h3 className="text-lg font-bold text-slate-900">Error Loading Data</h3>
          <p className="text-slate-500 text-sm max-w-sm mx-auto">{error}</p>
        </div>
        <Button
          variant="outline"
          onClick={() => dispatch(fetchCompanies({}))}
          className="rounded-xl border-slate-200"
        >
          Retry Connection
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 pb-12">
      <div className="max-w-7xl mx-auto px-6 pt-8 space-y-8 ">
        {/* Modern Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">Companies Dashboard</h1>
            <p className="text-slate-500 text-sm font-medium">Manage and monitor corporate relations and placement health.</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative group w-full sm:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-slate-400 group-focus-within:text-indigo-600 transition-colors duration-300" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by company name..."
                className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-[1.25rem] text-sm font-medium placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all duration-300 shadow-sm shadow-slate-200/50"
              />
            </div>
          </div>
        </div>

        {/* Improved Stats KPI Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            label="Total Partners"
            value={companies.length.toString()}
            subtext="+12% YoY"
            icon={Building2}
            className="hover:border-indigo-100 transition-colors"
          />
          <StatCard
            label="Verified Brands"
            value={companies.filter(c => c.approval === 'Approved').length.toString()}
            subtext="91% active"
            icon={CheckCircle2}
            className="hover:border-emerald-100 transition-colors"
          />
          <StatCard
            label="Verification Pending"
            value={companies.filter(c => c.approval === 'Pending').length.toString()}
            subtext="Action required"
            icon={Users}
            className="hover:border-amber-100 transition-colors"
          />
          <StatCard
            label="Live Engagements"
            value={companies.filter(c => c.status === 'active').length.toString()}
            subtext="Open drives"
            icon={Briefcase}
            className="hover:border-blue-100 transition-colors"
          />
        </div>

        {/* Pill-style Segmented Filter Controls */}
        <div className="flex items-center justify-between">
          <div className="flex bg-white/70 backdrop-blur-md p-1.5 rounded-2xl border border-slate-200/60 shadow-sm overflow-x-auto scrollbar-hide">
            {['All', 'Active', 'Inactive'].map((opt) => (
              <button
                key={opt}
                onClick={() => setFilter(opt)}
                className={`shrink-0 px-6 py-2.5 rounded-[0.85rem] text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${filter === opt
                    ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/10'
                    : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
              >
                {opt}
              </button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-2 text-slate-400 text-xs font-bold">
            <LayoutGrid className="w-4 h-4" />
            <span className="uppercase tracking-widest">Showing {filteredCompanies.length} entities</span>
          </div>
        </div>

        {/* Redesigned Company Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredCompanies.map((company) => (
              <motion.div
                layout
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                className="group relative bg-white/80 backdrop-blur-sm p-6 rounded-[2rem] border border-slate-200/60 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1.5 transition-all duration-500 overflow-hidden"
              >
                {/* Visual Accent Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full -mr-16 -mt-16 group-hover:bg-indigo-500/10 transition-colors duration-500"></div>

                {/* Header Information */}
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 bg-linear-to-br from-slate-50 to-slate-100 rounded-2xl flex items-center justify-center border border-slate-200 group-hover:border-indigo-200 transition-all duration-300 shadow-sm">
                      <Building2 className="w-7 h-7 text-slate-400 group-hover:text-indigo-600 transition-colors duration-300" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-900 transition-colors truncate max-w-[150px]">
                        {company.name}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-[9px] py-0 h-5 px-2 bg-slate-50 border-slate-200 text-slate-500 font-bold uppercase tracking-widest">
                          {company.userStatus || 'UNKNOWN'}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleViewJobs(company.id)}
                      className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
                      title="View Jobs"
                    >
                      <ExternalLink size={18} />
                    </button>
                    {/* <button
                      onClick={() => deleteCompany(company.id)}
                      className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"
                      title="Delete Partner"
                    >
                      <Trash2 size={18} />
                    </button> */}
                  </div>
                </div>

                {/* Body Content */}
                <div className="space-y-4 mb-6">
                  {company.description ? (
                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed h-8">
                      {company.description}
                    </p>
                  ) : (
                    <div className="h-8 flex items-center">
                      <p className="text-[10px] text-slate-400 italic">No description provided</p>
                    </div>
                  )}

                  <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm group-hover:border-indigo-100 transition-colors">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full"></div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Registered</p>
                    </div>
                    <p className="text-sm font-black text-slate-800">
                      {company.createdAt
                        ? new Date(company.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                {/* Footer Controls */}
                <div className="flex items-center justify-between pt-5 border-t border-slate-100/60">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${company.status === 'active' ? 'bg-emerald-500' : 'bg-slate-300'}`}></div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      {company.status}
                    </span>
                  </div>

                  {company.approval === 'Approved' ? (
                    <div className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest bg-emerald-50 text-emerald-600 border border-emerald-100">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => toggleApproval(company.id, company.userId, 'Pending')}
                        className="px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border border-emerald-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm shadow-emerald-500/5 active:scale-95"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" /> Accept
                      </button>
                      <button
                        onClick={() => toast.info("Rejection feature coming soon")}
                        className="px-4 py-2 bg-rose-50 text-rose-600 hover:bg-rose-100 border border-rose-100 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-1.5 shadow-sm shadow-rose-500/5 active:scale-95"
                      >
                        <XCircle className="w-3.5 h-3.5" /> Reject
                      </button>
                    </div>
                  )}
                </div>

                {/* Hover Action Layer */}
                <div className="absolute inset-0 bg-indigo-600/0 group-hover:bg-indigo-600/0 pointer-events-none transition-colors duration-500">
                  <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    {/* Add a subtle visual hint if needed */}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Modal: Redesigned Add Company */}
        <Modal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          title="Onboard Partner"
          subtitle="Register a new corporate entity into the recruitment ecosystem"
        >
          <form onSubmit={handleAddSubmit} className="space-y-6 pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Legal Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={newCompany.name}
                    onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                    required
                    type="text"
                    placeholder="Enter official entity name"
                    className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry Sector</label>
                <input
                  value={newCompany.sector}
                  onChange={(e) => setNewCompany({ ...newCompany, sector: e.target.value })}
                  type="text"
                  placeholder="e.g. Technology, Finance"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Primary Base</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={newCompany.location}
                    onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                    type="text"
                    placeholder="Headquarters location"
                    className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">HR Point Email</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    value={newCompany.email}
                    onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                    required
                    type="email"
                    placeholder="recruitment@brand.com"
                    className="w-full pl-11 pr-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Bio</label>
              <textarea
                value={newCompany.description}
                onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
                placeholder="Share a brief overview of the company values and culture..."
                rows={3}
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 transition-all resize-none"
              />
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full py-7 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-indigo-600/20 active:scale-95 transition-all"
              >
                Onboard Entity
              </Button>
            </div>
          </form>
        </Modal>

        {/* Jobs Modal: Redesigned */}
        <Modal
          isOpen={isJobsModalOpen}
          onClose={() => setIsJobsModalOpen(false)}
          title="Company Directives"
          subtitle="Internal registry of job opportunities and campaign status"
        >
          <div className="space-y-6 pt-4">
            <div className="flex items-center gap-2 mb-4 p-1 bg-slate-100 rounded-xl w-fit">
              {['PENDING', 'APPROVED', 'REJECTED'].map((status) => (
                <button
                  key={status}
                  onClick={() => {
                    setJobsStatusFilter(status);
                    if (selectedCompanyId) {
                      dispatch(fetchJobsByCompanyId({ id: selectedCompanyId, params: { page: 1, limit: 10, status } }));
                    }
                  }}
                  className={`px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${jobsStatusFilter === status
                      ? 'bg-white text-slate-900 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {status}
                </button>
              ))}
            </div>

            {loading ? (
              <Loader text="Retrieving job directives..." />
            ) : companyJobs.length > 0 ? (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-200">
                {companyJobs.map((job: any) => (
                  <div key={job.id} className="p-5 bg-white rounded-2xl border border-slate-100 hover:border-indigo-200 transition-all shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-bold text-slate-900 text-base">{job.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-slate-500 font-medium">{job.location || 'N/A'}</span>
                          <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
                          <span className="text-xs text-slate-400 font-medium">Job #{job.id}</span>
                        </div>
                      </div>
                      <Badge variant={job.status === 'APPROVED' ? 'success' : job.status === 'REJECTED' ? 'destructive' : 'secondary'} className="text-[10px] font-black tracking-widest">
                        {job.status}
                      </Badge>
                    </div>

                    {job.description ? (
                      <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 mb-4">
                        {job.description}
                      </p>
                    ) : (
                      <p className="text-xs text-slate-400 italic mb-4">No description provided</p>
                    )}

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-4 border-t border-slate-50">
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Salary (LPA)</p>
                        <p className="text-xs font-bold text-emerald-600">₹{job.salary ?? 'N/A'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">CGPA</p>
                        <p className="text-xs font-bold text-slate-700">
                          {job.minCgpa ?? 'N/A'} - {job.maxCgpa ?? 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Departments</p>
                        <p className="text-xs font-bold text-slate-700 truncate">
                          {job.eligibleDepartments?.length
                            ? job.eligibleDepartments.map((dep: any) => dep.name).join(', ')
                            : 'N/A'}
                        </p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Posted On</p>
                        <p className="text-xs font-bold text-slate-700">
                          {job.createdAt
                            ? new Date(job.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                            : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}

                {jobsMeta && jobsMeta.totalPages > 1 && (
                  <div className="flex items-center justify-between mt-4 px-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Page {jobsMeta.page} of {jobsMeta.totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        disabled={jobsMeta.page === 1}
                        onClick={() => dispatch(fetchJobsByCompanyId({ id: selectedCompanyId!, params: { page: jobsMeta.page - 1, limit: 10, status: jobsStatusFilter } }))}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg border border-slate-200"
                      >
                        ←
                      </Button>
                      <Button
                        disabled={jobsMeta.page === jobsMeta.totalPages}
                        onClick={() => dispatch(fetchJobsByCompanyId({ id: selectedCompanyId!, params: { page: jobsMeta.page + 1, limit: 10, status: jobsStatusFilter } }))}
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 rounded-lg border border-slate-200"
                      >
                        →
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <div className="inline-flex p-4 bg-white rounded-full shadow-sm mb-4">
                  <LayoutGrid className="w-6 h-6 text-slate-300" />
                </div>
                <p className="text-sm font-bold text-slate-600">No campaigns active</p>
                <p className="text-xs text-slate-400 mt-1">No jobs match the current status filter.</p>
              </div>
            )}
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default CompanyManagement;
