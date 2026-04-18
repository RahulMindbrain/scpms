import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Clock, Users, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

interface Slot {
  id: string;
  startTime: string;
  endTime: string;
  capacity: number;
  studentsCount: number;
}

interface SlotManagementModalProps {
  schedule: any;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const SlotManagementModal: React.FC<SlotManagementModalProps> = ({ schedule, open, onOpenChange }) => {
  const [slots, setSlots] = useState<Slot[]>(schedule?.slots || []);
  const [newSlot, setNewSlot] = useState({
    startTime: '',
    endTime: '',
    capacity: 20
  });

  const handleAddSlot = () => {
    if (!newSlot.startTime || !newSlot.endTime) {
      toast.error("Please fill both start and end times");
      return;
    }
    
    const id = Math.random().toString(36).substr(2, 9);
    setSlots([...slots, { ...newSlot, id, studentsCount: 0 }]);
    setNewSlot({ startTime: '', endTime: '', capacity: 20 });
    toast.success("Slot added successfully");
  };

  const handleDeleteSlot = (id: string) => {
    setSlots(slots.filter(s => s.id !== id));
    toast.success("Slot removed");
  };

  const handleSave = () => {
    // Here we would dispatch an action to update slots in the backend
    toast.success("Changes saved successfully");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden border-none rounded-[32px] bg-white shadow-2xl">
        <DialogHeader className="p-8 pb-0">
          <DialogTitle className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="p-2.5 bg-violet-100 text-violet-600 rounded-2xl">
              <Clock size={24} />
            </div>
            Slot Management
          </DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">
            Configure interview time intervals for {schedule?.title}
          </DialogDescription>
        </DialogHeader>

        <div className="p-8 space-y-8">
          {/* Add New Slot Form */}
          <div className="p-6 bg-slate-50 rounded-[24px] border border-slate-100 space-y-4 shadow-inner">
            <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Define New Interval</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <Input 
                  type="time" 
                  value={newSlot.startTime}
                  onChange={(e) => setNewSlot({...newSlot, startTime: e.target.value})}
                  className="bg-white rounded-xl h-11 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <Input 
                  type="time" 
                  value={newSlot.endTime}
                  onChange={(e) => setNewSlot({...newSlot, endTime: e.target.value})}
                  className="bg-white rounded-xl h-11 border-slate-200"
                />
              </div>
              <div className="space-y-1">
                <Input 
                  type="number" 
                  placeholder="Cap."
                  value={newSlot.capacity}
                  onChange={(e) => setNewSlot({...newSlot, capacity: parseInt(e.target.value)})}
                  className="bg-white rounded-xl h-11 border-slate-200"
                />
              </div>
            </div>
            <Button onClick={handleAddSlot} className="w-full bg-violet-600 hover:bg-violet-700 text-white rounded-xl h-12 font-bold shadow-lg shadow-violet-200 transition-all">
              <Plus size={18} className="mr-2" /> Add Time Slot
            </Button>
          </div>

          {/* Slots List */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Intervals</h4>
              <Badge variant="outline" className="text-[9px] font-bold uppercase tracking-widest border-slate-200 bg-white shadow-sm">
                {slots.length} Total Slots
              </Badge>
            </div>
            
            <div className="max-h-[300px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
              {slots.length === 0 ? (
                <div className="py-12 border-2 border-dashed border-slate-100 rounded-[24px] flex flex-col items-center justify-center text-slate-300">
                  <Calendar size={32} className="mb-2 opacity-50" />
                  <p className="text-xs font-bold uppercase tracking-widest italic">No slots defined yet</p>
                </div>
              ) : slots.map((slot) => (
                <div key={slot.id} className="p-4 bg-white rounded-2xl border border-slate-100 flex items-center justify-between hover:ring-2 hover:ring-violet-100 transition-all group shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-violet-500 transition-colors">
                      <Clock size={16} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{slot.startTime} — {slot.endTime}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Users size={12} className="text-slate-300" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">
                          {slot.studentsCount} / {slot.capacity} Students Assigned
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteSlot(slot.id)} className="h-9 w-9 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <DialogFooter className="bg-slate-50 p-6 border-t border-slate-100">
          <Button variant="ghost" onClick={() => onOpenChange(false)} className="rounded-xl font-bold text-slate-500 hover:bg-slate-200 h-12 px-6">
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-slate-900 hover:bg-black text-white rounded-xl h-12 px-8 font-bold shadow-xl shadow-slate-200 transition-all">
            Confirm & Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
