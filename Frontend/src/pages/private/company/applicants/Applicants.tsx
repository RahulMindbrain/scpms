import React from 'react';
import { Search, Filter, Download } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplications, updateJobApplicationStatus } from '@/redux/thunks/companyThunk';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import Loader from '@/components/Loader';

const Applicants: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading } = useSelector((state: RootState) => state.company);

  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedStatus, setSelectedStatus] = React.useState('ALL');
  const [selectedJob, setSelectedJob] = React.useState('All Jobs');

  React.useEffect(() => {
    const params: { status?: string; page?: number; limit?: number } = {};
    if (selectedStatus !== 'ALL') {
      params.status = selectedStatus;
    }
    dispatch(fetchJobApplications(params));
  }, [dispatch, selectedStatus]);

  const filteredApplicants = applications.filter((app: any) => {
    const studentName = `${app.student?.user?.firstname || ''} ${app.student?.user?.lastname || ''}`.toLowerCase();
    const matchesSearch = studentName.includes(searchTerm.toLowerCase());
    const matchesJob = selectedJob === 'All Jobs' || app.job?.title === selectedJob;
    return matchesSearch && matchesJob;
  });

  const uniqueJobs = Array.from(new Set(applications.map((app: any) => app.job?.title))).filter(Boolean);

  const handleStatusUpdate = async (id: number, newStatus: string) => {
    const toastId = toast.loading(`Updating status to ${newStatus}...`);
    try {
      await dispatch(updateJobApplicationStatus({ id, status: newStatus })).unwrap();
      toast.success("Status updated successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err || "Failed to update status", { id: toastId });
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-700">
      {/* Filters + Search */}
      <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#1e1f26] p-5 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[#908fa0] group-focus-within:text-indigo-400 transition-colors" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0e14] text-[#e2e2eb] placeholder:text-[#908fa0] focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all text-sm font-medium"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0e14]">
              <Filter className="w-4 h-4 text-[#908fa0]" />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#c7c4d7] focus:outline-none cursor-pointer"
              >
                <option>All Jobs</option>
                {uniqueJobs.map((job) => (
                  <option key={job as string} value={job as string}>{job as string}</option>
                ))}
              </select>
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#0c0e14] text-sm font-bold text-[#c7c4d7] focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto rounded-xl border border-[rgba(255,255,255,0.05)]">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-[rgba(255,255,255,0.06)] bg-[rgba(255,255,255,0.02)]">
                <th className="px-4 py-3.5 text-xs font-bold text-[#908fa0] uppercase tracking-widest">Name</th>
                <th className="px-4 py-3.5 text-xs font-bold text-[#908fa0] uppercase tracking-widest">Branch</th>
                <th className="px-4 py-3.5 text-xs font-bold text-[#908fa0] uppercase tracking-widest">CGPA</th>
                <th className="px-4 py-3.5 text-xs font-bold text-[#908fa0] uppercase tracking-widest">Applied For</th>
                <th className="px-4 py-3.5 text-xs font-bold text-[#908fa0] uppercase tracking-widest">Status</th>
                <th className="px-4 py-3.5 text-xs font-bold text-[#908fa0] uppercase tracking-widest text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <Loader text="Loading applicants..." />
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm font-medium text-[#908fa0]">
                    No applicants found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app: any, index: number) => (
                  <tr key={index} className="hover:bg-[rgba(255,255,255,0.025)] transition-all group">
                    <td className="px-4 py-4 font-bold text-[#e2e2eb]">
                      {app.student?.user?.firstname || 'N/A'} {app.student?.user?.lastname || ''}
                    </td>
                    <td className="px-4 py-4 text-sm font-medium text-[#908fa0]">{app.student?.department?.name || `Dept ${app.student?.departmentId || 'N/A'}`}</td>
                    <td className="px-4 py-4 text-sm font-black text-[#c7c4d7]">{app.student?.cgpa || 'N/A'}</td>
                    <td className="px-4 py-4 text-sm font-medium text-[#c7c4d7]">{app.job?.title || 'N/A'}</td>
                    <td className="px-4 py-4 font-bold">
                      <Select
                        value={app.status}
                        onValueChange={(value) => handleStatusUpdate(app.id, value)}
                      >
                        <SelectTrigger className="w-[140px] h-9 border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.04)] rounded-xl hover:bg-[rgba(255,255,255,0.07)] transition-colors text-[#e2e2eb]">
                          <SelectValue>
                            <Badge variant={
                              app.status === 'SELECTED' ? 'success' :
                                app.status === 'REJECTED' ? 'danger' :
                                  app.status === 'SHORTLISTED' ? 'default' :
                                    app.status === 'INTERVIEW' ? 'warning' : 'outline'
                            }>
                              {app.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent className="rounded-xl border-[rgba(255,255,255,0.1)] bg-[#1e1f26] shadow-2xl p-1">
                          <SelectItem value="APPLIED" className="rounded-lg mb-1 text-[#c7c4d7] focus:bg-indigo-500/10 focus:text-indigo-300">Applied</SelectItem>
                          <SelectItem value="SHORTLISTED" className="rounded-lg mb-1 text-[#c7c4d7] focus:bg-indigo-500/10 focus:text-indigo-300">Shortlisted</SelectItem>
                          <SelectItem value="INTERVIEW" className="rounded-lg mb-1 text-[#c7c4d7] focus:bg-indigo-500/10 focus:text-indigo-300">Interview</SelectItem>
                          <SelectItem value="SELECTED" className="rounded-lg mb-1 text-[#c7c4d7] focus:bg-indigo-500/10 focus:text-indigo-300">Selected</SelectItem>
                          <SelectItem value="REJECTED" className="rounded-lg text-[#c7c4d7] focus:bg-rose-500/10 focus:text-rose-300">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-4 text-right">
                      {app.student?.resumeUrl ? (
                        <a
                          href={app.student.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-[#908fa0] hover:text-indigo-400 transition-colors px-3 py-2 rounded-lg hover:bg-indigo-500/10"
                        >
                          <Download className="w-4 h-4" /> View Resume
                        </a>
                      ) : (
                        <span className="text-xs text-[#908fa0] italic">No resume</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Applicants;