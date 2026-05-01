import React, { useState, useEffect } from 'react';
import { Search, Building2, Briefcase, Info } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScheduleApplications, fetchSchedules } from '@/redux/thunks/interviewThunk';
import type { RootState, AppDispatch } from '@/redux/store/store';
import { useParams } from "react-router-dom";
import Loader from '@/components/Loader';

const ApplicationsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const { applications = [], schedules = [], loading } = useSelector((state: RootState) => state.interview);
  const { id } = useParams<{ id?: string }>();
  const routeScheduleId = id ? Number(id) : null;
  const fallbackScheduleId = schedules[0]?.id ? Number(schedules[0].id) : null;
  const scheduleId = routeScheduleId && Number.isFinite(routeScheduleId)
    ? routeScheduleId
    : fallbackScheduleId;

  useEffect(() => {
    if (!routeScheduleId) {
      dispatch(fetchSchedules());
    }
  }, [dispatch, routeScheduleId]);

  useEffect(() => {
    if (scheduleId && Number.isFinite(scheduleId)) {
      dispatch(fetchScheduleApplications(scheduleId));
    }
  }, [dispatch, scheduleId]);

  const filteredApplications = applications.filter((app: any) =>
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SELECTED': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'SHORTLISTED': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'REJECTED': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-[#c7c4d7] border-[rgba(255,255,255,0.08)]';
    }
  };

  return (
    <div className="min-h-screen bg-[#111319] p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#e2e2eb]">Applications</h1>
            <p className="text-[#908fa0]">Track and manage student recruitment stages</p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#908fa0] w-5 h-5" />
            <input
              type="text"
              placeholder="Search by student or role..."
              className="w-full pl-10 pr-4 py-3 bg-[#1e1f26] border border-[rgba(255,255,255,0.08)] rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20">
            <Loader text="Retrieving application records..." />
          </div>
        )}

        {/* Desktop Table View (Hidden on Mobile) */}
        {!loading && scheduleId && (
          <>
            <div className="hidden md:block overflow-hidden bg-[#1e1f26] rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-sm">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-[#111319] border-b border-[rgba(255,255,255,0.08)]">
                    <th className="px-6 py-4 text-xs font-semibold text-[#908fa0] uppercase">Student</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#908fa0] uppercase">Role</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#908fa0] uppercase">Department</th>
                    <th className="px-6 py-4 text-xs font-semibold text-[#908fa0] uppercase text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredApplications.map((app: any) => (
                    <tr key={app.applicationId} className="hover:bg-[#111319] transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">
                            {app.name.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-[#e2e2eb]">{app.name}</p>
                            <p className="text-xs text-[#908fa0]">{app.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#c7c4d7]">{app.jobTitle}</td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-[#c7c4d7]">{app.department?.name}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-bold border ${getStatusStyle(app.status)}`}>
                          {app.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View (Hidden on Desktop) */}
            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredApplications.map((app: any) => (
                <div key={app.applicationId} className="bg-[#1e1f26] p-5 rounded-2xl border border-[rgba(255,255,255,0.08)] shadow-sm space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold">
                        {app.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="font-bold text-[#e2e2eb]">{app.name}</h3>
                        <p className="text-xs text-[#908fa0]">{app.email}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${getStatusStyle(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-2 border-t border-slate-50">
                    <div className="flex items-center gap-2 text-[#c7c4d7]">
                      <Briefcase size={14} className="text-[#908fa0]" />
                      <span className="text-xs font-medium truncate">{app.jobTitle}</span>
                    </div>
                    <div className="flex items-center gap-2 text-[#c7c4d7]">
                      <Building2 size={14} className="text-[#908fa0]" />
                      <span className="text-xs font-medium">{app.department?.name}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Empty State */}
        {!loading && !scheduleId && (
          <div className="text-center py-20 bg-[#1e1f26] rounded-2xl border border-dashed border-slate-300">
            <Info className="mx-auto text-slate-300 mb-2" size={40} />
            <p className="text-[#908fa0]">No interview schedules are available to load applications.</p>
          </div>
        )}

        {!loading && scheduleId && filteredApplications.length === 0 && (
          <div className="text-center py-20 bg-[#1e1f26] rounded-2xl border border-dashed border-slate-300">
            <Info className="mx-auto text-slate-300 mb-2" size={40} />
            <p className="text-[#908fa0]">No applications found matching your search.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationsManagement;