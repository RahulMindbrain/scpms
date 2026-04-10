import React, { useState } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock,
  ChevronDown
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';

const StudentManagement: React.FC = () => {
  const [selectedDept] = useState('All Depts');

  const students = [
    { id: 1, name: 'Priya Sharma', dept: 'CSE', cgpa: 9.4, backlogs: 0, status: 'placed', verified: true, company: 'Google', package: '₹24 LPA' },
    { id: 2, name: 'Rahul Verma', dept: 'IT', cgpa: 9.2, backlogs: 0, status: 'placed', verified: true, company: 'Microsoft', package: '₹20 LPA' },
    { id: 3, name: 'Ananya Patel', dept: 'ECE', cgpa: 9.1, backlogs: 0, status: 'placed', verified: true, company: 'Amazon', package: '₹18 LPA' },
    { id: 4, name: 'Vikram Singh', dept: 'CSE', cgpa: 8.9, backlogs: 0, status: 'in-process', verified: true, company: '-', package: '-' },
    { id: 5, name: 'Sneha Gupta', dept: 'ME', cgpa: 8.5, backlogs: 1, status: 'eligible', verified: false, company: '-', package: '-' },
    { id: 6, name: 'Amit Kumar', dept: 'CE', cgpa: 7.8, backlogs: 0, status: 'eligible', verified: false, company: '-', package: '-' },
    { id: 7, name: 'Neha Reddy', dept: 'EE', cgpa: 8.7, backlogs: 0, status: 'in-process', verified: true, company: '-', package: '-' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in mt-2">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Student Management</h1>
          <p className="text-slate-500 font-medium">Review and manage student placement eligibility and profiles.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-5 py-2.5 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-white hover:shadow-sm transition-all">
            <Download className="w-4 h-4" /> Export
          </button>
          <button className="flex-1 lg:flex-none flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-2xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20">
            <Plus className="w-4 h-4" /> Add Student
          </button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Students" value="1,240" subtext="+24 this month" />
        <StatCard label="Verified" value="982" subtext="79% completion" />
        <StatCard label="Pending" value="258" subtext="Requires attention" />
        <StatCard label="Placed" value="485" subtext="39% target met" />
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-4 rounded-3xl border border-slate-100 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name, roll no, or branch..." 
            className="w-full pl-11 pr-4 py-3 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <button className="flex flex-1 items-center justify-between min-w-[140px] px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-slate-300 transition-all shadow-sm">
            {selectedDept} <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
          <button className="flex flex-1 items-center justify-between min-w-[140px] px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-bold text-slate-700 hover:border-slate-300 transition-all shadow-sm">
            All Status <ChevronDown className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Name</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Branch</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">CGPA</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Backlogs</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-sm shrink-0 uppercase">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <span className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600">{student.dept}</td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-black text-slate-900">{student.cgpa}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-sm font-black ${student.backlogs > 0 ? 'text-red-500' : 'text-slate-400'}`}>
                      {student.backlogs}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant={student.status === 'placed' ? 'primary' : student.status === 'in-process' ? 'success' : 'secondary'}>
                      {student.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    {student.verified ? (
                      <Badge variant="success" className="gap-1.5 normal-case tracking-normal py-1.5 px-4 rounded-xl">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                      </Badge>
                    ) : (
                      <Badge variant="warning" className="gap-1.5 normal-case tracking-normal py-1.5 px-4 rounded-xl">
                        <Clock className="w-3.5 h-3.5" /> Pending
                      </Badge>
                    )}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2.5 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-2xl transition-all">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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

export default StudentManagement;
