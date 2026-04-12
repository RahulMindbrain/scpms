import React, { useState } from 'react';
import {
  Search
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Application {
  id: string;
  student: string;
  dept: string;
  cgpa: number;
  company: string;
  role: string;
  appliedDate: string;
  eligible: boolean;
  stage: 'HR Round' | 'Selected' | 'Technical Round' | 'Shortlisted' | 'Applied' | 'Rejected';
}

const ApplicationsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const applications: Application[] = [
    { id: '1', student: 'Priya Sharma', dept: 'CSE', cgpa: 9.4, company: 'Google', role: 'SDE Intern', appliedDate: 'Apr 5', eligible: true, stage: 'HR Round' },
    { id: '2', student: 'Rahul Verma', dept: 'IT', cgpa: 9.2, company: 'Microsoft', role: 'Full Stack Dev', appliedDate: 'Apr 3', eligible: true, stage: 'Selected' },
    { id: '3', student: 'Ananya Patel', dept: 'ECE', cgpa: 9.1, company: 'Amazon', role: 'Data Analyst', appliedDate: 'Apr 2', eligible: true, stage: 'Technical Round' },
    { id: '4', student: 'Vikram Singh', dept: 'CSE', cgpa: 8.9, company: 'Google', role: 'SDE Intern', appliedDate: 'Apr 5', eligible: true, stage: 'Shortlisted' },
    { id: '5', student: 'Sneha Gupta', dept: 'ME', cgpa: 8.5, company: 'Infosys', role: 'System Engineer', appliedDate: 'Apr 1', eligible: true, stage: 'Applied' },
    { id: '6', student: 'Neha Reddy', dept: 'EE', cgpa: 8.7, company: 'Amazon', role: 'Data Analyst', appliedDate: 'Apr 2', eligible: true, stage: 'Rejected' },
    { id: '7', student: 'Karan Joshi', dept: 'IT', cgpa: 6.9, company: 'Google', role: 'SDE Intern', appliedDate: 'Apr 5', eligible: false, stage: 'Applied' },
  ];

  const stats = [
    { label: 'Total', value: 7, color: 'text-slate-600', bg: 'bg-white' },
    { label: 'Applied', value: 2, color: 'text-blue-600', bg: 'bg-white' },
    { label: 'In Process', value: 3, color: 'text-amber-600', bg: 'bg-white' },
    { label: 'Selected', value: 1, color: 'text-emerald-600', bg: 'bg-white' },
    { label: 'Rejected', value: 1, color: 'text-rose-600', bg: 'bg-white' },
  ];

  const getStageColor = (stage: string) => {
    switch (stage) {
      case 'Selected': return 'bg-blue-600 text-white';
      case 'HR Round': return 'bg-blue-800 text-white';
      case 'Technical Round': return 'bg-teal-600 text-white';
      case 'Shortlisted': return 'bg-emerald-500 text-white';
      case 'Rejected': return 'bg-rose-500 text-white';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  return (
    <div className="p-1">
      

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center"
          >
            <p className="text-3xl font-bold mb-1">{stat.value}</p>
            <p className="text-sm font-medium text-slate-500 uppercase tracking-wider">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
          <input 
            type="text" 
            placeholder="Search by student..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-4">
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none">
            <option>All Stages</option>
          </select>
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none">
            <option>All Companies</option>
          </select>
          <select className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium focus:outline-none">
            <option>All</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Student</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Dept</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">CGPA</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Role</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Applied</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Eligible</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {applications.map((app) => (
                <tr key={app.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-slate-900">{app.student}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{app.dept}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{app.cgpa}</td>
                  <td className="px-6 py-4 text-slate-600 font-medium">{app.company}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{app.role}</td>
                  <td className="px-6 py-4 text-slate-500 font-medium">{app.appliedDate}</td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-xs font-bold ${app.eligible ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
                      {app.eligible ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className={`inline-flex items-center px-4 py-1 rounded-full text-[11px] font-bold ${getStageColor(app.stage)}`}>
                      {app.stage}
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

export default ApplicationsManagement;
