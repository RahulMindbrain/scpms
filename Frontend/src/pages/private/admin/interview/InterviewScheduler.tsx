import React from 'react';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Edit3, 
  Briefcase,
} from 'lucide-react';
import { Button } from '@/components/ui/button.tsx';
import { Badge } from '@/components/ui/badge.tsx';
import { Card, CardContent } from '@/components/ui/card.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog.tsx"
import { Input } from '@/components/ui/input.tsx';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.tsx';

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
  const [isModalOpen, setIsModalOpen] = React.useState(false);

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
    <div className="container mx-auto p-6 space-y-6 animate-in mt-2 bg-slate-50/50 rounded-3xl border border-slate-200/60">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center border border-primary/20">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">Interview Scheduler</h1>
            <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Manage placement events</p>
          </div>
        </div>
        
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogTrigger asChild>
            <Button className="rounded-xl shadow-lg shadow-primary/20">
              <Plus className="w-4 h-4 mr-2" />
              Schedule Event
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Schedule Interview Event</DialogTitle>
              <DialogDescription>
                Set interview date, time, and venue for the upcoming drive.
              </DialogDescription>
            </DialogHeader>
            <form className="space-y-4 pt-4" onSubmit={(e) => { e.preventDefault(); setIsModalOpen(false); }}>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Company</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Co." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="google">Google</SelectItem>
                      <SelectItem value="microsoft">Microsoft</SelectItem>
                      <SelectItem value="amazon">Amazon</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Event Type</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ppt">Pre-Placement Talk</SelectItem>
                      <SelectItem value="test">Online Test</SelectItem>
                      <SelectItem value="technical">Technical Interview</SelectItem>
                      <SelectItem value="hr">HR Interview</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Date</label>
                  <Input type="date" className="[color-scheme:light]" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Time</label>
                  <Input type="time" className="[color-scheme:light]" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Venue</label>
                <Input placeholder="e.g. Auditorium A or Online" />
              </div>
              <DialogFooter className="pt-4">
                <Button type="submit" className="w-full">Schedule Drive</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {events.map((event) => (
          <Card key={event.id} className="group hover:border-primary/50 transition-colors shadow-none overflow-hidden">
            <CardContent className="p-0">
              <div className="flex flex-col md:flex-row items-center gap-6 p-5">
                <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-slate-200 group-hover:bg-primary/5 group-hover:border-primary/20 transition-colors">
                   <Calendar className="w-6 h-6 text-slate-400 group-hover:text-primary transition-colors" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <h3 className="font-bold text-slate-900 text-base truncate uppercase tracking-tight">{event.type}</h3>
                    <Badge variant={event.status === 'completed' ? 'secondary' : 'default'} className="uppercase text-[9px] font-black tracking-widest px-2 py-0">
                      {event.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-y-1 gap-x-5 text-muted-foreground font-semibold text-xs">
                     <div className="flex items-center gap-1.5">
                       <Briefcase className="w-3.5 h-3.5" />
                       <span className="uppercase">{event.company}</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                       <Clock className="w-3.5 h-3.5" />
                       <span>{event.date} • {event.time}</span>
                     </div>
                     <div className="flex items-center gap-1.5">
                       <MapPin className="w-3.5 h-3.5" />
                       <span>{event.location}</span>
                     </div>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                   <div className="text-right">
                      {event.slots.total > 0 && (
                         <div className="space-y-0 text-center">
                           <p className="text-sm font-black text-slate-900">{event.slots.filled}/{event.slots.total}</p>
                           <p className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest">slots</p>
                         </div>
                      )}
                   </div>
                   <div className="flex items-center gap-2">
                     <Button variant="outline" size="sm" className="rounded-lg h-9 font-bold uppercase text-[10px] tracking-wider">
                       <Users className="w-3.5 h-3.5 mr-2" />
                       Assign
                     </Button>
                     <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground hover:text-primary rounded-lg border border-slate-100">
                       <Edit3 size={16} />
                     </Button>
                   </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <div className="h-10" />
    </div>
  );
};

export default InterviewScheduler;
