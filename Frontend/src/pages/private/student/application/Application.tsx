import React from 'react';
import { CheckCircle2, Circle, Clock, XCircle, ArrowRight } from 'lucide-react';

type Status = 'Applied' | 'Shortlisted' | 'Technical Round' | 'HR Round' | 'Selected' | 'Rejected';

interface ApplicationProps {
  companyName: string;
  role: string;
  appliedDate: string;
  currentStatus: Status;
}

const ApplicationStatus: React.FC<ApplicationProps> = ({ 
  companyName, 
  role, 
  appliedDate, 
  currentStatus 
}) => {
  
  // Stages updated to match your screenshot's workflow
  const stages: Status[] = ['Applied', 'Shortlisted', 'Technical Round', 'HR Round', 'Selected'];
  
  const getStatusIndex = (status: Status) => stages.indexOf(status);
  const currentIndex = getStatusIndex(currentStatus);
  const isRejected = currentStatus === 'Rejected';

  return (
    <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 w-full max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex justify-between items-start mb-10">
        <div>
          <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{companyName}</h3>
          <p className="text-slate-500 font-medium text-lg">{role}</p>
        </div>
        <div className="text-right">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Applied On</span>
          <p className="text-sm font-semibold text-slate-700 bg-slate-100 px-3 py-1 rounded-full">{appliedDate}</p>
        </div>
      </div>

      {/* Progress Tracker */}
      <div className="relative flex justify-between items-start">
        {/* Continuous Background Line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-slate-100 -z-0" />
        
        {stages.map((stage, index) => {
          // A stage is completed if we are past it, or if we have reached "Selected"
          const isCompleted = (index < currentIndex && currentIndex !== -1) || currentStatus === 'Selected';
          const isCurrent = index === currentIndex && !isRejected;
          const isUpcoming = index > currentIndex || currentIndex === -1;

          return (
            <div key={stage} className="flex flex-col items-center relative z-10 w-full">
              {/* Node Circle */}
              <div className={`flex items-center justify-center w-10 h-10 rounded-full mb-3 border-2 transition-all duration-500 ${
                isCompleted 
                  ? 'bg-emerald-500 border-emerald-500 text-white' 
                  : isCurrent 
                  ? 'bg-blue-600 border-blue-600 text-white shadow-lg shadow-blue-200 scale-110' 
                  : 'bg-white border-slate-200 text-slate-300'
              }`}>
                {isCompleted ? (
                  <CheckCircle2 size={20} strokeWidth={3} />
                ) : (
                  <Circle size={20} fill={isCurrent ? "currentColor" : "none"} strokeWidth={isCurrent ? 1 : 2} />
                )}
              </div>
              
              {/* Label */}
              <span className={`text-[11px] font-bold uppercase tracking-tight text-center px-1 ${
                isCurrent ? 'text-blue-600' : isCompleted ? 'text-emerald-600' : 'text-slate-400'
              }`}>
                {stage}
              </span>
            </div>
          );
        })}

        {/* Rejection UI - Appears as an extra node or replaces current */}
        {isRejected && (
          <div className="flex flex-col items-center relative z-10 w-full">
            <div className="flex items-center justify-center w-10 h-10 rounded-full mb-3 border-2 bg-red-50 border-red-500 text-red-500 animate-pulse">
              <XCircle size={20} strokeWidth={3} />
            </div>
            <span className="text-[11px] font-bold uppercase text-red-600">Rejected</span>
          </div>
        )}
      </div>

      {/* Dynamic Context Footer */}
      <div className={`mt-10 p-4 rounded-xl flex items-center gap-4 border ${
        isRejected ? 'bg-red-50 border-red-100' : 'bg-blue-50 border-blue-100'
      }`}>
        <div className={`p-2 rounded-lg ${isRejected ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'}`}>
          {isRejected ? <XCircle size={20} /> : <Clock size={20} />}
        </div>
        <div>
          <p className={`text-sm font-semibold ${isRejected ? 'text-red-900' : 'text-blue-900'}`}>
            {isRejected ? "Application Closed" : "Status Update"}
          </p>
          <p className={`text-xs ${isRejected ? 'text-red-700' : 'text-blue-700'}`}>
            {isRejected 
              ? "We appreciate your interest. While this role didn't work out, your profile remains in our talent pool." 
              : currentStatus === 'Selected' 
              ? "Check your inbox! We've sent the offer details to your registered email address." 
              : `Your profile is being reviewed. The next step is usually a follow-up from the recruitment team.`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ApplicationStatus;