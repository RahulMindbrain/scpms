import React, { useEffect, useState, useMemo } from 'react';
import {
  CheckCircle2, Circle, Clock, XCircle, Briefcase,
  ChevronRight, Search, FileText, BarChart3,
  ArrowRight, Sparkles, UserCircle,
  Rocket, TrendingUp, Loader2,
  Calendar, Building2, ChevronDown,
  MapPin, DollarSign
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplications, updateApplicationStatus } from '@/redux/thunks/studentThunk';
import { toast } from 'sonner';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type Status = 'APPLIED' | 'SHORTLISTED' | 'TECHNICAL_ROUND' | 'HR_ROUND' | 'SELECTED' | 'REJECTED';

const STATUS_CONFIG: Record<Status, { label: string; color: string; bgColor: string; icon: any }> = {
  APPLIED: { label: 'Applied', color: 'text-blue-600', bgColor: 'bg-blue-50', icon: Clock },
  SHORTLISTED: { label: 'Shortlisted', color: 'text-purple-600', bgColor: 'bg-purple-50', icon: CheckCircle2 },
  TECHNICAL_ROUND: { label: 'Technical', color: 'text-orange-600', bgColor: 'bg-orange-50', icon: Rocket },
  HR_ROUND: { label: 'HR Round', color: 'text-yellow-600', bgColor: 'bg-yellow-50', icon: UserCircle },
  SELECTED: { label: 'Selected', color: 'text-emerald-600', bgColor: 'bg-emerald-50', icon: Sparkles },
  REJECTED: { label: 'Rejected', color: 'text-red-600', bgColor: 'bg-red-50', icon: XCircle },
};

const STAGES: Status[] = ['APPLIED', 'SHORTLISTED', 'TECHNICAL_ROUND', 'HR_ROUND', 'SELECTED'];

/* ─── Compact Status Badge ─── */
const StatusBadge = ({ status }: { status: Status }) => {
  const config = (status && STATUS_CONFIG[status]) || {
    label: status || 'Unknown',
    color: 'text-slate-600',
    bgColor: 'bg-slate-50',
    icon: Clock
  };
  const Icon = config.icon || Clock;
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[11px] font-bold tracking-tight whitespace-nowrap", config.bgColor, config.color, "border-current/10")}>
      <Icon size={12} strokeWidth={2.5} />
      {config.label}
    </div>
  );
};

/* ─── Compact Step Indicator ─── */
const StepIndicator = ({ currentStatus }: { currentStatus: Status }) => {
  if (!currentStatus) return null;
  
  if (currentStatus === 'REJECTED') {
    return (
      <div className="flex items-center gap-1.5 text-red-500 text-[11px] font-bold uppercase tracking-wider">
        <XCircle size={14} /> Application Closed
      </div>
    );
  }

  const currentIndex = STAGES.indexOf(currentStatus);
  const nextStage = currentIndex !== -1 ? STAGES[currentIndex + 1] : null;

  const currentLabel = (STATUS_CONFIG[currentStatus] && STATUS_CONFIG[currentStatus].label) || currentStatus;

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="w-2.5 h-2.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
        <span className="text-slate-900 font-bold text-[11px] uppercase tracking-wide">
          {currentLabel}
        </span>
      </div>
      {nextStage && STATUS_CONFIG[nextStage] && (
        <>
          <ChevronRight size={12} className="text-slate-300" />
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wide">
            Next: {STATUS_CONFIG[nextStage].label}
          </span>
        </>
      )}
    </div>
  );
};

/* ─── Company Avatar ─── */
const CompanyAvatar = ({ name }: { name: string }) => {
  const firstLetter = name.charAt(0).toUpperCase();
  return (
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 flex items-center justify-center text-slate-500 font-bold text-lg shrink-0 overflow-hidden shadow-sm">
      {firstLetter}
    </div>
  );
};

/* ─── Tabular Application Row ─── */
const ApplicationRow = ({
  app,
  onUpdate,
  isExpanded,
  onToggle
}: {
  app: any;
  onUpdate: () => void;
  isExpanded: boolean;
  onToggle: () => void;
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [updating, setUpdating] = useState<"ACCEPT" | "REJECT" | null>(null);

  const handleAction = async (action: "ACCEPT" | "REJECT") => {
    setUpdating(action);
    try {
      await dispatch(updateApplicationStatus({ id: app.id, action })).unwrap();
      toast.success(`Application ${action.toLowerCase()}ed successfully`);
      onUpdate();
    } catch (error: any) {
      toast.error(error || `Failed to ${action.toLowerCase()} application`);
    } finally {
      setUpdating(null);
    }
  };

  const status = app.status as Status;
  const isSelected = status === 'SELECTED';
  const isRejected = status === 'REJECTED';

  return (
    <div className={cn(
      "group bg-white rounded-2xl border border-slate-100 transition-all duration-300 overflow-hidden",
      isExpanded ? "shadow-xl shadow-slate-200/50 border-blue-100 ring-1 ring-blue-50" : "hover:border-slate-200 hover:shadow-md hover:shadow-slate-200/30"
    )}>
      {/* Table Row Content */}
      <div
        className="flex flex-col sm:flex-row items-start sm:items-center p-4 gap-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <CompanyAvatar name={app.job?.company?.name || "C"} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="text-sm font-bold text-slate-900 truncate">{app.job?.title || "Role"}</h3>
              <span className="text-slate-400 font-medium text-xs hidden md:inline">•</span>
              <p className="text-slate-600 font-medium text-xs truncate hidden md:inline">{app.job?.company?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] text-slate-400 font-medium">
                <Calendar size={12} />
                <span>{new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="md:hidden flex items-center gap-1 text-[10px] text-slate-400 font-medium truncate">
                <Building2 size={12} />
                <span className="truncate">{app.job?.company?.name}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-start gap-4 sm:gap-8">
          <div className="flex-1 sm:flex-none">
            <StatusBadge status={status} />
          </div>
          <div className="hidden lg:block min-w-[180px]">
            <StepIndicator currentStatus={status} />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className={cn(
                "h-8 w-8 p-0 rounded-lg transition-transform",
                isExpanded && "bg-slate-100 rotate-180 text-blue-600"
              )}
            >
              <ChevronDown size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-5 pt-2 border-t border-slate-50 bg-slate-50/30 animate-in slide-in-from-top-2 duration-300">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left: Tracker Detail */}
            <div className="md:col-span-2 space-y-4">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Application Timeline</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400">
                    <Clock size={12} /> LAST UPDATED: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="relative flex items-center justify-between px-2 py-4">
                  {/* Timeline Bar */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-slate-100 -translate-y-1/2" />
                  <div
                    className="absolute top-1/2 left-0 h-0.5 bg-blue-500 -translate-y-1/2 transition-all duration-1000 ease-out"
                    style={{ width: `${(Math.max(0, STAGES.indexOf(status)) / (STAGES.length - 1)) * 100}%` }}
                  />

                  {STAGES.map((stage, idx) => {
                    const stageIdx = STAGES.indexOf(status);
                    const isPassed = idx < stageIdx || isSelected;
                    const isCurrent = idx === stageIdx && !isRejected;

                    return (
                      <div key={stage} className="relative z-10 flex flex-col items-center gap-2">
                        <div className={cn(
                          "w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all duration-500",
                          isPassed ? "bg-blue-500 border-blue-500 text-white" :
                          isCurrent ? "bg-white border-blue-500 text-blue-500 scale-125 shadow-lg shadow-blue-100" :
                          "bg-white border-slate-200 text-slate-300"
                        )}>
                          {isPassed ? <CheckCircle2 size={12} strokeWidth={3} /> : <Circle size={10} fill={isCurrent ? "currentColor" : "none"} />}
                        </div>
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-tight whitespace-nowrap",
                          isPassed || isCurrent ? "text-slate-900" : "text-slate-400"
                        )}>
                          {STATUS_CONFIG[stage]?.label || stage}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {isRejected && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-3">
                    <XCircle size={16} className="text-red-500 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-xs font-bold text-red-900">Application Status: Rejected</p>
                      <p className="text-[11px] text-red-700/80 mt-0.5 leading-relaxed">
                        {app.reason || "We appreciate your interest. Unfortunately, the team has decided not to proceed with your application at this time."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Quick Stats/Actions */}
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Job Details</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                      <MapPin size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight">Location</p>
                      <p className="text-xs font-bold text-slate-700">{app.job?.location || "Remote / On-site"}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-50 flex items-center justify-center text-slate-500">
                      <DollarSign size={14} />
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-medium leading-tight">CTC Package</p>
                      <p className="text-xs font-bold text-slate-700">{app.job?.ctc || "As per industry"}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-5 flex flex-col gap-2">
                  {isSelected ? (
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleAction('REJECT'); }}
                        disabled={!!updating}
                        className="flex-1 bg-white hover:bg-red-50 text-red-600 border-red-100 rounded-xl h-9 text-xs font-bold transition-all"
                      >
                        {updating === 'REJECT' ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : "Decline"}
                      </Button>
                      <Button
                        size="sm"
                        onClick={(e) => { e.stopPropagation(); handleAction('ACCEPT'); }}
                        disabled={!!updating}
                        className="flex-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl h-9 text-xs font-bold shadow-sm shadow-emerald-100 px-6 transition-all"
                      >
                        {updating === 'ACCEPT' ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : "Accept Offer"}
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      className="w-full rounded-xl h-9 text-xs font-bold border-slate-200 text-slate-600 hover:bg-slate-50 hover:text-blue-600 hover:border-blue-200 transition-all group"
                      onClick={(e) => { e.stopPropagation(); }}
                    >
                      View Full Details <ArrowRight size={12} className="ml-2 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

/* ─── Skeleton Loader ─── */
const ApplicationSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-white rounded-2xl border border-slate-100 p-4 h-18 animate-pulse">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-slate-100 rounded-xl" />
          <div className="flex-1 space-y-2">
            <div className="h-4 w-32 bg-slate-100 rounded" />
            <div className="h-3 w-48 bg-slate-50 rounded" />
          </div>
          <div className="h-8 w-24 bg-slate-50 rounded-full" />
          <div className="h-8 w-8 bg-slate-50 rounded-lg" />
        </div>
      </div>
    ))}
  </div>
);

/* ─── Quick Stat Card ─── */
const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }: any) => (
  <div className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between hover:shadow-md transition-all group">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">{title}</p>
      <p className="text-2xl font-black text-slate-900 tabular-nums">{value}</p>
    </div>
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110", bgColorClass, colorClass)}>
      <Icon size={24} />
    </div>
  </div>
);

/* ─── Main Application Component ─── */
const ApplicationStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id: routeApplicationId } = useParams<{ id?: string }>();
  const { applications = [], loading } = useSelector((state: RootState) => state.student);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchJobApplications({}));
  }, [dispatch]);

  // Set initial expanded ID from URL if provided
  useEffect(() => {
    if (routeApplicationId && applications.length > 0) {
      setExpandedId(Number(routeApplicationId));
    }
  }, [routeApplicationId, applications]);

  const filteredApplications = useMemo(() => {
    return applications.filter((app: any) => {
      const matchesSearch =
        app.job?.company?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.job?.title?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      if (activeFilter === "All") return true;
      if (activeFilter === "Active") return !['SELECTED', 'REJECTED'].includes(app.status);
      if (activeFilter === "Shortlisted") return app.status === 'SHORTLISTED';
      if (activeFilter === "Rejected") return app.status === 'REJECTED';
      if (activeFilter === "Selected") return app.status === 'SELECTED';

      return true;
    });
  }, [applications, searchQuery, activeFilter]);

  const stats = useMemo(() => {
    const total = applications.length;
    const active = applications.filter((a: any) => !['SELECTED', 'REJECTED'].includes(a.status)).length;
    const shortlisted = applications.filter((a: any) => a.status === 'SHORTLISTED').length;
    const selected = applications.filter((a: any) => a.status === 'SELECTED').length;

    return { total, active, shortlisted, selected };
  }, [applications]);

  const activeApps = applications.filter((a: any) => !['SELECTED', 'REJECTED'].includes(a.status));
  const latestApp = activeApps.length > 0 ? activeApps[0] : null;

  if (loading && applications.length === 0) {
    return (
      <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
        <div className="flex flex-col gap-2">
          <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-4 w-64 bg-slate-100 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 bg-white rounded-2xl border border-slate-100 animate-pulse" />)}
        </div>
        <ApplicationSkeleton />
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} /> My Career Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">Applications Tracking</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">Manage and track your recruitment journey in real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/student/jobs')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-blue-500/20 px-6"
          >
            Find More Jobs <ArrowRight size={16} className="ml-2" />
          </Button>
        </div>
      </div>

      {/* ─── Stats Grid ─── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Applications"
          value={stats.total}
          icon={Briefcase}
          colorClass="text-blue-600"
          bgColorClass="bg-blue-50"
        />
        <StatCard
          title="Active Pipeline"
          value={stats.active}
          icon={TrendingUp}
          colorClass="text-indigo-600"
          bgColorClass="bg-indigo-50"
        />
        <StatCard
          title="Shortlisted"
          value={stats.shortlisted}
          icon={CheckCircle2}
          colorClass="text-purple-600"
          bgColorClass="bg-purple-50"
        />
        <StatCard
          title="Offers Received"
          value={stats.selected}
          icon={Sparkles}
          colorClass="text-emerald-600"
          bgColorClass="bg-emerald-50"
        />
      </div>

      {/* ─── Smart Status Section ─── */}
      {latestApp && (
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-blue-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold uppercase tracking-wider">Latest Update</span>
                <span className="text-white/60 text-[10px] font-medium">• Last updated {new Date(latestApp.updatedAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-bold">Your profile is currently under review for {latestApp.job?.title}</h2>
              <p className="text-blue-100 text-sm font-medium">Hiring team at {latestApp.job?.company?.name} is evaluating your profile for the next stage.</p>
            </div>
            <div className="flex flex-wrap items-center gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-xl p-3 border border-white/20">
                <p className="text-[10px] font-bold uppercase tracking-wider text-white/60 mb-1 leading-none">Current Status</p>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="font-bold text-sm">{STATUS_CONFIG[latestApp.status as Status]?.label || latestApp.status}</span>
                </div>
              </div>
              <Button
                variant="secondary"
                className="bg-white text-blue-600 hover:bg-blue-50 rounded-xl font-bold shadow-lg"
                onClick={() => setExpandedId(latestApp.id)}
              >
                Track Journey
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Filters & Search ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2 border-b border-slate-100">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {["All", "Active", "Shortlisted", "Selected", "Rejected"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                activeFilter === filter
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-slate-500 hover:bg-slate-50 border border-slate-100"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <Input
            placeholder="Search company or role..."
            className="pl-10 h-10 bg-white border-slate-100 rounded-xl text-sm focus-visible:ring-blue-500 shadow-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* ─── Applications Results ─── */}
      <div className="space-y-4">
        {filteredApplications.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredApplications.map((app: any) => (
              <ApplicationRow
                key={app.id}
                app={app}
                onUpdate={() => dispatch(fetchJobApplications({}))}
                isExpanded={expandedId === app.id}
                onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center text-slate-200 mb-4 border border-slate-100">
              <Search size={40} />
            </div>
            <h3 className="text-lg font-bold text-slate-900">No applications found</h3>
            <p className="text-slate-400 text-sm max-w-xs mt-1">We couldn't find any applications matching your current filters or search term.</p>
            <Button
              variant="link"
              className="text-blue-600 font-bold mt-4"
              onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
            >
              Reset all filters
            </Button>
          </div>
        )}
      </div>

      {/* ─── Footer completion tip ─── */}
      <div className="bg-amber-50 border border-amber-100 p-4 rounded-2xl flex items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-amber-900">Career Pro-Tip</h4>
          <p className="text-xs text-amber-700/80">Candidates with completed project portfolios and verified skills are 4.5x more likely to clear technical rounds.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-white border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl font-bold hidden sm:flex"
          onClick={() => navigate('/student/profile')}
        >
          Update Portfolio
        </Button>
      </div>
    </div>
  );
};

export default ApplicationStatus;