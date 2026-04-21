import React from 'react';
import {
  Calendar,
  Clock, MapPin,
  ExternalLink
} from 'lucide-react';

interface Interview {
  id: number;
  company: string;
  role: string;
  round: string;
  date: string;
  time: string;
  duration: string;
  location: string;
  type: 'online' | 'offline';
  logoText: string;
  accentColor: string;
}

const UpcomingInterviews: Interview[] = [
  {
    id: 1,
    company: 'Google',
    role: 'SDE Intern',
    round: 'Technical Round 1',
    date: 'Apr 12, 2026',
    time: '10:00 AM',
    duration: '1h',
    location: 'meet.google.com/abc-def',
    type: 'online',
    logoText: 'G',
    accentColor: 'bg-blue-600',
  },
  {
    id: 2,
    company: 'Microsoft',
    role: 'Full Stack Dev',
    round: 'HR Round',
    date: 'Apr 15, 2026',
    time: '2:00 PM',
    duration: '45m',
    location: 'Campus Block A, Room 301',
    type: 'offline',
    logoText: 'M',
    accentColor: 'bg-emerald-600',
  },
  {
    id: 3,
    company: 'Amazon',
    role: 'Data Analyst',
    round: 'Technical Round 2',
    date: 'Apr 18, 2026',
    time: '11:00 AM',
    duration: '1h',
    location: 'chime.aws/xyz',
    type: 'online',
    logoText: 'A',
    accentColor: 'bg-orange-500',
  },
];

const InterviewSchedule: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#f8fafc] p-4 md:p-8 font-sans text-slate-900">
      <main className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Upcoming Interviews</h2>
              <p className="text-slate-500 text-sm mt-1">You have {UpcomingInterviews.length} interviews scheduled for this week.</p>
            </div>
            {/* <button className="text-sm font-semibold text-blue-600 hover:text-blue-700 bg-blue-50 px-4 py-2 rounded-lg transition-colors">
              View Calendar
            </button> */}
          </div>

          <div className="space-y-4">
            {UpcomingInterviews.map((item) => (
              <div 
                key={item.id} 
                className={`group relative bg-white border rounded-2xl p-5 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 ${
                  item.type === 'online' 
                    ? 'border-emerald-200/60 hover:border-emerald-300' 
                    : 'border-amber-200/60 hover:border-amber-300'
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex gap-4">
                    <div className={`${item.accentColor} w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-inner`}>
                      {item.logoText}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-lg font-bold text-slate-800">{item.company}</h3>
                        <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider ${
                          item.type === 'online' 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {item.type}
                        </span>
                      </div>
                      <p className="text-slate-600 font-medium">{item.role}</p>
                      <p className="text-slate-400 text-xs mt-0.5">{item.round}</p>
                    </div>
                  </div>

                  <div className="flex flex-row sm:flex-col items-end justify-between sm:justify-center gap-2 border-t sm:border-t-0 pt-4 sm:pt-0">
                    <div className="flex items-center gap-4 text-slate-600">
                      <div className="flex items-center gap-1.5 text-sm font-semibold">
                        <Calendar size={14} className="text-blue-500" />
                        {item.date}
                      </div>
                      <div className="flex items-center gap-1.5 text-sm font-semibold">
                        <Clock size={14} className="text-blue-500" />
                        {item.time}
                      </div>
                    </div>
                    
                    {item.type === 'online' ? (
                      <a href={`https://${item.location}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-all shadow-sm">
                        Join Meeting <ExternalLink size={12} />
                      </a>
                    ) : (
                      <button className="flex items-center gap-2 text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 px-4 py-2 rounded-lg transition-all">
                        View Map <MapPin size={12} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar Area */}
        <div className="space-y-6">
          {/* <div className="bg-slate-900 rounded-2xl p-6 text-white overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Interview Prep</h3>
              <p className="text-slate-400 text-sm mb-4">Complete your mock assessment to increase your chances by 40%.</p>
              <button className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-sm transition-colors">
                Start Mock Test
              </button>
            </div>
            <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl"></div>
          </div> */}

          {/* <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <History size={18} className="text-slate-400" />
                <h2 className="font-bold text-slate-800">Recent Activity</h2>
              </div>
              <MoreVertical size={16} className="text-slate-400 cursor-pointer" />
            </div>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-1 bg-emerald-400 rounded-full"></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Apple Inc.</p>
                  <p className="text-xs text-slate-500">Technical Round 1 Completed</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Apr 8 • 2:00 PM</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-1 bg-slate-200 rounded-full"></div>
                <div>
                  <p className="text-sm font-bold text-slate-800">Netflix</p>
                  <p className="text-xs text-slate-500">Application Viewed</p>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase font-bold">Apr 7 • 10:45 AM</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-8 flex items-center justify-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-colors">
              View All History <ChevronRight size={16} />
            </button>
          </div> */}
        </div>
      </main>
    </div>
  );
};

export default InterviewSchedule;