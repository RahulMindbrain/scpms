import { useState, useRef } from 'react';
import { 
  FileText, Upload, Download, Trash2, 
  Bell, Plus, Loader2,
  FileCheck, FileClock, PanelLeftOpen
} from 'lucide-react';
import { uploadToCloudinary } from '../../../../lib/cloudinary';
import { toast } from 'sonner';

const Documents = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['All', 'Resume', 'Certificate', 'Offer Letter'];

  const [documents, setDocuments] = useState([
    {
      id: 1,
      name: 'Priya_Sharma_Resume.pdf',
      category: 'Resume',
      size: '245 KB',
      date: 'Apr 1, 2026',
      url: '#',
      icon: <FileText size={20} className="text-blue-500" />
    },
    {
      id: 2,
      name: 'Semester_Marksheets.pdf',
      category: 'Certificate',
      size: '1.2 MB',
      date: 'Mar 28, 2026',
      url: '#',
      icon: <FileCheck size={20} className="text-emerald-500" />
    },
    {
      id: 3,
      name: 'Internship_Certificate_Google.pdf',
      category: 'Certificate',
      size: '320 KB',
      date: 'Mar 25, 2026',
      url: '#',
      icon: <FileCheck size={20} className="text-emerald-500" />
    },
    {
      id: 4,
      name: 'Microsoft_Offer_Letter.pdf',
      category: 'Offer Letter',
      size: '180 KB',
      date: 'Apr 7, 2026',
      url: '#',
      icon: <FileText size={20} className="text-indigo-500" />
    },
    {
      id: 5,
      name: 'Project_Portfolio.pdf',
      category: 'Certificate',
      size: '2.1 MB',
      date: 'Mar 20, 2026',
      url: '#',
      icon: <FileText size={20} className="text-blue-500" />
    }
  ]);

  const filteredDocs = activeTab === 'All' 
    ? documents 
    : documents.filter(doc => doc.category === activeTab);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size must be less than 5MB");
      return;
    }

    setIsUploading(true);
    const toastId = toast.loading(`Uploading ${file.name}...`);

    try {
      const url = await uploadToCloudinary(file);
      
      const newDoc = {
        id: documents.length + 1,
        name: file.name,
        category: activeTab === 'All' ? 'Resume' : activeTab,
        size: `${(file.size / 1024).toFixed(1)} KB`,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        url: url,
        icon: <FileText size={20} className="text-blue-500" />
      };

      setDocuments([newDoc, ...documents]);
      toast.success("Document uploaded successfully!", { id: toastId });
    } catch (error) {
      toast.error("Failed to upload document", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteDocument = (id: number) => {
    setDocuments(documents.filter(doc => doc.id !== id));
    toast.success("Document deleted");
  };

  return (
    <div className="min-h-screen bg-slate-50/50">
      {/* Top Header */}
      <nav className="sticky top-0 z-30 w-full bg-white border-b border-slate-100 px-6 py-4 shadow-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <div className="flex items-center gap-4">
            <button className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors lg:hidden">
              <PanelLeftOpen size={22} />
            </button>
            <div className="flex items-center gap-2">
              <div className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">
                <FileText size={20} />
              </div>
              <h1 className="text-xl font-bold text-slate-800">Documents</h1>
            </div>
          </div>
          
          <div className="flex items-center gap-4 text-slate-600">
            <button className="relative p-2 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={22} />
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-rose-500 text-[10px] text-white flex items-center justify-center font-bold rounded-full border-2 border-white">
                5
              </span>
            </button>
            <div className="h-8 w-px bg-slate-200" />
            <div className="flex items-center gap-2 cursor-pointer hover:bg-slate-100 p-1.5 rounded-full px-3 transition-colors">
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-md">
                PS
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Filters & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <div className="flex p-1 bg-slate-100/80 rounded-xl w-fit border border-slate-200">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveTab(cat)}
                className={`px-5 py-2 text-sm font-bold rounded-lg transition-all ${
                  activeTab === cat 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:bg-white hover:text-indigo-600'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
          
          <div className="flex gap-3">
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileUpload} 
              className="hidden" 
              accept=".pdf,image/*"
            />
            <button 
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isUploading ? <Loader2 size={18} className="animate-spin" /> : <Upload size={18} />}
              {isUploading ? 'Uploading...' : 'Upload Document'}
            </button>
          </div>
        </div>

        {/* Document List Container */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="divide-y divide-slate-100">
            {filteredDocs.length > 0 ? (
              filteredDocs.map((doc) => (
                <div key={doc.id} className="p-6 flex items-center justify-between hover:bg-slate-50/80 transition-all group">
                  <div className="flex items-center gap-6">
                    <div className="h-12 w-12 rounded-2xl bg-slate-50 border border-slate-100 flex items-center justify-center shadow-sm group-hover:bg-white group-hover:border-indigo-100 transition-colors">
                      {doc.icon}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-800 text-lg group-hover:text-indigo-600 transition-colors">
                        {doc.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm font-semibold text-slate-400 mt-0.5">
                        <span className="text-slate-500">{doc.category}</span>
                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                        <span>{doc.size}</span>
                        <span className="h-1 w-1 bg-slate-300 rounded-full" />
                        <span>{doc.date}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all" 
                      title="View/Download"
                    >
                      <Download size={20} />
                    </a>
                    <button 
                      onClick={() => deleteDocument(doc.id)}
                      className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all" 
                      title="Delete"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-slate-400">
                <FileClock size={64} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-lg font-semibold">No documents found in this category</p>
                <button 
                  onClick={() => setActiveTab('All')}
                  className="mt-2 text-indigo-600 font-bold hover:underline"
                >
                  Clear filters
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Info Card */}
        <div className="mt-12 p-6 bg-amber-50 rounded-2xl border border-amber-100 flex gap-4 items-start shadow-sm">
          <div className="p-2 bg-amber-100 text-amber-600 rounded-xl">
            <Plus size={20} strokeWidth={3} />
          </div>
          <div>
            <h4 className="font-bold text-amber-900 mb-1">Upload Guidelines</h4>
            <p className="text-sm text-amber-800 leading-relaxed font-medium">
              Ensure all documents are in PDF format and less than 5MB in size. 
              Named conventions like 'Name_Category_Year' are recommended for better organization.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Documents;