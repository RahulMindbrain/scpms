import React, { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Briefcase, 
  Users, 
  Search, 
  ChevronDown, 
  Plus, 
  MoreVertical, 
  CheckCircle2, 
  Mail,
  FileText
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

interface Company {
  id: number;
  name: string;
  sector: string;
  location: string;
  avgPackage: string;
  hiredCount: number;
  status: 'active' | 'upcoming' | 'completed';
  approval: 'Approved' | 'Pending';
}

const CompanyManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const companies: Company[] = [
    { id: 1, name: 'Google', sector: 'Technology', location: 'Bangalore', avgPackage: '₹24 LPA', hiredCount: 12, status: 'active', approval: 'Approved' },
    { id: 2, name: 'Microsoft', sector: 'Technology', location: 'Hyderabad', avgPackage: '₹20 LPA', hiredCount: 8, status: 'active', approval: 'Approved' },
    { id: 3, name: 'Amazon', sector: 'E-Commerce', location: 'Bangalore', avgPackage: '₹18 LPA', hiredCount: 15, status: 'completed', approval: 'Approved' },
    { id: 4, name: 'Infosys', sector: 'IT Services', location: 'Pune', avgPackage: '₹6 LPA', hiredCount: 45, status: 'upcoming', approval: 'Approved' },
    { id: 5, name: 'TCS', sector: 'IT Services', location: 'Mumbai', avgPackage: '₹5.5 LPA', hiredCount: 60, status: 'upcoming', approval: 'Pending' },
    { id: 6, name: 'Wipro', sector: 'IT Services', location: 'Bangalore', avgPackage: '₹5 LPA', hiredCount: 38, status: 'completed', approval: 'Pending' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in mt-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Company Management</h1>
          <p className="text-slate-500 font-medium tracking-tight">Manage recruiting partners and their drive status.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search companies..." 
              className="w-full sm:w-64 pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
            />
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Add Company
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Companies" value="156" subtext="+12 this season" icon={Building2} />
        <StatCard label="Approved" value="142" subtext="91% approval rate" />
        <StatCard label="Pending" value="14" subtext="Awaiting review" />
        <StatCard label="Active Drives" value="28" subtext="Current sessions" />
      </div>

      {/* Filters Area */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-slate-300 transition-all shadow-sm"
          >
            {filter} Status <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          {isFilterOpen && (
            <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-slate-100 rounded-3xl shadow-2xl z-20 py-2 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
              {['All', 'Active', 'Upcoming', 'Completed'].map((opt) => (
                <button 
                  key={opt}
                  onClick={() => { setFilter(opt); setIsFilterOpen(false); }}
                  className="w-full text-left px-5 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors"
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Company Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {companies.map((company) => (
          <div key={company.id} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group relative">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  <Building2 className="w-8 h-8 text-slate-400 group-hover:text-blue-600 transition-colors" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors">{company.name}</h3>
                  <p className="text-xs font-black text-slate-400 uppercase tracking-[0.15em]">{company.sector}</p>
                </div>
              </div>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-xl transition-all">
                <MoreVertical className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4 mb-4">
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500 border-b border-slate-50 pb-3">
                <MapPin className="w-4 h-4 text-slate-300" /> {company.location}
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500 border-b border-slate-50 pb-3">
                <Briefcase className="w-4 h-4 text-slate-300" /> {company.avgPackage} avg
              </div>
              <div className="flex items-center gap-3 text-sm font-bold text-slate-500 pb-3">
                <Users className="w-4 h-4 text-slate-300" /> {company.hiredCount} hired
              </div>
            </div>

            <div className="flex items-center justify-between pt-4">
              <Badge variant={company.status === 'active' ? 'primary' : company.status === 'completed' ? 'success' : 'secondary'}>
                {company.status}
              </Badge>
              
              {company.approval === 'Approved' ? (
                <Badge variant="success" className="gap-1.5 normal-case tracking-normal px-4 py-1.5 rounded-xl">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved
                </Badge>
              ) : (
                <Badge variant="warning" className="px-4 py-1.5 rounded-xl">Pending</Badge>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Add New Company"
        subtitle="Register a new recruiting partner and manage their drive pipeline."
        footer={
          <div className="flex items-center justify-end gap-3">
            <button 
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-6 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all font-sans"
            >
              Cancel
            </button>
            <button 
              type="button"
              className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 font-sans"
            >
              Add Company
            </button>
          </div>
        }
      >
        <form className="space-y-6 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company Name</label>
              <input type="text" placeholder="e.g. Google" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Sector</label>
              <input type="text" placeholder="e.g. Technology" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
              <div className="relative">
                <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" placeholder="e.g. Bangalore" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Contact Email</label>
              <div className="relative">
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="email" placeholder="hr@company.com" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Description</label>
            <div className="relative">
              <FileText className="absolute right-4 top-4 w-4 h-4 text-slate-300" />
              <textarea 
                placeholder="Brief company description..." 
                rows={4}
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none"
              />
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CompanyManagement;
