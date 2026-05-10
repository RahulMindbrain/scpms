import React, { useState, useEffect } from 'react';
import { Search, Building2, Briefcase, Users, UserCheck, ListChecks, PieChart, CheckCircle2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchScheduleApplications, fetchSchedules } from '@/redux/thunks/interviewThunk';
import { fetchCompanies } from '@/redux/thunks/companyThunk';
import type { RootState, AppDispatch } from '@/redux/store/store';
import { useParams } from "react-router-dom";
import Loader from '@/components/Loader';
import { AdminPageLayout } from '@/components/layout/AdminPageLayout';
import { PageHeader } from '@/components/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const ApplicationsManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { companies } = useSelector((state: RootState) => state.company);
  const { applications = [], schedules = [], loading } = useSelector((state: RootState) => state.interview);
  const { id } = useParams<{ id?: string }>();
  const routeScheduleId = id ? Number(id) : null;

  // Use route ID as primary, then first available schedule, or stay null
  const scheduleId = routeScheduleId && Number.isFinite(routeScheduleId)
    ? routeScheduleId
    : (schedules[0]?.id ? Number(schedules[0].id) : null);

  const activeSchedule = schedules.find(s => s.id === scheduleId);

  useEffect(() => {
    dispatch(fetchCompanies({ page: 1, limit: 100 }));
    dispatch(fetchSchedules());
  }, [dispatch]);

  useEffect(() => {
    if (scheduleId && Number.isFinite(scheduleId)) {
      dispatch(fetchScheduleApplications(scheduleId));
    }
  }, [dispatch, scheduleId]);

  const applicationList = Array.isArray(applications)
    ? applications
    : (applications && typeof applications === 'object' && 'data' in applications && Array.isArray((applications as any).data))
      ? (applications as any).data
      : [];

  const filteredApplications = applicationList.filter((app: any) =>
    app.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.department?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: filteredApplications.length,
    shortlisted: filteredApplications.filter((app: any) => app.status === 'SHORTLISTED').length,
    selected: filteredApplications.filter((app: any) => app.status === 'SELECTED').length,
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'APPLIED': return 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20';
      case 'SELECTED': return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
      case 'SHORTLISTED': return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      case 'REJECTED': return 'bg-rose-500/10 text-rose-600 border-rose-500/20';
      case 'PENDING': return 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      default: return 'bg-muted/30 text-muted-foreground border-border';
    }
  };

  return (
    <AdminPageLayout>
      <PageHeader
        title="Recruitment Tracking"
        description={activeSchedule ? `Monitoring ${activeSchedule.title} for ${activeSchedule.company?.name || 'Corporate Partner'}` : "Monitor student application stages and track candidate progress across drives."}
        badge="Talent Pipeline"
        icon={UserCheck}
        variant="indigo"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {schedules.length > 0 && (
            <div className="w-full sm:w-[200px]">
              <Select
                value={scheduleId?.toString()}
                onValueChange={(val) => navigate(`/admin/applications/${val}`)}
              >
                <SelectTrigger className="h-10 rounded-xl bg-background/50 border-border text-xs font-black uppercase tracking-widest px-4">
                  <SelectValue placeholder="Select Drive" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {schedules.map((s) => (
                    <SelectItem key={s.id} value={s.id.toString()}>
                      {s.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by student or role..."
              className="pl-9 bg-background/50 border-border rounded-xl h-10 text-sm focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>

      <div className="space-y-6">
        {loading && (
          <div className="py-32 flex justify-center">
            <Loader text="Retrieving application records..." />
          </div>
        )}

        {!loading && scheduleId && (
          <>
            {/* Subheading 1: Statistics Overview */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600 border border-indigo-500/20">
                  <PieChart size={16} />
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground">Pipeline Overview</h2>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="saas-card p-5 bg-background/50 border-border/50 group hover:border-primary/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Total Applicants</p>
                      <p className="text-2xl font-black text-foreground group-hover:text-primary transition-colors">{stats.total}</p>
                    </div>
                    <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                      <Users size={20} />
                    </div>
                  </div>
                </div>
                <div className="saas-card p-5 bg-background/50 border-border/50 group hover:border-emerald-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Shortlisted</p>
                      <p className="text-2xl font-black text-emerald-600">{stats.shortlisted}</p>
                    </div>
                    <div className="size-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-600 border border-emerald-500/20">
                      <ListChecks size={20} />
                    </div>
                  </div>
                </div>
                <div className="saas-card p-5 bg-background/50 border-border/50 group hover:border-blue-500/30 transition-all">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Final Selections</p>
                      <p className="text-2xl font-black text-blue-600">{stats.selected}</p>
                    </div>
                    <div className="size-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 border border-blue-500/20">
                      <CheckCircle2 size={20} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Subheading 2: Records Table */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                  <Briefcase size={16} />
                </div>
                <h2 className="text-xs font-black uppercase tracking-widest text-foreground">Candidate Records</h2>
              </div>

              <div className="hidden md:block saas-card p-0 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-muted/30 border-b border-border">
                      <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Student Information</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Target Role</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest">Department</th>
                      <th className="px-6 py-5 text-[10px] font-black text-muted-foreground uppercase tracking-widest text-right">Stage Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {filteredApplications.map((app: any) => (
                      <tr key={app.applicationId} className="hover:bg-muted/20 transition-colors group">
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-4">
                            <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary font-bold text-xs border border-primary/20">
                              {app.name?.charAt(0) || '?'}
                            </div>
                            <div>
                              <p className="font-bold text-foreground group-hover:text-primary transition-colors tracking-tight">{app.name || 'Anonymous Student'}</p>
                              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-widest">{app.email || 'No Email Provided'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
                            <Briefcase className="size-3.5 text-muted-foreground" />
                            {app.jobTitle}
                          </div>
                        </td>
                        <td className="px-6 py-5">
                          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Building2 className="size-3.5" />
                            {app.department?.name}
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
                        {app.name?.charAt(0) || '?'}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-foreground truncate">{app.name || 'Anonymous Student'}</h3>
                        <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest truncate">{app.email || 'No Email'}</p>
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
                        <Building2 className="size-3" /> Dept
                      </p>
                      <p className="text-xs font-bold text-foreground truncate">{app.department?.name}</p>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
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