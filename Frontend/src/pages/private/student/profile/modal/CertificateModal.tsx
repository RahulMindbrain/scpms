import { useState } from "react";
import { useCloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { Upload } from "lucide-react";
import Loader from "@/components/Loader";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type CertificateModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddCertificate: (certificate: any) => void;
};

const CertificateModal = ({ isOpen, onClose, onAddCertificate }: CertificateModalProps) => {
  const [certificate, setCertificate] = useState({
    title: "",
    issuer: "",
    issuedDate: "",
    certificateUrl: ""
  });
  const [file, setFile] = useState<File | null>(null);

  const { upload: uploadToCloudinary, isUploading } = useCloudinaryUpload();

  const handleSubmit = async () => {
    if (!certificate.title.trim() || !certificate.issuer.trim()) return;

    let finalUrl = certificate.certificateUrl;

    if (file) {
      const url = await uploadToCloudinary(file, "certificates");
      if (url) finalUrl = url;
    }

    onAddCertificate({ ...certificate, certificateUrl: finalUrl });
    onClose();
    setCertificate({
      title: "",
      issuer: "",
      issuedDate: "",
      certificateUrl: ""
    });
    setFile(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">Add Certificate</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-slate-500">Certificate Title</Label>
            <Input
              id="title"
              placeholder="Enter certificate title"
              className="rounded-2xl h-12 border-slate-200"
              value={certificate.title}
              onChange={(e) => setCertificate({ ...certificate, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer" className="text-xs font-black uppercase tracking-widest text-slate-500">Issuer</Label>
            <Input
              id="issuer"
              placeholder="Enter issuer (e.g. Coursera, Udemy)"
              className="rounded-2xl h-12 border-slate-200"
              value={certificate.issuer}
              onChange={(e) => setCertificate({ ...certificate, issuer: e.target.value })}
            />
          </div>

           <div className="space-y-2">
            <Label htmlFor="date" className="text-xs font-black uppercase tracking-widest text-slate-500">Issued Date</Label>
            <Input
              id="date"
              type="date"
              className="rounded-2xl h-12 border-slate-200"
              value={certificate.issuedDate}
              onChange={(e) => setCertificate({ ...certificate, issuedDate: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Certificate File (Optional)</Label>
            <div className="flex items-center gap-4">
               <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                  {isUploading ? <Loader size="sm" /> : <Upload size={18} className="text-slate-400 group-hover:text-blue-500" />}
                  <span className="text-sm font-bold text-slate-500 group-hover:text-blue-700">
                    {file ? file.name : 'Click to upload PDF/Image'}
                  </span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    className="hidden"
                    onChange={(e: any) => setFile(e.target.files[0])}
                  />
               </label>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row gap-3 mt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest border-slate-200">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isUploading}
            className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isUploading ? "Uploading..." : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
