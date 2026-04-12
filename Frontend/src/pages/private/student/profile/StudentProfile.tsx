import {
  User, Mail, Phone, MapPin, GraduationCap,
  Code2, Edit3, ExternalLink, Plus, Trash2,
  Upload, Camera, Briefcase, Loader2, FileText, Calendar, Building2
} from 'lucide-react';
import ProjectModal from './modal/ProjectModal';
import { uploadToCloudinary } from '../../../../lib/cloudinary';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStudentProfile, createStudentProfile, updateStudentProfile } from '../../../../redux/thunks/studentThunk';
import { useEffect, useState, useRef } from 'react';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import ExperienceModal from './modal/ExperienceModal';
import CertificateModal from './modal/CertificateModal';
import ProfileEditDialog from './modal/ProfileEditDialog';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const StudentProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile: backendProfile, loading: backendLoading } = useSelector((state: RootState) => state.student);
  const { user } = useSelector((state: RootState) => state.auth);

  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [showProfileEditDialog, setShowProfileEditDialog] = useState(false)
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const profileImageInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState<any>({
    name: user ? `${user.firstname} ${user.lastname}` : 'Student Name',
    profileImage: null,
    batch: '2026 Batch',
    branch: 'B.Tech Computer Science',
    email: user?.email || '',
    phone: '',
    location: '',
    stats: {
      cgpa: '0.0',
      tenth: '0%',
      twelfth: '0%',
      backlogs: '0',
      rollNo: '',
      department: '',
      year: 1,
      passingYear: 2026,
      departmentId: 1
    },
    skills: [],
    projects: [],
    experiences: [],
    certificates: [],
    resumes: []
  });

  useEffect(() => {
    dispatch(fetchStudentProfile());
  }, [dispatch]);

  useEffect(() => {
    if (backendProfile) {
      setProfile((prev: any) => ({
        ...prev,
        ...backendProfile,
        name: user ? `${user.firstname} ${user.lastname}` : 'Student Name',
        email: user?.email || '',
        stats: {
          ...prev.stats,
          cgpa: backendProfile.cgpa?.toString() || '0.0',
          year: backendProfile.year || 1,
          passingYear: backendProfile.passingYear || 2026,
          departmentId: backendProfile.departmentId || 1,
        },
        skills: backendProfile.skills?.map((s: string) => ({ name: s, color: 'bg-blue-500' })) || [],
        resumes: backendProfile.resumeUrl ? [{ name: 'Resume', url: backendProfile.resumeUrl, date: 'N/A', size: 'N/A' }] : []
      }));
    }
  }, [backendProfile, user]);

  const handleSave = async (updatedData?: any) => {
    const dataToSave = updatedData ? {
      departmentId: parseInt(updatedData.stats.departmentId),
      year: parseInt(updatedData.stats.year),
      passingYear: parseInt(updatedData.stats.passingYear),
      cgpa: parseFloat(updatedData.stats.cgpa),
      resumeUrl: updatedData.stats.resumeUrl || updatedData.resumes[0]?.url || "",
      skills: updatedData.skills.map((s: any) => s.name),
      experiences: updatedData.experiences || [],
      certificates: updatedData.certificates || [],
    } : {
      departmentId: parseInt(profile.stats.departmentId),
      year: parseInt(profile.stats.year),
      passingYear: parseInt(profile.stats.passingYear),
      cgpa: parseFloat(profile.stats.cgpa),
      resumeUrl: profile.stats.resumeUrl || profile.resumes[0]?.url || "",
      skills: profile.skills.map((s: any) => s.name),
      experiences: profile.experiences || [],
      certificates: profile.certificates || [],
    };

    if (updatedData) {
      setProfile(updatedData);
    }

    const toastId = toast.loading("Saving profile...");
    try {
      if (backendProfile) {
        await dispatch(updateStudentProfile(dataToSave)).unwrap();
      } else {
        await dispatch(createStudentProfile(dataToSave)).unwrap();
      }
      toast.success("Profile saved successfully!", { id: toastId });
      return { success: true };
    } catch (error: any) {
      toast.error(error?.message || "Failed to save profile", { id: toastId });
      return error;
    }
  };

  const handleProfileImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const toastId = toast.loading("Uploading profile image...");
    try {
      const url = await uploadToCloudinary(file);
      setProfile({ ...profile, profileImage: url });
      toast.success("Profile image updated!", { id: toastId });
    } catch (error) {
      toast.error("Failed to upload image", { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingResume(true);
    const toastId = toast.loading("Uploading resume to Cloudinary...");
    try {
      const url = await uploadToCloudinary(file);
      const newResume = {
        name: file.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: `${(file.size / 1024).toFixed(1)} KB`,
        url: url
      };
      setProfile({
        ...profile,
        stats: {
          ...profile.stats,
          resumeUrl: url
        },
        resumes: [newResume, ...profile.resumes]
      });
      toast.success("Resume uploaded successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to upload resume", { id: toastId });
    } finally {
      setIsUploadingResume(false);
    }
  }

  const handleAddProject = (project: any) => {
    const updatedProfile = {
      ...profile,
      projects: [...profile.projects, project]
    };
    setProfile(updatedProfile);
  };

  const handleAddExperience = (exp: any) => {
    const updatedProfile = {
      ...profile,
      experiences: [...(profile.experiences || []), exp]
    };
    handleSave(updatedProfile);
  };

  const handleAddCertificate = (cert: any) => {
    const updatedProfile = {
      ...profile,
      certificates: [...(profile.certificates || []), cert]
    };
    handleSave(updatedProfile);
  };


  return (
    <div className="space-y-6 animate-in fade-in duration-500 mt-2 p-4 md:p-6">
      {/* Profile Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your academic and professional identity.</p>
        </div>
        <Button
          onClick={() => setShowProfileEditDialog(true)}
          disabled={backendLoading}
          className="gap-2"
        >
          {backendLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          Edit Profile
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Sidebar - Personal Details & Academics */}
        <div className="md:col-span-1 space-y-6">
           <Card className="overflow-hidden">
             <div className="h-24 bg-gradient-to-r from-blue-600 to-indigo-600"></div>
             <CardContent className="pt-0 relative px-6 pb-6 text-center">
               <div className="relative inline-block -mt-12 group cursor-pointer" onClick={() => profileImageInputRef.current?.click()}>
                 <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                   {profile.profileImage ? (
                     <AvatarImage src={profile.profileImage} alt={profile.name} className="object-cover" />
                   ) : (
                     <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-700">
                       {profile.name.split(' ').map((n: string) => n[0]).join('')}
                     </AvatarFallback>
                   )}
                 </Avatar>
                 <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    {isUploading ? <Loader2 className="h-6 w-6 text-white animate-spin" /> : <Camera className="h-6 w-6 text-white" />}
                 </div>
                 <input type="file" ref={profileImageInputRef} onChange={handleProfileImageUpload} hidden accept="image/*" />
               </div>
               <div className="mt-4">
                 <h2 className="text-xl font-bold">{profile.name}</h2>
                 <p className="text-sm text-muted-foreground mt-1 font-medium">{profile.branch || 'Branch'}</p>
                 <div className="flex flex-wrap justify-center gap-2 mt-3 w-full max-w-full">
                   <Badge variant="secondary" className="font-normal truncate max-w-[120px]" title={profile.batch || 'Batch'}>{profile.batch || 'Batch'}</Badge>
                   <Badge variant="outline" className="font-normal truncate max-w-[120px]" title={`Roll: ${profile.stats?.rollNo || 'N/A'}`}>Roll: {profile.stats?.rollNo || 'N/A'}</Badge>
                 </div>
               </div>
               
               <Separator className="my-6" />
               
               <div className="space-y-4 text-left">
                  <div className="flex items-center gap-3 text-sm text-muted-foreground w-full">
                    <Mail className="h-4 w-4 shrink-0 text-blue-500" />
                    <span className="truncate text-foreground font-medium" title={profile.email}>{profile.email || 'N/A'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground w-full">
                    <Phone className="h-4 w-4 shrink-0 text-blue-500" />
                    <span className="truncate text-foreground font-medium" title={profile.phone}>{profile.phone || 'Not provided'}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-muted-foreground w-full">
                    <MapPin className="h-4 w-4 shrink-0 text-blue-500" />
                    <span className="truncate text-foreground font-medium" title={profile.location}>{profile.location || 'Not provided'}</span>
                  </div>
               </div>
             </CardContent>
           </Card>

           <Card>
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  Academic Standings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 pt-4">
                 <div className="flex justify-between items-center py-2.5 border-b border-border/50">
                   <span className="text-sm text-muted-foreground font-medium">CGPA</span>
                   <span className="font-bold text-blue-600">{profile.stats?.cgpa || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between items-center py-2.5 border-b border-border/50">
                   <span className="text-sm text-muted-foreground font-medium">Active Backlogs</span>
                   <span className="font-semibold">{profile.stats?.backlogs || '0'}</span>
                 </div>
                 <div className="flex justify-between items-center py-2.5 border-b border-border/50">
                   <span className="text-sm text-muted-foreground font-medium">Current Year</span>
                   <span className="font-semibold">{profile.stats?.year || '1'}</span>
                 </div>
                 <div className="flex justify-between items-center py-2.5">
                   <span className="text-sm text-muted-foreground font-medium">Passing Year</span>
                   <span className="font-semibold">{profile.stats?.passingYear || 'N/A'}</span>
                 </div>
              </CardContent>
           </Card>
        </div>

        {/* Right Content Area - Tabs for dynamic sections */}
        <div className="md:col-span-2 space-y-6">
           <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start h-auto bg-transparent border-b border-border/60 rounded-none px-0 gap-6 flex-wrap">
                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none px-1 py-3 border-b-2 border-transparent transition-all">Overview</TabsTrigger>
                <TabsTrigger value="experience" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none px-1 py-3 border-b-2 border-transparent transition-all">Experience & Projects</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:text-foreground text-muted-foreground rounded-none px-1 py-3 border-b-2 border-transparent transition-all">Documents & Certs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                       <Code2 className="h-4 w-4 text-blue-600" />
                       Technical Skills
                    </CardTitle>
                    <CardDescription>Programming languages, frameworks, and tools you are proficient in.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {profile.skills?.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {profile.skills.map((skill: any, i: number) => (
                          <Badge key={i} variant="secondary" className="px-3 py-1 text-xs font-semibold bg-slate-100/80 hover:bg-slate-200 transition-colors cursor-default text-slate-700">
                             {skill.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
                         No skills added yet. Click edit profile to add your technical skills.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Experiences */}
                <Card>
                  <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-3 gap-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        Work Experience
                      </CardTitle>
                      <CardDescription className="mt-1">Internships and professional experiences.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowExperienceModal(true)} className="gap-1.5 shrink-0 h-8 text-xs">
                      <Plus className="h-3.5 w-3.5" /> Add New
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-6 pt-4">
                    {profile.experiences?.length > 0 ? profile.experiences.map((exp: any, i: number) => (
                      <div key={i} className="group flex gap-4 relative">
                        <div className="mt-0.5 bg-slate-100 p-2.5 rounded-xl shrink-0 h-10 w-10 flex items-center justify-center text-slate-600 border border-border/50">
                          <Building2 className="h-5 w-5" />
                        </div>
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <div>
                               <h4 className="text-[15px] font-semibold leading-none text-foreground">{exp.companyName}</h4>
                               <p className="text-sm font-medium text-blue-600 mt-1">{exp.role}</p>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-600 -mr-2 opacity-0 group-hover:opacity-100 transition-all absolute right-0 top-0" onClick={() => {
                              const updated = profile.experiences.filter((_: any, idx: number) => idx !== i);
                              setProfile({ ...profile, experiences: updated });
                              handleSave({ ...profile, experiences: updated });
                            }}>
                               <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                          <div className="flex items-center text-[13px] text-muted-foreground font-medium gap-1.5">
                             <Calendar className="h-3.5 w-3.5 opacity-70" />
                             {exp.startDate} {exp.endDate ? `— ${exp.endDate}` : '— Present'}
                          </div>
                          {exp.description && (
                            <p className="text-[13px] text-muted-foreground leading-relaxed pt-1 whitespace-pre-line">{exp.description}</p>
                          )}
                        </div>
                      </div>
                    )) : (
                      <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
                        No work experiences added.
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Projects */}
                <Card>
                  <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-3 gap-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-blue-600" />
                        Projects
                      </CardTitle>
                      <CardDescription className="mt-1">Academic and personal projects you've built.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowProjectModal(true)} className="gap-1.5 shrink-0 h-8 text-xs">
                      <Plus className="h-3.5 w-3.5" /> Add New
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.projects?.length > 0 ? profile.projects.map((proj: any, i: number) => (
                        <div key={i} className="rounded-xl border border-border/60 bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col group hover:border-blue-200 hover:shadow-md transition-all">
                          {proj.image && (
                            <div className="h-32 overflow-hidden border-b border-border/50">
                               <img src={typeof proj.image === 'string' ? proj.image : URL.createObjectURL(proj.image)} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={proj.title} />
                            </div>
                          )}
                          <div className="p-4 flex flex-col flex-1">
                             <div className="flex items-start justify-between mb-2 gap-2">
                               <h4 className="font-semibold text-[15px] leading-tight line-clamp-2 text-foreground" title={proj.title}>{proj.title}</h4>
                               {proj.link && (
                                 <a href={proj.link} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 shrink-0 mt-0.5 transition-colors">
                                   <ExternalLink className="h-4 w-4" />
                                 </a>
                               )}
                             </div>
                             <p className="text-[13px] text-muted-foreground line-clamp-3 mb-4 flex-1 whitespace-pre-line">{proj.description}</p>
                             <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                               {proj.tags?.slice(0, 3).map((tag: string) => (
                                 <Badge key={tag} variant="secondary" className="px-2 py-0 h-5 text-[10px] uppercase font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200">
                                   {tag}
                                 </Badge>
                               ))}
                               {proj.tags?.length > 3 && (
                                  <Badge variant="secondary" className="px-2 py-0 h-5 text-[10px] uppercase font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200">
                                    +{proj.tags.length - 3}
                                  </Badge>
                               )}
                             </div>
                          </div>
                        </div>
                      )) : (
                        <div className="col-span-full text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
                          No projects added.
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="documents" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                 {/* Resumes */}
                 <Card>
                  <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-3 gap-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Resumes
                      </CardTitle>
                      <CardDescription className="mt-1">Your uploaded ATS-friendly resumes.</CardDescription>
                    </div>
                    <label className="shrink-0">
                      <Button variant="outline" size="sm" asChild className="gap-1.5 cursor-pointer h-8 text-xs">
                        <span>
                          {isUploadingResume ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                          Upload Resume
                        </span>
                      </Button>
                      <input type="file" accept=".pdf" hidden onChange={handleResumeUpload} disabled={isUploadingResume} />
                    </label>
                  </CardHeader>
                  <CardContent className="space-y-3 pt-4">
                     {profile.resumes?.length > 0 ? profile.resumes.map((res: any, i: number) => (
                        <div key={i} className="flex items-center justify-between p-3.5 border border-border/80 rounded-xl bg-slate-50/30 hover:bg-slate-50 hover:border-border transition-colors">
                          <div className="flex items-center gap-3.5 min-w-0">
                            <div className="h-10 w-10 bg-white rounded-lg shadow-sm border border-border flex items-center justify-center text-rose-500 shrink-0">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="min-w-0">
                               <p className="font-semibold text-sm truncate text-foreground">{res.name}</p>
                               <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                                 <span>{res.date}</span>
                                 <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                                 <span>{res.size}</span>
                               </div>
                            </div>
                          </div>
                          <Button variant="secondary" size="sm" asChild className="shrink-0 font-medium px-4 h-8 text-xs ml-4">
                             <a href={res.url} target="_blank" rel="noopener noreferrer">View</a>
                          </Button>
                        </div>
                     )) : (
                        <div className="text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
                          No resume uploaded yet. Ensure you upload a PDF format.
                        </div>
                     )}
                  </CardContent>
                 </Card>

                 {/* Certifications */}
                 <Card>
                  <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-3 gap-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Badge className="h-4 w-4 p-0 bg-transparent text-blue-600 hover:bg-transparent"><GraduationCap className="h-4 w-4" /></Badge>
                        Certifications
                      </CardTitle>
                      <CardDescription className="mt-1">Achievements and course certificates.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowCertificateModal(true)} className="gap-1.5 shrink-0 h-8 text-xs">
                      <Plus className="h-3.5 w-3.5" /> Add New
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profile.certificates?.length > 0 ? profile.certificates.map((cert: any, i: number) => (
                         <div key={i} className="group p-4 border border-border/80 rounded-xl flex flex-col hover:border-blue-200 hover:shadow-sm transition-all bg-card min-h-[110px] relative">
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all absolute right-2 top-2 shrink-0 z-10" onClick={() => {
                              const updated = profile.certificates.filter((_: any, idx: number) => idx !== i);
                              setProfile({ ...profile, certificates: updated });
                              handleSave({ ...profile, certificates: updated });
                            }}>
                               <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                            
                            <div className="flex-1 pr-6">
                              <h4 className="font-semibold text-sm leading-snug text-foreground line-clamp-2" title={cert.title}>{cert.title}</h4>
                              <p className="text-[13px] font-medium text-blue-600 mt-1.5 mb-3 line-clamp-1 truncate" title={cert.issuer}>{cert.issuer}</p>
                            </div>
                            
                            <div className="mt-auto">
                              <div className="inline-flex items-center bg-slate-100 rounded-md px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider text-slate-500 w-fit">
                                Issued: {cert.issuedDate}
                              </div>
                            </div>
                         </div>
                      )) : (
                        <div className="col-span-full text-center py-8 text-sm text-muted-foreground border-2 border-dashed rounded-lg bg-slate-50/50">
                          No certifications added.
                        </div>
                      )}
                    </div>
                  </CardContent>
                 </Card>
              </TabsContent>
           </Tabs>
        </div>
      </div>

      <ProjectModal
        isOpen={showProjectModal}
        onClose={() => setShowProjectModal(false)}
        onAddProject={handleAddProject}
      />
      <ExperienceModal
        isOpen={showExperienceModal}
        onClose={() => setShowExperienceModal(false)}
        onAddExperience={handleAddExperience}
      />
      <CertificateModal
        isOpen={showCertificateModal}
        onClose={() => setShowCertificateModal(false)}
        onAddCertificate={handleAddCertificate}
      />
      <ProfileEditDialog
        isOpen={showProfileEditDialog}
        onClose={() => setShowProfileEditDialog(false)}
        profile={profile}
        onSave={handleSave}
        isLoading={backendLoading}
      />
    </div>
  );
};

export default StudentProfile;