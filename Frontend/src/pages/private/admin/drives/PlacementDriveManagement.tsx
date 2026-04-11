import React, { useState, useRef, useEffect } from 'react';
import { 
  Calendar, 
  MapPin, 
  GraduationCap, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2,
  ChevronDown,
  Building2,
  AlertCircle,
  Briefcase,
  Search,
  Filter
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
    },
    { 
      id: 3, 
      company: 'Amazon', 
      role: 'Data Analyst', 
      status: 'completed', 
      description: 'Data analytics role in cloud division.', 
      date: 'Apr 5, 2026', 
      location: 'Bangalore', 
      minCgpa: 7, 
      package: '₹18 LPA', 
      branches: ['CSE', 'IT', 'ECE', 'EE'], 
      applicants: 89 
    },
  ];

  const filteredDrives = drives.filter(d => 
    filter === 'All Drives' || d.status.toLowerCase() === filter.toLowerCase()
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in mt-2 p-4 md:p-0">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Placement Drives</h1>
          <p className="text-slate-500 font-medium tracking-tight">Schedule and monitor ongoing recruitment processes.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative" ref={filterRef}>
            <button 
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="flex w-full sm:w-auto items-center justify-between gap-4 px-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-xs font-black uppercase tracking-widest text-slate-700 hover:border-blue-500 transition-all shadow-sm active:scale-95"
            >
              <Filter className="w-4 h-4 text-blue-600" />
              {filter} 
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isFilterOpen ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isFilterOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-3 w-56 bg-white border border-slate-100 rounded-2xl shadow-2xl shadow-blue-500/10 z-[50] overflow-hidden p-2"
                >
                  {['All Drives', 'Active', 'Upcoming', 'Completed'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setFilter(opt);
                        setIsFilterOpen(false);
                      }}
                      className={`w-full text-left px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${filter === opt ? 'bg-blue-600 text-white' : 'text-slate-500 hover:bg-slate-50 hover:text-blue-600'}`}
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
            className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20 active:scale-95"
          >
            <Plus className="w-5 h-5" /> Create Drive
          </button>
        </div>
      </div>

      {/* Drives List */}
      <div className="space-y-6">
        {filteredDrives.length > 0 ? filteredDrives.map((drive) => (
          <div key={drive.id} className="bg-white p-6 lg:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-40 h-40 blur-[100px] opacity-10 transition-opacity group-hover:opacity-20 ${drive.status === 'active' ? 'bg-blue-600' : 'bg-emerald-600'}`}></div>
            
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-10 relative z-10">
              <div className="space-y-6 flex-1">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 border border-slate-100">
                    <Building2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-none mb-2">{drive.company}</h3>
                    <Badge variant={drive.status === 'active' ? 'primary' : 'success'} className="uppercase tracking-[0.2em] text-[9px] font-black px-3 py-1">
                      {drive.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h4 className="text-xl font-bold text-slate-800">{drive.role}</h4>
                  <p className="text-sm text-slate-500 leading-relax max-w-2xl font-medium">{drive.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-10 gap-y-6 pt-2">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <Calendar className="w-4 h-4 text-blue-500" /> {drive.date}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-rose-500" /> {drive.location}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <GraduationCap className="w-4 h-4 text-indigo-500" /> CGPA: {drive.minCgpa}+
                  </div>
                  <div className="text-xs font-black text-blue-600 bg-blue-50 px-5 py-2 rounded-xl border border-blue-100 uppercase tracking-widest">
                    {drive.package}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {drive.branches.map(branch => (
                    <span key={branch} className="px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[9px] font-black text-slate-500 uppercase tracking-widest group-hover:bg-white transition-colors">
                      {branch}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row xl:flex-col items-stretch sm:items-center xl:items-end justify-between self-stretch gap-8 mt-4 xl:mt-0">
                <div className="text-center sm:text-left xl:text-right px-4">
                  <span className="text-5xl font-black text-slate-900 block tracking-tighter leading-none mb-1">{drive.applicants}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">applicants</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 sm:flex-none p-3.5 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm active:scale-90">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button className="flex-1 sm:flex-none p-3.5 border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm active:scale-90">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="flex-[2] sm:flex-none px-10 py-3.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )) : (
          <div className="py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 border-dashed">
             <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
             <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">No drives found matching your criteria</p>
          </div>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Create Placement Drive"
        subtitle="Set up a new recruitment session and specify eligibility criteria."
        maxWidth="2xl"
        footer={
          <div className="flex items-center justify-end gap-3 font-sans">
            <button onClick={() => setIsModalOpen(false)} className="px-6 py-3 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
              Cancel
            </button>
            <button className="px-8 py-3 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-500/20">
              Create Drive
            </button>
          </div>
        }
      >
        <form className="space-y-8 font-sans">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Company</label>
              <div className="relative">
                <Building2 className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" placeholder="Company name" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Role / Position</label>
              <div className="relative">
                <Briefcase className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" placeholder="e.g. SDE Intern" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Drive Date</label>
              <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-slate-600" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Registration Deadline</label>
              <input type="date" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all text-slate-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Location</label>
              <input type="text" placeholder="e.g. Bangalore" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-404 uppercase tracking-widest ml-1">Package (LPA)</label>
              <input type="text" placeholder="e.g. ₹12 LPA" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Min CGPA</label>
              <div className="relative">
                <GraduationCap className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" placeholder="e.g. 7.0" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Max Backlogs</label>
              <div className="relative">
                <AlertCircle className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                <input type="text" placeholder="e.g. 0" className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Eligible Branches</label>
            <div className="flex flex-wrap gap-4 px-1">
              {['CSE', 'IT', 'ECE', 'ME', 'CE', 'EE'].map(branch => (
                <label key={branch} className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative w-6 h-6 flex items-center justify-center transition-all">
                    <input type="checkbox" className="peer absolute inset-0 opacity-0 cursor-pointer z-10" />
                    <div className="w-full h-full border-2 border-slate-200 rounded-xl peer-checked:bg-blue-600 peer-checked:border-blue-600 transition-all group-hover:border-blue-400" />
                    <CheckCircle2 className="absolute w-3.5 h-3.5 text-white scale-0 peer-checked:scale-100 transition-transform z-20" />
                  </div>
                  <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900 transition-colors">{branch}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Job Description</label>
            <textarea placeholder="Detailed job description..." rows={4} className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all resize-none" />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default PlacementDriveManagement;
