import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';
import {
  Briefcase, 
  MapPin, 
  AlignLeft, 
  CheckCircle2, 
  Zap, 
  BookOpen, 
  FileText,
  IndianRupee,
  X,
  Target,
  Rocket,
  Sparkles,
  Info,
  ChevronRight,
  ChevronLeft,
  AlertCircle
} from 'lucide-react';
import { postJob } from '@/redux/thunks/companyThunk';
import { fetchDepartments } from '@/redux/thunks/departmentThunk';
import { fetchSkills } from '@/redux/thunks/skillThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import Loader from '@/components/Loader';

import { useSearchParams, useNavigate } from 'react-router-dom';
import { updateCompanyJob } from '@/redux/thunks/companyThunk';

const PostJob: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editJobId = searchParams.get('jobId');
  
  const { loading: isSubmitting, jobs } = useSelector((state: RootState) => state.company);
  const { departments, loading: loadingDepts } = useSelector((state: RootState) => state.department);
  const { skills, loading: loadingSkills } = useSelector((state: RootState) => state.skill);

  const [currentStep, setCurrentStep] = useState(1);
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

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchDepartments());
    dispatch(fetchSkills());

    // If editing, find the job in state or fetch it
    if (editJobId) {
      const jobToEdit = jobs?.find((j: any) => j.id === parseInt(editJobId));
      if (jobToEdit) {
        setFormData({
          title: jobToEdit.title || '',
          salary: jobToEdit.salary?.toString() || '',
          location: jobToEdit.location || '',
          minCgpa: jobToEdit.minCgpa?.toString() || '',
          maxCgpa: jobToEdit.maxCgpa?.toString() || '',
          description: jobToEdit.description || '',
        });
        setSelectedBranches(jobToEdit.eligibleDepartments?.map((d: any) => d.id) || jobToEdit.eligibleDepartmentIds || []);
        setSelectedSkills(jobToEdit.skills?.map((s: any) => s.id) || jobToEdit.skillIds || []);
      }
    }

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
    if (formErrors[name]) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const toggleBranch = (branchId: number) => {
    setSelectedBranches(prev =>
      prev.includes(branchId) ? prev.filter(b => b !== branchId) : [...prev, branchId]
    );
    if (formErrors.branches) {
      setFormErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.branches;
        return newErrors;
      });
    }
  };

  const toggleSkill = (skillId: number) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(s => s !== skillId) : [...prev, skillId]
    );
  };

  const validateStep = (step: number) => {
    const errors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.title) errors.title = "Job title is required";
      if (!formData.salary) errors.salary = "Salary is required";
      if (!formData.location) errors.location = "Location is required";
    } else if (step === 2) {
      if (!formData.description) {
        errors.description = "Description is required";
      } else if (formData.description.length < 10) {
          errors.description = `Description must be at least 10 characters (currently ${formData.description.length}).`;
      }
    } else if (step === 3) {
      if (!formData.minCgpa) errors.minCgpa = "Minimum CGPA is required";
      if (formData.minCgpa && Number(formData.minCgpa) < 0) {
        errors.minCgpa = "Minimum CGPA cannot be negative";
      } else if (formData.minCgpa && Number(formData.minCgpa) > 10) {
        errors.minCgpa = "Minimum CGPA must be 10 or less";
      }
      if (!formData.maxCgpa) {
        errors.maxCgpa = "Maximum CGPA is required";
      } else if (Number(formData.maxCgpa) < 0) {
        errors.maxCgpa = "Maximum CGPA cannot be negative";
      } else if (Number(formData.maxCgpa) > 10) {
        errors.maxCgpa = "Too big: expected number to be <=10";
      }
      if (
        formData.minCgpa &&
        formData.maxCgpa &&
        Number(formData.minCgpa) > Number(formData.maxCgpa)
      ) {
        errors.maxCgpa = "Maximum CGPA must be greater than or equal to minimum CGPA";
      }
      if (selectedBranches.length === 0) errors.branches = "Select at least one branch";
    }

    setFormErrors(errors);
    if (Object.keys(errors).length > 0) {
      toast.error("Please fix the validation errors", { icon: <AlertCircle size={16} /> });
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) setCurrentStep(prev => prev + 1);
  };

  const prevStep = () => setCurrentStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(3)) return;

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        salary: Number(formData.salary),
        location: formData.location,
        minCgpa: Math.min(10, Math.max(0, Number(formData.minCgpa))),
        maxCgpa: Math.min(10, Math.max(0, Number(formData.maxCgpa))),
        eligibleDepartmentIds: selectedBranches,
        skillIds: selectedSkills
      };

      if (editJobId) {
        await dispatch(updateCompanyJob({ id: parseInt(editJobId), data: payload })).unwrap();
        toast.success("Job Drive Updated!", {
          description: `${formData.title} has been refined.`,
          icon: <Rocket className="text-emerald-500" size={20} />,
        });
        navigate('/company/jobs');
      } else {
        await dispatch(postJob(payload)).unwrap();
        toast.success("Job Drive published!", {
          description: `${formData.title} is now live.`,
          icon: <Rocket className="text-emerald-500" size={20} />,
        });
        setFormData({ title: '', salary: '', location: '', minCgpa: '', maxCgpa: '', description: '' });
        setSelectedBranches([]);
        setSelectedSkills([]);
        setFormErrors({});
        setCurrentStep(1);
      }
    } catch (error: any) {
      console.error("Job Posting Error:", error);
      
      // Handle structured backend validation errors (e.g. Zod errors from API)
      if (error?.data?.errors && Array.isArray(error.data.errors)) {
        const backendErrors: Record<string, string> = {};
        error.data.errors.forEach((err: any) => {
          // Map backend path to frontend field name
          const path = err.path === 'eligibleDepartmentIds' ? 'branches' : err.path;
          backendErrors[path] = err.message;
        });
        setFormErrors(backendErrors);
        
        // Logical step jumping based on where the error is
        if (backendErrors.title || backendErrors.salary || backendErrors.location) {
          setCurrentStep(1);
        } else if (backendErrors.description) {
          setCurrentStep(2);
        } else if (backendErrors.minCgpa || backendErrors.maxCgpa || backendErrors.branches) {
          setCurrentStep(3);
        }
        
        toast.error("Form Validation Failed", {
          description: `We found some issues in Step ${currentStep}. Please review the highlighted fields.`,
          icon: <AlertCircle className="text-destructive" size={20} />
        });
      } else {
        // Fallback for general error messages
        const errorMsg = error?.data?.message || error?.message || "An unexpected error occurred while publishing the job drive.";
        toast.error("Submission Failed", { 
          description: errorMsg,
          icon: <X className="text-destructive" size={20} />
        });
      }
    }
  };

  const renderError = (field: string) => {
    if (!formErrors[field]) return null;
    return (
      <p className="text-[10px] font-black text-destructive mt-2 flex items-center gap-1.5 animate-in fade-in slide-in-from-top-1 duration-300 uppercase tracking-wider">
        <AlertCircle size={10} strokeWidth={3} /> {formErrors[field]}
      </p>
    );
  };

  const filteredBranches = (departments || []).filter((dept: any) =>
    (dept.name || dept.deptName || '').toLowerCase().includes(branchSearch.toLowerCase())
  );

  const filteredSkills = (skills || []).filter((skill: any) =>
    (skill.name || '').toLowerCase().includes(skillSearch.toLowerCase())
  );

  const steps = [
    { id: 1, label: 'Role Details', icon: Briefcase },
    { id: 2, label: 'Job Description', icon: FileText },
    { id: 3, label: 'Eligibility & Targeting', icon: Target },
    { id: 4, label: 'Final Review', icon: CheckCircle2 }
  ];

  return (
    <div className="min-h-screen pb-20 animate-in fade-in duration-700">
      {/* Hero Header */}
      <div className="p-4 md:p-8">
        <div className="company-hero-banner relative overflow-hidden group">
          <div className="hero-mesh">
            <div className="bubble-primary" />
            <div className="bubble-secondary" />
          </div>
          <div className="hero-texture" />
          
          <div className="relative z-10 space-y-4">
            <div className="hero-badge">
              <Sparkles size={12} className="animate-pulse" />
              Recruitment Wizard
            </div>
            <h1 className="hero-title">
              {editJobId ? 'Refine' : 'Publish'} a <br />
              <span>Job Drive</span>
            </h1>
            <p className="hero-description max-w-xl">
              {editJobId 
                ? "Update the parameters, eligibility, and description of your existing recruitment drive."
                : "Follow our professional recruitment wizard to configure your job posting. Break down requirements into logical steps for maximum precision."
              }
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 md:px-8 mt-2 md:-mt-6 relative z-20">
        
        {/* Progress Stepper */}
        <div className="saas-card mb-8 p-4 flex items-center justify-between overflow-x-auto no-scrollbar gap-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div 
                className={`flex items-center gap-3 shrink-0 transition-all duration-300 ${currentStep >= step.id ? 'text-primary' : 'text-muted-foreground/50'}`}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500
                  ${currentStep === step.id ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-110' : 
                    currentStep > step.id ? 'bg-primary/10 text-primary' : 'bg-muted/50'}
                `}>
                  {currentStep > step.id ? <CheckCircle2 size={18} /> : <step.icon size={18} />}
                </div>
                <div className="flex flex-col">
                  <span className="text-[9px] font-black uppercase tracking-widest opacity-50">Step 0{step.id}</span>
                  <span className="text-xs font-bold whitespace-nowrap">{step.label}</span>
                </div>
              </div>
              {index < steps.length - 1 && (
                <div className={`h-px w-full min-w-[20px] transition-colors duration-500 ${currentStep > step.id ? 'bg-primary/20' : 'bg-muted-foreground/10'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Form Sections */}
        <form onSubmit={handleSubmit} className="space-y-8">
          
          {currentStep === 1 && (
            <div className="saas-card p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">Basic Information</h2>
                <p className="text-sm text-muted-foreground font-medium">Start with the core details of the position.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="saas-label">Job Title</label>
                  <div className="relative group">
                    <Zap className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formErrors.title ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} size={16} />
                    <input 
                      type="text" 
                      name="title" 
                      value={formData.title} 
                      onChange={handleInputChange}
                      placeholder="e.g. Senior Software Engineer" 
                      className={`saas-input saas-input-with-icon ${formErrors.title ? 'border-destructive ring-4 ring-destructive/10' : ''}`} 
                      required 
                    />
                  </div>
                  {renderError('title')}
                </div>

                <div className="space-y-2">
                  <label className="saas-label">Annual Salary (INR)</label>
                  <div className="relative group">
                    <IndianRupee className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formErrors.salary ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} size={16} />
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="e.g. 1500000"
                      className={`saas-input saas-input-with-icon ${formErrors.salary ? 'border-destructive ring-4 ring-destructive/10' : ''}`}
                      required
                    />
                  </div>
                  {renderError('salary')}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="saas-label">Work Location</label>
                  <div className="relative group">
                    <MapPin className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formErrors.location ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} size={16} />
                    <input 
                      type="text" 
                      name="location" 
                      value={formData.location} 
                      onChange={handleInputChange}
                      placeholder="e.g. Bangalore, India (Hybrid)" 
                      className={`saas-input saas-input-with-icon ${formErrors.location ? 'border-destructive ring-4 ring-destructive/10' : ''}`} 
                      required 
                    />
                  </div>
                  {renderError('location')}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="saas-card p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">Role Description</h2>
                <p className="text-sm text-muted-foreground font-medium">Explain the responsibilities and company culture.</p>
              </div>

              <div className="relative group">
                <AlignLeft className={`absolute left-4 top-4 transition-colors ${formErrors.description ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} size={16} />
                <textarea 
                  name="description" 
                  value={formData.description} 
                  onChange={handleInputChange} 
                  rows={10}
                  placeholder="Provide a comprehensive description of the role, daily tasks, and what makes your company a great place to work..."
                  className={`saas-input saas-input-with-icon py-4 resize-none min-h-[250px] ${formErrors.description ? 'border-destructive ring-4 ring-destructive/10' : ''}`}
                  required 
                />
              </div>
              {renderError('description')}
            </div>
          )}

          {currentStep === 3 && (
            <div className="saas-card p-8 space-y-10 animate-in slide-in-from-right-4 duration-500 overflow-visible relative">
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">Eligibility & Targeting</h2>
                <p className="text-sm text-muted-foreground font-medium">Define who can apply and which skills are required.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="saas-label">Min CGPA</label>
                  <div className="relative group">
                    <BookOpen className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formErrors.minCgpa ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} size={16} />
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      max="10"
                      name="minCgpa" 
                      value={formData.minCgpa} 
                      onChange={handleInputChange}
                      placeholder="0.00" 
                      className={`saas-input saas-input-with-icon ${formErrors.minCgpa ? 'border-destructive ring-4 ring-destructive/10' : ''}`} 
                      required 
                    />
                  </div>
                  {renderError('minCgpa')}
                </div>
                <div className="space-y-2">
                  <label className="saas-label">Max CGPA</label>
                  <div className="relative group">
                    <CheckCircle2 className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${formErrors.maxCgpa ? 'text-destructive' : 'text-muted-foreground group-focus-within:text-primary'}`} size={16} />
                    <input 
                      type="number" 
                      step="0.01" 
                      min="0"
                      max="10"
                      name="maxCgpa" 
                      value={formData.maxCgpa} 
                      onChange={handleInputChange}
                      placeholder="10.00" 
                      className={`saas-input saas-input-with-icon ${formErrors.maxCgpa ? 'border-destructive ring-4 ring-destructive/10' : ''}`} 
                      required 
                    />
                  </div>
                  {renderError('maxCgpa')}
                </div>
              </div>

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="saas-label">Target Branches</label>
                  <div className="relative" ref={branchRef}>
                    <div
                      onClick={() => setIsBranchOpen(!isBranchOpen)}
                      className={`flex flex-wrap gap-2 p-2.5 min-h-[48px] rounded-xl border transition-all cursor-pointer bg-background ${isBranchOpen ? 'border-primary ring-4 ring-primary/10' : formErrors.branches ? 'border-destructive ring-4 ring-destructive/10' : 'border-border hover:border-primary/40'}`}
                    >
                      {selectedBranches.length === 0 && !branchSearch && (
                        <span className="text-muted-foreground text-xs font-medium ml-2 self-center">Select eligible departments...</span>
                      )}
                      {selectedBranches.map(id => {
                        const dept = departments.find((d: any) => d.id === id);
                        return (
                          <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary text-white rounded-lg text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95 duration-200">
                            {dept?.name || dept?.deptName}
                            <X size={12} className="hover:bg-black/20 rounded-full cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); toggleBranch(id); }} />
                          </span>
                        );
                      })}
                      <input
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-foreground font-medium text-xs min-w-[80px] ml-2 placeholder:text-muted-foreground"
                        value={branchSearch}
                        onChange={(e) => { setBranchSearch(e.target.value); setIsBranchOpen(true); }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    {renderError('branches')}

                    {isBranchOpen && (
                      <div 
                        className="absolute z-[100] w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <div className="max-h-[350px] overflow-y-auto p-2 space-y-1 custom-scrollbar overscroll-contain">
                          {loadingDepts ? (
                            <div className="p-12 text-center"><Loader size="sm" /></div>
                          ) : filteredBranches.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest">No results found</div>
                          ) : (
                            filteredBranches.map((dept: any) => (
                              <div
                                key={dept.id}
                                onClick={() => toggleBranch(dept.id)}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all text-xs ${selectedBranches.includes(dept.id) ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'hover:bg-muted text-foreground font-semibold'}`}
                              >
                                <span>{dept.name || dept.deptName}</span>
                                {selectedBranches.includes(dept.id) && <CheckCircle2 size={14} className="text-white" />}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="saas-label">Required Skills</label>
                  <div className="relative" ref={skillRef}>
                    <div
                      onClick={() => setIsSkillOpen(!isSkillOpen)}
                      className={`flex flex-wrap gap-2 p-2.5 min-h-[48px] rounded-xl border transition-all cursor-pointer bg-background ${isSkillOpen ? 'border-primary ring-4 ring-primary/10' : 'border-border hover:border-primary/40'}`}
                    >
                      {selectedSkills.length === 0 && !skillSearch && (
                        <span className="text-muted-foreground text-xs font-medium ml-2 self-center">Select preferred skills...</span>
                      )}
                      {selectedSkills.map(id => {
                        const skill = skills.find((s: any) => s.id === id);
                        return (
                          <span key={id} className="inline-flex items-center gap-1 px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-lg text-[10px] font-black uppercase tracking-wider animate-in zoom-in-95 duration-200">
                            {skill?.name}
                            <X size={12} className="hover:bg-primary/20 rounded-full cursor-pointer transition-colors" onClick={(e) => { e.stopPropagation(); toggleSkill(id); }} />
                          </span>
                        );
                      })}
                      <input
                        type="text"
                        className="flex-1 bg-transparent border-none outline-none text-foreground font-medium text-xs min-w-[80px] ml-2 placeholder:text-muted-foreground"
                        value={skillSearch}
                        onChange={(e) => { setSkillSearch(e.target.value); setIsSkillOpen(true); }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>

                    {isSkillOpen && (
                      <div 
                        className="absolute z-[100] w-full mt-2 bg-card border border-border rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-top-2 duration-300"
                        onMouseDown={(e) => e.stopPropagation()}
                      >
                        <div className="max-h-[350px] overflow-y-auto p-2 space-y-1 custom-scrollbar overscroll-contain">
                          {loadingSkills ? (
                            <div className="p-12 text-center"><Loader size="sm" /></div>
                          ) : filteredSkills.length === 0 ? (
                            <div className="p-12 text-center text-muted-foreground text-xs font-bold uppercase tracking-widest">No results found</div>
                          ) : (
                            filteredSkills.map((skill: any) => (
                              <div
                                key={skill.id}
                                onClick={() => toggleSkill(skill.id)}
                                className={`flex items-center justify-between px-4 py-3.5 rounded-xl cursor-pointer transition-all text-xs ${selectedSkills.includes(skill.id) ? 'bg-primary text-white font-bold shadow-lg shadow-primary/20' : 'hover:bg-muted text-foreground font-semibold'}`}
                              >
                                <span>{skill.name}</span>
                                {selectedSkills.includes(skill.id) && <CheckCircle2 size={14} className="text-white" />}
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="saas-card p-8 space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="space-y-2">
                <h2 className="text-xl font-extrabold text-foreground tracking-tight">Review & Publish</h2>
                <p className="text-sm text-muted-foreground font-medium">Verify the drive details before making it public.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { label: 'Title', value: formData.title },
                  { label: 'Salary', value: `₹ ${formData.salary} LPA` },
                  { label: 'Location', value: formData.location },
                  { label: 'Eligibility', value: `${formData.minCgpa} - ${formData.maxCgpa} CGPA` },
                  { label: 'Branches', value: `${selectedBranches.length} Selected` },
                  { label: 'Skills', value: `${selectedSkills.length} Required` }
                ].map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-muted/30 border border-border/50">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1">{item.label}</p>
                    <p className="text-sm font-bold text-foreground">{item.value}</p>
                  </div>
                ))}
              </div>

              <div className="p-6 bg-primary/5 border border-primary/10 rounded-3xl flex gap-4">
                <Info size={24} className="text-primary shrink-0" />
                <p className="text-xs text-primary/70 font-semibold leading-relaxed">
                  Upon publishing, this job drive will be immediately visible to all students meeting the 
                  CGPA and branch criteria. Please ensure all information is accurate.
                </p>
              </div>
            </div>
          )}

          {/* Navigation Controls */}
          <div className="flex items-center justify-between gap-4 pt-4">
            <button
              type="button"
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className={`flex items-center gap-2 px-6 py-3.5 rounded-2xl font-bold text-xs transition-all ${
                currentStep === 1 ? 'opacity-0 pointer-events-none' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
              }`}
            >
              <ChevronLeft size={16} /> Back
            </button>

            {currentStep < 4 ? (
              <button
                type="button"
                onClick={nextStep}
                className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-xl hover:shadow-primary/20 hover:-translate-y-0.5 transition-all"
              >
                Continue <ChevronRight size={16} />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="group relative flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:shadow-2xl hover:shadow-primary/30 hover:-translate-y-1 active:translate-y-0 transition-all overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_infinite] transition-transform" />
                {isSubmitting ? (
                  <><Loader size="sm" /> {editJobId ? 'Updating...' : 'Publishing...'}</>
                ) : (
                  <>{editJobId ? 'Update Drive' : 'Publish Drive'} <Rocket size={16} /></>
                )}
              </button>
            )}
          </div>

        </form>
      </div>
    </div>
  );
};

export default PostJob;
