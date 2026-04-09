import React, { useState } from 'react';
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
  Briefcase
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';

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
  const [filter] = useState('All Drives');

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

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in mt-2">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Placement Drives</h1>
          <p className="text-slate-500 font-medium tracking-tight">Schedule and monitor ongoing recruitment processes.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative">
            <button className="flex w-full sm:w-auto items-center justify-between gap-3 px-6 py-2.5 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-slate-300 transition-all shadow-sm">
              {filter} <ChevronDown className="w-4 h-4 text-slate-400" />
            </button>
          </div>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20"
          >
            <Plus className="w-4 h-4" /> Create Drive
          </button>
        </div>
      </div>

      {/* Drives List */}
      <div className="space-y-6">
        {drives.map((drive) => (
          <div key={drive.id} className="bg-white p-6 lg:p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
            <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
              <div className="space-y-5 flex-1">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{drive.company}</h3>
                  <Badge variant={drive.status === 'active' ? 'primary' : 'success'}>
                    {drive.status}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <h4 className="text-lg font-bold text-slate-700">{drive.role}</h4>
                  <p className="text-sm text-slate-500 leading-relaxed max-w-2xl font-medium">{drive.description}</p>
                </div>

                <div className="flex flex-wrap items-center gap-x-8 gap-y-4 pt-2">
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <Calendar className="w-4 h-4 text-slate-300" /> {drive.date}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <MapPin className="w-4 h-4 text-slate-300" /> {drive.location}
                  </div>
                  <div className="flex items-center gap-2.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                    <GraduationCap className="w-4 h-4 text-slate-300" /> CGPA: {drive.minCgpa}+
                  </div>
                  <div className="text-sm font-black text-slate-900 bg-slate-50 px-4 py-1 rounded-xl border border-slate-100">
                    {drive.package}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  {drive.branches.map(branch => (
                    <Badge key={branch} variant="secondary" size="xs" className="px-3 border-transparent">
                      {branch}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row xl:flex-col items-stretch sm:items-center xl:items-end justify-between self-stretch gap-6 lg:gap-8">
                <div className="text-center sm:text-left xl:text-right px-4">
                  <span className="text-4xl font-black text-slate-900 block tracking-tighter">{drive.applicants}</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">applicants</span>
                </div>
                <div className="flex items-center gap-3">
                  <button className="flex-1 sm:flex-none p-3 border border-slate-100 rounded-2xl text-slate-400 hover:text-blue-600 hover:border-blue-200 hover:bg-blue-50 transition-all shadow-sm">
                    <Edit3 className="w-5 h-5" />
                  </button>
                  <button className="flex-1 sm:flex-none p-3 border border-slate-100 rounded-2xl text-slate-400 hover:text-red-600 hover:border-red-200 hover:bg-red-50 transition-all shadow-sm">
                    <Trash2 className="w-5 h-5" />
                  </button>
                  <button className="flex-[2] sm:flex-none px-8 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:bg-blue-600 hover:text-white hover:border-blue-600 transition-all shadow-sm group/btn">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
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
