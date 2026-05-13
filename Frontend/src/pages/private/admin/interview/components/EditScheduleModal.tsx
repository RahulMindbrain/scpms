import React, { useEffect, useState } from 'react';
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Edit3, PlusCircle, MapPin, 
  Calendar as CalendarIcon, 
  Building2, Briefcase, MessageSquare,
  Clock
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store/store';
import { fetchCompanies, fetchJobsByCompanyId } from '@/redux/thunks/companyThunk';
import {
  createSchedule,
  updateSchedule,
  sendScheduleMessage
} from '@/redux/thunks/interviewThunk';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface EditModalProps {
  schedule: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
}

export const EditScheduleModal: React.FC<EditModalProps> = ({
  schedule,
  open,
  onOpenChange,
  mode
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies, jobs } = useSelector((state: RootState) => state.company);
  const isCreate = mode === 'create';

  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    jobIds: [] as number[],
    venue: "",
    startTime: "",
    endTime: "",
    message: ""
  });

  useEffect(() => {
    if (open) {
      dispatch(fetchCompanies({ page: 1, limit: 100 }));
      if (schedule) {
        setFormData({
          title: schedule.title || "",
          companyId: schedule.companyId?.toString() || "",
          jobIds: schedule.jobs?.map((j: any) => j.id) || [],
          venue: schedule.venue || "",
          startTime: schedule.startTime ? new Date(schedule.startTime).toISOString().slice(0, 16) : "",
          endTime: schedule.endTime ? new Date(schedule.endTime).toISOString().slice(0, 16) : "",
          message: ""
        });
        if (schedule.companyId) {
          dispatch(fetchJobsByCompanyId({ id: schedule.companyId, params: { status: 'APPROVED' } }));
        }
      }
    }
  }, [open, schedule, dispatch]);

  const handleCompanyChange = (value: string) => {
    setFormData(prev => ({ ...prev, companyId: value, jobIds: [] }));
    dispatch(fetchJobsByCompanyId({ id: Number(value), params: { status: 'APPROVED' } }));
  };

  const handleJobToggle = (jobId: number) => {
    setFormData(prev => ({
      ...prev,
      jobIds: prev.jobIds.includes(jobId)
        ? prev.jobIds.filter(id => id !== jobId)
        : [...prev.jobIds, jobId]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startTime || !formData.endTime) {
      toast.error("Please select both start and end times");
      return;
    }

    if (new Date(formData.endTime) <= new Date(formData.startTime)) {
      toast.error("End time must be after start time");
      return;
    }

    try {
      if (isCreate) {
        const payload = {
          ...formData,
          companyId: Number(formData.companyId),
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
        };
        const res = await dispatch(createSchedule(payload)).unwrap();
        
        if (res.success === false) {
          toast.error(res.message || "Time conflict detected or invalid schedule");
          return;
        }

        if (formData.message.trim()) {
          await dispatch(sendScheduleMessage({ id: res.data.id, message: formData.message }));
        }
        toast.success("Schedule created successfully");
      } else {
        const payload = {
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
          venue: formData.venue,
        };
        const res = await dispatch(updateSchedule({ id: schedule.id, scheduleData: payload })).unwrap();
        
        if (res.success === false) {
          toast.error(res.message || "Failed to update schedule");
          return;
        }

        if (formData.message.trim()) {
          await dispatch(sendScheduleMessage({ id: schedule.id, message: formData.message }));
        }
        toast.success("Schedule updated successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error?.message || error?.toString() || "Something went wrong");
    }
  };

  if (!schedule && !isCreate) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl rounded-[2.5rem]">
        {/* Header with Background Accent */}
        <div className="bg-white border-b border-border/40 p-8">
          <DialogHeader>
            <div className="flex items-center gap-5">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E8F0FF] text-[#1A6CFF] shadow-sm">
                {isCreate ? <PlusCircle className="h-8 w-8" /> : <Edit3 className="h-8 w-8" />}
              </div>
              <div>
                <DialogTitle className="text-3xl font-extrabold tracking-tight text-[#0F172A]">
                  {isCreate ? "Schedule New Drive" : "Edit Interview Drive"}
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-semibold text-base mt-1">
                  {isCreate ? "Set up a new recruitment session" : `Modifying schedule for ${schedule?.company?.name}`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {/* Main Info Section */}
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3 md:col-span-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                   Drive Title
                </label>
                <Input
                  placeholder="e.g. Campus Recruitment 2024"
                  value={formData.title}
                  disabled={!isCreate}
                  className="h-14 rounded-2xl bg-[#F8FAFC] border-slate-200/60 font-medium focus-visible:ring-[#1A6CFF]/10 focus-visible:border-[#1A6CFF]/30 text-slate-700"
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Select Company
                </label>
                <Select value={formData.companyId} onValueChange={handleCompanyChange} disabled={!isCreate}>
                  <SelectTrigger className="h-14 rounded-2xl bg-[#F8FAFC] border-slate-200/60 font-bold text-xs uppercase tracking-widest px-5 text-slate-600">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl border-slate-100 shadow-xl">
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                  <MapPin className="w-4 h-4" /> Venue / Link
                </label>
                <Input
                  placeholder="Office location or Link"
                  value={formData.venue}
                  className="h-14 rounded-2xl bg-[#F8FAFC] border-slate-200/60 font-medium text-slate-700"
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-border/50" />

          {/* Jobs Selection - Card style */}
          <div className="space-y-4">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
              <Briefcase className="w-4 h-4" /> Target Job Roles
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-6 rounded-[2rem] border border-slate-100 bg-[#F8FAFC]/50">
              {(() => {
                const filteredJobs = jobs.filter(job => 
                  !job.interviewScheduleId || job.interviewScheduleId === schedule?.id
                );

                return filteredJobs.length > 0 ? filteredJobs.map((job) => (
                  <div key={job.id} className="flex items-center space-x-3 p-4 rounded-2xl transition-all bg-white border border-slate-100 shadow-sm group hover:border-[#1A6CFF]/30">
                    <Checkbox
                      id={`job-${job.id}`}
                      checked={formData.jobIds.includes(job.id)}
                      disabled={!isCreate}
                      onCheckedChange={() => handleJobToggle(job.id)}
                      className="rounded-md border-slate-300 data-[state=checked]:bg-[#1A6CFF] data-[state=checked]:border-[#1A6CFF]"
                    />
                    <label htmlFor={`job-${job.id}`} className="text-sm font-bold text-slate-700 cursor-pointer group-hover:text-[#1A6CFF] transition-colors">
                      {job.title}
                    </label>
                  </div>
                )) : (
                  <div className="col-span-full py-6 text-center">
                    <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest italic">
                      {jobs.length > 0 ? "All approved jobs are already scheduled" : "Select a company to see available jobs"}
                    </p>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Time Management */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" /> Start Time
              </label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                min={new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                className="h-14 rounded-2xl bg-[#F8FAFC] border-slate-200/60 font-medium text-slate-700"
                onChange={(e) => {
                  const newStart = e.target.value;
                  setFormData(prev => {
                    const updates: any = { ...prev, startTime: newStart };
                    
                    // Automatically suggest an end time (1 hour later) if not set or invalid
                    if (newStart && (!prev.endTime || prev.endTime <= newStart)) {
                      const startDate = new Date(newStart);
                      const endDate = new Date(startDate.getTime() + 60 * 60 * 1000);
                      updates.endTime = new Date(endDate.getTime() - endDate.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
                    }
                    return updates;
                  });
                }}
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
                <Clock className="w-4 h-4" /> End Time
              </label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                min={formData.startTime || new Date(new Date().getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)}
                className="h-14 rounded-2xl bg-[#F8FAFC] border-slate-200/60 font-medium text-slate-700"
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1 flex items-center gap-2">
              <MessageSquare className="w-4 h-4" /> Custom Instructions
            </label>
            <Textarea
              placeholder="Add any specific details or requirements for the company..."
              value={formData.message}
              className="min-h-[140px] rounded-[1.5rem] bg-[#F8FAFC] border-slate-200/60 font-medium resize-none focus-visible:ring-[#1A6CFF]/10 p-5 text-slate-700"
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </div>

          <div className="flex flex-col gap-4 pt-4 pb-2">
            <Button 
              type="submit" 
              className="w-full h-14 bg-[#1A6CFF] hover:bg-[#0055FF] text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] shadow-[0_12px_24px_rgba(26,108,255,0.3)] hover:shadow-[0_15px_30px_rgba(26,108,255,0.4)] active:scale-[0.98] transition-all duration-300"
            >
              {isCreate ? "Create Schedule" : "Save Changes"}
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground hover:bg-transparent transition-all"
            >
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};