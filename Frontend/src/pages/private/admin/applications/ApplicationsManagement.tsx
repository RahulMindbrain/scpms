import React, { useState, useEffect } from 'react';
import { Search, Building2, Briefcase, Users, UserCheck, Hash, Layers, Download } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScheduleApplications, fetchSchedules } from '@/redux/thunks/interviewThunk';
import type { RootState, AppDispatch } from '@/redux/store/store';
import { useParams, useNavigate } from "react-router-dom";
import Loader from '@/components/Loader';
import { AdminPageLayout } from '@/components/layout/AdminPageLayout';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';

const ApplicationsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const limit = 10;
  
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  
  const { applications = [], schedules = [], meta, loading } = useSelector((state: RootState) => state.interview);
  const { id } = useParams<{ id?: string }>();
  
  const scheduleId = id ? Number(id) : null;

  // Handle automatic redirection to first schedule if no ID is present
  useEffect(() => {
    if (!id && schedules.length > 0) {
      navigate(`/admin/applications/${schedules[0].id}`, { replace: true });
    }
  }, [id, schedules, navigate]);

  // Fetch all schedules on mount if not loaded
  useEffect(() => {
    if (schedules.length === 0) {
      dispatch(fetchSchedules());
    }
  }, [dispatch, schedules.length]);

  // Reset page whenever schedule changes
  useEffect(() => {
    setPage(1);
  }, [scheduleId]);

  // Automatically fetch applications when scheduleId or page changes
  useEffect(() => {
    if (scheduleId && Number.isFinite(scheduleId)) {
      dispatch(
        fetchScheduleApplications({
          id: scheduleId,
          page,
          limit,
        })
      );
    }
  }, [dispatch, scheduleId, page, limit]);

  const applicationList = applications;

  const filteredApplications = applicationList.filter((app: any) =>
    app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.department?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.applicationId?.toString().includes(searchTerm)
  );

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'SELECTED': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'SHORTLISTED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'TECHNICAL_ROUND': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'HR_ROUND': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      case 'REJECTED': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      default: return 'bg-muted/30 text-muted-foreground border-border';
    }
  };

  const handleScheduleChange = (val: string) => {
    navigate(`/admin/applications/${val}`);
  };

  const handleExport = () => {
    if (filteredApplications.length === 0) return;

    const headers = ["Application ID", "Student ID", "Name", "Email", "Job Title", "Department", "Current Round", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredApplications.map(app => [
        app.applicationId,
        app.studentId,
        `"${app.name}"`,
        app.email,
        `"${app.jobTitle}"`,
        `"${app.department?.name}"`,
        `"${app.currentRound || 'Screening'}"`,
        app.status
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Applications_Export_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AdminPageLayout>
      <PageHeader
        title="Applications Management"
        description="Monitor student application stages and track candidate progress across drives."
        badge="Talent Pipeline"
        icon={UserCheck}
        variant="indigo"
      />

      <div className="space-y-6">
        {/* Controls Section */}
        <div className="flex flex-col xl:flex-row gap-4 items-center justify-between saas-card p-4">
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative w-full sm:w-[240px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search students or ID..."
                className="pl-9 bg-background/50 border-border rounded-xl h-10 text-sm focus-visible:ring-primary/20"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select 
              value={scheduleId?.toString() || ""} 
              onValueChange={handleScheduleChange}
            >
              <SelectTrigger className="w-full sm:w-[280px] bg-background/50 border-border rounded-xl h-10 text-sm">
                <SelectValue placeholder="Select Interview Schedule" />
              </SelectTrigger>
              <SelectContent>
                {schedules.map((s: any) => (
                  <SelectItem key={s.id} value={s.id.toString()}>
                    <div className="flex flex-col items-start py-1">
                      <span className="font-bold text-sm">{s.title || `Schedule #${s.id}`}</span>
                      <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                        {s.companyName} • {new Date(s.startTime).toLocaleDateString()}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
             <Button
                variant="outline"
                size="sm"
                onClick={handleExport}
                disabled={filteredApplications.length === 0}
                className="flex-1 sm:flex-none h-10 rounded-xl border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 text-primary font-bold text-[10px] uppercase tracking-widest gap-2"
              >
                <Download className="size-3.5" />
                Export Data
              </Button>

              {meta && (
                <div className="hidden sm:flex h-10 items-center px-4 rounded-xl bg-muted/30 border border-border text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                  Candidates: <span className="text-foreground ml-1.5">{meta.total}</span>
                </div>
              )}
          </div>
        </div>

        {loading && (
          <div className="py-32 flex justify-center">
            <Loader text="Retrieving application records..." />
          </div>
        )}

        {!loading && scheduleId && (
          <>
            <div className="hidden md:block saas-card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-center">ID</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Student Information</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Role</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Current Stage</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredApplications.map((app: any) => (
                      <tr key={app.applicationId} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-5 text-center">
                           <span className="text-[10px] font-black text-muted-foreground bg-muted px-2 py-1 rounded-md">
                             #{app.applicationId}
                           </span>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                              {app.name?.charAt(0) || "S"}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{app.name}</p>
                                <span className="text-[9px] font-black text-muted-foreground/50">ID: {app.studentId}</span>
                              </div>
                              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{app.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                              <Briefcase className="size-3.5 text-muted-foreground" />
                              {app.jobTitle}
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-medium text-muted-foreground">
                              <Building2 className="size-3" />
                              {app.department?.name}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2">
                            <Layers className="size-3.5 text-muted-foreground" />
                            <span className="text-sm font-semibold text-foreground">
                              {app.currentRound || "Initial Screening"}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-5 text-right">
                          <Badge className={cn("px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm", getStatusStyle(app.status))}>
                            {app.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:hidden">
              {filteredApplications.map((app: any) => (
                <div key={app.applicationId} className="saas-card p-6 space-y-5">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-11 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-sm border border-primary/20">
                        {app.name?.charAt(0) || "S"}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                           <h3 className="font-bold text-foreground truncate">{app.name}</h3>
                           <span className="text-[10px] font-black text-muted-foreground/40 bg-muted px-1.5 py-0.5 rounded">#{app.applicationId}</span>
                        </div>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">{app.email}</p>
                      </div>
                    </div>
                    <Badge className={cn("px-3 py-1 rounded-xl text-[8px] font-black border uppercase tracking-widest", getStatusStyle(app.status))}>
                      {app.status}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Briefcase className="size-3" /> Role
                      </p>
                      <p className="text-xs font-bold text-foreground truncate">{app.jobTitle}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Layers className="size-3" /> Stage
                      </p>
                      <p className="text-xs font-bold text-foreground truncate">{app.currentRound || "Screening"}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Building2 className="size-3" /> Dept
                      </p>
                      <p className="text-xs font-bold text-foreground truncate">{app.department?.name}</p>
                    </div>
                    <div className="space-y-1">
                      <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Hash className="size-3" /> Student ID
                      </p>
                      <p className="text-xs font-bold text-foreground truncate">{app.studentId}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination UI Integration */}
            {meta && meta.totalPages > 1 && (
              <div className="flex items-center justify-between mt-6 bg-background p-4 rounded-xl border border-border shadow-sm">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 px-4"
                >
                  Previous
                </Button>

                <div className="text-[11px] font-black text-muted-foreground uppercase tracking-widest">
                  Page <span className="text-foreground">{meta.page}</span> of <span className="text-foreground">{meta.totalPages}</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === meta.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-xl font-bold text-[10px] uppercase tracking-widest h-9 px-4"
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {!loading && !scheduleId && (
          <div className="py-32 text-center saas-card border-dashed bg-muted/10">
            <div className="size-20 bg-muted/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <Users className="size-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Active Pipeline</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              Please select or create an interview schedule to monitor recruitment applications.
            </p>
          </div>
        )}

        {!loading && scheduleId && filteredApplications.length === 0 && (
          <div className="py-32 text-center saas-card border-dashed bg-muted/10">
            <div className="size-20 bg-muted/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <Search className="size-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No matches found</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              We couldn't find any applications matching your current search parameters.
            </p>
          </div>
        )}
      </div>
    </AdminPageLayout>
  );
};

export default ApplicationsManagement;