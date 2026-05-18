import React from 'react';
import { motion } from 'framer-motion';
import { Building2, MapPin, FileText, Badge, Upload, Sparkles, ArrowRight, Zap, Brain, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface JobUniversity {
  id: number;
  salary: number;
  description?: string;
  minCgpa?: number;
  maxBacklogs?: number;
  openings?: number;
  deadline?: string;
  postedAt?: string;
  sentAt: string;
  status: string;
  job: {
    id: number;
    title: string;
    location: string;
    companyId?: number;
    company?: {
      id: number;
      name: string;
    };
    skills?: { id: number; name: string }[];
    eligibleDepartments?: { id: number; name: string }[];
  };
  university?: {
    id: number;
    name: string;
  };
}

interface JobApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedJob: JobUniversity | null;
  applyStep: 'resume' | 'loading' | 'report';
  setApplyStep: (step: 'resume' | 'loading' | 'report') => void;
  selectedResumeOption: 'latest' | 'fresh';
  setSelectedResumeOption: (option: 'latest' | 'fresh') => void;
  loadingStage: number;
  loadingProgress: number;
  isApplying: boolean;
  handleApply: () => void;
  checklistItems: string[];
}

export const JobApplyModal: React.FC<JobApplyModalProps> = ({
  isOpen,
  onClose,
  selectedJob,
  applyStep,
  setApplyStep,
  selectedResumeOption,
  setSelectedResumeOption,
  loadingStage,
  loadingProgress,
  isApplying,
  handleApply,
  checklistItems,
}) => {
  if (!selectedJob) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (applyStep !== 'loading') {
          onClose();
        }
      }}
      showCloseButton={applyStep !== 'loading'}
      maxWidth={applyStep === 'report' ? "sm:max-w-2xl" : "sm:max-w-lg"}
      preventOutsideClick={applyStep === 'loading'}
    >
      <div className="relative py-2 px-1">

        {/* ─── State 2: Resume Selection Modal ─── */}
        {applyStep === 'resume' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em]">
                Application Portal
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                {selectedJob.job.title ? selectedJob.job.title.toUpperCase() : "SDE INTERN"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-1.5">
                <Building2 size={13} className="text-slate-400 shrink-0" />
                {selectedJob.job.company?.name || "Google"}
                <span className="w-1 h-1 rounded-full bg-slate-300 dark:bg-slate-700" />
                <MapPin size={13} className="text-slate-400 shrink-0" />
                {selectedJob.job.location || "Mountain View, CA"}
              </p>
            </div>

            {/* Grid selectable cards */}
            <div className="grid grid-cols-2 gap-4">
              {/* Card A: Compare with Latest Resume */}
              <div
                onClick={() => setSelectedResumeOption('latest')}
                className={cn(
                  "p-5 rounded-[1.75rem] border-2 cursor-pointer transition-all duration-300 flex flex-col items-center text-center justify-between gap-4 h-full",
                  selectedResumeOption === 'latest'
                    ? "border-blue-600 bg-blue-500/[0.03] dark:bg-blue-500/[0.02] shadow-lg shadow-blue-500/5 scale-[1.02]"
                    : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:scale-[1.01]"
                )}
              >
                <div className="flex items-center justify-between w-full">
                  <div className={cn(
                    "w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all shrink-0",
                    selectedResumeOption === 'latest'
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 dark:border-white/20"
                  )}>
                    {selectedResumeOption === 'latest' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                  <Badge className="bg-blue-500/10 text-blue-500 border-none text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full">
                    Latest
                  </Badge>
                </div>
                
                <div className="flex flex-col items-center gap-2 flex-1 justify-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600">
                    <FileText size={22} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider leading-tight">
                      Compare with Latest Resume
                    </h5>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider truncate max-w-[130px]">
                      Resume_v4.pdf
                    </p>
                  </div>
                </div>
                
                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
                  Updated 3 days ago
                </span>
              </div>

              {/* Card B: Upload Fresh Resume */}
              <div
                onClick={() => setSelectedResumeOption('fresh')}
                className={cn(
                  "p-5 rounded-[1.75rem] border-2 border-dashed cursor-pointer transition-all duration-300 flex flex-col items-center text-center justify-between gap-4 h-full",
                  selectedResumeOption === 'fresh'
                    ? "border-blue-600 bg-blue-500/[0.03] dark:bg-blue-500/[0.02] shadow-lg shadow-blue-500/5 scale-[1.02]"
                    : "border-slate-200 dark:border-white/10 hover:border-slate-300 dark:hover:border-white/20 hover:scale-[1.01]"
                )}
              >
                <div className="flex items-center justify-start w-full">
                  <div className={cn(
                    "w-4.5 h-4.5 rounded-full border flex items-center justify-center transition-all shrink-0",
                    selectedResumeOption === 'fresh'
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-300 dark:border-white/20"
                  )}>
                    {selectedResumeOption === 'fresh' && (
                      <div className="w-1.5 h-1.5 rounded-full bg-white" />
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-center gap-2 flex-1 justify-center py-2">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-500 dark:text-slate-400">
                    <Upload size={20} />
                  </div>
                  <div className="space-y-1">
                    <h5 className="text-[11px] font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider leading-tight">
                      Upload Fresh Resume
                    </h5>
                    <p className="text-[9px] text-slate-400 dark:text-slate-500 font-medium max-w-[120px] mx-auto leading-tight">
                      Drag & drop or select PDF/DOCX
                    </p>
                  </div>
                </div>

                <span className="text-[9px] text-slate-400 dark:text-slate-500 font-semibold tracking-wider uppercase">
                  Upload Icon
                </span>
              </div>
            </div>

            {/* Bottom link and buttons */}
            <div className="flex flex-col gap-5 pt-3">
              <div className="text-center">
                <button
                  onClick={() => {
                    toast.success("Redirecting to premium Resume Maker...", {
                      icon: <Sparkles size={16} className="text-blue-500 animate-pulse" />
                    });
                  }}
                  className="text-[11px] font-black uppercase tracking-wider text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors inline-flex items-center gap-1.5 group"
                >
                  <Sparkles size={12} className="text-blue-500 group-hover:scale-110 transition-transform fill-blue-500/10" />
                  Or create tailored resume with Resume Maker
                  <ArrowRight size={10} className="group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-white/[0.04] pt-4">
                <button
                  onClick={onClose}
                  className="text-[11px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors px-4 py-2"
                >
                  Cancel
                </button>
                <Button
                  onClick={() => setApplyStep('loading')}
                  className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl px-6 h-11 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md shadow-slate-900/10 transition-all border-none"
                >
                  <Zap size={11} className="fill-current" />
                  Analyze Now
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* ─── State 3: Loading/Analysis Modal State ─── */}
        {applyStep === 'loading' && (
          <div className="space-y-8 py-4 flex flex-col items-center">
            {/* Pulse brain animation in circularprogress track */}
            <div className="relative w-28 h-28 flex items-center justify-center">
              {/* Spinning outer progress track */}
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-white/5" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin" />
              
              {/* Glowing backdrop */}
              <motion.div 
                className="absolute w-16 h-16 rounded-full bg-blue-500/10 filter blur-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              
              {/* Centered brain/AI icon */}
              <motion.div
                animate={{ 
                  scale: [1, 1.12, 1],
                  filter: [
                    "drop-shadow(0 0 4px rgba(37, 99, 235, 0.2))",
                    "drop-shadow(0 0 16px rgba(37, 99, 235, 0.6))",
                    "drop-shadow(0 0 4px rgba(37, 99, 235, 0.2))"
                  ]
                }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="relative z-10 w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-xl"
              >
                <Brain size={30} className="stroke-[1.5]" />
              </motion.div>
            </div>

            <div className="text-center space-y-1">
              <h4 className="text-sm md:text-base font-black text-slate-800 dark:text-white uppercase tracking-wider leading-snug max-w-xs mx-auto">
                AI is analyzing your resume...
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest">
                This will only take a moment...
              </p>
            </div>

            {/* Checklist showing dynamic progress tracking */}
            <div className="space-y-4 w-full max-w-xs mt-2 border-t border-slate-100 dark:border-white/[0.04] pt-6">
              {checklistItems.map((text, idx) => {
                const isCompleted = loadingStage > idx;
                const isActive = loadingStage === idx;
                
                return (
                  <div key={idx} className="flex flex-col gap-2">
                    <div className="flex items-center gap-3">
                      {isCompleted ? (
                        <div className="w-5.5 h-5.5 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 shrink-0 border border-emerald-500/10">
                          <CheckCircle2 size={14} className="stroke-[2.5]" />
                        </div>
                      ) : isActive ? (
                        <div className="w-5.5 h-5.5 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-500 shrink-0 border border-blue-500/10 animate-spin">
                          <Loader2 size={13} className="stroke-[2.5]" />
                        </div>
                      ) : (
                        <div className="w-5.5 h-5.5 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-slate-400 shrink-0 border border-slate-200 dark:border-white/10">
                          <span className="text-[9px] font-black">{idx + 1}</span>
                        </div>
                      )}
                      <span className={cn(
                        "text-xs font-semibold transition-all duration-300",
                        isCompleted && "text-slate-400 dark:text-slate-500 line-through decoration-slate-300 dark:decoration-slate-800",
                        isActive && "text-blue-600 dark:text-blue-400 font-extrabold tracking-wide",
                        !isCompleted && !isActive && "text-slate-400 dark:text-slate-650"
                      )}>
                        {text}
                      </span>
                    </div>
                    
                    {/* Dynamic progress bar below the 4th checklist item when active */}
                    {isActive && idx === 3 && (
                      <div className="pl-8.5 w-full space-y-1.5">
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-100 ease-out" 
                            style={{ width: `${loadingProgress}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-black tracking-widest text-blue-500">
                          <span>CALCULATING ATS...</span>
                          <span>{loadingProgress}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── State 4: ATS Report & Suggestions Modal State ─── */}
        {applyStep === 'report' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em]">
                ATS Analysis Report
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                {selectedJob.job.title ? selectedJob.job.title.toUpperCase() : "SDE INTERN"}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider flex items-center gap-1.5 mt-0.5">
                {selectedJob.job.company?.name || "Google"} Match Assessment
              </p>
            </div>

            {/* Score Circular Progress Chart */}
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* Glowing back mesh */}
                <div className="absolute inset-0 bg-amber-500/5 dark:bg-amber-500/10 rounded-full filter blur-xl animate-pulse" />
                
                {/* SVG progress wheel */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="52"
                    stroke="currentColor"
                    className="text-slate-100 dark:text-white/5"
                    strokeWidth="8"
                    fill="transparent"
                  />
                  <motion.circle
                    cx="72"
                    cy="72"
                    r="52"
                    stroke="#f59e0b" // Amber ATS color
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={326.7}
                    initial={{ strokeDashoffset: 326.7 }}
                    animate={{ strokeDashoffset: 326.7 - (326.7 * 38) / 100 }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>

                {/* Numeric Score */}
                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">
                    38%
                  </span>
                  <span className="text-[7.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mt-1.5">
                    ATS SCORE
                  </span>
                </div>
              </div>

              <div className="mt-4 bg-amber-500/10 text-amber-600 dark:text-amber-400 font-black text-[9px] uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full border border-amber-500/20">
                Moderate Match
              </div>
            </div>

            {/* Middle Sections: Side-by-side Metric Containers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left: Matched Skills */}
              <div className="p-4.5 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] border border-emerald-500/20 rounded-2xl flex flex-col h-full min-h-[140px]">
                <h5 className="text-[9.5px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-3.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                  Matched Skills
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {["React", "TypeScript", "AWS", "REST APIs"].map((skill, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Right: Missing Keywords */}
              <div className="p-4.5 bg-rose-500/[0.03] dark:bg-rose-500/[0.01] border border-rose-500/20 rounded-2xl flex flex-col h-full min-h-[140px]">
                <h5 className="text-[9.5px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] mb-3.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm" />
                  Missing Keywords
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {["Docker", "Kubernetes", "CI/CD"].map((keyword, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-extrabold text-rose-600 dark:text-rose-400/80 border border-rose-500/25 px-2.5 py-0.5 rounded-full uppercase tracking-wider bg-rose-500/5"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Section: AI Suggestions alert box */}
            <div className="p-4.5 bg-slate-50 dark:bg-white/[0.02] border border-slate-200/50 dark:border-white/5 rounded-2xl relative overflow-hidden">
              <div className="absolute -right-2 -bottom-2 opacity-5 dark:opacity-10 text-indigo-500 pointer-events-none">
                <Sparkles size={64} />
              </div>
              
              <div className="flex items-start gap-3 relative z-10">
                <div className="w-7 h-7 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 shrink-0 mt-0.5 border border-amber-500/20">
                  <Sparkles size={14} className="fill-amber-500/20" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <h6 className="text-[10px] font-black text-slate-800 dark:text-[#f8fafc] uppercase tracking-widest">
                    AI Suggestions
                  </h6>
                  <ul className="space-y-1.5 text-slate-600 dark:text-slate-400 font-medium text-[11px] md:text-xs">
                    <li className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Integrate keywords like <strong className="text-slate-900 dark:text-white font-extrabold">Docker</strong> and <strong className="text-slate-900 dark:text-white font-extrabold">Kubernetes</strong> into your recent projects.</span>
                    </li>
                    <li className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Tailor your professional summary to highlight <strong className="text-slate-900 dark:text-white font-extrabold">CI/CD</strong> and cloud experience.</span>
                    </li>
                    <li className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Quantify your achievements to showcase impact in scaling <strong className="text-slate-900 dark:text-white font-extrabold">REST APIs</strong>.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.04]">
              <Button
                variant="outline"
                onClick={() => {
                  setApplyStep('resume');
                  setSelectedResumeOption('fresh');
                }}
                className="rounded-xl border border-slate-200 dark:border-white/10 px-6 h-11 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:text-slate-950 dark:hover:text-white"
              >
                Improve Resume
              </Button>
              <Button
                onClick={handleApply}
                disabled={isApplying}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl px-6 h-11 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all border-none"
              >
                {isApplying ? <Loader2 size={12} className="animate-spin" /> : "Apply Anyway"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
