import React from 'react';
import { Search, User, GraduationCap, Briefcase, CheckCircle2, XCircle, Clock, Sparkles, Target } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplications, updateJobApplicationStatus } from '@/redux/thunks/companyThunk';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import Loader from '@/components/Loader';

const Applicants: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading } = useSelector((state: RootState) => state.company);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [selectedJob, setSelectedJob] = React.useState('All Jobs');

  const STATUS_FLOW = ['APPLIED', 'SHORTLISTED', 'SELECTED', 'REJECTED'];

  const isBackward = (current: string, next: string) => {
    return STATUS_FLOW.indexOf(next) < STATUS_FLOW.indexOf(current);
  };

  React.useEffect(() => {
    const params: { status?: string } = {};
    if (selectedStatus !== 'ALL') {
      params.status = selectedStatus;
    }
    dispatch(fetchJobApplications(params));
  }, [dispatch, selectedStatus]);

  const filteredApplicants = (applications || []).filter((app: any) => {
    const studentName = `${app.student?.user?.firstname || ''} ${app.student?.user?.lastname || ''}`.toLowerCase();
    const matchesSearch = studentName.includes(searchTerm.toLowerCase());
    const matchesJob = selectedJob === 'All Jobs' || app.job?.title === selectedJob;
    return matchesSearch && matchesJob;
  });

  const uniqueJobs = Array.from(
    new Set((applications || []).map((app: any) => app.job?.title))
  ).filter(Boolean);

  const handleStatusUpdate = async (id: number, newStatus: string, currentStatus: string) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    const newIndex = STATUS_FLOW.indexOf(newStatus);

    if (newIndex < currentIndex) {
      toast.error("Process integrity: Status cannot be moved backward");
      return;
    }

    if (newIndex === currentIndex) return;

    const toastId = toast.loading(`Updating ${newStatus.toLowerCase()} status...`);
    try {
      await dispatch(updateJobApplicationStatus({ id, status: newStatus })).unwrap();
      toast.success("Candidate status updated!", { id: toastId });
    } catch (err: any) {
      toast.error(err || "Update failed", { id: toastId });
    }
  };

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
              <Target size={12} className="animate-pulse text-white" />
              Talent Review
            </div>
            <h1 className="hero-title">
              Drive <br />
              <span>Applicants</span>
            </h1>
            <p className="hero-description">
              Review, shortlist, and select the best candidates from your recruitment drives. 
              Manage the entire candidate lifecycle from application to selection.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 space-y-8">
        
        {/* Filters Bar */}
        <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <div className="md:col-span-2 lg:col-span-3 relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search by student name..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full saas-input-with-icon pr-4 py-3.5 bg-card border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-medium text-sm shadow-sm"
            />
          </div>

          <div className="md:col-span-1 lg:col-span-1.5">
            <div className="relative">
              <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" size={16} />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-card border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer appearance-none shadow-sm"
              >
                <option>All Jobs</option>
                {uniqueJobs.map((job) => (
                  <option key={job as string} value={job as string}>{job as string}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="md:col-span-1 lg:col-span-1.5">
            <div className="relative">
              <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground z-10 pointer-events-none" size={16} />
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full pl-11 pr-4 py-3.5 bg-card border border-border rounded-2xl focus:outline-none focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all font-bold text-[10px] uppercase tracking-widest text-muted-foreground cursor-pointer appearance-none shadow-sm"
              >
                <option value="ALL">All Status</option>
                <option value="APPLIED">Applied</option>
                <option value="SHORTLISTED">Shortlisted</option>
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Applicants Table */}
        <div className="saas-card p-0 overflow-hidden border-none shadow-2xl shadow-primary/5">
          <div className="overflow-x-auto">
            <table className="saas-table border-collapse">
              <thead>
                <tr className="bg-muted/5 border-b border-border/50">
                  <th className="px-8 py-5">Candidate Profile</th>
                  <th className="px-6 py-5">Academic Stats</th>
                  <th className="px-6 py-5">Applied For</th>
                  <th className="px-8 py-5 text-center">Lifecycle Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="py-24 text-center">
                      <Loader text="Analyzing candidate profiles..." />
                    </td>
                  </tr>
                ) : filteredApplicants.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="py-32 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-muted/20 rounded-full">
                          <User size={40} className="text-muted-foreground" />
                        </div>
                        <div>
                          <h3 className="text-xl font-extrabold text-foreground">No applicants found</h3>
                          <p className="text-sm text-muted-foreground font-medium">Try broadening your search criteria.</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredApplicants.map((app: any) => (
                    <tr key={app.id} className="group hover:bg-muted/5 transition-colors">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/5 group-hover:scale-110 transition-transform duration-300">
                              <User size={20} />
                            </div>
                            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-white dark:bg-card border-2 border-primary rounded-full flex items-center justify-center shadow-sm">
                              <Sparkles size={10} className="text-primary" />
                            </div>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-sm font-black text-foreground group-hover:text-primary transition-colors">
                              {app.student?.user?.firstname || 'Candidate'} {app.student?.user?.lastname || ''}
                            </span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                              {app.student?.department?.name || 'Department N/A'}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex flex-col gap-1.5">
                          <div className="flex items-center gap-2">
                            <div className="px-2 py-0.5 bg-violet-500/10 text-violet-600 rounded text-[10px] font-black uppercase tracking-widest border border-violet-500/10">
                              CGPA: {app.student?.cgpa || 'N/A'}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 text-muted-foreground font-bold text-[9px] uppercase tracking-wider">
                            <GraduationCap size={12} className="text-violet-500" /> Academic Eligibility Verified
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="flex items-center gap-2 text-foreground font-bold">
                          <div className="p-1.5 bg-emerald-500/10 text-emerald-600 rounded-lg">
                            <Briefcase size={14} />
                          </div>
                          <span className="text-xs">{app.job?.title || 'N/A'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center justify-center">
                          <Select
                            value={app.status}
                            onValueChange={(value) =>
                              handleStatusUpdate(app.id, value, app.status)
                            }
                          >
                            <SelectTrigger className={`
                              w-[160px] h-10 rounded-xl text-[10px] font-black uppercase tracking-widest border-2 transition-all
                              ${app.status === 'SELECTED' ? 'border-emerald-500/50 bg-emerald-500/5 text-emerald-600' :
                                app.status === 'REJECTED' ? 'border-rose-500/50 bg-rose-500/5 text-rose-600' :
                                app.status === 'SHORTLISTED' ? 'border-violet-500/50 bg-violet-500/5 text-violet-600' :
                                'border-primary/50 bg-primary/5 text-primary'}
                            `}>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="rounded-2xl border-border shadow-2xl">
                              <SelectItem value="APPLIED" disabled={isBackward(app.status, 'APPLIED')}>
                                <div className="flex items-center gap-2 py-1">
                                  <Clock size={14} className="text-primary" /> <span>Applied</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="SHORTLISTED" disabled={isBackward(app.status, 'SHORTLISTED')}>
                                <div className="flex items-center gap-2 py-1">
                                  <Sparkles size={14} className="text-violet-500" /> <span>Shortlisted</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="SELECTED" disabled={isBackward(app.status, 'SELECTED')}>
                                <div className="flex items-center gap-2 py-1">
                                  <CheckCircle2 size={14} className="text-emerald-500" /> <span>Selected</span>
                                </div>
                              </SelectItem>
                              <SelectItem value="REJECTED" disabled={isBackward(app.status, 'REJECTED')}>
                                <div className="flex items-center gap-2 py-1">
                                  <XCircle size={14} className="text-rose-500" /> <span>Rejected</span>
                                </div>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Applicants;