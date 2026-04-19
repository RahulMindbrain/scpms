import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, Edit3, Building2, Clock, 
  MapPin, Briefcase, ChevronDown, ChevronUp, 
  Trash2, Search, Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

import { EditScheduleModal } from './components/EditScheduleModal';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store/store';
import { fetchSchedules, deleteSchedule, fetchSchedulesByCompany } from '@/redux/thunks/interviewThunk';
import { fetchCompanies } from '@/redux/thunks/companyThunk';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const InterviewSchedulerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, loading } = useSelector((state: RootState) => state.interview);
  const { companies } = useSelector((state: RootState) => state.company);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('all');
  
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('edit');

  useEffect(() => {
    dispatch(fetchCompanies({ page: 1, limit: 100 }));
  }, [dispatch]);

  useEffect(() => {
    if (selectedCompanyId === 'all') {
      dispatch(fetchSchedules());
    } else {
      dispatch(fetchSchedulesByCompany(Number(selectedCompanyId)));
    }
  }, [dispatch, selectedCompanyId]);

  const toggleExpand = (id: string) => {
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

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this schedule?")) {
      try {
        await dispatch(deleteSchedule(id)).unwrap();
        toast.success("Schedule deleted successfully");
      } catch (err) {
        toast.error("Failed to delete schedule");
      }
    }
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

  const filteredSchedules = Array.isArray(schedules) ? schedules.filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  return (
    <div className="min-h-screen bg-slate-50/40 p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6 md:space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">Interview Scheduler</h1>
            <p className="text-slate-500 text-sm sm:text-base font-medium">Manage recruitment drives efficiently</p>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Select value={selectedCompanyId} onValueChange={setSelectedCompanyId}>
                <SelectTrigger className="w-full sm:w-[180px] border-none bg-white shadow-sm ring-1 ring-slate-200 rounded-xl h-11">
                  <SelectValue placeholder="All Companies" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Companies</SelectItem>
                  {companies.map((company) => (
                    <SelectItem key={company.id} value={company.id.toString()}>
                      {company.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search drives..." 
                className="pl-10 w-full sm:w-[200px] md:w-[250px] border-none bg-white shadow-sm ring-1 ring-slate-200 focus:ring-primary/40 rounded-xl h-11"
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
             <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-white">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-bold animate-pulse">Syncing data...</p>
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
                    <div className="bg-slate-50 lg:w-32 p-4 sm:p-6 flex flex-row lg:flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100/80 relative gap-3 sm:gap-1">
                      <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r-full" />
                      <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-tighter">{dateInfo.month}</span>
                      <span className="text-2xl sm:text-4xl font-black text-slate-900 group-hover:text-primary transition-colors leading-none">{dateInfo.day}</span>
                      <span className="text-[10px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-widest">{dateInfo.weekday}</span>
                    </div>

                    {/* Content Body */}
                    <div className="flex-1 p-5 sm:p-6 md:p-8 flex flex-col justify-center space-y-4 sm:space-y-6">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">{drive.title}</h3>
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
                                <span className="text-[9px] font-black text-slate-400 uppercase">Timing</span>
                                <span className="text-xs sm:text-sm font-bold text-slate-700">{formatTime(drive.startTime)} - {formatTime(drive.endTime)}</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-100 rounded-lg text-rose-500"><MapPin size={16} /></div>
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase">Venue</span>
                                <span className="text-xs sm:text-sm font-bold text-slate-700 truncate max-w-[150px]">{drive.venue}</span>
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                             <div className="p-2 bg-slate-100 rounded-lg text-amber-500"><Briefcase size={16} /></div>
                             <div className="flex flex-col">
                                <span className="text-[9px] font-black text-slate-400 uppercase">Openings</span>
                                <span className="text-xs sm:text-sm font-bold text-slate-700">{drive.jobs?.length || 0} Roles</span>
                             </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Bar / Stack */}
                    <div className="bg-slate-50/50 p-4 sm:p-6 lg:w-44 flex flex-row lg:flex-col items-center justify-between lg:justify-center gap-4 border-t lg:border-t-0 lg:border-l border-slate-100">
                      <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" onClick={(e) => handleOpenEdit(e, drive)}>
                          <Edit3 size={18} />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-9 w-9 sm:h-10 sm:w-10 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" onClick={(e) => handleDelete(e, drive.id)}>
                          <Trash2 size={18} />
                        </Button>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-500">
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
                        className="border-t border-slate-100 bg-white"
                      >
                        <div className="p-5 sm:p-8 md:p-10 space-y-6 bg-gradient-to-b from-white to-slate-50/30">
                          <div className="flex items-center gap-3">
                            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                              <Briefcase size={20} />
                            </div>
                            <h4 className="text-base sm:text-lg font-black text-slate-900 tracking-tight uppercase">Job Openings</h4>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                            {drive.jobs?.map((job: any) => (
                              <div key={job.id} className="p-5 sm:p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:ring-2 hover:ring-primary/20 transition-all space-y-4">
                                <div className="space-y-1">
                                  <p className="font-black text-slate-900 text-sm sm:text-base">{job.title}</p>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{job.jobType} • {job.location}</p>
                                </div>
                                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                  <Badge variant="outline" className="rounded-lg text-[8px] sm:text-[9px] font-black tracking-widest border-slate-200">{job.status}</Badge>
                                  <div className="flex items-center gap-1.5 text-slate-500">
                                    <Users size={12} />
                                    <span className="text-[9px] font-black uppercase tracking-tight">{job._count?.applications || 0} Candidates</span>
                                  </div>
                                </div>
                              </div>
                            )) || <div className="col-span-full py-8 text-slate-400 font-bold text-center italic text-sm">No jobs linked.</div>}
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
    </div>
  );
};

export default InterviewSchedulerPage;