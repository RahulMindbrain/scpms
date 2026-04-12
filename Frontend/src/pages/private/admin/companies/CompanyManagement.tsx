import React, { useState, useMemo } from 'react';
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

interface Company {
  id: number;
  name: string;
  sector: string;
  location: string;
  avgPackage: string;
  hiredCount: number;
  status: 'active' | 'upcoming' | 'completed';
  approval: 'Approved' | 'Pending';
  logo?: string;
  email?: string;
}

const CompanyManagement: React.FC = () => {
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

  const [companies, setCompanies] = useState<Company[]>([
    { id: 1, name: 'Google', sector: 'Technology', location: 'Bangalore', avgPackage: '₹24 LPA', hiredCount: 12, status: 'active', approval: 'Approved' },
    { id: 2, name: 'Microsoft', sector: 'Technology', location: 'Hyderabad', avgPackage: '₹20 LPA', hiredCount: 8, status: 'active', approval: 'Approved' },
    { id: 3, name: 'Amazon', sector: 'E-Commerce', location: 'Bangalore', avgPackage: '₹18 LPA', hiredCount: 15, status: 'completed', approval: 'Approved' },
    { id: 4, name: 'Infosys', sector: 'IT Services', location: 'Pune', avgPackage: '₹6 LPA', hiredCount: 45, status: 'upcoming', approval: 'Approved' },
    { id: 5, name: 'TCS', sector: 'IT Services', location: 'Mumbai', avgPackage: '₹5.5 LPA', hiredCount: 60, status: 'upcoming', approval: 'Pending' },
    { id: 6, name: 'Wipro', sector: 'IT Services', location: 'Bangalore', avgPackage: '₹5 LPA', hiredCount: 38, status: 'completed', approval: 'Pending' },
  ]);

  const filteredCompanies = useMemo(() => {
    return companies.filter(c => {
      const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filter === 'All' || c.status.toLowerCase() === filter.toLowerCase();
      return matchesSearch && matchesFilter;
    });
  }, [companies, searchTerm, filter]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCompany.name || !newCompany.email) {
      toast.error("Please fill in basic company details.");
      return;
    }

    const company: Company = {
      id: Date.now(),
      name: newCompany.name,
      sector: newCompany.sector || 'General',
      location: newCompany.location || 'TBD',
      avgPackage: 'N/A',
      hiredCount: 0,
      status: 'upcoming',
      approval: 'Pending'
    };

    setCompanies([company, ...companies]);
    setIsAddModalOpen(false);
    setNewCompany({ name: '', sector: '', location: '', email: '', description: '' });
    toast.success(`${newCompany.name} has been added for review.`);
  };

  const toggleApproval = (id: number) => {
    setCompanies(prev => prev.map(c =>
      c.id === id ? { ...c, approval: c.approval === 'Approved' ? 'Pending' : 'Approved' } : c
    ));
    toast.success("Approval status updated successfully!");
  };

  const deleteCompany = (id: number) => {
    setCompanies(prev => prev.filter(c => c.id !== id));
    toast.error("Company profile removed from directory.");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in mt-2 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Corporate Partners</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage your placement ecosystem and recruiting alliances.</p>
        </div>
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
          {['All', 'Active', 'Upcoming', 'Completed'].map((opt) => (
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
                onClick={() => toggleApproval(company.id)}
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
