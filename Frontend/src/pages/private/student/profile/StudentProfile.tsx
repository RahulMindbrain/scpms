import {
  Mail, GraduationCap,
  Code2, Edit3, ExternalLink, Plus, Trash2,
  Briefcase, FileText, Building2,
  CheckCircle, Globe, MapPin,
  Award, Layers, Cpu, Rocket,
  AlertCircle, Clock, ShieldAlert
} from 'lucide-react';
import { motion } from 'framer-motion';
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
import Loader from '@/components/Loader';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ProfileApprovalPending from '@/components/status/ProfileApprovalPending';
import { Progress } from "@/components/ui/progress";

const StudentProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile: backendProfile, loading: backendLoading } = useSelector((state: RootState) => state.student);
  const { user } = useSelector((state: RootState) => state.auth);

  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [showProfileEditDialog, setShowProfileEditDialog] = useState(false)
  const [showPendingDialog, setShowPendingDialog] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>('');
  const [isPdfPreview, setIsPdfPreview] = useState(false);

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
    phone: '',
    location: '',
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
        })) || [],
        resumeUrl: backendProfile.resumeUrl || ''
      }));
    }
  }, [backendProfile, user]);

  const handleSave = async (updatedProfile: any) => {
    try {
      const cleanUrl = (url: any) => {
        const trimmed = typeof url === 'string' ? url.trim() : '';
        return trimmed || undefined;
      };

      const yearInt = parseInt(updatedProfile.stats?.year);
      const passingYearInt = parseInt(updatedProfile.stats?.passingYear);
      const cgpaFloat = parseFloat(updatedProfile.stats?.cgpa);
      const boundedCgpa = !isNaN(cgpaFloat) && cgpaFloat >= 0 && cgpaFloat <= 10 ? cgpaFloat : undefined;

      const commonPayload: any = {
        year: isNaN(yearInt) ? undefined : yearInt,
        passingYear: isNaN(passingYearInt) ? undefined : passingYearInt,
        cgpa: yearInt === 1 ? undefined : boundedCgpa,
        activeBacklogs: isNaN(parseInt(updatedProfile.stats?.activeBacklogs)) ? 0 : parseInt(updatedProfile.stats?.activeBacklogs),
        linkedinUrl: cleanUrl(updatedProfile.linkedinUrl),
        githubUrl: cleanUrl(updatedProfile.githubUrl),
        portfolioUrl: cleanUrl(updatedProfile.portfolioUrl),
        resumeUrl: cleanUrl(updatedProfile.resumeUrl),
      };

      if (backendProfile) {
        const backendSkillIds = backendProfile.skills?.map((s: any) => s.id) || [];
        const updatedSkillIds = updatedProfile.skills
          ?.map((s: any) => s.id)
          ?.filter((id: any) => typeof id === "number") || [];

        const addSkillIds = updatedSkillIds.filter((id: number) => !backendSkillIds.includes(id));
        const removeSkillIds = backendSkillIds.filter((id: number) => !updatedSkillIds.includes(id));

        const putPayload = {
          ...commonPayload,
          addSkillIds,
          removeSkillIds,
          addExperiences: updatedProfile.experiences?.filter((exp: any) => !exp.id).map((exp: any) => ({
            companyName: exp.companyName,
            role: exp.role,
            description: exp.description || undefined,
            startDate: exp.startDate,
            endDate: exp.endDate || undefined,
          })),
          updateExperiences: updatedProfile.experiences?.filter((exp: any) => exp.id).map((exp: any) => ({
            id: exp.id,
            companyName: exp.companyName,
            role: exp.role,
            description: exp.description || undefined,
            startDate: exp.startDate,
            endDate: exp.endDate || undefined,
          })),
          deleteExperienceIds: updatedProfile.deleteExperienceIds || [],
          addCertificates: updatedProfile.certificates?.filter((cert: any) => !cert.id).map((cert: any) => ({
            title: cert.title,
            issuer: cert.issuer,
            certificateUrl: cleanUrl(cert.certificateUrl),
            issuedDate: cert.issuedDate || undefined,
          })),
          updateCertificates: updatedProfile.certificates?.filter((cert: any) => cert.id).map((cert: any) => ({
            id: cert.id,
            title: cert.title,
            issuer: cert.issuer,
            certificateUrl: cleanUrl(cert.certificateUrl),
            issuedDate: cert.issuedDate || undefined,
          })),
          deleteCertificateIds: updatedProfile.deleteCertificateIds || [],
          addProjects: updatedProfile.projects?.filter((proj: any) => !proj.id).map((proj: any) => ({
            title: proj.title,
            description: proj.description || undefined,
            techStack: proj.techStack || undefined,
            githubUrl: cleanUrl(proj.githubUrl),
            liveUrl: cleanUrl(proj.liveUrl),
          })),
          updateProjects: updatedProfile.projects?.filter((proj: any) => proj.id).map((proj: any) => ({
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
          skillIds: updatedProfile.skills?.map((s: any) => s.id)?.filter((id: any) => typeof id === "number") || [],
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
      console.error("Profile save error:", err);
      toast.error(err?.message || "Update failed");
      return { success: false };
    }
  };

  const normalizePreviewUrl = (url: string) => {
    if (!url) return '';

    // Prefer HTTPS to avoid mixed content in production.
    const secureUrl = url.replace(/^http:\/\//i, 'https://');
    const lower = secureUrl.toLowerCase();
    const hasPdfExt = lower.endsWith('.pdf');
    const cloudinaryImageUpload = /\/image\/upload\//i.test(secureUrl);
    const cloudinaryRawUpload = /\/raw\/upload\//i.test(secureUrl);

    if ((cloudinaryImageUpload || cloudinaryRawUpload) && !hasPdfExt && !lower.includes('/f_pdf/')) {
      return `${secureUrl}.pdf`;
    }

    return secureUrl;
  };

  const openFile = (url: string, name = '') => {
    if (!url) return;
    const normalizedUrl = normalizePreviewUrl(url);
    setPreviewName(name);
    setPreviewUrl(normalizedUrl);
    setIsPdfPreview(normalizedUrl.toLowerCase().includes('.pdf') || normalizedUrl.toLowerCase().includes('/f_pdf/'));
  };

  const handleAddProject = (project: any) => {
    const updatedProfile = { ...profile, projects: [...(profile.projects || []), project] };
    setProfile(updatedProfile);
    handleSave(updatedProfile);
  };

  const handleAddExperience = (exp: any) => {
    const updatedProfile = { ...profile, experiences: [...(profile.experiences || []), exp] };
    setProfile(updatedProfile);
    handleSave(updatedProfile);
  };

  const handleAddCertificate = (cert: any) => {
    const updatedProfile = { ...profile, certificates: [...(profile.certificates || []), cert] };
    setProfile(updatedProfile);
    handleSave(updatedProfile);
  };

  if (backendLoading && !backendProfile) {
    return <Loader text="Retrieving your profile details..." fullScreen />;
  }

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 4,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-background pb-20 selection:bg-blue-100 selection:text-blue-900">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-[1600px] mx-auto w-full p-4 md:p-8 space-y-8"
      >
        {user?.status !== 'ACTIVE' && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-amber-500/10 border border-amber-500/20 rounded-3xl p-6 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md"
          >
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-2xl bg-amber-500/20 flex items-center justify-center text-amber-600">
                <ShieldAlert className="h-6 w-6" />
              </div>
              <div className="text-center md:text-left">
                <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Account Pending Approval</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">Your profile is under review by the university. Some features are currently limited.</p>
              </div>
            </div>
            <Button 
              onClick={() => setShowPendingDialog(true)}
              variant="outline"
              className="rounded-2xl border-amber-500/30 text-amber-600 hover:bg-amber-500/10 h-12 px-8 font-bold"
            >
              View Details
            </Button>
          </motion.div>
        )}
     
       {/* Hero Section */}
        <motion.div variants={itemVariants} className="relative group/hero">
          {/* Adaptive Banner */}
          <div className="student-hero-banner group !p-0 !rounded-[2.5rem] h-64 md:h-80 overflow-hidden relative">
            <div className="student-hero-mesh">
              <div className="bubble-blue"></div>
              <div className="bubble-sky"></div>
            </div>
            <div className="student-hero-texture"></div>
            
            {/* New Integrated Profile Content (No standalone Avatar) */}
            <div className="absolute inset-0 flex flex-col justify-end p-8 md:p-12 bg-gradient-to-t from-black/60 via-black/20 to-transparent">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                
                {/* Initials Badge - Replaces the empty Avatar */}
                <div className="h-24 w-24 md:h-32 md:w-32 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center shadow-2xl shrink-0 group-hover:scale-105 transition-transform duration-500">
                  <span className="text-4xl md:text-5xl font-black text-white tracking-tighter">
                    {profile.name.split(' ').map((n: string) => n[0]).join('')}
                  </span>
                </div>

                <div className="space-y-4 flex-1">
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-3">
                      <h1 className="text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-lg">
                        {profile.name}
                      </h1>
                      {user?.status === 'ACTIVE' ? (
                        <div className="flex items-center gap-1.5 bg-emerald-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-emerald-500/40">
                          <CheckCircle className="h-3 w-3" />
                          Verified Student
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 bg-amber-500 text-white px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shadow-lg shadow-amber-500/40">
                          <Clock className="h-3 w-3" />
                          Pending Approval
                        </div>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white font-bold text-xs md:text-sm shadow-sm transition-all hover:bg-white/20">
                        <Building2 className="h-4 w-4 text-blue-300" />
                        {profile.stats?.department || 'Department Not Set'}
                      </div>
                      <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-white/40"></div>
                      <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 text-white font-bold text-xs md:text-sm shadow-sm transition-all hover:bg-white/20">
                        <GraduationCap className="h-4 w-4 text-purple-300" />
                        Batch of {profile.stats?.passingYear || '20xx'}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="flex items-center gap-2.5 text-white/90">
                      <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                        <Mail className="h-4 w-4" />
                      </div>
                      <span className="text-sm font-bold tracking-wide">{profile.email}</span>
                    </div>
                    {profile.location && (
                      <div className="flex items-center gap-2.5 text-white/90">
                        <div className="p-1.5 rounded-lg bg-white/10 backdrop-blur-md border border-white/10">
                          <MapPin className="h-4 w-4" />
                        </div>
                        <span className="text-sm font-bold tracking-wide">{profile.location}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Edit Button moved inside banner for better composition */}
                <div className="pt-4 md:pt-0">
                  <Button
                    onClick={() => {
                      if (user?.status === 'ACTIVE') {
                        setShowProfileEditDialog(true);
                      } else {
                        setShowPendingDialog(true);
                      }
                    }}
                    className="bg-white text-slate-900 hover:bg-blue-50 rounded-2xl px-6 h-12 font-black shadow-xl transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center gap-3 text-sm"
                  >
                    {user?.status === 'ACTIVE' ? (
                      <Edit3 className="h-4.5 w-4.5 text-blue-600" />
                    ) : (
                      <ShieldAlert className="h-4.5 w-4.5 text-amber-600" />
                    )}
                    {user?.status === 'ACTIVE' ? 'Edit Profile' : 'Approval Pending'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Row */}
        <motion.div variants={itemVariants} className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <Card className="rounded-[2rem] border-none shadow-sm bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 group overflow-hidden border border-slate-200/60 dark:border-white/[0.08]">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">CGPA Score</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{Math.min(10, Math.max(0, parseFloat(profile.stats?.cgpa) || 0)).toFixed(2)} <span className="text-sm font-normal text-slate-400">/ 10</span></h3>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                  <Award className="h-7 w-7" />
                </div>
              </div>
              <div className="mt-6">
                <Progress value={(parseFloat(profile.stats?.cgpa) || 0) * 10} className="h-1.5 bg-blue-100 dark:bg-blue-900/20" />
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[2rem] border-none shadow-sm bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 group border border-slate-200/60 dark:border-white/[0.08]">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Projects</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{profile.projects?.length || 0}</h3>
                </div>
                 <div className="h-14 w-14 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                  <Cpu className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-6 text-[9px] font-black text-blue-600 dark:text-blue-400 bg-blue-500/10 w-fit px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Technical Portfolio</p>
            </CardContent>
          </Card>

              <Card className="rounded-[2rem] border-none shadow-sm bg-card dark:bg-[#161b22]/40 backdrop-blur-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 group border border-border dark:border-white/[0.08]">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Verified Skills</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{profile.skills?.length || 0}</h3>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                  <Rocket className="h-7 w-7" />
                </div>
              </div>
              <p className="mt-6 text-[9px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 w-fit px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">Industry Ready</p>
            </CardContent>
          </Card>

              <Card className="rounded-[2rem] border-none shadow-sm bg-card dark:bg-[#161b22]/40 backdrop-blur-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 group border border-border dark:border-white/[0.08]">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">Active Backlogs</p>
                  <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">{Math.max(0, parseInt(profile.stats?.activeBacklogs) || 0)}</h3>
                </div>
                <div className="h-14 w-14 rounded-2xl bg-rose-500/10 flex items-center justify-center text-rose-600 dark:text-rose-400 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-xl">
                  <Layers className="h-7 w-7" />
                </div>
              </div>
              <Badge
                variant={parseInt(profile.stats?.activeBacklogs) > 0 ? "destructive" : "secondary"}
                className={`mt-6 rounded-full px-4 py-1 text-[9px] font-black uppercase tracking-widest ${parseInt(profile.stats?.activeBacklogs) === 0 ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/20 shadow-sm" : "shadow-lg shadow-rose-500/20"}`}
              >
                {parseInt(profile.stats?.activeBacklogs) === 0 ? "Perfect Record" : "Action Required"}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-7 space-y-8">
            {/* Academic Details */}
            <motion.div variants={itemVariants}>
              <Card className="rounded-[2rem] border-none shadow-sm bg-card dark:bg-[#161b22]/40 backdrop-blur-xl overflow-hidden group border border-border dark:border-white/[0.08]">
                <div className="h-2 w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-800"></div>
                <CardContent className="p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-inner">
                      <GraduationCap className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Academic Profile</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Verified Scholastic Records</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {[
                      { label: 'Department', value: profile.stats?.department || 'N/A', icon: Building2 },
                      { label: 'CGPA', value: `${Math.min(10, Math.max(0, parseFloat(profile.stats?.cgpa) || 0)).toFixed(2)} / 10`, icon: Award },
                      { label: 'Academic Year', value: profile.stats?.year ? `${profile.stats.year}${profile.stats.year === 1 ? 'st' : profile.stats.year === 2 ? 'nd' : profile.stats.year === 3 ? 'rd' : 'th'} Year` : 'N/A', icon: Layers },
                      { label: 'Passing Batch', value: profile.stats?.passingYear || 'N/A', icon: Rocket },
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4 p-4 rounded-2xl bg-[#f8fafc] dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-md hover:border-transparent group/item">
                        <div className="h-10 w-10 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center text-slate-400 group-hover/item:text-blue-500 transition-colors shadow-sm">
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{item.label}</p>
                          <p className="text-base font-bold text-slate-900 dark:text-white">{item.value}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Experience Timeline */}
            <motion.div variants={itemVariants}>
              <Card className="rounded-[2rem] border-none shadow-sm bg-card dark:bg-[#161b22]/40 backdrop-blur-xl overflow-hidden group border border-border dark:border-white/[0.08]">
                <div className="h-2 w-full bg-gradient-to-r from-blue-500 to-blue-800"></div>
                <CardContent className="p-10">
                  <div className="flex items-center justify-between mb-10">
                    <div className="flex items-center gap-4">
                       <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-inner">
                        <Briefcase className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Professional History</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Career Timeline & Roles</p>
                      </div>
                    </div>
                    <Button onClick={() => user?.status === 'ACTIVE' ? setShowExperienceModal(true) : setShowPendingDialog(true)} variant="ghost" size="sm" className="text-blue-600 dark:text-blue-400 hover:bg-blue-500/10 rounded-xl px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all">
                      <Plus className="h-4 w-4 mr-2" /> Add Entry
                    </Button>
                  </div>

                   <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-blue-100 dark:before:from-blue-900/50 before:via-slate-100 dark:before:via-slate-800 before:to-transparent">
                    {profile.experiences?.length > 0 ? (
                      profile.experiences.map((exp: any, i: number) => (
                        <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group/timeline">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white dark:border-slate-800 bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400 shadow-sm shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            <Building2 className="h-5 w-5" />
                          </div>
                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 rounded-2xl bg-[#f8fafc] dark:bg-white/5 border border-slate-100 dark:border-white/10 shadow-sm transition-all hover:shadow-md hover:bg-white dark:hover:bg-white/10 group-hover/timeline:border-blue-100 dark:group-hover/timeline:border-blue-500/30">
                            <div className="flex justify-between items-start mb-1">
                              <h4 className="font-bold text-slate-900 dark:text-white">{exp.role}</h4>
                              <Button variant="ghost" size="icon" className="h-7 w-7 text-slate-400 hover:text-rose-500 opacity-0 group-hover/timeline:opacity-100 transition-opacity"
                                onClick={() => {
                                  if (user?.status !== 'ACTIVE') {
                                    setShowPendingDialog(true);
                                    return;
                                  }
                                  const expId = profile.experiences[i]?.id;
                                  const updated = profile.experiences.filter((_: any, idx: number) => idx !== i);
                                  setProfile({ ...profile, experiences: updated });
                                  handleSave({ ...profile, experiences: updated, deleteExperienceIds: expId ? [expId] : [] });
                                }}
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </Button>
                            </div>
                            <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">{exp.companyName}</p>
                            <time className="text-xs font-medium text-slate-400 mb-2 block">{exp.startDate} — {exp.endDate || 'Present'}</time>
                            {exp.description && <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">{exp.description}</p>}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-10 bg-[#f8fafc]/50 dark:bg-white/5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                        <Briefcase className="h-10 w-10 text-slate-200 mx-auto mb-3" />
                        <p className="text-sm text-slate-400 italic">No professional experience listed.</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-5 space-y-8">
            {/* Skills Card */}
            <motion.div variants={itemVariants}>
              <Card className="rounded-[2rem] border-none shadow-sm bg-card dark:bg-[#161b22]/40 backdrop-blur-xl overflow-hidden group border border-border dark:border-white/[0.08]">
                <div className="h-2 w-full bg-gradient-to-r from-emerald-500 to-teal-500"></div>
                <CardContent className="p-10">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="p-3 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-inner">
                      <Code2 className="h-7 w-7" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Technical Stack</h3>
                      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Core Competencies</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2.5">
                    {profile.skills?.length > 0 ? (
                      profile.skills.map((skill: any, i: number) => {
                        const colors = [
                          'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20 hover:bg-blue-600 dark:hover:bg-blue-500 hover:text-white',
                          'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-100 dark:border-indigo-500/20 hover:bg-indigo-600 dark:hover:bg-indigo-500 hover:text-white',
                          'bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-500/20 hover:bg-purple-600 dark:hover:bg-purple-500 hover:text-white',
                          'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 hover:bg-emerald-600 dark:hover:bg-emerald-500 hover:text-white',
                          'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-100 dark:border-rose-500/20 hover:bg-rose-600 dark:hover:bg-rose-500 hover:text-white',
                          'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20 hover:bg-amber-600 dark:hover:bg-amber-500 hover:text-white'
                        ];
                        const colorClass = colors[i % colors.length];

                        return (
                          <motion.div
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            key={i}
                          >
                            <Badge
                              className={`px-4 py-2 text-xs font-bold transition-all border rounded-xl cursor-default shadow-sm ${colorClass}`}
                            >
                              {skill.name}
                            </Badge>
                          </motion.div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                    )}
                  </div>

                  <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4">Quick Actions</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <Button
                        onClick={() => user?.status === 'ACTIVE' ? setShowProjectModal(true) : setShowPendingDialog(true)}
                        variant="outline"
                        className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-blue-50 dark:hover:bg-blue-500/10 hover:text-blue-600 dark:hover:text-blue-400 hover:border-blue-200 dark:hover:border-blue-500/30 transition-all h-auto py-3 flex-col gap-2"
                      >
                        <div className="p-2 rounded-lg bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400">
                          <Cpu className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold">Add Project</span>
                      </Button>
                      <Button
                        onClick={() => user?.status === 'ACTIVE' ? setShowExperienceModal(true) : setShowPendingDialog(true)}
                        variant="outline"
                        className="rounded-xl border-slate-200 dark:border-slate-800 hover:bg-emerald-50 dark:hover:bg-emerald-500/10 hover:text-emerald-600 dark:hover:text-emerald-400 hover:border-emerald-200 dark:hover:border-emerald-500/30 transition-all h-auto py-3 flex-col gap-2"
                      >
                        <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Briefcase className="h-4 w-4" />
                        </div>
                        <span className="text-xs font-bold">Add Exp.</span>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Certifications Card */}
            <motion.div variants={itemVariants}>
              <Card className="rounded-[2rem] border-none shadow-sm bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl overflow-hidden group border border-slate-200/60 dark:border-white/[0.08]">
                <div className="h-2 w-full bg-gradient-to-r from-rose-500 to-orange-500"></div>
                <CardContent className="p-10">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 shadow-inner">
                        <Award className="h-7 w-7" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Certifications</h3>
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Professional Recognition</p>
                      </div>
                    </div>
                    <Button onClick={() => user?.status === 'ACTIVE' ? setShowCertificateModal(true) : setShowPendingDialog(true)} variant="ghost" size="sm" className="text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 rounded-xl px-3 py-1.5">
                      <Plus className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {profile.certificates?.length > 0 ? (
                      profile.certificates.map((cert: any, i: number) => (
                        <div key={i} className="group/cert p-4 rounded-2xl bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/10 transition-all hover:bg-white dark:hover:bg-white/10 hover:shadow-md hover:border-rose-100 dark:hover:border-rose-500/30">
                          <div className="flex justify-between items-start">
                            <div className="flex gap-4">
                              <div className="h-12 w-12 rounded-xl bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 shadow-sm group-hover/cert:text-rose-500 transition-colors">
                                <CheckCircle className="h-6 w-6 text-emerald-500" />
                              </div>
                              <div className="min-w-0">
                                <h4 className="font-bold text-slate-900 dark:text-white truncate">{cert.title}</h4>
                                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{cert.issuer}</p>
                                <div className="flex items-center gap-3 mt-2">
                                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{cert.issuedDate}</span>
                                  {cert.certificateUrl && (
                                    <button
                                      className="text-[10px] font-bold text-indigo-600 hover:text-indigo-700 uppercase tracking-tighter flex items-center gap-1"
                                      onClick={() => openFile(cert.certificateUrl, cert.title)}
                                    >
                                      View <ExternalLink className="h-2.5 w-2.5" />
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500 opacity-0 group-hover/cert:opacity-100 transition-opacity shrink-0"
                              onClick={() => {
                                if (user?.status !== 'ACTIVE') {
                                  setShowPendingDialog(true);
                                  return;
                                }
                                const certId = profile.certificates[i]?.id;
                                const updated = profile.certificates.filter((_: any, idx: number) => idx !== i);
                                setProfile({ ...profile, certificates: updated });
                                handleSave({ ...profile, certificates: updated, deleteCertificateIds: certId ? [certId] : [] });
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic text-center py-6">No certifications added yet.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Resume Card */}
            <motion.div variants={itemVariants}>
              <Card className="rounded-2xl border-none shadow-sm bg-gradient-to-br from-slate-900 to-slate-800 text-white overflow-hidden relative group">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <CardContent className="p-8 relative z-10">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="p-2.5 rounded-xl bg-white/10 backdrop-blur-md text-white">
                      <FileText className="h-6 w-6" />
                    </div>
                    <h3 className="text-xl font-bold">Resume</h3>
                  </div>

                  <div className="flex items-center justify-between gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm group-hover:bg-white/10 transition-all">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-10 w-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                        <FileText className="h-5 w-5 text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold truncate">{profile.name}_Resume.pdf</p>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{profile.resumeUrl ? 'PDF Document • Ready' : 'No document uploaded'}</p>
                      </div>
                    </div>
                    <Button
                      onClick={() => profile.resumeUrl && openFile(profile.resumeUrl, `${profile.name}_Resume`)}
                      disabled={!profile.resumeUrl}
                      className="bg-white text-slate-900 hover:bg-slate-100 rounded-xl px-4 h-9 text-xs font-bold shadow-lg shadow-white/5 transition-transform active:scale-95 shrink-0"
                    >
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Projects Section - Full Width */}
        <motion.div variants={itemVariants} className="space-y-8">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-inner">
                <Rocket className="h-7 w-7" />
              </div>
              <div>
                <h3 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Featured Projects</h3>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Showcasing Innovation</p>
              </div>
            </div>
            <Button
              onClick={() => user?.status === 'ACTIVE' ? setShowProjectModal(true) : setShowPendingDialog(true)}
              className="bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.1] text-slate-700 dark:text-white hover:bg-purple-500 hover:text-white dark:hover:bg-purple-500 transition-all rounded-[1.5rem] px-8 h-14 text-xs font-black uppercase tracking-widest shadow-sm"
            >
              <Plus className="h-5 w-5 mr-3" /> Add Project
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.projects?.length > 0 ? (
              profile.projects.map((project: any, i: number) => (
                <motion.div
                  key={i}
                  whileHover={{ y: -5 }}
                  className="group"
                >
                  <Card className="rounded-[2.5rem] border-none shadow-sm bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl h-full flex flex-col overflow-hidden transition-all duration-500 hover:shadow-2xl hover:translate-y-[-8px] hover:border-indigo-500/30 border border-slate-200/60 dark:border-white/[0.08]">
                    <div className="h-2 w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
                    <CardContent className="p-8 flex-1 flex flex-col">
                      <div className="flex justify-between items-start mb-6">
                        <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-black/20 flex items-center justify-center text-indigo-500 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 shadow-inner">
                          <Globe className="h-7 w-7" />
                        </div>
                        <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"
                          onClick={() => {
                            if (user?.status !== 'ACTIVE') {
                              setShowPendingDialog(true);
                              return;
                            }
                            const projId = profile.projects[i]?.id;
                            const updated = profile.projects.filter((_: any, idx: number) => idx !== i);
                            setProfile({ ...profile, projects: updated });
                            handleSave({ ...profile, projects: updated, deleteProjectIds: projId ? [projId] : [] });
                          }}
                        >
                          <Trash2 className="h-5 w-5" />
                        </Button>
                      </div>

                      <h4 className="text-2xl font-black text-slate-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors tracking-tight">{project.title}</h4>
                      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-3 mb-8 leading-relaxed flex-1 font-medium">{project.description || 'No description provided.'}</p>

                      <div className="flex flex-wrap gap-2.5 mb-8">
                        {project.techStack?.split(',').map((tech: string, j: number) => (
                          <Badge key={j} variant="secondary" className="bg-slate-100 dark:bg-white/5 text-slate-600 dark:text-slate-400 hover:bg-indigo-500 hover:text-white border-none px-3 py-1 text-[10px] font-black rounded-lg uppercase tracking-widest transition-all">
                            {tech.trim()}
                          </Badge>
                        ))}
                      </div>

                      <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-100 dark:border-white/5">
                        {project.liveUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest border-slate-200/60 dark:border-white/10 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500 transition-all shadow-sm"
                            onClick={() => window.open(project.liveUrl, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" /> Live Demo
                          </Button>
                        )}
                        {project.githubUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-2xl h-12 text-[10px] font-black uppercase tracking-widest border-slate-200/60 dark:border-white/10 hover:bg-slate-900 hover:text-white dark:hover:bg-slate-800 transition-all shadow-sm"
                            onClick={() => window.open(project.githubUrl, '_blank')}
                          >
                            <Code2 className="h-4 w-4 mr-2" /> GitHub
                          </Button>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <div className="col-span-full py-16 bg-white dark:bg-slate-900/50 rounded-3xl border-none shadow-sm flex flex-col items-center justify-center text-center px-4">
                <div className="h-20 w-20 rounded-3xl bg-slate-50 dark:bg-white/5 flex items-center justify-center text-slate-200 dark:text-slate-800 mb-6">
                  <Rocket className="h-10 w-10" />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">No projects showcased yet</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs mb-8">Start building your portfolio by adding your best projects and technical work.</p>
                <Button
                  onClick={() => setShowProjectModal(true)}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 h-12 font-bold shadow-lg shadow-indigo-100"
                >
                  Create First Project
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Modals */}
        <ProjectModal isOpen={showProjectModal} onClose={() => setShowProjectModal(false)} onAddProject={handleAddProject} />
        <ExperienceModal isOpen={showExperienceModal} onClose={() => setShowExperienceModal(false)} onAddExperience={handleAddExperience} />
        <CertificateModal isOpen={showCertificateModal} onClose={() => setShowCertificateModal(false)} onAddCertificate={handleAddCertificate} />
        <ProfileEditDialog
          isOpen={showProfileEditDialog}
          onClose={() => setShowProfileEditDialog(false)}
          profile={profile}
          onSave={handleSave}
          isLoading={backendLoading}
        />

        {/* Approval Pending Dialog */}
        <Dialog open={showPendingDialog} onOpenChange={setShowPendingDialog}>
          <DialogContent className="max-w-xl p-0 bg-transparent border-none shadow-none overflow-visible">
            <ProfileApprovalPending 
              onClose={() => setShowPendingDialog(false)} 
              onContactSupport={() => {
                setShowPendingDialog(false);
                toast.info("Support contact initiated. Our team will reach out soon.");
              }}
            />
          </DialogContent>
        </Dialog>

        {/* Document Preview Dialog */}
        <Dialog
          open={!!previewUrl}
          onOpenChange={(open) => {
            if (!open) {
              setPreviewUrl(null);
              setIsPdfPreview(false);
            }
          }}
        >
          <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col bg-white dark:bg-slate-950 border-none shadow-2xl rounded-3xl">
            <DialogHeader className="p-6 border-b dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold truncate flex items-center gap-3 text-slate-800 dark:text-slate-200">
                  <div className="p-2 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
                    <FileText className="h-6 w-6" />
                  </div>
                  {previewName}
                </DialogTitle>
                <Button variant="outline" size="sm" className="rounded-xl border-slate-200 dark:border-slate-800" onClick={() => window.open(previewUrl!, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" /> Open Full View
                </Button>
              </div>
            </DialogHeader>
            <div className="flex-1 bg-slate-100 overflow-hidden relative">
              {isPdfPreview ? (
                <object
                  data={`${previewUrl}#toolbar=0&navpanes=0`}
                  type="application/pdf"
                  className="w-full h-full"
                >
                  <div className="h-full flex items-center justify-center p-8">
                    <div className="max-w-lg text-center space-y-5">
                      <img
                        src={previewUrl!.replace('/upload/', '/upload/pg_1,f_jpg,w_1200/').replace(/\.pdf$/i, '.jpg')}
                        alt="PDF preview"
                        className="w-full max-h-[60vh] object-contain rounded-xl border border-slate-200 bg-white"
                      />
                      <p className="text-sm text-slate-600 dark:text-slate-300">
                        PDF preview is blocked in this browser. Use open or download to view the document.
                      </p>
                      <div className="flex justify-center gap-3">
                        <Button
                          variant="outline"
                          onClick={() => window.open(previewUrl!, '_blank')}
                          className="rounded-xl"
                        >
                          Open PDF
                        </Button>
                        <Button
                          onClick={() => window.open(previewUrl!.replace('/upload/', '/upload/fl_attachment/'), '_blank')}
                          className="rounded-xl"
                        >
                          Download PDF
                        </Button>
                      </div>
                    </div>
                  </div>
                </object>
              ) : (
                <iframe src={previewUrl!} className="w-full h-full border-none" title="Document Preview" />
              )}
            </div>
          </DialogContent>
        </Dialog>
      </motion.div>
    </div>
  );
};

export default StudentProfile;