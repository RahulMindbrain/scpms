import { useEffect, useState, useMemo } from 'react';
import {
  CheckCircle2, Circle, Clock, XCircle, Briefcase,
  ChevronRight, Search, 
  ArrowRight, Sparkles, UserCircle,
  Rocket, TrendingUp, 
  Calendar, Building2, ChevronDown,
  ArrowUpRight,
  Filter,
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

type Status = 'APPLIED' | 'SHORTLISTED' | 'TECHNICAL_ROUND' | 'HR_ROUND' | 'SELECTED' | 'REJECTED';

const STATUS_CONFIG: Record<Status, { label: string; color: string; bgColor: string; icon: any; shadow: string }> = {
  APPLIED: { 
    label: 'Applied', 
    color: 'text-indigo-400', 
    bgColor: 'bg-indigo-500/10', 
    icon: Clock,
    shadow: 'shadow-indigo-500/20'
  },
  SHORTLISTED: { 
    label: 'Shortlisted', 
    color: 'text-purple-400', 
    bgColor: 'bg-purple-500/10', 
    icon: CheckCircle2,
    shadow: 'shadow-purple-500/20'
  },
  TECHNICAL_ROUND: { 
    label: 'Technical', 
    color: 'text-blue-400', 
    bgColor: 'bg-blue-500/10', 
    icon: Rocket,
    shadow: 'shadow-blue-500/20'
  },
  HR_ROUND: { 
    label: 'HR Round', 
    color: 'text-amber-400', 
    bgColor: 'bg-amber-500/10', 
    icon: UserCircle,
    shadow: 'shadow-amber-500/20'
  },
  SELECTED: { 
    label: 'Selected', 
    color: 'text-emerald-400', 
    bgColor: 'bg-emerald-500/10', 
    icon: Sparkles,
    shadow: 'shadow-emerald-500/20'
  },
  REJECTED: { 
    label: 'Rejected', 
    color: 'text-rose-400', 
    bgColor: 'bg-rose-500/10', 
    icon: XCircle,
    shadow: 'shadow-rose-500/20'
  },
};

const STAGES: Status[] = ['APPLIED', 'SHORTLISTED', 'TECHNICAL_ROUND', 'HR_ROUND', 'SELECTED'];

/* ─── Compact Status Badge ─── */
const StatusBadge = ({ status }: { status: Status }) => {
  const config = (status && STATUS_CONFIG[status]) || {
    label: status || 'Unknown',
    color: 'text-slate-400',
    bgColor: 'bg-slate-500/10',
    icon: Clock,
    shadow: ''
  };
  const Icon = config.icon || Clock;
  return (
    <div className={cn(
      "inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider whitespace-nowrap transition-all", 
      config.bgColor, 
      config.color, 
      "border-current/10 shadow-sm",
      config.shadow
    )}>
      <Icon size={12} strokeWidth={3} />
      {config.label}
    </div>
  );
};

/* ─── Company Avatar ─── */
const CompanyAvatar = ({ name }: { name: string }) => {
  const firstLetter = name.charAt(0).toUpperCase();
  const gradients = [
    'from-indigo-500 to-blue-600',
    'from-purple-500 to-indigo-600',
    'from-blue-500 to-cyan-600',
    'from-emerald-500 to-teal-600',
  ];
  const gradient = gradients[name.length % gradients.length];
  
  return (
    <div className={cn(
      "w-12 h-12 rounded-2xl bg-gradient-to-br flex items-center justify-center text-white font-black text-xl shrink-0 overflow-hidden shadow-lg border border-white/10",
      gradient
    )}>
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
    <motion.div 
      layout
      className={cn(
        "group relative bg-white dark:bg-[#1e1f26] rounded-[2rem] border border-slate-200 dark:border-white/[0.05] transition-all duration-300 overflow-hidden",
        isExpanded ? "shadow-2xl shadow-indigo-500/10 border-indigo-500/30 ring-1 ring-indigo-500/10 z-10" : "hover:border-indigo-500/20 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-indigo-500/5 hover:translate-y-[-2px]"
      )}
    >
      {/* Table Row Content */}
      <div
        className="flex flex-col sm:flex-row items-center p-5 md:p-6 gap-4 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-5 flex-1 min-w-0 w-full">
          <CompanyAvatar name={app.job?.company?.name || "C"} />
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-200 truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                {app.job?.title || "Role"}
              </h3>
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-black uppercase tracking-widest">
                <Building2 size={12} className="text-indigo-500" />
                <span>{app.job?.company?.name}</span>
              </div>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 font-black uppercase tracking-widest">
                <Calendar size={12} className="text-purple-500" />
                <span>{new Date(app.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full sm:w-auto flex items-center justify-between sm:justify-end gap-6 sm:gap-10">
          <div className="flex-1 sm:flex-none">
            <StatusBadge status={status} />
          </div>
          
          <div className="flex items-center gap-3">
            <div className={cn(
              "p-2 rounded-xl bg-slate-100 dark:bg-white/5 text-slate-400 transition-all",
              isExpanded && "bg-indigo-500/10 text-indigo-500 rotate-180"
            )}>
              <ChevronDown size={18} strokeWidth={3} />
            </div>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <div className="px-6 pb-8 pt-2 border-t border-slate-100 dark:border-white/[0.05] bg-slate-50/50 dark:bg-white/[0.02]">
              <div className="space-y-6 pt-4">
                {/* Timeline Section */}
                <div className="bg-white dark:bg-[#1e1f26]/50 p-6 rounded-3xl border border-slate-100 dark:border-white/[0.05] shadow-sm">
                  <div className="flex items-center justify-between mb-8">
                    <h4 className="text-[11px] font-black text-slate-900 dark:text-white uppercase tracking-[0.2em]">Application Journey</h4>
                    <div className="flex items-center gap-2 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      <Clock size={12} className="text-indigo-500" /> 
                      Last Updated: {new Date(app.updatedAt).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="relative flex items-center justify-between px-4 py-6">
                    {/* Timeline Bar Background */}
                    <div className="absolute top-[2.1rem] left-8 right-8 h-1 bg-slate-100 dark:bg-white/5 rounded-full" />
                    
                    {/* Progress Bar */}
                    {!isRejected && (
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(Math.max(0, STAGES.indexOf(status)) / (STAGES.length - 1)) * 100}%` }}
                        className="absolute top-[2.1rem] left-8 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full z-0 transition-all duration-1000 ease-out"
                        style={{ maxWidth: 'calc(100% - 4rem)' }}
                      />
                    )}

                    {STAGES.map((stage, idx) => {
                      const stageIdx = STAGES.indexOf(status);
                      const isPassed = idx < stageIdx || isSelected;
                      const isCurrent = idx === stageIdx && !isRejected;
                      const config = STATUS_CONFIG[stage];

                      return (
                        <div key={stage} className="relative z-10 flex flex-col items-center gap-4">
                          <div className={cn(
                            "w-10 h-10 rounded-2xl flex items-center justify-center border-2 transition-all duration-500 shadow-sm",
                            isPassed ? "bg-indigo-500 border-indigo-500 text-white shadow-indigo-500/20" :
                            isCurrent ? "bg-white dark:bg-[#1e1f26] border-indigo-500 text-indigo-500 scale-110 shadow-lg shadow-indigo-500/10 ring-4 ring-indigo-500/5" :
                            "bg-white dark:bg-[#1e1f26] border-slate-100 dark:border-white/10 text-slate-300 dark:text-slate-700"
                          )}>
                            {isPassed ? <CheckCircle2 size={18} strokeWidth={3} /> : <config.icon size={18} strokeWidth={2.5} />}
                          </div>
                          <span className={cn(
                            "text-[10px] font-black uppercase tracking-wider whitespace-nowrap",
                            isPassed || isCurrent ? "text-slate-900 dark:text-slate-200" : "text-slate-400"
                          )}>
                            {config.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Contextual Feedback */}
                  <AnimatePresence mode="wait">
                    {isRejected && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-5 bg-rose-50 dark:bg-rose-500/5 rounded-[1.5rem] border border-rose-100 dark:border-rose-500/10 flex items-start gap-4"
                      >
                        <div className="w-10 h-10 rounded-xl bg-rose-500/10 flex items-center justify-center text-rose-500 shrink-0">
                          <XCircle size={20} strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-xs font-black text-rose-900 dark:text-rose-300 uppercase tracking-wider">Status: Not Selected</p>
                          <p className="text-sm text-rose-800/70 dark:text-rose-200/60 mt-1 leading-relaxed font-medium">
                            {app.reason || "We appreciate your interest. Unfortunately, the team has decided not to proceed with your application at this time. Keep applying to other roles!"}
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {isSelected && (
                      <motion.div 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-8 p-6 bg-emerald-50 dark:bg-emerald-500/5 rounded-[1.5rem] border border-emerald-100 dark:border-emerald-500/10"
                      >
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                          <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0">
                              <Sparkles size={24} />
                            </div>
                            <div>
                              <h4 className="text-base font-bold text-emerald-900 dark:text-emerald-300">Congratulations!</h4>
                              <p className="text-sm text-emerald-800/70 dark:text-emerald-200/60 font-medium">You have received an official offer from {app.job?.company?.name}.</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Button
                              size="lg"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-black px-8 shadow-lg shadow-emerald-500/20 h-12"
                              disabled={updatingId === app.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAction(app.id, "ACCEPT");
                              }}
                            >
                              Accept Offer
                            </Button>
                            <Button
                              size="lg"
                              variant="outline"
                              className="border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-500/20 dark:text-rose-400 dark:hover:bg-rose-500/10 rounded-xl font-black h-12"
                              disabled={updatingId === app.id}
                              onClick={(e) => {
                                e.stopPropagation();
                                onAction(app.id, "REJECT");
                              }}
                            >
                              Decline
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ─── Quick Stat Card ─── */
const StatCard = ({ title, value, icon: Icon, colorClass, bgColorClass, shadowClass }: any) => (
  <div className="group relative bg-white dark:bg-[#1e1f26] border border-slate-200 dark:border-white/[0.05] rounded-[2rem] p-6 transition-all duration-300 hover:shadow-xl dark:hover:bg-[#25262e] shadow-sm overflow-hidden">
    <div className="relative z-10 flex items-start justify-between">
      <div>
        <p className="text-[11px] font-black text-slate-500 uppercase tracking-[0.15em] mb-2">{title}</p>
        <p className="text-3xl font-black text-slate-900 dark:text-white tabular-nums tracking-tight">{value}</p>
      </div>
      <div className={cn("w-14 h-14 rounded-[1.25rem] flex items-center justify-center transition-all group-hover:scale-110 shadow-lg", bgColorClass, colorClass, shadowClass)}>
        <Icon size={28} strokeWidth={2.5} />
      </div>
    </div>
    {/* Subtle Background Glow */}
    <div className={cn("absolute -bottom-6 -right-6 w-24 h-24 blur-[40px] opacity-0 group-hover:opacity-20 transition-opacity rounded-full", bgColorClass)} />
  </div>
);

/* ─── Main Application Component ─── */
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
    <div className="flex-1 flex flex-col bg-background dark:bg-[#111319] min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-7xl mx-auto w-full p-4 md:p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* ─── Hero Header ─── */}
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-[#0f172a] p-8 md:p-12 text-white shadow-2xl border border-white/5">
          {/* Mesh Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-600/20 rounded-full blur-[80px]"></div>
            <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-blue-500/15 rounded-full blur-[80px]"></div>
          </div>
          {/* Subtle Texture */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:24px_24px] opacity-20"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
                <Sparkles className="h-3 w-3 text-yellow-400" /> 
                <span className="opacity-90">Career Management</span>
              </div>
              <h1 className="mt-6 text-3xl md:text-5xl font-black text-white tracking-tight drop-shadow-md">
                {user?.firstname ? `${user.firstname}'s Applications` : "Application Tracking"}
              </h1>
              <p className="mt-4 text-base md:text-lg text-slate-300 leading-relaxed font-medium">
                {activeApps.length > 0 
                  ? `You have ${activeApps.length} active applications in your pipeline. Stay focused on your goals!`
                  : "Monitor your recruitment pipeline, track interview stages, and manage offers in your personalized dashboard."}
              </p>
            </div>
            
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => navigate('/student/jobs')}
                size="lg"
                className="bg-white text-slate-900 hover:bg-slate-50 font-black rounded-2xl shadow-xl px-8 h-14 transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
              >
                Find New Roles <ArrowRight size={20} className="text-indigo-600" />
              </Button>
            </div>
          </div>
        </div>

        {/* ─── Stats Grid ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Applications"
            value={stats.total}
            icon={Briefcase}
            colorClass="text-indigo-600 dark:text-indigo-400"
            bgColorClass="bg-indigo-50 dark:bg-indigo-500/10"
            shadowClass="shadow-indigo-500/10"
          />
          <StatCard
            title="Active Pipeline"
            value={stats.active}
            icon={TrendingUp}
            colorClass="text-blue-600 dark:text-blue-400"
            bgColorClass="bg-blue-50 dark:bg-blue-500/10"
            shadowClass="shadow-blue-500/10"
          />
          <StatCard
            title="Shortlisted"
            value={stats.shortlisted}
            icon={CheckCircle2}
            colorClass="text-purple-600 dark:text-purple-400"
            bgColorClass="bg-purple-50 dark:bg-purple-500/10"
            shadowClass="shadow-purple-500/10"
          />
          <StatCard
            title="Offers Received"
            value={stats.selected}
            icon={Sparkles}
            colorClass="text-emerald-600 dark:text-emerald-400"
            bgColorClass="bg-emerald-50 dark:bg-emerald-500/10"
            shadowClass="shadow-emerald-500/10"
          />
        </div>

        {/* ─── Smart Update Banner ─── */}
        {latestApp && (
          <div className="relative group overflow-hidden rounded-[2.5rem] p-8 md:p-10 border border-indigo-500/20 bg-gradient-to-br from-indigo-600 via-indigo-700 to-blue-800 text-white shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[10px] font-black uppercase tracking-widest border border-white/10">
                    Latest Milestone
                  </span>
                  <div className="h-1 w-1 rounded-full bg-white/40" />
                  <span className="text-white/60 text-xs font-bold">Updated {new Date(latestApp.updatedAt).toLocaleDateString()}</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black leading-tight max-w-2xl">
                  {latestApp.status === 'APPLIED' 
                    ? `Your application for ${latestApp.job?.title} is now being processed.`
                    : `Great news! You've moved to the ${STATUS_CONFIG[latestApp.status as Status]?.label} stage for ${latestApp.job?.title}.`
                  }
                </h2>
                <div className="flex items-center gap-4 text-indigo-100/80 font-medium">
                  <div className="flex items-center gap-2">
                    <Building2 size={16} />
                    <span className="text-sm">{latestApp.job?.company?.name}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 shrink-0">
                <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20 min-w-[160px] shadow-inner">
                  <p className="text-[10px] font-black uppercase tracking-widest text-white/50 mb-2 leading-none">Status</p>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_10px_rgba(52,211,153,0.5)]" />
                    <span className="font-black text-lg tracking-tight uppercase">{STATUS_CONFIG[latestApp.status as Status]?.label || latestApp.status}</span>
                  </div>
                </div>
                <Button
                  onClick={() => setExpandedId(latestApp.id)}
                  className="bg-white text-indigo-600 hover:bg-indigo-50 rounded-2xl font-black shadow-2xl px-8 h-16 transition-all hover:scale-105 active:scale-95"
                >
                  View Details
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ─── Filters & Controls ─── */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-4 border-b border-slate-100 dark:border-white/[0.05]">
          <div className="flex items-center gap-3 overflow-x-auto pb-4 lg:pb-0 no-scrollbar">
            <div className="flex items-center gap-2 bg-slate-100 dark:bg-white/5 p-1.5 rounded-2xl border border-slate-200 dark:border-white/[0.05]">
              {["All", "Active", "Shortlisted", "Selected", "Rejected"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={cn(
                    "px-6 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all",
                    activeFilter === filter
                      ? "bg-white dark:bg-[#1e1f26] text-indigo-600 dark:text-indigo-400 shadow-md border border-slate-200 dark:border-white/10"
                      : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-4 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-80">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <Input
                placeholder="Search company or role..."
                className="pl-12 h-14 bg-white dark:bg-[#1e1f26] border-slate-200 dark:border-white/[0.05] rounded-[1.25rem] text-sm font-medium focus-visible:ring-indigo-500/50 shadow-sm transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-2xl border-slate-200 dark:border-white/[0.05] bg-white dark:bg-[#1e1f26]">
              <Filter size={20} className="text-slate-500" />
            </Button>
          </div>
        </div>

        {/* ─── Applications List ─── */}
        <div className="space-y-5">
          {filteredApplications.length > 0 ? (
            <div className="grid grid-cols-1 gap-5">
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
            <div className="py-24 flex flex-col items-center text-center bg-white dark:bg-[#1e1f26]/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
              <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6">
                <Search size={48} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">No applications match your search</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mt-2 font-medium">Try adjusting your filters or search terms to find what you're looking for.</p>
              <Button
                variant="link"
                className="text-indigo-600 dark:text-indigo-400 font-black uppercase tracking-widest text-[11px] mt-6"
                onClick={() => { setSearchQuery(""); setActiveFilter("All"); }}
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>

        {/* ─── Footer completion tip ─── */}
        <div className="group relative overflow-hidden rounded-[2.5rem] bg-indigo-50 dark:bg-indigo-500/5 border border-indigo-100 dark:border-indigo-500/10 p-8 flex flex-col sm:flex-row items-center gap-8">
          <div className="w-16 h-16 rounded-3xl bg-indigo-100 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shrink-0 shadow-inner">
            <Sparkles size={32} />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-lg font-black text-indigo-900 dark:text-indigo-300 uppercase tracking-wider mb-2">Career Accelerator</h4>
            <p className="text-base text-indigo-800/60 dark:text-indigo-100/60 leading-relaxed font-medium">
              Did you know? Candidates with verified certifications and a complete portfolio are <span className="text-indigo-600 dark:text-indigo-400 font-bold italic">4.5x more likely</span> to clear technical screening rounds.
            </p>
          </div>
          <Button
            onClick={() => navigate('/student/profile')}
            className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl px-8 h-14 font-black shadow-xl shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95 shrink-0"
          >
            Enhance Profile <ArrowUpRight size={20} className="ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;