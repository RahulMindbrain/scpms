import React, { useEffect, useState } from 'react';
import { Eye, Edit2, Trash2, Search, Filter, Plus, Briefcase, MapPin, IndianRupee, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanyJobs } from '@/redux/thunks/companyThunk';
import type { RootState } from '@/redux/reducers/rootReducer';
import type { AppDispatch } from '@/redux/store/store';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Link } from 'react-router-dom';
import Loader from '@/components/Loader';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { toast } from 'sonner';
import { fetchDepartments } from '@/redux/thunks/departmentThunk';
import { fetchSkills } from '@/redux/thunks/skillThunk';
import { deleteCompanyJob, updateCompanyJob } from '@/redux/thunks/companyThunk';
import { X, Check, AlertTriangle, Zap, Info, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ManageJobs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, meta } = useSelector((state: RootState) => state.company);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isViewOpen, setIsViewOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State for Edit
  const [editFormData, setEditFormData] = useState<any>({
    title: '',
    salary: '',
    location: '',
    minCgpa: '',
    maxCgpa: '',
    description: '',
    eligibleDepartmentIds: [],
    skillIds: []
  });

  const { departments } = useSelector((state: RootState) => state.department);
  const { skills } = useSelector((state: RootState) => state.skill);

  useEffect(() => {
    dispatch(fetchCompanyJobs({ page }));
    dispatch(fetchDepartments());
    dispatch(fetchSkills());
  }, [dispatch, page]);

  const handleView = (job: any) => {
    setSelectedJob(job);
    setIsViewOpen(true);
  };

  const handleDeleteClick = (job: any) => {
    setSelectedJob(job);
    setIsDeleteOpen(true);
  };

  const handleEditClick = (job: any) => {
    setSelectedJob(job);
    setEditFormData({
      title: job.title,
      salary: job.salary,
      location: job.location,
      minCgpa: job.minCgpa,
      maxCgpa: job.maxCgpa,
      description: job.description || '',
      eligibleDepartmentIds: job.eligibleDepartments?.map((d: any) => d.id) || [],
      skillIds: job.skills?.map((s: any) => s.id) || []
    });
    setIsEditOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedJob) return;
    setIsSubmitting(true);
    try {
      await dispatch(deleteCompanyJob(selectedJob.id)).unwrap();
      toast.success("Job drive deleted successfully");
      setIsDeleteOpen(false);
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : error?.message || "Failed to delete job drive";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateJob = async () => {
    if (!selectedJob) return;
    setIsSubmitting(true);
    try {
      // Calculate diffs for departments and skills
      const currentDeptIds = selectedJob.eligibleDepartments?.map((d: any) => d.id) || [];
      const newDeptIds = editFormData.eligibleDepartmentIds;
      const addEligibleDepartmentIds = newDeptIds.filter((id: number) => !currentDeptIds.includes(id));
      const removeEligibleDepartmentIds = currentDeptIds.filter((id: number) => !newDeptIds.includes(id));

      const currentSkillIds = selectedJob.skills?.map((s: any) => s.id) || [];
      const newSkillIds = editFormData.skillIds;
      const addSkillIds = newSkillIds.filter((id: number) => !currentSkillIds.includes(id));
      const removeSkillIds = currentSkillIds.filter((id: number) => !newSkillIds.includes(id));

      const payload = {
        salary: Number(editFormData.salary),
        location: editFormData.location,
        minCgpa: Number(editFormData.minCgpa),
        maxCgpa: Number(editFormData.maxCgpa),
        addEligibleDepartmentIds,
        removeEligibleDepartmentIds,
        addSkillIds,
        removeSkillIds,
        // Also include other fields if needed, but the user specifically asked for these in the Postman request
        title: editFormData.title,
        description: editFormData.description
      };

      await dispatch(updateCompanyJob({ id: selectedJob.id, data: payload })).unwrap();
      toast.success("Job drive updated successfully");
      setIsEditOpen(false);
    } catch (error: any) {
      const errorMessage = typeof error === 'string' ? error : error?.message || "Failed to update job drive";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleEditDept = (id: number) => {
    setEditFormData((prev: any) => ({
      ...prev,
      eligibleDepartmentIds: prev.eligibleDepartmentIds.includes(id)
        ? prev.eligibleDepartmentIds.filter((d: number) => d !== id)
        : [...prev.eligibleDepartmentIds, id]
    }));
  };

  const toggleEditSkill = (id: number) => {
    setEditFormData((prev: any) => ({
      ...prev,
      skillIds: prev.skillIds.includes(id)
        ? prev.skillIds.filter((s: number) => s !== id)
        : [...prev.skillIds, id]
    }));
  };

  const formatSalary = (salary: number) => {
    if (salary >= 100000) {
      return `${(salary / 100000).toFixed(2)} LPA`;
    }
    return `${salary} INR`;
  };

  const filteredJobs = jobs?.filter((job: any) => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-4">
              <div className="hero-badge">
                <Sparkles size={12} className="animate-pulse" />
                Management Console
              </div>
              <h1 className="hero-title">
                Manage Your <br />
                <span>Job Drives</span>
              </h1>
              <p className="hero-description">
                Monitor active recruitment cycles, review candidate progress, and manage your 
                organization's job postings in one place.
              </p>
            </div>
            
            <Link 
              to="/company/post-job" 
              className="group relative flex items-center gap-3 px-8 py-4 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-xs transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:-translate-y-1 active:translate-y-0"
            >
              Post New Drive <Plus size={16} className="group-hover:rotate-90 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Search & Stats Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="relative flex-1 max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by title or location..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full saas-input-with-icon pr-4 py-3 bg-card border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-sm shadow-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="px-6 py-2.5 bg-card border border-border rounded-2xl shadow-sm flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                {jobs?.length || 0} Total Postings
              </span>
            </div>
            <button className="p-3 bg-card border border-border rounded-2xl hover:bg-muted transition-colors shadow-sm">
              <Filter size={18} className="text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Jobs Grid/List */}
        <div className="saas-card p-0 overflow-hidden border-none shadow-2xl shadow-primary/5">
          <div className="overflow-x-auto">
            <table className="saas-table border-collapse">
              <thead>
                <tr className="bg-muted/5 border-b border-border/50">
                  <th className="px-8 py-5">Position Details</th>
                  <th className="px-6 py-5">Compensation</th>
                  <th className="px-6 py-5">Location</th>
                  <th className="px-6 py-5">Date Posted</th>
                  <th className="px-6 py-5">Status</th>
                  <th className="px-8 py-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <Loader text="Fetching your recruitment drives..." />
                    </td>
                  </tr>
                ) : filteredJobs?.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-4 bg-muted/20 rounded-full">
                          <Briefcase size={32} className="text-muted-foreground" />
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground font-medium">
                            Try adjusting your search or <Link to="/company/post-job" className="text-primary hover:underline font-bold">post a new drive</Link>.
                          </p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredJobs?.map((job: any) => (
                    <tr key={job.id} className="group hover:bg-muted/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{job.title}</span>
                          <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                            <Plus size={10} className="text-primary" /> ID: {String(job.id).slice(-8).toUpperCase()}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-foreground font-bold">
                          <IndianRupee size={14} className="text-primary" />
                          <span className="text-sm">{formatSalary(job.salary)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                          <MapPin size={14} />
                          <span className="text-xs">{job.location}</span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-muted-foreground font-semibold">
                          <Calendar size={14} />
                          <span className="text-xs">
                            {job.createdAt ? new Date(job.createdAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: '2-digit',
                              year: 'numeric'
                            }) : 'N/A'}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <Badge 
                          className={`
                            px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border shadow-sm
                            ${(job.status === 'APPROVED' || job.status === 'Active') 
                              ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' 
                              : (job.status === 'REJECTED' || job.status === 'Closed')
                              ? 'bg-rose-500/10 text-rose-600 border-rose-500/20'
                              : 'bg-primary/10 text-primary border-primary/20'
                            }
                          `}
                        >
                          {job.status}
                        </Badge>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            onClick={() => handleView(job)}
                            className="p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-xl transition-all" 
                            title="View Details"
                          >
                            <Eye size={18} />
                          </button>
                          <button 
                            onClick={() => handleEditClick(job)}
                            className="p-2.5 text-muted-foreground hover:text-emerald-500 hover:bg-emerald-500/10 rounded-xl transition-all" 
                            title="Edit Drive"
                          >
                            <Edit2 size={18} />
                          </button>
                          <button 
                            onClick={() => handleDeleteClick(job)}
                            className="p-2.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all" 
                            title="Delete Drive"
                          >
                            <Trash2 size={18} />
                          </button>
                          <div className="w-px h-4 bg-border mx-1" />
                          <Link 
                            to={`/company/applicants/${job.id}`}
                            className="p-2.5 text-primary hover:bg-primary/10 rounded-xl transition-all group/btn flex items-center justify-center" 
                            title="View Applicants"
                          >
                            <ArrowRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                          </Link>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {meta && meta.totalPages > 1 && (
          <div className="flex justify-center mt-12 pb-12">
            <Pagination>
              <PaginationContent className="bg-card border border-border p-1 rounded-2xl shadow-sm">
                <PaginationItem>
                  <PaginationPrevious 
                    onClick={(e) => {
                      e.preventDefault();
                      if (page > 1) setPage(page - 1);
                    }}
                    href="#"
                    className={`rounded-xl ${page === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                  />
                </PaginationItem>
                
                {[...Array(meta.totalPages)].map((_, i) => {
                  const pageNumber = i + 1;
                  if (
                    pageNumber === 1 || 
                    pageNumber === meta.totalPages || 
                    (pageNumber >= page - 1 && pageNumber <= page + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          isActive={page === pageNumber}
                          onClick={(e) => {
                            e.preventDefault();
                            setPage(pageNumber);
                          }}
                          className={`rounded-xl ${page === pageNumber ? 'bg-primary text-white' : 'cursor-pointer hover:bg-muted'}`}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    );
                  } else if (
                    pageNumber === page - 2 || 
                    pageNumber === page + 2
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }
                  return null;
                })}

                <PaginationItem>
                  <PaginationNext 
                    onClick={(e) => {
                      e.preventDefault();
                      if (page < meta.totalPages) setPage(page + 1);
                    }}
                    href="#"
                    className={`rounded-xl ${page === meta.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}`}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>

      {/* Modals */}
      
      {/* View Modal */}
      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto saas-modal p-0 border-none bg-background shadow-2xl">
          {selectedJob && (
            <div className="flex flex-col">
              <div className="p-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent border-b border-border/50 relative overflow-hidden">
                 <div className="absolute top-0 right-0 p-10 opacity-[0.03] -rotate-6">
                   <Briefcase size={200} />
                 </div>
                 <div className="relative z-10 space-y-6">
                    <div className="flex items-center gap-2">
                      <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] font-black tracking-widest uppercase px-3 py-1 rounded-lg">Drive Analytics</Badge>
                      <div className="w-1.5 h-1.5 rounded-full bg-primary/30" />
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Public Preview</span>
                    </div>
                    <h2 className="text-4xl font-black text-foreground tracking-tight leading-none">{selectedJob.title}</h2>
                    <div className="flex flex-wrap gap-6 text-xs font-black text-muted-foreground/60 uppercase tracking-widest">
                      <div className="flex items-center gap-2.5 bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
                        <MapPin size={14} className="text-primary" /> {selectedJob.location}
                      </div>
                      <div className="flex items-center gap-2.5 bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
                        <IndianRupee size={14} className="text-primary" /> {formatSalary(selectedJob.salary)}
                      </div>
                      <div className="flex items-center gap-2.5 bg-muted/30 px-4 py-2 rounded-xl border border-border/50">
                        <Calendar size={14} className="text-primary" /> {new Date(selectedJob.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                 </div>
              </div>

              <div className="p-10 space-y-12">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Eligibility Architecture</h3>
                    </div>
                    <div className="space-y-4">
                       <div className="flex items-center justify-between p-5 bg-card border border-border/50 rounded-[1.5rem] shadow-sm">
                         <div className="flex flex-col gap-1">
                           <span className="text-[10px] font-black text-muted-foreground/50 uppercase tracking-widest">Required CGPA Range</span>
                           <span className="text-sm font-black text-foreground">Academic Excellence: {selectedJob.minCgpa} - {selectedJob.maxCgpa}</span>
                         </div>
                         <div className="w-12 h-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary">
                           <Target size={20} />
                         </div>
                       </div>
                       
                       <div className="space-y-3">
                         <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Preferred Departments</span>
                         <div className="flex flex-wrap gap-2">
                           {selectedJob.eligibleDepartments?.map((dept: any) => (
                             <Badge key={dept.id} variant="outline" className="bg-muted/10 text-[10px] font-black px-3 py-1.5 rounded-xl border-border/50 uppercase tracking-wider">{dept.name}</Badge>
                           ))}
                         </div>
                       </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="flex items-center gap-3">
                      <div className="w-1 h-4 bg-primary rounded-full" />
                      <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Skill Ecosystem</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {selectedJob.skills?.map((skill: any) => (
                        <div key={skill.id} className="flex items-center gap-2 bg-primary/5 text-primary border border-primary/10 px-4 py-2.5 rounded-2xl">
                          <Zap size={12} className="fill-primary" />
                          <span className="text-[10px] font-black uppercase tracking-widest">{skill.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center gap-3">
                    <div className="w-1 h-4 bg-primary rounded-full" />
                    <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Job Narrative</h3>
                  </div>
                  <div className="p-8 bg-card border border-border/50 rounded-[2.5rem] text-sm font-medium leading-loose text-muted-foreground whitespace-pre-wrap shadow-inner">
                    {selectedJob.description || "No description provided."}
                  </div>
                </div>
              </div>

              <div className="p-8 border-t border-border/50 flex justify-end bg-muted/5">
                <Button onClick={() => setIsViewOpen(false)} className="rounded-2xl px-12 h-12 font-black uppercase tracking-widest text-[10px] bg-foreground text-background hover:opacity-90 transition-all shadow-xl shadow-foreground/10">Close Preview</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="max-w-md saas-modal p-0 border-none bg-background shadow-2xl overflow-hidden">
          <div className="p-8 space-y-6 text-center">
            <div className="mx-auto w-20 h-20 bg-rose-500/10 rounded-3xl flex items-center justify-center text-rose-500 animate-pulse">
              <Trash2 size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-black text-foreground tracking-tight">Delete Job Drive?</h2>
              <p className="text-sm font-medium text-muted-foreground leading-relaxed">
                This action is irreversible. All applications associated with <span className="text-foreground font-black">"{selectedJob?.title}"</span> will be permanently archived.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={() => setIsDeleteOpen(false)} 
                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] border-border/50"
              >
                Cancel
              </Button>
              <Button 
                onClick={confirmDelete} 
                disabled={isSubmitting}
                className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest text-[10px] bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-500/20"
              >
                {isSubmitting ? <Loader size="sm" /> : "Confirm Delete"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto saas-modal p-0 border-none bg-background shadow-2xl">
          <DialogHeader className="p-10 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent border-b border-border/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
              <Edit2 size={160} />
            </div>
            <div className="relative z-10 flex items-center gap-6">
              <div className="w-16 h-16 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 shadow-inner">
                <Edit2 size={24} />
              </div>
              <div>
                <DialogTitle className="text-3xl font-black tracking-tight leading-none mb-2">Edit Job Drive</DialogTitle>
                <DialogDescription className="font-bold text-muted-foreground/60 uppercase tracking-widest text-[10px]">Reference ID: {selectedJob?.id}</DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="p-10 space-y-12">
            {/* Basic Info Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Primary Information</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-8">
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Job Position Title</label>
                  <div className="relative group">
                    <Zap size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      value={editFormData.title}
                      onChange={(e) => setEditFormData({ ...editFormData, title: e.target.value })}
                      placeholder="e.g. Lead Product Designer"
                      className="w-full saas-input-with-icon pl-11 bg-muted/30 border-border/50 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-2xl h-12 text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Annual Compensation (INR)</label>
                  <div className="relative group">
                    <IndianRupee size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      type="number"
                      value={editFormData.salary}
                      onChange={(e) => setEditFormData({ ...editFormData, salary: e.target.value })}
                      className="w-full saas-input-with-icon pl-11 bg-muted/30 border-border/50 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-2xl h-12 text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Work Location</label>
                  <div className="relative group">
                    <MapPin size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                    <input 
                      value={editFormData.location}
                      onChange={(e) => setEditFormData({ ...editFormData, location: e.target.value })}
                      className="w-full saas-input-with-icon pl-11 bg-muted/30 border-border/50 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-2xl h-12 text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Min CGPA</label>
                    <input 
                      type="number" step="0.1"
                      value={editFormData.minCgpa}
                      onChange={(e) => setEditFormData({ ...editFormData, minCgpa: e.target.value })}
                      className="w-full saas-input bg-muted/30 border-border/50 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-2xl h-12 text-sm font-bold text-center"
                    />
                  </div>
                  <div className="space-y-2.5">
                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/50 ml-1">Max CGPA</label>
                    <input 
                      type="number" step="0.1"
                      value={editFormData.maxCgpa}
                      onChange={(e) => setEditFormData({ ...editFormData, maxCgpa: e.target.value })}
                      className="w-full saas-input bg-muted/30 border-border/50 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-2xl h-12 text-sm font-bold text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Targeting Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Eligible Departments</h3>
                </div>
                <div className="flex flex-wrap gap-2 p-6 bg-muted/20 rounded-[2rem] border border-border/50 min-h-[140px] content-start">
                  {departments?.map((dept: any) => (
                    <button
                      key={dept.id}
                      onClick={() => toggleEditDept(dept.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                        editFormData.eligibleDepartmentIds.includes(dept.id)
                          ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 scale-105'
                          : 'bg-card text-muted-foreground/60 border border-border/50 hover:border-emerald-500/30'
                      }`}
                    >
                      {dept.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Required Skills</h3>
                </div>
                <div className="flex flex-wrap gap-2 p-6 bg-muted/20 rounded-[2rem] border border-border/50 min-h-[140px] content-start">
                  {skills?.map((skill: any) => (
                    <button
                      key={skill.id}
                      onClick={() => toggleEditSkill(skill.id)}
                      className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 ${
                        editFormData.skillIds.includes(skill.id)
                          ? 'bg-primary text-white shadow-lg shadow-primary/20 scale-105'
                          : 'bg-card text-muted-foreground/60 border border-border/50 hover:border-primary/30'
                      }`}
                    >
                      {skill.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-1 h-4 bg-emerald-500 rounded-full" />
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80">Role Description & Culture</h3>
              </div>
              <div className="relative group">
                <Info size={14} className="absolute left-5 top-5 text-muted-foreground group-focus-within:text-emerald-500 transition-colors" />
                <textarea 
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  placeholder="Describe the role, responsibilities, and company values..."
                  className="w-full saas-input bg-muted/30 border-border/50 focus:ring-emerald-500/10 focus:border-emerald-500 rounded-[2rem] min-h-[200px] py-5 pl-12 pr-6 text-sm font-medium leading-relaxed"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 border-t border-border/50 bg-muted/5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-muted-foreground/40 hidden md:flex">
              <Sparkles size={14} />
              <span className="text-[10px] font-bold uppercase tracking-widest">Changes are saved instantly upon confirmation</span>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <Button 
                variant="outline" 
                onClick={() => setIsEditOpen(false)} 
                className="flex-1 md:flex-none rounded-2xl px-8 h-12 font-black uppercase tracking-widest text-[10px] border-border/50"
              >
                Discard
              </Button>
              <Button 
                onClick={handleUpdateJob} 
                disabled={isSubmitting}
                className="flex-1 md:flex-none rounded-2xl px-12 h-12 font-black uppercase tracking-widest text-[10px] bg-emerald-500 hover:bg-emerald-600 shadow-xl shadow-emerald-500/20 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                {isSubmitting ? <Loader size="sm" /> : "Save Changes"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageJobs;
