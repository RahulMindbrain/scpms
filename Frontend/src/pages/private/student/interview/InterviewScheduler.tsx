import React from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  Bell, 
  Layout, 
  History, 
  ChevronRight 
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
}

const UpcomingInterviews: Interview[] = [
  {
    id: 1,
    company: 'Google',
    role: 'SDE Intern',
    round: 'Technical Round 1',
    date: 'Apr 12, 2026',
    time: '10:00 AM',
    duration: '1 hour',
    location: 'meet.google.com/abc-def',
    type: 'online',
    logoText: 'Go',
  },
  {
    id: 2,
    company: 'Microsoft',
    role: 'Full Stack Dev',
    round: 'HR Round',
    date: 'Apr 15, 2026',
    time: '2:00 PM',
    duration: '45 min',
    location: 'Campus Block A, Room 301',
    type: 'offline',
    logoText: 'Mi',
  },
  {
    id: 3,
    company: 'Amazon',
    role: 'Data Analyst',
    round: 'Technical Round 2',
    date: 'Apr 18, 2026',
    time: '11:00 AM',
    duration: '1 hour',
    location: 'chime.aws/xyz',
    type: 'online',
    logoText: 'Am',
  },
];

const InterviewSchedule: React.FC = () => {
  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      {/* Header */}
      <header className="flex items-center justify-between mb-8 px-4">
        <div className="flex items-center gap-3">
          <Layout className="w-6 h-6 text-slate-700" />
          <h1 className="text-2xl font-semibold text-slate-800">Interview Schedule</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Bell className="w-6 h-6 text-slate-500 cursor-pointer" />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-white">
              5
            </span>
          </div>
          <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-medium cursor-pointer">
            AS
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto space-y-6">
        {/* Upcoming Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <Calendar className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-bold">Upcoming Interviews (3)</h2>
          </div>

          <div className="space-y-4">
            {UpcomingInterviews.map((item) => (
              <div 
                key={item.id} 
                className="group border border-slate-100 rounded-xl p-5 hover:border-blue-200 transition-colors bg-slate-50/50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
                      {item.logoText}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-800">
                        {item.company} — <span className="font-medium">{item.role}</span>
                      </h3>
                      <p className="text-slate-500 text-sm">{item.round}</p>
                      
                      <div className="mt-4 flex flex-wrap gap-y-2 gap-x-6 text-slate-600 text-sm">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          {item.date}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-slate-400" />
                          {item.time} ({item.duration})
                        </div>
                        <div className="flex items-center gap-2">
                          {item.type === 'online' ? (
                            <Video className="w-4 h-4 text-slate-400" />
                          ) : (
                            <MapPin className="w-4 h-4 text-slate-400" />
                          )}
                          <span className="text-slate-500 truncate max-w-xs">{item.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <span className="bg-emerald-500/10 text-emerald-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                    upcoming
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Past Section */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
          <div className="flex items-center gap-2 mb-6">
            <History className="w-5 h-5 text-slate-600" />
            <h2 className="text-lg font-bold">Past Interviews (1)</h2>
          </div>

          <div className="border border-slate-100 rounded-xl p-5 bg-slate-50/30">
            <div className="flex items-center gap-4 opacity-60">
              <div className="w-14 h-14 bg-slate-200 rounded-xl flex items-center justify-center text-slate-500 font-bold text-lg">
                Ap
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800">Apple — iOS Developer</h3>
                <p className="text-slate-500 text-sm">
                  Apr 8, 2026 • Technical Round 1
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSchedule;