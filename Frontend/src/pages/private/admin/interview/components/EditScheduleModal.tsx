import React, { useEffect, useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, PlusCircle, AlertCircle, MapPin, Building2, Calendar as CalendarIcon, Clock, Layers } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store/store';
import { fetchCompanies, fetchJobsByCompanyId } from '@/redux/thunks/companyThunk';
import { createSchedule, updateSchedule } from '@/redux/thunks/interviewThunk';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { toast } from 'sonner';

interface EditModalProps {
  schedule: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
}

export const EditScheduleModal: React.FC<EditModalProps> = ({ schedule, open, onOpenChange, mode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { companies, jobs } = useSelector((state: RootState) => state.company);
  
  const [formData, setFormData] = useState({
    title: "",
    companyId: "",
    jobIds: [] as number[],
    venue: "",
    startTime: "",
    endTime: "",
    rejectionReason: ""
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
          rejectionReason: schedule.rejectionReason || ""
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
    
    const payload = {
      ...formData,
      companyId: Number(formData.companyId),
      startTime: new Date(formData.startTime).toISOString(),
      endTime: new Date(formData.endTime).toISOString(),
    };

    try {
      if (mode === 'create') {
        await dispatch(createSchedule(payload)).unwrap();
        toast.success("Schedule created successfully");
      } else {
        await dispatch(updateSchedule({ id: schedule.id, scheduleData: payload })).unwrap();
        toast.success("Schedule updated successfully");
      }
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error || "Something went wrong");
    }
  };

  if (!schedule && mode === 'edit') return null;

  const isCreate = mode === 'create';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] overflow-hidden p-0 rounded-[32px] border-none shadow-2xl bg-white">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            <div className="p-2 bg-primary/10 rounded-full">
              {isCreate ? <PlusCircle className="w-5 h-5 text-primary" /> : <Edit3 className="w-5 h-5 text-primary" />}
            </div>
            {isCreate ? "Schedule New Drive" : "Edit Drive Details"}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-base mt-2">
            {isCreate ? "Fill in the details to propose a new interview date." : `Modify schedule for ${schedule.company?.name}`}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="p-8 space-y-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Event Title</label>
            <Input 
              placeholder="e.g. Technical Round 1" 
              value={formData.title} 
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all text-base" 
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Company</label>
              <Select value={formData.companyId} onValueChange={handleCompanyChange}>
                <SelectTrigger className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all text-base">
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
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Venue</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder="Location"
                  value={formData.venue} 
                  onChange={(e) => setFormData(prev => ({ ...prev, venue: e.target.value }))}
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all text-base" 
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Target Jobs</label>
            <div className="grid grid-cols-2 gap-2 p-4 bg-slate-50 rounded-2xl border border-slate-100 max-h-40 overflow-y-auto">
              {jobs.length > 0 ? jobs.map((job) => (
                <div key={job.id} className="flex items-center space-x-2 p-2 hover:bg-white rounded-lg transition-colors">
                  <Checkbox 
                    id={`job-${job.id}`} 
                    checked={formData.jobIds.includes(job.id)} 
                    onCheckedChange={() => handleJobToggle(job.id)}
                  />
                  <label htmlFor={`job-${job.id}`} className="text-sm font-medium leading-none cursor-pointer truncate">
                    {job.title}
                  </label>
                </div>
              )) : (
                <p className="col-span-2 text-center text-slate-400 text-xs py-4">Select a company first to see jobs</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Start Date & Time</label>
              <div className="relative">
                <CalendarIcon className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <Input 
                  type="datetime-local"
                  value={formData.startTime} 
                  onChange={(e) => setFormData(prev => ({ ...prev, startTime: e.target.value }))}
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all text-base" 
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">End Date & Time</label>
              <div className="relative">
                <Clock className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <Input 
                  type="datetime-local"
                  value={formData.endTime} 
                  onChange={(e) => setFormData(prev => ({ ...prev, endTime: e.target.value }))}
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all text-base" 
                  required
                />
              </div>
            </div>
          </div>

          {!isCreate && (
            <div className="space-y-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle size={18} />
                <span className="text-xs font-bold uppercase tracking-wide">Approval Notes</span>
              </div>
              <Textarea 
                value={formData.rejectionReason}
                onChange={(e) => setFormData(prev => ({ ...prev, rejectionReason: e.target.value }))}
                placeholder="Internal notes..."
                className="bg-white resize-none rounded-xl border-amber-200 focus:ring-amber-500 min-h-[80px]"
              />
            </div>
          )}
        </form>

        <DialogFooter className="bg-slate-50/80 p-6 flex items-center justify-end gap-3 border-t border-slate-100">
          <Button 
            variant="ghost" 
            type="button"
            onClick={() => onOpenChange(false)} 
            className="rounded-2xl font-bold text-slate-600 hover:bg-slate-200 h-12 px-6"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit}
            className="rounded-2xl font-bold px-8 h-12 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all text-white"
          >
            {isCreate ? "Create Schedule" : "Update Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};