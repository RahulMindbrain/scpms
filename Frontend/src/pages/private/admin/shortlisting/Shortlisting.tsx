import React, { useState } from 'react';
import { 
  Search, 
  Menu, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  CheckSquare,
  Square,
  Briefcase,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Applicant {
  id: string;
  name: string;
  dept: string;
  cgpa: number;
  currentRound: string;
  selected: boolean;
}

const Shortlisting: React.FC = () => {
  const [selectedApplicants, setSelectedApplicants] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const applicants: Applicant[] = [
    { id: '1', name: 'Priya Sharma', dept: 'CSE', cgpa: 9.4, currentRound: 'Applied', selected: false },
    { id: '2', name: 'Rahul Verma', dept: 'IT', cgpa: 9.2, currentRound: 'Applied', selected: false },
    { id: '3', name: 'Ananya Patel', dept: 'ECE', cgpa: 9.1, currentRound: 'Applied', selected: false },
    { id: '4', name: 'Vikram Singh', dept: 'CSE', cgpa: 8.9, currentRound: 'Applied', selected: false },
    { id: '5', name: 'Sneha Gupta', dept: 'ME', cgpa: 8.5, currentRound: 'Applied', selected: false },
    { id: '6', name: 'Neha Reddy', dept: 'EE', cgpa: 8.7, currentRound: 'Applied', selected: false },
    { id: '7', name: 'Amit Kumar', dept: 'CE', cgpa: 7.8, currentRound: 'Applied', selected: false },
  ];

  const stats = [
    { label: 'Total Applicants', value: 7, color: 'text-slate-600' },
    { label: 'Selected', value: 0, color: 'text-blue-600' },
    { label: 'Shortlisted So Far', value: 3, color: 'text-emerald-600' },
    { label: 'Rejected', value: 0, color: 'text-rose-600' },
  ];

  const toggleSelect = (id: string) => {
    setSelectedApplicants(prev => 
      prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
    );
  };

  return (
    <div className="p-1">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Menu className="w-5 h-5 text-slate-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Shortlisting</h1>
      </div>

      {/* Control Panel */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm mb-8">
        <div className="flex flex-col md:flex-row items-end gap-6">
          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Company / Drive</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 font-medium">
              <option>Google — SDE Intern</option>
            </select>
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Promote to Round</label>
            <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none text-slate-700 font-medium">
              <option>Shortlisted</option>
            </select>
          </div>
          <div className="flex-1">
             <button className="w-full md:w-auto px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white rounded-xl font-semibold shadow-md shadow-indigo-100 transition-all flex items-center justify-center gap-2">
               <ArrowRight className="w-4 h-4" />
               <span>Move {selectedApplicants.length} to Shortlisted</span>
             </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center"
          >
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Applicants Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="font-bold text-slate-800">Applicants</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search..." 
              className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm w-64 focus:outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 w-12">
                   <div className="w-5 h-5 border-2 border-slate-300 rounded-md"></div>
                </th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Name</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase">Department</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">CGPA</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase text-center">Current Round</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applicants.map((applicant) => (
                <tr key={applicant.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleSelect(applicant.id)}
                      className={`w-5 h-5 border-2 rounded-md transition-all flex items-center justify-center ${selectedApplicants.includes(applicant.id) ? 'bg-indigo-500 border-indigo-500' : 'border-indigo-200'}`}
                    >
                      {selectedApplicants.includes(applicant.id) && <CheckCircle2 className="w-3 h-3 text-white" />}
                    </button>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">{applicant.name}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{applicant.dept}</td>
                  <td className="px-6 py-4 text-center text-slate-600 font-medium">{applicant.cgpa}</td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-4 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-600">
                      {applicant.currentRound}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Shortlisting;
