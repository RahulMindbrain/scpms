import { useState, useRef, useEffect } from 'react';
import {
  FileText, Upload, Download, Trash2,
  Search, FileCheck, FileClock,
  MoreVertical, ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { useCloudinaryUpload } from '@/hooks/useCloudinaryUpload';
import { Loader2 } from 'lucide-react';

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
  const openFile = (url: string, download = false) => {
    if (!url) {
      toast.error("Invalid file URL");
      return;
    }

    const finalUrl = download
      ? url.replace('/upload/', '/upload/fl_attachment/')
      : url;

    const link = document.createElement('a');
    link.href = finalUrl;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';

    if (download) {
      link.setAttribute('download', '');
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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

                <div className="flex justify-between mb-3">
                  {getIcon(doc.category)}
                  <MoreVertical size={16} />
                </div>

                <h3 className="font-semibold truncate">{doc.name}</h3>
                <p className="text-xs text-gray-400">{doc.size}</p>

                <div className="flex justify-between mt-4">
                  <span className="text-emerald-600 text-sm">{doc.status}</span>

                  <div className="flex items-center gap-2">

                    {/* 👁️ VIEW */}
                    <button
                      onClick={() => openFile(doc.url)}
                      className="p-2 hover:bg-indigo-50 rounded-lg"
                    >
                      <ExternalLink size={16} />
                    </button>

                    {/* ⬇️ DOWNLOAD */}
                    <button
                      onClick={() => openFile(doc.url, true)}
                      className="p-2 hover:bg-blue-50 rounded-lg"
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
    </div>
  );
};

export default Documents;