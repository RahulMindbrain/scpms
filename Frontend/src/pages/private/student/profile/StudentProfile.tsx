import {
  Mail, GraduationCap,
  Code2, Edit3, ExternalLink, Plus, Trash2,
  Briefcase, FileText, Building2,
  Lightbulb, Globe, Upload, ArrowRight, CheckCircle, Bell
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { fetchStudentProfile, updateStudentProfile, createStudentProfile } from '../../../../redux/thunks/studentThunk';
import { useEffect, useState } from 'react';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import ExperienceModal from './modal/ExperienceModal';
import CertificateModal from './modal/CertificateModal';
import ProfileEditDialog from './modal/ProfileEditDialog';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import Loader from '@/components/Loader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

const ProgressRing = ({ percent, size = 60, stroke = 5 }: { percent: number, size?: number, stroke?: number }) => {
  const radius = (size - stroke) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="rotate-[-90deg]">
        <circle
          stroke="currentColor"
          strokeWidth={stroke}
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="text-[rgba(255,255,255,0.08)]"
        />
        <motion.circle
          stroke="currentColor"
          strokeWidth={stroke}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: "easeOut" }}
          strokeLinecap="round"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          className="text-blue-600"
        />
      </svg>
      <span className="absolute text-[10px] font-bold text-[#c7c4d7]">{percent}%</span>
    </div>
  );
};

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
      cgpa: '',
      activeBacklogs: '',
      department: '',
      year: '',
      passingYear: '',
      departmentId: ""
    },
    linkedinUrl: '',
    githubUrl: '',
    portfolioUrl: '',
    skills: [],
    projects: [],
    experiences: [],
    certificates: [],
    resumeUrl: ''
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
          cgpa: backendProfile.cgpa?.toString() || '',
          year: backendProfile.year || '',
          passingYear: backendProfile.passingYear || '',
          departmentId: backendProfile.departmentId || "",
          activeBacklogs: backendProfile.activeBacklogs || '',
          department: backendProfile.department?.name || ''
        },
        linkedinUrl: backendProfile.linkedinUrl || '',
        githubUrl: backendProfile.githubUrl || '',
        portfolioUrl: backendProfile.portfolioUrl || '',
        skills: backendProfile.skills?.map((s: any) => ({
          id: s.id,
          name: typeof s === 'string' ? s : s.name,
          color: 'bg-indigo-500/100'
        })) || [],
        resumeUrl: backendProfile.resumeUrl || ''
      }));
    }
  }, [backendProfile, user]);

  const handleSave = async (updatedProfile: any) => {
    try {
      const cleanUrl = (url: any) => {
        const trimmed = typeof url === 'string' ? url.trim() : '';
        return trimmed ? trimmed : undefined;
      };

      const yearInt = parseInt(updatedProfile.stats?.year);
      const passingYearInt = parseInt(updatedProfile.stats?.passingYear);
      const cgpaFloat = parseFloat(updatedProfile.stats?.cgpa);

      const commonPayload: any = {
        year: isNaN(yearInt) ? undefined : yearInt,
        passingYear: isNaN(passingYearInt) ? undefined : passingYearInt,
        cgpa: (isNaN(cgpaFloat) || yearInt === 1) ? undefined : cgpaFloat,
        linkedinUrl: cleanUrl(updatedProfile.linkedinUrl),
        githubUrl: cleanUrl(updatedProfile.githubUrl),
        portfolioUrl: cleanUrl(updatedProfile.portfolioUrl),
        resumeUrl: cleanUrl(updatedProfile.resumeUrl),
      };

      if (backendProfile) {
        const putPayload = {
          ...commonPayload,
          addSkillIds: updatedProfile.skills
            ?.map((s: any) => s.id)
            ?.filter((id: any) => typeof id === "number") || [],

          addExperiences: updatedProfile.experiences
            ?.filter((exp: any) => !exp.id)
            ?.map((exp: any) => ({
              companyName: exp.companyName,
              role: exp.role,
              description: exp.description || undefined,
              startDate: exp.startDate,
              endDate: exp.endDate || undefined,
            })),

          updateExperiences: updatedProfile.experiences
            ?.filter((exp: any) => exp.id)
            ?.map((exp: any) => ({
              id: exp.id,
              companyName: exp.companyName,
              role: exp.role,
              description: exp.description || undefined,
              startDate: exp.startDate,
              endDate: exp.endDate || undefined,
            })),

          deleteExperienceIds: updatedProfile.deleteExperienceIds || [],

          addCertificates: updatedProfile.certificates
            ?.filter((cert: any) => !cert.id)
            ?.map((cert: any) => ({
              title: cert.title,
              issuer: cert.issuer,
              certificateUrl: cleanUrl(cert.certificateUrl),
              issuedDate: cert.issuedDate || undefined,
            })),

          updateCertificates: updatedProfile.certificates
            ?.filter((cert: any) => cert.id)
            ?.map((cert: any) => ({
              id: cert.id,
              title: cert.title,
              issuer: cert.issuer,
              certificateUrl: cleanUrl(cert.certificateUrl),
              issuedDate: cert.issuedDate || undefined,
            })),

          deleteCertificateIds: updatedProfile.deleteCertificateIds || [],

          addProjects: updatedProfile.projects
            ?.filter((proj: any) => !proj.id)
            ?.map((proj: any) => ({
              title: proj.title,
              description: proj.description || undefined,
              techStack: proj.techStack || undefined,
              githubUrl: cleanUrl(proj.githubUrl),
              liveUrl: cleanUrl(proj.liveUrl),
            })),

          updateProjects: updatedProfile.projects
            ?.filter((proj: any) => proj.id)
            ?.map((proj: any) => ({
              id: proj.id,
              title: proj.title,
              description: proj.description || undefined,
              techStack: proj.techStack || undefined,
              githubUrl: cleanUrl(proj.githubUrl),
              liveUrl: cleanUrl(proj.liveUrl),
            })),

          deleteProjectIds: updatedProfile.deleteProjectIds || [],
        };
        await dispatch(updateStudentProfile(putPayload)).unwrap();
        toast.success("Profile updated successfully");
      } else {
        const deptId = parseInt(updatedProfile.stats?.departmentId);
        const postPayload = {
          ...commonPayload,
          departmentId: isNaN(deptId) ? undefined : deptId,
          
          skillIds: updatedProfile.skills
            ?.map((s: any) => s.id)
            ?.filter((id: any) => typeof id === "number") || [],

          experiences: updatedProfile.experiences?.map((exp: any) => ({
            companyName: exp.companyName,
            role: exp.role,
            description: exp.description || undefined,
            startDate: exp.startDate,
            endDate: exp.endDate || undefined,
          })) || [],

          certificates: updatedProfile.certificates?.map((cert: any) => ({
            title: cert.title,
            issuer: cert.issuer,
            certificateUrl: cleanUrl(cert.certificateUrl),
            issuedDate: cert.issuedDate || undefined,
          })) || [],

          projects: updatedProfile.projects?.map((proj: any) => ({
            title: proj.title,
            description: proj.description || undefined,
            techStack: proj.techStack || undefined,
            githubUrl: cleanUrl(proj.githubUrl),
            liveUrl: cleanUrl(proj.liveUrl),
          })) || [],
        };
        await dispatch(createStudentProfile(postPayload)).unwrap();
        toast.success("Profile created successfully");
      }
      return { success: true };
    } catch (err: any) {
      toast.error(err?.message || err?.toString() || "Update failed");
      return { success: false };
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
          resumeUrl: url
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

  const getProfileCompletion = () => {
    const fields = [
      { name: 'Name', filled: !!profile.name && profile.name !== 'Student Name' },
      { name: 'Email', filled: !!profile.email },
      { name: 'Skills', filled: profile.skills?.length > 0 },
      { name: 'CGPA', filled: !!profile.stats?.cgpa && profile.stats.cgpa !== '0.0' },
      { name: 'Resume', filled: !!profile.resumeUrl },
      { name: 'Experience', filled: profile.experiences?.length > 0 },
    ];
    const filled = fields.filter(f => f.filled).length;
    const missing = fields.filter(f => !f.filled).map(f => f.name);
    return { percent: Math.round((filled / fields.length) * 100), missing };
  };
  const completion = getProfileCompletion();

  if (backendLoading && !backendProfile) {
    return <Loader text="Retrieving your profile details..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-[#111319] pb-20">
      <div className="max-w-[1400px] mx-auto space-y-8 px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-[#e2e2eb]">Personal <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Profile</span></h1>
            <p className="text-lg text-[#908fa0] font-medium italic">Manage your professional identity and academic records.</p>
          </div>
          <Button
            onClick={() => setShowProfileEditDialog(true)}
            disabled={backendLoading}
            className="group gap-2 rounded-2xl h-12 px-8 font-bold shadow-lg shadow-blue-600/20 transition-all bg-indigo-600 hover:bg-indigo-700 active:scale-95"
          >
            {backendLoading ? <Loader size="sm" /> : <Edit3 className="h-4 w-4 transition-transform group-hover:rotate-12" />}
            Edit Profile
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Sidebar - Personal Details */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="overflow-hidden border border-[rgba(255,255,255,0.07)] rounded-[2rem] bg-[#1e1f26]">
              <div className="h-32 bg-gradient-to-r from-blue-600 to-indigo-700 relative">
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
              </div>
              <CardContent className="pt-0 relative px-8 pb-8 text-center">
                <div className="relative inline-block -mt-16">
                  <div className="absolute -inset-1 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 blur-sm opacity-50"></div>
                  <Avatar className="h-32 w-32 border-4 border-[#1e1f26] shadow-xl relative z-10">
                    {profile.profileImage ? (
                      <AvatarImage src={profile.profileImage} alt={profile.name} className="object-cover" />
                    ) : (
                      <AvatarFallback className="text-3xl font-black bg-indigo-500/10 text-blue-600">
                        {profile.name.split(' ').map((n: string) => n[0]).join('')}
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>
                
                <div className="mt-6 space-y-1">
                  <h2 className="text-2xl font-black text-[#e2e2eb] tracking-tight">{profile.name}</h2>
                  <p className="text-sm font-black text-indigo-400 uppercase tracking-widest">{profile.stats?.department || 'Department'}</p>
                </div>

                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <Badge variant="secondary" className="bg-[rgba(255,255,255,0.06)] text-[#c7c4d7] border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">Year {profile.stats?.year || '1'}</Badge>
                  <Badge variant="secondary" className="bg-[rgba(255,255,255,0.06)] text-[#c7c4d7] border-none px-3 py-1 font-black text-[10px] uppercase tracking-widest">Class of {profile.stats?.passingYear || 'N/A'}</Badge>
                </div>

                {/* Profile Completion Circular Progress */}
                <div className="mt-8 p-6 rounded-[2rem] bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.06)] flex items-center gap-5">
                  <ProgressRing percent={completion.percent} size={64} stroke={6} />
                  <div className="text-left">
                    <p className="text-xs font-black text-[#908fa0] uppercase tracking-widest">Strength</p>
                    <p className="text-sm font-black text-[#c7c4d7] tracking-tight">
                      {completion.percent === 100 ? "Profile Perfect!" : "Keep it going!"}
                    </p>
                    {completion.missing.length > 0 && (
                      <p className="text-[10px] text-[#908fa0] font-bold mt-0.5">Missing: {completion.missing[0]}</p>
                    )}
                  </div>
                </div>

                <Separator className="my-8 opacity-50" />

                <div className="space-y-4">
                  <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.10)] hover:bg-[rgba(255,255,255,0.04)] transition-all group">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <Mail className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest leading-none mb-1.5">Primary Email</p>
                      <p className="truncate text-[#c7c4d7] font-black text-sm tracking-tight" title={profile.email}>{profile.email || 'N/A'}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-left p-4 rounded-2xl bg-[rgba(255,255,255,0.02)] border border-transparent hover:border-[rgba(255,255,255,0.10)] hover:bg-[rgba(255,255,255,0.04)] transition-all group">
                    <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shrink-0 transition-colors group-hover:bg-indigo-600 group-hover:text-white">
                      <ExternalLink className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest leading-none mb-1.5">LinkedIn</p>
                      {profile.linkedinUrl ? (
                        <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="truncate text-indigo-400 font-black text-sm hover:underline flex items-center gap-1 tracking-tight">
                          Profile Link <ExternalLink className="h-3 w-3" />
                        </a>
                      ) : (
                        <p className="text-[#908fa0] font-medium text-sm italic">Not linked</p>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-8 flex justify-center gap-3">
                  {profile.linkedinUrl && (
                    <a href={profile.linkedinUrl} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-2xl border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#c7c4d7] hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all">
                      <Briefcase className="h-5 w-5" />
                    </a>
                  )}
                  {profile.githubUrl && (
                    <a href={profile.githubUrl} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-2xl border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#c7c4d7] hover:bg-slate-900 hover:text-white hover:border-transparent transition-all">
                      <Code2 className="h-5 w-5" />
                    </a>
                  )}
                  {profile.portfolioUrl && (
                    <a href={profile.portfolioUrl} target="_blank" rel="noopener noreferrer" className="h-12 w-12 rounded-2xl border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#c7c4d7] hover:bg-indigo-600 hover:text-white hover:border-transparent transition-all">
                      <Globe className="h-5 w-5" />
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-[rgba(255,255,255,0.07)] rounded-[2rem] overflow-hidden bg-[#1e1f26]">
              <CardHeader className="pb-4 border-b border-[rgba(255,255,255,0.06)]">
                <CardTitle className="text-lg font-black tracking-tight flex items-center gap-2 text-[#e2e2eb]">
                  <GraduationCap className="h-5 w-5 text-blue-600" />
                  Academic Standings
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="relative overflow-hidden p-5 rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-600/20">
                  <div className="relative z-10">
                    <p className="text-[10px] font-black opacity-80 uppercase tracking-widest mb-1">Cumulative CGPA</p>
                    <p className="text-4xl font-black">{profile.stats?.cgpa || 'N/A'}</p>
                  </div>
                  <CheckCircle className="absolute -right-4 -bottom-4 h-24 w-24 opacity-10 rotate-12" />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-[#191b22] border border-[rgba(255,255,255,0.06)]">
                    <p className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest mb-1">Backlogs</p>
                    <p className={`text-lg font-black ${profile.stats?.activeBacklogs > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                      {profile.stats?.activeBacklogs || '0'}
                    </p>
                  </div>
                  <div className="p-4 rounded-2xl bg-[#191b22] border border-[rgba(255,255,255,0.06)]">
                    <p className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest mb-1">Credits</p>
                    <p className="text-lg font-black text-[#c7c4d7]">NA</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-8">
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start h-auto bg-transparent border-b border-[rgba(255,255,255,0.08)] rounded-none p-0 gap-8 mb-8 relative">
                {[
                  { value: 'overview', label: 'Overview' },
                  { value: 'experience', label: 'Experience' },
                  { value: 'documents', label: 'Documents' },
                ].map((tab) => (
                  <TabsTrigger 
                    key={tab.value}
                    value={tab.value} 
                    className="data-[state=active]:bg-transparent data-[state=active]:shadow-none data-[state=active]:text-indigo-400 text-[#908fa0] rounded-none px-0 py-4 border-b-2 border-transparent data-[state=active]:border-blue-600 transition-all font-black text-xs uppercase tracking-widest"
                  >
                    {tab.label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <AnimatePresence mode="wait">
                <TabsContent key="overview" value="overview" className="m-0 focus-visible:outline-none">
                  <motion.div
                    key="overview-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-8"
                  >
                    {/* Skills Card */}
                    <Card className="border border-[rgba(255,255,255,0.07)] rounded-[2rem] overflow-hidden bg-[#1e1f26]">
                      <CardHeader className="pb-0">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2 text-[#e2e2eb]">
                            <Code2 className="h-5 w-5 text-blue-600" />
                            Technical Arsenal
                          </CardTitle>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setShowProfileEditDialog(true)}
                            className="text-indigo-400 hover:bg-indigo-500/10 font-black text-xs uppercase tracking-widest rounded-xl"
                          >
                            Manage Skills
                          </Button>
                        </div>
                        <CardDescription className="text-[#908fa0] font-medium text-sm">Core competencies and technical stack.</CardDescription>
                      </CardHeader>
                      <CardContent className="pt-8">
                        {profile.skills?.length > 0 ? (
                          <div className="flex flex-wrap gap-3">
                            {profile.skills.map((skill: any, i: number) => (
                              <motion.div
                                key={i}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                              >
                                <Badge className="px-4 py-2 text-xs font-black uppercase tracking-widest bg-indigo-500/10 text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all cursor-default rounded-2xl border-none shadow-sm">
                                  {skill.name}
                                </Badge>
                              </motion.div>
                            ))}
                          </div>
                        ) : (
                          <div className="flex flex-col items-center py-16 border-2 border-dashed rounded-[2rem] bg-[rgba(255,255,255,0.02)] border-[rgba(255,255,255,0.08)]">
                            <div className="h-20 w-20 rounded-[2rem] bg-[#191b22] border border-[rgba(255,255,255,0.06)] flex items-center justify-center mb-6">
                              <Lightbulb className="h-10 w-10 text-amber-500" />
                            </div>
                            <h4 className="text-lg font-bold text-[#e2e2eb] mb-2">Build your technical profile</h4>
                            <p className="text-sm text-[#908fa0] mb-8 max-w-sm text-center font-medium">Add programming languages, frameworks, and tools to catch the eye of top recruitment teams.</p>
                            <Button
                              onClick={() => setShowProfileEditDialog(true)}
                              className="gap-2 rounded-2xl font-bold bg-indigo-600 shadow-lg shadow-blue-600/20 px-8"
                            >
                              <Plus className="h-4 w-4" /> Add Skills
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Quick Stats Summary or About */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       <Card className="border border-[rgba(255,255,255,0.07)] rounded-[2rem] bg-[#1e1f26] p-8">
                          <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-400 mb-6 w-fit">
                            <Bell className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-bold text-[#e2e2eb] mb-2">Professional Journey</h3>
                          <p className="text-[#908fa0] text-sm font-medium leading-relaxed">
                            You have documented <span className="text-indigo-600 font-bold">{profile.experiences?.length || 0} work experiences</span>. Keeping this updated helps in career matching.
                          </p>
                       </Card>
                       <Card className="border border-[rgba(255,255,255,0.07)] rounded-[2rem] bg-[#1e1f26] p-8">
                          <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-400 mb-6 w-fit">
                            <CheckCircle className="h-6 w-6" />
                          </div>
                          <h3 className="text-lg font-bold text-[#e2e2eb] mb-2">Projects & Impact</h3>
                          <p className="text-[#908fa0] text-sm font-medium leading-relaxed">
                            Showcasing <span className="text-violet-600 font-bold">{profile.projects?.length || 0} key projects</span>. Real-world applications demonstrate your solving abilities.
                          </p>
                       </Card>
                    </div>
                  </motion.div>
                </TabsContent>

                <TabsContent key="experience" value="experience" className="m-0 focus-visible:outline-none">
                  <motion.div
                    key="experience-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Work Experience */}
                    <Card className="border border-[rgba(255,255,255,0.07)] rounded-[2rem] overflow-hidden bg-[#1e1f26]">
                      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-[rgba(255,255,255,0.06)]">
                        <div>
                          <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2 text-[#e2e2eb]">
                            <Briefcase className="h-5 w-5 text-blue-600" />
                            Work History
                          </CardTitle>
                          <CardDescription className="font-medium">Internships and professional roles.</CardDescription>
                        </div>
                        <Button onClick={() => setShowExperienceModal(true)} className="gap-2 rounded-2xl bg-indigo-600 font-black text-xs uppercase tracking-widest px-6 h-10 shadow-lg shadow-blue-600/20">
                          <Plus className="h-4 w-4" /> Add Experience
                        </Button>
                      </CardHeader>
                      <CardContent className="p-8 space-y-10">
                        {profile.experiences?.length > 0 ? profile.experiences.map((exp: any, i: number) => (
                          <div key={i} className="group flex gap-6 relative">
                            <div className="shrink-0">
                               <div className="h-14 w-14 rounded-2xl bg-[#191b22] border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-[#908fa0] group-hover:bg-indigo-600 group-hover:text-white group-hover:border-transparent transition-all duration-300">
                                  <Building2 className="h-7 w-7" />
                               </div>
                            </div>
                            <div className="flex-1 min-w-0 space-y-3">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                  <h4 className="text-lg font-black text-[#e2e2eb] leading-tight">{exp.companyName}</h4>
                                  <p className="text-indigo-400 font-black text-xs uppercase tracking-widest flex items-center gap-2">
                                    {exp.role} 
                                    <span className="h-1 w-1 rounded-full bg-[rgba(255,255,255,0.2)]"></span>
                                    <span className="text-[#908fa0]">{exp.startDate} — {exp.endDate || 'Present'}</span>
                                  </p>
                                </div>
                                <Button variant="ghost" size="icon" className="h-10 w-10 text-[#908fa0] hover:bg-rose-500/10 hover:text-rose-400 rounded-xl transition-all"
                                  onClick={() => {
                                    const expId = profile.experiences[i]?.id;
                                    const updated = profile.experiences.filter((e: any) => e.id !== expId);
                                    setProfile({ ...profile, experiences: updated });
                                    handleSave({ ...profile, experiences: updated, deleteExperienceIds: expId ? [expId] : [] });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                              {exp.description && (
                                <p className="text-[#908fa0] text-[14px] leading-relaxed font-medium bg-[rgba(255,255,255,0.02)] p-4 rounded-2xl border border-[rgba(255,255,255,0.04)]">{exp.description}</p>
                              )}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-12 border-2 border-dashed rounded-[2rem] bg-[rgba(255,255,255,0.02)] text-[#908fa0] font-bold">
                            No professional experience listed yet.
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Projects */}
                    <Card className="border border-[rgba(255,255,255,0.07)] rounded-[2rem] overflow-hidden bg-[#1e1f26]">
                      <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-[rgba(255,255,255,0.06)]">
                        <div>
                          <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2 text-[#e2e2eb]">
                            <Code2 className="h-5 w-5 text-indigo-600" />
                            Projects
                          </CardTitle>
                          <CardDescription className="font-medium">Academic and personal initiatives.</CardDescription>
                        </div>
                        <Button onClick={() => setShowProjectModal(true)} className="gap-2 rounded-2xl bg-indigo-600 font-black text-xs uppercase tracking-widest px-6 h-10 shadow-lg shadow-indigo-600/20">
                          <Plus className="h-4 w-4" /> Add Project
                        </Button>
                      </CardHeader>
                      <CardContent className="p-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {profile.projects?.length > 0 ? profile.projects.map((proj: any, i: number) => (
                            <motion.div 
                              key={i} 
                              whileHover={{ y: -5 }}
                              className="group p-6 rounded-[2rem] border border-[rgba(255,255,255,0.07)] bg-[#191b22] hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-900/20 transition-all flex flex-col h-full"
                            >
                              <div className="flex justify-between items-start mb-4">
                                <h4 className="text-lg font-black text-[#e2e2eb] line-clamp-1">{proj.title}</h4>
                                <div className="flex gap-2">
                                  {proj.githubUrl && <a href={proj.githubUrl} className="p-2 bg-[#191b22] rounded-xl text-[#908fa0] hover:text-[#e2e2eb] transition-colors"><Code2 className="h-4 w-4" /></a>}
                                  {proj.liveUrl && <a href={proj.liveUrl} className="p-2 bg-indigo-500/10 rounded-xl text-blue-400 hover:text-indigo-400 transition-colors"><ExternalLink className="h-4 w-4" /></a>}
                                </div>
                              </div>
                              <p className="text-[#908fa0] text-sm font-medium mb-6 flex-1 line-clamp-3">{proj.description}</p>
                              <div className="flex flex-wrap gap-2 mb-6">
                                {proj.techStack?.split(',').map((tag: string) => tag.trim()).filter(Boolean).slice(0, 3).map((tag: string, idx: number) => (
                                  <span key={`${tag}-${idx}`} className="px-3 py-1 bg-[#191b22] text-[#908fa0] rounded-lg text-[10px] font-black uppercase tracking-widest">{tag}</span>
                                ))}
                              </div>
                              <Button variant="ghost" size="sm" className="w-full justify-between font-black text-xs uppercase tracking-widest text-rose-400 hover:bg-rose-500/10 rounded-xl h-10 px-4"
                                onClick={() => {
                                  const projId = profile.projects[i]?.id;
                                  const updated = profile.projects.filter((p: any) => p.id !== projId);
                                  setProfile({ ...profile, projects: updated });
                                  handleSave({ ...profile, projects: updated, deleteProjectIds: projId ? [projId] : [] });
                                }}
                              >
                                Delete Project <Trash2 className="h-4 w-4" />
                              </Button>
                            </motion.div>
                          )) : (
                            <div className="col-span-full text-center py-12 border-2 border-dashed rounded-[2rem] bg-[rgba(255,255,255,0.02)] text-[#908fa0] font-bold">
                              Add projects to showcase your practical skills.
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>

                <TabsContent key="documents" value="documents" className="m-0 focus-visible:outline-none">
                  <motion.div
                    key="documents-content"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-8"
                  >
                    {/* Resume Upload Section */}
                    <Card className="border border-[rgba(255,255,255,0.07)] rounded-[2rem] bg-[#1e1f26] overflow-hidden">
                      <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                        <div className="text-center md:text-left space-y-2">
                           <h3 className="text-2xl font-black">Official Resume</h3>
                           <p className="text-[#908fa0] font-medium text-sm">Upload your latest PDF resume for recruiters.</p>
                        </div>
                        <label className="shrink-0 w-full md:w-auto">
                          <Button asChild className="w-full md:w-auto gap-3 rounded-2xl bg-indigo-600 px-8 py-7 font-black shadow-xl shadow-blue-600/20 transition-all hover:bg-indigo-700 active:scale-95 cursor-pointer">
                            <span>
                              {isUploadingResume ? <Loader size="sm" /> : <Upload className="h-5 w-5" />}
                              {profile.resumeUrl ? "Update Resume" : "Upload Resume"}
                            </span>
                          </Button>
                          <input type="file" accept=".pdf" hidden onChange={handleResumeUpload} disabled={isUploadingResume} />
                        </label>
                      </div>
                      <CardContent className="p-8">
                        {profile.resumeUrl ? (
                          <div className="flex items-center justify-between p-6 border border-[rgba(255,255,255,0.06)] rounded-[2rem] bg-[rgba(255,255,255,0.02)]">
                             <div className="flex items-center gap-6">
                                <div className="h-16 w-16 bg-[#191b22] rounded-2xl border border-[rgba(255,255,255,0.06)] flex items-center justify-center text-rose-400">
                                   <FileText className="h-8 w-8" />
                                </div>
                                <div>
                                   <p className="font-black text-[#e2e2eb]">current_resume.pdf</p>
                                   <p className="text-xs font-bold text-[#908fa0] uppercase tracking-widest mt-1">Uploaded to secure cloud</p>
                                </div>
                             </div>
                             <Button 
                              onClick={() => openFile(profile.resumeUrl, "Resume.pdf")}
                              className="rounded-xl font-bold bg-[#1e1f26] text-[#e2e2eb] border border-[rgba(255,255,255,0.08)] hover:bg-[#191b22] px-6 h-12"
                             >
                                Preview <ArrowRight className="ml-2 h-4 w-4" />
                             </Button>
                          </div>
                        ) : (
                          <div className="text-center py-12 border-2 border-dashed rounded-[2rem] bg-[rgba(255,255,255,0.02)] text-[#908fa0] font-bold">
                            No resume found. Uploading a resume is critical for placements.
                          </div>
                        )}
                      </CardContent>
                    </Card>

                    {/* Certifications */}
                    <Card className="border border-[rgba(255,255,255,0.07)] rounded-[2rem] bg-[#1e1f26] overflow-hidden">
                       <CardHeader className="flex flex-row items-center justify-between pb-6 border-b border-[rgba(255,255,255,0.06)]">
                          <div>
                            <CardTitle className="text-xl font-black tracking-tight flex items-center gap-2 text-[#e2e2eb]">
                              <GraduationCap className="h-5 w-5 text-amber-500" />
                              Certifications
                            </CardTitle>
                            <CardDescription className="font-medium">Validate your expertise.</CardDescription>
                          </div>
                          <Button onClick={() => setShowCertificateModal(true)} className="gap-2 rounded-2xl bg-amber-500 font-black text-xs uppercase tracking-widest px-6 h-10 shadow-lg shadow-amber-500/20">
                            <Plus className="h-4 w-4" /> Add Certificate
                          </Button>
                       </CardHeader>
                       <CardContent className="p-8">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {profile.certificates?.length > 0 ? profile.certificates.map((cert: any, i: number) => (
                              <div key={i} className="group p-6 rounded-[2rem] border border-[rgba(255,255,255,0.07)] bg-[#191b22] flex flex-col h-full relative">
                                <Button variant="ghost" size="icon" className="h-8 w-8 absolute right-4 top-4 text-[#908fa0] hover:bg-rose-500/10 hover:text-rose-400 rounded-lg transition-all"
                                  onClick={() => {
                                    const certId = profile.certificates[i]?.id;
                                    const updated = profile.certificates.filter((c: any) => c.id !== certId);
                                    setProfile({ ...profile, certificates: updated });
                                    handleSave({ ...profile, certificates: updated, deleteCertificateIds: certId ? [certId] : [] });
                                  }}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                                <div className="space-y-4 flex-1">
                                  <div className="h-12 w-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 mb-4">
                                    <FileText className="h-6 w-6" />
                                  </div>
                                  <h4 className="font-black text-[#e2e2eb] leading-tight pr-8">{cert.title}</h4>
                                  <p className="text-amber-400 font-bold text-sm">{cert.issuer}</p>
                                </div>
                                <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.05)]">
                                   <p className="text-[10px] font-black text-[#908fa0] uppercase tracking-widest">Issued Date</p>
                                   <p className="text-sm font-bold text-[#c7c4d7] mt-1">{cert.issuedDate}</p>
                                </div>
                              </div>
                            )) : (
                              <div className="col-span-full text-center py-12 border-2 border-dashed rounded-[2rem] bg-[rgba(255,255,255,0.02)] text-[#908fa0] font-bold">
                                No certifications added yet.
                              </div>
                            )}
                          </div>
                       </CardContent>
                    </Card>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
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
          <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col bg-[#1e1f26] border border-[rgba(255,255,255,0.08)] shadow-2xl rounded-[2rem]">
            <DialogHeader className="p-6 border-b border-[rgba(255,255,255,0.06)] bg-[#191b22] shrink-0">
              <div className="flex items-center justify-between pr-8">
                <DialogTitle className="text-xl font-black truncate flex items-center gap-3 text-[#e2e2eb]">
                  <FileText className="h-6 w-6 text-rose-500" />
                  {previewName}
                </DialogTitle>
                <div className="flex gap-2">
                   <Button variant="outline" className="rounded-xl font-bold border-[rgba(255,255,255,0.1)] text-[#c7c4d7] hover:bg-[rgba(255,255,255,0.05)]" onClick={() => window.open(previewUrl!, '_blank')}>
                      <ExternalLink className="h-4 w-4 mr-2" /> Open External
                   </Button>
                </div>
              </div>
            </DialogHeader>
            <div className="flex-1 bg-[rgba(255,255,255,0.06)] overflow-hidden relative">
              <iframe
                src={`${previewUrl}#toolbar=0`}
                className="w-full h-full border-none"
                title="Document Preview"
              />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentProfile;