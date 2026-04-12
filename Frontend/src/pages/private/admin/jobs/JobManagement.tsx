import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Building2,
  CheckCircle,
  XCircle,
  MapPin, DollarSign,
  Search,
  Clock,
  ExternalLink
} from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJobs, updateJobStatus } from '@/redux/thunks/driveThunk';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';

const AdminJobManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { jobs, loading } = useSelector((state: RootState) => state.drive);
  const [activeTab, setActiveTab] = useState<'PENDING' | 'APPROVED' | 'REJECTED'>('PENDING');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);

  useEffect(() => {
    dispatch(fetchJobs({ status: activeTab }));
  }, [dispatch, activeTab]);

  const handleStatusUpdate = async (jobIds: number[], status: string) => {
    try {
      await dispatch(updateJobStatus({ jobIds, status })).unwrap();
      toast.success(`Job(s) ${status.toLowerCase()} successfully`);
      dispatch(fetchJobs({ status: activeTab }));
      setSelectedJobIds([]);
    } catch (error: any) {
      toast.error(error || "Failed to update job status");
    }
  };

  const toggleSelectJob = (id: number) => {
    setSelectedJobIds(prev => 
      prev.includes(id) ? prev.filter(jobId => jobId !== id) : [...prev, id]
    );
  };

  const filteredJobs = (Array.isArray(jobs) ? jobs : []).filter(job => 
    job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto space-y-8 p-4 md:p-0 mt-4 animate-in">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Job Management</h1>
          <p className="text-slate-500 font-medium tracking-tight">Review and manage job postings from partner companies.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            <input 
              type="text" 
              placeholder="Search jobs or companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-11 pr-6 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm font-medium focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all shadow-sm w-full sm:w-64 md:w-80"
            />
          </div>
        </div>
      </div>

      {/* Tabs & Multi-action */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-6 bg-white/50 backdrop-blur-xl p-3 rounded-[2rem] border border-slate-200/60 shadow-xl shadow-slate-200/20">
        <div className="flex p-1 bg-slate-100/80 rounded-2xl w-full md:w-auto">
          {(['PENDING', 'APPROVED', 'REJECTED'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 md:flex-none px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeTab === tab 
                  ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' 
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab === 'PENDING' && <Clock className="w-3 h-3 inline-block mr-2 -mt-0.5" />}
              {tab === 'APPROVED' && <CheckCircle className="w-3 h-3 inline-block mr-2 -mt-0.5" />}
              {tab === 'REJECTED' && <XCircle className="w-3 h-3 inline-block mr-2 -mt-0.5" />}
              {tab}
            </button>
          ))}
        </div>

        {selectedJobIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 px-4 py-2 bg-blue-50 border border-blue-100 rounded-2xl"
          >
            <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">{selectedJobIds.length} Selected</span>
            <div className="h-6 w-px bg-blue-200 mx-1"></div>
            {activeTab !== 'APPROVED' && (
              <button 
                onClick={() => handleStatusUpdate(selectedJobIds, 'APPROVED')}
                className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-xl transition-colors active:scale-95"
                title="Approve All"
              >
                <CheckCircle className="w-5 h-5" />
              </button>
            )}
            {activeTab !== 'REJECTED' && (
              <button 
                onClick={() => handleStatusUpdate(selectedJobIds, 'REJECTED')}
                className="p-2 text-rose-600 hover:bg-rose-100 rounded-xl transition-colors active:scale-95"
                title="Reject All"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </motion.div>
        )}
      </div>

      {/* Jobs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <AnimatePresence mode='popLayout'>
          {loading ? (
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-100 space-y-6 animate-pulse">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl"></div>
                  <div className="space-y-2 flex-1">
                    <div className="h-4 bg-slate-100 rounded w-3/4"></div>
                    <div className="h-3 bg-slate-50 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="h-4 bg-slate-100 rounded w-full"></div>
                  <div className="h-4 bg-slate-100 rounded w-5/6"></div>
                </div>
                <div className="flex gap-2">
                  <div className="h-8 bg-slate-50 rounded-xl w-24"></div>
                  <div className="h-8 bg-slate-50 rounded-xl w-24"></div>
                </div>
              </div>
            ))
          ) : filteredJobs.length > 0 ? filteredJobs.map((job) => (
            <motion.div 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              key={job.id} 
              className={`bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-500/5 transition-all duration-500 group relative overflow-hidden ${selectedJobIds.includes(job.id) ? 'ring-2 ring-blue-500 bg-blue-50/10' : ''}`}
              onClick={() => toggleSelectJob(job.id)}
            >
              <div className="absolute top-6 right-6 z-20">
                <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedJobIds.includes(job.id) ? 'bg-blue-600 border-blue-600' : 'border-slate-200 bg-white shadow-inner'}`}>
                  {selectedJobIds.includes(job.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-blue-600 border border-slate-100 group-hover:scale-110 transition-transform duration-500">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-black text-slate-900 truncate uppercase tracking-tight group-hover:text-blue-600 transition-colors leading-none mb-2">{job.title}</h3>
                    <p className="text-sm font-bold text-slate-400 truncate uppercase tracking-[0.1em]">{job.company?.name}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    <MapPin className="w-4 h-4 text-rose-500" /> {job.location || 'Remote'}
                  </div>
                  <div className="flex items-center gap-3 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right justify-end">
                    <DollarSign className="w-4 h-4 text-emerald-500" /> {job.salary}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm text-slate-500 line-clamp-2 font-medium leading-relaxed italic border-l-2 border-slate-100 pl-4">
                    {job.description || 'Looking for an experienced developer to join our growing team...'}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <Badge variant="outline" className="bg-slate-50 border-slate-100 text-[9px] font-black uppercase tracking-widest px-3 py-1.5">{job.jobType || 'Full Time'}</Badge>
                  <Badge variant="outline" className="bg-slate-50 border-slate-100 text-[9px] font-black uppercase tracking-widest px-3 py-1.5">{job.experience || 'Entry Level'}</Badge>
                </div>

                <div className="flex items-center gap-3 pt-4 border-t border-slate-50">
                  {activeTab === 'PENDING' ? (
                    <>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate([job.id], 'APPROVED');
                        }}
                        className="flex-1 py-3.5 bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                      >
                        <CheckCircle className="w-4 h-4" /> Approve
                      </button>
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStatusUpdate([job.id], 'REJECTED');
                        }}
                        className="flex-1 py-3.5 bg-white border border-rose-100 text-rose-600 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-rose-50 transition-all active:scale-95 flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-4 h-4" /> Reject
                      </button>
                    </>
                  ) : (
                    <button 
                      className="w-full py-3.5 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 active:scale-95 flex items-center justify-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <ExternalLink className="w-4 h-4" /> View Details
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          )) : (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center bg-white rounded-[2.5rem] border border-slate-100 border-dashed"
            >
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <Briefcase className="w-10 h-10 text-slate-200" />
              </div>
              <p className="text-slate-400 font-black uppercase tracking-widest text-sm">No {activeTab.toLowerCase()} jobs found</p>
              <button 
                onClick={() => setSearchTerm('')}
                className="mt-4 text-xs font-black text-blue-600 uppercase tracking-widest hover:underline"
              >
                Clear all filters
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminJobManagement;
