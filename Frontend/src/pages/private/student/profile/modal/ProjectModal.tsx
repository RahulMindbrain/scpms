import { X, Upload } from "lucide-react";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: any) => void;
};

const ProjectModal = ({ isOpen, onClose, onAddProject }: ProjectModalProps) => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    tags: "",
    image: null as File | null
  });

  const handleSubmit = () => {
    if (!project.title.trim()) return;

    const tagsArray = project.tags.split(",").map(tag => tag.trim()).filter(t => t);

    onAddProject({
      title: project.title,
      description: project.description,
      tags: tagsArray,
      image: project.image
    });

    onClose();

    setProject({
      title: "",
      description: "",
      tags: "",
      image: null
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-3xl p-8">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-slate-900">Add New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-slate-500">Project Title</Label>
            <Input
              id="title"
              placeholder="e.g. AI Portfolio Platform"
              className="rounded-2xl border-slate-200 focus:ring-blue-500/10 h-12 font-bold"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-slate-500">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your project..."
              className="rounded-2xl border-slate-200 focus:ring-blue-500/10 min-h-[120px] font-medium"
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="tags" className="text-xs font-black uppercase tracking-widest text-slate-500">Tech Stack (Comma separated)</Label>
            <Input
              id="tags"
              placeholder="React, TypeScript, Tailwind"
              className="rounded-2xl border-slate-200 focus:ring-blue-500/10 h-12 font-bold"
              value={project.tags}
              onChange={(e) => setProject({ ...project, tags: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-widest text-slate-500">Project Preview Image</Label>
            <div className="flex items-center gap-4">
               <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-slate-200 rounded-2xl cursor-pointer hover:border-blue-500 hover:bg-blue-50/50 transition-all group">
                  <Upload size={18} className="text-slate-400 group-hover:text-blue-500" />
                  <span className="text-sm font-bold text-slate-500 group-hover:text-blue-700">
                    {project.image ? project.image.name : 'Choose snapshot'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e: any) => setProject({ ...project, image: e.target.files[0] })}
                  />
               </label>
               {project.image && (
                 <Button variant="ghost" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => setProject({ ...project, image: null })}>
                   <X size={18} />
                 </Button>
               )}
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest border-slate-200"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 rounded-2xl h-12 font-black uppercase tracking-widest bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-500/20"
          >
            Add Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;