import React from 'react';
import { X, Calendar, Clock, MapPin, Users, Info, Briefcase, FileText, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduleEventModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ScheduleEventModal: React.FC<ScheduleEventModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-[6px]"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-lg bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] overflow-hidden border border-slate-100"
          >
            {/* Header */}
            <div className="pt-8 px-8 flex justify-between items-start">
              <div>
                <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Schedule Interview Event</h2>
                <p className="text-slate-500 text-[15px] mt-1 font-medium">Set interview date, time, and venue</p>
              </div>
              <button 
                onClick={onClose}
                className="p-2.5 hover:bg-slate-100 rounded-full transition-all text-slate-400 hover:text-slate-600 hover:rotate-90 duration-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Content */}
            <form className="p-8 space-y-5" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-4">
                {/* Company Select */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Company</label>
                  <div className="relative group">
                    <select className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer font-medium text-[15px]">
                      <option value="" disabled selected>Select company</option>
                      <option value="google">Google</option>
                      <option value="microsoft">Microsoft</option>
                      <option value="amazon">Amazon</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Event Type Select */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Event Type</label>
                  <div className="relative group">
                    <select className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer font-medium text-[15px]">
                      <option value="" disabled selected>Select type</option>
                      <option value="ppt">Pre-Placement Talk</option>
                      <option value="test">Online Test</option>
                      <option value="technical">Technical Interview</option>
                      <option value="hr">HR Interview</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Date Input */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Date</label>
                  <div className="relative group">
                    <input 
                      type="date" 
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-[15px] [color-scheme:light]"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Calendar className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Time Input */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Time</label>
                  <div className="relative group">
                    <input 
                      type="time" 
                      className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-[15px] [color-scheme:light]"
                    />
                    <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                      <Clock className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Venue Input */}
                <div className="space-y-1.5 single-col md:col-span-1">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Venue</label>
                  <div className="relative group">
                    <input 
                      type="text" 
                      placeholder="e.g. Conference Hall"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-[15px]"
                    />
                  </div>
                </div>

                {/* Total Slots Input */}
                <div className="space-y-1.5">
                  <label className="text-[13px] font-bold text-slate-700 ml-1">Total Slots</label>
                  <div className="relative group">
                    <input 
                      type="number" 
                      placeholder="e.g. 8"
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-[15px]"
                    />
                  </div>
                </div>
              </div>

              {/* Notes Input */}
              <div className="space-y-1.5 pt-1">
                <label className="text-[13px] font-bold text-slate-700 ml-1">Notes</label>
                <div className="relative group">
                  <textarea 
                    placeholder="Additional details..."
                    rows={3}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-700 placeholder:text-slate-300 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium text-[15px] resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-6">
                <button 
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-2xl font-bold text-slate-500 hover:bg-slate-100 transition-all active:scale-95 text-[15px]"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-10 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold shadow-xl shadow-indigo-100 transition-all active:scale-95 text-[15px]"
                >
                  Schedule
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ScheduleEventModal;
