import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ExperienceModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddExperience: (experience: any) => void;
};

const ExperienceModal = ({ isOpen, onClose, onAddExperience }: ExperienceModalProps) => {
  const [experience, setExperience] = useState({
    companyName: "",
    role: "",
    description: "",
    startDate: "",
    endDate: ""
  });

  const handleSubmit = () => {
    if (!experience.companyName.trim() || !experience.role.trim()) return;

    onAddExperience(experience);
    onClose();
    setExperience({
      companyName: "",
      role: "",
      description: "",
      startDate: "",
      endDate: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">Add Experience</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="company" className="text-xs font-black uppercase tracking-widest text-slate-500">Company</Label>
              <Input
                id="company"
                placeholder="Google"
                className="rounded-2xl h-11 border-slate-200"
                value={experience.companyName}
                onChange={(e) => setExperience({ ...experience, companyName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-xs font-black uppercase tracking-widest text-slate-500">Role</Label>
              <Input
                id="role"
                placeholder="Software Engineer"
                className="rounded-2xl h-11 border-slate-200"
                value={experience.role}
                onChange={(e) => setExperience({ ...experience, role: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-xs font-black uppercase tracking-widest text-slate-500">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                className="rounded-2xl h-11 border-slate-200"
                value={experience.startDate}
                onChange={(e) => setExperience({ ...experience, startDate: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-xs font-black uppercase tracking-widest text-slate-500">End Date (Optional)</Label>
              <Input
                id="endDate"
                type="date"
                className="rounded-2xl h-11 border-slate-200"
                value={experience.endDate}
                onChange={(e) => setExperience({ ...experience, endDate: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-slate-500">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe your role and impact..."
              className="rounded-2xl border-slate-200 min-h-[100px]"
              value={experience.description}
              onChange={(e) => setExperience({ ...experience, description: e.target.value })}
            />
          </div>
        </div>

        <DialogFooter className="flex-row gap-3 mt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest border-slate-200">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest bg-blue-600">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExperienceModal;
