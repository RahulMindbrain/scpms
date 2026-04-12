import React, { useState } from 'react';
import {
  Mail,
  Send,
  Users,
  CheckCircle2,
  BarChart2,
  Eye,
  ChevronDown,
  LayoutGrid,
  FileText,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

const BulkEmail: React.FC = () => {
  const [selectedGroups, setSelectedGroups] = useState<string[]>([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState(`Dear {student_name},\n\nWe are pleased to inform you...\n\nRegards,\nTraining & Placement Cell`);
  const [template, setTemplate] = useState('Select a template...');
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const recipientGroups = [
    { id: 'all', label: 'All Students', count: 570 },
    { id: 'google_eligible', label: 'Eligible for Google Drive', count: 145 },
    { id: 'ms_eligible', label: 'Eligible for Microsoft Drive', count: 198 },
    { id: 'shortlisted', label: 'Shortlisted Students', count: 42 },
    { id: 'cse', label: 'CSE Department', count: 120 },
    { id: 'it', label: 'IT Department', count: 95 },
    { id: 'placed', label: 'Placed Students', count: 340 },
  ];

  const toggleGroup = (id: string) => {
    setSelectedGroups(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    );
  };

  const totalRecipients = selectedGroups.reduce((acc, gid) => {
    const group = recipientGroups.find(g => g.id === gid);
    return acc + (group?.count || 0);
  }, 0);

  const stats = [
    { label: 'Bulk Email Tool', value: 'Compose', icon: Mail, color: 'text-blue-500', bg: 'bg-blue-50' },
    { label: 'Recipients Selected', value: totalRecipients.toString(), icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-50' },
    { label: 'Emails Sent (Total)', value: '1,240', icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Delivery Rate', value: '98.2%', icon: BarChart2, color: 'text-cyan-500', bg: 'bg-cyan-50' },
  ];

  const handleSend = async () => {
    if (!subject.trim() || !body.trim()) {
      toast.error("Please fill in both subject and body");
      return;
    }
    if (selectedGroups.length === 0) {
      toast.error("Please select at least one recipient group");
      return;
    }

    setIsSending(true);
    const toastId = toast.loading(`Sending emails to ${totalRecipients} students...`);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    toast.success("Emails dispatched successfully!", { id: toastId });
    setIsSending(false);
    setSubject('');
    setSelectedGroups([]);
  };

  return (
    <div className="p-1  animate-in fade-in duration-700">
      

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
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
        {/* Email Form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm">
            <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Mail className="w-5 h-5" />
              </div>
              Compose Broadcast
            </h2>

            <div className="space-y-6">
              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Email Template</label>
                <div className="relative">
                  <select
                    value={template}
                    onChange={(e) => setTemplate(e.target.value)}
                    className="w-full pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 appearance-none font-bold text-slate-700"
                  >
                    <option>Select a template...</option>
                    <option>Placement Invitation</option>
                    <option>Interview Schedule</option>
                    <option>Selection Result</option>
                  </select>
                  <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Subject Line</label>
                <input
                  type="text"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Action Required: Interview Scheduled for Google Drive"
                  className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-bold text-slate-800 placeholder:text-slate-300 transition-all"
                />
              </div>

              <div>
                <label className="block text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">Message Content</label>
                <textarea
                  rows={10}
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Dear {student_name}, ..."
                  className="w-full px-5 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm focus:outline-none focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-500 font-medium text-slate-600 leading-relaxed transition-all"
                />
                <div className="mt-4 flex flex-wrap gap-2">
                  {['student_name', 'company', 'role', 'date', 'venue'].map(v => (
                    <button
                      key={v}
                      onClick={() => setBody(prev => prev + ` {${v}}`)}
                      className="px-3 py-1 bg-white border border-slate-100 rounded-lg text-[10px] font-black text-indigo-500 hover:border-indigo-200 transition-all cursor-copy"
                    >
                      +{v}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-4">
            <Button
              variant="outline"
              onClick={() => setIsPreviewOpen(true)}
              className="rounded-2xl border-slate-200 py-7 px-8 font-black uppercase tracking-widest text-xs"
            >
              <Eye className="w-4 h-4 mr-2" /> Live Preview
            </Button>
            <Button
              onClick={handleSend}
              disabled={isSending || totalRecipients === 0}
              className="rounded-2xl bg-indigo-600 py-7 px-10 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100 disabled:bg-slate-100 disabled:text-slate-300"
            >
              {isSending ? 'Dispatching...' : <>
                <Send className="w-4 h-4 mr-2" /> Send to {totalRecipients} Students
              </>}
            </Button>
          </div>
        </div>

        {/* Recipients Sidebar */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm h-fit">
            <h2 className="text-lg font-black text-slate-900 mb-8 flex items-center gap-3 uppercase tracking-tight">
              <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
                <Users className="w-5 h-5" />
              </div>
              Audience Selection
            </h2>

            <div className="space-y-3">
              {recipientGroups.map((group) => (
                <label
                  key={group.id}
                  className={`flex items-center justify-between p-4 rounded-[1.5rem] cursor-pointer transition-all border-2 ${selectedGroups.includes(group.id) ? 'bg-indigo-50/50 border-indigo-200 border-dashed' : 'bg-slate-50 border-transparent hover:border-slate-200'}`}
                >
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedGroups.includes(group.id)}
                      onChange={() => toggleGroup(group.id)}
                      className="w-5 h-5 rounded-lg border-slate-300 text-indigo-600 focus:ring-indigo-500/20"
                    />
                    <span className="text-sm font-bold text-slate-700">{group.label}</span>
                  </div>
                  <span className="bg-white px-3 py-1.5 rounded-xl text-xs font-black text-slate-500 border border-slate-100 shadow-sm">
                    {group.count}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-indigo-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700"></div>
            <div className="relative z-10">
              <AlertCircle className="w-8 h-8 mb-4 opacity-50" />
              <h3 className="text-lg font-black mb-2 uppercase tracking-tight">Communication Policy</h3>
              <p className="text-indigo-100/80 text-xs font-medium leading-relaxed">
                Bulk emails are monitored for rate limits. Ensure templates follow the standard placement cell guidelines.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Email Preview"
        subtitle="This is how students will see your message"
      >
        <div className="space-y-6">
          <div className="p-6 bg-slate-50 rounded-[1.5rem] border border-slate-100 space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-200 pb-4">
              <span className="text-[10px] font-black uppercase text-slate-400">Subject:</span>
              <span className="text-sm font-bold text-slate-800">{subject || "(No Subject)"}</span>
            </div>
            <div className="space-y-4 pt-2">
              <p className="text-sm text-slate-600 whitespace-pre-wrap leading-relaxed">
                {body.replace('{student_name}', 'Rahul Sharma')
                  .replace('{company}', 'Google')
                  .replace('{role}', 'SDE Intern')
                  .replace('{date}', 'April 20, 2026')
                  .replace('{venue}', 'Seminar Hall A')}
              </p>
            </div>
          </div>
          <Button
            className="w-full py-7 rounded-2xl bg-indigo-600 font-bold uppercase tracking-widest text-xs"
            onClick={() => setIsPreviewOpen(false)}
          >
            Close Preview
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default BulkEmail;
