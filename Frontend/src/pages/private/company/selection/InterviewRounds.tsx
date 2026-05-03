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
    <div className="flex flex-col gap-6 p-4 md:p-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground flex items-center gap-3">
            Interview Scheduler
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-2 py-0 h-5 text-[10px] font-bold">
              {stats.pending} Pending
            </Badge>
          </h1>
          <p className="text-sm text-muted-foreground font-medium">Review and manage upcoming placement rounds and candidate discussions.</p>
        </div>

        <div className="flex items-center gap-3 saas-card py-2 px-4 shadow-sm border-border/50">
           <div className="flex -space-x-2">
            {coordinators.slice(0, 3).map((name, i) => (
              <div key={i} className="w-8 h-8 rounded-full border-2 border-background bg-primary/10 flex items-center justify-center" title={name}>
                <span className="text-[10px] font-bold text-primary">{name.charAt(0)}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-col">
            <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-widest leading-none">Placement Admins</span>
            <span className="text-xs font-bold text-foreground">{coordinators.length} Active</span>
          </div>
        </div>
      </div>

      {/* Stats Overview Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Rounds', value: stats.total, color: 'primary', icon: Calendar },
          { label: 'Pending Approval', value: stats.pending, color: 'amber', icon: Clock },
          { label: 'Target Candidates', value: stats.activeCandidates, color: 'emerald', icon: User }
        ].map((stat, idx) => (
          <div key={idx} className="saas-card p-5 group cursor-default">
            <div className="flex items-center justify-between mb-4">
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shadow-sm",
                stat.color === 'primary' ? "bg-primary/10 text-primary" : 
                stat.color === 'amber' ? "bg-amber-500/10 text-amber-500" : 
                "bg-emerald-500/10 text-emerald-500"
              )}>
                <stat.icon size={20} />
              </div>
              <span className="text-[9px] font-extrabold text-muted-foreground uppercase tracking-[0.2em] opacity-50">Metric</span>
            </div>
            <p className="text-xs font-bold text-muted-foreground mb-1">{stat.label}</p>
            <p className="text-2xl font-extrabold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
      {/* Toolbar & Filters */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-1 bg-muted/30 p-1 rounded-xl border border-border/50 overflow-x-auto no-scrollbar w-full md:w-auto">
          {['ALL', 'PENDING', 'APPROVED', 'REJECTED'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type as any)}
              className={`px-4 py-1.5 rounded-lg text-[10px] font-extrabold tracking-widest transition-all whitespace-nowrap ${filterType === type
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
                }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-[300px] group">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" size={16} />
          <input
            type="text"
            placeholder="Search interviews..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="saas-input pl-11 h-10"
          />
        </div>
      </div>

      {/* Schedule List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-muted-foreground font-bold text-sm tracking-widest">SYNCHRONIZING PIPELINE...</p>
          </div>
        ) : filteredSchedules.length > 0 ? (
          filteredSchedules.map((schedule) => (
            <div key={schedule.id} className="saas-card p-0 overflow-hidden border border-border/50 hover:border-primary/30 transition-all duration-500 shadow-sm hover:shadow-xl hover:shadow-primary/5">
              <div className="flex flex-col lg:flex-row">
                {/* Date Block */}
                <div className="bg-muted/30 lg:w-[120px] flex flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-border/50 group-hover:bg-primary/5 transition-colors">
                  <span className="text-4xl font-extrabold text-primary leading-none">
                    {new Date(schedule.startTime).getDate()}
                  </span>
                  <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground mt-2">
                    {new Date(schedule.startTime).toLocaleString('default', { month: 'short' })}
                  </span>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6 lg:p-8 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-primary/10 text-primary border-primary/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                      {schedule.jobTitle}
                    </Badge>
                    <span className="text-[10px] font-bold text-muted-foreground/60 tracking-widest uppercase">
                      REF: #{schedule.id}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h2 className="text-xl font-extrabold text-foreground tracking-tight">
                      {schedule.title}
                    </h2>
                    <div className="flex flex-wrap gap-x-6 gap-y-2 pt-1">
                      <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs">
                        <Clock size={14} className="text-primary/60" />
                        <span>
                          {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - {new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground font-bold text-xs">
                        <MapPin size={14} className="text-primary/60" />
                        <span>{schedule.venue || 'TBA'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <button
                      onClick={() => handleOpenApplications(schedule)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-primary/10 text-muted-foreground hover:text-primary transition-all border border-border/50"
                    >
                      <User size={14} />
                      <span className="text-xs font-bold">
                        {schedule.applications?.length || 0} Candidates
                      </span>
                    </button>

                    <button
                      onClick={() => handleOpenMessages(schedule)}
                      className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-muted/40 hover:bg-amber-500/10 text-muted-foreground hover:text-amber-600 transition-all border border-border/50"
                    >
                      <MessageSquare size={14} />
                      <span className="text-xs font-bold">
                        Discussion {(schedule.messages?.length || 0) > 0 && `(${schedule.messages.length})`}
                      </span>
                    </button>
                  </div>
                </div>

                {/* Right Side: Approval Actions */}
                <div className="p-6 lg:p-8 bg-muted/10 flex flex-row lg:flex-col items-center justify-center gap-3 lg:w-[180px] border-t lg:border-t-0 lg:border-l border-border/50">
                  {schedule.companyApprovalStatus === 'PENDING' ? (
                    <>
                      <Button 
                        onClick={() => handleUpdateStatus(schedule.id, 'APPROVED')}
                        disabled={statusLoading === schedule.id}
                        className="flex-1 w-full rounded-xl font-bold text-[10px] uppercase tracking-widest shadow-sm h-10"
                      >
                        {statusLoading === schedule.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve'}
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => { setSelectedSchedule(schedule); setIsRejectModalOpen(true); }}
                        className="flex-1 w-full border-destructive/20 text-destructive hover:bg-destructive/10 rounded-xl font-bold text-[10px] uppercase tracking-widest h-10"
                      >
                        Decline
                      </Button>
                    </>
                  ) : (
                    <div className={cn(
                      "w-full py-2.5 text-center rounded-xl font-bold text-[9px] uppercase tracking-[0.2em] border",
                      schedule.companyApprovalStatus === 'APPROVED' ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" : "bg-destructive/10 text-destructive border-destructive/20"
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
        <div className="space-y-6 pt-4">
          {appsLoading === activeSchedule?.id ? (
            <div className="py-12 flex flex-col items-center gap-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
              <p className="text-xs font-bold text-muted-foreground tracking-widest uppercase">FETCHING CANDIDATE DATA...</p>
            </div>
          ) : activeSchedule?.applications && activeSchedule.applications.length > 0 ? (
            <div className="max-h-[400px] overflow-y-auto pr-2 space-y-3 no-scrollbar">
              {activeSchedule.applications.map((app: any) => (
                <div key={app.id} className="flex items-center justify-between p-4 saas-card border-border/50 hover:border-primary/20 hover:bg-primary/[0.02] transition-all group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-bold text-xs border border-primary/20">
                      {app.student?.user?.name?.charAt(0).toUpperCase() || 'C'}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{app.student?.user?.name || app.studentName || 'Candidate'}</p>
                      <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                        {app.student?.rollNumber || 'ID: #' + app.studentId} • {app.student?.department?.name || 'General'}
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-[10px] font-bold border-border/50 bg-muted/30">
                    {app.status || 'Scheduled'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 rounded-3xl border-2 border-dashed border-border/50 bg-muted/5">
              <User size={40} className="text-muted-foreground/30" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-foreground">No candidates registered</p>
                <p className="text-xs text-muted-foreground font-medium">Wait for the admin to sync applications for this round.</p>
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button
              onClick={() => setIsApplicationsModalOpen(false)}
              variant="outline"
              className="w-full py-6 rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.2em] border-border/50"
            >
              Dismiss
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
          <div className="bg-amber-500/10 p-4 rounded-2xl border border-amber-500/20 flex items-start gap-3">
            <Info className="text-amber-600 dark:text-amber-500 w-4 h-4 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-700 dark:text-amber-300 font-bold leading-relaxed">
              Decline only if there's a major conflict. Please provide clear details for the Placement Admin to reschedule.
            </p>
          </div>

          <div className="space-y-2">
            <label className="saas-label ml-1">Rejection Reason / Notes</label>
            <textarea
              className="saas-input min-h-[140px] resize-none p-4"
              placeholder="e.g., We have a clash with our pre-placement talk in another department. Requesting to shift this to 4:00 PM."
              value={declineReason}
              onChange={(e) => setDeclineReason(e.target.value)}
            />
          </div>

          <div className="flex gap-3 pt-2">
            <Button variant="outline" onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-6 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest border-border/50">
              Go Back
            </Button>
            <Button
              disabled={!declineReason.trim() || statusLoading !== null}
              variant="destructive"
              className="flex-1 py-6 rounded-2xl font-extrabold text-[10px] uppercase tracking-widest shadow-lg shadow-destructive/10"
              onClick={() => selectedSchedule && handleUpdateStatus(selectedSchedule.id, 'REJECTED')}
            >
              {statusLoading !== null ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Decline'}
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
        <div className="flex flex-col gap-5 pt-2">
          {/* Notes List */}
          <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 no-scrollbar scroll-smooth">
            {msgLoading === activeSchedule?.id ? (
              <div className="py-12 flex flex-col items-center gap-4">
                 <Loader2 className="w-6 h-6 text-primary animate-spin" />
                 <p className="text-[10px] font-bold text-muted-foreground tracking-widest uppercase">LOADING DISCUSSION...</p>
              </div>
            ) : activeSchedule?.messages && activeSchedule.messages.length > 0 ? (
              [...activeSchedule.messages].reverse().map((msg: any) => (
                <div key={msg.id} className={cn(
                  "p-4 rounded-2xl border transition-all shadow-sm",
                  msg.isAdmin 
                    ? "bg-primary/[0.03] border-primary/20 mr-10" 
                    : "bg-muted/30 border-border/50 ml-10"
                )}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-6 h-6 rounded-lg flex items-center justify-center text-[10px] font-extrabold shadow-sm",
                        msg.isAdmin ? "bg-primary text-primary-foreground" : "bg-emerald-500 text-white"
                      )}>
                        {msg.isAdmin ? 'A' : 'C'}
                      </div>
                      <span className="text-[10px] font-extrabold text-foreground uppercase tracking-wider">
                        {msg.isAdmin ? 'Placement Admin' : 'Your Team'}
                      </span>
                    </div>
                    <span className="text-[9px] font-bold text-muted-foreground/60">
                      {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed font-medium">
                    {msg.message}
                  </p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 rounded-3xl border-2 border-dashed border-border/50 bg-muted/5">
                <MessageSquare size={32} className="text-muted-foreground/20" />
                <div className="space-y-1">
                    <p className="text-xs font-bold text-foreground">No messages yet</p>
                    <p className="text-[10px] text-muted-foreground font-medium">Start a conversation with the placement office.</p>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-2">
            <textarea
              rows={3}
              placeholder="Type your message here..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="saas-input min-h-[100px] resize-none p-4"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sendingMsg}
              className="w-full py-6 rounded-2xl font-extrabold text-[10px] uppercase tracking-[0.2em] shadow-lg shadow-primary/20"
            >
              {sendingMsg ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Message'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CompanyInterviewManager;