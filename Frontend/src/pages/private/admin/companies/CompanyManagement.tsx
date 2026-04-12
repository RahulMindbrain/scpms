import React, { useState, useMemo, useEffect } from 'react';
import {
  Building2,
  MapPin, Search, Plus, CheckCircle2,
  Mail, Trash2,
  XCircle,
  ExternalLink,
  Globe
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Button } from '@/components/ui/button.tsx';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal.tsx';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, fetchInactiveCompanies, activateCompanies } from '@/redux/thunks/companyThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';

interface Company {
  id: number;
  userId: number;
  name: string;
  sector: string;
  location: string;
  avgPackage: string;
  hiredCount: number;
  status: 'active' | 'upcoming' | 'completed' | 'inactive';
  approval: 'Approved' | 'Pending';
  logo?: string;
  email?: string;
}

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

  useEffect(() => {
    dispatch(fetchCompanies({}));
    dispatch(fetchInactiveCompanies({}));
  }, [dispatch]);

  const companies = useMemo<Company[]>(() => {
    const active = reduxCompanies.map((c: any): Company => ({
      id: c.id,
      userId: c.user?.id || c.userId,
      name: c.name || 'N/A',
      sector: 'Technology',
      location: 'Multiple',
      avgPackage: 'Competitive',
      hiredCount: 0,
      status: 'active',
      approval: 'Approved',
      logo: undefined,
      email: c.user?.email || 'N/A'
    }));

    const inactive = reduxInactiveCompanies.map((c: any): Company => ({
      id: c.id,
      userId: c.id, // Inactive list returns User records, so id is userId
      name: c.firstname || 'N/A', // Firstname is used as name for User records
      sector: 'Technology',
      location: 'Multiple',
      avgPackage: 'N/A',
      hiredCount: 0,
      status: 'inactive',
      approval: 'Pending',
      logo: undefined,
      email: c.email || 'N/A'
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

  const toggleApproval = async (id: number, userId: number, currentStatus: string) => {
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

  const deleteCompany = (id: number) => {
    toast.info("Integration for deleting companies is coming soon.");
  };

  if (loading && reduxCompanies.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <p className="text-rose-500 font-black uppercase tracking-widest">{error}</p>
        <Button onClick={() => dispatch(fetchCompanies({}))}>Retry</Button>
      </div>
    );
  }

  return (
    <div className=" space-y-8 animate-in mt-2 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative group flex-1 sm:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter by name..."
              className="w-full sm:w-72 pl-11 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all placeholder:text-slate-300"
            />
          </div>
          <Button
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center justify-center gap-2 py-7 px-8 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20"
          >
            <Plus className="w-5 h-5" /> Add Partner
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Partners" value={companies.length.toString()} subtext="+12 this season" icon={Building2} />
        <StatCard label="Approved Brands" value={companies.filter(c => c.approval === 'Approved').length.toString()} subtext="91% active" />
        <StatCard label="Pending Review" value={companies.filter(c => c.approval === 'Pending').length.toString()} subtext="Awaiting verification" />
        <StatCard label="Live Drives" value={companies.filter(c => c.status === 'active').length.toString()} subtext="Current ongoing" />
      </div>

      {/* Filters Area */}
      <div className="flex items-center gap-4">
        <div className="flex bg-white p-1.5 rounded-2xl border border-slate-100 shadow-sm">
          {['All', 'Active', 'Inactive', 'Upcoming', 'Completed'].map((opt) => (
            <button
              key={opt}
              onClick={() => setFilter(opt)}
              className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === opt ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/10' : 'text-slate-400 hover:text-slate-600'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredCompanies.map((company) => (
          <div key={company.id} className="bg-white p-8 rounded-[2.5rem] border border-slate-50 shadow-xl shadow-slate-200/20 hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-32 h-32 blur-3xl opacity-10 transition-opacity group-hover:opacity-20 ${company.approval === 'Approved' ? 'bg-blue-600' : 'bg-amber-600'}`}></div>

            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-white group-hover:border-blue-100 shadow-sm transition-all duration-300">
                  <Building2 className="w-8 h-8 text-slate-300 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{company.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{company.sector}</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button onClick={() => deleteCompany(company.id)} className="p-2 text-slate-200 hover:text-rose-500 transition-colors"><Trash2 size={16} /></button>
                <button className="p-2 text-slate-200 hover:text-blue-500 transition-colors"><ExternalLink size={16} /></button>
              </div>
            </div>

            <div className="space-y-4 mb-8 relative z-10">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-slate-300" />
                  <span className="text-xs font-bold text-slate-600 uppercase tracking-tight">{company.location}</span>
                </div>
                <Badge variant="outline" className="text-[9px] border-slate-200">Global Hub</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Success Rate</p>
                  <p className="text-sm font-black text-slate-800">{company.hiredCount} Placed</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100/50">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Package</p>
                  <p className="text-sm font-black text-emerald-600">{company.avgPackage}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between pt-6 border-t border-slate-50 relative z-10">
              <Badge variant={company.status === 'active' ? 'default' : company.status === 'completed' ? 'success' : 'secondary'} className="uppercase tracking-widest text-[9px] px-4 font-black">
                {company.status}
              </Badge>

              <button
                onClick={() => toggleApproval(company.id, company.userId, company.approval)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${company.approval === 'Approved'
                  ? 'bg-emerald-500 text-white shadow-xl shadow-emerald-200 hover:bg-emerald-600'
                  : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                  }`}
              >
                {company.approval === 'Approved' ? <><CheckCircle2 className="w-4 h-4" /> Approved</> : <><XCircle className="w-4 h-4" /> Pending Approval</>}
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Onboard New Partner"
        subtitle="Invite a new brand to join the recruitment ecosystem"
      >
        <form onSubmit={handleAddSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Entity</label>
              <input
                value={newCompany.name}
                onChange={(e) => setNewCompany({ ...newCompany, name: e.target.value })}
                required
                type="text"
                placeholder="Legal company name"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-sans"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Industry Sector</label>
              <input
                value={newCompany.sector}
                onChange={(e) => setNewCompany({ ...newCompany, sector: e.target.value })}
                type="text"
                placeholder="e.g. EdTech, FinTech"
                className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-sans"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Global Headquarters</label>
              <div className="relative">
                <Globe className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  value={newCompany.location}
                  onChange={(e) => setNewCompany({ ...newCompany, location: e.target.value })}
                  type="text"
                  placeholder="Primary location"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-sans"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Point of Contact (Email)</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input
                  value={newCompany.email}
                  onChange={(e) => setNewCompany({ ...newCompany, email: e.target.value })}
                  required
                  type="email"
                  placeholder="recruiting@brand.com"
                  className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-sans"
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Profile</label>
            <textarea
              value={newCompany.description}
              onChange={(e) => setNewCompany({ ...newCompany, description: e.target.value })}
              placeholder="Provide a brief overview of the company vision and culture..."
              rows={4}
              className="w-full px-5 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none font-sans"
            />
          </div>

          <div className="pt-4">
            <Button
              type="submit"
              className="w-full py-8 rounded-[2rem] bg-blue-600 text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-blue-500/20 hover:scale-[1.02] transition-transform"
            >
              Initialize Partnership
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CompanyManagement;
