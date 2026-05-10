import { useState, useRef, useEffect } from 'react';
import {
  FileText, Upload, Download, Trash2,
  Search, FileCheck, FileClock, Sparkles
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import Loader from '@/components/Loader';

const Documents = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const { upload: uploadToCloudinary } = useCloudinaryUpload();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Resume', 'Certificate', 'Offer Letter'];

  // ✅ Load from localStorage
  useEffect(() => {
    const storedDocs = localStorage.getItem('documents');
    if (storedDocs) {
      setDocuments(JSON.parse(storedDocs));
    }
  }, []);

  // ✅ Save to localStorage
  useEffect(() => {
    localStorage.setItem('documents', JSON.stringify(documents));
  }, [documents]);

  // ✅ Icon handler
  const getIcon = (category: string) => {
    switch (category) {
      case 'Resume':
        return <FileText size={18} className="text-blue-600" />;
      case 'Certificate':
        return <FileCheck size={18} className="text-emerald-600" />;
      case 'Offer Letter':
        return <FileText size={18} className="text-indigo-600" />;
      default:
        return <FileText size={18} className="text-[#c7c4d7]" />;
    }
  };

  // ✅ Filter
  const filteredDocs = documents.filter(doc => {
    const matchesTab = activeTab === 'All' || doc.category === activeTab;
    const matchesSearch = doc.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  // ✅ Upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const folder =
        activeTab === 'All'
          ? 'documents'
          : activeTab.toLowerCase().replace(' ', '_');

      const url = await uploadToCloudinary(file, folder);

      if (!url) {
        toast.error("Upload failed");
        return;
      }

      const newDoc = {
        id: Date.now(),
        name: file.name,
        category: activeTab === 'All' ? 'Resume' : activeTab,
        size: `${(file.size / 1024).toFixed(0)} KB`,
        date: new Date().toLocaleDateString(),
        status: 'Verified',
        url
      };

      setDocuments(prev => [newDoc, ...prev]);
      toast.success("Uploaded successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  // ✅ Delete
  const deleteDocument = (id: number) => {
    setDocuments(prev => prev.filter(doc => doc.id !== id));
    toast.success("Document removed");
  };

  // ✅ UNIVERSAL DOWNLOAD FUNCTION
  const downloadFile = (url: string, name = '') => {
    if (!url) {
      toast.error("Invalid file URL");
      return;
    }

    const normalizedUrl = url.toLowerCase().includes('cloudinary.com') && !url.toLowerCase().endsWith('.pdf') && !url.toLowerCase().includes('/f_pdf/') 
      ? url + '.pdf' 
      : url;

    const cleanName = (name || 'document').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    
    let downloadUrl = normalizedUrl;
    if (normalizedUrl.includes('cloudinary.com') && normalizedUrl.includes('/upload/')) {
       // Using f_pdf, fl_attachment, and dn_ (Download Name) while stripping the extension
       // is the industry-standard way to force reliable Cloudinary PDF downloads.
       downloadUrl = normalizedUrl
         .replace('/upload/', `/upload/f_pdf,fl_attachment,dn_${cleanName}/`)
         .replace(/\.pdf$/i, '');
    }

    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', `${cleanName}.pdf`);
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
    document.body.appendChild(link);
    link.click();
    setTimeout(() => {
      document.body.removeChild(link);
    }, 500);
    
    toast.success("Download started");
  };

  // ✅ Helper to get thumbnail
  const getThumbnail = (doc: any) => {
    const isImage = /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(doc.url) || doc.name.match(/\.(jpg|jpeg|png|webp|gif|svg)$/i);
    const isPdf = doc.url.toLowerCase().includes('.pdf') || doc.name.toLowerCase().endsWith('.pdf');

    if (isImage) {
      return doc.url.replace('/upload/', '/upload/w_400,h_300,c_fill/');
    }

    if (isPdf) {
      // Cloudinary trick: pg_1 gets first page of PDF as image
      return doc.url.replace('/upload/', '/upload/w_400,h_500,c_fill,pg_1/') + (doc.url.toLowerCase().endsWith('.pdf') ? '.jpg' : '');
    }

    return null;
  };

  return (
    <div className="flex-1 flex flex-col bg-background min-h-screen selection:bg-indigo-500/30 selection:text-indigo-200">
      <div className="max-w-[1600px] mx-auto w-full p-4 md:p-8 space-y-8 student-hero-animate fade-in slide-in-from-bottom-2 duration-500">

        {/* Adaptive Hero Banner */}
        <div className="student-hero-banner group">
          <div className="student-hero-mesh">
            <div className="bubble-indigo"></div>
            <div className="bubble-sky"></div>
          </div>

          <div className="student-hero-texture"></div>
          <div className="student-hero-overlay"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div className="max-w-2xl">
              <div className="student-hero-badge">
                <Sparkles /> 
                <span>Document Vault</span>
              </div>
              <h1 className="student-hero-title">
                Secure Your <span>Credentials</span> 📂
              </h1>
              <p className="student-hero-description">
                Manage your resumes, certificates, and academic transcripts in one encrypted location.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-slate-900 dark:text-white/40 dark:group-focus-within:text-white transition-colors" size={18} />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="pl-12 pr-6 h-14 bg-slate-100 dark:bg-white/10 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-slate-400 dark:placeholder:text-white/30 text-slate-900 dark:text-white w-full sm:w-64"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center gap-3 px-8 h-14 bg-white text-[#0f172a] rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:scale-105 transition-all w-full sm:w-auto active:scale-95"
              >
                {isUploading ? <Loader size="sm" /> : <Upload size={18} />}
                {isUploading ? "Syncing..." : "Upload File"}
              </button>
            </div>
          </div>
        </div>

        {/* Filters aligned with Premium Style */}
        <div className="flex items-center gap-2 bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl p-1.5 rounded-2xl border border-slate-200/60 dark:border-white/[0.08] w-fit shadow-sm">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                "px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300",
                activeTab === cat
                  ? "bg-white dark:bg-[#1e1f26] text-indigo-600 dark:text-indigo-400 shadow-xl border border-slate-200/50 dark:border-white/10 scale-105"
                  : "text-slate-500 hover:text-slate-900 dark:hover:text-white"
              )}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid aligned with Premium Style */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="group relative bg-white/80 dark:bg-[#161b22]/40 backdrop-blur-xl p-6 rounded-[2.5rem] border border-slate-200/60 dark:border-white/[0.08] transition-all duration-500 hover:shadow-2xl hover:translate-y-[-4px] hover:border-indigo-500/30">
                <div className="relative h-48 mb-6 rounded-[1.5rem] overflow-hidden bg-slate-100 dark:bg-black/20 border border-slate-200/50 dark:border-white/5 flex items-center justify-center shadow-inner">
                  {getThumbnail(doc) ? (
                    <img
                      src={getThumbnail(doc)}
                      alt={doc.name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '';
                        (e.target as HTMLImageElement).className = 'hidden';
                      }}
                    />
                  ) : (
                    <div className="p-8 text-indigo-500/40 group-hover:scale-110 transition-transform duration-500">
                      <FileText size={64} strokeWidth={1} />
                    </div>
                  )}
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-indigo-900/40 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-500 flex items-center justify-center gap-4">
                    <button
                      onClick={() => downloadFile(doc.url, doc.name)}
                      className="p-4 bg-white text-indigo-600 rounded-2xl shadow-2xl hover:scale-110 active:scale-95 transition-all"
                    >
                      <Download size={20} />
                    </button>
                  </div>
                </div>
 
                <div className="px-2 space-y-4">
                  <div className="flex justify-between items-start gap-4">
                    <h3 className="font-black text-lg text-slate-900 dark:text-white truncate tracking-tight" title={doc.name}>
                      {doc.name}
                    </h3>
                    <div className="p-2 rounded-xl bg-slate-100 dark:bg-white/5 shadow-inner">
                      {getIcon(doc.category)}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="text-[10px] text-slate-500 dark:text-slate-400 font-black uppercase tracking-[0.2em]">{doc.size} • {doc.date}</p>
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                        <span className="text-emerald-600 dark:text-emerald-400 text-[10px] font-black uppercase tracking-widest">{doc.status}</span>
                      </div>
                    </div>
                    
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-3 text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-32 text-center bg-white/40 dark:bg-white/[0.02] border-2 border-dashed border-slate-200/60 dark:border-white/10 rounded-[3rem] shadow-sm">
              <div className="w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-[2.5rem] flex items-center justify-center text-slate-300 dark:text-slate-700 mx-auto mb-6">
                <FileClock size={48} />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Vault is Empty</h3>
              <p className="text-slate-500 dark:text-slate-400 mt-2 text-sm font-medium">Start by uploading your academic credentials.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Documents;