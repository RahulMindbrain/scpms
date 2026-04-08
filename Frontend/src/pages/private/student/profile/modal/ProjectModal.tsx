import { X } from "lucide-react";
import { useState } from "react";

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

  if (!isOpen) return null;

  const handleSubmit = () => {
    const tagsArray = project.tags.split(",").map(tag => tag.trim());

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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

      <div className="bg-white w-[520px] p-6 rounded-2xl shadow-xl relative">

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-bold mb-6">Add New Project</h2>

        <div className="space-y-4">

          <input
            placeholder="Project Title"
            className="border p-3 w-full rounded-lg"
            value={project.title}
            onChange={(e) =>
              setProject({ ...project, title: e.target.value })
            }
          />

          <textarea
            placeholder="Project Description"
            className="border p-3 w-full rounded-lg"
            value={project.description}
            onChange={(e) =>
              setProject({ ...project, description: e.target.value })
            }
          />

          <input
            placeholder="Tech Stack (React, Node, Mongo)"
            className="border p-3 w-full rounded-lg"
            value={project.tags}
            onChange={(e) =>
              setProject({ ...project, tags: e.target.value })
            }
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e: any) =>
              setProject({ ...project, image: e.target.files[0] })
            }
          />

        </div>

        <div className="flex justify-end gap-3 mt-6">

          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
          >
            Add Project
          </button>

        </div>
      </div>
    </div>
  );
};

export default ProjectModal;