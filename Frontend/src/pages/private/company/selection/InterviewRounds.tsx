import React, { useState } from 'react';
import { Calendar, Plus, Clock, ChevronDown, CheckCircle2, User, Search, Filter, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { toast } from 'sonner';

interface Interview {
  name: string;
  date: string;
  time: string;
  status: string;
  score: string;
}

const InterviewRounds: React.FC = () => {
  const [activeTab, setActiveTab] = useState('technical');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedInterview, setSelectedInterview] = useState<Interview | null>(null);

  const [interviews, setInterviews] = useState<Interview[]>([
    { name: "Priya Sharma", date: "2026-04-18", time: "10:00 AM", status: "Scheduled", score: "--" },
    { name: "Ananya Patel", date: "2026-04-18", time: "11:00 AM", status: "Completed", score: "88/100" },
    { name: "Kavita Joshi", date: "2026-04-18", time: "02:00 PM", status: "Scheduled", score: "--" },
    { name: "Sneha Gupta", date: "2026-04-18", time: "03:00 PM", status: "Pending", score: "--" },
  ]);

  const [newSlot, setNewSlot] = useState({
    name: '',
    date: '',
    time: '',
    status: 'Scheduled'
  });

  const [updateData, setUpdateData] = useState({
    status: '',
    score: ''
  });

  const handleAddSlot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSlot.name || !newSlot.date || !newSlot.time) {
      toast.error("Please fill all fields");
      return;
    }
    const interview: Interview = {
      ...newSlot,
      score: '--'
    };
    setInterviews([...interviews, interview]);
    setIsAddModalOpen(false);
    setNewSlot({ name: '', date: '', time: '', status: 'Scheduled' });
    toast.success("Interview slot added successfully");
  };

  const handleUpdateInitiate = (interview: Interview) => {
    setSelectedInterview(interview);
    setUpdateData({
      status: interview.status,
      score: interview.score === '--' ? '' : interview.score
    });
    setIsUpdateModalOpen(true);
  };

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInterview) return;

    setInterviews(interviews.map(inv => 
      inv.name === selectedInterview.name ? { ...inv, status: updateData.status, score: updateData.score || '--' } : inv
    ));
    setIsUpdateModalOpen(false);
    toast.success("Interview details updated");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        
      </div>

      <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 p-8 space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2">
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Calendar className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Interview Rounds</h2>
              <p className="text-slate-500 font-medium">Manage technical and HR interview rounds</p>
            </div>
          </div>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-6 rounded-2xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2"
          >
            <Plus className="w-5 h-5" /> Add Slot
          </Button>
        </div>

        <div className="flex gap-2 p-1.5 bg-slate-50 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('technical')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'technical' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            Technical Round ({interviews.length})
          </button>
          <button 
            onClick={() => setActiveTab('hr')}
            className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'hr' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            HR Round (0)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Candidate</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Time Slot</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Score</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {interviews.map((item, index) => (
                <tr key={index} className="hover:bg-slate-50/50 transition-all group">
                  <td className="px-6 py-5">
                    <div className="font-bold text-slate-800">{item.name}</div>
                  </td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-500">{item.date}</td>
                  <td className="px-6 py-5 text-sm font-medium text-slate-700">{item.time}</td>
                  <td className="px-6 py-5">
                    <Badge 
                      variant={
                        item.status === 'Completed' ? 'success' : 
                        item.status === 'Scheduled' ? 'warning' : 'outline'
                      } 
                      className="px-3 py-1 rounded-lg"
                    >
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5 text-sm font-bold text-slate-600">{item.score}</td>
                  <td className="px-6 py-5 text-right">
                    <div 
                      onClick={() => handleUpdateInitiate(item)}
                      className="flex justify-end gap-2 text-sm font-bold text-slate-600 border border-slate-100 bg-white rounded-xl px-4 py-2 hover:border-slate-300 transition-all cursor-pointer group-hover:shadow-sm"
                    >
                      Update <ChevronDown className="w-4 h-4 text-slate-400" />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Slot Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Schedule New Interview"
        subtitle="Add a new candidate to the interview schedule"
      >
        <form onSubmit={handleAddSlot} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Candidate Name</label>
            <input 
              type="text" 
              required
              value={newSlot.name}
              onChange={(e) => setNewSlot({...newSlot, name: e.target.value})}
              placeholder="e.g., John Doe" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Date</label>
              <input 
                type="date" 
                required
                value={newSlot.date}
                onChange={(e) => setNewSlot({...newSlot, date: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Time</label>
              <input 
                type="time" 
                required
                value={newSlot.time}
                onChange={(e) => setNewSlot({...newSlot, time: e.target.value})}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
              />
            </div>
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full bg-blue-600 py-6 rounded-2xl font-bold">Schedule Interview</Button>
          </div>
        </form>
      </Modal>

      {/* Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Update Interview Result"
        subtitle={`Updating details for ${selectedInterview?.name}`}
      >
        <form onSubmit={handleUpdateSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Status</label>
            <select 
              value={updateData.status}
              onChange={(e) => setUpdateData({...updateData, status: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all bg-white"
            >
              <option value="Pending">Pending</option>
              <option value="Scheduled">Scheduled</option>
              <option value="Completed">Completed</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700">Score / Feedback</label>
            <input 
              type="text" 
              value={updateData.score}
              onChange={(e) => setUpdateData({...updateData, score: e.target.value})}
              placeholder="e.g., 85/100 or Excellent" 
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
            />
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full bg-blue-600 py-6 rounded-2xl font-bold flex items-center justify-center gap-2">
              <Save className="w-5 h-5" /> Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default InterviewRounds;
