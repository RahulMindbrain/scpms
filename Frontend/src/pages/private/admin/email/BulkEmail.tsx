import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Briefcase, 
  Mail, 
  Send, 
  Eye, 
  ChevronDown, 
  Loader2,
  CheckSquare,
  Square
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCompanies, fetchJobsByCompanyId, sendBulkMail } from '@/redux/thunks/companyThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';

const BulkEmail: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  
  // Redux State
  const { companies: reduxCompanies, jobs: reduxJobs, loading: reduxLoading, error: reduxError } = useSelector((state: RootState) => state.company);
  
  // Selection State
  const [selectedCompanyId, setSelectedCompanyId] = useState<string>('');
  const [selectedJobIds, setSelectedJobIds] = useState<number[]>([]);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  
  // UI State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  // 1. Fetch Companies on Mount
  useEffect(() => {
    dispatch(fetchCompanies({}));
  }, [dispatch]);

  // 2. Fetch Jobs when Company changes
  useEffect(() => {
    if (!selectedCompanyId) {
      setSelectedJobIds([]);
      return;
    }

    dispatch(fetchJobsByCompanyId({ 
      id: Number(selectedCompanyId), 
      params: { status: 'APPROVED' } 
    }));
    setSelectedJobIds([]); // Reset selection
  }, [selectedCompanyId, dispatch]);

  const toggleJob = (id: number) => {
    setSelectedJobIds(prev => 
      prev.includes(id) ? prev.filter(jId => jId !== id) : [...prev, id]
    );
  };

  const handleSendMail = async () => {
    if (!selectedCompanyId || selectedJobIds.length === 0) {
      toast.error("Please select a company and at least one job");
      return;
    }

    const loadingToast = toast.loading("Dispatching bulk emails...");

    try {
      await dispatch(sendBulkMail({
        companyId: Number(selectedCompanyId),
        jobIds: selectedJobIds,
        subject: subject || undefined,
        message: message || undefined
      })).unwrap();
      
      toast.success("Bulk mail sent successfully!", { id: loadingToast });
      setSubject('');
      setMessage('');
      setSelectedJobIds([]);
    } catch (error: any) {
      toast.error(error || "Failed to send mail", { id: loadingToast });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="mb-8">
        <h1 className="text-2xl font-black text-slate-800 uppercase tracking-tight">Bulk Communications</h1>
        <p className="text-slate-500 text-sm">Target students based on specific company opportunities.</p>
      </header>

      <div className="grid gap-6">
        {/* Step 1: Company Selection */}
        <section className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm">
          <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
            <Building2 className="w-4 h-4" /> 01. Select Company
          </label>
          <div className="relative">
            <select
              value={selectedCompanyId}
              onChange={(e) => setSelectedCompanyId(e.target.value)}
              className="w-full pl-4 pr-10 py-4 bg-slate-50 border border-slate-200 rounded-2xl appearance-none font-bold text-slate-700 focus:ring-4 focus:ring-indigo-500/5 transition-all"
            >
              <option value="">Choose a company...</option>
              {reduxCompanies.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
          </div>
        </section>

        {/* Step 2: Job Selection */}
        <section className={`bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm transition-opacity ${!selectedCompanyId && 'opacity-50 pointer-events-none'}`}>
          <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-4">
            <Briefcase className="w-4 h-4" /> 02. Select Jobs
          </label>
          
          {reduxLoading && !reduxCompanies.length ? (
            <div className="flex justify-center py-4"><Loader2 className="animate-spin text-indigo-500" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {(reduxJobs || []).map((job: any) => (
                <div 
                  key={job.id}
                  onClick={() => toggleJob(job.id)}
                  className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer border-2 transition-all ${selectedJobIds.includes(job.id) ? 'border-indigo-500 bg-indigo-50/50' : 'border-slate-100 bg-slate-50 hover:border-slate-200'}`}
                >
                  {selectedJobIds.includes(job.id) ? <CheckSquare className="w-5 h-5 text-indigo-600" /> : <Square className="w-5 h-5 text-slate-300" />}
                  <span className="text-sm font-bold text-slate-700">{job.title}</span>
                </div>
              ))}
              {(!reduxJobs || reduxJobs.length === 0) && selectedCompanyId && !reduxLoading && (
                <p className="text-xs text-slate-400 italic">No approved jobs found for this company.</p>
              )}
            </div>
          )}
        </section>

        {/* Step 3: Content */}
        <section className="bg-white p-6 rounded-[2.5rem] border border-slate-200 shadow-sm space-y-4">
          <label className="flex items-center gap-2 text-[11px] font-black text-slate-400 uppercase tracking-widest mb-2">
            <Mail className="w-4 h-4" /> 03. Compose Message
          </label>
          <input
            type="text"
            placeholder="Subject (Optional: defaults to 'New Opportunities Available')"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full px-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 placeholder:text-slate-300"
          />
          <textarea
            rows={6}
            placeholder="Message Body (HTML supported). Leave blank to use default template."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="w-full px-5 py-5 bg-slate-50 border border-slate-200 rounded-[2rem] text-sm font-medium text-slate-600"
          />
        </section>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Button
            variant="outline"
            onClick={() => setIsPreviewOpen(true)}
            className="flex-1 rounded-2xl border-slate-200 py-7 font-black uppercase tracking-widest text-xs"
          >
            <Eye className="w-4 h-4 mr-2" /> Preview
          </Button>
          <Button
            onClick={handleSendMail}
            disabled={reduxLoading || !selectedCompanyId || selectedJobIds.length === 0}
            className="flex-[2] rounded-2xl bg-indigo-600 py-7 font-black uppercase tracking-widest text-xs shadow-xl shadow-indigo-100"
          >
            {reduxLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
            Send to Eligible Students
          </Button>
        </div>
      </div>

      {/* Simple Preview Modal */}
      <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)} title="Message Preview">
         <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
            <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Subject</p>
            <p className="font-bold mb-4">{subject || "New Opportunities Available"}</p>
            <hr className="mb-4" />
            <div 
              className="text-sm text-slate-600 prose prose-slate"
              dangerouslySetInnerHTML={{ __html: message || "<p>Standard placement invitation template will be used...</p>" }}
            />
         </div>
         <Button className="w-full mt-6 rounded-xl" onClick={() => setIsPreviewOpen(false)}>Close</Button>
      </Modal>
    </div>
  );
};

export default BulkEmail;