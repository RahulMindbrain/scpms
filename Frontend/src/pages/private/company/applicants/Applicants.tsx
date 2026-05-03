import React from 'react';
import { Search, Filter } from 'lucide-react';
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

  const filteredApplicants = applications.filter((app: any) => {
    const studentName = `${app.student?.user?.firstname || ''} ${app.student?.user?.lastname || ''}`.toLowerCase();
    const matchesSearch = studentName.includes(searchTerm.toLowerCase());
    const matchesJob = selectedJob === 'All Jobs' || app.job?.title === selectedJob;
    return matchesSearch && matchesJob;
  });

  const uniqueJobs = Array.from(
    new Set(applications.map((app: any) => app.job?.title))
  ).filter(Boolean);

  const handleStatusUpdate = async (id: number, newStatus: string, currentStatus: string) => {
    const currentIndex = STATUS_FLOW.indexOf(currentStatus);
    const newIndex = STATUS_FLOW.indexOf(newStatus);

    if (newIndex < currentIndex) {
      toast.error("Status cannot be moved backward!");
      return;
    }

    if (newIndex === currentIndex) return;

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

      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-6 space-y-6">
        <div className="flex flex-col md:flex-row gap-4">

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

          <div className="flex items-center gap-3">

            <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 rounded-xl border border-slate-100">
              <Filter className="w-4 h-4 text-slate-400" />
              <select
                value={selectedJob}
                onChange={(e) => setSelectedJob(e.target.value)}
                className="bg-transparent text-sm font-bold text-[#c7c4d7] focus:outline-none cursor-pointer"
              >
                <option>All Jobs</option>
                {uniqueJobs.map((job) => (
                  <option key={job as string} value={job as string}>
                    {job as string}
                  </option>
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
              <tr className="border-b border-slate-50">
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase">Name</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase">Branch</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase">CGPA</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase">Applied For</th>
                <th className="px-4 py-4 text-xs font-bold text-slate-400 uppercase">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center">
                    <Loader text="Loading applicants..." />
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-sm text-slate-500">
                    No applicants found.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app: any) => (
                  <tr key={app.id} className="hover:bg-slate-50 transition">

                    <td className="px-4 py-5 font-bold text-slate-800">
                      {app.student?.user?.firstname || 'N/A'} {app.student?.user?.lastname || ''}
                    </td>

                    <td className="px-4 py-5 text-sm text-slate-500">
                      {app.student?.department?.name || 'N/A'}
                    </td>

                    <td className="px-4 py-5 text-sm font-bold text-slate-700">
                      {app.student?.cgpa || 'N/A'}
                    </td>

                    <td className="px-4 py-5 text-sm text-slate-600">
                      {app.job?.title || 'N/A'}
                    </td>

                    <td className="px-4 py-5">
                      <Select
                        value={app.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(app.id, value, app.status)
                        }
                      >
                        <SelectTrigger className="w-[140px] h-9 rounded-xl">
                          <SelectValue>
                            <Badge className="text-[10px] py-0 px-2" variant={
                              app.status === 'SELECTED' ? 'success' :
                              app.status === 'REJECTED' ? 'danger' :
                              app.status === 'SHORTLISTED' ? 'default' :
                              'outline'
                            }>
                              {app.status}
                            </Badge>
                          </SelectValue>
                        </SelectTrigger>

                        <SelectContent>
                          <SelectItem value="APPLIED" disabled={isBackward(app.status, 'APPLIED')}>Applied</SelectItem>
                          <SelectItem value="SHORTLISTED" disabled={isBackward(app.status, 'SHORTLISTED')}>Shortlisted</SelectItem>
                          <SelectItem value="SELECTED" disabled={isBackward(app.status, 'SELECTED')}>Selected</SelectItem>
                          <SelectItem value="REJECTED" disabled={isBackward(app.status, 'REJECTED')}>Rejected</SelectItem>
                        </SelectContent>
                      </Select>
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