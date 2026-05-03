import {
  Mail, GraduationCap,
  Code2, Edit3, ExternalLink, Plus, Trash2,
  Briefcase, FileText, Building2,
  Lightbulb, Globe, Upload, CheckCircle, Bell, User
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const StudentProfile = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile: backendProfile, loading: backendLoading } = useSelector((state: RootState) => state.student);
  const { user } = useSelector((state: RootState) => state.auth);

  const [showProjectModal, setShowProjectModal] = useState(false)
  const [showExperienceModal, setShowExperienceModal] = useState(false)
  const [showCertificateModal, setShowCertificateModal] = useState(false)
  const [showProfileEditDialog, setShowProfileEditDialog] = useState(false)
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
          color: 'bg-[#14b8a6]' 
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

      const commonPayload: any = {
        year: isNaN(yearInt) ? undefined : yearInt,
        passingYear: isNaN(passingYearInt) ? undefined : passingYearInt,
        cgpa: (isNaN(cgpaFloat) || yearInt === 1) ? undefined : cgpaFloat,
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

  const openFile = (url: string, name = '') => {
    if (!url) return;
    setPreviewName(name);
    setPreviewUrl(url);
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

  return (
    <div className="min-h-screen bg-[#f8fafc] pb-20 selection:bg-primary/30">
      <div className="max-w-[1200px] mx-auto space-y-6 px-4 sm:px-6 lg:px-8 pt-8">
        
        {/* Header Card */}
        <Card className="border-none shadow-sm rounded-xl overflow-hidden bg-white">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="h-24 w-24 border-none shadow-sm">
                  {profile.profileImage ? (
                    <AvatarImage src={profile.profileImage} alt={profile.name} className="object-cover" />
                  ) : (
                    <AvatarFallback className="text-3xl font-bold bg-[#1e40af] text-white">
                      {profile.name.split(' ').map((n: string) => n[0]).join('')}
                    </AvatarFallback>
                  )}
                </Avatar>
                <div className="text-center md:text-left space-y-1">
                  <h1 className="text-3xl font-bold text-[#1e293b]">{profile.name}</h1>
                  <p className="text-sm font-medium text-slate-500">
                    {profile.stats?.department || 'Department Not Set'} • {profile.stats?.passingYear} Batch
                  </p>
                  <div className="flex flex-wrap justify-center md:justify-start items-center gap-4 pt-2 text-slate-500">
                    <div className="flex items-center gap-1.5 text-xs">
                      <Mail className="h-3.5 w-3.5" />
                      {profile.email}
                    </div>
                  </div>
                </div>
              </div>
              <Button
                onClick={() => setShowProfileEditDialog(true)}
                variant="outline"
                className="gap-2 rounded-lg border-slate-200 text-slate-600 hover:bg-slate-50 h-10 px-6 font-semibold"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Academic Details */}
          <Card className="border-none shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-4 flex flex-row items-center gap-2 space-y-0">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-bold text-[#1e293b]">Academic Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-sm text-slate-500">Department</span>
                <span className="text-sm font-bold text-[#1e293b]">{profile.stats?.department || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-sm text-slate-500">CGPA</span>
                <span className="text-sm font-bold text-[#1e293b]">{profile.stats?.cgpa || '0.0'} / 10</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-sm text-slate-500">Backlogs</span>
                <span className="text-sm font-bold text-[#1e293b]">{profile.stats?.activeBacklogs || 'None'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-sm text-slate-500">Batch</span>
                <span className="text-sm font-bold text-[#1e293b]">{profile.stats?.passingYear || 'N/A'}</span>
              </div>
              <div className="flex justify-between items-center py-1 border-b border-slate-50">
                <span className="text-sm text-slate-500">Year</span>
                <span className="text-sm font-bold text-[#1e293b]">{profile.stats?.year || 'N/A'}</span>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card className="border-none shadow-sm rounded-xl bg-white">
            <CardHeader className="pb-4 flex flex-row items-center gap-2 space-y-0">
              <Code2 className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-bold text-[#1e293b]">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills?.length > 0 ? (
                  profile.skills.map((skill: any, i: number) => (
                    <Badge 
                      key={i} 
                      className="px-4 py-1.5 text-xs font-semibold bg-[#14b8a6] text-white hover:bg-[#0d9488] border-none rounded-full"
                    >
                      {skill.name}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-slate-400 italic">No skills added yet.</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <Card className="border-none shadow-sm rounded-xl bg-white">
          <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-bold text-[#1e293b]">Projects</CardTitle>
            </div>
            <Button onClick={() => setShowProjectModal(true)} variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              <Plus className="h-4 w-4 mr-1" /> Add Project
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {profile.projects?.length > 0 ? (
                profile.projects.map((project: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col justify-between h-full group">
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <h4 className="font-bold text-[#1e293b]">{project.title}</h4>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => {
                            const projId = profile.projects[i]?.id;
                            const updated = profile.projects.filter((_: any, idx: number) => idx !== i);
                            setProfile({ ...profile, projects: updated });
                            handleSave({ ...profile, projects: updated, deleteProjectIds: projId ? [projId] : [] });
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-xs text-slate-500 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1.5">
                        {project.techStack?.split(',').map((tech: string, j: number) => (
                          <span key={j} className="px-2 py-0.5 text-[10px] bg-white border border-slate-200 rounded text-slate-600">
                            {tech.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic">No projects showcased yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Experience */}
        <Card className="border-none shadow-sm rounded-xl bg-white">
          <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <Briefcase className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-bold text-[#1e293b]">Experience</CardTitle>
            </div>
            <Button onClick={() => setShowExperienceModal(true)} variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              <Plus className="h-4 w-4 mr-1" /> Add Experience
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {profile.experiences?.length > 0 ? (
                profile.experiences.map((exp: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 group">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <Building2 className="h-5 w-5 text-slate-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1e293b]">{exp.role}</h4>
                          <p className="text-sm text-slate-500">{exp.companyName}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {exp.startDate} — {exp.endDate || 'Present'}
                          </p>
                          {exp.description && <p className="text-sm text-slate-600 mt-3 line-clamp-2">{exp.description}</p>}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const expId = profile.experiences[i]?.id;
                          const updated = profile.experiences.filter((_: any, idx: number) => idx !== i);
                          setProfile({ ...profile, experiences: updated });
                          handleSave({ ...profile, experiences: updated, deleteExperienceIds: expId ? [expId] : [] });
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-slate-400 italic">No professional experience listed.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Certifications */}
        <Card className="border-none shadow-sm rounded-xl bg-white">
          <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0">
            <div className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg font-bold text-[#1e293b]">Certifications</CardTitle>
            </div>
            <Button onClick={() => setShowCertificateModal(true)} variant="ghost" size="sm" className="text-blue-600 hover:bg-blue-50">
              <Plus className="h-4 w-4 mr-1" /> Add Certificate
            </Button>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {profile.certificates?.length > 0 ? (
                profile.certificates.map((cert: any, i: number) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-50 border border-slate-100 group">
                    <div className="flex justify-between items-start">
                      <div className="flex gap-4">
                        <div className="h-10 w-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0">
                          <CheckCircle className="h-5 w-5 text-emerald-500" />
                        </div>
                        <div>
                          <h4 className="font-bold text-[#1e293b]">{cert.title}</h4>
                          <p className="text-sm text-slate-500">{cert.issuer}</p>
                          <p className="text-xs text-slate-400">{cert.issuedDate}</p>
                          {cert.certificateUrl && (
                            <Button 
                              variant="link" 
                              className="p-0 h-auto text-xs text-blue-600 hover:text-blue-700 mt-2"
                              onClick={() => openFile(cert.certificateUrl, cert.title)}
                            >
                              View Credential
                            </Button>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
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
                <p className="text-sm text-slate-400 italic">No certifications added yet.</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Resume */}
        <Card className="border-none shadow-sm rounded-xl bg-white">
          <CardHeader className="pb-4 flex flex-row items-center gap-2 space-y-0">
            <FileText className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg font-bold text-[#1e293b]">Resume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[#1e293b]">{profile.name}_Resume.pdf</h4>
                  <p className="text-xs text-slate-400">PDF Document • {profile.resumeUrl ? 'Ready to view' : 'No resume uploaded'}</p>
                </div>
              </div>
              <Button 
                onClick={() => profile.resumeUrl && openFile(profile.resumeUrl, `${profile.name}_Resume`)}
                disabled={!profile.resumeUrl}
                variant="outline"
                className="bg-white border-slate-200 text-slate-600 hover:bg-slate-50"
              >
                View Resume
              </Button>
            </div>
          </CardContent>
        </Card>


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

        <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
          <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col bg-white border shadow-2xl rounded-xl">
            <DialogHeader className="p-6 border-b bg-slate-50 shrink-0">
              <div className="flex items-center justify-between">
                <DialogTitle className="text-xl font-bold truncate flex items-center gap-3 text-slate-800">
                  <FileText className="h-6 w-6 text-blue-600" />
                  {previewName}
                </DialogTitle>
                <Button variant="outline" size="sm" onClick={() => window.open(previewUrl!, '_blank')}>
                  <ExternalLink className="h-4 w-4 mr-2" /> Open External
                </Button>
              </div>
            </DialogHeader>
            <div className="flex-1 bg-slate-100 overflow-hidden relative">
              <iframe src={`${previewUrl}#toolbar=0`} className="w-full h-full border-none" title="Document Preview" />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default StudentProfile;