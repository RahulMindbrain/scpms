import {
  Mail, GraduationCap,
  Code2, Edit3, ExternalLink, Plus, Trash2,
  Briefcase, Loader2, FileText, Calendar, Building2,
  Lightbulb, Globe, Eye, Upload
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import ProjectModal from './modal/ProjectModal';
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
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
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
  //@ts-ignore
  const [isUploading, setIsUploading] = useState(false);
  //@ts-ignore
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const { upload: uploadToCloudinary } = useCloudinaryUpload();
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>('');

  const [profile, setProfile] = useState<any>({
    name: user ? `${user.firstname} ${user.lastname}` : 'Student Name',
    email: user?.email || '',
    stats: {
      cgpa: '0.0',
      activeBacklogs: 0,
      department: '',
      year: 1,
      passingYear: 2026,
      departmentId: 1
    },
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
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
          activeBacklogs: backendProfile.activeBacklogs || 0,
          department: backendProfile.department?.name || ''
        },
        linkedinUrl: backendProfile.linkedinUrl || '',
        githubUrl: backendProfile.githubUrl || '',
        portfolioUrl: backendProfile.portfolioUrl || '',
        skills: backendProfile.skills?.map((s: string) => ({ name: s, color: 'bg-blue-500' })) || [],
        resumes: backendProfile.resumeUrl ? [{ name: 'Resume', url: backendProfile.resumeUrl, date: 'N/A', size: 'N/A' }] : []
      }));
    }
  }, [backendProfile, user]);

const handleSave = async (updatedProfile: any) => {
  try {
    const payload = {
      year: parseInt(updatedProfile.stats.year),
      passingYear: parseInt(updatedProfile.stats.passingYear),
      cgpa: parseFloat(updatedProfile.stats.cgpa),

      linkedinUrl: updatedProfile.linkedinUrl || "",
      githubUrl: updatedProfile.githubUrl || "",
      portfolioUrl: updatedProfile.portfolioUrl || "",
      resumeUrl: updatedProfile.resumes?.[0]?.url || "",

    
   addSkillIds: updatedProfile.skills
  ?.map((s: any) => s.id)
  ?.filter((id: any) => typeof id === "number") || [],

      addExperiences: updatedProfile.experiences
        ?.filter((exp: any) => !exp.id)
        ?.map((exp: any) => ({
          companyName: exp.companyName,
          role: exp.role,
          description: exp.description,
          startDate: exp.startDate,
          endDate: exp.endDate,
        })),

      updateExperiences: updatedProfile.experiences
        ?.filter((exp: any) => exp.id)
        ?.map((exp: any) => ({
          id: exp.id,
          companyName: exp.companyName,
          role: exp.role,
          description: exp.description,
          startDate: exp.startDate,
          endDate: exp.endDate,
        })),

      deleteExperienceIds: [],

      addCertificates: updatedProfile.certificates
        ?.filter((cert: any) => !cert.id)
        ?.map((cert: any) => ({
          title: cert.title,
          issuer: cert.issuer,
          certificateUrl: cert.certificateUrl,
          issuedDate: cert.issuedDate,
        })),

      updateCertificates: updatedProfile.certificates
        ?.filter((cert: any) => cert.id)
        ?.map((cert: any) => ({
          id: cert.id,
          title: cert.title,
          issuer: cert.issuer,
          certificateUrl: cert.certificateUrl,
          issuedDate: cert.issuedDate,
        })),

      deleteCertificateIds: [],
      
      addProjects: updatedProfile.projects
        ?.filter((proj: any) => !proj.id)
        ?.map((proj: any) => ({
          title: proj.title,
          description: proj.description,
          techStack: proj.techStack,
          githubUrl: proj.githubUrl,
          liveUrl: proj.liveUrl,
        })),

      updateProjects: updatedProfile.projects
        ?.filter((proj: any) => proj.id)
        ?.map((proj: any) => ({
          id: proj.id,
          title: proj.title,
          description: proj.description,
          techStack: proj.techStack,
          githubUrl: proj.githubUrl,
          liveUrl: proj.liveUrl,
        })),

      deleteProjectIds: [],
    };

    await dispatch(updateStudentProfile(payload)).unwrap();

    toast.success("Profile updated successfully");
  } catch (err: any) {
    toast.error(err || "Update failed");
  }
};

  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Please upload a PDF file for your resume");
      return;
    }

    setIsUploadingResume(true);
    try {
      const url = await uploadToCloudinary(file, "resumes");
      if (url) {
        const updatedProfile = {
          ...profile,
          resumes: [{ name: file.name, url, date: new Date().toLocaleDateString(), size: `${(file.size / 1024 / 1024).toFixed(2)} MB` }]
        };
        setProfile(updatedProfile);
        await handleSave(updatedProfile);
        toast.success("Resume uploaded successfully!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsUploadingResume(false);
    }
  };

  const openFile = (url: string, name = '') => {
    if (!url) return;
    
    // Ensure PDF extension for better browser handling if it's a PDF
    let finalUrl = url;
    const isPdf = name.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('.pdf');
    
    if (isPdf && !finalUrl.toLowerCase().endsWith('.pdf')) {
      finalUrl = finalUrl + '.pdf';
    }

    setPreviewName(name);
    setPreviewUrl(finalUrl);
  };

  const handleAddProject = (project: any) => {
    const updatedProfile = {
      ...profile,
      projects: [...(profile.projects || []), project]
    };
    setProfile(updatedProfile);
    handleSave(updatedProfile);
  };

const handleAddExperience = (exp: any) => {
  const updatedProfile = {
    ...profile,
    experiences: [...(profile.experiences || []), exp],
  };

  setProfile(updatedProfile);
  handleSave(updatedProfile);
};
const handleAddCertificate = (cert: any) => {
  const updatedProfile = {
    ...profile,
    certificates: [...(profile.certificates || []), cert],
  };

  setProfile(updatedProfile);
  handleSave(updatedProfile);
};

  // Profile completion calculation
  const getProfileCompletion = () => {
    const fields = [
      { name: 'Name', filled: !!profile.name && profile.name !== 'Student Name' },
      { name: 'Email', filled: !!profile.email },
      { name: 'Skills', filled: profile.skills?.length > 0 },
      { name: 'CGPA', filled: !!profile.stats?.cgpa && profile.stats.cgpa !== '0.0' },
      { name: 'Resume', filled: profile.resumes?.length > 0 },
      { name: 'Experience', filled: profile.experiences?.length > 0 },
    ];
    const filled = fields.filter(f => f.filled).length;
    const missing = fields.filter(f => !f.filled).map(f => f.name);
    return { percent: Math.round((filled / fields.length) * 100), missing };
  };
  const completion = getProfileCompletion();

  return (
    <div className="min-h-screen bg-[#fcfcfd] pb-20">
      <div className="max-w-[1400px] mx-auto space-y-6 animate-in fade-in duration-700 px-4 sm:px-6 lg:px-8 pt-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
          <h1 className="text-xl font-bold text-slate-800">Student Profile</h1>
          <Button
            onClick={() => setShowProfileEditDialog(true)}
            disabled={backendLoading}
            className="gap-2 rounded-full h-10 px-6 font-semibold shadow-md hover:shadow-lg transition-all bg-blue-600 hover:bg-blue-700 active:scale-95"
          >
            {backendLoading ? <Loader2 className="animate-spin h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Left Sidebar - Personal Details & Academics */}
          <div className="md:col-span-1 space-y-4">
            <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/40 rounded-2xl">
              <div className="h-28 bg-blue-600 relative">
                <div className="absolute inset-0 dot-pattern"></div>
              </div>
              <CardContent className="pt-0 relative px-6 pb-6 text-center">
                <div className="relative inline-block -mt-12 group">
                  <Avatar className="h-24 w-24 border-4 border-background shadow-md">
                    {profile.profileImage ? (
                      <AvatarImage src={profile.profileImage} alt={profile.name} className="object-cover" />
                    ) : (
                      <AvatarFallback className="text-2xl font-bold bg-blue-100 text-blue-700">
                        {profile.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                <div className="mt-4">
                  <h2 className="text-xl font-bold">{profile.name}</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">{profile.stats?.department || 'Department'}</p>
                  <div className="flex flex-wrap justify-center gap-2 mt-3 w-full max-w-full">
                    <Badge variant="secondary" className="font-normal truncate max-w-[120px]" title={`Year ${profile.stats?.year || '1'}`}>Year {profile.stats?.year || '1'}</Badge>
                    <Badge variant="outline" className="font-normal truncate max-w-[120px]" title={`Passing: ${profile.stats?.passingYear || 'N/A'}`}>Passing: {profile.stats?.passingYear || 'N/A'}</Badge>
                  </div>
                </div>

                {/* Profile Completion Progress */}
                {completion.percent < 100 && (
                  <div className="mt-4 mx-1">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">Profile Completion</span>
                      <span className="text-xs font-bold text-blue-600">{completion.percent}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-600 rounded-full animate-progress transition-all" style={{ width: `${completion.percent}%` }} />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1.5 leading-snug">
                      Add <span className="font-semibold text-slate-600">{completion.missing.slice(0, 2).join(' & ')}</span>{completion.missing.length > 2 ? ` +${completion.missing.length - 2} more` : ''} to complete
                    </p>
                  </div>
                )}

                <Separator className="my-4" />

                  <div className="flex items-center gap-3 text-sm p-3 rounded-xl bg-slate-50 border border-slate-100/50 hover:bg-white hover:shadow-sm transition-all group">
                    <div className="h-8 w-8 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Email</p>
                      <p className="truncate text-slate-700 font-semibold text-[13px]" title={profile.email}>{profile.email || 'N/A'}</p>
                    </div>
                  </div>

                {/* Social Links */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Globe className="h-3 w-3" />
                    Professional Links
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {profile.linkedinUrl && (
                      <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="h-9 px-3 gap-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer rounded-xl">
                          {/* <Linkedin className="h-3.5 w-3.5 text-[#0077B5]" /> */}
                          <span className="text-xs font-semibold">LinkedIn</span>
                        </Badge>
                      </a>
                    )}
                    {profile.githubUrl && (
                      <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="h-9 px-3 gap-2 border-slate-200 hover:border-slate-400 hover:bg-slate-50 transition-all cursor-pointer rounded-xl">
                          {/* <Github className="h-3.5 w-3.5 text-[#333]" /> */}
                          <span className="text-xs font-semibold">GitHub</span>
                        </Badge>
                      </a>
                    )}
                    {profile.portfolioUrl && (
                      <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer">
                        <Badge variant="outline" className="h-9 px-3 gap-2 border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-all cursor-pointer rounded-xl">
                          <Globe className="h-3.5 w-3.5 text-blue-600" />
                          <span className="text-xs font-semibold">Portfolio</span>
                        </Badge>
                      </a>
                    )}
                    {!profile.linkedinUrl && !profile.githubUrl && !profile.portfolioUrl && (
                      <p className="text-xs text-slate-400 italic">No social links added yet.</p>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-none shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden">
              <CardHeader className="pb-3 border-b border-border/50">
                <CardTitle className="text-base flex items-center gap-2">
                  <GraduationCap className="h-4 w-4 text-blue-600" />
                  Academic Standings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 pt-6">
                <div className="flex justify-between items-center p-3 rounded-xl bg-blue-50/50 border border-blue-100/50">
                  <span className="text-sm text-blue-700 font-semibold uppercase tracking-wider text-[11px]">Average CGPA</span>
                  <span className="text-xl font-bold text-blue-600">{profile.stats?.cgpa || 'N/A'}</span>
                </div>
                <div className="grid grid-cols-1 gap-2 mt-4">
                  <div className="flex justify-between items-center py-2.5 px-1 border-b border-slate-50">
                    <span className="text-sm text-slate-500 font-medium">Active Backlogs</span>
                    <span className={`font-bold ${profile.stats?.activeBacklogs > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {profile.stats?.activeBacklogs || '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 px-1 border-b border-slate-50">
                    <span className="text-sm text-slate-500 font-medium">Current Year</span>
                    <span className="font-bold text-slate-700">{profile.stats?.year || '1'}</span>
                  </div>
                  <div className="flex justify-between items-center py-2.5 px-1">
                    <span className="text-sm text-slate-500 font-medium">Passing Year</span>
                    <span className="font-bold text-slate-700">{profile.stats?.passingYear || 'N/A'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area - Tabs for dynamic sections */}
          <div className="md:col-span-2 space-y-6">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList variant="line" className="w-full justify-start h-auto bg-transparent border-b border-slate-200 rounded-none px-0 gap-10 mb-6 relative">
                <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-[3px] data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:text-blue-600 text-slate-500 rounded-none px-0 py-4 border-b-[3px] border-transparent transition-all font-bold text-sm hover:text-blue-500">Overview</TabsTrigger>
                <TabsTrigger value="experience" className="data-[state=active]:bg-transparent data-[state=active]:border-b-[3px] data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:text-blue-600 text-slate-500 rounded-none px-0 py-4 border-b-[3px] border-transparent transition-all font-bold text-sm hover:text-blue-500">Experience & Projects</TabsTrigger>
                <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:border-b-[3px] data-[state=active]:border-blue-600 data-[state=active]:shadow-none data-[state=active]:text-blue-600 text-slate-500 rounded-none px-0 py-4 border-b-[3px] border-transparent transition-all font-bold text-sm hover:text-blue-500">Documents & Certs</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
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
                          <Badge key={i} variant="secondary" className="px-3 py-1 text-xs font-semibold bg-blue-50 text-blue-700 hover:bg-blue-100 transition-colors cursor-default rounded-lg border-none">
                            {skill.name}
                          </Badge>
                        ))}
                      </div>
                    ) : (
                      <div className="flex flex-col items-center py-10 border-2 border-dashed rounded-2xl bg-slate-50/30">
                        <div className="h-14 w-14 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                          <Lightbulb className="h-7 w-7 text-blue-500" />
                        </div>
                        <p className="text-sm font-semibold text-slate-700 mb-1">No technical skills added</p>
                        <p className="text-xs text-slate-400 mb-4 max-w-xs text-center">Showcase your programming languages, frameworks, and tools to stand out to recruiters.</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setShowProfileEditDialog(true)}
                          className="gap-1.5 rounded-xl text-xs font-semibold border-blue-200 text-blue-600 hover:bg-blue-50 px-5"
                        >
                          <Plus className="h-3.5 w-3.5" /> Add Skills
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="experience" className="mt-6 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                {/* Experiences */}
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                  <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-3 gap-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Briefcase className="h-4 w-4 text-blue-600" />
                        Work Experience
                      </CardTitle>
                      <CardDescription className="mt-1">Internships and professional experiences.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowExperienceModal(true)} className="gap-1.5 shrink-0 h-9 text-xs rounded-xl font-medium border-blue-100 hover:bg-blue-50 text-blue-600 px-4">
                      <Plus className="h-4 w-4" /> Add New
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-600 -mr-2 opacity-0 group-hover:opacity-100 transition-all absolute right-0 top-0"
                              onClick={() => {
                                const expId = profile.experiences[i]?.id;

                                const updated = profile.experiences.filter((e: any) => e.id !== expId);

                                setProfile({ ...profile, experiences: updated });

                                handleSave({
                                  ...profile,
                                  experiences: updated,
                                  deleteExperienceIds: expId ? [expId] : [],
                                });
                              }}
                            >
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
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                  <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-3 gap-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Code2 className="h-4 w-4 text-blue-600" />
                        Projects
                      </CardTitle>
                      <CardDescription className="mt-1">Academic and personal projects you've built.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowProjectModal(true)} className="gap-1.5 shrink-0 h-9 text-xs rounded-xl font-medium border-blue-100 hover:bg-blue-50 text-blue-600 px-4">
                      <Plus className="h-4 w-4" /> Add New
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {profile.projects?.length > 0 ? profile.projects.map((proj: any, i: number) => (
                        <div key={i} className="rounded-2xl border border-slate-100 bg-white shadow-sm overflow-hidden flex flex-col group hover:border-blue-200 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 relative">
                          <div className="p-4 flex flex-col flex-1">
                            <div className="flex items-start justify-between mb-2 gap-2">
                              <h4 className="font-semibold text-[15px] leading-tight line-clamp-2 text-foreground" title={proj.title}>{proj.title}</h4>
                              <div className="flex gap-2 shrink-0 mt-0.5">
                                {proj.githubUrl && (
                                  <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-slate-900 transition-colors">
                                    <Code2 className="h-4 w-4" />
                                  </a>
                                )}
                                {proj.liveUrl && (
                                  <a href={proj.liveUrl} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-blue-600 transition-colors">
                                    <ExternalLink className="h-4 w-4" />
                                  </a>
                                )}
                              </div>
                            </div>
                            <p className="text-[13px] text-muted-foreground line-clamp-3 mb-4 flex-1 whitespace-pre-line">{proj.description}</p>
                            <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
                              {proj.techStack?.split(',').map((tag: string) => tag.trim()).filter(Boolean).slice(0, 3).map((tag: string) => (
                                <Badge key={tag} variant="secondary" className="px-2 py-0 h-5 text-[10px] uppercase font-semibold bg-slate-100 text-slate-600 hover:bg-slate-200">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                          
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all absolute right-2 bottom-2"
                            onClick={() => {
                              const projId = profile.projects[i]?.id;
                              const updated = profile.projects.filter((p: any) => p.id !== projId);
                              setProfile({ ...profile, projects: updated });
                              handleSave({
                                ...profile,
                                projects: updated,
                                deleteProjectIds: projId ? [projId] : [],
                              });
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                  <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-3 gap-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        Resumes
                      </CardTitle>
                      <CardDescription className="mt-1">Your uploaded ATS-friendly resumes.</CardDescription>
                    </div>
                    <label className="shrink-0">
                      <Button variant="outline" size="sm" asChild className="gap-1.5 cursor-pointer h-9 text-xs rounded-xl font-medium border-blue-100 hover:bg-blue-50 text-blue-600 px-4">
                        <span>
                          {isUploadingResume ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-4 w-4" />}
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
                        <Button 
                          variant="secondary" 
                          size="sm" 
                          onClick={() => openFile(res.url, res.name)}
                          className="shrink-0 font-semibold px-4 h-9 text-xs ml-4 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors border-none"
                        >
                          View
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
                <Card className="border-none shadow-xl shadow-slate-200/50 rounded-2xl overflow-hidden">
                  <CardHeader className="flex flex-row items-start sm:items-center justify-between pb-3 gap-4">
                    <div>
                      <CardTitle className="text-base flex items-center gap-2">
                        <GraduationCap className="h-4 w-4 text-blue-600" />
                        Certifications
                      </CardTitle>
                      <CardDescription className="mt-1">Achievements and course certificates.</CardDescription>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => setShowCertificateModal(true)} className="gap-1.5 shrink-0 h-9 text-xs rounded-xl font-medium border-blue-100 hover:bg-blue-50 text-blue-600 px-4">
                      <Plus className="h-4 w-4" /> Add New
                    </Button>
                  </CardHeader>
                  <CardContent className="pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {profile.certificates?.length > 0 ? profile.certificates.map((cert: any, i: number) => (
                        <div key={i} className="group p-4 border border-border/80 rounded-xl flex flex-col hover:border-blue-200 hover:shadow-sm transition-all bg-card min-h-[110px] relative">
                          <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:bg-red-50 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-all absolute right-2 top-2 shrink-0 z-10" 
                        
                        onClick={() => {
  const certId = profile.certificates[i]?.id;

  const updated = profile.certificates.filter((c: any) => c.id !== certId);

  setProfile({ ...profile, certificates: updated });

  handleSave({
    ...profile,
    certificates: updated,
    deleteCertificateIds: certId ? [certId] : [],
  });
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

        {/* 📄 PDF/Document Preview Modal */}
        <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
          <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col border-none shadow-2xl">
            <DialogHeader className="p-4 border-b bg-white shrink-0">
              <div className="flex items-center justify-between pr-8">
                <DialogTitle className="text-lg font-bold truncate flex items-center gap-2">
                  <FileText className="text-blue-600" size={18} />
                  {previewName}
                </DialogTitle>
                <div className="flex items-center gap-2">
                    <button 
                      onClick={() => window.open(previewUrl!, '_blank')}
                      className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <ExternalLink size={14} />
                      Open in New Tab
                    </button>
                </div>
              </div>
            </DialogHeader>
            
            <div className="flex-1 bg-slate-100 relative">
              {previewUrl && (
                <iframe
                  src={`${previewUrl}#toolbar=0`}
                  className="w-full h-full border-none"
                  title="Preview"
                />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentProfile;