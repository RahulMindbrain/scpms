import React, { useState } from 'react';
import { Plus, Calendar, MessageSquare, Edit3, Building2, Clock, MapPin, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

import { EditScheduleModal } from './components/EditScheduleModal';
import ScheduleNotesSheet from './components/ScheduledMessage';

const InterviewSchedulerPage: React.FC = () => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isNotesSheetOpen, setIsNotesSheetOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('edit');

  // Mock data
  const schedules = [
    {
      id: 1,
      title: "Technical Round - Phase 1",
      company: { name: "Google" },
      startTime: "2026-04-10T10:00:00Z",
      endTime: "2026-04-10T12:00:00Z",
      venue: "Auditorium A",
      status: "SCHEDULED",
      companyApprovalStatus: "APPROVED",
      rejectionReason: "",
      jobs: [{ id: 101, title: "Software Engineer" }],
      _count: { messages: 3 }
    }
  ];

  const handleOpenCreate = () => {
    setMode('create');
    setSelectedSchedule({
      title: "",
      company: { name: "" },
      venue: "",
      status: "PENDING",
      rejectionReason: "",
      jobs: []
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (schedule: any) => {
    setMode('edit');
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };

  const handleOpenNotes = (schedule: any) => {
    setSelectedSchedule(schedule);
    setIsNotesSheetOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Interview Schedules</h1>
            <p className="text-sm text-muted-foreground">Sync with companies and manage slots</p>
          </div>
          <Button onClick={handleOpenCreate} className="rounded-xl shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4 mr-2" /> Schedule Drive
          </Button>
        </div>

        {/* Schedule List */}
        <div className="grid gap-4">
          {schedules.map((item) => (
            <Card key={item.id} className="group border-slate-200 hover:border-primary/40 transition-all overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col lg:flex-row">
                  {/* Left: Date Info */}
                  <div className="bg-slate-50/80 lg:w-40 p-4 flex flex-row lg:flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100 gap-2">
                    <Calendar className="w-5 h-5 text-primary" />
                    <span className="font-bold text-slate-900">Apr 10</span>
                    <Badge variant="outline" className="text-[9px] uppercase">{item.status}</Badge>
                  </div>

                  {/* Center: Details */}
                  <div className="flex-1 p-5 space-y-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-bold text-slate-900 text-lg uppercase tracking-tight">{item.title}</h3>
                        <div className="flex items-center gap-2 text-primary text-sm font-semibold">
                          <Building2 size={14} /> {item.company.name}
                        </div>
                      </div>
                      <Badge className={cn(
                        "font-bold text-[10px]",
                        item.companyApprovalStatus === 'APPROVED' ? "bg-emerald-500" : "bg-amber-500"
                      )}>
                        {item.companyApprovalStatus}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground font-medium">
                      <div className="flex items-center gap-1.5"><Clock size={14}/> 10:00 AM</div>
                      <div className="flex items-center gap-1.5"><MapPin size={14}/> {item.venue}</div>
                      <div className="flex items-center gap-1.5"><Layers size={14}/> {item.jobs.length} Jobs</div>
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="p-4 bg-slate-50/30 border-t lg:border-t-0 lg:border-l border-slate-100 flex lg:flex-col gap-2 justify-center">
                    <Button variant="outline" size="sm" className="relative gap-2 h-9 rounded-lg" onClick={() => handleOpenNotes(item)}>
                      <MessageSquare size={15} />
                      Messages
                      {item._count.messages > 0 && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-rose-500 text-[10px] text-white rounded-full flex items-center justify-center">
                          {item._count.messages}
                        </span>
                      )}
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 h-9 rounded-lg" onClick={() => handleOpenEdit(item)}>
                      <Edit3 size={15} />
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* --- SHARED MODAL --- */}
      <EditScheduleModal 
        schedule={selectedSchedule} 
        open={isEditModalOpen} 
        onOpenChange={setIsEditModalOpen}
        mode={mode} 
      />

      {/* --- MESSAGES SHEET --- */}
      <ScheduleNotesSheet 
        schedule={selectedSchedule} 
        open={isNotesSheetOpen} 
        onOpenChange={setIsNotesSheetOpen} 
      />
    </div>
  );
};

export default InterviewSchedulerPage;