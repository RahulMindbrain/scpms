import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Globe, Code2 } from "lucide-react";

type ProjectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onAddProject: (project: any) => void;
};

const ProjectModal = ({ isOpen, onClose, onAddProject }: ProjectModalProps) => {
  const [project, setProject] = useState({
    title: "",
    description: "",
    techStack: "",
    githubUrl: "",
    liveUrl: ""
  });

  const handleSubmit = async () => {
    if (!project.title.trim()) return;

    onAddProject({
      title: project.title,
      description: project.description,
      techStack: project.techStack,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl
    });

    onClose();

    setProject({
      title: "",
      description: "",
      techStack: "",
      githubUrl: "",
      liveUrl: ""
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[520px] rounded-2xl p-0 overflow-hidden bg-[#1e1f26] border border-[rgba(255,255,255,0.08)] shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-black uppercase tracking-tight text-[#e2e2eb]">Add New Project</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4 px-7">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest text-[#908fa0]">Project Title</Label>
            <Input
              id="title"
              placeholder="e.g. AI Portfolio Platform"
              className="rounded-2xl border-[rgba(255,255,255,0.08)] focus:ring-indigo-500/10 h-12 font-bold"
              value={project.title}
              onChange={(e) => setProject({ ...project, title: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-xs font-black uppercase tracking-widest text-[#908fa0]">Project Description</Label>
            <Textarea
              id="description"
              placeholder="Tell us about your project..."
              className="rounded-2xl border-[rgba(255,255,255,0.08)] focus:ring-indigo-500/10 min-h-[100px] font-medium"
              value={project.description}
              onChange={(e) => setProject({ ...project, description: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="techStack" className="text-xs font-black uppercase tracking-widest text-[#908fa0]">Tech Stack (e.g. React, Nodejs)</Label>
            <Input
              id="techStack"
              placeholder="React, TypeScript, Tailwind"
              className="rounded-2xl border-[rgba(255,255,255,0.08)] focus:ring-indigo-500/10 h-12 font-bold"
              value={project.techStack}
              onChange={(e) => setProject({ ...project, techStack: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="githubUrl" className="text-xs font-black uppercase tracking-widest text-[#908fa0]">GitHub Link</Label>
              <div className="relative">
                <Code2 className="absolute left-3 top-3.5 h-4 w-4 text-[#908fa0]" />
                <Input
                  id="githubUrl"
                  placeholder="https://github.com..."
                  className="rounded-2xl border-[rgba(255,255,255,0.08)] focus:ring-indigo-500/10 h-12 font-bold pl-10"
                  value={project.githubUrl}
                  onChange={(e) => setProject({ ...project, githubUrl: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="liveUrl" className="text-xs font-black uppercase tracking-widest text-[#908fa0]">Live Demo</Label>
              <div className="relative">
                <Globe className="absolute left-3 top-3.5 h-4 w-4 text-[#908fa0]" />
                <Input
                  id="liveUrl"
                  placeholder="https://project.com..."
                  className="rounded-2xl border-[rgba(255,255,255,0.08)] focus:ring-indigo-500/10 h-12 font-bold pl-10"
                  value={project.liveUrl}
                  onChange={(e) => setProject({ ...project, liveUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-row gap-3 mt-4">
          <Button
            variant="outline"
            onClick={onClose}
            className="flex-1 rounded-xl h-11 font-bold border-[rgba(255,255,255,0.1)] text-[#c7c4d7] hover:bg-[rgba(255,255,255,0.05)]"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 rounded-xl h-11 font-bold bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-500/20"
          >
            Add Project
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProjectModal;