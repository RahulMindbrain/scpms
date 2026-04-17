import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Edit3, PlusCircle, AlertCircle, MapPin, Building2 } from 'lucide-react';

interface EditModalProps {
  schedule: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
}

export const EditScheduleModal: React.FC<EditModalProps> = ({ schedule, open, onOpenChange, mode }) => {
  if (!schedule) return null;

  const isCreate = mode === 'create';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] overflow-hidden p-0 rounded-[32px] border-none shadow-2xl bg-white">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="flex items-center gap-2 text-2xl font-bold text-slate-900">
            {isCreate ? (
              <div className="p-2 bg-primary/10 rounded-full">
                <PlusCircle className="w-5 h-5 text-primary" />
              </div>
            ) : (
              <div className="p-2 bg-primary/10 rounded-full">
                <Edit3 className="w-5 h-5 text-primary" />
              </div>
            )}
            {isCreate ? "Schedule New Drive" : "Edit Drive Details"}
          </DialogTitle>
          <DialogDescription className="text-slate-500 text-base mt-2">
            {isCreate ? "Fill in the details to propose a new interview date." : `Modify schedule for ${schedule.company?.name}`}
          </DialogDescription>
        </DialogHeader>

        <form className="p-8 space-y-6">
          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Event Title</label>
            <Input 
              placeholder="e.g. Technical Round 1" 
              defaultValue={schedule.title} 
              className="h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all text-base" 
            />
          </div>

          <div className="space-y-2">
            <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Company Name</label>
            <div className="relative">
              <Building2 className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
              <Input 
                placeholder="Search company..." 
                defaultValue={schedule.company?.name} 
                className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all text-base" 
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Venue</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-4 w-5 h-5 text-slate-400" />
                <Input 
                  placeholder="Location"
                  defaultValue={schedule.venue} 
                  className="pl-12 h-14 rounded-2xl bg-slate-50 border-transparent focus:bg-white focus:border-primary transition-all text-base" 
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[11px] font-black uppercase text-slate-400 tracking-wider ml-1">Initial Status</label>
              <Input 
                value={isCreate ? "PENDING" : schedule.status} 
                disabled 
                className="h-14 rounded-2xl bg-slate-100 border-none italic text-slate-500 font-medium text-base" 
              />
            </div>
          </div>

          {!isCreate && (
            <div className="space-y-3 p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
              <div className="flex items-center gap-2 text-amber-700">
                <AlertCircle size={18} />
                <span className="text-xs font-bold uppercase tracking-wide">Approval Notes</span>
              </div>
              <Textarea 
                defaultValue={schedule.rejectionReason}
                placeholder="Internal notes..."
                className="bg-white resize-none rounded-xl border-amber-200 focus:ring-amber-500 min-h-[80px]"
              />
            </div>
          )}
        </form>

        {/* FIXED FOOTER: Correct alignment and button spacing */}
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
            type="submit" 
            className="rounded-2xl font-bold px-8 h-12 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/90 transition-all"
          >
            {isCreate ? "Create Schedule" : "Update Schedule"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};