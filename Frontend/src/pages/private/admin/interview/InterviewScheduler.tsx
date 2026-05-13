import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Edit3, Building2, Clock, 
  MapPin, Briefcase, ChevronDown, ChevronUp, 
  Search, MessageSquare, Send, Trash2,
  Calendar,
  Sparkles,
  IndianRupee
} from 'lucide-react';
import { Button } from '@/components/ui/button';

import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Modal } from '@/components/ui/modal';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

import { EditScheduleModal } from './components/EditScheduleModal';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store/store';
import { 
  fetchSchedules, 
  deleteSchedule, 
  fetchScheduleMessages, 
  sendScheduleMessage,
  fetchActiveCompaniesForSchedule,
  fetchActiveUniversitiesForSchedule,
  fetchCompanyJobsForSchedule,
  fetchUniversityJobsForSchedule,
  createSchedule
} from '@/redux/thunks/interviewThunk';
import { fetchCompanies } from '@/redux/thunks/companyThunk';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import Loader from '@/components/Loader';
import { AdminPageLayout } from '@/components/layout/AdminPageLayout';
import { PageHeader } from '@/components/PageHeader';
import { Separator } from '@/components/ui/separator';

const InterviewSchedulerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { 
    schedules, 
    loading,
    schedulerCompanies,
    schedulerUniversities,
    schedulerJobs,
    schedulerLoading
  } = useSelector((state: RootState) => state.interview);
  const { companies } = useSelector((state: RootState) => state.company);
  const { user, userType } = useSelector((state: RootState) => state.auth);

  const isSuperAdmin = userType === 'SUPER_ADMIN' || userType === 'SUPERADMIN';
  const isUniversityAdmin = userType === 'ADMIN';
  const universityId = (user as any)?.profile?.university?.id;

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [wizardCompanyId, setWizardCompanyId] = useState<string>('');
  const [wizardUniversityId, setWizardUniversityId] = useState<string>('');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('edit');
  const [isMessagesOpen, setIsMessagesOpen] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [msgLoading, setMsgLoading] = useState<number | null>(null);
  const [sendingMsg, setSendingMsg] = useState(false);

  // New Scheduler Flow State
  const [schedulerType, setSchedulerType] = useState<'companies' | 'universities'>('companies');
  const [isJobsModalOpen, setIsJobsModalOpen] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState<any>(null);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [selectedJobToSchedule, setSelectedJobToSchedule] = useState<any>(null);
  const [finalizeData, setFinalizeData] = useState({
    title: '',
    startTime: '',
    endTime: '',
    venue: '',
    message: ''
  });
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCompanies({ page: 1, limit: 100 }));
    // Fetch initial scheduler data
    if (schedulerType === 'companies') {
      dispatch(fetchActiveCompaniesForSchedule());
    } else {
      dispatch(fetchActiveUniversitiesForSchedule());
    }
  }, [dispatch, schedulerType]);

  useEffect(() => {
    if (selectedCompanyId && selectedCompanyId !== 'all') {
      dispatch(fetchSchedules(Number(selectedCompanyId)));
    } else if (companies.length > 0 && !selectedCompanyId) {
      setSelectedCompanyId(companies[0].id.toString());
    }
  }, [selectedCompanyId, companies, dispatch]);

  const handleWizardCompanyChange = (id: string) => {
    setWizardCompanyId(id);
    if (id && id !== 'all') {
      dispatch(fetchCompanyJobsForSchedule(Number(id)));
    }
  };

  const handleWizardUniversityChange = (id: string) => {
    setWizardUniversityId(id);
    // Optionally fetch companies for this university if the API supports it
  };

  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity);
    if (schedulerType === 'companies') {
      handleWizardCompanyChange(entity.id.toString());
    } else {
      setWizardUniversityId(entity.id.toString());
      dispatch(fetchUniversityJobsForSchedule({ universityId: entity.id }));
    }
    // We'll keep the modal open but switch view if needed, 
    // or just use the new consolidated UI
  };

  const handleScheduleClick = (job: any) => {
    setSelectedJobToSchedule(job);
    setFinalizeData({
      title: `${job.job?.title || 'Drive'} @ ${job.university?.name || job.job?.company?.name || 'Campus'}`,
      startTime: '',
      endTime: '',
      venue: '',
      message: ''
    });
    setIsFinalizeModalOpen(true);
  };

  const handleFinalSubmit = async () => {
    if (!finalizeData.title || !finalizeData.startTime || !finalizeData.endTime || !finalizeData.venue) {
      toast.error("Please fill all fields");
      return;
    }

    setIsSubmittingSchedule(true);
    try {
      const payload = {
        title: finalizeData.title,
        companyId: selectedJobToSchedule.job.companyId,
        universityId: selectedJobToSchedule.universityId,
        jobUniversityIds: [selectedJobToSchedule.id],
        startTime: new Date(finalizeData.startTime).toISOString(),
        endTime: new Date(finalizeData.endTime).toISOString(),
        venue: finalizeData.venue
      };

      const res = await dispatch(createSchedule(payload)).unwrap();
      
      if (finalizeData.message.trim() && res?.data?.id) {
        await dispatch(sendScheduleMessage({ id: res.data.id, message: finalizeData.message.trim() })).unwrap();
      }

      toast.success("Interview scheduled successfully!");
      setIsFinalizeModalOpen(false);
      setIsJobsModalOpen(false);
      setIsWizardOpen(false);
      // Refresh schedules if needed
      if (selectedCompanyId) {
        dispatch(fetchSchedules(Number(selectedCompanyId)));
      }
    } catch (error: any) {
      toast.error(error || "Failed to schedule interview");
    } finally {
      setIsSubmittingSchedule(false);
    }
  };

  const [jobUniversityFilter, setJobUniversityFilter] = useState<string>('all');

  const filteredSchedulerJobs = useMemo(() => {
    let result = schedulerJobs;
    
    if (isUniversityAdmin && universityId) {
      result = result.filter(item => item.university?.id === universityId);
    }

    if (isSuperAdmin && jobUniversityFilter !== 'all') {
      result = result.filter(item => item.university?.id === Number(jobUniversityFilter));
    }

    return result;
  }, [schedulerJobs, isUniversityAdmin, universityId, isSuperAdmin, jobUniversityFilter]);

  const schedulerUniversitiesForFilter = useMemo(() => {
    const uniMap = new Map();
    schedulerJobs.forEach(ju => {
      if (ju.university) {
        uniMap.set(ju.university.id, ju.university.name);
      }
    });
    return Array.from(uniMap.entries()).map(([id, name]) => ({ id, name }));
  }, [schedulerJobs]);

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
    <AdminPageLayout>
      <PageHeader
        title="Interview Scheduler"
        description="Coordinate and manage interview timelines for diverse recruitment drives."
        badge="Ops Center"
        icon={Calendar}
        variant="indigo"
      >
        <Button 
          onClick={() => setIsWizardOpen(true)}
          className="h-11 px-8 rounded-2xl bg-[#1A6CFF] hover:bg-[#0055FF] text-white font-black uppercase tracking-[0.15em] text-[10px] shadow-lg shadow-[#1A6CFF]/20 active:scale-95 transition-all flex items-center gap-2.5"
        >
          <Plus size={18} />
          Schedule Drive
        </Button>
      </PageHeader>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-card/50 backdrop-blur-md p-6 rounded-[2rem] border border-border shadow-sm mb-10">
        <div className="flex flex-wrap items-center gap-4">
          {isSuperAdmin && (
            <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border">
              <button
                onClick={() => setSchedulerType('companies')}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  schedulerType === 'companies' ? "bg-background shadow-lg text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Companies
              </button>
              <button
                onClick={() => setSchedulerType('universities')}
                className={cn(
                  "px-6 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all",
                  schedulerType === 'universities' ? "bg-background shadow-lg text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Universities
              </button>
            </div>
          )}

          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="w-full lg:w-[220px] h-12 rounded-2xl bg-background border-border text-xs font-black uppercase tracking-widest px-5 shadow-sm">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent className="rounded-2xl border-border shadow-2xl">
              <SelectItem value="all">All Registered Entities</SelectItem>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id.toString()}>
                  {company.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="relative w-full lg:w-[320px] group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search active timelines..."
            className="pl-11 pr-5 h-12 bg-background border-border rounded-2xl text-sm font-medium focus-visible:ring-primary/20 shadow-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-12">
        {/* Existing Schedules List */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
              <Calendar className="size-4" />
              Active Timelines
            </h2>
          </div>
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
                  <div className="bg-muted/10 p-6 lg:w-56 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-border shrink-0">
                    <div className="flex flex-col gap-3 w-full">
                      <Button 
                        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/10 transition-all flex items-center justify-center gap-2" 
                        onClick={(e) => handleOpenEdit(e, drive)}
                      >
                        <Edit3 size={14} />
                        Edit Schedule
                      </Button>
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          className="flex-1 h-10 rounded-xl border-border text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 hover:border-amber-500/20 transition-all flex items-center justify-center gap-2 text-[8px] font-black uppercase tracking-widest" 
                          onClick={(e) => handleOpenMessages(e, drive)}
                        >
                          <MessageSquare size={14} />
                          Notes
                        </Button>
                        <Button 
                          variant="outline" 
                          size="icon"
                          className="size-10 shrink-0 rounded-xl border-border text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all" 
                          onClick={(e) => {
                            e.stopPropagation();
                            const toastId = toast.loading("Removing schedule...");
                            dispatch(deleteSchedule(drive.id))
                              .unwrap()
                              .then(() => toast.success("Schedule deleted", { id: toastId }))
                              .catch((err) => toast.error(err || "Delete failed", { id: toastId }));
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                    <div className="size-10 rounded-xl bg-muted flex items-center justify-center text-muted-foreground cursor-pointer hover:bg-muted/50 transition-colors" onClick={(e) => { e.stopPropagation(); toggleExpand(drive.id); }}>
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
                                <div className="text-[10px] font-black text-primary uppercase tracking-widest">View Specs</div>
                              </div>
                            </div>
                          )) || <div className="col-span-full py-12 text-muted-foreground font-bold text-center italic text-sm saas-card bg-muted/10 border-dashed">No openings linked to this schedule.</div>}
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
      </section>
    </div>

      {/* Consolidated Schedule Wizard Modal */}
      <Modal
        isOpen={isWizardOpen}
        onClose={() => {
          setIsWizardOpen(false);
          setWizardCompanyId('');
          setWizardUniversityId('');
        }}
        title="Interview Scheduler"
        subtitle="Configure and launch new recruitment interview drives"
        maxWidth="max-w-5xl"
      >
        <div className="space-y-8 py-4">
          {/* Top Bar: Role-based Selection */}
          <div className="flex flex-col md:flex-row items-end gap-4 bg-muted/30 p-6 rounded-[2rem] border border-border">
            {isSuperAdmin && (
              <div className="flex-1 space-y-2">
                <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Target University</label>
                <Select value={wizardUniversityId} onValueChange={handleWizardUniversityChange}>
                  <SelectTrigger className="h-12 rounded-2xl bg-background border-border font-bold text-xs uppercase tracking-widest px-4">
                    <SelectValue placeholder="Select University" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl">
                    <SelectItem value="all">All Universities</SelectItem>
                    {schedulerUniversities.map((uni) => (
                      <SelectItem key={uni.id} value={uni.id.toString()}>{uni.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="flex-1 space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Select Company</label>
              <Select value={wizardCompanyId} onValueChange={handleWizardCompanyChange}>
                <SelectTrigger className="h-12 rounded-2xl bg-background border-border font-bold text-xs uppercase tracking-widest px-4">
                  <SelectValue placeholder="Select Company" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl">
                  {companies.map((c) => (
                    <SelectItem key={c.id} value={c.id.toString()}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {!wizardCompanyId ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="py-20 text-center border-2 border-dashed border-border rounded-[3rem] bg-muted/5"
              >
                <Building2 className="size-16 text-muted-foreground/20 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground">Awaiting Selection</h3>
                <p className="text-muted-foreground text-sm mt-2">Please select a company to begin scheduling interviews.</p>
              </motion.div>
            ) : schedulerLoading ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="h-32 rounded-[2.5rem] bg-muted animate-pulse" />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-48 rounded-[2rem] bg-muted animate-pulse" />
                  ))}
                </div>
              </motion.div>
            ) : schedulerJobs.length > 0 ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-8"
              >
                {/* Summary Card */}
                <div className="bg-primary/5 border border-primary/20 rounded-[2.5rem] p-8 flex flex-col md:flex-row items-center justify-between gap-6">
                  <div className="space-y-2 text-center md:text-left">
                    <h4 className="text-xl font-bold text-foreground tracking-tight">
                      {companies.find(c => c.id.toString() === wizardCompanyId)?.name} has <span className="text-primary">{schedulerJobs.length} jobs</span> available
                    </h4>
                    <p className="text-sm text-muted-foreground font-medium">Ready for interview scheduling across eligible departments.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-background rounded-2xl p-4 border border-border shadow-sm text-center min-w-[100px]">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Total</p>
                      <p className="text-xl font-black text-primary">{schedulerJobs.length}</p>
                    </div>
                    <div className="bg-background rounded-2xl p-4 border border-border shadow-sm text-center min-w-[100px]">
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">Active</p>
                      <p className="text-xl font-black text-emerald-600">{schedulerJobs.filter(j => j.status === 'APPROVED').length}</p>
                    </div>
                  </div>
                </div>

                {/* Jobs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[45vh] overflow-y-auto pr-2 custom-scrollbar">
                  {schedulerJobs.map((ju: any) => (
                    <motion.div
                      key={ju.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="saas-card bg-background hover:bg-muted/5 hover:border-primary/30 p-6 flex flex-col group transition-all duration-500"
                    >
                      <div className="flex justify-between items-start mb-6">
                        <div className="flex items-center gap-4">
                          <div className="size-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary font-bold text-lg group-hover:scale-110 transition-transform shadow-inner">
                            {ju.job?.title?.[0] || 'J'}
                          </div>
                          <div>
                            <h5 className="font-bold text-foreground text-base tracking-tight">{ju.job?.title}</h5>
                            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">{ju.university?.name || "Global"}</p>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                          {ju.status}
                        </Badge>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-6">
                        {(ju.job?.eligibleDepartments || []).map((dept: any) => (
                          <Badge key={dept.id} variant="outline" className="bg-muted/30 border-border text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                            {dept.name || `Dept #${dept.id}`}
                          </Badge>
                        ))}
                      </div>

                      <div className="grid grid-cols-2 gap-4 py-4 border-y border-border/50 mb-6 bg-muted/5 rounded-2xl px-4">
                        <div className="space-y-1 text-center md:text-left">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">LPA Package</p>
                          <p className="text-xs font-bold text-emerald-600">₹ {(ju.salary / 100000).toFixed(1)} LPA</p>
                        </div>
                        <div className="space-y-1 text-center md:text-right">
                          <p className="text-[8px] font-black text-muted-foreground uppercase tracking-widest">Openings</p>
                          <p className="text-xs font-bold text-foreground">{ju.openings} Seats</p>
                        </div>
                      </div>

                      <Button 
                        onClick={() => handleScheduleClick(ju)}
                        className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-11 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/10 group-hover:shadow-none transition-all flex items-center justify-center gap-2"
                      >
                        <Calendar size={14} />
                        Launch Interview
                      </Button>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="py-24 text-center bg-muted/10 rounded-[3rem] border border-dashed border-border"
              >
                <div className="size-20 bg-muted/30 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6">
                  <Briefcase className="size-10 text-muted-foreground/30" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-1">No Active Jobs</h3>
                <p className="text-muted-foreground text-sm max-w-xs mx-auto mb-8">
                  We couldn't find any approved job openings for this company that are ready for scheduling.
                </p>
                <Button 
                  variant="outline" 
                  className="rounded-xl px-8 border-border font-bold text-xs uppercase tracking-widest h-11"
                  onClick={() => setWizardCompanyId('')}
                >
                  Change Company
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Modal>

      {/* Jobs Selection Modal - DEPRECATED in favor of Wizard, but kept for legacy fallback if needed */}
      {/* (Removed as it's now integrated) */}

      {/* Finalize Schedule Modal */}
      <Modal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        title="Drive Logistics"
        subtitle="Finalize the interview schedule details"
      >
        <div className="space-y-6 py-4">
          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Drive Title</label>
            <Input 
              value={finalizeData.title}
              onChange={(e) => setFinalizeData({...finalizeData, title: e.target.value})}
              placeholder="e.g. Campus Recruitment 2024"
              className="h-14 rounded-2xl bg-[#F8FAFC] border-slate-200/60 font-medium focus:ring-[#1A6CFF]/10 text-slate-700"
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Start Time</label>
              <Input 
                type="datetime-local"
                value={finalizeData.startTime}
                onChange={(e) => setFinalizeData({...finalizeData, startTime: e.target.value})}
                className="h-14 rounded-2xl bg-[#F8FAFC] border-slate-200/60 font-medium text-slate-700"
              />
            </div>
            <div className="space-y-3">
              <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">End Time</label>
              <Input 
                type="datetime-local"
                value={finalizeData.endTime}
                onChange={(e) => setFinalizeData({...finalizeData, endTime: e.target.value})}
                className="h-14 rounded-2xl bg-[#F8FAFC] border-slate-200/60 font-medium text-slate-700"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Venue / Link</label>
            <Input 
              value={finalizeData.venue}
              onChange={(e) => setFinalizeData({...finalizeData, venue: e.target.value})}
              placeholder="e.g. Main Auditorium or G-Meet Link"
              className="h-14 rounded-2xl bg-[#F8FAFC] border-slate-200/60 font-medium text-slate-700"
            />
          </div>

          <div className="space-y-3">
            <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.1em] ml-1">Custom Instructions</label>
            <Textarea 
              placeholder="Add any specific details or requirements for the candidates..."
              value={finalizeData.message}
              onChange={(e) => setFinalizeData({...finalizeData, message: e.target.value})}
              className="min-h-[120px] rounded-2xl bg-[#F8FAFC] border-slate-200/60 font-medium resize-none focus:ring-[#1A6CFF]/10 p-5 text-slate-700"
            />
          </div>

          <div className="pt-6 space-y-4">
            <Button 
              onClick={handleFinalSubmit}
              disabled={isSubmittingSchedule}
              className="w-full h-14 bg-[#1A6CFF] hover:bg-[#0055FF] text-white rounded-2xl font-black uppercase tracking-[0.15em] text-[11px] shadow-[0_12px_24px_rgba(26,108,255,0.3)] hover:shadow-[0_15px_30px_rgba(26,108,255,0.4)] active:scale-[0.98] transition-all duration-300"
            >
              {isSubmittingSchedule ? <Loader size="sm" /> : "Confirm & Schedule"}
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setIsFinalizeModalOpen(false)}
              className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 hover:text-foreground hover:bg-transparent transition-all"
            >
              Back to jobs
            </Button>
          </div>
        </div>
      </Modal>

      <EditScheduleModal
        schedule={selectedSchedule}
        open={isEditModalOpen}
        onOpenChange={setIsEditModalOpen}
        mode={mode}
      />

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