import { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  User, 
  CheckCircle, 
  Briefcase, 
  FileSearch, 
  Calendar, 
  Bell, 
  FileText, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Code2, 
  Package, 
  Edit3,
  ExternalLink,
  Plus,
  Trash2,
  Save,
  X,
  Upload
} from 'lucide-react';
import Sidebar from '@/components/layout/Sidebar';
import type { SidebarItem } from '@/components/layout/Sidebar';

const StudentProfile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profile, setProfile] = useState({
    name: 'Priya Sharma',
    batch: '2026 Batch',
    branch: 'B.Tech Computer Science',
    email: 'priya.sharma@campus.edu',
    phone: '+91 98765 43210',
    location: 'Mumbai, India',
    stats: {
      cgpa: '8.7 / 10',
      tenth: '92.4%',
      twelfth: '89.6%',
      backlogs: 'None',
      rollNo: 'CSE2022045',
      department: 'Computer Science & Engineering'
    },
    skills: [
      { name: 'React', color: 'bg-emerald-500' },
      { name: 'TypeScript', color: 'bg-cyan-500' },
      { name: 'Node.js', color: 'bg-teal-500' },
      { name: 'Python', color: 'bg-emerald-600' },
      { name: 'MongoDB', color: 'bg-cyan-600' },
      { name: 'SQL', color: 'bg-teal-600' },
      { name: 'Git', color: 'bg-emerald-400' },
      { name: 'Docker', color: 'bg-cyan-400' },
      { name: 'AWS', color: 'bg-teal-400' }
    ],
    projects: [
      {
        title: 'E-Commerce Platform',
        description: 'Full-stack e-commerce app with payment integration',
        tags: ['React', 'Node.js', 'MongoDB']
      },
      {
        title: 'ML Sentiment Analyzer',
        description: 'NLP-based sentiment analysis on social media data',
        tags: ['Python', 'Flask', 'TensorFlow']
      },
      {
        title: 'Chat Application',
        description: 'Real-time messaging app with group chat support',
        tags: ['Socket.io', 'Express', 'React']
      }
    ],
    resumes: [
      {
        name: 'Priya_Sharma_Resume.pdf',
        date: 'Apr 1, 2026',
        size: '245 KB'
      }
    ]
  });

  const [newSkill, setNewSkill] = useState('');

  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard', section: 'Main' },
    { icon: User, label: 'My Profile', path: '/student/profile', section: 'Main' },
    { icon: CheckCircle, label: 'Eligibility', path: '/student/eligibility', section: 'Main' },
    { icon: Briefcase, label: 'Job Listings', path: '/student/jobs', section: 'Main' },
    { icon: FileSearch, label: 'My Applications', path: '/student/applications', section: 'Main' },
    { icon: Calendar, label: 'Interview Schedule', path: '/student/interviews', section: 'Tools' },
    { icon: Bell, label: 'Notifications', path: '/student/notifications', section: 'Tools' },
    { icon: FileText, label: 'Documents', path: '/student/documents', section: 'Tools' },
  ];

  const handleInputChange = (field: string, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleStatsChange = (field: string, value: string) => {
    setProfile(prev => ({
      ...prev,
      stats: { ...prev.stats, [field]: value }
    }));
  };

  const addSkill = () => {
    if (newSkill.trim()) {
      const colors = ['bg-emerald-500', 'bg-cyan-500', 'bg-teal-500', 'bg-blue-500', 'bg-indigo-500'];
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, { name: newSkill.trim(), color: randomColor }]
      }));
      setNewSkill('');
    }
  };

  const removeSkill = (index: number) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const updatedProjects = [...profile.projects];
    updatedProjects[index] = { ...updatedProjects[index], [field]: value };
    setProfile(prev => ({ ...prev, projects: updatedProjects }));
  };

  const addProject = () => {
    setProfile(prev => ({
      ...prev,
      projects: [...prev.projects, { title: 'New Project', description: 'Description here', tags: [] }]
    }));
  };

  const removeProject = (index: number) => {
    setProfile(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const newResume = {
        name: file.name,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        size: `${(file.size / 1024).toFixed(0)} KB`
      };
      setProfile(prev => ({
        ...prev,
        resumes: [newResume, ...prev.resumes]
      }));
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar 
        items={sidebarItems} 
        portalName="Student Portal" 
        onSignOut={() => console.log('Sign Out')} 
      />

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex items-center justify-between mb-8 sticky top-0 bg-gray-50/80 backdrop-blur-md z-10 py-2">
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-5 h-5" />
            <h2 className="font-bold text-xl text-gray-800">My Profile</h2>
          </div>
          <div className="flex items-center gap-5">
            <div className="relative cursor-pointer group">
              <Bell className="w-6 h-6 text-gray-500 group-hover:text-blue-600 transition-colors" />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full border-2 border-white font-bold">5</span>
            </div>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="w-10 h-10 bg-cyan-600 rounded-full flex items-center justify-center text-white font-bold shadow-md shadow-cyan-600/20 border-2 border-white">PS</div>
            </div>
          </div>
        </header>

        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="relative group">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-2xl flex items-center justify-center text-white text-4xl font-bold shadow-xl shadow-blue-500/20 ring-4 ring-white">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </div>
              {isEditing && (
                <button className="absolute -bottom-2 -right-2 bg-white p-2 rounded-lg shadow-lg border border-gray-100 text-blue-600 hover:text-blue-700 transition-colors">
                  <Upload className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="flex-1 text-center md:text-left w-full">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                <div className="w-full max-w-md">
                  {isEditing ? (
                    <div className="space-y-2">
                      <input 
                        type="text" 
                        value={profile.name} 
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-3xl font-bold text-gray-900 tracking-tight w-full bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="flex gap-2">
                         <input 
                          type="text" 
                          value={profile.branch} 
                          onChange={(e) => handleInputChange('branch', e.target.value)}
                          className="text-gray-500 font-medium bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 flex-1 outline-none"
                        />
                        <input 
                          type="text" 
                          value={profile.batch} 
                          onChange={(e) => handleInputChange('batch', e.target.value)}
                          className="text-gray-500 font-medium bg-gray-50 border border-gray-200 rounded-lg px-2 py-1 w-28 outline-none"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <h1 className="text-3xl font-bold text-gray-900 tracking-tight">{profile.name}</h1>
                      <p className="text-gray-500 font-medium">{profile.branch} • {profile.batch}</p>
                    </>
                  )}
                </div>
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center justify-center gap-2 px-6 py-2.5 font-semibold rounded-xl transition-all shadow-sm ${
                    isEditing 
                      ? 'bg-blue-600 text-white hover:bg-blue-700' 
                      : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 hover:border-gray-300'
                  }`}
                >
                  {isEditing ? <Save className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  {isEditing ? 'Save Profile' : 'Edit Profile'}
                </button>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-y-3 gap-x-6">
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 min-w-[200px]">
                  <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                  {isEditing ? (
                    <input 
                      type="email" 
                      value={profile.email} 
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="bg-transparent border-none outline-none w-full"
                    />
                  ) : profile.email}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 min-w-[150px]">
                  <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.phone} 
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="bg-transparent border-none outline-none w-full"
                    />
                  ) : profile.phone}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 bg-gray-50 px-3 py-1.5 rounded-lg border border-gray-100 min-w-[150px]">
                  <MapPin className="w-4 h-4 text-indigo-500 shrink-0" />
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.location} 
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="bg-transparent border-none outline-none w-full"
                    />
                  ) : profile.location}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Academic Details */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-blue-50 rounded-lg">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Academic Details</h3>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Department', key: 'department' },
                { label: 'CGPA', key: 'cgpa' },
                { label: '10th %', key: 'tenth' },
                { label: '12th %', key: 'twelfth' },
                { label: 'Backlogs', key: 'backlogs' },
                { label: 'Roll No', key: 'rollNo' },
              ].map((stat, idx) => (
                <div key={idx} className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0 hover:bg-gray-50/50 px-2 rounded-lg transition-colors">
                  <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                  {isEditing ? (
                    <input 
                      type="text" 
                      value={profile.stats[stat.key as keyof typeof profile.stats]} 
                      onChange={(e) => handleStatsChange(stat.key, e.target.value)}
                      className="text-sm font-bold text-gray-800 text-right bg-transparent border-b border-gray-200 outline-none focus:border-blue-500 w-32"
                    />
                  ) : (
                    <span className="text-sm font-bold text-gray-800">{profile.stats[stat.key as keyof typeof profile.stats]}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Skills */}
          <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-50 rounded-lg">
                  <Code2 className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-bold text-gray-800 tracking-tight">Skills</h3>
              </div>
            </div>
            {isEditing && (
              <div className="mb-6 flex gap-2">
                <input 
                  type="text" 
                  placeholder="Add a skill..." 
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addSkill()}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                />
                <button 
                  onClick={addSkill}
                  className="p-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                >
                  <Plus className="w-5 h-5" />
                </button>
              </div>
            )}
            <div className="flex flex-wrap gap-3">
              {profile.skills.map((skill, idx) => (
                <span 
                  key={idx} 
                  className={`${skill.color} text-white px-4 py-2 rounded-xl text-xs font-bold shadow-lg shadow-current/10 hover:scale-105 transition-transform cursor-default flex items-center gap-2`}
                >
                  {skill.name}
                  {isEditing && (
                    <X 
                      className="w-3 h-3 cursor-pointer hover:text-red-200" 
                      onClick={() => removeSkill(idx)}
                    />
                  )}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Projects */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 mb-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-50 rounded-lg">
                <Package className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Projects</h3>
            </div>
            {isEditing && (
              <button 
                onClick={addProject}
                className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition-all text-sm font-bold shadow-lg shadow-indigo-600/20"
              >
                <Plus className="w-4 h-4" />
                Add Project
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {profile.projects.map((project, idx) => (
              <div key={idx} className="p-6 bg-gray-50/50 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all group relative">
                {isEditing && (
                  <button 
                    onClick={() => removeProject(idx)}
                    className="absolute top-2 right-2 p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-500 hover:text-white transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
                {isEditing ? (
                  <div className="space-y-3">
                    <input 
                      type="text" 
                      value={project.title} 
                      onChange={(e) => handleProjectChange(idx, 'title', e.target.value)}
                      className="font-bold text-gray-900 bg-white border border-gray-200 rounded-lg px-2 py-1 w-full outline-none"
                    />
                    <textarea 
                      value={project.description} 
                      onChange={(e) => handleProjectChange(idx, 'description', e.target.value)}
                      className="text-xs text-gray-500 font-medium bg-white border border-gray-200 rounded-lg px-2 py-1 w-full outline-none h-20 resize-none"
                    />
                  </div>
                ) : (
                  <>
                    <h4 className="font-bold text-gray-900 mb-2 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">{project.title}</h4>
                    <p className="text-xs text-gray-500 font-medium mb-4 leading-relaxed">{project.description}</p>
                  </>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  {project.tags.map((tag, tIdx) => (
                    <span key={tIdx} className="px-2 py-1 bg-white border border-gray-200 text-gray-600 rounded-lg text-[10px] font-bold">
                      {tag}
                    </span>
                  ))}
                  {isEditing && (
                     <button className="px-2 py-1 bg-white border border-dashed border-gray-300 text-gray-400 rounded-lg text-[10px] font-bold hover:text-indigo-600 hover:border-indigo-600 transition-all">
                      + Tag
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Resume */}
        <div className="bg-white p-8 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-50 rounded-lg">
                <FileText className="w-5 h-5 text-cyan-600" />
              </div>
              <h3 className="text-lg font-bold text-gray-800 tracking-tight">Resume</h3>
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleResumeUpload} 
              className="hidden" 
              accept=".pdf,.doc,.docx"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-4 py-2 bg-cyan-600 text-white rounded-xl hover:bg-cyan-700 transition-all text-sm font-bold shadow-lg shadow-cyan-600/20"
            >
              <Upload className="w-4 h-4" />
              Upload Resume
            </button>
          </div>
          <div className="space-y-4">
            {profile.resumes.map((resume, idx) => (
              <div key={idx} className="flex items-center justify-between p-5 bg-gray-50/50 rounded-2xl border border-gray-100 hover:bg-gray-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-white rounded-xl shadow-sm border border-gray-100 text-red-500 group-hover:scale-110 transition-transform">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-gray-900">{resume.name}</h4>
                    <p className="text-xs text-gray-500 font-medium mt-0.5">Uploaded on {resume.date} • {resume.size}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isEditing && (
                    <button 
                      onClick={() => setProfile(prev => ({ ...prev, resumes: prev.resumes.filter((_, i) => i !== idx) }))}
                      className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-700 font-bold rounded-xl border border-gray-200 hover:bg-gray-100 hover:border-gray-300 transition-all shadow-sm">
                    <ExternalLink className="w-4 h-4" />
                    View Resume
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default StudentProfile;
