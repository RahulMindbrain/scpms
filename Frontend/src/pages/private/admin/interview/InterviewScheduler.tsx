import React, { useState } from 'react';
import { 
  Calendar, 
  Plus, 
  MapPin, 
  Clock, 
  Users, 
  Edit3, 
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MessageSquare,
  Building2,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from "@/lib/utils";

// Types reflecting the Prisma Schema
type ScheduleStatus = 'SCHEDULED' | 'ONGOING' | 'COMPLETED' | 'CANCELLED';
type CompanyApprovalStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

interface InterviewSchedule {
  id: number;
  title: string;
  company: { name: string };
  startTime: string;
  endTime: string;
  venue: string | null;
  status: ScheduleStatus;
  companyApprovalStatus: CompanyApprovalStatus;
  jobs: { id: number; title: string }[];
  _count?: { messages: number };
}

const InterviewScheduler: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data based on new Schema
  const schedules: InterviewSchedule[] = [
    {
      id: 1,
      title: "Technical Round - Phase 1",
      company: { name: "Google" },
      startTime: "2026-04-10T10:00:00Z",
      endTime: "2026-04-10T12:00:00Z",
      venue: "Auditorium A",
      status: "SCHEDULED",
      companyApprovalStatus: "APPROVED",
      jobs: [{ id: 101, title: "Software Engineer" }, { id: 102, title: "Site Reliability Engineer" }],
      _count: { messages: 3 }
    },
    {
      id: 2,
      title: "HR Discussion",
      company: { name: "Microsoft" },
      startTime: "2026-04-11T14:00:00Z",
      endTime: "2026-04-11T15:30:00Z",
      venue: "Online - Teams",
      status: "SCHEDULED",
      companyApprovalStatus: "PENDING",
      jobs: [{ id: 103, title: "Product Manager" }],
      _count: { messages: 0 }
    }
  ];

  const getApprovalBadge = (status: CompanyApprovalStatus) => {
    const styles = {
      APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
      PENDING: "bg-amber-50 text-amber-700 border-amber-200",
      REJECTED: "bg-rose-50 text-rose-700 border-rose-200"
    };
    const Icons = { APPROVED: CheckCircle2, PENDING: AlertCircle, REJECTED: XCircle };
    const Icon = Icons[status];

    return (
      <Badge variant="outline" className={cn("gap-1 font-medium", styles[status])}>
        <Icon size={12} /> {status}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Interview Schedules</h1>
            <p className="text-sm text-muted-foreground">Manage drives and company approvals</p>
          </div>

          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full sm:w-auto shadow-sm">
                <Plus className="w-4 h-4 mr-2" /> Schedule New Drive
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create Interview Schedule</DialogTitle>
                <DialogDescription>Initialize a new interview process for a company.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Event Title</label>
                  <Input placeholder="e.g. Technical Round 1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Start Time</label>
                    <Input type="datetime-local" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">End Time</label>
                    <Input type="datetime-local" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Venue / Link</label>
                  <Input placeholder="Physical location or Meeting URL" />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
                <Button type="submit">Create Schedule</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* List Section */}
        <div className="grid gap-4">
          {schedules.map((item) => (
            <Card key={item.id} className="overflow-hidden border-slate-200 hover:shadow-md transition-shadow">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  
                  {/* Left: Time/Status (Desktop) | Top: Info (Mobile) */}
                  <div className="bg-slate-50/80 lg:w-48 p-4 flex flex-row lg:flex-col items-center lg:justify-center border-b lg:border-b-0 lg:border-r border-slate-200 gap-3">
                    <div className="p-2 bg-white rounded-lg shadow-sm">
                      <Calendar className="w-5 h-5 text-primary" />
                    </div>
                    <div className="text-left lg:text-center">
                      <p className="font-bold text-slate-900 leading-none">
                        {new Date(item.startTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                      <p className="text-[10px] uppercase text-muted-foreground font-bold tracking-tighter">
                        {item.status}
                      </p>
                    </div>
                  </div>

                  {/* Center: Details */}
                  <div className="flex-1 p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                        <div className="flex items-center gap-2 text-primary font-semibold text-sm mt-1">
                          <Building2 size={16} />
                          <span>{item.company.name}</span>
                        </div>
                      </div>
                      {getApprovalBadge(item.companyApprovalStatus)}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-3 gap-x-6">
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Clock size={14} className="text-slate-400" />
                        <span>10:00 AM - 12:00 PM</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <MapPin size={14} className="text-slate-400" />
                        <span className="truncate">{item.venue || 'No venue set'}</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-sm">
                        <Layers size={14} className="text-slate-400" />
                        <span>{item.jobs.length} Jobs Linked</span>
                      </div>
                    </div>

                    {/* Job Tags */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      {item.jobs.map(job => (
                        <span key={job.id} className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium border border-slate-200">
                          {job.title}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="p-4 lg:p-6 bg-slate-50/30 border-t lg:border-t-0 lg:border-l border-slate-100 flex items-center justify-between lg:flex-col lg:justify-center gap-3">
                    <div className="flex items-center gap-4 lg:flex-col lg:gap-2">
                       <Button variant="ghost" size="sm" className="h-8 gap-2 relative">
                        <MessageSquare size={16} />
                        <span className="lg:hidden">Messages</span>
                        {item._count?.messages && item._count.messages > 0 ? (
                           <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-[10px] text-white rounded-full flex items-center justify-center">
                            {item._count.messages}
                           </span>
                        ) : null}
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 gap-2">
                        <Edit3 size={16} />
                        <span className="lg:hidden">Edit</span>
                      </Button>
                    </div>
                    <Button size="sm" className="h-9 px-6 font-bold lg:w-full">
                      DETAILS
                    </Button>
                  </div>
                  
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InterviewScheduler;