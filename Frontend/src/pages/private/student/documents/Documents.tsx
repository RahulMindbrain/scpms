import React, { useState, useRef } from 'react';
import { 
  FileText, Upload, Download, Trash2, 
  Bell, Plus, Loader2, Search,
  FileCheck, FileClock, PanelLeftOpen,
  MoreVertical, ExternalLink, ShieldCheck
} from 'lucide-react';
import { toast } from 'sonner';

const Documents = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
 const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Resume', 'Certificate', 'Offer Letter'];

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'anjali_Sharma_Resume.pdf',
      category: 'Resume',
      size: '245 KB',
      date: 'Apr 1, 2026',
      status: 'Verified',
      icon: <FileText size={18} className="text-blue-600" />
    },
    {
      id: 2,
      name: 'Semester_Marksheets.pdf',
      category: 'Certificate',
      size: '1.2 MB',
      date: 'Mar 28, 2026',
      status: 'Verified',
      icon: <FileCheck size={18} className="text-emerald-600" />
    },
    {
      id: 4,
      name: 'Microsoft_Offer_Letter.pdf',
      category: 'Offer Letter',
      size: '180 KB',
      date: 'Apr 7, 2026',
      status: 'Pending',
      icon: <FileText size={18} className="text-indigo-600" />
    }
  ]);

  const filteredDocs = documents.filter(doc => {
    const matchesTab = activeTab === 'All' || doc.category === activeTab;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const deleteDocument = (id:any) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("Document removed from vault");
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]">
      {/* Refined Navbar */}
      <nav className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-slate-200 px-8 py-3">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Document </h1>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 text-slate-400" size={16} />
              <input 
                type="text"
                placeholder="Search files..."
                className="pl-10 pr-4 py-1.5 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-indigo-500 w-64 transition-all"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">AS</div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-8 py-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-slate-900">Academic Records</h2>
            <p className="text-slate-500 mt-1 font-medium">Manage and share your verified professional documents.</p>
          </div>
          
          <div className="flex gap-3">
            <input type="file" ref={fileInputRef} className="hidden" />
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-800 transition-all shadow-lg active:scale-95"
            >
              <Upload size={16} /> Quick Upload
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-5 py-2 text-sm font-bold rounded-full border transition-all whitespace-nowrap ${
                activeTab === cat 
                  ? 'bg-indigo-50 border-indigo-200 text-indigo-700 shadow-sm' 
                  : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Document Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:shadow-indigo-500/5 hover:border-indigo-200 transition-all relative overflow-hidden">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-xl border ${
                    doc.category === 'Resume' ? 'bg-blue-50 border-blue-100' : 'bg-emerald-50 border-emerald-100'
                  }`}>
                    {doc.icon}
                  </div>
                  <button className="text-slate-400 hover:text-slate-600 p-1">
                    <MoreVertical size={18} />
                  </button>
                </div>

                <h3 className="font-bold text-slate-800 mb-1 truncate pr-4 group-hover:text-indigo-600 transition-colors" title={doc.name}>
                  {doc.name}
                </h3>
                
                <div className="flex items-center gap-2 text-xs font-bold text-slate-400 mb-6">
                  <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-600">{doc.category}</span>
                  <span>•</span>
                  <span>{doc.size}</span>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-50">
                   <div className="flex items-center gap-1.5">
                     <ShieldCheck size={14} className={doc.status === 'Verified' ? 'text-emerald-500' : 'text-slate-300'} />
                     <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">{doc.status}</span>
                   </div>
                   <div className="flex items-center gap-1">
                     <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                       <Download size={16} />
                     </button>
                     <button 
                       onClick={() => deleteDocument(doc.id)}
                       className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-all"
                     >
                       <Trash2 size={16} />
                     </button>
                   </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-24 bg-white rounded-3xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400">
               <div className="p-4 bg-slate-50 rounded-full mb-4">
                  <FileClock size={40} strokeWidth={1.5} />
               </div>
               <p className="text-lg font-bold text-slate-600">No records found</p>
               <p className="text-sm font-medium">Try adjusting your filters or upload a new document.</p>
            </div>
          )}
        </div>

        {/* Security Footer */}
        <div className="mt-16 p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="flex items-center gap-5">
            <div className="h-12 w-12 rounded-xl bg-white/10 flex items-center justify-center backdrop-blur-sm">
              <ShieldCheck size={28} className="text-indigo-300" />
            </div>
            <div>
              <p className="text-indigo-200/70 text-sm font-medium">All documents are encrypted and accessible only by verified COMPANYs.</p>
            </div>
          </div>
          <button className="px-6 py-2.5 bg-white text-slate-900 text-sm font-bold rounded-xl hover:bg-indigo-50 transition-all flex items-center gap-2">
            View Security Logs <ExternalLink size={14} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Documents;