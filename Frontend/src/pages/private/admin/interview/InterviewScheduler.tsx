import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Edit3, Building2, Clock, 
  MapPin, Briefcase, ChevronDown, ChevronUp, 
  Search, MessageSquare, Send, Trash2,
  Calendar,
  Sparkles
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
    venue: ''
  });
  const [isSubmittingSchedule, setIsSubmittingSchedule] = useState(false);

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

  const handleEntityClick = (entity: any) => {
    setSelectedEntity(entity);
    if (schedulerType === 'companies') {
      dispatch(fetchCompanyJobsForSchedule(entity.id));
    } else {
      dispatch(fetchUniversityJobsForSchedule({ universityId: entity.id }));
    }
    setIsJobsModalOpen(true);
  };

  const handleScheduleClick = (job: any) => {
    setSelectedJobToSchedule(job);
    setFinalizeData({
      title: `${job.job?.title || 'Drive'} @ ${job.university?.name || job.job?.company?.name || 'Campus'}`,
      startTime: '',
      endTime: '',
      venue: ''
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

      await dispatch(createSchedule(payload)).unwrap();
      toast.success("Interview scheduled successfully!");
      setIsFinalizeModalOpen(false);
      setIsJobsModalOpen(false);
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
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          {isSuperAdmin && (
            <div className="flex bg-muted/50 p-1 rounded-xl border border-border mr-2">
              <button
                onClick={() => setSchedulerType('companies')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  schedulerType === 'companies' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Companies
              </button>
              <button
                onClick={() => setSchedulerType('universities')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
                  schedulerType === 'universities' ? "bg-background shadow-sm text-primary" : "text-muted-foreground hover:text-foreground"
                )}
              >
                Universities
              </button>
            </div>
          )}

          <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
            <SelectTrigger className="w-full sm:w-[180px] h-10 rounded-xl bg-background/50 border-border text-xs font-black uppercase tracking-widest px-4">
              <SelectValue placeholder="Filter By" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="all">All Companies</SelectItem>
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
              placeholder="Search..."
              className="pl-9 bg-background/50 border-border rounded-xl h-10 text-sm focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </PageHeader>

      <div className="space-y-12">
        {/* Entity Selection Flow */}
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground flex items-center gap-3">
              <span className="size-2 rounded-full bg-primary animate-pulse" />
              Schedule New Drive
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {schedulerLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-48 rounded-[2rem] bg-muted/20 animate-pulse border border-dashed border-border" />
              ))
            ) : (
              (schedulerType === 'companies' ? schedulerCompanies : schedulerUniversities).map((item) => (
                <motion.div
                  key={item.id}
                  whileHover={{ y: -5, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleEntityClick(item)}
                  className="group relative cursor-pointer"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-transparent rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="saas-card p-8 h-full flex flex-col items-center justify-center text-center gap-4 border-2 border-transparent group-hover:border-primary/20 transition-all bg-background/50 backdrop-blur-xl">
                    <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
                      {schedulerType === 'companies' ? <Building2 size={32} /> : <Sparkles size={32} />}
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{item.name}</h4>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        {schedulerType === 'companies' ? item.user?.email : `${item.city}, ${item.state}`}
                      </p>
                    </div>
                    <div className="pt-4 mt-auto">
                      <span className="px-4 py-1.5 rounded-xl bg-muted text-[9px] font-black uppercase tracking-widest text-muted-foreground group-hover:bg-primary group-hover:text-white transition-all">
                        Fetch Jobs
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        <Separator className="opacity-50" />

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
                        className="size-10 rounded-xl border-border text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all" 
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

      {/* Jobs Selection Modal */}
      <Modal
        isOpen={isJobsModalOpen}
        onClose={() => setIsJobsModalOpen(false)}
        title={`Available Jobs`}
        subtitle={`Recruitment opportunities for ${selectedEntity?.name}`}
        maxWidth="sm:max-w-4xl"
      >
        <div className="space-y-6 py-4">
          {isSuperAdmin && schedulerType === 'companies' && schedulerUniversitiesForFilter.length > 0 && (
            <div className="flex items-center gap-3 mb-4">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">Filter by University:</label>
              <Select value={jobUniversityFilter} onValueChange={setJobUniversityFilter}>
                <SelectTrigger className="w-[200px] h-8 rounded-lg text-[10px] font-bold uppercase tracking-widest px-3">
                  <SelectValue placeholder="All Universities" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Universities</SelectItem>
                  {schedulerUniversitiesForFilter.map((uni) => (
                    <SelectItem key={uni.id} value={uni.id.toString()}>
                      {uni.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {schedulerLoading ? (
            <div className="py-20 flex justify-center">
              <Loader text="Loading opportunities..." />
            </div>
          ) : filteredSchedulerJobs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
              {filteredSchedulerJobs.map((ju: any) => (
                <div key={ju.id} className="saas-card bg-muted/10 p-6 space-y-4 hover:border-primary/30 transition-all group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h4 className="font-bold text-foreground group-hover:text-primary transition-colors">{ju.job?.title}</h4>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest flex items-center gap-1.5">
                        <Building2 size={10} /> {ju.job?.company?.name || selectedEntity?.name}
                      </p>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-1.5">
                        <Sparkles size={10} /> {ju.university?.name || selectedEntity?.name}
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/10 text-[8px] font-black px-2 py-0.5">
                      {ju.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/50">
                    <div className="space-y-0.5">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.15em]">Package</p>
                      <p className="text-xs font-bold text-emerald-600">₹ {(ju.salary / 100000).toFixed(1)} LPA</p>
                    </div>
                    <div className="space-y-0.5 text-right">
                      <p className="text-[8px] font-black text-muted-foreground uppercase tracking-[0.15em]">Openings</p>
                      <p className="text-xs font-bold text-foreground">{ju.openings} Seats</p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] text-muted-foreground line-clamp-2 italic font-medium leading-relaxed">
                      {ju.description || "No specific drive description provided."}
                    </p>
                  </div>

                  <Button 
                    onClick={() => handleScheduleClick(ju)}
                    className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-10 font-black uppercase tracking-widest text-[9px] shadow-lg shadow-primary/5 group-hover:shadow-primary/20 transition-all"
                  >
                    Schedule Interview
                  </Button>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/10 rounded-[2rem] border border-dashed border-border">
              <Briefcase className="size-12 text-muted-foreground/20 mx-auto mb-4" />
              <p className="text-muted-foreground text-xs font-black uppercase tracking-widest">No active job listings found.</p>
            </div>
          )}
        </div>
      </Modal>

      {/* Finalize Schedule Modal */}
      <Modal
        isOpen={isFinalizeModalOpen}
        onClose={() => setIsFinalizeModalOpen(false)}
        title="Drive Logistics"
        subtitle="Finalize the interview schedule details"
      >
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Drive Title</label>
            <Input 
              value={finalizeData.title}
              onChange={(e) => setFinalizeData({...finalizeData, title: e.target.value})}
              placeholder="e.g. Campus Recruitment 2024"
              className="h-12 rounded-xl bg-muted/30 border-border font-medium focus:ring-primary/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Start Time</label>
              <Input 
                type="datetime-local"
                value={finalizeData.startTime}
                onChange={(e) => setFinalizeData({...finalizeData, startTime: e.target.value})}
                className="h-12 rounded-xl bg-muted/30 border-border font-medium"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">End Time</label>
              <Input 
                type="datetime-local"
                value={finalizeData.endTime}
                onChange={(e) => setFinalizeData({...finalizeData, endTime: e.target.value})}
                className="h-12 rounded-xl bg-muted/30 border-border font-medium"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-muted-foreground uppercase tracking-widest ml-1">Venue / Link</label>
            <Input 
              value={finalizeData.venue}
              onChange={(e) => setFinalizeData({...finalizeData, venue: e.target.value})}
              placeholder="e.g. Main Auditorium or G-Meet Link"
              className="h-12 rounded-xl bg-muted/30 border-border font-medium"
            />
          </div>

          <div className="pt-4 space-y-3">
            <Button 
              onClick={handleFinalSubmit}
              disabled={isSubmittingSchedule}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-white rounded-xl font-black uppercase tracking-widest text-[10px] shadow-xl shadow-primary/20 transition-all"
            >
              {isSubmittingSchedule ? <Loader size="sm" /> : "Confirm & Schedule"}
            </Button>
            <Button 
              variant="ghost"
              onClick={() => setIsFinalizeModalOpen(false)}
              className="w-full h-10 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground"
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