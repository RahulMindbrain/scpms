import React from 'react';
import { Eye, Edit2, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const ManageJobs: React.FC = () => {
  const jobs = [
    { title: "Software Engineer", package: "8-12 LPA", location: "Bangalore", applicants: 124, deadline: "2026-04-20", status: "Active" },
    { title: "Data Analyst", package: "6-9 LPA", location: "Pune", applicants: 87, deadline: "2026-04-25", status: "Active" },
    { title: "DevOps Engineer", package: "10-15 LPA", location: "Hyderabad", applicants: 56, deadline: "2026-04-10", status: "Closed" },
    { title: "UI/UX Designer", package: "5-8 LPA", location: "Remote", applicants: 0, deadline: "2026-05-01", status: "Draft" },
    { title: "ML Engineer", package: "12-18 LPA", location: "Bangalore", applicants: 43, deadline: "2026-05-05", status: "Active" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        <Button className="font-bold px-6 py-6 rounded-2xl shadow-lg shadow-blue-500/20">
          <Plus className="w-5 h-5 mr-2" /> Post New Job
        </Button>
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-50">
          <h2 className="text-xl font-bold text-slate-900">Your Job Postings</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Job Title</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Package</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Location</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">Applicants</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Deadline</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {jobs.map((job, index) => (
                <tr key={index} className="hover:bg-slate-50 transition-colors group">
                  <td className="px-6 py-5 font-bold text-slate-800">{job.title}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600">{job.package}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-600">{job.location}</td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-600 text-center">{job.applicants}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{job.deadline}</td>
                  <td className="px-6 py-5">
                    <Badge variant={
                      job.status === 'Active' ? 'primary' : 
                      job.status === 'Closed' ? 'danger' : 
                      'outline'
                    }>
                      {job.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-all">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
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

export default ManageJobs;

