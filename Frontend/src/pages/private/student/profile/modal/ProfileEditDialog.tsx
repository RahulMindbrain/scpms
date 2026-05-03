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
import { Plus, Upload, Globe, User, FileText, X, Mail, Link as LinkIcon, GraduationCap, Code2 } from "lucide-react";
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
    cgpa: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().min(0, "CGPA cannot be negative").max(10, "CGPA must be 10 or less").optional()),
    year: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().min(1, "Year must be at least 1").max(5, "Year must be 5 or less")),
    passingYear: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().min(2000, "Invalid year").max(2100, "Invalid year")),
    departmentId: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().min(1, "Required")),
    activeBacklogs: z.preprocess((val) => (val === "" ? undefined : val), z.coerce.number().min(0, "Cannot be negative").default(0)),
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
  const [allSkillsList, setAllSkillsList] = useState<SkillOption[]>([]);
  const [allDepartmentsList, setAllDepartmentsList] = useState<any[]>([]);

  const { upload } = useCloudinaryUpload();

  useEffect(() => {
    if (isOpen && profile) {
      const newFormData = {
        name: profile.name || "",
        email: profile.email || "",
        stats: {
          activeBacklogs: profile.stats?.activeBacklogs ?? profile.activeBacklogs ?? '',
          cgpa: profile.stats?.cgpa ?? profile.cgpa ?? '',
          year: profile.stats?.year ?? profile.year ?? '',
          passingYear: profile.stats?.passingYear ?? profile.passingYear ?? '',
          departmentId: profile.stats?.departmentId || profile.departmentId || "",
        },
        linkedinUrl: profile.linkedinUrl || "",
        githubUrl: profile.githubUrl || "",
        portfolioUrl: profile.portfolioUrl || "",
        resumeUrl: profile.resumeUrl || "",
        skills: profile.skills || [],
        experiences: profile.experiences || [],
        certificates: profile.certificates || [],
        projects: profile.projects || [],
      };
      setFormData(newFormData);
      setResumeName(profile.resumeUrl ? "Current Resume" : "");
    }
  }, [isOpen, profile]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [skillsRes, deptRes] = await Promise.all([
          getAPI<ApiResponse<SkillOption[]>>("/skills/get-all").catch(() => null),
          getAPI<any>("/dept/").catch(() => null)
        ]);

        if (skillsRes) {
          setAllSkillsList(Array.isArray(skillsRes.data) ? skillsRes.data : []);
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

  const addSkill = (skill: string | SkillOption) => {
    const skillName = typeof skill === 'string' ? skill.trim() : skill.name;
    const skillId = typeof skill === 'string' ? undefined : skill.id;

    if (!skillName) return;
    
    if (formData.skills?.some((s: any) => s.name.toLowerCase() === skillName.toLowerCase())) {
      toast.error("Skill already added");
      return;
    }

    setFormData((prev: any) => ({
      ...prev,
      skills: [...(prev.skills || []), { id: skillId, name: skillName }]
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
        const issues = err.issues || (err as any).errors || [];
        issues.forEach((e: any) => {
          const path = e.path.join(".");
          newErrors[path] = e.message;
        });
        setErrors(newErrors);
        toast.error("Please check the form for errors");
      }
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden p-0 bg-white dark:bg-slate-900 border-none shadow-2xl rounded-2xl flex flex-col">
        <DialogHeader className="p-8 pb-4 bg-[#fbfdff] dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-500/10 rounded-lg">
              <User className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-slate-800 dark:text-white">Edit Profile</DialogTitle>
              <DialogDescription className="text-slate-500 dark:text-slate-400 text-sm">Update your information and academic details</DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-8 pt-6 space-y-8">
            <Tabs defaultValue="personal" className="w-full">
              <TabsList className="grid grid-cols-4 mb-8 bg-[#f1f5f9]/50 dark:bg-slate-800 p-1.5 rounded-xl">
                <TabsTrigger value="personal" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm font-semibold">Personal</TabsTrigger>
                <TabsTrigger value="academic" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm font-semibold">Academic</TabsTrigger>
                <TabsTrigger value="social" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm font-semibold">Social</TabsTrigger>
                <TabsTrigger value="skills" className="rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-slate-700 data-[state=active]:text-blue-600 dark:data-[state=active]:text-blue-400 data-[state=active]:shadow-sm font-semibold">Skills</TabsTrigger>
              </TabsList>

              {/* PERSONAL CONTENT */}
              <TabsContent value="personal" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold text-slate-700 dark:text-slate-300">Full Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="name"
                        className={`pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-blue-500 ${errors.name ? 'border-rose-500' : ''}`}
                        value={formData.name || ""}
                        onChange={(e) => updateField("name", e.target.value)}
                      />
                    </div>
                    {errors.name && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold text-slate-700 dark:text-slate-300">Email Address</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="email"
                        type="email"
                        className={`pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-blue-500 ${errors.email ? 'border-rose-500' : ''}`}
                        value={formData.email || ""}
                        onChange={(e) => updateField("email", e.target.value)}
                      />
                    </div>
                    {errors.email && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors.email}</p>}
                  </div>
                </div>
              </TabsContent>

              {/* ACADEMIC CONTENT */}
              <TabsContent value="academic" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="departmentId" className="text-sm font-bold text-slate-700 dark:text-slate-300">Department</Label>
                    <div className="relative">
                       <GraduationCap className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                       <select
                        id="departmentId"
                        className={`pl-10 flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors['stats.departmentId'] ? 'border-rose-500' : ''}`}
                        value={formData.stats?.departmentId || ""}
                        onChange={(e) => updateStat("departmentId", e.target.value)}
                      >
                        <option value="" disabled>Select Department</option>
                        {allDepartmentsList.map((dept: any) => (
                          <option key={dept.id} value={dept.id}>{dept.name}</option>
                        ))}
                      </select>
                    </div>
                    {errors['stats.departmentId'] && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors['stats.departmentId']}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cgpa" className="text-sm font-bold text-slate-700 dark:text-slate-300">Current CGPA</Label>
                    <Input
                      id="cgpa"
                      type="number"
                      step="0.01"
                      placeholder="0.0"
                      className={`h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-blue-500 ${errors['stats.cgpa'] ? 'border-rose-500' : ''}`}
                      value={formData.stats?.cgpa || ""}
                      onChange={(e) => updateStat("cgpa", e.target.value)}
                    />
                    {errors['stats.cgpa'] && <p className="text-[10px] text-rose-500 font-bold uppercase">{errors['stats.cgpa']}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="year" className="text-sm font-bold text-slate-700 dark:text-slate-300">Current Year</Label>
                    <Input
                      id="year"
                      type="number"
                      className={`h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-blue-500 ${errors['stats.year'] ? 'border-rose-500' : ''}`}
                      value={formData.stats?.year || ""}
                      onChange={(e) => updateStat("year", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passingYear" className="text-sm font-bold text-slate-700 dark:text-slate-300">Batch (Passing Year)</Label>
                    <Input
                      id="passingYear"
                      type="number"
                      className={`h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-blue-500 ${errors['stats.passingYear'] ? 'border-rose-500' : ''}`}
                      value={formData.stats?.passingYear || ""}
                      onChange={(e) => updateStat("passingYear", e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="activeBacklogs" className="text-sm font-bold text-slate-700 dark:text-slate-300">Active Backlogs</Label>
                    <Input
                      id="activeBacklogs"
                      type="number"
                      placeholder="0"
                      className={`h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-blue-500 ${errors['stats.activeBacklogs'] ? 'border-rose-500' : ''}`}
                      value={formData.stats?.activeBacklogs ?? ""}
                      onChange={(e) => updateStat("activeBacklogs", e.target.value)}
                    />
                  </div>
                </div>
              </TabsContent>

              {/* SOCIAL CONTENT */}
              <TabsContent value="social" className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="linkedinUrl" className="text-sm font-bold text-slate-700 dark:text-slate-300">LinkedIn URL</Label>
                    <div className="relative">
                      <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="linkedinUrl"
                        placeholder="https://linkedin.com/in/..."
                        className={`pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-blue-500 ${errors.linkedinUrl ? 'border-rose-500' : ''}`}
                        value={formData.linkedinUrl || ""}
                        onChange={(e) => updateField("linkedinUrl", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="githubUrl" className="text-sm font-bold text-slate-700 dark:text-slate-300">GitHub URL</Label>
                    <div className="relative">
                      <Code2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="githubUrl"
                        placeholder="https://github.com/..."
                        className={`pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-blue-500 ${errors.githubUrl ? 'border-rose-500' : ''}`}
                        value={formData.githubUrl || ""}
                        onChange={(e) => updateField("githubUrl", e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="portfolioUrl" className="text-sm font-bold text-slate-700 dark:text-slate-300">Portfolio Website URL</Label>
                    <div className="relative">
                      <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                      <Input
                        id="portfolioUrl"
                        placeholder="https://yourportfolio.com"
                        className={`pl-10 h-11 rounded-xl border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 focus:ring-blue-500 ${errors.portfolioUrl ? 'border-rose-500' : ''}`}
                        value={formData.portfolioUrl || ""}
                        onChange={(e) => updateField("portfolioUrl", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* SKILLS CONTENT */}
              <TabsContent value="skills" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex flex-col gap-2">
                    <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Add Technical Skills</Label>
                    <select
                      className="flex h-11 w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value=""
                      onChange={(e) => {
                        const selectedSkill = allSkillsList.find(s => s.id === parseInt(e.target.value));
                        if (selectedSkill) addSkill(selectedSkill);
                      }}
                    >
                      <option value="">Select a skill to add...</option>
                      {allSkillsList.map(skill => (
                        <option key={skill.id} value={skill.id}>{skill.name}</option>
                      ))}
                    </select>
                    <p className="text-[10px] text-slate-400 font-medium ml-1">Choose from our verified list of technical skills</p>
                  </div>


                  <div className="flex flex-wrap gap-2 p-4 border rounded-xl border-slate-100 dark:border-slate-800 bg-[#f8fafc] dark:bg-slate-900/50 min-h-[100px]">
                    {formData.skills?.length > 0 ? (
                      formData.skills.map((skill: any, i: number) => (
                        <Badge key={i} className="pl-3 pr-1 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 flex items-center gap-1 shadow-sm">
                          <span className="text-xs font-bold">{skill.name}</span>
                          <Button type="button" variant="ghost" size="icon" className="h-5 w-5 hover:text-rose-500" onClick={() => removeSkill(i)}>
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))
                    ) : (
                      <p className="text-xs text-slate-400 italic m-auto">Add your technical arsenal</p>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <Separator className="bg-slate-100 dark:bg-slate-800" />

            {/* RESUME SECTION */}
            <div className="space-y-4">
              <Label className="text-sm font-bold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                <FileText className="h-4 w-4 text-blue-600" />
                Resume (PDF)
              </Label>
              <div className="flex items-center gap-4">
                <input
                  type="file"
                  id="resume-upload"
                  accept=".pdf"
                  className="hidden"
                  onChange={async (e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    setIsUploading(true);
                    try {
                      const url = await upload(file, "resumes");
                      if (url) {
                        updateField("resumeUrl", url);
                        setResumeName(file.name);
                        toast.success("Resume uploaded");
                      }
                    } catch (error) {
                      toast.error("Upload failed");
                    } finally {
                      setIsUploading(false);
                    }
                  }}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="h-11 rounded-xl border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 gap-2"
                  onClick={() => document.getElementById('resume-upload')?.click()}
                  disabled={isUploading}
                >
                  {isUploading ? <Loader size="sm" /> : <Upload className="h-4 w-4" />}
                  {formData.resumeUrl ? "Change Document" : "Upload Resume"}
                </Button>
                {formData.resumeUrl && !isUploading && (
                  <Badge variant="outline" className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 py-1.5 font-bold uppercase text-[10px]">
                    Linked Successfully
                  </Badge>
                )}
              </div>
            </div>
          </div>
        </form>

        <DialogFooter className="p-8 bg-[#fbfdff] dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 shrink-0">
          <DialogClose asChild>
            <Button type="button" variant="ghost" className="rounded-xl h-12 px-6 font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-200/50 dark:hover:bg-slate-700/50">Cancel</Button>
          </DialogClose>
          <Button
            type="submit"
            onClick={handleSubmit}
            className="rounded-xl bg-blue-600 hover:bg-blue-700 h-12 px-10 font-bold text-white shadow-lg shadow-blue-600/20 active:scale-95 transition-all"
            disabled={isLoading || isUploading}
          >
            {isLoading ? <Loader size="sm" /> : "Save Profile Details"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileEditDialog;