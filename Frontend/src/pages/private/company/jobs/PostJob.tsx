import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  Briefcase, 
  MapPin, 
  GraduationCap, 
  AlignLeft, 
  CheckCircle2, 
  Zap, 
  BookOpen, 
  Code2,
  FileText,
  ChevronDown,
  IndianRupee,
  X,
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

  const [branchSearch, setBranchSearch] = useState('');
  const [skillSearch, setSkillSearch] = useState('');
  const [isBranchOpen, setIsBranchOpen] = useState(false);
  const [isSkillOpen, setIsSkillOpen] = useState(false);

  const branchRef = useRef<HTMLDivElement>(null);
  const skillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSkills());

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

      setFormData({ title: '', salary: '', location: '', minCgpa: '', maxCgpa: '', description: '' });
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
    <div className="min-h-screen p-4 md:p-8 animate-in fade-in duration-700">
      <div className="saas-card max-w-5xl mx-auto overflow-hidden p-0">
        <header className="p-8 border-b border-border/50 bg-muted/20">
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">Create New Job Drive</h1>
          <p className="mt-2 text-muted-foreground text-sm font-medium">Configure your recruitment requirements to find the best talent.</p>
        </header>

        <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-10">
          {/* Basic Information */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-lg font-bold text-foreground">
              <span className="p-2 bg-primary/10 text-primary rounded-xl"><Briefcase size={20} /></span>
              Basic Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="saas-label">Job Title</label>
                <div className="relative group">
                  <Zap className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                  <input type="text" name="title" value={formData.title} onChange={handleInputChange}
                    placeholder="e.g. Full Stack Engineer" className="saas-input pl-11" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="saas-label">Annual Salary (INR)</label>
                <div className="relative group">
                  <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                  <input
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    placeholder="e.g. 1200000"
                    className="saas-input pl-11"
                    required
                  />
                </div>
              </div>

              <div className="space-y-1 md:col-span-2">
                <label className="saas-label">Work Location</label>
                <div className="relative group">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
                  <input type="text" name="location" value={formData.location} onChange={handleInputChange}
                    placeholder="e.g. Bangalore, India (Remote / Hybrid)" className="saas-input pl-11" required />
                </div>
              </div>
            </div>
          </section>

          {/* Eligibility */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-lg font-bold text-foreground">
              <span className="p-2 bg-violet-500/10 text-violet-500 rounded-xl"><GraduationCap size={20} /></span>
              Eligibility Criteria
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <label className="saas-label">Minimum CGPA</label>
                <div className="relative group">
                  <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-violet-500 transition-colors" size={16} />
                  <input type="number" step="0.01" name="minCgpa" value={formData.minCgpa} onChange={handleInputChange}
                    placeholder="e.g. 7.50" className="saas-input pl-11 focus:ring-violet-500/20 focus:border-violet-500" required />
                </div>
              </div>

              <div className="space-y-1">
                <label className="saas-label">Maximum CGPA</label>
                <div className="relative group">
                  <CheckCircle2 className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-violet-500 transition-colors" size={16} />
                  <input type="number" step="0.01" name="maxCgpa" value={formData.maxCgpa} onChange={handleInputChange}
                    placeholder="e.g. 10.00" className="saas-input pl-11 focus:ring-violet-500/20 focus:border-violet-500" required />
                </div>
              </div>
            </div>
          </section>

          {/* Description */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-lg font-bold text-foreground">
              <span className="p-2 bg-amber-500/10 text-amber-500 rounded-xl"><FileText size={20} /></span>
              Job Description
            </h2>
            <div className="space-y-1">
              <div className="relative group">
                <AlignLeft className="absolute left-4 top-4 text-muted-foreground group-focus-within:text-amber-500 transition-colors" size={16} />
                <textarea name="description" value={formData.description} onChange={handleInputChange} rows={5}
                  placeholder="Describe the role, responsibilities, and key expectations from the candidate..."
                  className="saas-input pl-11 py-3 focus:ring-amber-500/20 focus:border-amber-500 resize-none"
                  required />
              </div>
            </div>
          </section>

          {/* Target Branches */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-lg font-bold text-foreground">
              <span className="p-2 bg-emerald-500/10 text-emerald-500 rounded-xl"><Briefcase size={20} /></span>
              Target Branches
            </h2>

            <div className="relative" ref={branchRef}>
              <div
                onClick={() => setIsBranchOpen(!isBranchOpen)}
                className={`flex flex-wrap gap-2 p-2 min-h-[44px] rounded-xl border transition-all cursor-pointer bg-background ${isBranchOpen ? 'border-emerald-500 ring-2 ring-emerald-500/15' : 'border-border hover:border-emerald-500/40'}`}
              >
                {selectedBranches.length === 0 && !branchSearch && (
                  <span className="text-muted-foreground text-sm font-medium ml-2 self-center">Search and select branches...</span>
                )}
                {selectedBranches.map(id => {
                  const dept = departments.find((d: any) => d.id === id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-lg text-xs font-bold animate-in zoom-in-95 duration-200">
                      {dept?.name || dept?.deptName}
                      <X size={12} className="hover:text-emerald-800 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleBranch(id); }} />
                    </span>
                  );
                })}
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-foreground font-medium text-sm min-w-[120px] ml-2 placeholder:text-muted-foreground"
                  value={branchSearch}
                  onChange={(e) => { setBranchSearch(e.target.value); setIsBranchOpen(true); }}
                  onClick={(e) => e.stopPropagation()}
                />
                <ChevronDown className={`text-muted-foreground transition-transform duration-200 mr-2 self-center ${isBranchOpen ? 'rotate-180' : ''}`} size={16} />
              </div>

              {isBranchOpen && (
                <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto p-1 space-y-1">
                    {loadingDepts ? (
                      <div className="p-4 text-center"><Loader size="sm" /></div>
                    ) : filteredBranches.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground text-sm">No branches found</div>
                    ) : (
                      filteredBranches.map((dept: any) => {
                        const isSelected = selectedBranches.includes(dept.id);
                        return (
                          <div
                            key={dept.id}
                            onClick={() => toggleBranch(dept.id)}
                            className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm ${isSelected ? 'bg-emerald-500/10 text-emerald-600 font-bold' : 'hover:bg-muted/50 text-foreground font-medium'}`}
                          >
                            <span>{dept.name || dept.deptName}</span>
                            {isSelected && <CheckCircle2 size={16} className="text-emerald-500" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Required Skills */}
          <section className="space-y-6">
            <h2 className="flex items-center gap-3 text-lg font-bold text-foreground">
              <span className="p-2 bg-rose-500/10 text-rose-500 rounded-xl"><Code2 size={20} /></span>
              Required Skills
            </h2>

            <div className="relative" ref={skillRef}>
              <div
                onClick={() => setIsSkillOpen(!isSkillOpen)}
                className={`flex flex-wrap gap-2 p-2 min-h-[44px] rounded-xl border transition-all cursor-pointer bg-background ${isSkillOpen ? 'border-rose-500 ring-2 ring-rose-500/15' : 'border-border hover:border-rose-500/40'}`}
              >
                {selectedSkills.length === 0 && !skillSearch && (
                  <span className="text-muted-foreground text-sm font-medium ml-2 self-center">Search and select skills...</span>
                )}
                {selectedSkills.map(id => {
                  const skill = skills.find((s: any) => s.id === id);
                  return (
                    <span key={id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-lg text-xs font-bold animate-in zoom-in-95 duration-200">
                      {skill?.name}
                      <X size={12} className="hover:text-rose-800 cursor-pointer" onClick={(e) => { e.stopPropagation(); toggleSkill(id); }} />
                    </span>
                  );
                })}
                <input
                  type="text"
                  className="flex-1 bg-transparent border-none outline-none text-foreground font-medium text-sm min-w-[120px] ml-2 placeholder:text-muted-foreground"
                  value={skillSearch}
                  onChange={(e) => { setSkillSearch(e.target.value); setIsSkillOpen(true); }}
                  onClick={(e) => e.stopPropagation()}
                />
                <ChevronDown className={`text-muted-foreground transition-transform duration-200 mr-2 self-center ${isSkillOpen ? 'rotate-180' : ''}`} size={16} />
              </div>

              {isSkillOpen && (
                <div className="absolute z-50 w-full mt-2 bg-card border border-border rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-top-2 duration-200">
                  <div className="max-h-60 overflow-y-auto p-1 space-y-1">
                    {loadingSkills ? (
                      <div className="p-4 text-center"><Loader size="sm" /></div>
                    ) : filteredSkills.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground text-sm">No skills found</div>
                    ) : (
                      filteredSkills.map((skill: any) => {
                        const isSelected = selectedSkills.includes(skill.id);
                        return (
                          <div
                            key={skill.id}
                            onClick={() => toggleSkill(skill.id)}
                            className={`flex items-center justify-between px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm ${isSelected ? 'bg-rose-500/10 text-rose-600 font-bold' : 'hover:bg-muted/50 text-foreground font-medium'}`}
                          >
                            <span>{skill.name}</span>
                            {isSelected && <CheckCircle2 size={16} className="text-rose-500" />}
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          <footer className="pt-6 border-t border-border/50 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`group relative flex items-center gap-3 px-8 py-3.5 rounded-xl font-bold text-white transition-all duration-300 ${isSubmitting
                  ? 'bg-muted cursor-not-allowed text-muted-foreground'
                  : 'bg-primary hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0'
                }`}
            >
              {isSubmitting ? (
                <><Loader size="sm" /> Processing...</>
              ) : (
                <>Publish Job Drive <Zap size={18} className="group-hover:animate-pulse" /></>
              )}
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export default PostJob;
