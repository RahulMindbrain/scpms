import React, { useEffect, useState } from 'react';
import { 
  Edit3, 
  Trash2, 
  Search, 
  Filter, 
  Plus, 
  Briefcase, 
  MapPin, 
  IndianRupee, 
  Calendar, 
  Sparkles, 
  X, 
  Check, 
  AlertTriangle, 
  Zap, 
  Info, 
  Target 
} from 'lucide-react';
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
import { deleteCompanyJob } from '@/redux/thunks/companyThunk';
import { Button } from '@/components/ui/button';

const ManageJobs: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading, meta } = useSelector((state: RootState) => state.company);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  // Modal States
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { departments } = useSelector((state: RootState) => state.department);
  const { skills } = useSelector((state: RootState) => state.skill);

  useEffect(() => {
    dispatch(fetchCompanyJobs({ page }));
    dispatch(fetchDepartments());
    dispatch(fetchSkills());
  }, [dispatch, page]);

  const handleDeleteClick = (job: any) => {
    setSelectedJob(job);
    setIsDeleteOpen(true);
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
                        <div className="flex items-center justify-end gap-3">
                          <Link 
                            to={`/company/post-job?jobId=${job.id}`}
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500 hover:text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-sm"
                            title="Modify Drive"
                          >
                            <Edit3 size={14} /> Modify
                          </Link>
                          <button 
                            onClick={() => handleDeleteClick(job)}
                            className="p-2.5 text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all" 
                            title="Delete Drive"
                          >
                            <Trash2 size={18} />
                          </button>

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
      
      {/* View & Edit modals removed as per user request to move logic to PostJob wizard */}
    </div>
  );
};

export default ManageJobs;
