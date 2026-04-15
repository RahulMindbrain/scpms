import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { toast } from "sonner";

const allSkills = [
  { id: 1, name: "React" },
  { id: 2, name: "Node.js" },
  { id: 3, name: "Java" },
  { id: 4, name: "Python" }
];

const ProfileEditDialog = ({ isOpen, onClose, profile, onSave, isLoading }: any) => {
  const [formData, setFormData] = useState(profile);
  const [errors, setErrors] = useState<any>({});
  const [isUploading, setIsUploading] = useState(false);

  const { upload } = useCloudinaryUpload();

  useEffect(() => {
    setFormData(profile);
    setErrors({});
  }, [profile, isOpen]);

  const updateField = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateStat = (field: string, value: any) => {
    setFormData((prev: any) => ({
      ...prev,
      stats: { ...prev.stats, [field]: value }
    }));
  };

  const addSkill = (skill: any) => {
    if (!skill) return;
    setFormData((prev: any) => ({
      ...prev,
      skills: [...(prev.skills || []), skill]
    }));
  };

  const removeSkill = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const res = await onSave(formData);
    if (res?.success) onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle>Update Profile</DialogTitle>
          <DialogDescription>Edit your details</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="contact">

            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="contact">Contact</TabsTrigger>
              <TabsTrigger value="academic">Academic</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
            </TabsList>

            {/* CONTACT */}
            <TabsContent value="contact" className="space-y-4">
              <Input placeholder="Name" value={formData.name} onChange={(e) => updateField("name", e.target.value)} />
              <Input placeholder="Email" value={formData.email} onChange={(e) => updateField("email", e.target.value)} />
              <Input placeholder="Phone" value={formData.phone} onChange={(e) => updateField("phone", e.target.value)} />
              <Input placeholder="Location" value={formData.location} onChange={(e) => updateField("location", e.target.value)} />
            </TabsContent>

            {/* ACADEMIC */}
            <TabsContent value="academic" className="space-y-4">
              <Input type="number" placeholder="CGPA" value={formData.stats?.cgpa} onChange={(e) => updateStat("cgpa", e.target.value)} />
              <Input type="number" placeholder="Backlogs" value={formData.stats?.backlogs} onChange={(e) => updateStat("backlogs", e.target.value)} />
              <Input type="number" placeholder="Year" value={formData.stats?.year} onChange={(e) => updateStat("year", e.target.value)} />
              <Input type="number" placeholder="Passing Year" value={formData.stats?.passingYear} onChange={(e) => updateStat("passingYear", e.target.value)} />
              <Input type="number" placeholder="Department ID" value={formData.stats?.departmentId} onChange={(e) => updateStat("departmentId", e.target.value)} />
            </TabsContent>

            {/* SKILLS */}
            <TabsContent value="skills" className="space-y-4">
              <select
                onChange={(e) => {
                  const skill = allSkills.find(s => s.id === Number(e.target.value));
                  addSkill(skill);
                }}
              >
                <option value="">Select Skill</option>
                {allSkills.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <div className="flex flex-wrap gap-2">
                {formData.skills?.map((skill: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 border px-3 py-1 rounded">
                    {skill.name}
                    <Trash2 size={14} onClick={() => removeSkill(i)} />
                  </div>
                ))}
              </div>
            </TabsContent>

          </Tabs>

          {/* RESUME */}
          <div>
            <Label>Resume</Label>
            <Input
              placeholder="Resume URL"
              value={formData.stats?.resumeUrl || ''}
              onChange={(e) => updateStat("resumeUrl", e.target.value)}
            />

            <input
              type="file"
              accept=".pdf"
              onChange={async (e: any) => {
                const file = e.target.files[0];
                if (!file) return;

                setIsUploading(true);
                const url = await upload(file, "resumes");
                if (url) {
                  updateStat("resumeUrl", url);
                  toast.success("Uploaded");
                }
                setIsUploading(false);
              }}
            />
          </div>

          <DialogFooter>
            <Button type="button" onClick={onClose}>Cancel</Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? <Loader2 className="animate-spin" /> : "Save"}
            </Button>
          </DialogFooter>

        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;