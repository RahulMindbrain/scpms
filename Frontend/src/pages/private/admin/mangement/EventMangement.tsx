import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Clock, 
  MapPin 
} from 'lucide-react';

// Types for our placement events
interface PlacementEvent {
  id: string;
  companyName: string;
  driveType: 'On-Campus' | 'Off-Campus' | 'Pool';
  date: Date;
  venue: string;
  startTime: string;
}

const AdminPlacementCalendar: React.FC = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [events, setEvents] = useState<PlacementEvent[]>([
    {
      id: '1',
      companyName: 'TechCorp Solutions',
      driveType: 'On-Campus',
      date: new Date(2026, 3, 15),
      venue: 'Main Auditorium',
      startTime: '09:00 AM'
    },
    {
      id: '2',
      companyName: 'Global Finance Inc',
      driveType: 'Pool',
      date: new Date(2026, 3, 18),
      venue: 'Seminar Hall B',
      startTime: '11:30 AM'
    }
  ]);

  // Simple logic to get days in month
  const daysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Placement Schedule</h1>
          <p className="text-gray-500">Manage upcoming company drives and interviews</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition">
            <Plus size={18} />
            <span>Add New Drive</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Calendar Grid (3/4 width) */}
        <div className="lg:col-span-3 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 border-b flex items-center justify-between">
            <h2 className="text-lg font-semibold">
              {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
            </h2>
            <div className="flex gap-2">
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
                className="p-2 hover:bg-gray-100 rounded-full"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-7 text-center bg-gray-50 border-b">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="py-3 text-xs font-bold text-gray-500 uppercase tracking-wider">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 auto-rows-[120px]">
            {/* Blank spaces for first week */}
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="border-b border-r border-gray-100 bg-gray-50/30" />
            ))}

            {/* Days of the month */}
            {Array.from({ length: daysInMonth(currentDate) }).map((_, i) => {
              const day = i + 1;
              const hasEvent = events.some(e => e.date.getDate() === day && e.date.getMonth() === currentDate.getMonth());
              
              return (
                <div key={day} className="border-b border-r border-gray-100 p-2 hover:bg-gray-50 transition cursor-pointer group">
                  <span className={`text-sm font-medium ${hasEvent ? 'text-indigo-600' : 'text-gray-700'}`}>
                    {day}
                  </span>
                  {events
                    .filter(e => e.date.getDate() === day && e.date.getMonth() === currentDate.getMonth())
                    .map(e => (
                      <div key={e.id} className="mt-1 p-1 text-[10px] bg-indigo-100 text-indigo-700 rounded border border-indigo-200 truncate">
                        {e.companyName}
                      </div>
                    ))
                  }
                </div>
              );
            })}
          </div>
        </div>

        {/* Upcoming List (1/4 width) */}
        <div className="lg:col-span-1 space-y-4">
          <h3 className="font-bold text-gray-700 flex items-center gap-2">
            <CalendarIcon size={18} />
            Today's Briefing
          </h3>
          
          {events.map(event => (
            <div key={event.id} className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs font-bold text-indigo-600 uppercase">{event.driveType}</span>
                <span className="text-xs text-gray-400">{event.date.toLocaleDateString()}</span>
              </div>
              <h4 className="font-bold text-gray-800">{event.companyName}</h4>
              <div className="mt-3 space-y-2">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock size={14} />
                  <span>{event.startTime}</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <MapPin size={14} />
                  <span>{event.venue}</span>
                </div>
              </div>
              <button className="w-full mt-4 py-2 text-sm font-medium text-indigo-600 border border-indigo-100 rounded-lg hover:bg-indigo-50">
                View Details
              </button>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default AdminPlacementCalendar;