import React from 'react';
import { motion } from 'framer-motion';
import { Upload, Brain, CheckCircle2, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';

interface GlobalAtsModalProps {
  isOpen: boolean;
  onClose: () => void;
  globalAtsStep: 'upload' | 'scanning' | 'report';
  setGlobalAtsStep: (step: 'upload' | 'scanning' | 'report') => void;
  globalAtsFileName: string;
  setGlobalAtsFileName: (name: string) => void;
  globalAtsStage: number;
  globalAtsProgress: number;
  globalChecklistItems: string[];
}

export const GlobalAtsModal: React.FC<GlobalAtsModalProps> = ({
  isOpen,
  onClose,
  globalAtsStep,
  setGlobalAtsStep,
  globalAtsFileName,
  setGlobalAtsFileName,
  globalAtsStage,
  globalAtsProgress,
  globalChecklistItems,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {
        if (globalAtsStep !== 'scanning') {
          onClose();
        }
      }}
      showCloseButton={globalAtsStep !== 'scanning'}
      maxWidth={globalAtsStep === 'report' ? "sm:max-w-2xl" : "sm:max-w-lg"}
      preventOutsideClick={globalAtsStep === 'scanning'}
    >
      <div className="relative py-2 px-1">
        
        {/* ─── State 1: Upload Resume ─── */}
        {globalAtsStep === 'upload' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em]">
                Resume Optimization
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-none">
                ATS RESUME CHECKER
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider mt-1.5">
                Scan your resume against industry placement standards & get an instant strength report.
              </p>
            </div>

            {/* Upload Area */}
            <div 
              className="border-2 border-dashed border-slate-200 dark:border-white/10 rounded-[1.75rem] p-10 flex flex-col items-center justify-center text-center gap-4 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-500/[0.01] transition-all duration-300 group cursor-pointer relative"
              onClick={() => document.getElementById('global-resume-file-input')?.click()}
            >
              <input
                type="file"
                id="global-resume-file-input"
                className="hidden"
                accept=".pdf,.doc,.docx"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setGlobalAtsFileName(file.name);
                    setGlobalAtsStep('scanning');
                  }
                }}
              />
              <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-600 transition-transform duration-300 group-hover:scale-110">
                <Upload size={28} />
              </div>
              <div className="space-y-1">
                <h5 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  Drag & drop your resume here
                </h5>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Supports PDF, DOC, or DOCX (Max 5MB)
                </p>
              </div>
              <Button 
                variant="outline"
                className="rounded-xl border border-slate-200 dark:border-white/10 px-5 h-9 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 pointer-events-none mt-2"
              >
                Select File
              </Button>
            </div>
          </div>
        )}

        {/* ─── State 2: Scanning & Processing ─── */}
        {globalAtsStep === 'scanning' && (
          <div className="space-y-8 py-4 flex flex-col items-center">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-white/5" />
              <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin" />
              
              <motion.div 
                className="absolute w-16 h-16 rounded-full bg-blue-500/10 filter blur-md"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
              />
              
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
                AI Checker is analyzing your resume...
              </h4>
              <p className="text-[10px] text-slate-400 dark:text-slate-500 font-black uppercase tracking-widest truncate max-w-[250px] mx-auto">
                Scanning: {globalAtsFileName}
              </p>
            </div>

            <div className="space-y-4 w-full max-w-xs mt-2 border-t border-slate-100 dark:border-white/[0.04] pt-6">
              {globalChecklistItems.map((text, idx) => {
                const isCompleted = globalAtsStage > idx;
                const isActive = globalAtsStage === idx;
                
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
                    
                    {isActive && idx === 3 && (
                      <div className="pl-8.5 w-full space-y-1.5">
                        <div className="h-1.5 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-100 ease-out" 
                            style={{ width: `${globalAtsProgress}%` }}
                          />
                        </div>
                        <div className="flex justify-between items-center text-[8px] font-black tracking-widest text-blue-500">
                          <span>CALCULATING ATS...</span>
                          <span>{globalAtsProgress}%</span>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ─── State 3: Final ATS Report ─── */}
        {globalAtsStep === 'report' && (
          <div className="space-y-6">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-[0.25em]">
                ATS Checker Assessment
              </span>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                RESUME STRENGTH REPORT
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider truncate max-w-sm mt-0.5">
                File: {globalAtsFileName || "resume.pdf"}
              </p>
            </div>

            {/* Score Circular progress chart */}
            <div className="flex flex-col items-center justify-center py-2 text-center">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <div className="absolute inset-0 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full filter blur-xl animate-pulse" />
                
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
                    stroke="#10b981" // Emerald
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={326.7}
                    initial={{ strokeDashoffset: 326.7 }}
                    animate={{ strokeDashoffset: 326.7 - (326.7 * 82) / 100 }}
                    transition={{ duration: 1.6, ease: "easeOut" }}
                    strokeLinecap="round"
                  />
                </svg>

                <div className="absolute flex flex-col items-center justify-center text-center">
                  <span className="text-3xl font-black text-slate-950 dark:text-white tracking-tighter leading-none">
                    82%
                  </span>
                  <span className="text-[7.5px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] leading-none mt-1.5">
                    GLOBAL SCORE
                  </span>
                </div>
              </div>

              <div className="mt-4 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black text-[9px] uppercase tracking-[0.2em] px-4.5 py-1.5 rounded-full border border-emerald-500/20">
                Strong Candidate Match
              </div>
            </div>

            {/* Side-by-side metric containers */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Matched Skills */}
              <div className="p-4.5 bg-emerald-500/[0.03] dark:bg-emerald-500/[0.01] border border-emerald-500/20 rounded-2xl flex flex-col h-full min-h-[140px]">
                <h5 className="text-[9.5px] font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-[0.2em] mb-3.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-sm" />
                  Identified Strengths
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {["React.js", "TypeScript", "TailwindCSS", "State Management", "Git & GitHub", "API Integration"].map((skill, i) => (
                    <span
                      key={i}
                      className="text-[9px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full uppercase tracking-wider"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Missing Keywords */}
              <div className="p-4.5 bg-rose-500/[0.03] dark:bg-rose-500/[0.01] border border-rose-500/20 rounded-2xl flex flex-col h-full min-h-[140px]">
                <h5 className="text-[9.5px] font-black text-rose-600 dark:text-rose-400 uppercase tracking-[0.2em] mb-3.5 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-rose-500 shadow-sm" />
                  Recommended Keywords
                </h5>
                <div className="flex flex-wrap gap-1.5">
                  {["Docker", "CI/CD pipelines", "Kubernetes", "System Design", "AWS Deployment", "Unit Testing"].map((keyword, i) => (
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

            {/* AI Suggestions alert box */}
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
                    Optimization Recommendations
                  </h6>
                  <ul className="space-y-1.5 text-slate-650 dark:text-slate-400 font-medium text-[11px] md:text-xs">
                    <li className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Incorporate standard devops practices like <strong className="text-slate-900 dark:text-white font-extrabold">Docker</strong> and <strong className="text-slate-900 dark:text-white font-extrabold">CI/CD pipelines</strong>.</span>
                    </li>
                    <li className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Structure your technical skill categories cleanly to match search keyword indexers.</span>
                    </li>
                    <li className="flex items-start gap-2 leading-relaxed">
                      <span className="text-amber-500 font-bold">•</span>
                      <span>Quantify accomplishments (e.g. "reduced load time by 30%" or "boosted test coverage by 15%").</span>
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
                  setGlobalAtsStep('upload');
                  setGlobalAtsFileName('');
                }}
                className="rounded-xl border border-slate-200 dark:border-white/10 px-6 h-11 text-[11px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-white/5 transition-all hover:text-slate-950 dark:hover:text-white"
              >
                Scan Another Resume
              </Button>
              <Button
                onClick={onClose}
                className="bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-xl px-6 h-11 text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all border-none"
              >
                Close Report
              </Button>
            </div>
          </div>
        )}

      </div>
    </Modal>
  );
};
