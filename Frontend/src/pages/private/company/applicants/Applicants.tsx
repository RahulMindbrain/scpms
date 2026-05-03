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
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Drive Applicants</h1>
          <p className="text-sm text-muted-foreground font-medium">Review and manage student applications for your job drives.</p>
        </div>
      </div>

      <div className="saas-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search students by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="saas-input pl-10"
            />
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedJob}
              onChange={(e) => setSelectedJob(e.target.value)}
              className="saas-input w-full md:w-[200px]"
            >
              <option>All Jobs</option>
              {uniqueJobs.map((job) => (
                <option key={job as string} value={job as string}>
                  {job as string}
                </option>
              ))}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="saas-input w-full md:w-[150px]"
            >
              <option value="ALL">All Status</option>
              <option value="APPLIED">Applied</option>
              <option value="SHORTLISTED">Shortlisted</option>
              <option value="SELECTED">Selected</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>

        <div className="saas-table-container mt-4">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Department</th>
                <th>CGPA</th>
                <th>Applied For</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-border/30">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center">
                    <Loader text="Loading applicants..." />
                  </td>
                </tr>
              ) : filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-20 text-center text-muted-foreground font-medium">
                    No applicants found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app: any) => (
                  <tr key={app.id}>
                    <td className="font-bold text-foreground">
                      {app.student?.user?.firstname || 'N/A'} {app.student?.user?.lastname || ''}
                    </td>
                    <td className="text-xs text-muted-foreground">
                      {app.student?.department?.name || 'N/A'}
                    </td>
                    <td className="text-xs font-bold text-primary">
                      {app.student?.cgpa || 'N/A'}
                    </td>
                    <td className="text-xs">
                      {app.job?.title || 'N/A'}
                    </td>
                    <td className="text-center">
                      <Select
                        value={app.status}
                        onValueChange={(value) =>
                          handleStatusUpdate(app.id, value, app.status)
                        }
                      >
                        <SelectTrigger className="w-[130px] mx-auto h-8 rounded-lg text-[10px] font-bold">
                          <SelectValue />
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