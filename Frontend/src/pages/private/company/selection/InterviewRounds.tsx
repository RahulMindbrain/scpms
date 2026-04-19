import React, { useState, useEffect } from 'react';
import {
  Calendar, Clock, MapPin, MessageSquareQuote,
  CheckCircle2, XCircle, Send,
  Info, Bell, User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSchedulesByCompany, approveSchedule, fetchScheduleMessages, sendScheduleMessage } from '@/redux/thunks/interviewThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';



// Types aligning with your Prisma Schema
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

  // Sync selected schedule with redux state to reflect new messages
  const activeSchedule = schedules.find(s => s.id === selectedSchedule?.id) || selectedSchedule;


  useEffect(() => {
    dispatch(fetchSchedulesByCompany());
  }, [dispatch]);

  const handleUpdateStatus = async (id: number, status: 'APPROVED' | 'REJECTED') => {
    try {
      await dispatch(approveSchedule({ id, status, reason: status === 'REJECTED' ? declineReason : undefined })).unwrap();
      toast.success(`Schedule ${status.toLowerCase()} successfully`);
      setIsRejectModalOpen(false);
      setDeclineReason('');
    } catch (error: any) {
      toast.error(error || `Failed to ${status.toLowerCase()} schedule`);
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



  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-10 space-y-10 font-sans">

      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
            <Bell className="w-4 h-4 animate-bounce" /> Action Required
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Interview Pipeline</h1>
          <p className="text-slate-500 font-medium">Manage and approve placement drive schedules</p>
        </div>

        <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-sm border border-slate-100">
          <div className="flex -space-x-3 pl-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="w-10 h-10 rounded-full border-4 border-white bg-slate-200 flex items-center justify-center overflow-hidden">
                <User className="w-5 h-5 text-slate-400" />
              </div>
            ))}
          </div>
          <div className="pr-4 py-1">
            <p className="text-xs font-bold text-slate-400 uppercase">Coordinators</p>
            <p className="text-sm font-black text-slate-800">3 Active Admins</p>
          </div>
        </div>
      </div>

      {/* Stats Quick Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {['Total Drives', 'Pending Approval', 'Active Students'].map((label, idx) => (
          <div key={idx} className="bg-white/50 backdrop-blur-xl border border-white rounded-[2.5rem] p-8 shadow-xl shadow-slate-200/40 group hover:bg-white transition-all cursor-default">
            <p className="text-slate-500 font-bold text-sm mb-1">{label}</p>
            <p className="text-3xl font-black text-slate-900">{[12, 1, 145][idx]}</p>
          </div>
        ))}
      </div>

      {/* Main List */}
      <div className="space-y-6">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : schedules.length > 0 ? (
          schedules.map((schedule) => (
            <div key={schedule.id} className="relative group">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-[3rem] opacity-0 group-hover:opacity-10 transition duration-500"></div>

              <div className="relative bg-white border border-slate-100 rounded-[3rem] p-10 flex flex-col lg:flex-row items-center gap-10 shadow-xl shadow-slate-200/30">

                {/* Date Block */}
                <div className="bg-slate-50 rounded-[2.5rem] p-6 flex flex-col items-center justify-center min-w-[120px] aspect-square text-center">

                  <span className="text-blue-600 font-black text-3xl">
                    {new Date(schedule.startTime).getDate()}
                  </span>
                  <span className="text-slate-400 font-bold uppercase text-xs tracking-tighter">
                    {new Date(schedule.startTime).toLocaleString('default', { month: 'short' })} '{new Date(schedule.startTime).getFullYear().toString().slice(-2)}
                  </span>
                </div>


                {/* Main Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex flex-wrap items-center gap-3">
                    <Badge className="bg-blue-50 text-blue-600 border-blue-100 px-4 py-1.5 rounded-xl font-bold">
                      {schedule.jobTitle}
                    </Badge>
                    <Badge variant="outline" className="border-slate-200 text-slate-500 px-4 py-1.5 rounded-xl">
                      ID: #{schedule.id}
                    </Badge>
                  </div>

                  <h2 className="text-2xl font-black text-slate-800">{schedule.title}</h2>

                  <div className="flex flex-wrap gap-6">
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <Clock className="w-5 h-5 text-blue-500" />
                      {new Date(schedule.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -
                      {new Date(schedule.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 font-medium">
                      <MapPin className="w-5 h-5 text-blue-500" /> {schedule.venue || 'TBA'}
                    </div>
                  </div>

                </div>


                {/* Interaction Zone */}
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto border-t lg:border-t-0 lg:border-l border-slate-100 pt-8 lg:pt-0 lg:pl-10">

                  {/* Admin Note Bubble */}
                  <button
                    onClick={() => handleOpenDrawer(schedule)}
                    className="relative p-5 bg-amber-50 rounded-2xl border border-amber-100 group/note hover:bg-amber-100 transition-colors text-left"
                  >
                    <MessageSquareQuote className="w-6 h-6 text-amber-600 mb-2" />
                    <p className="text-xs font-black text-amber-800 uppercase leading-none">Admin Note</p>
                    <p className="text-[10px] text-amber-600 font-bold">{schedule.messages?.length || 0} Messages</p>
                    {(schedule.messages?.length || 0) > 0 && <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>}
                  </button>


                  {schedule.companyApprovalStatus === 'PENDING' ? (
                    <div className="flex flex-col gap-2 w-full sm:w-48">
                      <Button
                        onClick={() => handleUpdateStatus(schedule.id, 'APPROVED')}
                        className="bg-slate-900 hover:bg-black text-white rounded-2xl py-6 font-bold flex items-center justify-center gap-2 shadow-lg"
                      >
                        <CheckCircle2 className="w-5 h-5" /> Approve
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => { setSelectedSchedule(schedule); setIsRejectModalOpen(true); }}
                        className="border-slate-200 text-slate-400 hover:text-red-600 rounded-2xl py-6 font-bold"
                      >
                        Reschedule
                      </Button>
                    </div>
                  ) : (
                    <div className={`px-8 py-4 rounded-2xl border flex items-center gap-3 ${
                      schedule.companyApprovalStatus === 'APPROVED' 
                        ? 'bg-green-50 border-green-100 text-green-700' 
                        : 'bg-red-50 border-red-100 text-red-700'
                    }`}>
                      {schedule.companyApprovalStatus === 'APPROVED' ? <CheckCircle2 /> : <XCircle />}
                      <span className="font-black uppercase tracking-widest text-sm">{schedule.companyApprovalStatus}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-[3rem] p-20 text-center border-2 border-dashed border-slate-100">
            <Calendar className="w-12 h-12 text-slate-200 mx-auto mb-4" />
            <p className="text-slate-400 font-bold">No sessions found in your pipeline</p>
          </div>
        )}

      </div>


      {/* --- MODALS --- */}

      {/* 1. Side Drawer for Admin Notes (The Communication Hub) */}
      {isNoteDrawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity" onClick={() => setIsNoteDrawerOpen(false)} />
          <div className="relative w-full max-w-md bg-white shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-black text-slate-800">Note from Admin</h2>
                <p className="text-slate-400 text-sm font-bold">Re: {activeSchedule?.title}</p>
              </div>
              <Button variant="ghost" onClick={() => setIsNoteDrawerOpen(false)} className="rounded-xl">X</Button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6">
              {activeSchedule?.messages && activeSchedule.messages.length > 0 ? activeSchedule.messages.map((msg:any) => (
                <div key={msg.id} className="space-y-2">
                  <div className="flex items-center gap-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] text-white font-bold ${msg.isAdmin ? 'bg-blue-600' : 'bg-slate-600'}`}>
                      {msg.isAdmin ? 'A' : 'C'}
                    </div>
                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{msg.senderName}</span>
                  </div>
                  <div className={`border p-6 rounded-[2rem] rounded-tl-none ${msg.isAdmin ? 'bg-slate-50 border-slate-100' : 'bg-blue-50 border-blue-100'}`}>
                    <p className="text-slate-600 font-medium leading-relaxed italic">"{msg.message}"</p>
                  </div>
                  <p className="text-[10px] text-slate-300 font-bold pl-8">
                    {new Date(msg.createdAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' })}
                  </p>
                </div>
              )) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300 gap-4">
                  <MessageSquareQuote className="w-12 h-12" />
                  <p className="font-bold text-sm">No messages yet</p>
                </div>
              )}
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100">
              <div className="flex gap-2">
                <input
                  className="flex-1 bg-white border border-slate-200 rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-medium"
                  placeholder="Reply to Admin..."
                  value={replyMessage}
                  onChange={(e) => setReplyMessage(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!replyMessage.trim()}
                  className="bg-blue-600 w-14 h-14 rounded-2xl shadow-lg shadow-blue-200 disabled:opacity-50"
                >
                  <Send className="w-5 h-5" />
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* 2. Glassmorphism Decline Modal */}
      <Modal
        isOpen={isRejectModalOpen}
        onClose={() => setIsRejectModalOpen(false)}
        title="Request Changes"
        subtitle="This note will be sent back to the Placement Admin for review."
      >
        <div className="space-y-6">
          <div className="bg-blue-50/50 p-6 rounded-3xl border border-blue-100 flex items-start gap-4">
            <Info className="text-blue-600 shrink-0 mt-1" />
            <p className="text-xs text-blue-800 font-medium leading-relaxed">
              Rescheduling may affect student availability. Please provide a clear reason or alternative time slots.
            </p>
          </div>
          <textarea
            className="w-full p-6 rounded-3xl border border-slate-100 bg-slate-50/50 focus:ring-2 focus:ring-blue-500 min-h-[150px] outline-none transition-all font-medium text-slate-700"
            placeholder="e.g., We need to shift this to 2 PM as our interviewers have a prior meeting."
            value={declineReason}
            onChange={(e) => setDeclineReason(e.target.value)}
          />
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => setIsRejectModalOpen(false)} className="flex-1 py-7 rounded-2xl font-bold text-slate-400">Cancel</Button>
            <Button
              className="flex-1 bg-red-600 py-7 rounded-2xl font-bold text-white shadow-xl shadow-red-100"
              onClick={() => selectedSchedule && handleUpdateStatus(selectedSchedule.id, 'REJECTED')}
            >
              Send Request
            </Button>
          </div>
        </div>
      </Modal>

    </div>
  );
};

export default CompanyInterviewManager;