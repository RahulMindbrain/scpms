import React, { useState, useRef, useEffect } from 'react';
import {
  Calendar,
  MapPin,
  GraduationCap,
  Plus,
  Edit3,
  Trash2,
  ChevronDown,
  Building2,
  AlertCircle,
  Briefcase,
  Search,
  Filter,
  Users
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { motion, AnimatePresence } from 'framer-motion';

interface Drive {
  id: number;
  company: string;
  role: string;
  status: 'active' | 'completed' | 'upcoming';
  description: string;
  date: string;
  location: string;
  minCgpa: number;
  package: string;
  branches: string[];
  applicants: number;
}

const PlacementDriveManagement: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState('All Drives');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const drives: Drive[] = [
    {
      id: 1,
      company: 'Google',
      role: 'SDE Intern',
      status: 'active',
      description: 'Looking for talented SDE interns for summer program.',
      date: 'Apr 10, 2026',
      location: 'Bangalore',
      minCgpa: 8,
      package: '₹24 LPA',
      branches: ['CSE', 'IT'],
      applicants: 145
    },
    {
      id: 2,
      company: 'Microsoft',
      role: 'Full Stack Developer',
      status: 'completed',
      description: 'Full-time full stack developer position.',
      date: 'Apr 8, 2026',
      location: 'Hyderabad',
      minCgpa: 7.5,
      package: '₹20 LPA',
      branches: ['CSE', 'IT', 'ECE'],
      applicants: 198
    }
  ];

  const filteredDrives = drives.filter(d =>
    filter === 'All Drives' || d.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">PLACEMENT DRIVES</h1>
          <p className="text-sm text-slate-500 font-medium">Manage and track upcoming recruitment sessions</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          {/* Filter Dropdown */}
          <div className="relative" ref={filterRef}>
            <button
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex w-full sm:w-auto items-center justify-between gap-4 px-5 py-3 bg-white border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:border-blue-500 transition-all shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Filter className="w-3.5 h-3.5 text-blue-600" />
                {filter}
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 mt-2 w-full sm:w-48 bg-white border border-slate-100 rounded-xl shadow-xl z-50 overflow-hidden p-1"
                >
                  {['All Drives', 'Active', 'Upcoming', 'Completed'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setFilter(opt);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${filter === opt ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50'}`}
                    >
                      {opt}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" /> Create Drive
          </button>
        </div>
      </div>

      {/* Drives List */}
      <div className="grid grid-cols-1 gap-6">
        {filteredDrives.length > 0 ? filteredDrives.map((drive) => (
          <div key={drive.id} className="bg-white rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden group">
            <div className="p-5 sm:p-8 lg:p-10 flex flex-col lg:flex-row gap-8">
              
              {/* Left Column: Company Info */}
              <div className="flex-1 space-y-6">
                <div className="flex items-start gap-4">
                  <div className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 border border-slate-100">
                    <Building2 className="w-6 h-6 sm:w-7 sm:h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight group-hover:text-blue-600 transition-colors">
                      {drive.company}
                    </h3>
                    <Badge className={`mt-1 uppercase tracking-widest text-[9px] font-black ${drive.status === 'active' ? 'bg-blue-100 text-blue-700 hover:bg-blue-100' : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-100'}`}>
                      {drive.status}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-800">{drive.role}</h4>
                  <p className="text-sm text-slate-500 line-clamp-2 sm:line-clamp-none leading-relaxed max-w-2xl font-medium">
                    {drive.description}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-8 gap-y-4 pt-2">
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar className="w-4 h-4 text-blue-500" /> {drive.date}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-rose-500" /> {drive.location}
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <GraduationCap className="w-4 h-4 text-indigo-500" /> CGPA: {drive.minCgpa}+
                  </div>
                  <div className="col-span-2 sm:col-span-1">
                    <span className="inline-block text-[10px] font-black text-blue-600 bg-blue-50 px-4 py-1.5 rounded-lg border border-blue-100 uppercase tracking-widest">
                      {drive.package}
                    </span>
                  </div>
                </div>

                {/* Branches */}
                <div className="flex flex-wrap gap-2">
                  {drive.branches.map(branch => (
                    <span key={branch} className="px-3 py-1 bg-slate-50 border border-slate-100 rounded-lg text-[9px] font-black text-slate-500 uppercase tracking-widest">
                      {branch}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right Column: Actions & Stats */}
              <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end justify-between lg:justify-center gap-6 lg:min-w-[240px] border-t lg:border-t-0 lg:border-l border-slate-100 pt-6 lg:pt-0 lg:pl-8">
                <div className="text-center lg:text-right">
                  <div className="flex items-center justify-center lg:justify-end gap-2 text-slate-900">
                    <Users className="w-5 h-5 text-slate-400" />
                    <span className="text-4xl font-black tracking-tighter">{drive.applicants}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Applicants Registered</span>
                </div>

                <div className="flex items-center gap-2">
                  <button className="p-3 border border-slate-100 rounded-xl text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button className="p-3 border border-slate-100 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-all">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="flex-1 lg:flex-none px-6 py-3 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all">
                    Details
                  </button>
                </div>
              </div>

            </div>
          </div>
        )) : (
          <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 border-dashed">
            <Search className="w-10 h-10 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No drives found</p>
          </div>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Create Drive"
        maxWidth="sm:max-w-2xl"
      >
        <div className="max-h-[70vh] overflow-y-auto px-1 pr-2 custom-scrollbar">
          <form className="space-y-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="e.g. Google" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Role</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="e.g. SDE" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Date</label>
                <input type="date" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Package</label>
                <input type="text" className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all" placeholder="e.g. 12 LPA" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Description</label>
              <textarea rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none" placeholder="Enter drive details..."></textarea>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
               <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition-all">
                Cancel
              </button>
              <button type="submit" className="px-8 py-2.5 bg-blue-600 text-white rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
                Save Drive
              </button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};

export default PlacementDriveManagement;