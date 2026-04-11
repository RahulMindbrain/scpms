import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Applicants: React.FC = () => {
  const applicants = [
    { name: "Priya Sharma", branch: "CSE", cgpa: "8.9", appliedFor: "Software Engineer", status: "Applied" },
    { name: "Rahul Verma", branch: "IT", cgpa: "8.2", appliedFor: "Software Engineer", status: "Shortlisted" },
    { name: "Ananya Patel", branch: "CSE", cgpa: "9.1", appliedFor: "Data Analyst", status: "Interview" },
    { name: "Vikram Singh", branch: "ECE", cgpa: "7.8", appliedFor: "DevOps Engineer", status: "Applied" },
    { name: "Sneha Gupta", branch: "CSE", cgpa: "8.5", appliedFor: "ML Engineer", status: "Selected" },
    { name: "Arjun Reddy", branch: "IT", cgpa: "7.5", appliedFor: "Software Engineer", status: "Rejected" },
    { name: "Kavita Joshi", branch: "CSE", cgpa: "9.3", appliedFor: "Data Analyst", status: "Shortlisted" },
    { name: "Amit Kumar", branch: "MECH", cgpa: "7.2", appliedFor: "DevOps Engineer", status: "Applied" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">All Applicants ({applicants.length})</h1>
          <p className="text-slate-500 font-medium">Review and manage candidates for your active jobs.</p>
        </div>
        <Button variant="outline" className="font-bold border-slate-200 hover:border-blue-600 hover:text-blue-600 px-6 py-6 rounded-2xl transition-all">
          <Download className="w-5 h-5 mr-2" /> Download All Resumes
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search by name..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Filter className="w-4 h-4 text-slate-400" />
              <select className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none cursor-pointer">
                <option>All Jobs</option>
                <option>Software Engineer</option>
                <option>Data Analyst</option>
              </select>
            </div>
            <select className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-600 focus:outline-none cursor-pointer">
              <option>All Status</option>
              <option>Applied</option>
              <option>Shortlisted</option>
              <option>Interview</option>
              <option>Selected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest">Name</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest">Branch</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest">CGPA</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest">Applied For</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest">Status</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {applicants.map((applicant, index) => (
                <tr key={index} className="hover:bg-slate-50/80 transition-all group rounded-xl">
                  <td className="px-4 py-5 font-bold text-slate-800">{applicant.name}</td>
                  <td className="px-4 py-5 text-sm font-medium text-slate-500">{applicant.branch}</td>
                  <td className="px-4 py-5 text-sm font-black text-slate-700">{applicant.cgpa}</td>
                  <td className="px-4 py-5 text-sm font-medium text-slate-600">{applicant.appliedFor}</td>
                  <td className="px-4 py-5 font-bold">
                    <Badge variant={
                      applicant.status === 'Selected' ? 'success' : 
                      applicant.status === 'Rejected' ? 'danger' : 
                      applicant.status === 'Shortlisted' ? 'primary' : 
                      applicant.status === 'Interview' ? 'warning' : 'outline'
                    } size="sm">
                      {applicant.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-5 text-right">
                    <button className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50">
                      <Download className="w-4 h-4" /> Download
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

export default Applicants;
