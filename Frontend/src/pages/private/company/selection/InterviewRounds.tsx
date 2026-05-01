import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar, Clock, MapPin, Info, User, Search, ChevronRight, Loader2,
  MessageSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanySchedules, approveSchedule, fetchScheduleApplications, fetchScheduleMessages, sendScheduleMessage } from '@/redux/thunks/interviewThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
import Loader from '@/components/Loader';

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
  applications?: any[];
}

const CompanyInterviewManager: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, loading } = useSelector((state: RootState) => state.interview);

  const [selectedSchedule, setSelectedSchedule] = useState<InterviewSchedule | null>(null);
  const [isApplicationsModalOpen, setIsApplicationsModalOpen] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [declineReason, setDeclineReason] = useState('');
  const [filterType, setFilterType] = useState<'ALL' | 'PENDING' | 'APPROVED' | 'REJECTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusLoading, setStatusLoading] = useState<number | null>(null);
  const [appsLoading, setAppsLoading] = useState<number | null>(null);
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [msgLoading, setMsgLoading] = useState<number | null>(null);
  const [sendingMsg, setSendingMsg] = useState(false);

  // Sync selected schedule with redux state to reflect new messages
  const activeSchedule = useMemo(() =>
    schedules.find(s => s.id === selectedSchedule?.id) || selectedSchedule,
    [schedules, selectedSchedule]
  );

  useEffect(() => {
    dispatch(fetchCompanySchedules());
  }, [dispatch]);

  const coordinators = useMemo(() => {
    const names = Array.from(new Set(schedules.map(s => s.adminName).filter(Boolean)));
    return names.length > 0 ? names : ['Placement Admin'];
  }, [schedules]);

  const handleUpdateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    setStatusLoading(id);
    try {
      await dispatch(approveSchedule({ 
        id, 
        status, 
        rejectionReason: status === 'REJECTED' ? declineReason : undefined 
      })).unwrap();
      toast.success(`Schedule ${status.toLowerCase()} successfully`);
      setIsRejectModalOpen(false);
      setDeclineReason('');
    } catch (error: any) {
      toast.error(error || `Failed to ${status.toLowerCase()} schedule`);
    } finally {
      setStatusLoading(null);
    }
  };

  const handleOpenApplications = async (schedule: InterviewSchedule) => {
    setSelectedSchedule(schedule);
    setIsApplicationsModalOpen(true);
    setAppsLoading(schedule.id);
    try {
      await dispatch(fetchScheduleApplications(schedule.id)).unwrap();
    } catch (error: any) {
      toast.error(error || "Failed to load candidates");
    } finally {
      setAppsLoading(null);
    }
  };

  const handleOpenMessages = async (schedule: InterviewSchedule) => {
    setSelectedSchedule(schedule);
    setIsMessagesOpen(true);
    setMsgLoading(schedule.id);
    try {
      await dispatch(fetchScheduleMessages(schedule.id)).unwrap();
    } catch (error: any) {
      toast.error(error || "Failed to load messages");
    } finally {
      setMsgLoading(null);
    }
  };

  const handleSendMessage = async () => {
    if (!activeSchedule || !messageText.trim()) return;
    setSendingMsg(true);
    try {
      const formalNote = messageText.trim();
      await dispatch(sendScheduleMessage({ id: activeSchedule.id, message: formalNote })).unwrap();
      await dispatch(fetchScheduleMessages(activeSchedule.id)).unwrap();
      setMessageText('');
    } catch (error: any) {
      toast.error(error || "Failed to send message");
    } finally {
      setSendingMsg(false);
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
    activeCandidates: schedules.reduce((acc, s) => acc + (s.applications?.length || 0), 0),
  }), [schedules]);

  return (
    <div className="space-y-8 font-sans">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-400"></span>
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider">Interview Pipeline</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl lg:text-4xl font-black text-[#e2e2eb] tracking-tight">Interview Scheduler</h1>
            <p className="text-[#908fa0] font-medium text-sm lg:text-base">Review and manage your upcoming placement rounds</p>
          </div>
        </div>

        <div className="flex items-center gap-4 bg-[#1e1f26] px-5 py-2.5 rounded-2xl border border-[rgba(255,255,255,0.07)]">
          <div className="flex -space-x-2">
            {coordinators.slice(0, 3).map((name, i) => (
              <div key={i} className="w-9 h-9 rounded-full border-2 border-[#1e1f26] bg-indigo-500/15 flex items-center justify-center" title={name}>
                <span className="text-[10px] font-bold text-indigo-400">{name.charAt(0)}</span>
              </div>
            ))}
          </div>
          <div className="h-6 w-px bg-[rgba(255,255,255,0.1)]" />
          <div className="flex flex-col">
            <span className="text-[10px] font-bold text-[#908fa0] uppercase tracking-widest leading-none mb-1">Admins</span>
            <span className="text-xs font-black text-[#e2e2eb] flex items-center gap-1">
              {coordinators.length} Active
              <ChevronRight className="w-3 h-3 text-[#c7c4d7]" />
            </span>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          { label: 'Total Rounds', value: stats.total, color: 'indigo', icon: Calendar },
          { label: 'Pending', value: stats.pending, color: 'amber', icon: Clock },
          { label: 'Candidates', value: stats.activeCandidates, color: 'emerald', icon: User }
        ].map((stat, idx) => (
          <div key={idx} className="bg-[#1e1f26] border border-[rgba(255,255,255,0.07)] rounded-xl p-5 hover:border-indigo-500/30 transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className={cn(
                "w-9 h-9 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110",
                stat.color === 'indigo' ? "bg-indigo-500/10 text-indigo-400" : 
                stat.color === 'amber' ? "bg-amber-500/10 text-amber-400" : 
                "bg-emerald-500/10 text-emerald-400"
              )}>
                <stat.icon className="w-4.5 h-4.5" />
              </div>
              <span className="text-[9px] font-bold text-[#908fa0] uppercase tracking-widest opacity-60">Snapshot</span>
            </div>
            <p className="text-[#908fa0] font-bold text-[10px] uppercase tracking-widest mb-0.5">{stat.label}</p>
            <p className="text-2xl font-bold text-[#e2e2eb]">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {/* Toolbar & Filters */}
        <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-[#1e1f26] p-2 rounded-2xl border border-[rgba(255,255,255,0.07)]">
          <div className="flex items-center gap-1 bg-[#111319] p-1 rounded-xl overflow-x-auto no-scrollbar">
            {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type as any)}
                className={`px-4 py-2 rounded-lg text-[10px] font-black tracking-widest transition-all whitespace-nowrap ${filterType === type
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-[#908fa0] hover:text-[#c7c4d7]'
                  }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="relative flex-1 lg:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#908fa0]" />
            <input
              type="text"
              placeholder="Search schedule..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-[#0c0e14] border border-[rgba(255,255,255,0.08)] rounded-xl outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all text-xs font-medium text-[#e2e2eb] placeholder:text-[#908fa0]"
            />
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
              <p className="text-[#908fa0] font-bold">Loading Pipeline...</p>
            </div>
          ) : filteredSchedules.length > 0 ? (
            filteredSchedules.map((schedule) => (
              <div key={schedule.id} className="group relative">
                <div className="relative bg-[#1e1f26] border border-[rgba(255,255,255,0.07)] rounded-2xl p-5 lg:p-7 flex flex-col lg:flex-row items-start lg:items-center gap-6 hover:border-indigo-500/20 hover:shadow-xl hover:shadow-indigo-900/20 transition-all duration-300">
                  
                  {/* Left Side: Date Block */}
                  <div className="flex flex-col items-center justify-center bg-[rgba(255,255,255,0.02)] rounded-2xl min-w-[100px] h-[100px] text-center p-4 border border-[rgba(255,255,255,0.07)] group-hover:bg-indigo-500/10 transition-colors">
                    <span className="text-3xl font-black text-indigo-400 leading-none mb-1">
                      {new Date(schedule.startTime).getDate()}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#908fa0]">
                      {new Date(schedule.startTime).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="text-[10px] font-bold text-[#c7c4d7] mt-1">
                      {new Date(schedule.startTime).getFullYear()}
                    </span>
                  </div>

                  {/* Center Content: Main Info */}
                  <div className="flex-1 space-y-4 text-center lg:text-left w-full">
                    <div className="flex flex-wrap justify-center lg:justify-start items-center gap-2">
                      <Badge className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20 px-3 py-1 rounded-lg font-bold text-[10px] uppercase tracking-wider">
                        {schedule.jobTitle}
                      </Badge>
                      <span className="text-[10px] font-bold text-[#c7c4d7] uppercase tracking-widest">
                        ID: #{schedule.id}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <h2 className="text-xl lg:text-2xl font-black text-[#e2e2eb] tracking-tight">
                        {schedule.title}
                      </h2>
                      <div className="flex flex-wrap justify-center lg:justify-start gap-x-6 gap-y-2">
                        <div className="flex items-center gap-2 text-[#908fa0] font-bold text-xs">
                          <Clock className="w-3.5 h-3.5 text-indigo-500" />
                          <span>
                            {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[#908fa0] font-bold text-xs">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          <span>{schedule.venue || 'TBA'}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-center lg:justify-start gap-3 pt-1">
                      <button
                        onClick={() => handleOpenApplications(schedule)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.02)] hover:bg-indigo-500/10 border border-[rgba(255,255,255,0.07)] transition-colors group/btn"
                      >
                        <User className="w-3.5 h-3.5 text-[#908fa0] group-hover/btn:text-indigo-400" />
                        <span className="text-[11px] font-bold text-[#c7c4d7] group-hover/btn:text-indigo-400">
                          {schedule.applications?.length || 0} Candidates
                        </span>
                      </button>

                      <button
                        onClick={() => handleOpenMessages(schedule)}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[rgba(255,255,255,0.02)] hover:bg-amber-500/10 border border-[rgba(255,255,255,0.07)] transition-colors group/btn"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#908fa0] group-hover/btn:text-amber-400" />
                        <span className="text-[11px] font-bold text-[#c7c4d7] group-hover/btn:text-amber-400">
                          Notes {(schedule.messages?.length || 0) > 0 && `(${schedule.messages.length})`}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Right Side: Approval Actions */}
                  <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-[140px]">
                    {schedule.companyApprovalStatus === 'PENDING' ? (
                      <>
                        <Button 
                          onClick={() => handleUpdateStatus(schedule.id, 'APPROVED')}
                          disabled={statusLoading === schedule.id}
                          className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold py-2.5 text-[10px] uppercase tracking-widest transition-all"
                        >
                          {statusLoading === schedule.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
                        </Button>
                        <Button 
                          variant="ghost"
                          onClick={() => { setSelectedSchedule(schedule); setIsRejectModalOpen(true); }}
                          className="flex-1 text-rose-400 hover:bg-rose-500/10 rounded-xl font-bold py-2.5 text-[10px] uppercase tracking-widest transition-all"
                        >
                          Decline
                        </Button>
                      </>
                    ) : (
                      <div className={cn(
                        "w-full py-2.5 text-center rounded-xl font-bold text-[9px] uppercase tracking-[0.15em] border",
                        schedule.companyApprovalStatus === 'APPROVED' ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                      )}>
                        {schedule.companyApprovalStatus}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="bg-[#1e1f26] rounded-2xl p-16 text-center border border-dashed border-[rgba(255,255,255,0.1)]">
              <Calendar className="w-12 h-12 text-[#c7c4d7] mx-auto mb-4" />
              <p className="text-xl font-black text-[#e2e2eb] mb-2">No schedules found</p>
              <p className="text-[#908fa0] font-bold text-sm max-w-sm mx-auto mb-6">
                Try adjusting your filters or search query to find what you're looking for.
              </p>
              <Button
                variant="outline"
                onClick={() => { setFilterType('ALL'); setSearchQuery(''); }}
                className="text-indigo-400 border-indigo-500/20 hover:bg-indigo-500/10 rounded-xl"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* --- MODALS & DRAWERS --- */}



      {/* Candidates Modal */}
      <Modal
        isOpen={isApplicationsModalOpen}
        onClose={() => setIsApplicationsModalOpen(false)}
        title="Candidate List"
        subtitle={`Viewing students for ${activeSchedule?.title}`}
      >
        <div className="space-y-4 pt-4">
          {appsLoading === activeSchedule?.id ? (
            <Loader text="Fetching Candidates..." />
          ) : activeSchedule?.applications && activeSchedule.applications.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-2 no-scrollbar">
              {activeSchedule.applications.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-4 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-2xl hover:bg-indigo-500/5 hover:border-indigo-500/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
                      <User className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-[#e2e2eb]">{app.student?.user?.name || app.studentName || 'Candidate'}</p>
                      <p className="text-[10px] font-bold text-[#908fa0] uppercase tracking-wider">
                        {app.student?.rollNumber || 'ID: #' + app.studentId} • {app.student?.department?.name || 'General'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] border-[rgba(255,255,255,0.08)]">
                    {app.status || 'Scheduled'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
              <User className="w-10 h-10 text-[#c7c4d7]" />
              <p className="text-[#908fa0] font-bold text-sm">No candidates found for this round.</p>
            </div>
          )}

          <div className="pt-4 border-t border-[rgba(255,255,255,0.07)]">
            <Button
              onClick={() => setIsApplicationsModalOpen(false)}
              className="w-full py-4 bg-[rgba(255,255,255,0.06)] hover:bg-[rgba(255,255,255,0.1)] text-[#c7c4d7] rounded-xl font-bold text-xs uppercase tracking-widest"
            >
              Close
            </Button>
          </div>
        </div>
      </Modal>

      {/* Decline/Reschedule Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Request Change"
        subtitle="Provide reasoning for rejecting this schedule"
      >
        <div className="space-y-6 pt-4">
          <div className="bg-amber-500/10 p-4 rounded-xl border border-amber-500/20 flex items-start gap-3">
            <Info className="text-amber-500 w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-300 font-medium leading-relaxed">
              Rescheduling may impact the placement timeline. Clear reasoning helps the admin find better slots.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#908fa0] ml-1">Rejection Reason</label>
            <textarea
              className="w-full p-4 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] focus:ring-2 focus:ring-rose-500/10 min-h-[120px] outline-none transition-all text-sm font-medium text-[#c7c4d7] placeholder:text-[#c7c4d7] resize-none"
              placeholder="e.g., We need to shift this to 2 PM as our interviewers are coming from another campus..."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] text-[#908fa0] hover:bg-[rgba(255,255,255,0.04)]">
              Cancel
            </Button>
            <Button
              disabled={!declineReason.trim() || statusLoading !== null}
              className="flex-1 bg-rose-600 hover:bg-rose-700 py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] text-white shadow-lg shadow-rose-100"
              onClick={() => selectedSchedule && handleUpdateStatus(selectedSchedule.id, 'REJECTED')}
            >
              {statusLoading !== null ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Rejection'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Notes Modal */}
      <Modal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        title="Discussion"
        subtitle={`Messages for ${activeSchedule?.title}`}
      >
        <div className="flex flex-col gap-4 pt-2">

          {/* Notes List */}
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 no-scrollbar">
            {msgLoading === activeSchedule?.id ? (
              <Loader text="Loading discussion..." size="sm" />
            ) : activeSchedule?.messages && activeSchedule.messages.length > 0 ? (
              [...activeSchedule.messages].reverse().map((msg: any) => (
                <div key={msg.id} className={cn(
                  "p-4 rounded-2xl border transition-all",
                  msg.isAdmin ? "bg-indigo-500/[0.07] border-indigo-500/20 mr-8" : "bg-[rgba(255,255,255,0.04)] border-[rgba(255,255,255,0.07)] ml-8"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-bold",
                        msg.isAdmin ? "bg-indigo-500/15 text-indigo-400" : "bg-emerald-500/15 text-emerald-400"
                      )}>
                        {msg.isAdmin ? 'A' : 'C'}
                      </div>
                      <span className="text-[10px] font-bold text-[#e2e2eb]">
                        {msg.isAdmin ? 'Placement Admin' : 'Your Team'}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-[#908fa0]">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-[#c7c4d7] leading-relaxed">
                    {msg.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center space-y-2">
                <MessageSquare className="w-8 h-8 text-[#c7c4d7]" />
                <p className="text-[#908fa0] text-xs font-bold">No messages yet.</p>
              </div>
            )}
          </div>

          <div className="border-t border-[rgba(255,255,255,0.07)] pt-4 space-y-3">
            <textarea
              rows={3}
              placeholder="Type your message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full px-4 py-3 bg-[rgba(255,255,255,0.02)] border border-[rgba(255,255,255,0.07)] rounded-xl text-xs font-medium text-[#c7c4d7] placeholder:text-[#c7c4d7] outline-none focus:ring-2 focus:ring-indigo-500/10 resize-none transition-all"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sendingMsg}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-md transition-all"
            >
              {sendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Send Message'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyInterviewManager;