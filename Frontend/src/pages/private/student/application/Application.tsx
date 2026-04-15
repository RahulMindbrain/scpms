import React, { useEffect } from 'react';
import {
  CheckCircle2, Circle, Clock, XCircle, Briefcase,
  ChevronRight, Search, FileText, BarChart3,
  ArrowRight, Sparkles, UserCircle,
  Rocket, TrendingUp, Loader2
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplications, updateApplicationStatus } from '@/redux/thunks/studentThunk';
import { toast } from 'sonner';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

type Status = 'APPLIED' | 'SHORTLISTED' | 'TECHNICAL_ROUND' | 'HR_ROUND' | 'SELECTED' | 'REJECTED';

interface ApplicationProps {
  id: number;
  companyName: string;
  role: string;
  appliedDate: string;
  currentStatus: Status;
  reason?: string | null;
  onUpdate: () => void;
}

/* ─── Reusable Application Card (when user HAS applications) ─── */
const ApplicationCard: React.FC<ApplicationProps> = ({
  id,
  companyName,
  role,
  appliedDate,
  currentStatus,
  reason,
  onUpdate
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const [updating, setUpdating] = React.useState<"ACCEPT" | "REJECT" | null>(null);

  const stages: Status[] = ['APPLIED', 'SHORTLISTED', 'TECHNICAL_ROUND', 'HR_ROUND', 'SELECTED'];
  const statusDisplayMap: Record<Status, string> = {
    APPLIED: 'Applied',
    SHORTLISTED: 'Shortlisted',
    TECHNICAL_ROUND: 'Technical Round',
    HR_ROUND: 'HR Round',
    SELECTED: 'Selected',
    REJECTED: 'Rejected',
  };

  const getStatusIndex = (status: Status) => stages.indexOf(status);
  const currentIndex = getStatusIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  const handleAction = async (action: "ACCEPT" | "REJECT") => {
    setUpdating(action);
    try {
      await dispatch(updateApplicationStatus({ id, action })).unwrap();
      toast.success(`Application ${action.toLowerCase()}ed successfully`);
      onUpdate();
    } catch (error: any) {
      toast.error(error || `Failed to ${action.toLowerCase()} application`);
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl shadow-lg shadow-slate-200/40 border border-slate-100 w-full hover:border-blue-200 transition-all duration-300 overflow-hidden">
      {/* Header */}
      <div className="flex justify-between items-start mb-8">
        <div>
          <h3 className="text-xl font-bold text-slate-900 tracking-tight">{companyName}</h3>
          <p className="text-blue-600 font-semibold text-base mt-0.5">{role}</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
            Applied on
          </span>
          <p className="text-xs font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full">
            {new Date(appliedDate).toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="relative flex justify-between items-start mb-6">
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0" />
        {stages.map((stage, index) => {
          const isCompleted = (index < currentIndex && currentIndex !== -1) || currentStatus === 'SELECTED';
          const isCurrent = index === currentIndex && !isRejected;
          return (
            <div key={stage} className="flex flex-col items-center relative z-10 w-full">
              <div
                className={`flex items-center justify-center w-10 h-10 rounded-full mb-3 border-2 transition-all duration-500 ${isCompleted
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200'
                  : isCurrent
                    ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 scale-110'
                    : 'bg-white border-slate-200 text-slate-300'
                  }`}
              >
                {isCompleted ? (
                  <CheckCircle2 size={18} strokeWidth={3} />
                ) : (
                  <Circle size={18} fill={isCurrent ? 'currentColor' : 'none'} strokeWidth={isCurrent ? 1 : 2} />
                )}
              </div>
              <span
                className={`text-[9px] font-bold uppercase tracking-widest text-center px-1 ${isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
                  }`}
              >
                {statusDisplayMap[stage]}
              </span>
            </div>
          );
        })}
        {isRejected && (
          <div className="flex flex-col items-center relative z-10 w-full text-center">
            <div className="flex items-center justify-center w-10 h-10 rounded-full mb-3 border-2 bg-red-50 border-red-500 text-red-500 animate-pulse shadow-lg shadow-red-100">
              <XCircle size={18} strokeWidth={3} />
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-red-600">Rejected</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div
        className={`p-4 rounded-xl flex items-center justify-between border ${isRejected ? 'bg-red-50/50 border-red-100' : 'bg-blue-50/50 border-blue-100'
          }`}
      >
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isRejected ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {isRejected ? <XCircle size={18} /> : <Clock size={18} />}
          </div>
          <div>
            <p className={`text-sm font-bold ${isRejected ? 'text-red-900' : 'text-blue-900'}`}>
              {isRejected ? 'Application Closed' : `Currently: ${statusDisplayMap[currentStatus]}`}
            </p>
            <p className={`text-xs font-medium ${isRejected ? 'text-red-700/70' : 'text-blue-700/70'}`}>
              {isRejected
                ? reason || 'Your application was not moved forward for this role.'
                : currentStatus === 'SELECTED'
                  ? 'Congratulations! You have received an offer.'
                  : 'Your profile is under internal review with the hiring team.'}
            </p>
          </div>
        </div>

        {currentStatus === 'SELECTED' ? (
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              onClick={() => handleAction('REJECT')}
              disabled={!!updating}
              className="rounded-xl font-bold text-xs bg-white text-red-600 border-red-100 hover:bg-red-50 hover:text-red-700 border"
            >
              {updating === 'REJECT' ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
              Reject
            </Button>
            <Button
              size="sm"
              onClick={() => handleAction('ACCEPT')}
              disabled={!!updating}
              className="rounded-xl font-bold text-xs bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm shadow-emerald-200"
            >
              {updating === 'ACCEPT' ? <Loader2 className="w-3 h-3 animate-spin mr-1" /> : null}
              Accept Offer
            </Button>
          </div>
        ) : (
          <Button
            variant="ghost"
            className="rounded-xl font-semibold text-xs text-slate-400 hover:text-blue-600 hover:bg-white group transition-all"
          >
            Details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}
      </div>
    </div>
  );
};

/* ─── Skeleton loader while data is being fetched ─── */
const ApplicationSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {[1, 2].map((i) => (
      <div key={i} className="bg-white rounded-2xl border border-slate-100 p-8">
        <div className="flex justify-between items-start mb-8">
          <div className="space-y-2">
            <div className="h-5 w-40 bg-slate-200 rounded-lg" />
            <div className="h-4 w-28 bg-slate-100 rounded-lg" />
          </div>
          <div className="h-8 w-24 bg-slate-100 rounded-full" />
        </div>
        <div className="flex justify-between gap-4">
          {[1, 2, 3, 4, 5].map((j) => (
            <div key={j} className="flex flex-col items-center gap-2 w-full">
              <div className="w-10 h-10 rounded-full bg-slate-100" />
              <div className="h-2 w-14 bg-slate-100 rounded" />
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

/* ─── Quick Action Card Component ─── */
const QuickActionCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
  gradient: string;
}> = ({ icon, title, description, onClick, gradient }) => (
  <button
    onClick={onClick}
    className="group text-left bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-xl hover:shadow-blue-500/5 hover:border-blue-200 transition-all duration-300 hover:-translate-y-0.5 w-full"
  >
    <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-4 ${gradient}`}>
      {icon}
    </div>
    <h4 className="text-sm font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{title}</h4>
    <p className="text-xs text-slate-400 leading-relaxed">{description}</p>
    <div className="mt-3 flex items-center gap-1 text-[11px] font-bold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
      Get started <ArrowRight size={12} />
    </div>
  </button>
);

/* ─── Main Page Component ─── */
const ApplicationStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { applications = [], loading, meta } = useSelector((state: RootState) => state.student);

  useEffect(() => {
    dispatch(fetchJobApplications({}));
  }, [dispatch]);

  const activeApplications = applications.filter(
    (a: any) => !['SELECTED', 'REJECTED'].includes(a.status)
  );



  /* ─── Loading State ─── */
  if (loading && applications.length === 0) {
    return (
      <div className="p-6 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-700">
        {/* Skeleton Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-200 rounded-2xl animate-pulse" />
            <div className="space-y-2">
              <div className="h-6 w-40 bg-slate-200 rounded-lg animate-pulse" />
              <div className="h-4 w-60 bg-slate-100 rounded-lg animate-pulse" />
            </div>
          </div>
        </div>
        <ApplicationSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-6xl mx-auto animate-in fade-in duration-700">
      {/* ─── Header Section ─── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-blue-500/20">
            <Briefcase className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-bold text-2xl text-slate-900 tracking-tight">Applied Jobs</h2>
            <p className="text-slate-500 text-sm font-medium">Track and manage your job applications</p>
          </div>
        </div>

        {/* Stat Badges */}
        <div className="flex items-center gap-3">
          <div className="bg-white pl-4 pr-5 py-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 hover:border-blue-200 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
              <Briefcase size={15} className="text-blue-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">Total</p>
              <p className="text-lg font-bold text-slate-900 leading-tight">{meta?.total || applications.length}</p>
            </div>
          </div>
          <div className="bg-white pl-4 pr-5 py-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-3 hover:border-emerald-200 transition-colors">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
              <TrendingUp size={15} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none">Active</p>
              <p className="text-lg font-bold text-slate-900 leading-tight">{activeApplications.length}</p>
            </div>
          </div>
        </div>
      </header>

      {/* ─── Applications List OR Empty State ─── */}
      {applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-6">
          {applications.map((app: any) => (
            <ApplicationCard
              key={app.id}
              id={app.id}
              companyName={app.job?.company?.name || "Company"}
              role={app.job?.title || "Role Not Specified"}
              appliedDate={app.createdAt}
              currentStatus={app.status as Status}
              reason={app.reason}
              onUpdate={() => dispatch(fetchJobApplications({}))}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {/* Profile Completion Hint Banner */}
          <div className="flex items-center gap-4 p-4 bg-amber-50 border border-amber-200/60 rounded-xl">
            <div className="w-9 h-9 rounded-lg bg-amber-100 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="text-amber-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-amber-900">Complete your profile to improve your chances</p>
              <p className="text-xs text-amber-700/70 mt-0.5">Recruiters are 3× more likely to shortlist candidates with complete profiles.</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/student/profile')}
              className="shrink-0 text-amber-700 hover:bg-amber-100 hover:text-amber-800 font-semibold text-xs rounded-lg"
            >
              Update Profile <ArrowRight size={14} className="ml-1" />
            </Button>
          </div>

          {/* Empty State Card */}
          <div className="relative bg-white rounded-2xl border border-slate-100 shadow-xl shadow-slate-200/30 overflow-hidden">
            {/* Decorative gradient blur */}
            <div className="absolute top-0 right-0 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4 pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center py-16 px-6">
              {/* Illustration */}
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-blue-50 rounded-3xl flex items-center justify-center border-2 border-blue-100/60">
                  <Search className="w-10 h-10 text-blue-400" strokeWidth={1.5} />
                </div>
                {/* Floating accent dots */}
                <div className="absolute -top-2 -right-2 w-5 h-5 bg-emerald-400 rounded-full border-[3px] border-white shadow-sm" />
                <div className="absolute -bottom-1 -left-2 w-4 h-4 bg-amber-400 rounded-full border-[3px] border-white shadow-sm" />
                <div className="absolute top-1/2 -right-5 w-3 h-3 bg-blue-300 rounded-full border-2 border-white" />
              </div>

              <h3 className="text-xl font-bold text-slate-900 mb-2">No Applications Yet</h3>
              <p className="text-slate-500 font-medium max-w-md text-sm leading-relaxed mb-8">
                Start applying to jobs and track your progress here. Your journey to your dream role begins with a single application.
              </p>

              {/* CTAs */}
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => navigate('/student/jobs')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-7 py-5 rounded-xl shadow-lg shadow-blue-500/20 transition-all hover:shadow-xl hover:shadow-blue-500/25 gap-2"
                >
                  <Rocket size={16} /> Explore Jobs
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/student/profile')}
                  className="font-semibold px-6 py-5 rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all gap-2"
                >
                  <UserCircle size={16} /> Update Profile
                </Button>
              </div>
            </div>
          </div>

          {/* ─── Quick Actions ─── */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Quick Actions</h3>
              <p className="text-xs text-slate-400 font-medium">Things you can do right now</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <QuickActionCard
                icon={<Briefcase size={20} className="text-white" />}
                title="Browse Jobs"
                description="Discover roles that match your skills and interests"
                onClick={() => navigate('/student/jobs')}
                gradient="bg-blue-600 shadow-sm shadow-blue-500/30"
              />
              <QuickActionCard
                icon={<FileText size={20} className="text-white" />}
                title="Build Resume"
                description="Upload or manage your resume for applications"
                onClick={() => navigate('/student/documents')}
                gradient="bg-emerald-600 shadow-sm shadow-emerald-500/30"
              />
              <QuickActionCard
                icon={<BarChart3 size={20} className="text-white" />}
                title="Track Progress"
                description="Review your eligibility and placement readiness"
                onClick={() => navigate('/student/eligibility')}
                gradient="bg-indigo-600 shadow-sm shadow-indigo-500/30"
              />
            </div>
          </div>

          {/* ─── Suggested Jobs ─── */}
          {/* <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-slate-800">Suggested For You</h3>
              <button
                onClick={() => navigate('/student/jobs')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
              >
                View all <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {suggestedJobs.map((job, i) => (
                <SuggestedJobCard key={i} {...job} />
              ))}
            </div>
          </div> */}
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;