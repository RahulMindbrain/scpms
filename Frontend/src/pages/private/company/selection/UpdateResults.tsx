import React, { useState } from 'react';
import { 
  CheckCircle2, XCircle, Clock, ChevronDown, 
  Send, Briefcase, X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Result {
  id: number;
  name: string;
  branch: string;
  technical: number;
  hr: number;
  total: number;
  status: string;
}

const UpdateResults: React.FC = () => {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedResult, setSelectedResult] = useState<Result | null>(null);
  
  const [results, setResults] = useState<Result[]>([
    { id: 1, name: "Priya Sharma", branch: "CSE", technical: 88, hr: 82, total: 170, status: "Pending" },
    { id: 2, name: "Ananya Patel", branch: "CSE", technical: 95, hr: 90, total: 185, status: "Pending" },
    { id: 3, name: "Rahul Verma", branch: "IT", technical: 72, hr: 75, total: 147, status: "Pending" },
  ]);

  const handleUpdateStatus = (status: string) => {
    if (!selectedResult) return;
    setResults(results.map(r => r.id === selectedResult.id ? { ...r, status } : r));
    setIsUpdateModalOpen(false);
    toast.success(`Status updated for ${selectedResult.name}`);
  };

  // Logic to handle score updates
  const updateScore = (id: number, field: 'technical' | 'hr', value: string) => {
    const numValue = parseInt(value) || 0;
    setResults(results.map(r => {
      if (r.id === id) {
        const updated = { ...r, [field]: numValue };
        updated.total = updated.technical + updated.hr;
        return updated;
      }
      return r;
    }));
  };

  return (
    <div className="min-h-screen bg-[#111319] px-4 py-8 md:px-12">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header - More Spacing */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-[rgba(255,255,255,0.08)]">
          <div>
            <h1 className="text-3xl font-black text-[#e2e2eb] flex items-center gap-3">
              <Briefcase className="text-blue-600 w-9 h-9" />
              Recruitment <span className="text-blue-600">Drive</span>
            </h1>
            <p className="text-[#908fa0] mt-2 font-medium">Software Engineer Role • Final Review Phase</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700 h-14 px-10 rounded-2xl font-bold shadow-xl shadow-blue-200">
            <Send className="w-5 h-5 mr-2" /> Publish Results
          </Button>
        </div>

        {/* Main Table - De-congested for Web */}
        <div className="bg-white rounded-[2.5rem] border border-[rgba(255,255,255,0.08)]/60 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-separate border-spacing-0">
              <thead>
                <tr className="bg-[rgba(255,255,255,0.03)]">
                  <th className="px-8 py-6 text-xs font-bold text-[#908fa0] uppercase tracking-widest">Candidate Details</th>
                  <th className="px-8 py-6 text-xs font-bold text-[#908fa0] uppercase tracking-widest text-center">Technical</th>
                  <th className="px-8 py-6 text-xs font-bold text-[#908fa0] uppercase tracking-widest text-center">HR Round</th>
                  <th className="px-8 py-6 text-xs font-bold text-[#908fa0] uppercase tracking-widest text-center">Total Score</th>
                  <th className="px-8 py-6 text-xs font-bold text-[#908fa0] uppercase tracking-widest text-center">Result</th>
                  <th className="px-8 py-6 text-xs font-bold text-[#908fa0] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
                {results.map((row) => (
                  <tr key={row.id} className="group hover:bg-blue-50/30 transition-all duration-300">
                    {/* Name & Branch */}
                    <td className="px-8 py-7">
                      <div className="font-bold text-[#e2e2eb] text-lg leading-none mb-1">{row.name}</div>
                      <Badge variant="secondary" className="bg-[rgba(255,255,255,0.04)] text-[#908fa0] text-[10px] uppercase">{row.branch}</Badge>
                    </td>

                    {/* Technical Score - Editable Inline */}
                    <td className="px-8 py-7 text-center">
                      <div className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2 group-hover:bg-white transition-colors">
                        <input 
                          type="number" 
                          value={row.technical} 
                          onChange={(e) => updateScore(row.id, 'technical', e.target.value)}
                          className="w-10 bg-transparent text-center font-bold text-[#c7c4d7] outline-none"
                        />
                        <span className="text-[#c7c4d7] text-xs">/100</span>
                      </div>
                    </td>

                    {/* HR Score - Editable Inline */}
                    <td className="px-8 py-7 text-center">
                      <div className="inline-flex items-center gap-2 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.08)] rounded-xl px-3 py-2 group-hover:bg-white transition-colors">
                        <input 
                          type="number" 
                          value={row.hr} 
                          onChange={(e) => updateScore(row.id, 'hr', e.target.value)}
                          className="w-10 bg-transparent text-center font-bold text-[#c7c4d7] outline-none"
                        />
                        <span className="text-[#c7c4d7] text-xs">/100</span>
                      </div>
                    </td>

                    {/* Total - Highlighted */}
                    <td className="px-8 py-7 text-center">
                      <div className="font-black text-xl text-blue-600">{row.total}<span className="text-[#c7c4d7] text-sm font-normal"> / 200</span></div>
                    </td>

                    {/* Status Badge */}
                    <td className="px-8 py-7 text-center">
                      <Badge 
                        className="rounded-full px-5 py-2 font-bold text-sm shadow-sm"
                        variant={row.status === 'Selected' ? 'success' : row.status === 'Rejected' ? 'danger' : 'outline'}
                      >
                        {row.status}
                      </Badge>
                    </td>

                    {/* Action Button */}
                    <td className="px-8 py-7 text-right">
                      <button 
                        onClick={() => { setSelectedResult(row); setIsUpdateModalOpen(true); }}
                        className="inline-flex items-center gap-2 px-5 py-3 bg-white border border-[rgba(255,255,255,0.08)] rounded-2xl text-sm font-black text-[#c7c4d7] hover:border-blue-600 hover:text-blue-600 hover:shadow-lg hover:shadow-blue-100 transition-all"
                      >
                        UPDATE STATUS <ChevronDown className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* MODAL - Status Update (Dropdown functionality) */}
      {isUpdateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-md" onClick={() => setIsUpdateModalOpen(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl p-10 animate-in slide-in-from-bottom-4 duration-300">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-black">Set Result</h3>
              <button onClick={() => setIsUpdateModalOpen(false)} className="p-2 hover:bg-[rgba(255,255,255,0.04)] rounded-full transition-colors">
                <X className="w-6 h-6 text-[#908fa0]" />
              </button>
            </div>
            <div className="space-y-4">
              {[
                { id: 'Selected', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'hover:border-emerald-500' },
                { id: 'Rejected', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', border: 'hover:border-red-500' },
                { id: 'Pending', icon: Clock, color: 'text-[#908fa0]', bg: 'bg-[rgba(255,255,255,0.02)]', border: 'hover:border-slate-400' }
              ].map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => handleUpdateStatus(opt.id)}
                  className={`w-full flex items-center gap-5 p-5 rounded-3xl border-2 border-[rgba(255,255,255,0.04)] transition-all text-left ${opt.border} hover:shadow-md group`}
                >
                  <div className={`w-14 h-14 ${opt.bg} ${opt.color} rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
                    <opt.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <div className="font-black text-[#e2e2eb] text-lg">{opt.id}</div>
                    <div className="text-sm text-[#908fa0] font-medium">Finalize candidate as {opt.id.toLowerCase()}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateResults;