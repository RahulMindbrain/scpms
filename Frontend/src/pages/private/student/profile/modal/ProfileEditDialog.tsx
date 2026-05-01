import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, Upload, Globe, User, FileText, X } from "lucide-react";
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import Loader from "@/components/Loader";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { getAPI } from "@/apis/api";

const profileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  linkedinUrl: z.string().url("Invalid LinkedIn URL").or(z.literal("")).nullable(),
  githubUrl: z.string().url("Invalid GitHub URL").or(z.literal("")).nullable(),
  portfolioUrl: z.string().url("Invalid Portfolio URL").or(z.literal("")).nullable(),
  stats: z.object({
    cgpa: z.coerce.number().min(0, "CGPA cannot be negative").max(10, "CGPA must be 10 or less"),
    year: z.coerce.number().min(1, "Year must be at least 1").max(5, "Year must be 5 or less"),
    passingYear: z.coerce.number().min(2000, "Invalid year").max(2100, "Invalid year"),
    departmentId: z.coerce.number().min(1, "Required"),
    activeBacklogs: z.coerce.number().min(0, "Cannot be negative"),
  }),
  resumeUrl: z.string().url("Invalid Resume URL").or(z.literal("")).nullable(),
});

type SkillOption = {
  id: number;
  name: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const ProfileEditDialog = ({ isOpen, onClose, profile, onSave, isLoading }: any) => {
  const [formData, setFormData] = useState<any>(profile);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isUploading, setIsUploading] = useState(false);
  const [resumeName, setResumeName] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [allSkillsList, setAllSkillsList] = useState<string[]>([]);
  const [allDepartmentsList, setAllDepartmentsList] = useState<any[]>([]);

  const { upload } = useCloudinaryUpload();

  useEffect(() => {
    if (isOpen) {
      setFormData({
        ...profile,
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
        portfolioUrl: profile.portfolioUrl || "",
        stats: {
          ...profile.stats,
          activeBacklogs: profile.stats?.activeBacklogs ?? profile.activeBacklogs ?? '',
          cgpa: profile.stats?.cgpa ?? profile.cgpa ?? '',
          year: profile.stats?.year ?? profile.year ?? '',
          passingYear: profile.stats?.passingYear ?? profile.passingYear ?? '',
          departmentId: profile.stats?.departmentId || profile.departmentId || "",
        },
        resumeUrl: profile.resumeUrl || ""
      });
      setResumeName(profile.resumeUrl ? "Current Resume" : "");
      setErrors({});
    }
  }, [profile, isOpen]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, deptRes] = await Promise.all([
          getAPI<ApiResponse<SkillOption[]>>("/skills/get-all").catch(() => null),
          getAPI<any>("/dept/").catch(() => null)
        ]);

        if (skillsRes) {
          const skillNames = Array.isArray(skillsRes.data)
            ? skillsRes.data.map((skill) => skill.name)
            : [];
          setAllSkillsList(skillNames);
        }

        if (deptRes) {
          const depts = Array.isArray(deptRes.data?.data)
            ? deptRes.data.data
            : Array.isArray(deptRes.data)
              ? deptRes.data
              : Array.isArray(deptRes)
                ? deptRes
                : [];
          setAllDepartmentsList(depts);
        }
      } catch (error) {
        setAllSkillsList([]);
        setAllDepartmentsList([]);
      }
    };

    if (isOpen) {
      void fetchData();
    }
  }, [isOpen]);

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
    if (errors[`stats.${field}`]) {
      const newErrors = { ...errors };
      delete newErrors[`stats.${field}`];
      setErrors(newErrors);
    }
  };

  const addSkill = (skillName: string) => {
    const trimmed = skillName.trim();
    if (!trimmed) return;
    if (formData.skills?.some((s: any) => s.name.toLowerCase() === trimmed.toLowerCase())) {
      toast.error("Skill already added");
      return;
    }
    setFormData((prev: any) => ({
      ...prev,
      skills: [...(prev.skills || []), { name: trimmed, color: 'bg-indigo-500/100' }]
    }));
    setSkillInput("");
  };

  const removeSkill = (index: number) => {
    setFormData((prev: any) => ({
      ...prev,
      skills: prev.skills.filter((_: any, i: number) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      profileSchema.parse(formData);
      const res = await onSave(formData);
      if (res?.success) onClose();
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        //@ts-ignore
        err.errors.forEach((e: any) => {
          const path = e.path.join(".");
          newErrors[path] = e.message;
        });
        setErrors(newErrors);
        toast.error("Please fix the errors in the form");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto rounded-2xl p-0 bg-[#1e1f26] border border-[rgba(255,255,255,0.08)] shadow-2xl">
        <DialogHeader className="p-7 pb-4 bg-[#191b22] border-b border-[rgba(255,255,255,0.06)] rounded-t-2xl">
          <DialogTitle className="text-xl font-bold text-[#e2e2eb] flex items-center gap-2">
            <User className="h-6 w-6" />
            Update Student Profile
          </DialogTitle>
          <DialogDescription className="text-[#908fa0] text-sm">
            Keep your professional profile up to date for better opportunities.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-0">
          <div className="p-7 pt-4">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8 bg-[rgba(255,255,255,0.06)] p-1 rounded-xl">
                <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-[#191b22] data-[state=active]:text-[#e2e2eb] data-[state=active]:shadow-sm">Personal</TabsTrigger>
                <TabsTrigger value="academic" className="rounded-lg data-[state=active]:bg-[#191b22] data-[state=active]:text-[#e2e2eb] data-[state=active]:shadow-sm">Academic</TabsTrigger>
                <TabsTrigger value="social" className="rounded-lg data-[state=active]:bg-[#191b22] data-[state=active]:text-[#e2e2eb] data-[state=active]:shadow-sm">Social</TabsTrigger>
                <TabsTrigger value="skills" className="rounded-lg data-[state=active]:bg-[#191b22] data-[state=active]:text-[#e2e2eb] data-[state=active]:shadow-sm">Skills</TabsTrigger>
              </TabsList>

              {/* PERSONAL CONTENT */}
              <TabsContent value="personal" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-semibold text-[#c7c4d7] ml-1">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-[#908fa0]" />
                      <Input
                        id="name"
                        placeholder="e.g. John Doe"
                        className={`pl-10 h-11 rounded-xl ${errors.name ? 'border-red-500 focus-visible:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                        value={formData.name || ""}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>
                    {errors.name && <p className="text-xs text-red-500 font-medium ml-1">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-semibold text-[#c7c4d7] ml-1">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className={`h-11 rounded-xl ${errors.email ? 'border-red-500 focus-visible:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                      value={formData.email || ""}
                      onChange={(e) => updateField("email", e.target.value)}
                    />
                    {errors.email && <p className="text-xs text-red-500 font-medium ml-1">{errors.email}</p>}
                  </div>

                </div>
              </TabsContent>

              {/* ACADEMIC CONTENT */}
              <TabsContent value="academic" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="cgpa" className="text-sm font-semibold text-[#c7c4d7] ml-1">Current CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      className={`h-11 rounded-xl ${errors['stats.cgpa'] ? 'border-red-500 focus-visible:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                      value={formData.stats?.cgpa || ""}
                      onChange={(e) => updateStat("cgpa", e.target.value)}
                    />
                    {errors['stats.cgpa'] && <p className="text-xs text-red-500 font-medium ml-1">{errors['stats.cgpa']}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="backlogs" className="text-sm font-semibold text-[#c7c4d7] ml-1">Active Backlogs</Label>
                    <Input
                      id="backlogs"
                      type="number"
                      placeholder="0"
                      className={`h-11 rounded-xl ${errors['stats.activeBacklogs'] ? 'border-red-500 focus-visible:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                      value={formData.stats?.activeBacklogs || 0}
                      onChange={(e) => updateStat("activeBacklogs", e.target.value)}
                    />
                    {errors['stats.activeBacklogs'] && <p className="text-xs text-red-500 font-medium ml-1">{errors['stats.activeBacklogs']}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-semibold text-[#c7c4d7] ml-1">Current Year</Label>
                    <Input
                      id="year"
                      type="number"
                      placeholder="3"
                      className={`h-11 rounded-xl ${errors['stats.year'] ? 'border-red-500 focus-visible:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                      value={formData.stats?.year || ""}
                      onChange={(e) => updateStat("year", e.target.value)}
                    />
                    {errors['stats.year'] && <p className="text-xs text-red-500 font-medium ml-1">{errors['stats.year']}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passingYear" className="text-sm font-semibold text-[#c7c4d7] ml-1">Passing Year</Label>
                    <Input
                      id="passingYear"
                      type="number"
                      placeholder="2026"
                      className={`h-11 rounded-xl ${errors['stats.passingYear'] ? 'border-red-500 focus-visible:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                      value={formData.stats?.passingYear || ""}
                      onChange={(e) => updateStat("passingYear", e.target.value)}
                    />
                    {errors['stats.passingYear'] && <p className="text-xs text-red-500 font-medium ml-1">{errors['stats.passingYear']}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="departmentId" className="text-sm font-semibold text-[#c7c4d7] ml-1">Department</Label>
                    <select
                      id="departmentId"
                      className={`flex h-11 w-full rounded-xl border bg-[#0c0e14] text-[#e2e2eb] px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${errors['stats.departmentId'] ? 'border-red-500 focus-visible:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                      value={formData.stats?.departmentId || ""}
                      onChange={(e) => updateStat("departmentId", e.target.value)}
                    >
                      <option value="" disabled>Select Department</option>
                      {allDepartmentsList.map((dept: any) => (
                        <option key={dept.id} value={dept.id}>{dept.name}</option>
                      ))}
                    </select>
                    {errors['stats.departmentId'] && <p className="text-xs text-red-500 font-medium ml-1">{errors['stats.departmentId']}</p>}
                  </div>
                </div>
              </TabsContent>

              {/* SOCIAL CONTENT */}
              <TabsContent value="social" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl" className="text-sm font-semibold text-[#c7c4d7] ml-1">LinkedIn Profile URL</Label>
                    <div className="relative">
                      {/* <Linkedin className="absolute left-3 top-3 h-4 w-4 text-[#0077B5]" /> */}
                      <Input
                        id="linkedinUrl"
                        placeholder="https://linkedin.com/in/username"
                        className={`pl-10 h-11 rounded-xl ${errors.linkedinUrl ? 'border-red-500 focus-visible:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                        value={formData.linkedinUrl || ""}
                        onChange={(e) => updateField("linkedinUrl", e.target.value)}
                      />
                    </div>
                    {errors.linkedinUrl && <p className="text-xs text-red-500 font-medium ml-1">{errors.linkedinUrl}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="githubUrl" className="text-sm font-semibold text-[#c7c4d7] ml-1">GitHub Profile URL</Label>
                    <div className="relative">
                      {/* <Github className="absolute left-3 top-3 h-4 w-4 text-[#333]" /> */}
                      <Input
                        id="githubUrl"
                        placeholder="https://github.com/username"
                        className={`pl-10 h-11 rounded-xl ${errors.githubUrl ? 'border-red-500 focus-visible:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                        value={formData.githubUrl || ""}
                        onChange={(e) => updateField("githubUrl", e.target.value)}
                      />
                    </div>
                    {errors.githubUrl && <p className="text-xs text-red-500 font-medium ml-1">{errors.githubUrl}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl" className="text-sm font-semibold text-[#c7c4d7] ml-1">Portfolio Website URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-3 h-4 w-4 text-[#908fa0]" />
                      <Input
                        id="portfolioUrl"
                        placeholder="https://yourportfolio.com"
                        className={`pl-10 h-11 rounded-xl ${errors.portfolioUrl ? 'border-red-500 focus-visible:ring-red-500' : 'border-[rgba(255,255,255,0.08)]'}`}
                        value={formData.portfolioUrl || ""}
                        onChange={(e) => updateField("portfolioUrl", e.target.value)}
                      />
                    </div>
                    {errors.portfolioUrl && <p className="text-xs text-red-500 font-medium ml-1">{errors.portfolioUrl}</p>}
                  </div>
                </div>
              </TabsContent>

              {/* SKILLS CONTENT */}
              <TabsContent value="skills" className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-[#c7c4d7] ml-1">Add Skills</Label>
                    <div className="flex gap-2">
                      <select
                        className="flex h-11 w-full rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0e14] text-[#e2e2eb] px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        value={skillInput}
                        onChange={(e) => {
                          if (e.target.value) addSkill(e.target.value);
                        }}
                      >
                        <option value="">Select a skill...</option>
                        {allSkillsList.map(skill => (
                          <option key={skill} value={skill}>{skill}</option>
                        ))}
                      </select>
                      <div className="relative flex-1">
                        <Input
                          placeholder="Or type custom skill"
                          className="h-11 rounded-xl border-[rgba(255,255,255,0.08)] pr-10"
                          value={skillInput}
                          onChange={(e) => setSkillInput(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSkill(skillInput);
                            }
                          }}
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="absolute right-1 top-1 h-9 w-9 text-indigo-400 hover:bg-blue-50"
                          onClick={() => addSkill(skillInput)}
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="bg-[#191b22] p-6 rounded-2xl border border-dashed border-[rgba(255,255,255,0.08)] min-h-[120px]">
                    <Label className="text-xs font-bold text-[#908fa0] uppercase tracking-widest mb-4 block">Selected Skills</Label>
                    <div className="flex flex-wrap gap-2">
                      {formData.skills?.length > 0 ? (
                        formData.skills.map((skill: any, i: number) => (
                          <Badge
                            key={i}
                            variant="secondary"
                            className="pl-3 pr-1 py-1.5 rounded-lg bg-[#1e1f26] border border-[rgba(255,255,255,0.06)] shadow-sm flex items-center gap-1 group transition-all hover:border-indigo-500/30"
                          >
                            <span className="text-sm font-semibold text-[#c7c4d7]">{skill.name}</span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6 rounded-md hover:bg-red-500/10 hover:text-red-400 transition-colors"
                              onClick={() => removeSkill(i)}
                            >
                              <X className="h-3.5 w-3.5" />
                            </Button>
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-[#908fa0] italic text-center w-full py-4">No skills added yet.</p>
                      )}
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="my-8" />

            {/* RESUME SECTION */}
            <div className="space-y-4">
              <Label className="text-sm font-bold text-[#c7c4d7] flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Resume Document
              </Label>
              <div className="shrink-0">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;

                    setResumeName(file.name);
                    setIsUploading(true);
                    try {
                      const url = await upload(file, "resumes");
                      if (url) {
                        updateField("resumeUrl", url);
                        toast.success("Resume uploaded successfully");
                      }
                    } catch (error) {
                      toast.error("Failed to upload resume");
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10 gap-2 px-6"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader size="sm" /> : <Upload className="h-4 w-4" />}
                  {isUploading ? "Uploading Resume..." : (formData.resumeUrl ? "Change Resume" : "Upload PDF Resume")}
                </Button>
              </div>
              {isUploading && (
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium bg-indigo-500/10 px-3 py-2 rounded-lg border border-indigo-500/20 w-fit">
                  <Loader size="sm" />
                  Uploading {resumeName}...
                </div>
              )}
              {!isUploading && formData.resumeUrl && (
                <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-3 py-2 rounded-lg border border-emerald-500/20 w-fit">
                  <Badge className="h-2 w-2 rounded-full bg-green-500 p-0" />
                  {resumeName || "Resume linked successfully"}
                </div>
              )}
            </div>
          </div>

          <DialogFooter className="p-7 bg-[#191b22] rounded-b-2xl border-t border-[rgba(255,255,255,0.06)]">
            <DialogClose asChild>
              <Button type="button" variant="ghost" className="rounded-xl h-11 px-6 font-semibold">Cancel</Button>
            </DialogClose>
            <Button
              type="submit"
              className="rounded-xl bg-indigo-600 hover:bg-indigo-700 h-11 px-8 font-bold shadow-lg shadow-indigo-500/20 transition-all active:scale-95"
              disabled={isLoading || isUploading}
            >
              {isLoading ? (
                <>
                  <Loader size="sm" />
                  Saving Changes...
                </>
              ) : "Save Profile Details"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;
