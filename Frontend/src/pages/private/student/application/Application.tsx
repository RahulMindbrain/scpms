import { useEffect, useState, useMemo } from 'react';
import {
  CheckCircle2, Circle, Clock, XCircle, Briefcase,
  ChevronRight, Search, 
  ArrowRight, Sparkles, UserCircle,
  Rocket, TrendingUp, 
  Calendar, Building2, ChevronDown,
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplications, updateApplicationStatus } from '@/redux/thunks/studentThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import { Button } from '@/components/ui/button';
import { useNavigate, useParams } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import Loader from '@/components/Loader';
import { toast } from 'sonner';

type Status = 'APPLIED' | 'SHORTLISTED' | 'TECHNICAL_ROUND' | 'HR_ROUND' | 'SELECTED' | 'REJECTED';

const STATUS_CONFIG: Record<Status, { label: string; color: string; bgColor: string; icon: any }> = {
  APPLIED: { label: 'Applied', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', icon: Clock },
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
    color: 'text-[#c7c4d7]',
    bgColor: 'bg-[#191b22]',
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
        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500/100 shadow-[0_0_8px_rgba(59,130,246,0.5)] animate-pulse" />
        <span className="text-[#e2e2eb] font-bold text-[11px] uppercase tracking-wide">
          {currentLabel}
        </span>
      </div>
      {nextStage && STATUS_CONFIG[nextStage] && (
        <>
          <ChevronRight size={12} className="text-[#c7c4d7]" />
          <span className="text-[#908fa0] font-medium text-[11px] uppercase tracking-wide">
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
    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 border border-[rgba(255,255,255,0.08)] flex items-center justify-center text-[#908fa0] font-bold text-lg shrink-0 overflow-hidden shadow-sm">
      {firstLetter}
    </div>
  );
};

/* ─── Tabular Application Row ─── */
const ApplicationRow = ({
  app,
  isExpanded,
  onToggle,
  onAction,
  updatingId
}: {
  app: any;
  isExpanded: boolean;
  onToggle: () => void;
  onAction: (id: number, action: "ACCEPT" | "REJECT") => void;
  updatingId: number | null;
}) => {
  const status = app.status as Status;
  const isSelected = status === 'SELECTED';
  const isRejected = status === 'REJECTED';

  return (
    <div className={cn(
      "group bg-white rounded-2xl border border-[rgba(255,255,255,0.06)] transition-all duration-300 overflow-hidden",
      isExpanded ? "shadow-xl shadow-slate-200/50 border-indigo-500/20 ring-1 ring-indigo-500/10" : "hover:border-[rgba(255,255,255,0.08)] hover:shadow-md hover:shadow-slate-200/30"
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
              <h3 className="text-sm font-bold text-[#e2e2eb] truncate">{app.job?.title || "Role"}</h3>
              <span className="text-[#908fa0] font-medium text-xs hidden md:inline">•</span>
              <p className="text-[#c7c4d7] font-medium text-xs truncate hidden md:inline">{app.job?.company?.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 text-[10px] text-[#908fa0] font-medium">
                <Calendar size={12} />
                <span>{new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
              <div className="md:hidden flex items-center gap-1 text-[10px] text-[#908fa0] font-medium truncate">
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
                isExpanded && "bg-[rgba(255,255,255,0.06)] rotate-180 text-blue-600"
              )}
            >
              <ChevronDown size={16} />
            </Button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="px-4 pb-5 pt-2 border-t border-[rgba(255,255,255,0.04)] bg-[rgba(255,255,255,0.015)] animate-in slide-in-from-top-2 duration-300">
          <div className="w-full">
            {/* Left: Tracker Detail */}
            <div className="space-y-4">
              <div className="bg-[#1e1f26] p-4 rounded-xl border border-[rgba(255,255,255,0.06)] shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xs font-bold text-[#e2e2eb] uppercase tracking-wider">Application Timeline</h4>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-[#908fa0]">
                    <Clock size={12} /> LAST UPDATED: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>

                <div className="relative flex items-center justify-between px-2 py-4">
                  {/* Timeline Bar */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-[rgba(255,255,255,0.06)] -translate-y-1/2" />
                  <div
                    className="absolute top-1/2 left-0 h-0.5 bg-indigo-500/100 -translate-y-1/2 transition-all duration-1000 ease-out"
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
                          isPassed ? "bg-indigo-500/100 border-blue-500 text-white" :
                          isCurrent ? "bg-[#1e1f26] border-blue-500 text-indigo-400 scale-125 shadow-lg shadow-blue-100" :
                          "bg-[#1e1f26] border-[rgba(255,255,255,0.08)] text-[#c7c4d7]"
                        )}>
                          {isPassed ? <CheckCircle2 size={12} strokeWidth={3} /> : <Circle size={10} fill={isCurrent ? "currentColor" : "none"} />}
                        </div>
                        <span className={cn(
                          "text-[9px] font-bold uppercase tracking-tight whitespace-nowrap",
                          isPassed || isCurrent ? "text-[#e2e2eb]" : "text-[#908fa0]"
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

                {isSelected && (
                  <div className="mt-4 p-3 bg-emerald-50 rounded-lg border border-emerald-100">
                    <p className="text-xs font-bold text-emerald-900 mb-3">
                      Offer received. Choose to accept or reject.
                    </p>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white"
                        disabled={updatingId === app.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAction(app.id, "ACCEPT");
                        }}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-red-200 text-red-600 hover:bg-red-50"
                        disabled={updatingId === app.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          onAction(app.id, "REJECT");
                        }}
                      >
                        Reject
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


/* ─── Quick Stat Card ─── */
const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass }: any) => (
  <div className="bg-[#1e1f26] p-4 rounded-2xl border border-[rgba(255,255,255,0.07)] flex items-center justify-between hover:border-indigo-500/20 transition-all group">
    <div>
      <p className="text-[10px] font-bold uppercase tracking-wider text-[#908fa0] mb-1">{title}</p>
      <p className="text-2xl font-black text-[#e2e2eb] tabular-nums">{value}</p>
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
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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

  const handleApplicationAction = async (id: number, action: "ACCEPT" | "REJECT") => {
    const loadingText = action === "ACCEPT" ? "Accepting offer..." : "Rejecting offer...";
    const successText = action === "ACCEPT" ? "Offer accepted successfully" : "Offer rejected successfully";
    const toastId = toast.loading(loadingText);

    try {
      setUpdatingId(id);
      await dispatch(updateApplicationStatus({ id, action })).unwrap();
      await dispatch(fetchJobApplications({})).unwrap();
      toast.success(successText, { id: toastId });
    } catch (err: any) {
      toast.error(err?.message || "Failed to update application status", { id: toastId });
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading && applications.length === 0) {
    return <Loader text="Syncing your application journey..." fullScreen />;
  }

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-6xl mx-auto space-y-6 sm:space-y-8 animate-in fade-in duration-700">
      {/* ─── Header ─── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-[10px] font-bold uppercase tracking-wider mb-2">
            <Sparkles size={12} /> My Career Dashboard
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#e2e2eb] tracking-tight">Applications Tracking</h1>
          <p className="text-[#908fa0] text-sm font-medium mt-1">Manage and track your recruitment journey in real-time.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            onClick={() => navigate('/student/jobs')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-lg shadow-indigo-500/20 px-6"
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
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-xl shadow-indigo-500/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded bg-white/20 text-[10px] font-bold uppercase tracking-wider">Latest Update</span>
                <span className="text-white/60 text-[10px] font-medium">• Last updated {new Date(latestApp.updatedAt).toLocaleDateString()}</span>
              </div>
              <h2 className="text-xl font-bold">Your profile is currently under review for {latestApp.job?.title}</h2>
              <p className="text-indigo-200 text-sm font-medium">Hiring team at {latestApp.job?.company?.name} is evaluating your profile for the next stage.</p>
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
                className="bg-white text-indigo-400 hover:bg-indigo-500/10 rounded-xl font-bold shadow-lg"
                onClick={() => setExpandedId(latestApp.id)}
              >
                Track Journey
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── Filters & Search ─── */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 py-2 border-b border-[rgba(255,255,255,0.07)]">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {["All", "Active", "Shortlisted", "Selected", "Rejected"].map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={cn(
                "px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap",
                activeFilter === filter
                  ? "bg-slate-900 text-white shadow-lg"
                  : "bg-white text-[#908fa0] hover:bg-[#191b22] border border-[rgba(255,255,255,0.07)]"
              )}
            >
              {filter}
            </button>
          ))}
        </div>
        <div className="relative w-full lg:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#908fa0]" size={16} />
          <Input
            placeholder="Search company or role..."
            className="pl-10 h-10 bg-[#1e1f26] border-[rgba(255,255,255,0.06)] rounded-xl text-sm focus-visible:ring-indigo-500/100 shadow-sm"
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
                isExpanded={expandedId === app.id}
                onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
                onAction={handleApplicationAction}
                updatingId={updatingId}
              />
            ))}
          </div>
        ) : (
          <div className="py-20 flex flex-col items-center text-center">
            <div className="w-20 h-20 bg-[#191b22] rounded-3xl flex items-center justify-center text-[#c7c4d7] mb-4 border border-[rgba(255,255,255,0.07)]">
              <Search size={40} />
            </div>
            <h3 className="text-lg font-bold text-[#e2e2eb]">No applications found</h3>
            <p className="text-[#908fa0] text-sm max-w-xs mt-1">We couldn't find any applications matching your current filters or search term.</p>
            <Button
              variant="link"
              className="text-indigo-400 font-bold mt-4"
              onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
            >
              Reset all filters
            </Button>
          </div>
        )}
      </div>

      {/* ─── Footer completion tip ─── */}
      <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-2xl flex items-start sm:items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center text-amber-400 shrink-0">
          <Sparkles size={20} />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-bold text-amber-300">Career Pro-Tip</h4>
          <p className="text-xs text-amber-400/80">Candidates with completed project portfolios and verified skills are 4.5x more likely to clear technical rounds.</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-[#1e1f26] border-amber-200 text-amber-700 hover:bg-amber-50 rounded-xl font-bold hidden sm:flex"
          onClick={() => navigate('/student/profile')}
        >
          Update Portfolio
        </Button>
      </div>
    </div>
  );
};

export default ApplicationStatus;