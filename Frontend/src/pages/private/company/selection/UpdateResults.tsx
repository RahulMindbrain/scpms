import React from 'react';
import { CheckCircle2, XCircle, Clock, ChevronDown, Check, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const UpdateResults: React.FC = () => {
  const stats = [
    { label: "Selected", value: "0", icon: CheckCircle2, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Rejected", value: "0", icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
    { label: "Pending", value: "6", icon: Clock, color: "text-slate-400", bg: "bg-slate-50" },
  ];

  const results = [
    { name: "Priya Sharma", branch: "CSE", technical: "88/100", hr: "82/100", total: "170/200", status: "Pending" },
    { name: "Ananya Patel", branch: "CSE", technical: "95/100", hr: "90/100", total: "185/200", status: "Pending" },
    { name: "Rahul Verma", branch: "IT", technical: "72/100", hr: "75/100", total: "147/200", status: "Pending" },
    { name: "Kavita Joshi", branch: "CSE", technical: "90/100", hr: "88/100", total: "178/200", status: "Pending" },
    { name: "Vikram Singh", branch: "ECE", technical: "65/100", hr: "60/100", total: "125/200", status: "Pending" },
    { name: "Sneha Gupta", branch: "CSE", technical: "82/100", hr: "85/100", total: "167/200", status: "Pending" },
  ];

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
            <Button className="bg-blue-600 hover:bg-blue-700 text-white font-black px-8 py-7 rounded-2xl shadow-xl shadow-blue-200 transition-all flex items-center gap-3 text-lg leading-none">
              Publish Results
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
                      <Badge variant="outline" className="px-4 py-1.5 rounded-full bg-slate-50 text-slate-500 border-slate-100 font-bold">
                        {row.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-6 text-right pr-6">
                      <div className="inline-flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-bold text-slate-600 hover:border-slate-300 transition-all cursor-pointer shadow-sm">
                        Pending <ChevronDown className="w-4 h-4 text-slate-400" />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="fixed bottom-8 right-8 animate-in slide-in-from-right-10 duration-700">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200/50 p-6 pr-12 rounded-[2rem] shadow-2xl shadow-blue-200/50 border-white/40 ring-1 ring-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-200">
              <Check className="w-6 h-6" />
            </div>
            <div>
              <div className="text-lg font-black text-slate-800 leading-none mb-1">Results Published</div>
              <div className="text-sm font-bold text-slate-500">0 results have been published to students.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateResults;
