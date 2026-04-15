import React, { useEffect } from 'react';
import { CheckCircle2, Circle, Clock, XCircle, Search, Briefcase, ChevronRight, Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobApplications } from '@/redux/thunks/studentThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import { Button } from '@/components/ui/button';

type Status = 'APPLIED' | 'SHORTLISTED' | 'TECHNICAL_ROUND' | 'HR_ROUND' | 'SELECTED' | 'REJECTED';

interface ApplicationProps {
  companyName: string;
  role: string;
  appliedDate: string;
  currentStatus: Status;
}

const ApplicationCard: React.FC<ApplicationProps> = ({ 
  companyName, 
  role, 
  appliedDate, 
  currentStatus 
}) => {
  
  const stages: Status[] = ['APPLIED', 'SHORTLISTED', 'TECHNICAL_ROUND', 'HR_ROUND', 'SELECTED'];
  const statusDisplayMap: Record<Status, string> = {
    'APPLIED': 'Applied',
    'SHORTLISTED': 'Shortlisted',
    'TECHNICAL_ROUND': 'Technical Round',
    'HR_ROUND': 'HR Round',
    'SELECTED': 'Selected',
    'REJECTED': 'Rejected'
  };

  const getStatusIndex = (status: Status) => stages.indexOf(status);
  const currentIndex = getStatusIndex(currentStatus);
  const isRejected = currentStatus === 'REJECTED';

  return (
    <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/40 border border-slate-50 w-full hover:border-blue-200 transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase">{companyName}</h3>
          <p className="text-blue-600 font-bold text-lg">{role}</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 block mb-1">Applied On</span>
          <p className="text-xs font-bold text-slate-700 bg-slate-100 px-4 py-1.5 rounded-full">{new Date(appliedDate).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="relative flex justify-between items-start mb-8">
        {/* Continuous Background Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0" />
        
        {stages.map((stage, index) => {
          const isCompleted = (index < currentIndex && currentIndex !== -1) || currentStatus === 'SELECTED';
          const isCurrent = index === currentIndex && !isRejected;

          return (
            <div key={stage} className="flex flex-col items-center relative z-10 w-full">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-3 border-2 transition-all duration-500 ${
                isCompleted 
                  ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200' 
                  : isCurrent 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-xl shadow-blue-200 scale-110' 
                  : 'bg-white border-slate-200 text-slate-300'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 size={18} strokeWidth={3} />
                ) : (
                  <Circle size={18} fill={isCurrent ? "currentColor" : "none"} strokeWidth={isCurrent ? 1 : 2} />
                )}
              </div>
              
              <span className={`text-[9px] font-black uppercase tracking-widest text-center px-1 ${
                isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
              }`}>
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
            <span className="text-[9px] font-black uppercase tracking-widest text-red-600">Rejected</span>
          </div>
        )}
      </div>

      {/* Action Footer */}
      <div className={`p-5 rounded-2xl flex items-center justify-between border ${
        isRejected ? 'bg-red-50/50 border-red-100' : 'bg-blue-50/50 border-blue-100'
      }`}>
        <div className="flex items-center gap-4">
          <div className={`p-2 rounded-xl ${isRejected ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
            {isRejected ? <XCircle size={20} /> : <Clock size={20} />}
          </div>
          <div>
            <p className={`text-sm font-black uppercase tracking-widest ${isRejected ? 'text-red-900' : 'text-blue-900'}`}>
              {isRejected ? "Application Closed" : `Currently: ${statusDisplayMap[currentStatus]}`}
            </p>
            <p className={`text-xs font-medium ${isRejected ? 'text-red-700/70' : 'text-blue-700/70'}`}>
              {isRejected 
                ? "Your application was not moved forward for this role." 
                : currentStatus === 'SELECTED' 
                ? "Congratulations! Check your email for offer details." 
                : "Your profile is under internal review with the hiring team."}
            </p>
          </div>
        </div>
        <Button variant="ghost" className="rounded-xl font-bold text-xs uppercase tracking-widest text-slate-400 hover:text-blue-600 hover:bg-white group transition-all">
          Details <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

const ApplicationStatus = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { applications = [], loading } = useSelector((state: RootState) => state.student);

  useEffect(() => {
    dispatch(fetchJobApplications({}));
  }, [dispatch]);

  if (loading && applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
        <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-sm text-center">Fetching your applications...</p>
      </div>
    );
  }

  return (
    <div className="p-8 animate-in fade-in duration-700 max-w-6xl mx-auto">
      {/* Header */}
      <header className="flex items-center justify-between mb-12">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-2xl shadow-blue-500/30">
            <Briefcase className="w-7 h-7" />
          </div>
          <div>
            <h2 className="font-black text-3xl text-slate-900 tracking-tight uppercase">Applied Jobs</h2>
            <p className="text-slate-500 text-sm font-semibold">Track the status of all your recruitment applications in one place.</p>
          </div>
        </div>
        <div className="bg-white px-6 py-3 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-3">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Total Applications</span>
          <span className="text-xl font-black text-blue-600">{applications.length}</span>
        </div>
      </header>

      {applications.length > 0 ? (
        <div className="grid grid-cols-1 gap-8">
          {applications.map((app: any) => (
            <ApplicationCard 
              key={app.id}
              companyName={app.job.company.name}
              role={app.job.title}
              appliedDate={app.createdAt}
              currentStatus={app.status as Status}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/20 text-center">
          <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-8">
            <Search className="w-12 h-12 text-slate-200" />
          </div>
          <h3 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">No Applications Yet</h3>
          <p className="text-slate-500 font-medium mb-10 max-w-sm mx-auto">You haven't applied to any job roles yet. Explore the available opportunities to start your career journey.</p>
          <Button asChild className="bg-blue-600 text-white font-black uppercase tracking-[0.2em] px-10 py-7 rounded-[1.2rem] shadow-xl shadow-blue-500/20 hover:scale-[1.02] transition-transform">
            <a href="/student/jobs">Explore Jobs</a>
          </Button>
        </div>
      )}
    </div>
  );
};

export default ApplicationStatus;