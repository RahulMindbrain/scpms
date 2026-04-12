import React from 'react';
import { Search, Filter,  Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';

const Shortlist: React.FC = () => {
  const shortlisted = [
    { name: "Priya Sharma", branch: "CSE", cgpa: "8.9", round: "Technical Round", rating: 4.5 },
    { name: "Ananya Patel", branch: "CSE", cgpa: "9.1", round: "Technical Round", rating: 4.8 },
    { name: "Rahul Verma", branch: "IT", cgpa: "8.2", round: "Applied", rating: 4.0 },
    { name: "Kavita Joshi", branch: "CSE", cgpa: "9.3", round: "Technical Round", rating: 4.7 },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-6 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2">
           Schedule Next Round <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search shortlisted..." 
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium text-slate-800"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-6 py-3 bg-slate-50 rounded-2xl border border-slate-100">
              <Filter className="w-4 h-4 text-slate-400" />
              <select className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none cursor-pointer">
                <option>All Branches</option>
                <option>CSE</option>
                <option>IT</option>
              </select>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Branch</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">CGPA</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Current Round</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Rating</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {shortlisted.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold">
                        {item.name.charAt(0)}
                      </div>
                      <div className="font-bold text-slate-800">{item.name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{item.branch}</td>
                  <td className="px-6 py-5 font-black text-slate-700">{item.cgpa}</td>
                  <td className="px-6 py-5">
                    <Badge variant="default" className="px-3 py-1 rounded-lg">
                      {item.round}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-1 text-amber-500">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm font-black">{item.rating}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="text-sm font-bold text-blue-600 hover:text-blue-700 hover:underline">
                      View Profile
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

export default Shortlist;
