import { useState } from "react";
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
    issuedDate: ""
  });

  const handleSubmit = () => {
    if (!certificate.title.trim() || !certificate.issuer.trim()) return;

    onAddCertificate(certificate);
    onClose();
    setCertificate({
      title: "",
      issuer: "",
      issuedDate: ""
    });
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
              placeholder="Full Stack Web Development"
              className="rounded-2xl h-12 border-slate-200"
              value={certificate.title}
              onChange={(e) => setCertificate({ ...certificate, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="issuer" className="text-xs font-black uppercase tracking-widest text-slate-500">Issuer</Label>
            <Input
              id="issuer"
              placeholder="Coursera / Udemy / LinkedIn"
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
        </div>

        <DialogFooter className="flex-row gap-3 mt-2">
          <Button variant="outline" onClick={onClose} className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest border-slate-200">
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest bg-blue-600">
            Add
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CertificateModal;
