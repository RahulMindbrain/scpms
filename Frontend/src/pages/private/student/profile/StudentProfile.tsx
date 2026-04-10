import { useState, useRef } from 'react';
import {
  User, Mail, Phone, MapPin, GraduationCap,
  Code2, Package, Edit3, ExternalLink, Plus, Trash2, Save,
  Upload, Camera, Briefcase, Award, Globe, Loader2, FileText
} from 'lucide-react';
import ProjectModal from './modal/ProjectModal';
import { uploadToCloudinary } from '../../../../lib/cloudinary';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

const StudentProfile = () => {
  const [showProjectModal, setShowProjectModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const [newSkill, setNewSkill] = useState("");
  const [profile, setProfile] = useState({
    name: 'Anjali Sharma',
    profileImage: null,
    batch: '2026 Batch',
    branch: 'B.Tech Computer Science',
    email: 'anjali.sharma@campus.edu',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    stats: {
      cgpa: '8.7',
      tenth: '92.4%',
      twelfth: '89.6%',
      backlogs: '0',
      rollNo: 'CSE2022045',
      department: 'CSE'
    },
    skills: [
      { name: 'React', color: 'bg-blue-500' },
      { name: 'TypeScript', color: 'bg-blue-600' },
      { name: 'Node.js', color: 'bg-green-600' },
      { name: 'Python', color: 'bg-yellow-600' },
      { name: 'MongoDB', color: 'bg-green-500' },
      { name: 'Git', color: 'bg-orange-600' },
    ],
    projects: [
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce app with payment integration and admin dashboard.',
        tags: ['React', 'Node.js', 'MongoDB'],
        image: null
      }
    ],
    resumes: [
      { name: 'Anjali_Sharma_Resume.pdf', date: 'Apr 1, 2026', size: '245 KB', url: '#' }
    ]
  });

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
        resumes: [newResume, ...profile.resumes]
      });
      toast.success("Resume uploaded successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to upload resume", { id: toastId });
    } finally {
      setIsUploadingResume(false);
    }
  }

  const addSkill = () => {
    if (!newSkill.trim()) return;
    setProfile({
      ...profile,
      skills: [...profile.skills, { name: newSkill, color: "bg-indigo-500" }]
    });
    setNewSkill("");
  };

  const deleteSkill = (index: number) => {
    const updated = profile.skills.filter((_, i) => i !== index)
    setProfile({ ...profile, skills: updated })
  }

  const handleAddProject = (project: any) => {
    setProfile({
      ...profile,
      projects: [...profile.projects, project]
    });
  };

  const updateStat = (field: string, value: string) => {
    setProfile({ ...profile, stats: { ...profile.stats, [field]: value } });
  };

  const updateProfileField = (field: string, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in mt-2 p-4 md:p-0">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="bg-blue-600 p-2.5 rounded-2xl text-white shadow-lg shadow-blue-500/20">
            <User size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">My Profile</h1>
            <p className="text-slate-500 font-medium">Manage your academic and professional identity.</p>
          </div>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className={`px-8 py-3 rounded-2xl font-black text-sm transition-all shadow-xl tracking-widest flex items-center justify-center gap-3 ${
            isEditing ? 'bg-blue-600 text-white shadow-blue-500/20' : 'bg-white text-slate-900 border border-slate-200'
          }`}
        >
          {isEditing ? <><Save size={18} /> SAVE CHANGES</> : <><Edit3 size={18} /> EDIT PROFILE</>}
        </button>
      </div>

      <div className="grid grid-cols-12 gap-6 lg:gap-8">
        {/* Left Column: Personal Info & Academics */}
        <div className="col-span-12 lg:col-span-4 space-y-6 lg:space-y-8">
          {/* Identity Card */}
          <div className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden shadow-sm">
            <div className="h-40 bg-gradient-to-br from-blue-600 to-indigo-700 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>
            </div>
            <div className="px-8 pb-8">
              <div className="relative -mt-20 mb-6 flex justify-center lg:justify-start">
                <div className="w-36 h-36 rounded-[2.5rem] border-8 border-white overflow-hidden bg-slate-100 shadow-2xl group relative transition-transform hover:scale-105 duration-300">
                  <input type="file" ref={profileImageInputRef} onChange={handleProfileImageUpload} hidden accept="image/*" />
                  {profile.profileImage ? (
                    <img src={profile.profileImage} className="w-full h-full object-cover" alt="Profile" />
                  ) : (
                    <div className="w-full h-full bg-blue-50 flex items-center justify-center text-blue-600 text-4xl font-black">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                  {isEditing && (
                    <div onClick={() => profileImageInputRef.current?.click()} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                      {isUploading ? <Loader2 className="text-white animate-spin" size={28} /> : <Camera className="text-white" size={28} />}
                    </div>
                  )}
                </div>
              </div>

              <div className="text-center lg:text-left space-y-1">
                {isEditing ? (
                  <input className="text-2xl font-black text-slate-900 w-full bg-slate-50 border-b-2 border-blue-500 px-2 py-1 outline-none uppercase" value={profile.name} onChange={(e) => updateProfileField("name", e.target.value)} />
                ) : (
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">{profile.name}</h2>
                )}
                <p className="text-blue-600 font-black text-xs uppercase tracking-widest">{profile.branch}</p>
                <div className="flex items-center justify-center lg:justify-start gap-2 pt-1">
                   <Badge variant="secondary" size="xs">{profile.batch}</Badge>
                   <Badge variant="secondary" size="xs">{profile.stats.rollNo}</Badge>
                </div>
              </div>

              <div className="mt-8 space-y-4 pt-6 border-t border-slate-50">
                {[
                  { icon: Mail, value: profile.email, field: 'email', type: 'email' },
                  { icon: Phone, value: profile.phone, field: 'phone', type: 'tel' },
                  { icon: MapPin, value: profile.location, field: 'location', type: 'text' }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className="w-9 h-9 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                      <item.icon size={18} />
                    </div>
                    {isEditing ? (
                      <input type={item.type} value={item.value as string} onChange={(e) => updateProfileField(item.field, e.target.value)} className="w-full text-sm font-bold text-slate-600 bg-transparent border-b border-slate-100 focus:border-blue-500 outline-none transition-colors" />
                    ) : (
                      <span className="text-sm font-bold text-slate-700 truncate">{item.value}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Academic Overview */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <GraduationCap className="text-blue-600" size={22} />
              <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Academic Standings</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'CGPA', value: profile.stats.cgpa, field: 'cgpa' },
                { label: 'BACKLOGS', value: profile.stats.backlogs, field: 'backlogs' },
                { label: '10TH GRADE', value: profile.stats.tenth, field: 'tenth' },
                { label: '12TH GRADE', value: profile.stats.twelfth, field: 'twelfth' }
              ].map((stat, i) => (
                <div key={i} className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-slate-400 text-[9px] font-black uppercase tracking-[0.2em] mb-1">{stat.label}</p>
                  {isEditing ? (
                    <input value={stat.value} onChange={(e) => updateStat(stat.field, e.target.value)} className="w-full text-lg font-black text-blue-600 bg-transparent border-b border-blue-200 outline-none" />
                  ) : (
                    <p className="text-xl font-black text-blue-600 tracking-tight">{stat.value}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Skills, Projects, Docs */}
        <div className="col-span-12 lg:col-span-8 space-y-6 lg:space-y-8">
          {/* Tech Stack */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <Code2 className="text-blue-600" size={22} />
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Technical Stack</h3>
              </div>
              {isEditing && (
                <div className="flex gap-2">
                  <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill" className="bg-slate-50 border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 transition-all" />
                  <button onClick={addSkill} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-xs font-black shadow-lg shadow-blue-500/10 uppercase tracking-widest active:scale-95 transition-all">Add</button>
                </div>
              )}
            </div>
            <div className="flex flex-wrap gap-4">
              {profile.skills.map((skill, i) => (
                <div key={i} className="group flex items-center gap-2.5 px-5 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-blue-200 hover:shadow-md transition-all cursor-default">
                  <div className={`w-2.5 h-2.5 rounded-full ${skill.color} shadow-sm`} />
                  <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{skill.name}</span>
                  {isEditing && <Trash2 size={14} className="text-slate-300 hover:text-red-500 cursor-pointer ml-1 transition-colors" onClick={() => deleteSkill(i)} />}
                </div>
              ))}
            </div>
          </div>

          {/* Projects */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Briefcase className="text-blue-600" size={22} />
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Case Studies & Projects</h3>
              </div>
              {isEditing && (
                <button onClick={() => setShowProjectModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-lg shadow-blue-500/10 active:scale-95 transition-all">
                  <Plus size={16} /> New Project
                </button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {profile.projects.map((proj, i) => (
                <div key={i} className="p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 group">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight leading-tight">{proj.title}</h4>
                    <ExternalLink size={18} className="text-slate-300 hover:text-blue-500 transition-colors cursor-pointer" />
                  </div>
                  {proj.image && (
                    <img src={typeof proj.image === 'string' ? proj.image : URL.createObjectURL(proj.image)} className="w-full h-40 object-cover rounded-2xl mb-5 shadow-sm" alt={proj.title} />
                  )}
                  <p className="text-sm font-medium text-slate-500 mb-6 line-clamp-3 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {proj.tags.map(tag => (
                      <span key={tag} className="text-[10px] font-black px-3 py-1 bg-white border border-slate-100 text-slate-400 rounded-xl uppercase tracking-widest">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Featured Documents */}
          <div className="bg-white p-8 md:p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-3">
                <FileText className="text-blue-600" size={22} />
                <h3 className="font-black text-slate-900 uppercase tracking-widest text-sm">Professional Documents</h3>
              </div>
              <label className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-widest cursor-pointer shadow-xl shadow-slate-900/10 active:scale-95 transition-all">
                {isUploadingResume ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />} 
                {isUploadingResume ? 'PROCESSING...' : 'UPLOAD NEW RESUME'}
                <input type="file" accept=".pdf" hidden onChange={handleResumeUpload} disabled={isUploadingResume} />
              </label>
            </div>
            <div className="space-y-4">
              {profile.resumes.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:bg-white transition-all group">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-white rounded-2xl shadow-sm flex items-center justify-center text-rose-500 border border-slate-200/50 group-hover:scale-105 transition-transform">
                      <FileText size={28} />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm uppercase tracking-tight">{res.name}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{res.date} • {res.size}</p>
                    </div>
                  </div>
                  <a href={res.url} target="_blank" rel="noopener noreferrer" className="px-6 py-2.5 bg-white text-blue-600 font-black text-xs uppercase tracking-widest rounded-xl hover:bg-blue-600 hover:text-white border border-slate-200 hover:border-blue-600 transition-all shadow-sm">
                    View
                  </a>
                </div>
              ))}
            </div>
          </div>
          <ProjectModal
            isOpen={showProjectModal}
            onClose={() => setShowProjectModal(false)}
            onAddProject={handleAddProject}
          />
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;