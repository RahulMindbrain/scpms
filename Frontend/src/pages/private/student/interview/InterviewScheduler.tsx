import React, { useEffect } from 'react';
import {
  Calendar,
  Clock, MapPin,
  ExternalLink,
  Sparkles,
  ChevronRight,
  Video,
  UserCheck,
  Rocket,
  TrendingUp,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useDispatch, useSelector } from 'react-redux';
import CountdownTimer from '@/components/CountdownTimer';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { fetchUpcomingEvents } from '@/redux/thunks/notificationThunks';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import Loader from '@/components/Loader';

const InterviewSchedule: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { upcomingEvents = [], loading } = useSelector((state: RootState) => state.notification || {});

  useEffect(() => {
    dispatch(fetchUpcomingEvents());
  }, [dispatch]);

  // Helper to get accent color based on index or company name
  const getAccentColor = (_name: string, index: number) => {
    const colors = [
      'from-blue-500 to-indigo-600',
      'from-emerald-500 to-teal-600',
      'from-purple-500 to-indigo-600',
      'from-orange-500 to-red-600',
      'from-cyan-500 to-blue-600'
    ];
    return colors[index % colors.length];
  };

  if (loading && upcomingEvents.length === 0) {
    return <Loader text="Syncing your interview schedule..." fullScreen />;
  }

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-[1600px] mx-auto w-full p-4 md:p-8 space-y-10 student-hero-animate fade-in slide-in-from-bottom-2 duration-500">
        
        {/* Adaptive Hero Banner */}
        <div className="student-hero-banner group">
          <div className="student-hero-mesh">
            <div className="bubble-indigo"></div>
            <div className="bubble-sky"></div>
          </div>

          <div className="student-hero-texture"></div>
          <div className="student-hero-overlay"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="student-hero-badge">
                <Sparkles /> 
                <span>Interview Hub</span>
              </div>
              <h1 className="student-hero-title">
                Master Your <span>Interviews</span> 🎯
              </h1>
              <p className="student-hero-description">
                Prepare, practice, and ace your upcoming technical and behavioral rounds with confidence.
              </p>
            </div>
            <div className="hidden lg:block">
              <div className="flex h-32 w-32 items-center justify-center rounded-[2rem] bg-white/5 backdrop-blur-2xl border border-white/10 shadow-2xl">
                <Video className="h-16 w-16 text-white/40" />
              </div>
            </div>
          </div>
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-8">
            <div className="flex items-center justify-between px-2">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Active Invitations</h2>
                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 font-medium">
                  {upcomingEvents.length > 0 
                    ? `You have ${upcomingEvents.length} interviews scheduled.` 
                    : "No interviews scheduled at the moment."}
                </p>
              </div>
              <Button variant="ghost" className="text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-widest">
                History <ChevronRight size={16} className="ml-1" />
              </Button>
            </div>

            <div className="space-y-6">
              {upcomingEvents.length > 0 ? (
                upcomingEvents.map((item, idx) => (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={item.id} 
                    className={cn(
                      "group relative bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.08] rounded-[2.5rem] p-8 md:p-10 transition-all duration-500 hover:shadow-2xl hover:border-indigo-500/30 hover:translate-y-[-4px]",
                    )}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                      <div className="flex gap-6">
                        <div className={cn(
                          "w-16 h-16 md:w-20 md:h-20 rounded-[1.5rem] bg-gradient-to-br flex items-center justify-center text-white font-black text-2xl md:text-3xl shadow-xl transition-transform group-hover:scale-110 duration-500",
                          getAccentColor(item.company || 'C', idx)
                        )}>
                          {(item.company || item.title || 'C').charAt(0).toUpperCase()}
                        </div>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center gap-3 mb-1">
                            <h3 className="text-xl font-black text-slate-900 dark:text-slate-200">{item.title}</h3>
                            <span className={cn(
                              "text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-[0.1em] border shadow-sm",
                              item.venue?.toLowerCase().includes('http') || item.venue?.toLowerCase().includes('meet') || item.venue?.toLowerCase().includes('zoom')
                                ? 'bg-blue-500/10 text-blue-600 border-blue-500/20 shadow-blue-500/5' 
                                : 'bg-amber-500/10 text-amber-600 border-amber-500/20 shadow-amber-500/5'
                            )}>
                              {item.venue?.toLowerCase().includes('http') || item.venue?.toLowerCase().includes('meet') || item.venue?.toLowerCase().includes('zoom') ? 'Online' : 'Offline'}
                            </span>
                          </div>
                          <p className="text-indigo-600 dark:text-indigo-400 font-black text-sm uppercase tracking-wider">{item.company}</p>
                          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold flex items-center gap-1.5 uppercase tracking-tighter">
                            <UserCheck size={14} className="text-indigo-500" />
                            Interview Round
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-6 pt-6 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-white/5">
                        <div className="flex flex-col items-end gap-3 w-full">
                          <div className="flex items-center gap-6 text-slate-500">
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                              <Calendar size={16} className="text-indigo-500" />
                              {new Date(item.startTime).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                            </div>
                            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider">
                              <Clock size={16} className="text-indigo-500" />
                              {new Date(item.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </div>
                          </div>
                          <CountdownTimer targetDate={item.startTime} />
                        </div>
                        
                        {item.venue?.toLowerCase().includes('http') || item.venue?.toLowerCase().includes('meet') || item.venue?.toLowerCase().includes('zoom') ? (
                          <a 
                            href={item.venue.startsWith('http') ? item.venue : `https://${item.venue}`} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-500/20 active:scale-95"
                          >
                            Launch Meeting <ExternalLink size={16} />
                          </a>
                        ) : (
                          <button className="w-full sm:w-auto flex items-center justify-center gap-2 text-xs font-black uppercase tracking-widest text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-white/5 hover:bg-slate-200 dark:hover:bg-white/10 px-8 py-4 rounded-2xl transition-all border border-slate-200 dark:border-white/10 active:scale-95">
                            {item.venue || "View Location"} <MapPin size={16} />
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="py-24 flex flex-col items-center text-center bg-white dark:bg-[#1e1f26]/30 rounded-[3rem] border border-dashed border-slate-200 dark:border-white/10">
                  <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-[2rem] flex items-center justify-center text-slate-300 dark:text-slate-700 mb-6">
                    <Calendar size={48} strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">No upcoming interviews</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm max-w-xs mt-2 font-medium">We'll notify you as soon as a recruiter schedules a round with you.</p>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] p-8 text-white overflow-hidden relative shadow-2xl shadow-indigo-500/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center mb-6">
                  <Rocket className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-black mb-3">Interview Readiness</h3>
                <p className="text-indigo-100/70 text-sm leading-relaxed mb-8 font-medium">
                  Candidates who complete mock interviews are <span className="text-white font-bold">2.4x</span> more likely to receive an offer.
                </p>
                <Button className="w-full py-7 bg-white text-indigo-600 hover:bg-indigo-50 rounded-[1.25rem] font-black text-sm transition-all shadow-xl hover:scale-[1.02] active:scale-[0.98]">
                  Start Preparation
                </Button>
              </div>
            </div>

            <div className="bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl border border-slate-200/60 dark:border-white/[0.08] rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-indigo-500/10 shadow-inner">
                    <TrendingUp size={20} className="text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <h2 className="font-black text-slate-900 dark:text-white tracking-[0.1em] uppercase text-xs">Recent Activity</h2>
                </div>
              </div>

              <div className="space-y-8">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.slice(0, 3).map((act, i) => (
                    <div key={i} className="flex gap-5 relative group/item">
                      <div className={cn("w-1.5 rounded-full shrink-0 h-14", i === 0 ? "bg-emerald-500" : i === 1 ? "bg-blue-500" : "bg-indigo-500")} />
                      <div className="min-w-0">
                        <p className="text-sm font-black text-slate-900 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{act.company}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 font-bold mt-1">{act.title}</p>
                        <p className="text-[10px] text-slate-400 dark:text-slate-600 mt-2 uppercase font-black tracking-widest">
                          {new Date(act.startTime).toLocaleDateString()} • {new Date(act.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-slate-500 font-medium italic">No recent activity to show.</p>
                )}
              </div>

              <button className="w-full mt-10 flex items-center justify-center gap-2 text-[11px] font-black text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all uppercase tracking-widest border-t border-slate-100 dark:border-white/5 pt-6">
                Full Activity History <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default InterviewSchedule;