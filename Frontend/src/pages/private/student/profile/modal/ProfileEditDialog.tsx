import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Link as LinkIcon } from "lucide-react";

type ProfileEditDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  profile: any;
  onSave: (updatedProfile: any) => Promise<any>;
  isLoading?: boolean;
};

const ProfileEditDialog = ({ isOpen, onClose, profile, onSave, isLoading }: ProfileEditDialogProps) => {
  const [formData, setFormData] = useState(profile);
  const [newSkill, setNewSkill] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    setFormData(profile);
    setErrors({});
  }, [profile, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const result = await onSave(formData);
    if (result?.success) {
      onClose();
    } else if (result?.data?.errors) {
      const fieldErrors: { [key: string]: string } = {};
      result.data.errors.forEach((err: any) => {
        fieldErrors[err.path] = err.message;
      });
      setErrors(fieldErrors);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const updateStat = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      stats: { ...prev.stats, [field]: value }
    }));
    if (errors[field]) {
      const newErrors = { ...errors };
      delete newErrors[field];
      setErrors(newErrors);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setFormData((prev: any) => ({
      ...prev,
      skills: [...(prev.skills || []), { name: newSkill, color: "bg-blue-600" }]
    }));
    setNewSkill("");
  };

  const deleteSkill = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index)
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">Update Profile</DialogTitle>
          <DialogDescription className="text-slate-500 font-medium">Update your academic and contact information.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 py-4">
          <Tabs defaultValue="personal" className="w-full">
            <TabsList className="grid w-full grid-cols-4 rounded-2xl p-1 bg-slate-100 mb-6 font-bold uppercase tracking-widest text-[9px]">
              <TabsTrigger value="personal" className="rounded-xl p-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Contact</TabsTrigger>
              <TabsTrigger value="academic" className="rounded-xl p-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Academic</TabsTrigger>
              <TabsTrigger value="skills" className="rounded-xl p-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Skills</TabsTrigger>
              <TabsTrigger value="docs" className="rounded-xl p-2 data-[state=active]:bg-white data-[state=active]:shadow-sm">Docs</TabsTrigger>
            </TabsList>

            <TabsContent value="personal" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-slate-500">Full Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => updateField("name", e.target.value)}
                  className={`rounded-2xl h-11 border-slate-200 ${errors.name ? 'border-red-500 bg-red-50/50' : ''}`}
                />
                {errors.name && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.name}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-slate-500">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    className={`rounded-2xl h-11 border-slate-200 ${errors.email ? 'border-red-500 bg-red-50/50' : ''}`}
                  />
                  {errors.email && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.email}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-slate-500">Phone Number</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    className={`rounded-2xl h-11 border-slate-200 ${errors.phone ? 'border-red-500 bg-red-50/50' : ''}`}
                  />
                  {errors.phone && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.phone}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="location" className="text-xs font-black uppercase tracking-widest text-slate-500">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => updateField("location", e.target.value)}
                  className={`rounded-2xl h-11 border-slate-200 ${errors.location ? 'border-red-500 bg-red-50/50' : ''}`}
                />
                {errors.location && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.location}</p>}
              </div>
            </TabsContent>

            <TabsContent value="academic" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="cgpa" className="text-xs font-black uppercase tracking-widest text-slate-500">Current CGPA</Label>
                  <Input
                    id="cgpa"
                    type="number"
                    step="0.01"
                    value={formData.stats.cgpa}
                    onChange={(e) => updateStat("cgpa", e.target.value)}
                    className={`rounded-2xl h-11 border-slate-200 font-bold ${errors.cgpa ? 'border-red-500 bg-red-50/50' : ''}`}
                  />
                  {errors.cgpa && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.cgpa}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="backlogs" className="text-xs font-black uppercase tracking-widest text-slate-500">Active Backlogs</Label>
                  <Input
                    id="backlogs"
                    type="number"
                    value={formData.stats.backlogs}
                    onChange={(e) => updateStat("backlogs", e.target.value)}
                    className={`rounded-2xl h-11 border-slate-200 font-bold ${errors.backlogs ? 'border-red-500 bg-red-50/50' : ''}`}
                  />
                  {errors.backlogs && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.backlogs}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label htmlFor="year" className="text-xs font-black uppercase tracking-widest text-slate-500">Current Year</Label>
                  <Input
                    id="year"
                    type="number"
                    value={formData.stats.year}
                    onChange={(e) => updateStat("year", e.target.value)}
                    className={`rounded-2xl h-11 border-slate-200 font-bold ${errors.year ? 'border-red-500 bg-red-50/50' : ''}`}
                  />
                  {errors.year && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.year}</p>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="passingYear" className="text-xs font-black uppercase tracking-widest text-slate-500">Passing Year</Label>
                  <Input
                    id="passingYear"
                    type="number"
                    value={formData.stats.passingYear}
                    onChange={(e) => updateStat("passingYear", e.target.value)}
                    className={`rounded-2xl h-11 border-slate-200 font-bold ${errors.passingYear ? 'border-red-500 bg-red-50/50' : ''}`}
                  />
                  {errors.passingYear && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.passingYear}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dept" className="text-xs font-black uppercase tracking-widest text-slate-500">Department ID</Label>
                <Input
                  id="dept"
                  type="number"
                  value={formData.stats.departmentId}
                  onChange={(e) => updateStat("departmentId", e.target.value)}
                  className={`rounded-2xl h-11 border-slate-200 font-bold ${errors.departmentId ? 'border-red-500 bg-red-50/50' : ''}`}
                />
                {errors.departmentId && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.departmentId}</p>}
              </div>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <div className="space-y-2">
                <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Add Technical Skills</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="e.g. React"
                    className="rounded-xl h-11 border-slate-200"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  />
                  <Button type="button" onClick={addSkill} className="rounded-xl h-11 bg-slate-900 px-6">
                    <Plus size={18} />
                  </Button>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 pt-2">
                {formData.skills?.map((skill: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl">
                    <span className="text-xs font-bold text-slate-700 uppercase">{skill.name}</span>
                    <Trash2
                      size={14}
                      className="text-slate-300 hover:text-red-500 cursor-pointer ml-1 transition-colors"
                      onClick={() => deleteSkill(i)}
                    />
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="docs" className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resumeUrl" className="text-xs font-black uppercase tracking-widest text-slate-500">Resume URL</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <Input
                    id="resumeUrl"
                    value={formData.stats.resumeUrl || ''}
                    onChange={(e) => updateStat("resumeUrl", e.target.value)}
                    placeholder="https://cloudinary.com/..."
                    className={`rounded-2xl h-11 pl-10 border-slate-200 ${errors.resumeUrl ? 'border-red-500 bg-red-50/50' : ''}`}
                  />
                </div>
                {errors.resumeUrl && <p className="text-[10px] text-red-500 font-bold uppercase ml-2">{errors.resumeUrl}</p>}
                <p className="text-[10px] text-slate-400 font-bold uppercase ml-2 mt-2">Uploading via main profile will also update this link.</p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="flex-row gap-3 mt-4 pt-4 border-t border-slate-50">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest border-slate-200" disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : 'Save Changes'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
