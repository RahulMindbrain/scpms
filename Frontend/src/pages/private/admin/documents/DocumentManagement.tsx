import React, { useState } from 'react';
import {
  FileText,
  CheckCircle2,
  Clock,
  Search,
  Download,
  Eye,
  ChevronDown,
  FileDown,
  LayoutGrid,
  Folder
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Document {
  id: string;
  student: string;
  department: string;
  file: string;
  uploaded: string;
  size: string;
  status: 'Verified' | 'Pending';
}

const DocumentManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'Student Resumes' | 'Offer Letters'>('Student Resumes');

  const documents: Document[] = [
    { id: '1', student: 'Priya Sharma', department: 'CSE', file: 'priya_sharma_resume.pdf', uploaded: 'Apr 2, 2026', size: '245 KB', status: 'Verified' },
    { id: '2', student: 'Rahul Verma', department: 'IT', file: 'rahul_verma_resume.pdf', uploaded: 'Apr 1, 2026', size: '312 KB', status: 'Verified' },
    { id: '3', student: 'Ananya Patel', department: 'ECE', file: 'ananya_patel_resume.pdf', uploaded: 'Mar 28, 2026', size: '198 KB', status: 'Pending' },
    { id: '4', student: 'Vikram Singh', department: 'CSE', file: 'vikram_singh_resume.pdf', uploaded: 'Mar 25, 2026', size: '278 KB', status: 'Verified' },
    { id: '5', student: 'Sneha Gupta', department: 'ME', file: 'sneha_gupta_resume.pdf', uploaded: 'Mar 20, 2026', size: '356 KB', status: 'Pending' },
    { id: '6', student: 'Neha Reddy', department: 'EE', file: 'neha_reddy_resume.pdf', uploaded: 'Mar 18, 2026', size: '220 KB', status: 'Verified' },
  ];

  const stats = [
    { label: 'Resumes', value: '6', icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Verified', value: '4', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Offer Letters', value: '3', icon: FileDown, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Pending Review', value: '2', icon: Clock, color: 'text-amber-500', bg: 'bg-amber-50' },
  ];

  return (
    <div className="p-1 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Folder className="w-5 h-5 text-slate-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Document Management</h1>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat, i) => (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={stat.label}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center justify-center text-center group hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-6 h-6" />
            </div>
            <p className="text-3xl font-black text-slate-800">{stat.value}</p>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Tabs and Actions */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="flex bg-slate-100 p-1 rounded-xl w-fit">
              {['Student Resumes', 'Offer Letters'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab
                      ? 'bg-white text-slate-800 shadow-sm'
                      : 'text-slate-500 hover:text-slate-700'
                    }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search resumes..."
                  className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 w-64"
                />
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
                <span>All Depts</span>
                <ChevronDown className="w-4 h-4" />
              </button>
              <button className="flex items-center gap-2 px-5 py-2 bg-slate-800 text-white rounded-xl text-sm font-bold hover:bg-slate-900 transition-colors shadow-lg shadow-slate-200">
                <Download className="w-4 h-4" />
                <span>Download All</span>
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Student</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Department</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">File</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Uploaded</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Size</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {documents.map((doc, i) => (
                <motion.tr
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                  key={doc.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-slate-700">{doc.student}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-slate-500">{doc.department}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-slate-400" />
                      <span className="text-xs font-semibold text-slate-600 underline decoration-slate-200 underline-offset-4">{doc.file}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-500">
                    {doc.uploaded}
                  </td>
                  <td className="px-6 py-4 text-xs font-bold text-slate-400">
                    {doc.size}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${doc.status === 'Verified'
                        ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-100'
                        : 'bg-amber-100 text-amber-600'
                      }`}>
                      {doc.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-slate-600 transition-colors">
                        <Download className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagement;
