import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Edit3, Building2, Clock, 
  MapPin, Briefcase, ChevronDown, ChevronUp, 
  Search, MessageSquare, Send, Trash2,
  Calendar,
  Sparkles,
  FileText
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Modal } from '@/components/ui/modal';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

import { EditScheduleModal } from './components/EditScheduleModal';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store/store';
import { fetchSchedules, deleteSchedule, fetchScheduleMessages, sendScheduleMessage } from '@/redux/thunks/interviewThunk';
import { fetchCompanies } from '@/redux/thunks/companyThunk';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import Loader from '@/components/Loader';
import { AdminPageLayout } from '@/components/layout/AdminPageLayout';
import { PageHeader } from '@/components/PageHeader';

const InterviewSchedulerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, loading } = useSelector((state: RootState) => state.interview);
  const { companies } = useSelector((state: RootState) => state.company);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('edit');
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [isJobDetailsOpen, setIsJobDetailsOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any | null>(null);
  const [messageText, setMessageText] = useState('');
  const [msgLoading, setMsgLoading] = useState<number | null>(null);
  const [sendingMsg, setSendingMsg] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchCompanies({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedCompanyId) {
      dispatch(fetchSchedules(Number(selectedCompanyId)));
    } else if (companies.length > 0) {
      setSelectedCompanyId(companies[0].id.toString());
    }
  }, [selectedCompanyId, companies, dispatch]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleOpenCreate = () => {
    setMode('create');
    setSelectedSchedule({
      title: "",
      companyId: "",
      jobIds: [],
      startTime: "",
      endTime: "",
      venue: "",
      status: "PENDING",
    });
    setIsEditModalOpen(true);
  };

  const handleOpenEdit = (e: React.MouseEvent, schedule: any) => {
    e.stopPropagation();
    setMode('edit');
    setSelectedSchedule(schedule);
    setIsEditModalOpen(true);
  };


  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      weekday: date.toLocaleDateString('en-US', { weekday: 'short' }),
    };
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const activeSchedule = useMemo(
    () => schedules.find((s: any) => s.id === selectedSchedule?.id) || selectedSchedule,
    [schedules, selectedSchedule]
  );

  const handleOpenMessages = async (e: React.MouseEvent, schedule: any) => {
    e.stopPropagation();
    setSelectedSchedule(schedule);
    setIsMessagesOpen(true);
    setMsgLoading(schedule.id);
    try {
      await dispatch(fetchScheduleMessages(schedule.id)).unwrap();
    } catch (error: any) {
      toast.error(error || "Failed to load notes");
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
      toast.success("Formal note sent successfully");
    } catch (error: any) {
      toast.error(error || "Failed to send note");
    } finally {
      setSendingMsg(false);
    }
  };

  const handleOpenJobDetails = (e: React.MouseEvent, job: any) => {
    e.stopPropagation();
    setSelectedJob(job);
    setIsJobDetailsOpen(true);
  };

  const filteredSchedules = Array.isArray(schedules)
    ? schedules.filter((s) => {
      const matchesCompany =
        selectedCompanyId === 'all' ||
        String(s.companyId) === selectedCompanyId;
      const matchesSearch =
        s.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.company?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCompany && matchesSearch;
    })
    : [];

  return (
    <AdminPageLayout>
      <PageHeader
        title="Interview Scheduler"
        description="Coordinate and manage interview timelines for diverse recruitment drives."
        badge="Ops Center"
        icon={Calendar}
        variant="indigo"
      >
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl bg-background/50 border-border text-xs font-black uppercase tracking-widest px-4">
              <SelectValue placeholder="Company" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="relative w-full sm:w-[220px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search drives..."
              className="pl-9 bg-background/50 border-border rounded-xl h-10 text-sm focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Button 
            onClick={handleOpenCreate} 
            className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-xl h-10 font-black uppercase tracking-widest text-[10px] px-6 shadow-lg shadow-primary/10 active:scale-95 transition-all"
          >
            <Plus className="size-3.5 mr-1.5" /> New Schedule
          </Button>
        </div>
      </PageHeader>

      <div className="space-y-6">
        {loading ? (
          <div className="py-32 flex justify-center">
            <Loader text="Syncing schedule data..." />
          </div>
        ) : filteredSchedules.length > 0 ? (
          filteredSchedules.map((drive) => {
            const dateInfo = formatDate(drive.startTime);
            const isExpanded = expandedId === drive.id;

            return (
              <div
                key={drive.id}
                className={cn(
                  "saas-card p-0 overflow-hidden transition-all duration-300",
                  isExpanded ? "ring-2 ring-primary/20 shadow-xl" : "hover:border-primary/20"
                )}
              >
                <div
                  className="flex flex-col lg:flex-row cursor-pointer group"
                  onClick={() => toggleExpand(drive.id)}
                >
                  {/* Date Sidebar */}
                  <div className="lg:w-32 bg-muted/30 p-6 flex flex-row lg:flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-border gap-4 lg:gap-1 shrink-0">
                    <span className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{dateInfo.month}</span>
                    <span className="text-4xl font-black text-foreground group-hover:text-primary transition-colors leading-none tracking-tight">
                      {dateInfo.day}
                    </span>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-[0.2em]">{dateInfo.weekday}</span>
                  </div>

                  {/* Main Info */}
                  <div className="flex-1 p-6 sm:p-8 flex flex-col justify-center gap-6">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="space-y-2">
                        <h3 className="text-xl font-bold text-foreground tracking-tight leading-tight group-hover:text-primary transition-colors">{drive.title}</h3>
                        <div className="inline-flex items-center gap-2 text-primary font-black text-[10px] bg-primary/5 border border-primary/10 px-3 py-1.5 rounded-xl uppercase tracking-widest">
                          <Building2 size={13} />
                          {drive.company?.name || "Corporate Partner"}
                        </div>
                      </div>
                      <Badge className={cn(
                        "px-4 py-1 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm self-start",
                        drive.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                          drive.status === 'ONGOING' ? "bg-sky-500/10 text-sky-600 border-sky-500/20" :
                            "bg-amber-500/10 text-amber-600 border-amber-500/20"
                      )}>
                        {drive.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-primary border border-border"><Clock size={16} /></div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Timing</p>
                          <p className="text-sm font-bold text-foreground">{formatTime(drive.startTime)} - {formatTime(drive.endTime)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-rose-500 border border-border"><MapPin size={16} /></div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Venue</p>
                          <p className="text-sm font-bold text-foreground truncate max-w-[150px]">{drive.venue}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-amber-500 border border-border"><Briefcase size={16} /></div>
                        <div className="space-y-0.5">
                          <p className="text-[9px] font-black text-muted-foreground uppercase tracking-widest">Linked Roles</p>
                          <p className="text-sm font-bold text-foreground">{drive.jobs?.length || 0} Openings</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  <div className="bg-muted/10 p-6 lg:w-48 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-border shrink-0">
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="icon" className="size-10 rounded-xl border-border text-muted-foreground hover:text-primary hover:bg-primary/5 hover:border-primary/20 transition-all" onClick={(e) => handleOpenEdit(e, drive)}>
                        <Edit3 size={16} />
                      </Button>
                      <Button variant="outline" size="icon" className="size-10 rounded-xl border-border text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 hover:border-amber-500/20 transition-all" onClick={(e) => handleOpenMessages(e, drive)}>
                        <MessageSquare size={16} />
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        disabled={deletingId === drive.id}
                        className="size-10 rounded-xl border-border text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all" 
                        onClick={(e) => {
                          e.stopPropagation();
                          if (deletingId === drive.id) return;
                          setDeletingId(drive.id);
                          const toastId = toast.loading("Removing schedule...");
                          dispatch(deleteSchedule(drive.id))
                            .unwrap()
                            .then(() => {
                              toast.success("Schedule deleted", { id: toastId });
                              setDeletingId(null);
                            })
                            .catch((err) => {
                              toast.error(err || "Delete failed", { id: toastId });
                              setDeletingId(null);
                            });
                        }}
                      >
                        {deletingId === drive.id ? (
                          <div className="w-4 h-4 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </Button>
                    </div>
                    <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground">
                      {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-border bg-muted/5"
                    >
                      <div className="p-8 sm:p-10 space-y-8">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                            <Sparkles size={18} />
                          </div>
                          <h4 className="text-base font-black text-foreground uppercase tracking-widest">Opening Specifications</h4>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                          {drive.jobs?.map((job: any) => (
                            <div key={job.id} className="saas-card bg-background p-6 space-y-4 hover:border-primary/30 transition-all">
                              <div className="space-y-1">
                                <p className="font-bold text-foreground tracking-tight">{job.title}</p>
                                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                                  <MapPin size={10} /> {job.location || 'Remote'}
                                </p>
                              </div>
                              <div className="pt-4 border-t border-border flex items-center justify-between">
                                <Badge variant="secondary" className="bg-muted text-muted-foreground text-[8px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg border-none">{job.status}</Badge>
                                <button
                                  type="button"
                                  className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary/80"
                                  onClick={(e) => handleOpenJobDetails(e, job)}
                                >
                                  View Specs
                                </button>
                              </div>
                            </div>
                          )) || <div className="col-span-full py-12 text-muted-foreground font-bold text-center italic text-sm saas-card bg-muted/10 border-dashed">No openings linked to this schedule yet. Create or approve jobs first, then attach them while creating a schedule.</div>}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        ) : (
          <div className="py-32 text-center saas-card border-dashed bg-muted/10">
            <div className="size-20 bg-muted/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
              <Calendar className="size-10 text-muted-foreground/30" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">No schedules found</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">
              Adjust your filters or company selection to see interview schedules.
            </p>
            <Button
              variant="outline"
              onClick={() => { setSearchTerm(''); setSelectedCompanyId('all'); }}
              className="rounded-xl px-8 border-border font-bold text-xs uppercase tracking-widest h-11"
            >
              Reset Filters
            </Button>
          </div>
        )}
      </div>

      <EditScheduleModal
        schedule={selectedSchedule}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        mode={mode}
      />

      <Modal
        isOpen={isJobDetailsOpen}
        onClose={() => setIsJobDetailsOpen(false)}
        title="Job Description"
        subtitle={selectedJob?.title || "Selected role"}
      >
        {selectedJob && (
          <div className="space-y-5 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Location</p>
                <p className="text-sm font-bold text-foreground">{selectedJob.location || "Remote"}</p>
              </div>
              <div className="p-4 rounded-xl bg-muted/30 border border-border">
                <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Status</p>
                <p className="text-sm font-bold text-foreground">{selectedJob.status || "N/A"}</p>
              </div>
            </div>
            <div className="p-5 rounded-2xl bg-muted/20 border border-border">
              <div className="flex items-center gap-2 mb-3 text-[10px] font-black text-foreground uppercase tracking-widest">
                <FileText className="size-3.5 text-primary" /> Description
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                {selectedJob.description || "No job description provided for this role."}
              </p>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        title="Internal Communication"
        subtitle={`Notes for ${activeSchedule?.title || "selected schedule"}`}
      >
        <div className="flex flex-col gap-8 py-4">
          <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 scrollbar-hide">
            {msgLoading === activeSchedule?.id ? (
              <div className="py-16">
                <Loader size="sm" text="Syncing communications..." />
              </div>
            ) : activeSchedule?.messages && activeSchedule.messages.length > 0 ? (
              [...activeSchedule.messages].reverse().map((msg: any) => (
                <div key={msg.id} className="bg-muted/30 border border-border rounded-2xl p-5 space-y-2 group hover:border-primary/20 transition-all">
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">
                      {msg.senderName || (msg.isAdmin ? 'Placement Admin' : 'Corporate Partner')}
                    </p>
                  </div>
                  <p className="text-sm text-foreground font-medium leading-relaxed">{msg.message}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center space-y-4 bg-muted/10 rounded-3xl border border-dashed border-border">
                <MessageSquare className="size-10 text-muted-foreground/30" />
                <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">Zero historical notes recorded.</p>
              </div>
            )}
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <div className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest">
              <Sparkles className="size-3.5 text-primary" /> Post Communication Note
            </div>
            <textarea
              rows={4}
              placeholder="Record a formal note or internal update for this drive..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full px-5 py-4 bg-muted/30 border border-border rounded-2xl text-sm font-medium text-foreground placeholder:text-muted-foreground/50 outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary/30 resize-none transition-all"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sendingMsg}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-black text-[10px] uppercase tracking-widest shadow-lg shadow-primary/10 active:scale-95 transition-all"
            >
              {sendingMsg ? (
                <span className="flex items-center gap-2"><Loader size="sm" /> Sending...</span>
              ) : (
                <span className="flex items-center gap-2"><Send className="size-3.5" /> Dispatch Note</span>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </AdminPageLayout>
  );
};

export default InterviewSchedulerPage;