import React from 'react';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Edit3, 
  Briefcase,
  ExternalLink,
  ChevronRight,
  Menu
} from 'lucide-react';
import { motion } from 'framer-motion';

interface Event {
  id: string;
  type: string;
  status: 'upcoming' | 'completed' | 'ongoing';
  company: string;
  date: string;
  time: string;
  location: string;
  slots: { filled: number; total: number };
  assignedStudents: string[];
}

const InterviewScheduler: React.FC = () => {
  const events: Event[] = [
    {
      id: '1',
      type: 'Pre-Placement Talk',
      status: 'upcoming',
      company: 'Google',
      date: 'Apr 10, 2026',
      time: '10:00 AM',
      location: 'Auditorium A',
      slots: { filled: 4, total: 4 },
      assignedStudents: []
    },
    {
      id: '2',
      type: 'Online Test',
      status: 'upcoming',
      company: 'Google',
      date: 'Apr 11, 2026',
      time: '2:00 PM',
      location: 'Lab 3',
      slots: { filled: 2, total: 3 },
      assignedStudents: ['Priya Sharma']
    },
    {
      id: '3',
      type: 'Technical Interview',
      status: 'upcoming',
      company: 'Google',
      date: 'Apr 12, 2026',
      time: '9:00 AM',
      location: 'Conference Hall',
      slots: { filled: 6, total: 8 },
      assignedStudents: ['Priya Sharma', 'Vikram Singh']
    },
    {
      id: '4',
      type: 'HR Interview',
      status: 'upcoming',
      company: 'Google',
      date: 'Apr 12, 2026',
      time: '2:00 PM',
      location: 'Room 201',
      slots: { filled: 3, total: 4 },
      assignedStudents: ['Priya Sharma']
    },
    {
      id: '5',
      type: 'Registration Deadline',
      status: 'upcoming',
      company: 'Infosys',
      date: 'Apr 14, 2026',
      time: '11:59 PM',
      location: 'Online',
      slots: { filled: 0, total: 0 },
      assignedStudents: []
    },
    {
      id: '6',
      type: 'Results Announced',
      status: 'completed',
      company: 'Microsoft',
      date: 'Apr 8, 2026',
      time: '-',
      location: '-',
      slots: { filled: 0, total: 0 },
      assignedStudents: []
    }
  ];

  return (
    <div className="p-1">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-2">
            <div className="p-2 bg-slate-100 rounded-lg">
                <Calendar className="w-5 h-5 text-slate-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-800">Interview Scheduler</h1>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-indigo-100 transition-all">
          <Plus className="w-4 h-4" />
          <span>Schedule Event</span>
        </button>
      </div>

      <div className="mb-6">
        <p className="text-sm font-medium text-slate-500">5 upcoming events</p>
      </div>

      <div className="space-y-4">
        {events.map((event, i) => (
          <motion.div 
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            key={event.id}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-indigo-100/50">
               <Calendar className="w-6 h-6 text-indigo-500" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-3 mb-1.5">
                <h3 className="font-bold text-slate-800 text-lg truncate">{event.type}</h3>
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  event.status === 'completed' ? 'bg-emerald-500 text-white shadow-sm shadow-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                }`}>
                  {event.status}
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-y-2 gap-x-6 text-slate-400 font-semibold text-sm">
                 <div className="flex items-center gap-1.5 whitespace-nowrap">
                   <Briefcase className="w-4 h-4 text-slate-300" />
                   <span>{event.company}</span>
                 </div>
                 <div className="flex items-center gap-1.5 whitespace-nowrap">
                   <Calendar className="w-4 h-4 text-slate-300" />
                   <span>{event.date}</span>
                 </div>
                 <div className="flex items-center gap-1.5 whitespace-nowrap">
                   <Clock className="w-4 h-4 text-slate-300" />
                   <span>{event.time}</span>
                 </div>
                 <div className="flex items-center gap-1.5 whitespace-nowrap">
                   <MapPin className="w-4 h-4 text-slate-300" />
                   <span>{event.location}</span>
                 </div>
              </div>
              {event.assignedStudents.length > 0 && (
                <div className="flex gap-2 mt-4">
                  {event.assignedStudents.map(student => (
                    <span key={student} className="bg-teal-500/10 text-teal-600 px-3 py-1 rounded-full text-[11px] font-bold border border-teal-100">
                      {student}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-8">
               <div className="text-right">
                  {event.slots.total > 0 && (
                     <div className="space-y-0.5">
                       <p className="text-sm font-bold text-slate-700">{event.slots.filled}/{event.slots.total}</p>
                       <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">slots left</p>
                     </div>
                  )}
               </div>
               <div className="flex items-center gap-3">
                 <button className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-xl text-sm font-bold border border-slate-200 transition-all hover:shadow-md active:scale-95">
                   <Users className="w-4 h-4" />
                   <span>Assign</span>
                 </button>
                 <button className="p-2.5 bg-white hover:bg-slate-50 text-slate-400 hover:text-slate-600 rounded-xl border border-slate-200 transition-all hover:shadow-md active:scale-95">
                   <Edit3 className="w-4 h-4" />
                 </button>
               </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default InterviewScheduler;
