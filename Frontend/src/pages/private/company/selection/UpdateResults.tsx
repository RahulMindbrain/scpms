import React, { useState } from 'react';
import { CheckCircle2, XCircle, Clock, ChevronDown, Check, Send, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';

interface Result {
  name: string;
  branch: string;
  technical: string;
  hr: string;
  total: string;
  status: string;
}

const UpdateResults: React.FC = () => {
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const [results, setResults] = useState<Result[]>([
    { name: "Priya Sharma", branch: "CSE", technical: "88/100", hr: "82/100", total: "170/200", status: "Pending" },
    { name: "Ananya Patel", branch: "CSE", technical: "95/100", hr: "90/100", total: "185/200", status: "Pending" },
    { name: "Rahul Verma", branch: "IT", technical: "72/100", hr: "75/100", total: "147/200", status: "Pending" },
    { name: "Kavita Joshi", branch: "CSE", technical: "90/100", hr: "88/100", total: "178/200", status: "Pending" },
    { name: "Vikram Singh", branch: "ECE", technical: "65/100", hr: "60/100", total: "125/200", status: "Pending" },
    { name: "Sneha Gupta", branch: "CSE", technical: "82/100", hr: "85/100", total: "167/200", status: "Pending" },
  ]);

  const selectedCount = results.filter(r => r.status === 'Selected').length;
  const rejectedCount = results.filter(r => r.status === 'Rejected').length;
  const pendingCount = results.filter(r => r.status === 'Pending').length;

  const stats = [
    { label: "Selected", value: selectedCount.toString(), icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Rejected", value: rejectedCount.toString(), icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Pending", value: pendingCount.toString(), icon: Clock, color: "text-slate-400", bg: "bg-slate-50" },
  ];

  const handlePublish = async () => {
    setIsPublishing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsPublishing(false);
    setIsPublishModalOpen(false);
    toast.success(`${selectedCount} results have been published successfully!`);
  };

  const handleUpdateStatus = (status: string) => {
    if (!selectedResult) return;
    setResults(results.map(r =>
      r.name === selectedResult.name ? { ...r, status } : r
    ));
    setIsUpdateModalOpen(false);
    toast.success(`Status updated for ${selectedResult.name}`);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Update Results</h1>
          <p className="text-slate-500 font-medium">Finalize candidate selection and publish results to students.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="bg-white rounded-[2rem] border border-slate-100 p-8 flex flex-col items-center justify-center text-center shadow-lg shadow-slate-200/40 group hover:shadow-xl transition-all">
            <div className={`w-16 h-16 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <stat.icon className="w-8 h-8" />
            </div>
            <div className="text-4xl font-black text-slate-900 mb-1">{stat.value}</div>
            <div className="text-slate-500 font-bold uppercase tracking-widest text-xs">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
        <div className="p-10 space-y-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
              Final Results — <span className="text-blue-600 font-black">Software Engineer Drive</span>
            </h2>
            <Button
              onClick={() => setIsPublishModalOpen(true)}
              disabled={pendingCount > 0}
              className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-7 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center gap-3 text-lg leading-none disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" /> Publish Results
            </Button>
          </div>

          <div className="overflow-x-auto -mx-2">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  <th className="px-6 py-4">Candidate</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4">Technical</th>
                  <th className="px-6 py-4">HR</th>
                  <th className="px-6 py-4">Total</th>
                  <th className="px-6 py-4 text-center">Result</th>
                  <th className="px-6 py-4 text-right pr-10">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {results.map((row, index) => (
                  <tr key={index} className={`hover:bg-slate-50/50 transition-all ${index % 2 === 0 ? 'bg-transparent' : 'bg-slate-50/20'}`}>
                    <td className="px-6 py-6 font-bold text-slate-800">{row.name}</td>
                    <td className="px-6 py-6 text-sm font-medium text-slate-500">{row.branch}</td>
                    <td className="px-6 py-6 text-sm font-bold text-slate-700">{row.technical}</td>
                    <td className="px-6 py-6 text-sm font-bold text-slate-700">{row.hr}</td>
                    <td className="px-6 py-6 font-black text-slate-800">{row.total}</td>
                    <td className="px-6 py-6 text-center">
                      <Badge
                        variant={row.status === 'Selected' ? 'success' : row.status === 'Rejected' ? 'destructive' : 'outline'}
                        className="px-4 py-1.5 rounded-full font-bold"
                      >
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 text-right pr-6">
                      <div
                        onClick={() => {
                          setSelectedResult(row);
                          setIsUpdateModalOpen(true);
                        }}
                        className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:border-slate-300 transition-all cursor-pointer shadow-sm"
                      >
                        {row.status} <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Publish Confirmation Modal */}
      <Modal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        title="Confirm Publication"
        subtitle="Are you sure you want to publish these results?"
      >
        <div className="space-y-6">
          <div className="p-6 bg-blue-50 rounded-[1.5rem] border border-blue-100 flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-1" />
            <div>
              <p className="text-blue-900 font-bold mb-1">Impact Analysis</p>
              <p className="text-blue-700 text-sm font-medium leading-relaxed">
                Publishing will notify all candidates of their results. This action cannot be undone and results will be visible on the student dashboard.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
              <div className="text-2xl font-black text-slate-900">{selectedCount}</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Selected</div>
            </div>
            <div className="p-4 bg-slate-50 rounded-2xl text-center border border-slate-100">
              <div className="text-2xl font-black text-slate-900">{rejectedCount}</div>
              <div className="text-xs font-bold text-slate-500 uppercase">Rejected</div>
            </div>
          </div>
          <div className="flex gap-4 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsPublishModalOpen(false)}
              className="flex-1 py-7 rounded-2xl font-bold border-slate-200"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePublish}
              disabled={isPublishing}
              className="flex-1 bg-blue-600 py-7 rounded-2xl font-bold flex items-center justify-center gap-2"
            >
              {isPublishing ? "Publishing..." : "Yes, Publish Now"}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Update Result Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Candidate Result"
        subtitle={`Select final status for ${selectedResult?.name}`}
      >
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => handleUpdateStatus('Selected')}
            className="flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 hover:border-blue-600 hover:bg-blue-50 transition-all text-left group"
          >
            <div>
              <div className="font-bold text-slate-800">Select Candidate</div>
              <div className="text-sm text-slate-500">Candidate has cleared all rounds</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </button>

          <button
            onClick={() => handleUpdateStatus('Rejected')}
            className="flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 hover:border-red-600 hover:bg-red-50 transition-all text-left group"
          >
            <div>
              <div className="font-bold text-slate-800">Reject Candidate</div>
              <div className="text-sm text-slate-500">Insufficient scores in technical/HR</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-red-50 border border-red-100 flex items-center justify-center text-red-600 group-hover:bg-red-600 group-hover:text-white transition-all">
              <XCircle className="w-6 h-6" />
            </div>
          </button>

          <button
            onClick={() => handleUpdateStatus('Pending')}
            className="flex items-center justify-between p-6 rounded-2xl border-2 border-slate-100 hover:border-slate-400 hover:bg-slate-50 transition-all text-left group"
          >
            <div>
              <div className="font-bold text-slate-800">Set to Pending</div>
              <div className="text-sm text-slate-500">Waitlist or further evaluation needed</div>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-slate-400 group-hover:text-white transition-all">
              <Clock className="w-6 h-6" />
            </div>
          </button>
        </div>
      </Modal>

      <div className="fixed bottom-8 right-8 animate-in slide-in-from-right-10 duration-700">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 p-6 pr-12 rounded-[2rem] shadow-2xl shadow-blue-200/50 border-white/40 ring-1 ring-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-800 leading-none mb-1">Results Summary</div>
              <div className="text-sm font-bold text-slate-500">{selectedCount} candidates selected, {pendingCount} still pending.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateResults;
