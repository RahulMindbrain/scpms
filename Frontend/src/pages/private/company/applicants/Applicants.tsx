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

  // Get unique job titles for filter
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
    <div className="space-y-9 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-end gap-4">
        {/* <Button variant="outline" className="font-bold border-slate-200 hover:border-blue-600 hover:text-blue-600 px-6 py-6 rounded-2xl transition-all">
          <Download className="w-5 h-5 mr-2" /> Download All Resumes
        </Button> */}
      </div>

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input
              type="text"
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl border border-slate-100 bg-slate-50/50 focus:outline-none focus:ring-2 focus:ring-blue-500/10 focus:border-blue-500 transition-all font-medium text-slate-800"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="bg-transparent text-sm font-bold text-slate-600 focus:outline-none cursor-pointer"
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
              className="px-4 py-2 bg-slate-50 rounded-xl border border-slate-100 text-sm font-bold text-slate-600 focus:outline-none cursor-pointer"
            >
              <option value="ALL">All Status</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto -mx-2">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-50">
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest">Name</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest">Branch</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest">CGPA</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest">Applied For</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest">Status</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 border-none uppercase tracking-widest text-right">Resume</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center">
                    <Loader text="Loading applicants..." />
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sm font-medium text-slate-500">
                    No applicants found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app: any, index: number) => (
                  <tr key={index} className="hover:bg-slate-50/80 transition-all group rounded-xl">
                    <td className="px-4 py-5 font-bold text-slate-800">
                      {app.student?.user?.firstname || 'N/A'} {app.student?.user?.lastname || ''}
                    </td>
                    <td className="px-4 py-5 text-sm font-medium text-slate-500">{app.student?.department?.name || `Dept ${app.student?.departmentId || 'N/A'}`}</td>
                    <td className="px-4 py-5 text-sm font-black text-slate-700">{app.student?.cgpa || 'N/A'}</td>
                    <td className="px-4 py-5 text-sm font-medium text-slate-600">{app.job?.title || 'N/A'}</td>
                    <td className="px-4 py-5 font-bold">
                      <Select
                        value={app.status}
                        onValueChange={(value) => handleStatusUpdate(app.id, value)}
                      >
                        <SelectTrigger className="w-[140px] h-9 border-slate-100 bg-slate-50/50 rounded-xl hover:bg-slate-100 transition-colors">
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
                        <SelectContent className="rounded-2xl border-slate-100 shadow-xl p-1">
                          <SelectItem value="APPLIED" className="rounded-lg mb-1">Applied</SelectItem>
                          <SelectItem value="SHORTLISTED" className="rounded-lg mb-1">Shortlisted</SelectItem>
                          <SelectItem value="INTERVIEW" className="rounded-lg mb-1">Interview</SelectItem>
                          <SelectItem value="SELECTED" className="rounded-lg mb-1">Selected</SelectItem>
                          <SelectItem value="REJECTED" className="rounded-lg">Rejected</SelectItem>
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="px-4 py-5 text-right">
                      {app.student?.resumeUrl ? (
                        <a
                          href={app.student.resumeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50"
                        >
                          <Download className="w-4 h-4" /> View Resume
                        </a>
                      ) : (
                        <span className="text-xs text-slate-400 italic">No resume</span>
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