import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  Briefcase, 
  DollarSign, 
  MapPin, 
  GraduationCap, 
  AlignLeft, 
  CheckCircle2, 
  Zap, 
  BookOpen, 
  Code2,
  FileText,
  ChevronDown,
  X
} from 'lucide-react';
import { postJob } from '@/redux/thunks/companyThunk';
import { fetchDepartments } from '@/redux/thunks/departmentThunk';
import { fetchSkills } from '@/redux/thunks/skillThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import Loader from '@/components/Loader';

const PostJob: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { loading: isSubmitting } = useSelector((state: RootState) => state.company);
  const { departments, loading: loadingDepts } = useSelector((state: RootState) => state.department);
  const { skills, loading: loadingSkills } = useSelector((state: RootState) => state.skill);

  const [formData, setFormData] = useState({
    title: '',
    salary: '',
    location: '',
    minCgpa: '',
    maxCgpa: '',
    description: '',
  });

  const [selectedBranches, setSelectedBranches] = useState<number[]>([]);
  const [selectedSkills, setSelectedSkills] = useState<number[]>([]);
  
  // Search and Dropdown States
  const [branchSearch, setBranchSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isSkillOpen, setIsSkillOpen] = useState(false);

  const branchRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSkills());
    
    // Click outside handler
    const handleClickOutside = (event: MouseEvent) => {
      if (branchRef.current && !branchRef.current.contains(event.target as Node)) setIsBranchOpen(false);
      if (skillRef.current && !skillRef.current.contains(event.target as Node)) setIsSkillOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [dispatch]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const toggleBranch = (branchId: number) => {
    setSelectedBranches(prev =>
      prev.includes(branchId) ? prev.filter(b => b !== branchId) : [...prev, branchId]
    );
  };

  const toggleSkill = (skillId: number) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.salary || !formData.location || !formData.minCgpa || !formData.maxCgpa || !formData.description) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedBranches.length === 0) {
      toast.error("Please select at least one eligible branch");
      return;
    }

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        salary: Number(formData.salary),
        location: formData.location,
        minCgpa: Number(formData.minCgpa),
        maxCgpa: Number(formData.maxCgpa),
        eligibleDepartmentIds: selectedBranches,
        skillIds: selectedSkills
      };

      await dispatch(postJob(payload)).unwrap();
      toast.success("Job Drive posted successfully!", {
        description: `${formData.title} for ${formData.location} is now live.`,
        duration: 5000,
      });

      setFormData({
        title: '',
        salary: '',
        location: '',
        minCgpa: '',
        maxCgpa: '',
        description: '',
      });
      setSelectedBranches([]);
      setSelectedSkills([]);
    } catch (error: any) {
      toast.error(error?.message || "Failed to post job. Please try again.");
    }
  };

  const filteredBranches = (departments || []).filter((dept: any) => 
    (dept.name || dept.deptName || '').toLowerCase().includes(branchSearch.toLowerCase())
  );

  const filteredSkills = (skills || []).filter((skill: any) => 
    (skill.name || '').toLowerCase().includes(skillSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#111319] py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto bg-white rounded-[32px] shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700">
        <header className="p-8 sm:p-10 border-b border-slate-100 bg-gradient-to-r from-white to-slate-50/50">
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Create New Job Drive</h1>
          <p className="mt-2 text-slate-500 text-lg">Configure your recruitment requirements to find the best talent.</p>
        </header>

        <form onSubmit={handleSubmit} className="p-8 sm:p-10 space-y-12">
          {/* Job Details Section */}
          <section className="space-y-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <span className="p-2 bg-blue-50 text-blue-600 rounded-xl"><Briefcase size={22} /></span>
              Basic Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Job Title</label>
                <div className="relative group">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g. Full Stack Engineer"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Annual Salary</label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. 1200000"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Work Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                  <input
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="e.g. Bangalore, India (Remote / Hybrid)"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Academic Requirements Section */}
          <section className="space-y-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <span className="p-2 bg-purple-50 text-purple-600 rounded-xl"><GraduationCap size={22} /></span>
              Eligibility Criteria
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Minimum CGPA</label>
                <div className="relative group">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                  <input
                    type="number"
                    step="0.01"
                    name="minCgpa"
                    value={formData.minCgpa}
                    onChange={handleInputChange}
                    placeholder="e.g. 7.50"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1">Maximum CGPA</label>
                <div className="relative group">
                  <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                  <input
                    type="number"
                    step="0.01"
                    name="maxCgpa"
                    value={formData.maxCgpa}
                    onChange={handleInputChange}
                    placeholder="e.g. 10.00"
                    className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-purple-500/10 focus:border-purple-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium"
                    required
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Description Section */}
          <section className="space-y-8">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <span className="p-2 bg-orange-50 text-orange-600 rounded-xl"><FileText size={22} /></span>
              Job Description
            </h2>
            <div className="space-y-2">
              <div className="relative group">
                <AlignLeft className="absolute left-4 top-4 text-slate-400 group-focus-within:text-orange-500 transition-colors" size={18} />
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={5}
                  placeholder="Describe the role, responsibilities, and key expectations from the candidate..."
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-4 focus:ring-orange-500/10 focus:border-orange-500 transition-all text-slate-800 placeholder:text-slate-400 font-medium resize-none"
                  required
                />
              </div>
            </div>
          </section>

          {/* Eligible Branches Section */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <span className="p-2 bg-emerald-50 text-emerald-600 rounded-xl"><Briefcase size={22} /></span>
              Target Branches
            </h2>
            
            <div className="relative" ref={branchRef}>
              <div 
                onClick={() => setIsBranchOpen(!isBranchOpen)}
                className={`
                  flex flex-wrap gap-2 p-3 min-h-[56px] rounded-2xl border-2 transition-all cursor-pointer bg-slate-50/30
                  ${isBranchOpen ? 'border-emerald-500 bg-white ring-4 ring-emerald-500/10' : 'border-slate-200 hover:border-emerald-300'}
                `}
              >
                {selectedBranches.length === 0 && !branchSearch && (
                  <span className="text-slate-400 font-medium ml-2 self-center">Search and select branches...</span>
                )}
                {selectedBranches.map(id => {
                  const dept = departments.find((d: any) => d.id === id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-bold animate-in zoom-in-95 duration-200">
                      {dept?.name || dept?.deptName}
                      <X size={14} className="hover:text-emerald-900 cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        toggleBranch(id);
                      }} />
                    </span>
                  );
                })}
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 font-medium min-w-[120px] ml-2"
                  value={branchSearch}
                  onChange={(e) => {
                    setBranchSearch(e.target.value);
                    setIsBranchOpen(true);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <ChevronDown className={`text-slate-400 transition-transform duration-200 mr-2 self-center ${isBranchOpen ? 'rotate-180' : ''}`} size={20} />
              </div>

              {isBranchOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                    {loadingDepts ? (
                      <Loader size="sm" text="Loading..." />
                    ) : filteredBranches.length === 0 ? (
                      <div className="p-4 text-center text-slate-400">No branches found</div>
                    ) : (
                      filteredBranches.map((dept: any) => {
                        const isSelected = selectedBranches.includes(dept.id);
                        return (
                          <div
                            key={dept.id}
                            onClick={() => toggleBranch(dept.id)}
                            className={`
                              flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors
                              ${isSelected ? 'bg-emerald-50 text-emerald-700' : 'hover:bg-slate-50 text-slate-700'}
                            `}
                          >
                            <span className="font-semibold">{dept.name || dept.deptName}</span>
                            {isSelected && <CheckCircle2 size={18} className="text-emerald-500" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Required Skills Section */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-xl font-bold text-slate-800">
              <span className="p-2 bg-rose-50 text-rose-600 rounded-xl"><Code2 size={22} /></span>
              Required Skills
            </h2>

            <div className="relative" ref={skillRef}>
              <div 
                onClick={() => setIsSkillOpen(!isSkillOpen)}
                className={`
                  flex flex-wrap gap-2 p-3 min-h-[56px] rounded-2xl border-2 transition-all cursor-pointer bg-slate-50/30
                  ${isSkillOpen ? 'border-rose-500 bg-white ring-4 ring-rose-500/10' : 'border-slate-200 hover:border-rose-300'}
                `}
              >
                {selectedSkills.length === 0 && !skillSearch && (
                  <span className="text-slate-400 font-medium ml-2 self-center">Search and select skills...</span>
                )}
                {selectedSkills.map(id => {
                  const skill = skills.find((s: any) => s.id === id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-100 text-rose-700 rounded-full text-sm font-bold animate-in zoom-in-95 duration-200">
                      {skill?.name}
                      <X size={14} className="hover:text-rose-900 cursor-pointer" onClick={(e) => {
                        e.stopPropagation();
                        toggleSkill(id);
                      }} />
                    </span>
                  );
                })}
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-slate-800 font-medium min-w-[120px] ml-2"
                  value={skillSearch}
                  onChange={(e) => {
                    setSkillSearch(e.target.value);
                    setIsSkillOpen(true);
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
                <ChevronDown className={`text-slate-400 transition-transform duration-200 mr-2 self-center ${isSkillOpen ? 'rotate-180' : ''}`} size={20} />
              </div>

              {isSkillOpen && (
                <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto p-2 space-y-1">
                    {loadingSkills ? (
                      <Loader size="sm" text="Loading..." />
                    ) : filteredSkills.length === 0 ? (
                      <div className="p-4 text-center text-slate-400">No skills found</div>
                    ) : (
                      filteredSkills.map((skill: any) => {
                        const isSelected = selectedSkills.includes(skill.id);
                        return (
                          <div
                            key={skill.id}
                            onClick={() => toggleSkill(skill.id)}
                            className={`
                              flex items-center justify-between px-4 py-3 rounded-xl cursor-pointer transition-colors
                              ${isSelected ? 'bg-rose-50 text-rose-700' : 'hover:bg-slate-50 text-slate-700'}
                            `}
                          >
                            <span className="font-semibold">{skill.name}</span>
                            {isSelected && <CheckCircle2 size={18} className="text-rose-500" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          <footer className="pt-8 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`
                group relative flex items-center gap-3 px-10 py-4 rounded-2xl font-bold text-white transition-all duration-300
                ${isSubmitting 
                  ? 'bg-slate-400 cursor-not-allowed' 
                  : 'bg-gradient-to-br from-blue-600 to-indigo-700 hover:shadow-xl hover:shadow-blue-500/30 hover:-translate-y-1 active:translate-y-0'}
              `}
            >
              {isSubmitting ? (
                <>
                  <Loader size="sm" />
                  Processing...
                </>
              ) : (
                <>
                  Publish Job Drive
                  <Zap size={20} className="group-hover:animate-pulse" />
                </>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default PostJob;




