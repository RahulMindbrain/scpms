import { useState, useRef, useEffect } from 'react';
import {
  FileText, Upload, Download, Trash2,
  Search, FileCheck, FileClock,
  MoreVertical, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { Loader2, Eye } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const Documents = () => {
  const [activeTab, setActiveTab] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [documents, setDocuments] = useState<any[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewName, setPreviewName] = useState<string>('');

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
        return <FileText size={18} className="text-gray-600" />;
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

  // ✅ UNIVERSAL OPEN FUNCTION (VIEW + DOWNLOAD FIX)
  const openFile = (url: string, download = false, name = '') => {
    if (!url) {
      toast.error("Invalid file URL");
      return;
    }

    const isPdf = name.toLowerCase().endsWith('.pdf') || url.toLowerCase().includes('.pdf');
    let finalUrl = url;

    // If it's a PDF on Cloudinary, ensure it has the .pdf extension if missing
    if (isPdf && !finalUrl.toLowerCase().endsWith('.pdf')) {
      finalUrl = finalUrl + '.pdf';
    }

    if (download) {
      finalUrl = finalUrl.replace('/upload/', '/upload/fl_attachment/');
      
      const link = document.createElement('a');
      link.href = finalUrl;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.setAttribute('download', name || 'document');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      // For viewing, we can choose to open in new tab or use our internal preview
      setPreviewName(name);
      setPreviewUrl(finalUrl);
    }
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
    <div className="min-h-screen bg-[#F9FAFB]">
      <main className="max-w-6xl mx-auto px-8 py-10">

        {/* Header */}
        <div className="flex justify-between mb-10">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Academic Records</h2>
            <p className="text-slate-500 text-sm">
              Manage and share your verified documents
            </p>
          </div>

          <div className="flex gap-3">
            <div className="hidden md:flex items-center relative">
              <Search className="absolute left-3 text-slate-400" size={16} />
              <input
                type="text"
                placeholder="Search files..."
                className="pl-10 pr-4 py-2 border rounded-xl text-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileUpload} />

            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl"
            >
              {isUploading ? <Loader2 className="animate-spin" /> : <Upload size={16} />}
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-4 py-2 rounded-full text-sm ${
                activeTab === cat ? 'bg-blue-100 text-blue-700' : 'bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((doc) => (
              <div key={doc.id} className="bg-white p-5 rounded-xl border">

                <div className="relative group/card h-40 mb-3 rounded-lg overflow-hidden bg-slate-50 border border-slate-100 flex items-center justify-center">
                  {getThumbnail(doc) ? (
                    <img
                      src={getThumbnail(doc)}
                      alt={doc.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover/card:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = ''; // Clear src on error
                        (e.target as HTMLImageElement).className = 'hidden';
                      }}
                    />
                  ) : (
                    <div className="p-4 bg-slate-50 text-slate-300">
                      <FileText size={48} />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover/card:opacity-100 transition-opacity flex items-center justify-center">
                     <button 
                       onClick={() => openFile(doc.url, false, doc.name)}
                       className="p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg text-blue-600 hover:scale-110 transition-transform"
                     >
                       <Eye size={20} />
                     </button>
                  </div>
                </div>

                <div className="flex justify-between mb-1 items-start">
                  <h3 className="font-semibold truncate flex-1 pr-2" title={doc.name}>{doc.name}</h3>
                  {getIcon(doc.category)}
                </div>
                <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">{doc.size} • {doc.date}</p>

                <div className="flex justify-between mt-4">
                  <span className="text-emerald-600 text-sm">{doc.status}</span>

                  <div className="flex items-center gap-2">

                    {/* 👁️ VIEW */}
                    <button
                      onClick={() => openFile(doc.url, false, doc.name)}
                      className="p-2 hover:bg-indigo-50 rounded-lg text-slate-500 hover:text-indigo-600 transition-colors"
                      title="Preview"
                    >
                      <Eye size={16} />
                    </button>

                    {/* ⬇️ DOWNLOAD */}
                    <button
                      onClick={() => openFile(doc.url, true, doc.name)}
                      className="p-2 hover:bg-blue-50 rounded-lg text-slate-500 hover:text-blue-600 transition-colors"
                      title="Download"
                    >
                      <Download size={16} />
                    </button>

                    {/* 🗑️ DELETE */}
                    <button
                      onClick={() => deleteDocument(doc.id)}
                      className="p-2 hover:bg-rose-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>

                  </div>
                </div>

              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-20 text-gray-400">
              <FileClock size={40} />
              <p>No documents found</p>
            </div>
          )}
        </div>

      </main>

      {/* 📄 PDF Preview Modal */}
      <Dialog open={!!previewUrl} onOpenChange={(open) => !open && setPreviewUrl(null)}>
        <DialogContent className="max-w-5xl h-[90vh] p-0 overflow-hidden flex flex-col border-none shadow-2xl">
          <DialogHeader className="p-4 border-b bg-white shrink-0">
            <div className="flex items-center justify-between pr-8">
              <DialogTitle className="text-lg font-bold truncate flex items-center gap-2">
                <FileText className="text-blue-600" size={18} />
                {previewName}
              </DialogTitle>
              <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.open(previewUrl!, '_blank')}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                  >
                    <ExternalLink size={14} />
                    Open in New Tab
                  </button>
              </div>
            </div>
          </DialogHeader>
          
          <div className="flex-1 bg-slate-100 relative">
            {previewUrl && (
              <iframe
                src={`${previewUrl}#toolbar=0`}
                className="w-full h-full border-none"
                title="Preview"
              />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Documents;