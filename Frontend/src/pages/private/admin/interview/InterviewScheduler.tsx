import React, { useState, useEffect } from 'react';
import { 
  Plus, Calendar, Edit3, Building2, Clock, 
  MapPin, Layers, Users, Briefcase, ChevronDown, ChevronUp, 
  Trash2, PlusCircle, CheckCircle2, AlertCircle, Search, 
  Building, Users2, CheckSquare
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from 'framer-motion';

import { EditScheduleModal } from './components/EditScheduleModal';
import { SlotManagementModal } from './components/SlotManagementModal';

import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '@/redux/store/store';
import { fetchSchedules, deleteSchedule } from '@/redux/thunks/interviewThunk';
import { toast } from 'sonner';

const InterviewSchedulerPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { schedules, loading } = useSelector((state: RootState) => state.interview);

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isSlotModalOpen, setIsSlotModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any>(null);
  const [mode, setMode] = useState<'create' | 'edit'>('edit');

  useEffect(() => {
    dispatch(fetchSchedules());
  }, [dispatch]);

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

  const handleOpenSlots = (e: React.MouseEvent, schedule: any) => {
    e.stopPropagation();
    setSelectedSchedule(schedule);
    setIsSlotModalOpen(true);
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
      fullDate: date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
    };
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const filteredSchedules = Array.isArray(schedules) ? schedules.filter(s => 
    s.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  ) : [];

  // Metrics calculation
  const totalApplicants = filteredSchedules.reduce((acc, s) => acc + (s._count?.applications || 0), 0);
  const totalShortlisted = filteredSchedules.reduce((acc, s) => acc + (s._count?.shortlisted || 0), 0);
  const totalSlots = filteredSchedules.reduce((acc, s) => acc + (s.slots?.length || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50/40 p-4 md:p-8 space-y-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Interview Scheduler</h1>
            <p className="text-slate-500 mt-1 font-medium">Manage and organize campus recruitment drives efficiently</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search drives..." 
                className="pl-10 w-full md:w-[300px] border-none bg-white shadow-sm ring-1 ring-slate-200 focus:ring-primary/40 rounded-xl"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleOpenCreate} className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 shadow-lg shadow-primary/20 transition-all active:scale-[0.98]">
              <Plus className="w-4 h-4 mr-2" /> New Drive
            </Button>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Total Applicants', value: totalApplicants, icon: Users2, color: 'blue' },
            { label: 'Shortlisted', value: totalShortlisted, icon: CheckCircle2, color: 'emerald' },
            { label: 'Total Slots', value: totalSlots, icon: Calendar, color: 'indigo' },
          ].map((stat, i) => (
            <Card key={i} className="border-none shadow-sm bg-white overflow-hidden">
              <CardContent className="p-6 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                  <p className="text-3xl font-black text-slate-900">{stat.value}</p>
                </div>
                <div className={cn(
                  "p-4 rounded-2xl shadow-inner",
                  stat.color === 'blue' ? "bg-blue-50 text-blue-600" :
                  stat.color === 'emerald' ? "bg-emerald-50 text-emerald-600" :
                  "bg-indigo-50 text-indigo-600"
                )}>
                  <stat.icon size={28} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Drives List */}
        <div className="space-y-4">
          {loading ? (
             <div className="flex flex-col items-center justify-center py-20 bg-white/50 rounded-3xl border border-white">
                <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-4" />
                <p className="text-slate-500 font-bold animate-pulse">Syncing data...</p>
             </div>
          ) : filteredSchedules.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-[2rem] border-2 border-dashed border-slate-200 shadow-sm">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Calendar className="text-slate-200" size={40} />
               </div>
               <h3 className="text-xl font-bold text-slate-900">No active drives found</h3>
               <p className="text-slate-500 max-w-xs mx-auto mt-2">Create your first interview schedule to start tracking candidates.</p>
               <Button variant="outline" onClick={handleOpenCreate} className="mt-8 rounded-xl border-slate-200 hover:bg-slate-50">
                <Plus size={16} className="mr-2" /> Start Now
               </Button>
            </div>
          ) : filteredSchedules.map((drive) => {
            const dateInfo = formatDate(drive.startTime);
            const isExpanded = expandedId === drive.id;

            return (
              <Card 
                key={drive.id} 
                className={cn(
                  "border-none shadow-sm transition-all duration-500 overflow-hidden group",
                  isExpanded ? "ring-2 ring-primary/20 shadow-2xl scale-[1.01]" : "hover:shadow-md"
                )}
              >
                <CardContent className="p-0">
                  {/* Main Header Card Content */}
                  <div 
                    className="flex flex-col lg:flex-row cursor-pointer select-none"
                    onClick={() => toggleExpand(drive.id)}
                  >
                    {/* Left: Modern Date Info Box */}
                    <div className="bg-slate-50 lg:w-36 p-6 flex flex-row lg:flex-col items-center justify-center border-b lg:border-b-0 lg:border-r border-slate-100/80 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-primary rounded-r-full" />
                      <span className="text-xs font-black text-slate-400 uppercase tracking-tighter mb-1">{dateInfo.month}</span>
                      <span className="text-4xl font-black text-slate-900 group-hover:text-primary transition-colors leading-none">{dateInfo.day}</span>
                      <span className="text-[11px] font-bold text-slate-500 uppercase mt-2 tracking-widest">{dateInfo.weekday}</span>
                    </div>

                    {/* Center: Content Body */}
                    <div className="flex-1 p-6 md:p-8 flex flex-col justify-center space-y-6">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div className="space-y-2">
                          <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight">{drive.title}</h3>
                          <div className="flex items-center gap-2 text-primary font-bold text-sm bg-primary/5 px-3 py-1.5 rounded-full w-fit">
                            <Building2 size={16} />
                            {drive.company?.name || "Corporate Partner"}
                          </div>
                        </div>
                        <div className="flex flex-col items-start md:items-end gap-2 text-right">
                          <Badge className={cn(
                            "px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border-none shadow-sm",
                            drive.status === 'COMPLETED' ? "bg-emerald-500/10 text-emerald-600" :
                            drive.status === 'ONGOING' ? "bg-sky-500/10 text-sky-600" :
                            "bg-amber-500/10 text-amber-600"
                          )}>
                            {drive.status}
                          </Badge>
                          <span className="text-[10px] font-black text-slate-400 uppercase">Status updated recently</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Time</span>
                          <div className="flex items-center gap-2 text-slate-700">
                             <Clock size={16} className="text-primary" />
                             <span className="text-sm font-bold">{formatTime(drive.startTime)} - {formatTime(drive.endTime)}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Location</span>
                          <div className="flex items-center gap-2 text-slate-700">
                             <MapPin size={16} className="text-rose-500" />
                             <span className="text-sm font-bold truncate max-w-[120px]">{drive.venue}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Students</span>
                          <div className="flex items-center gap-2 text-slate-700">
                             <Users size={16} className="text-indigo-500" />
                             <span className="text-sm font-bold">{drive._count?.applications || 0} / {drive._count?.shortlisted || 0}</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Roles</span>
                          <div className="flex items-center gap-2 text-slate-700">
                             <Briefcase size={16} className="text-amber-500" />
                             <span className="text-sm font-bold">{drive.jobs?.length || 0} Jobs</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right: Modern Action Stack */}
                    <div className="bg-slate-50/50 p-6 lg:w-72 flex lg:flex-col gap-3 justify-center border-t lg:border-t-0 lg:border-l border-slate-100">
                      <div className="grid grid-cols-1 gap-2">
                         <Button variant="default" className="w-full bg-slate-900 hover:bg-black text-white rounded-xl h-11 text-xs font-black uppercase tracking-widest shadow-lg shadow-slate-200" onClick={(e) => { e.stopPropagation(); }}>
                           Manage Jobs
                         </Button>
                         <Button variant="outline" className="w-full bg-white hover:bg-slate-50 border-slate-200 text-slate-900 rounded-xl h-11 text-xs font-black uppercase tracking-widest" onClick={(e) => handleOpenSlots(e, drive)}>
                           Manage Slots
                         </Button>
                      </div>
                      
                      <div className="flex items-center justify-between gap-2 pt-4 mt-2 border-t border-slate-200/50">
                        <div className="flex gap-2">
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-primary hover:bg-primary/5 rounded-xl transition-all" onClick={(e) => handleOpenEdit(e, drive)}>
                            <Edit3 size={18} />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-10 w-10 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" onClick={(e) => handleDelete(e, drive.id)}>
                            <Trash2 size={18} />
                          </Button>
                        </div>
                        <div className="w-10 h-10 rounded-xl bg-slate-200/50 flex items-center justify-center text-slate-500">
                           {isExpanded ? <ChevronUp size={22} /> : <ChevronDown size={22} />}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Expandable Drilldown Content */}
                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                        className="border-t border-slate-100 bg-white"
                      >
                        <div className="p-10 space-y-12 bg-gradient-to-b from-white to-slate-50/30">
                          {/* Jobs Grid */}
                          <section className="space-y-6">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-2xl">
                                  <Briefcase size={20} />
                                </div>
                                <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Job Openings</h4>
                              </div>
                              <Button variant="ghost" size="sm" className="font-bold text-primary hover:bg-primary/5 rounded-lg">View All Jobs</Button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                              {drive.jobs?.map((job: any) => (
                                <div key={job.id} className="p-6 rounded-2xl border border-slate-100 bg-white shadow-sm hover:ring-2 hover:ring-primary/20 transition-all space-y-4">
                                  <div className="space-y-1">
                                    <p className="font-black text-slate-900 text-base">{job.title}</p>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{job.jobType} • {job.location}</p>
                                  </div>
                                  <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                                    <Badge variant="outline" className="rounded-lg text-[9px] font-black tracking-widest border-slate-200">{job.status}</Badge>
                                    <div className="flex items-center gap-1.5 text-slate-500">
                                      <Users size={12} />
                                      <span className="text-[10px] font-black uppercase tracking-tight">{job._count?.applications || 0} Candidates</span>
                                    </div>
                                  </div>
                                </div>
                              )) || <div className="col-span-full py-8 text-slate-400 font-bold text-center italic">No jobs linked.</div>}
                            </div>
                          </section>

                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                            {/* Slots Console */}
                            <section className="space-y-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2.5 bg-violet-50 text-violet-600 rounded-2xl">
                                    <Calendar size={20} />
                                  </div>
                                  <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Interview Console</h4>
                                </div>
                                <Button size="sm" onClick={(e) => handleOpenSlots(e, drive)} className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold text-[10px] uppercase h-9">
                                  <PlusCircle size={14} className="mr-2" /> Add Slot
                                </Button>
                              </div>
                              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                 {drive.slots?.length > 0 ? drive.slots.map((slot: any) => (
                                   <div key={slot.id} className="p-4 rounded-2xl border border-slate-100 bg-white flex items-center justify-between group/slot hover:border-violet-200 transition-all">
                                      <div className="flex items-center gap-4">
                                        <div className="w-1.5 h-10 bg-violet-500 rounded-full" />
                                        <div>
                                          <p className="font-black text-slate-900 tracking-tight">{formatTime(slot.startTime)} - {formatTime(slot.endTime)}</p>
                                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Capacity: {slot.capacity || 20} Students</p>
                                        </div>
                                      </div>
                                      <div className="flex items-center gap-2">
                                         <Badge className="bg-slate-100 text-slate-600 border-none font-bold text-[10px] uppercase tracking-widest px-3">
                                            {slot._count?.students || 0} Filled
                                         </Badge>
                                         <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-300 hover:text-rose-500 rounded-lg">
                                           <Trash2 size={14} />
                                         </Button>
                                      </div>
                                   </div>
                                 )) : (
                                   <div className="py-12 bg-slate-50 rounded-3xl border-2 border-dotted border-slate-200 flex flex-col items-center justify-center text-slate-400">
                                      <Clock size={32} className="mb-3 opacity-20" />
                                      <p className="text-xs font-black uppercase tracking-widest">No slots configured</p>
                                   </div>
                                 )}
                              </div>
                            </section>

                            {/* Students Board */}
                            <section className="space-y-6">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="p-2.5 bg-emerald-50 text-emerald-600 rounded-2xl">
                                    <Users size={20} />
                                  </div>
                                  <h4 className="text-lg font-black text-slate-900 tracking-tight uppercase">Shortlist Queue</h4>
                                </div>
                                <Button variant="outline" size="sm" className="border-emerald-200 text-emerald-600 hover:bg-emerald-50 rounded-xl font-bold text-[10px] uppercase h-9">
                                  Export List
                                </Button>
                              </div>
                              <div className="bg-slate-50/50 rounded-3xl p-6 border border-slate-100">
                                <div className="flex flex-wrap gap-2.5">
                                  {drive.shortlistedStudents?.length > 0 ? drive.shortlistedStudents.map((student: any) => (
                                    <div key={student.id} className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all cursor-default">
                                       <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-black text-slate-500">
                                         {student.name.charAt(0)}
                                       </div>
                                       <span className="text-xs font-bold text-slate-700">{student.name}</span>
                                       <CheckSquare size={12} className="text-emerald-500" />
                                    </div>
                                  )) : (
                                    <div className="w-full flex flex-col items-center justify-center py-10 text-slate-400 italic">
                                       <AlertCircle size={24} className="mb-2 opacity-50" />
                                       <p className="text-xs font-black uppercase tracking-widest">Awaiting shortlist results</p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </section>
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

      <SlotManagementModal
        schedule={selectedSchedule}
        open={isSlotModalOpen}
        onOpenChange={setIsSlotModalOpen}
      />
    </div>
  );
};

export default InterviewSchedulerPage;