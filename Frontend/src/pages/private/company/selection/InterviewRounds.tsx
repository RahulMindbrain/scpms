import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Clock, MapPin, MessageSquareQuote,
  CheckCircle2, XCircle, Send,
  Info, Bell, User, Search, Filter,
  ChevronRight, ArrowRight, Loader2,
  Check, X, MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedulesByCompany, approveSchedule, fetchScheduleMessages, sendScheduleMessage } from '@/redux/thunks/interviewThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';

// Types aligning with Prisma Schema
interface ScheduleMessage {
  id: number;
  message: string;
  senderName: string;
  createdAt: string;
  isAdmin: boolean;
}

interface InterviewSchedule {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  venue?: string;
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
  companyApprovalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  adminName: string;
  jobTitle: string;
  messages: ScheduleMessage[];
}

const CompanyInterviewManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, loading } = useSelector((state: RootState) => state.interview);

  const [selectedSchedule, setSelectedSchedule] = useState<InterviewSchedule | null>(null);
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [replyMessage, setReplyMessage] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusLoading, setStatusLoading] = useState<number | null>(null);

  // Sync selected schedule with redux state to reflect new messages
  const activeSchedule = useMemo(() => 
    schedules.find(s => s.id === selectedSchedule?.id) || selectedSchedule,
    [schedules, selectedSchedule]
  );

  useEffect(() => {
    dispatch(fetchSchedulesByCompany());
  }, [dispatch]);

  const handleUpdateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    setStatusLoading(id);
    try {
      await dispatch(approveSchedule({ id, status, reason: status === 'REJECTED' ? declineReason : undefined })).unwrap();
      toast.success(`Schedule ${status.toLowerCase()} successfully`);
      setIsRejectModalOpen(false);
      setDeclineReason('');
    } catch (error: any) {
      toast.error(error || `Failed to ${status.toLowerCase()} schedule`);
    } finally {
      setStatusLoading(null);
    }
  };

  const handleOpenDrawer = (schedule: InterviewSchedule) => {
    setSelectedSchedule(schedule);
    setIsNoteDrawerOpen(true);
    dispatch(fetchScheduleMessages(schedule.id));
  };

  const handleSendMessage = async () => {
    if (!activeSchedule || !replyMessage.trim()) return;
    try {
      await dispatch(sendScheduleMessage({ id: activeSchedule.id, message: replyMessage })).unwrap();
      setReplyMessage('');
    } catch (error: any) {
      toast.error(error || "Failed to send message");
    }
  };

  const filteredSchedules = useMemo(() => {
    return schedules.filter(s => {
      const matchesFilter = filterType === 'ALL' || s.companyApprovalStatus === filterType;
      const matchesSearch = s.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           s.jobTitle.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [schedules, filterType, searchQuery]);

  const stats = useMemo(() => ({
    total: schedules.length,
    pending: schedules.filter(s => s.companyApprovalStatus === 'PENDING').length,
    activeStudents: 145, // Mock or calculate if data available
  }), [schedules]);

  return (
    <div className="min-h-screen bg-[#FDFDFE] p-6 lg:p-12 space-y-12 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <div className="space-y-4">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-indigo-50 text-indigo-600 border border-indigo-100/50 shadow-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider">Action Required</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">Interview Pipeline</h1>
            <p className="text-slate-500 font-medium text-lg lg:text-xl">Manage and approve placement drive schedules</p>
          </div>
        </div>

        <div className="flex items-center gap-6 bg-white/60 backdrop-blur-md px-6 py-3 rounded-full border border-slate-100 shadow-xl shadow-slate-200/40">
          <div className="flex -space-x-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-indigo-100 flex items-center justify-center ring-2 ring-indigo-50/50">
                <User className="w-5 h-5 text-indigo-500" />
              </div>
            ))}
          </div>
          <div className="h-8 w-px bg-slate-200" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Coordinators</span>
            <span className="text-sm font-black text-slate-800 flex items-center gap-1.5">
              3 Active Admins
              <ChevronRight className="w-3 h-3 text-slate-300" />
            </span>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { label: 'Total Drives', value: stats.total, color: 'indigo' },
          { label: 'Pending Approvals', value: stats.pending, color: 'amber' },
          { label: 'Active Students', value: stats.activeStudents, color: 'emerald' }
        ].map((stat, idx) => (
          <div key={idx} className="group relative">
            <div className="absolute -inset-1 bg-gradient-to-br from-indigo-500/10 to-transparent rounded-[2.5rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative bg-white/70 backdrop-blur-2xl border border-white rounded-[2.5rem] p-10 shadow-2xl shadow-slate-200/50 group-hover:bg-white/90 transition-all duration-300">
              <div className={`w-12 h-12 rounded-2xl bg-${stat.color}-50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                {idx === 0 && <Calendar className="w-6 h-6 text-indigo-600" />}
                {idx === 1 && <Clock className="w-6 h-6 text-amber-600" />}
                {idx === 2 && <User className="w-6 h-6 text-emerald-600" />}
              </div>
              <p className="text-slate-500 font-bold text-sm uppercase tracking-widest mb-2">{stat.label}</p>
              <p className="text-5xl font-black text-slate-900 flex items-baseline gap-2">
                {stat.value}
                <span className="text-sm font-bold text-slate-300">live</span>
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Toolbar & Filters */}
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white/50 p-4 rounded-3xl border border-slate-100 shadow-sm backdrop-blur-sm">
          <div className="flex items-center gap-2 p-1 bg-slate-100/80 rounded-2xl w-full lg:w-auto overflow-x-auto no-scrollbar">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-6 py-2.5 rounded-xl text-xs font-black tracking-widest transition-all duration-300 whitespace-nowrap ${
                  filterType === type 
                    ? 'bg-white text-slate-900 shadow-lg shadow-slate-200/50 scale-[1.02]' 
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-4 w-full lg:w-auto lg:min-w-[400px]">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Search job title or schedule..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-5 py-3.5 bg-white border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/5 transition-all font-medium text-slate-600 placeholder:text-slate-300"
              />
            </div>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
              <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Loading Pipeline...</p>
            </div>
          ) : filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <div key={schedule.id} className="group relative">
                {/* Glow Effect on Hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-[3rem] opacity-0 group-hover:opacity-10 blur-2xl transition duration-700 pointer-events-none" />

                <div className="relative bg-white border border-slate-100 rounded-[3rem] p-8 lg:p-10 flex flex-col lg:flex-row items-center gap-10 lg:gap-14 shadow-2xl shadow-slate-200/40 hover:shadow-indigo-200/20 transition-all duration-500">
                  
                  {/* Left Side: Date Block */}
                  <div className="flex flex-col items-center justify-center bg-slate-50 rounded-[2.5rem] min-w-[130px] h-[130px] text-center p-6 border border-slate-100 ring-4 ring-slate-50/50">
                    <span className="text-4xl font-black text-indigo-600 mb-1">
                      {new Date(schedule.startTime).getDate()}
                    </span>
                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 leading-none">
                      {new Date(schedule.startTime).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-[10px] font-bold text-slate-300 mt-1">
                      {new Date(schedule.startTime).getFullYear()}
                    </span>
                  </div>

                  {/* Center Content: Main Info */}
                  <div className="flex-1 space-y-5 text-center lg:text-left">
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-3">
                      <Badge className="bg-indigo-50/70 hover:bg-indigo-100 text-indigo-600 border-indigo-100 px-4 py-1.5 rounded-xl font-bold tracking-tight text-xs">
                        {schedule.jobTitle}
                      </Badge>
                      <div className="flex items-center gap-1.5 text-slate-300 font-bold text-[10px] uppercase tracking-widest">
                        <div className="w-1 h-1 rounded-full bg-slate-200" />
                        RID: #{schedule.id}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-2xl lg:text-3xl font-black text-slate-800 tracking-tight leading-tight">
                        {schedule.title}
                      </h2>
                      <div className="flex flex-wrap justify-center lg:justify-start gap-4 lg:gap-8">
                        <div className="flex items-center gap-2.5 text-slate-500 font-bold text-sm">
                          <div className="p-2 bg-indigo-50 rounded-lg">
                            <Clock className="w-4 h-4 text-indigo-500" />
                          </div>
                          <span>
                            {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            <span className="mx-2 text-slate-300">–</span>
                            {new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2.5 text-slate-500 font-bold text-sm">
                          <div className="p-2 bg-rose-50 rounded-lg">
                            <MapPin className="w-4 h-4 text-rose-500" />
                          </div>
                          <span>{schedule.venue || 'To be announced'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-3 pt-2">
                       <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-100">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          <span className="text-xs font-bold text-slate-500">By Admin: {schedule.adminName || 'Lead Coordinator'}</span>
                       </div>
                    </div>
                  </div>

                  {/* Right Side: Action Panel */}
                  <div className="w-full lg:w-[320px] lg:pl-10 lg:border-l border-slate-100 flex flex-col gap-5 pt-8 lg:pt-0">
                    
                    {/* Status Tracking */}
                    <div className="flex items-center justify-between px-2">
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Current Status</span>
                      <button 
                        onClick={() => handleOpenDrawer(schedule)}
                        className="relative p-2 text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
                      >
                         <MessageSquare className="w-5 h-5" />
                         {(schedule.messages?.length || 0) > 0 && (
                           <span className="absolute -top-1 -right-1 w-4 h-4 bg-indigo-600 text-white text-[9px] font-black rounded-full flex items-center justify-center ring-2 ring-white">
                             {schedule.messages.length}
                           </span>
                         )}
                      </button>
                    </div>

                    {schedule.companyApprovalStatus === 'PENDING' ? (
                      <div className="space-y-3">
                        <Button
                          disabled={statusLoading === schedule.id}
                          onClick={() => handleUpdateStatus(schedule.id, 'APPROVED')}
                          className="w-full py-7 bg-slate-900 hover:bg-black text-white rounded-[1.5rem] font-black text-sm uppercase tracking-widest shadow-xl shadow-slate-200"
                        >
                          {statusLoading === schedule.id ? <Loader2 className="animate-spin" /> : (
                            <div className="flex items-center gap-3">
                              <CheckCircle2 className="w-5 h-5 text-indigo-400" />
                              Approve Schedule
                            </div>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          disabled={statusLoading === schedule.id}
                          onClick={() => { setSelectedSchedule(schedule); setIsRejectModalOpen(true); }}
                          className="w-full py-7 border-slate-200 text-slate-400 hover:border-indigo-200 hover:text-indigo-600 hover:bg-indigo-50/50 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all"
                        >
                          Request Change
                        </Button>
                      </div>
                    ) : schedule.companyApprovalStatus === 'APPROVED' ? (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center gap-2 p-6 bg-emerald-50/50 rounded-[2rem] border border-emerald-100 text-emerald-700">
                          <Check className="w-8 h-8 text-emerald-500 mb-1" />
                          <span className="text-sm font-black uppercase tracking-widest">Approved</span>
                          <span className="text-[10px] font-bold text-emerald-600/70">Confirmed by you</span>
                        </div>
                        <p className="text-center text-[11px] font-bold text-slate-400">
                          This schedule is now confirmed and synced with student calendars.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="flex flex-col items-center gap-2 p-6 bg-rose-50/50 rounded-[2rem] border border-rose-100 text-rose-700">
                          <X className="w-8 h-8 text-rose-500 mb-1" />
                          <span className="text-sm font-black uppercase tracking-widest">Rejected</span>
                          <span className="text-[10px] font-bold text-rose-600/70">Wait for admin update</span>
                        </div>
                        <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                           <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Reason:</p>
                           <p className="text-xs font-medium text-slate-600 italic">"{schedule.rejectionReason || 'Requires rescheduling'}"</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-white rounded-[4rem] p-24 text-center border border-slate-100 shadow-xl shadow-slate-200/40 border-dashed">
              <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-8 border border-slate-100 ring-8 ring-slate-50/50">
                <Calendar className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-2xl font-black text-slate-800 mb-2">No results in pipe</p>
              <p className="text-slate-400 font-bold max-w-sm mx-auto">
                We couldn't find any interview schedules matching your current filters or search query.
              </p>
              <Button 
                variant="ghost" 
                onClick={() => { setFilterType('ALL'); setSearchQuery(''); }}
                className="mt-8 text-indigo-600 font-black uppercase tracking-widest text-xs py-6 px-8 rounded-2xl hover:bg-indigo-50"
              >
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS & DRAWERS --- */}

      {/* Communication Drawer */}
      {isNoteDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity duration-500" onClick={() => setIsNoteDrawerOpen(false)} />
          <div className="relative w-full max-w-lg bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col rounded-l-[3rem] overflow-hidden">
            
            {/* Drawer Header */}
            <div className="p-10 border-b border-slate-50 bg-white/80 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-200">
                    <MessageSquareQuote className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight">Messaging Hub</h2>
                    <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">Direct communication with Admin</p>
                  </div>
                </div>
                <button onClick={() => setIsNoteDrawerOpen(false)} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
                  <X className="w-5 h-5 text-slate-400" />
                </button>
              </div>
              <div className="mt-6 flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <Calendar className="w-4 h-4 text-indigo-600" />
                </div>
                <div className="flex-1">
                  <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">Context</p>
                  <p className="text-sm font-black text-slate-800 truncate">{activeSchedule?.title}</p>
                </div>
              </div>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-10 space-y-10 scrollbar-hide">
              {activeSchedule?.messages && activeSchedule.messages.length > 0 ? activeSchedule.messages.map((msg: any) => (
                <div key={msg.id} className={`flex flex-col ${msg.isAdmin ? 'items-start' : 'items-end'} space-y-3`}>
                  <div className={`flex items-center gap-2 ${msg.isAdmin ? 'flex-row' : 'flex-row-reverse'}`}>
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-[10px] text-white font-black ${msg.isAdmin ? 'bg-indigo-600 shadow-indigo-100' : 'bg-slate-900 shadow-slate-100'} shadow-lg`}>
                      {msg.isAdmin ? 'A' : 'C'}
                    </div>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{msg.senderName}</span>
                  </div>
                  
                  <div className={`relative max-w-[85%] p-6 rounded-[2rem] shadow-sm border ${
                    msg.isAdmin 
                      ? 'bg-slate-50 border-slate-100 rounded-tl-none text-slate-700' 
                      : 'bg-indigo-600 border-indigo-500 rounded-tr-none text-white'
                  }`}>
                    <p className="font-medium leading-relaxed">{msg.message}</p>
                  </div>
                  
                  <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">
                    {new Date(msg.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                  </span>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-200 gap-6 opacity-50 py-20">
                  <div className="w-20 h-20 rounded-full border-4 border-dashed border-slate-100 flex items-center justify-center">
                    <MessageSquare className="w-10 h-10" />
                  </div>
                  <p className="font-black text-sm uppercase tracking-widest">No messages exchanged yet</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <div className="p-8 bg-white border-t border-slate-50">
              <div className="flex items-center gap-4 bg-slate-50 p-2.5 rounded-[2rem] border border-slate-100 focus-within:border-indigo-200 focus-within:ring-4 focus-within:ring-indigo-100/50 transition-all">
                <input
                  className="flex-1 bg-transparent px-6 py-4 outline-none text-sm font-bold text-slate-700 placeholder:text-slate-300"
                  placeholder="Type your message to Admin..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!replyMessage.trim()}
                  className="bg-indigo-600 hover:bg-black w-14 h-14 rounded-full shadow-xl shadow-indigo-100 disabled:opacity-30 disabled:shadow-none transition-all"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Decline/Reschedule Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Request Change"
        subtitle="This note will be sent back to the Placement Admin for review."
      >
        <div className="space-y-8 pt-4">
          <div className="bg-amber-50/50 p-6 rounded-[2rem] border border-amber-100 flex items-start gap-4">
            <div className="p-2 bg-white rounded-xl">
              <Info className="text-amber-500 w-5 h-5 shrink-0" />
            </div>
            <p className="text-[13px] text-amber-800 font-bold leading-relaxed">
              Rescheduling may impact overall timeline. Please provide a clear reasoning or preferred alternate slots.
            </p>
          </div>
          
          <div className="space-y-3">
             <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 pl-2">Rejection Reason / Notes</label>
             <textarea
               className="w-full p-8 rounded-[2rem] border border-slate-100 bg-slate-50/50 focus:ring-4 focus:ring-indigo-500/10 min-h-[160px] outline-none transition-all font-bold text-slate-700 placeholder:text-slate-200 lg:text-lg"
               placeholder="e.g., We need to shift this to 2 PM as our interviewers are coming from another campus..."
               value={declineReason}
               onChange={(e) => setDeclineReason(e.target.value)}
             />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-8 rounded-[1.5rem] font-black uppercase tracking-widest text-xs text-slate-400">
              Discard
            </Button>
            <Button
              disabled={!declineReason.trim() || statusLoading !== null}
              className="flex-1 bg-rose-600 hover:bg-rose-700 py-8 rounded-[1.5rem] font-black uppercase tracking-widest text-xs text-white shadow-2xl shadow-rose-100 transition-all"
              onClick={() => selectedSchedule && handleUpdateStatus(selectedSchedule.id, 'REJECTED')}
            >
              {statusLoading !== null ? <Loader2 className="animate-spin" /> : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default CompanyInterviewManager;