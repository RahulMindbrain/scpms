import { useState, useRef } from 'react';
import {
  User, Bell, FileText, Mail, Phone, MapPin, GraduationCap,
  Code2, Package, Edit3, ExternalLink, Plus, Trash2, Save,
  Upload, Camera, Briefcase, Award, Globe
} from 'lucide-react';
import ProjectModal from './modal/ProjectModal';
const StudentProfile = () => {
  const [showProjectModal, setShowProjectModal] = useState(false)

  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [newSkill, setNewSkill] = useState("");
  const [profile, setProfile] = useState({
    name: 'Anjali Sharma',
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
      { name: 'Anjali_Sharma_Resume.pdf', date: 'Apr 1, 2026', size: '245 KB' }
    ]
  });
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
    setProfile({
      ...profile,
      stats: {
        ...profile.stats,
        [field]: value
      }
    });
  };

  const updateProfileField = (field: string, value: string) => {
    setProfile({
      ...profile,
      [field]: value
    });
  };

  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const handleResumeUpload = (e: any) => {
    setResumeFile(e.target.files[0])
  }
  const uploadResume = async () => {

    const formData = new FormData()
    if (resumeFile) {
      formData.append("resume", resumeFile)
    }

    await fetch("http://localhost:3000/upload-resume", {
      method: "POST",
      body: formData
    })

  }
  return (
    <div className="min-h-screen bg-[#f8fafc] pb-12">
      {/* Top Navigation Bar */}
      <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-indigo-600 p-1.5 rounded-lg text-white">
              <User size={20} />
            </div>
            <h2 className="font-bold text-slate-800 text-lg">Student Profile</h2>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 border-2 border-white rounded-full"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200 mx-2" />
            <button
              onClick={() => setIsEditing(!isEditing)}
              className={`flex items-center gap-2 px-5 py-2 rounded-full font-semibold transition-all shadow-sm ${isEditing ? 'bg-indigo-600 text-white hover:bg-indigo-700' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              {isEditing ? <Save size={18} /> : <Edit3 size={18} />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 mt-8">
        <div className="grid grid-cols-12 gap-8">

          {/* Left Column: Profile Card & Quick Info */}
          <div className="col-span-12 lg:col-span-4 space-y-8">
            {/* Main Profile Card */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
              <div className="px-6 pb-6">
                <div className="relative -mt-16 mb-4 flex justify-center lg:justify-start">
                  <div className="w-32 h-32 rounded-3xl border-4 border-white overflow-hidden bg-slate-100 shadow-xl group">
                    <div className="w-full h-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-3xl font-bold">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    {isEditing && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                        <Camera className="text-white" size={24} />
                      </div>
                    )}
                  </div>
                </div>

                <div className="text-center lg:text-left">
                  {isEditing ? (
                    <input
                      className="text-2xl font-bold text-slate-900 w-full bg-slate-50 border-b border-indigo-500 outline-none"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  ) : (
                    <h1 className="text-2xl font-bold text-slate-900">{profile.name}</h1>
                  )}
                  <p className="text-indigo-600 font-medium text-sm mt-1">{profile.branch}</p>
                  {isEditing ? (
                    <div className="flex gap-2 mt-1">
                      <input
                        value={profile.batch}
                        onChange={(e) =>
                          setProfile({ ...profile, batch: e.target.value })
                        }
                        className="text-xs uppercase bg-transparent border-b border-indigo-400 outline-none"
                      />

                      <input
                        value={profile.stats.rollNo}
                        onChange={(e) =>
                          setProfile({
                            ...profile,
                            stats: {
                              ...profile.stats,
                              rollNo: e.target.value
                            }
                          })
                        }
                        className="text-xs uppercase bg-transparent border-b border-indigo-400 outline-none"
                      />
                    </div>
                  ) : (
                    <p className="text-slate-500 text-xs uppercase tracking-wider mt-1">
                      {profile.batch} • {profile.stats.rollNo}
                    </p>
                  )}
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-center gap-3 text-slate-600 hover:text-indigo-600 transition-colors p-2 rounded-xl hover:bg-indigo-50/50">
                    <Mail size={18} className="text-slate-400" />
                    {isEditing ? (
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => updateProfileField("email", e.target.value)}
                        className="text-sm w-full bg-transparent border-b border-indigo-400 outline-none"
                      />
                    ) : (
                      <span className="text-sm truncate">{profile.email}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 p-2 rounded-xl">
                    <Phone size={18} className="text-slate-400" />
                    {isEditing ? (
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => updateProfileField("phone", e.target.value)}
                        className="text-sm w-full bg-transparent border-b border-indigo-400 outline-none"
                      />
                    ) : (
                      <span className="text-sm">{profile.phone}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 text-slate-600 p-2 rounded-xl">
                    <MapPin size={18} className="text-slate-400" />
                    {isEditing ? (
                      <input
                        value={profile.location}
                        onChange={(e) => updateProfileField("location", e.target.value)}
                        className="text-sm w-full bg-transparent border-b border-indigo-400 outline-none"
                      />
                    ) : (
                      <span className="text-sm">{profile.location}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Academic Stats Bento Box */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <GraduationCap className="text-indigo-600" size={20} />
                <h3 className="font-bold text-slate-800">Academic Overview</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">CGPA</p>
                  {isEditing ? (
                    <input
                      value={profile.stats.cgpa}
                      onChange={(e) => updateStat("cgpa", e.target.value)}
                      className="w-full text-xl font-bold text-indigo-600 bg-transparent border-b border-indigo-400 outline-none"
                    />
                  ) : (
                    <p className="text-xl font-bold text-indigo-600">{profile.stats.cgpa}</p>
                  )}
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Backlogs</p>
                  {isEditing ? (
                    <input
                      value={profile.stats.backlogs}
                      onChange={(e) => updateStat("backlogs", e.target.value)}
                      className="w-full text-xl font-bold text-slate-800 bg-transparent border-b border-indigo-400 outline-none"
                    />
                  ) : (
                    <p className="text-xl font-bold text-slate-800">{profile.stats.backlogs}</p>
                  )}
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">10th Grade</p>
                  {isEditing ? (
                    <input
                      value={profile.stats.tenth}
                      onChange={(e) => updateStat("tenth", e.target.value)}
                      className="w-full text-lg font-bold text-slate-800 bg-transparent border-b border-indigo-400 outline-none"
                    />
                  ) : (
                    <p className="text-lg font-bold text-slate-800">{profile.stats.tenth}</p>
                  )}
                </div>
                <div className="bg-slate-50 p-4 rounded-2xl">
                  <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">12th Grade</p>
                  {isEditing ? (
                    <input
                      value={profile.stats.twelfth}
                      onChange={(e) => updateStat("twelfth", e.target.value)}
                      className="w-full text-lg font-bold text-slate-800 bg-transparent border-b border-indigo-400 outline-none"
                    />
                  ) : (
                    <p className="text-lg font-bold text-slate-800">{profile.stats.twelfth}</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Skills, Projects, Resumes */}
          <div className="col-span-12 lg:col-span-8 space-y-8">

            {/* Skills Card */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Code2 className="text-emerald-500" size={20} />
                  <h3 className="font-bold text-slate-800">Technical Stack</h3>
                </div>
                {isEditing && (
                  <div className="flex gap-2">
                    <input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add skill"
                      className="border px-3 py-1 rounded-lg text-sm"
                    />
                    <button
                      onClick={addSkill}
                      className="text-indigo-600 text-sm font-bold flex items-center gap-1"
                    >
                      <Plus size={16} /> Add
                    </button>
                  </div>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {profile.skills.map((skill, i) => (
                  <div key={i} className="group flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-100 rounded-2xl hover:border-indigo-200 hover:bg-white transition-all cursor-default">
                    <div className={`w-2 h-2 rounded-full ${skill.color}`} />
                    <span className="text-sm font-semibold text-slate-700">{skill.name}</span>
                    {isEditing && <Trash2
                      size={14}
                      className="text-slate-300 hover:text-red-500 cursor-pointer"
                      onClick={() => deleteSkill(i)}
                    />}
                  </div>
                ))}
              </div>
            </div>

            {/* Projects Grid */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Briefcase className="text-orange-500" size={20} />
                  <h3 className="font-bold text-slate-800">Featured Projects</h3>
                </div>
                {isEditing && (
                  <button
                    onClick={() => setShowProjectModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
                  >
                    <Plus size={16} />
                    Add Project
                  </button>
                )}

              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.projects.map((proj, i) => (
                  <div key={i} className="p-6 rounded-2xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:border-indigo-200 hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-bold text-slate-800 group-hover:text-indigo-600">{proj.title}</h4>
                      <ExternalLink size={16} className="text-slate-400" />
                    </div>
                    {proj.image && (
                      <img
                        src={URL.createObjectURL(proj.image)}
                        className="w-full h-32 object-cover rounded-lg mb-3"
                      />
                    )}

                    <p className="text-sm text-slate-500 mb-4 line-clamp-2">{proj.description}</p>
                    <div className="flex flex-wrap gap-2">
                      {proj.tags.map(tag => (
                        <span key={tag} className="text-[10px] font-bold px-2 py-1 bg-white border border-slate-200 text-slate-600 rounded-md">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Resume Section */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <FileText className="text-rose-500" size={20} />
                  <h3 className="font-bold text-slate-800">Documents</h3>
                </div>
                <label className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl cursor-pointer">
                  <Upload size={16} /> Upload Resume
                  <input
                    type="file"
                    accept=".pdf"
                    hidden
                    onChange={handleResumeUpload}
                  />
                  {resumeFile && (
                    <button
                      onClick={uploadResume}
                      className="ml-4 px-4 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                      Upload File
                    </button>
                  )}
                </label>
              </div>
              {profile.resumes.map((res, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-rose-500 border border-slate-100">
                      <FileText size={24} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">{res.name}</p>
                      <p className="text-xs text-slate-500">{res.date} • {res.size}</p>
                    </div>
                  </div>
                  <button className="px-4 py-2 text-indigo-600 font-bold text-sm hover:bg-indigo-50 rounded-xl transition-colors">
                    View
                  </button>
                </div>
              ))}
            </div>
            <ProjectModal
              isOpen={showProjectModal}
              onClose={() => setShowProjectModal(false)}
              onAddProject={handleAddProject}
            />
          </div>
        </div>
      </main>
    </div>
  );
};


export default StudentProfile;