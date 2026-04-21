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
          dispatch(fetchJobsByCompanyId({ id: schedule.companyId }));
        }
      }
    }
  }, [open, schedule, dispatch]);

  const handleCompanyChange = (value: string) => {
    setFormData(prev => ({ ...prev, companyId: value, jobIds: [] }));
dispatch(fetchJobsByCompanyId({ id: Number(value) }));
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
    try {
      if (isCreate) {
        const payload = {
          ...formData,
          companyId: Number(formData.companyId),
          startTime: new Date(formData.startTime).toISOString(),
          endTime: new Date(formData.endTime).toISOString(),
        };
        const res = await dispatch(createSchedule(payload)).unwrap();
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
        await dispatch(updateSchedule({ id: schedule.id, scheduleData: payload })).unwrap();
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
      <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden border-none shadow-2xl">
        {/* Header with Background Accent */}
        <div className="bg-slate-50/50 border-b p-8">
          <DialogHeader>
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-sm">
                {isCreate ? <PlusCircle className="h-6 w-6" /> : <Edit3 className="h-6 w-6" />}
              </div>
              <div>
                <DialogTitle className="text-2xl font-bold tracking-tight">
                  {isCreate ? "Schedule New Drive" : "Edit Interview Drive"}
                </DialogTitle>
                <DialogDescription className="text-slate-500 font-medium">
                  {isCreate ? "Set up a new recruitment session" : `Modifying schedule for ${schedule?.company?.name}`}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Main Info Section */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 col-span-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                   Title
                </label>
                <Input
                  placeholder="e.g. Campus Recruitment 2024"
                  value={formData.title}
                  disabled={!isCreate}
                  className="bg-slate-50/50 focus-visible:ring-primary"
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <Building2 className="w-4 h-4 text-slate-400" /> Company
                </label>
                <Select value={formData.companyId} onValueChange={handleCompanyChange} disabled={!isCreate}>
                  <SelectTrigger className="bg-slate-50/50">
                    <SelectValue placeholder="Select Company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((c) => (
                      <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <MapPin className="w-4 h-4 text-slate-400" /> Venue
                </label>
                <Input
                  placeholder="Office location or Link"
                  value={formData.venue}
                  className="bg-slate-50/50"
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                />
              </div>
            </div>
          </div>

          <Separator className="bg-slate-100" />

          {/* Jobs Selection - Card style */}
          <div className="space-y-3">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <Briefcase className="w-4 h-4 text-slate-400" /> Target Job Roles
            </label>
            <div className="grid grid-cols-2 gap-3 p-4 rounded-xl border bg-slate-50/30">
              {jobs.length > 0 ? jobs.map((job) => (
                <div key={job.id} className="flex items-center space-x-3 p-2 rounded-lg transition-colors hover:bg-white">
                  <Checkbox
                    id={`job-${job.id}`}
                    checked={formData.jobIds.includes(job.id)}
                    disabled={!isCreate}
                    onCheckedChange={() => handleJobToggle(job.id)}
                  />
                  <label htmlFor={`job-${job.id}`} className="text-sm font-medium leading-none cursor-pointer">
                    {job.title}
                  </label>
                </div>
              )) : (
                <p className="col-span-2 text-xs text-center text-slate-400 py-2 italic">Select a company to see available jobs</p>
              )}
            </div>
          </div>

          {/* Time Management */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <CalendarIcon className="w-4 h-4 text-slate-400" /> Start Time
              </label>
              <Input
                type="datetime-local"
                value={formData.startTime}
                className="bg-slate-50/50"
                onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                <Clock className="w-4 h-4 text-slate-400" /> End Time
              </label>
              <Input
                type="datetime-local"
                value={formData.endTime}
                className="bg-slate-50/50"
                onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
              />
            </div>
          </div>

          {/* Message Area */}
          <div className="space-y-2">
            <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
              <MessageSquare className="w-4 h-4 text-slate-400" /> Custom Instructions
            </label>
            <Textarea
              placeholder="Add any specific details or requirements for the company..."
              value={formData.message}
              className="min-h-[100px] bg-slate-50/50 resize-none"
              onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => onOpenChange(false)}
              className="px-6 rounded-xl"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              className="px-8 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:shadow-none transition-all"
            >
              {isCreate ? "Create Schedule" : "Save Changes"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};