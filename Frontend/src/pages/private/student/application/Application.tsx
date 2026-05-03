import { useEffect, useState, useMemo } from 'react';
import {
  CheckCircle2, Clock, XCircle, Briefcase,
  Search, ArrowRight, Sparkles, UserCircle,
  Rocket, TrendingUp, Calendar, Building2, 
  ChevronDown, ArrowUpRight, Filter, 
  Activity, Zap, ShieldCheck, Target,
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
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from "@/components/ui/card";

type Status = 'APPLIED' | 'SHORTLISTED' | 'TECHNICAL_ROUND' | 'HR_ROUND' | 'SELECTED' | 'REJECTED';

const STATUS_CONFIG: Record<Status, { label: string; color: string; bgColor: string; icon: any; shadow: string; accent: string }> = {
  APPLIED: { 
    label: 'Applied', 
    color: 'text-indigo-400', 
    bgColor: 'bg-indigo-500/10', 
    icon: Clock,
    shadow: 'shadow-indigo-500/20',
    accent: 'bg-indigo-500'
  },
  SHORTLISTED: { 
    label: 'Shortlisted', 
    color: 'text-purple-400', 
    bgColor: 'bg-purple-500/10', 
    icon: CheckCircle2,
    shadow: 'shadow-purple-500/20',
    accent: 'bg-purple-500'
  },
  TECHNICAL_ROUND: { 
    label: 'Technical', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/10', 
    icon: Rocket,
    shadow: 'shadow-blue-500/20',
    accent: 'bg-blue-500'
  },
  HR_ROUND: { 
    label: 'HR Round', 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-500/10', 
    icon: UserCircle,
    shadow: 'shadow-amber-500/20',
    accent: 'bg-amber-500'
  },
  SELECTED: { 
    label: 'Selected', 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/10', 
    icon: Sparkles,
    shadow: 'shadow-emerald-500/20',
    accent: 'bg-emerald-500'
  },
  REJECTED: { 
    label: 'Rejected', 
    color: 'text-rose-400', 
    bgColor: 'bg-rose-500/10', 
    icon: XCircle,
    shadow: 'shadow-rose-500/20',
    accent: 'bg-rose-500'
  },
};

const STAGES: Status[] = ['APPLIED', 'SHORTLISTED', 'TECHNICAL_ROUND', 'HR_ROUND', 'SELECTED'];

/* ─── Premium Company Icon ─── */
const CompanyIcon = ({ name, size = "md" }: { name: string, size?: "sm" | "md" | "lg" }) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const gradients = [
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-indigo-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
  ];
  const gradient = gradients[name.length % gradients.length];
  
  const sizeClasses = {
    sm: "w-10 h-10 text-base rounded-xl",
    md: "w-14 h-14 text-xl rounded-2xl",
    lg: "w-20 h-20 text-3xl rounded-[2.5rem]"
  };

  return (
    <div className={cn(
      "shrink-0 flex items-center justify-center bg-gradient-to-br text-white font-black shadow-lg border border-white/10 overflow-hidden",
      gradient,
      sizeClasses[size]
    )}>
      {firstLetter}
    </div>
  );
};

/* ─── Application Card Component ─── */
const ApplicationCard = ({
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
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.APPLIED;
  const Icon = config.icon;

  return (
    <motion.div
      layout
      className={cn(
        "group relative bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl rounded-[2rem] border border-slate-200/60 dark:border-white/[0.08] transition-all duration-500",
        isExpanded ? "ring-2 ring-indigo-500/30 shadow-2xl z-10 scale-[1.01]" : "hover:shadow-xl hover:border-indigo-500/30 hover:translate-y-[-2px]"
      )}
    >
      <div className="p-5 md:p-6">
        <div className="flex flex-col md:flex-row items-center gap-4">
          <CompanyIcon name={app.job?.company?.name || "C"} size="sm" />
          
          <div className="flex-1 min-w-0 text-center md:text-left">
            <h3 className="text-lg font-black text-slate-900 dark:text-white truncate tracking-tight">
              {app.job?.title || "Unknown Role"}
            </h3>
            <div className="flex items-center justify-center md:justify-start gap-3 mt-1">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Building2 size={12} className="text-indigo-500" />
                {app.job?.company?.name}
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-white/20" />
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1">
                <Calendar size={12} className="text-purple-500" />
                {new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className={cn(
              "px-3 py-1.5 rounded-xl border font-black uppercase tracking-widest text-[9px]",
              config.bgColor,
              config.color,
              "border-current/10"
            )}>
              {config.label}
            </div>
            
            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className={cn(
                "w-10 h-10 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 transition-all",
                isExpanded ? "bg-indigo-500 text-white rotate-180 shadow-md shadow-indigo-500/20" : "hover:bg-indigo-50 dark:hover:bg-white/10 hover:text-indigo-500"
              )}
            >
              <ChevronDown size={18} strokeWidth={3} />
            </Button>
          </div>
        </div>

        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 pt-6 border-t border-slate-100 dark:border-white/[0.05] space-y-6">
                {/* Visual Pipeline */}
                <div className="relative px-4">
                  <div className="absolute top-4 left-8 right-8 h-px bg-slate-100 dark:bg-white/5" />
                  {!isRejected && (
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `calc(${(Math.max(0, STAGES.indexOf(status)) / (STAGES.length - 1)) * 100}% - 20px)` }}
                      className="absolute top-4 left-8 h-px bg-indigo-500 z-0"
                    />
                  )}
                  
                  <div className="relative z-10 flex justify-between">
                    {STAGES.map((stage, idx) => {
                      const stageIdx = STAGES.indexOf(status);
                      const isPassed = idx < stageIdx || isSelected;
                      const isCurrent = idx === stageIdx && !isRejected;
                      const stageConfig = STATUS_CONFIG[stage];
                      const StageIcon = stageConfig.icon;

                      return (
                        <div key={stage} className="flex flex-col items-center gap-2">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center border transition-all duration-500",
                            isPassed ? "bg-indigo-500 border-indigo-500 text-white shadow-md shadow-indigo-500/20" :
                            isCurrent ? "bg-white dark:bg-[#1e1f26] border-indigo-500 text-indigo-500 scale-110 shadow-lg" :
                            "bg-white dark:bg-[#1e1f26] border-slate-100 dark:border-white/10 text-slate-300 dark:text-slate-700"
                          )}>
                            {isPassed ? <CheckCircle2 size={14} strokeWidth={3} /> : <StageIcon size={14} strokeWidth={2.5} />}
                          </div>
                          <span className={cn(
                            "text-[8px] font-black uppercase tracking-tighter text-center max-w-[60px] leading-tight",
                            isPassed || isCurrent ? "text-slate-900 dark:text-white" : "text-slate-400"
                          )}>
                            {stageConfig.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-white/[0.02] border border-slate-100 dark:border-white/[0.05]">
                    <div className="flex items-center gap-2 mb-3">
                      <Activity size={14} className="text-indigo-500" />
                      <h4 className="text-[9px] font-black text-slate-900 dark:text-white uppercase tracking-widest">Process Details</h4>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Applied</span>
                        <span className="text-slate-900 dark:text-slate-200 font-bold">{new Date(app.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-slate-500 font-medium">Last Activity</span>
                        <span className="text-slate-900 dark:text-slate-200 font-bold">{new Date(app.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {isRejected ? (
                    <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-500/5 border border-rose-100 dark:border-rose-500/10">
                       <div className="flex items-center gap-2 mb-3 text-rose-600 dark:text-rose-400">
                        <XCircle size={14} strokeWidth={3} />
                        <h4 className="text-[9px] font-black uppercase tracking-widest">Feedback</h4>
                      </div>
                      <p className="text-[11px] text-rose-800/80 dark:text-rose-200/60 leading-relaxed font-medium">
                        {app.reason || "The process for this role has been finalized. Your profile remains in our talent network."}
                      </p>
                    </div>
                  ) : isSelected ? (
                    <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-500/5 border border-emerald-100 dark:border-emerald-500/10">
                      <div className="flex items-center gap-2 mb-3 text-emerald-600 dark:text-emerald-400">
                        <Sparkles size={14} />
                        <h4 className="text-[9px] font-black uppercase tracking-widest">Decision Required</h4>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1 h-9 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-black text-[10px] uppercase tracking-widest shadow-md shadow-emerald-500/10"
                          disabled={updatingId === app.id}
                          onClick={() => onAction(app.id, "ACCEPT")}
                        >
                          Accept
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 h-9 border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10 rounded-lg font-black text-[10px] uppercase tracking-widest"
                          disabled={updatingId === app.id}
                          onClick={() => onAction(app.id, "REJECT")}
                        >
                          Decline
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 rounded-2xl bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10">
                      <div className="flex items-center gap-2 mb-3 text-indigo-600 dark:text-indigo-400">
                        <Zap size={14} />
                        <h4 className="text-[9px] font-black uppercase tracking-widest">Current Status</h4>
                      </div>
                      <p className="text-[11px] text-indigo-800/80 dark:text-indigo-100/60 leading-relaxed font-medium">
                        Your application is under review by the {app.job?.company?.name} hiring team.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

/* ─── Stat Card ─── */
const StatCard = ({ title, value, icon: Icon, color, subValue }: { title: string, value: number | string, icon: any, color: 'indigo' | 'blue' | 'purple' | 'emerald', subValue?: string }) => {
  const colorMap = {
    indigo: 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shadow-indigo-500/10',
    blue: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-blue-500/10',
    purple: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 shadow-purple-500/10',
    emerald: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-emerald-500/10',
  };

  return (
    <Card className="rounded-[2rem] border-none shadow-sm bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl hover:shadow-2xl hover:translate-y-[-4px] transition-all duration-500 group overflow-hidden border border-slate-200/50 dark:border-white/[0.05]">
      <CardContent className="p-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-[10px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em]">{title}</p>
            <h3 className="text-4xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">{value}</h3>
            {subValue && <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{subValue}</p>}
          </div>
          <div className={cn(
            "h-16 w-16 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 shadow-2xl",
            colorMap[color]
          )}>
            <Icon size={32} strokeWidth={2.5} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/* ─── Main Component ─── */
const ApplicationStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id: routeApplicationId } = useParams<{ id?: string }>();
  const { user } = useSelector((state: RootState) => state.auth);
  const { applications = [], loading } = useSelector((state: RootState) => state.student);

  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState<string>("All");
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchJobApplications({}));
  }, [dispatch]);

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
    return <Loader text="Synchronizing Application Pipeline..." fullScreen />;
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen">
      <div className="max-w-[1600px] mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        
        {/* ─── Premium Command Center Hero ─── */}
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-8 md:p-12 text-white shadow-2xl border border-white/5">
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-indigo-600/25 rounded-full blur-[120px] animate-pulse"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-blue-500/20 rounded-full blur-[120px] animate-pulse delay-700"></div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] backdrop-blur-md shadow-lg">
                <ShieldCheck className="h-4 w-4 text-emerald-400" /> 
                <span className="opacity-90">Secure Application Pipeline</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-black text-white tracking-tight leading-tight">
                {user?.firstname ? `${user.firstname}'s Hub` : "Application Hub"}
              </h1>
              <p className="text-base md:text-lg text-slate-300 font-medium max-w-xl leading-relaxed opacity-90">
                {activeApps.length > 0 
                  ? `You are currently navigating ${activeApps.length} active processes. Stay focused on your next milestones.`
                  : "Optimize your recruitment flow, track real-time status, and manage corporate offers from one central dashboard."}
              </p>
            </div>
            
            <Button
              onClick={() => navigate('/student/jobs')}
              className="bg-white text-slate-900 hover:bg-slate-100 font-black rounded-2xl shadow-2xl px-10 h-16 text-sm transition-all hover:scale-[1.05] active:scale-[0.95] flex items-center justify-center gap-3 group whitespace-nowrap"
            >
              Job Explorer <ArrowRight size={20} className="text-indigo-600 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>

        {/* ─── Streamlined Stats ─── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={Briefcase}
            color="indigo"
          />
          <StatCard
            title="Active Pipeline"
            value={stats.active}
            icon={Activity}
            color="blue"
          />
          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon={Target}
            color="purple"
          />
          <StatCard
            title="Selections"
            value={stats.selected}
            icon={ShieldCheck}
            color="emerald"
          />
        </div>

        {/* ─── Refined Controls ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-white/50 dark:bg-[#161b22]/40 p-6 rounded-[2rem] border border-slate-200/60 dark:border-white/[0.08] backdrop-blur-xl shadow-sm">
          <div className="flex items-center gap-2 p-1.5 bg-slate-200/50 dark:bg-black/40 rounded-2xl border border-slate-200/50 dark:border-white/[0.05] w-full lg:w-auto overflow-x-auto no-scrollbar">
            {["All", "Active", "Shortlisted", "Selected", "Rejected"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={cn(
                  "px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap",
                  activeFilter === filter
                    ? "bg-white dark:bg-[#1e1f26] text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200 dark:border-white/10 scale-[1.02]"
                    : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                {filter}
              </button>
            ))}
          </div>
          
          <div className="relative w-full lg:max-w-md">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Filter by company or role..."
              className="pl-14 h-14 bg-white dark:bg-black/20 border-slate-200/60 dark:border-white/[0.1] rounded-2xl text-sm font-bold focus-visible:ring-indigo-500/30 transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* ─── Compact Application Feed ─── */}
        <div className="space-y-6">
          <div className="flex items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <div className="h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
              <h2 className="text-[11px] font-black uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Live Pipeline Status</h2>
            </div>
            <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full">{filteredApplications.length} Entries Identified</span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <AnimatePresence mode="popLayout">
              {filteredApplications.length > 0 ? (
                filteredApplications.map((app: any) => (
                  <ApplicationCard
                    key={app.id}
                    app={app}
                    isExpanded={expandedId === app.id}
                    onToggle={() => setExpandedId(expandedId === app.id ? null : app.id)}
                    onAction={handleApplicationAction}
                    updatingId={updatingId}
                  />
                ))
              ) : (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-32 flex flex-col items-center text-center bg-white/30 dark:bg-white/[0.02] rounded-[3rem] border-2 border-dashed border-slate-200/60 dark:border-white/10"
                >
                  <div className="w-20 h-20 rounded-3xl bg-slate-100 dark:bg-white/5 flex items-center justify-center mb-6 text-slate-300 dark:text-slate-700">
                    <Search size={40} />
                  </div>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white">No Matching Records</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mt-3 font-medium max-w-xs leading-relaxed">
                    We couldn't find any applications matching your current criteria. Try adjusting your filters.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* ─── Premium Footer Banner ─── */}
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-white/40 dark:bg-[#161b22]/40 border border-slate-200/60 dark:border-white/[0.08] p-8 flex flex-col md:flex-row items-center gap-8 backdrop-blur-xl shadow-sm">
          <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 dark:bg-indigo-500/20 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-inner">
            <Rocket size={32} className="group-hover:translate-y-[-4px] group-hover:translate-x-[4px] transition-transform duration-500" />
          </div>
          <div className="flex-1 text-center md:text-left">
            <h4 className="text-lg font-black text-slate-900 dark:text-white uppercase tracking-wider">Operational Velocity</h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium mt-1">
              Data shows that candidates who respond within 24 hours increase their final interview success rate by <span className="text-indigo-600 dark:text-indigo-400 font-black">65%</span>. Keep your profile sharp.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => navigate('/student/profile')}
            className="rounded-2xl px-8 h-14 font-black text-xs uppercase tracking-widest border-slate-200 dark:border-white/10 hover:bg-indigo-500 hover:text-white dark:hover:bg-indigo-500/20 transition-all shadow-sm"
          >
            Enhance Profile
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;