import React, { useState } from 'react';
import { 
  Mail, 
  Send, 
  Users, 
  CheckCircle2, 
  BarChart2, 
  Eye, 
  ChevronDown,
  LayoutGrid
} from 'lucide-react';
import { motion } from 'framer-motion';

const BulkEmail: React.FC = () => {
  const [selectedRecipients, setSelectedRecipients] = useState<string[]>([]);

  const stats = [
    { label: 'Bulk Email Tool', value: 'Compose', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Recipients Selected', value: '0', icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Emails Sent (Total)', value: '1,240', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Delivery Rate', value: '98.2%', icon: BarChart2, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

  const recipientGroups = [
    { id: 'all', label: 'All Students', count: 570 },
    { id: 'google_eligible', label: 'Eligible for Google Drive', count: 145 },
    { id: 'ms_eligible', label: 'Eligible for Microsoft Drive', count: 198 },
    { id: 'shortlisted', label: 'Shortlisted Students', count: 42 },
    { id: 'cse', label: 'CSE Department', count: 120 },
    { id: 'it', label: 'IT Department', count: 95 },
    { id: 'placed', label: 'Placed Students', count: 340 },
  ];

  return (
    <div className="p-1 max-w-7xl mx-auto">
      <div className="flex items-center gap-2 mb-8">
        <div className="p-2 bg-slate-100 rounded-lg">
          <Mail className="w-5 h-5 text-slate-600" />
        </div>
        <h1 className="text-xl font-bold text-slate-800">Bulk Email</h1>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Email Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Mail className="w-5 h-5 text-indigo-500" />
              Compose Email
            </h2>
            
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email Template</label>
                <div className="relative">
                  <select className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none font-medium">
                    <option>Select a template...</option>
                    <option>Placement Invitation</option>
                    <option>Interview Schedule</option>
                    <option>Selection Result</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Subject</label>
                <input 
                  type="text" 
                  placeholder="Email subject..." 
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-medium"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Body</label>
                <textarea 
                  rows={10}
                  placeholder="Dear {student_name}, ..."
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
                  defaultValue={`Dear {student_name},\n\nWe are pleased to inform you...\n\nRegards,\nTraining & Placement Cell`}
                />
                <p className="mt-2 text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Available variables: {`{student_name}, {company}, {role}, {date}, {venue}`}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3">
             <button className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-50 transition-colors">
                <Eye className="w-4 h-4" />
                <span>Preview</span>
             </button>
             <button className="flex items-center gap-2 px-8 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100">
                <Send className="w-4 h-4" />
                <span>Send to 0 Recipients</span>
             </button>
          </div>
        </div>

        {/* Recipients Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-500" />
              Recipients
            </h2>

            <div className="space-y-3">
              {recipientGroups.map((group) => (
                <label 
                  key={group.id}
                  className="flex items-center justify-between p-4 bg-slate-50 hover:bg-slate-100 rounded-2xl cursor-pointer transition-colors border border-transparent hover:border-slate-200"
                >
                  <div className="flex items-center gap-3">
                    <input 
                      type="checkbox" 
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                    />
                    <span className="text-sm font-bold text-slate-700">{group.label}</span>
                  </div>
                  <span className="bg-white px-3 py-1 rounded-lg text-xs font-black text-slate-500 border border-slate-100 shadow-sm">
                    {group.count}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BulkEmail;
