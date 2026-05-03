import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Edit3, Building2, Clock, 
  MapPin, Briefcase, ChevronDown, ChevronUp, 
  Search, MessageSquare, Send, Trash2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
import { useNavigate } from 'react-router-dom';

import Loader from '@/components/Loader';

const InterviewSchedulerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { schedules, loading } = useSelector((state: RootState) => state.interview);
  const { companies } = useSelector((state: RootState) => state.company);

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('edit');
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [msgLoading, setMsgLoading] = useState<number | null>(null);
  const [sendingMsg, setSendingMsg] = useState(false);

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
    <div className="min-h-screen bg-[#111319] p-4 sm:p-6 md:p-8">
      <div className="space-y-6 md:space-y-8">

        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#e2e2eb] tracking-tight">Interview Scheduler</h1>
            <p className="text-[#908fa0] text-sm sm:text-base font-medium">Manage recruitment drives efficiently</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger className="w-full sm:w-[180px] border-none bg-white shadow-sm ring-1 ring-slate-200 rounded-xl h-11">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#908fa0]" />
              <Input
                placeholder="Search drives..."
                className="pl-10 w-full sm:w-[200px] md:w-[250px] border-none bg-[#1e1f26] shadow-sm ring-1 ring-slate-200 focus:ring-primary/40 rounded-xl h-11"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleOpenCreate} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 h-11 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              <Plus className="w-4 h-4 mr-2" /> <span className="whitespace-nowrap">New Drive</span>
            </Button>
          </div>
        </div>

        {/* Drives List */}
        <div className="space-y-4">
          {loading ? (
            <div className="py-20">
              <Loader text="Syncing data..." />
            </div>
          ) : filteredSchedules.map((drive) => {
            const dateInfo = formatDate(drive.startTime);
            const isExpanded = expandedId === drive.id;

            return (
              <Card
                key={drive.id}
                className={cn(
                  "border-none shadow-sm transition-all duration-300 overflow-hidden group",
                  isExpanded ? "ring-2 ring-primary/20 shadow-xl" : "hover:shadow-md"
                )}
              >
                <CardContent className="p-0">
                  <div
                    className="flex flex-col lg:flex-row cursor-pointer select-none"
                    onClick={() => toggleExpand(drive.id)}
                  >
                    {/* Date Box - Responsive Alignment */}
                    <div className="bg-[#111319] lg:w-32 p-4 sm:p-6 flex flex-row lg:flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-[rgba(255,255,255,0.06)]/80 relative gap-3 sm:gap-1">
                      <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r-full" />
                      <span className="text-[10px] sm:text-xs font-black text-[#908fa0] uppercase tracking-tighter">{dateInfo.month}</span>
                      <span className="text-2xl sm:text-4xl font-black text-[#e2e2eb] group-hover:text-primary transition-colors leading-none">{dateInfo.day}</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-[#908fa0] uppercase tracking-widest">{dateInfo.weekday}</span>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-center space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-lg sm:text-2xl font-black text-[#e2e2eb] tracking-tight leading-tight">{drive.title}</h3>
                          <div className="flex items-center gap-2 text-primary font-bold text-xs sm:text-sm bg-primary/5 px-3 py-1.5 rounded-full w-fit">
                            <Building2 size={14} className="sm:w-4 sm:h-4" />
                            {drive.company?.name || "Corporate Partner"}
                          </div>
                        </div>
                        <Badge className={cn(
                          "px-4 py-1 rounded-full text-[9px] sm:text-[10px] font-black uppercase tracking-[0.1em] border-none shadow-sm h-fit self-start",
                          drive.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-600" :
                            drive.status === 'ONGOING' ? "bg-sky-500/10 text-sky-600" :
                              "bg-amber-500/10 text-amber-600"
                        )}>
                          {drive.status}
                        </Badge>
                      </div>

                      {/* Quick Info Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-primary"><Clock size={16} /></div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-[#908fa0] uppercase">Timing</span>
                            <span className="text-xs sm:text-sm font-bold text-[#c7c4d7]">{formatTime(drive.startTime)} - {formatTime(drive.endTime)}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-rose-500"><MapPin size={16} /></div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-[#908fa0] uppercase">Venue</span>
                            <span className="text-xs sm:text-sm font-bold text-[#c7c4d7] truncate max-w-[150px]">{drive.venue}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-amber-500"><Briefcase size={16} /></div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-[#908fa0] uppercase">Openings</span>
                            <span className="text-xs sm:text-sm font-bold text-[#c7c4d7]">{drive.jobs?.length || 0} Roles</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar / Stack */}
                    <div className="bg-[#111319] p-4 sm:p-6 lg:w-44 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" onClick={(e) => handleOpenEdit(e, drive)}>
                          <Edit3 size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-xl transition-all" onClick={(e) => handleOpenMessages(e, drive)}>
                          <MessageSquare size={18} />
                        </Button>
                         <Button 
    variant="ghost" 
    size="icon" 
    className="h-9 w-9 sm:h-10 sm:w-10 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all" 
    onClick={(e) => {
      e.stopPropagation();
      // TODO: call delete API here
      dispatch(deleteSchedule(drive.id))
        .unwrap()
        .then(() => toast.success("Schedule deleted"))
        .catch((err) => toast.error(err || "Delete failed"));
    }}
  >
    <Trash2 size={18} />
  </Button>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-[#908fa0]">
                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                      </div>
                    </div>
                  </div>

                  {/* Expandable Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-[rgba(255,255,255,0.06)] bg-white"
                      >
                        <div className="p-5 sm:p-8 md:p-10 space-y-6 bg-gradient-to-b from-white to-slate-50/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                              <Briefcase size={20} />
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-[#e2e2eb] tracking-tight uppercase">Job Openings</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            {drive.jobs?.map((job: any) => (
                              <div key={job.id} className="p-5 sm:p-6 rounded-2xl border border-[rgba(255,255,255,0.06)] bg-[#1e1f26] shadow-sm hover:ring-2 hover:ring-primary/20 transition-all space-y-4">
                                <div className="space-y-1">
                                  <p className="font-black text-[#e2e2eb] text-sm sm:text-base">{job.title}</p>
                                  <p className="text-[10px] font-bold text-[#908fa0] uppercase tracking-widest">{job.jobType} • {job.location}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                  <Badge variant="outline" className="rounded-lg text-[8px] sm:text-[9px] font-black tracking-widest border-slate-200">{job.status}</Badge>
                                </div>
                              </div>
                            )) || <div className="col-span-full py-8 text-[#908fa0] font-bold text-center italic text-sm">No jobs linked.</div>}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      <EditScheduleModal
        schedule={selectedSchedule}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        mode={mode}
      />

      <Modal
        isOpen={isMessagesOpen}
        onClose={() => setIsMessagesOpen(false)}
        title="Formal Notes"
        subtitle={`Notes for ${activeSchedule?.title || "selected schedule"}`}
      >
        <div className="flex flex-col gap-6 pt-2">
          <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
            {msgLoading === activeSchedule?.id ? (
              <div className="py-12">
                <Loader size="sm" text="Loading notes..." />
              </div>
            ) : activeSchedule?.messages && activeSchedule.messages.length > 0 ? (
              [...activeSchedule.messages].reverse().map((msg: any) => (
                <div key={msg.id} className="bg-[#111319] border border-[rgba(255,255,255,0.06)] rounded-2xl p-5 space-y-2">
                  <p className="text-xs font-black text-[#c7c4d7]">
                    {msg.senderName || (msg.isAdmin ? 'Placement Admin' : 'Company')}
                  </p>
                  <p className="text-sm text-[#c7c4d7] font-medium leading-relaxed">{msg.message}</p>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center space-y-3">
                <MessageSquare className="w-6 h-6 text-slate-300" />
                <p className="text-[#908fa0] text-sm font-bold">No formal notes yet.</p>
              </div>
            )}
          </div>

          <div className="border-t border-slate-100" />

          <div className="space-y-3">
            <label className="text-[10px] font-black uppercase tracking-widest text-[#908fa0]">
              Post a Formal Note
            </label>
            <textarea
              rows={4}
              placeholder="Write a clear formal note for the company regarding this schedule."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              className="w-full px-5 py-4 bg-[#111319] border border-[rgba(255,255,255,0.08)] rounded-2xl text-sm font-medium text-[#c7c4d7] placeholder:text-slate-300 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-200 resize-none transition-all"
            />
            <Button
              onClick={handleSendMessage}
              disabled={!messageText.trim() || sendingMsg}
              className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-widest"
            >
              {sendingMsg ? (
                <span className="flex items-center gap-2"><Loader size="sm" /> Submitting...</span>
              ) : (
                <span className="flex items-center gap-2"><Send className="w-4 h-4" /> Submit Note</span>
              )}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default InterviewSchedulerPage;