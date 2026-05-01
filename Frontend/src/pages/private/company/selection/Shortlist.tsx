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
    <div className="max-w-7xl mx-auto p-4 md:p-6 space-y-6">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e2eb]">Shortlisted Candidates</h1>
          <p className="text-sm text-[#908fa0]">Manage and move candidates to the next stage.</p>
        </div>

      </div>

      {/* Filters Card */}
      <div className="bg-[#1e1f26] p-4 rounded-2xl border border-[rgba(255,255,255,0.07)]">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#908fa0]" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-[#0c0e14] border border-[rgba(255,255,255,0.08)] rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-[#e2e2eb] placeholder:text-[#908fa0] transition-all outline-none"
            />
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#908fa0]" />
            <select
              value={branchFilter}
              onChange={(e) => setBranchFilter(e.target.value)}
              className="bg-[#0c0e14] border border-[rgba(255,255,255,0.08)] text-[#c7c4d7] px-4 py-3 rounded-xl focus:ring-2 focus:ring-indigo-500/20 min-w-[120px] outline-none"
            >
              <option value="All">All Departments</option>
              {uniqueBranches.map((branch: any) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Responsive Content: Table for Desktop, Cards for Mobile */}
      <div className="hidden md:block bg-[#1e1f26] rounded-2xl border border-[rgba(255,255,255,0.07)] overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-[rgba(255,255,255,0.02)] border-b border-[rgba(255,255,255,0.07)]">
            <tr>
              <th className="px-6 py-4 text-sm font-semibold text-[#c7c4d7]">Candidate</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#c7c4d7]">Department</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#c7c4d7]">Status</th>
              <th className="px-6 py-4 text-sm font-semibold text-[#c7c4d7]">Email</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[rgba(255,255,255,0.05)]">
            {filteredData?.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center py-12 text-[#908fa0]">No candidates found</td>
              </tr>
            ) : (
              filteredData?.map((item: any) => (
                <tr key={item.applicationId} className="hover:bg-[rgba(255,255,255,0.025)] transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-500/15 text-indigo-400 rounded-full flex items-center justify-center font-bold">
                        {item.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-[#e2e2eb]">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2 text-[#c7c4d7]">
                      <GraduationCap className="w-4 h-4" />
                      {item.branch}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="secondary" className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20 px-3 py-1">
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-[#908fa0] text-sm">{item.email}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="grid grid-cols-1 gap-4 md:hidden">
        {filteredData?.map((item: any) => (
          <div key={item.applicationId} className="bg-[#1e1f26] p-5 rounded-2xl border border-[rgba(255,255,255,0.07)] space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-indigo-500/15 text-indigo-400 rounded-full flex items-center justify-center font-bold text-lg">
                {item.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="font-bold text-[#e2e2eb]">{item.name}</h3>
                <p className="text-xs text-[#908fa0]">{item.email}</p>
              </div>
            </div>

            <div className="flex justify-between items-center pt-2 border-t border-[rgba(255,255,255,0.05)]">
              <div className="flex items-center gap-2 text-sm text-[#c7c4d7]">
                <GraduationCap className="w-4 h-4" />
                {item.branch}
              </div>
              <Badge className="bg-emerald-500/15 text-emerald-400 border-emerald-500/20">{item.status}</Badge>
            </div>
          </div>
        ))}
        {filteredData?.length === 0 && (
          <p className="text-center py-10 text-[#908fa0]">No candidates found</p>
        )}
      </div>
    </div>
  );
};

export default Shortlist;