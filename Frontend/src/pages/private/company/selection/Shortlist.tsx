import React, { useEffect, useState } from 'react';
import { Search, Filter, GraduationCap } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications } from '@/redux/thunks/applicationThunk';
import type { RootState, AppDispatch } from '@/redux/store/store';
import { Badge } from '@/components/ui/badge';
import Loader from '@/components/Loader';

const Shortlist: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications, loading } = useSelector((state: RootState) => state.application);

  const [search, setSearch] = useState("");
  const [branchFilter, setBranchFilter] = useState("All");

  useEffect(() => {
    dispatch(fetchApplications(1));
  }, [dispatch]);


  // Transform and Filter Data
  const filteredData = applications
    ?.filter((app: any) => app.status === "SHORTLISTED")
    ?.map((app: any) => ({
      ...app,
      branch: app.department?.name || "Other",
    }))
    ?.filter((item: any) => {
      return (
        item.name.toLowerCase().includes(search.toLowerCase()) &&
        (branchFilter === "All" || item.branch === branchFilter)
      );
    });

  // Get unique branches for filter
  const uniqueBranches = Array.from(
    new Set(
      applications
        ?.filter((app: any) => app.status === "SHORTLISTED")
        ?.map((app: any) => app.department?.name)
        .filter(Boolean)
    )
  );

  if (loading) {
    return <Loader text="Loading shortlisted candidates..." />;
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground">Shortlisted Candidates</h1>
          <p className="text-sm text-muted-foreground font-medium">Review and manage students who have been shortlisted for further rounds.</p>
        </div>
      </div>

      <div className="saas-card p-4 space-y-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1 group">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="saas-input pl-11"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="saas-input min-w-[180px]"
            >
              <option value="All">All Departments</option>
              {uniqueBranches.map((branch: any) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="saas-table-container mt-4">
          <table className="saas-table">
            <thead>
              <tr>
                <th>Candidate</th>
                <th>Department</th>
                <th>Status</th>
                <th>Email Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/30">
              {filteredData?.length === 0 ? (
                <tr>
                  <td colSpan={4} className="text-center py-20 text-muted-foreground font-medium">No candidates found</td>
                </tr>
              ) : (
                filteredData?.map((item: any) => (
                  <tr key={item.applicationId}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                          {item.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-bold text-foreground text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="text-xs">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={14} className="text-muted-foreground" />
                        {item.branch}
                      </div>
                    </td>
                    <td>
                      <Badge variant="success" className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 px-2 py-0 h-5 text-[10px] font-bold">
                        {item.status}
                      </Badge>
                    </td>
                    <td className="text-xs text-muted-foreground font-medium">{item.email}</td>
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

export default Shortlist;