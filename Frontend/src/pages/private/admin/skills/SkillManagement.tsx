import { useEffect, useMemo, useState } from "react";
import { Loader2, Plus, Search, Wrench } from "lucide-react";
import { toast } from "sonner";
import { getAPI, postAPI, putAPI } from "@/apis/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Loader from "@/components/Loader";

type Skill = {
  id: number;
  name: string;
};

type ApiResponse<T> = {
  success: boolean;
  message: string;
  data: T;
};

const SkillManagement = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [newSkillName, setNewSkillName] = useState("");
  const [updateSkillName, setUpdateSkillName] = useState("");
  const [editingSkillId, setEditingSkillId] = useState<number | null>(null);

  const loadSkills = async () => {
    try {
      setLoading(true);
      const response = await getAPI<ApiResponse<Skill[]>>("/skills/get-all");
      setSkills(Array.isArray(response?.data) ? response.data : []);
    } catch (error: any) {
      toast.error(error?.message || "Failed to load skills.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSkills();
  }, []);

  const filteredSkills = useMemo(
    () =>
      skills.filter((skill) =>
        skill.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [skills, search],
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const skillName = newSkillName.trim();
    if (!skillName) {
      toast.error("Skill name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await postAPI<ApiResponse<Skill>>("/skills/add", {
        name: skillName,
      });
      toast.success(response?.message || "Skill created successfully.");
      setNewSkillName("");
      setIsCreateOpen(false);
      await loadSkills();
    } catch (error: any) {
      toast.error(error?.message || "Failed to create skill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = async (skillId: number) => {
    try {
      setIsSubmitting(true);
      const response = await getAPI<ApiResponse<Skill>>(`/skills/get/${skillId}`);
      const skill = response?.data;
      if (!skill) {
        toast.error("Skill details not found.");
        return;
      }
      setEditingSkillId(skill.id);
      setUpdateSkillName(skill.name);
      setIsUpdateOpen(true);
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch skill details.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSkillId) return;

    const skillName = updateSkillName.trim();
    if (!skillName) {
      toast.error("Skill name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await putAPI<ApiResponse<Skill>>(
        `/skills/update/${editingSkillId}`,
        { name: skillName },
      );
      toast.success(response?.message || "Skill updated successfully.");
      setIsUpdateOpen(false);
      setEditingSkillId(null);
      setUpdateSkillName("");
      await loadSkills();
    } catch (error: any) {
      toast.error(error?.message || "Failed to update skill.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" /> Skill Management
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">
            Create and manage skills available to students
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Create Skill
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[420px] bg-[#f8fafc] border-none shadow-xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">
                New Skill
              </DialogTitle>
              <DialogDescription className="text-slate-500 text-[13px]">
                Add a new skill to the platform.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-5 pt-2">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-slate-600">
                  Skill Name
                </label>
                <Input
                  required
                  placeholder="e.g. Django Python Framework"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  className="h-10 bg-white border-slate-200"
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader size="sm" /> Creating...
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 mr-2" /> Create
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card className="shadow-sm border border-slate-200/60 rounded-xl max-w-sm">
        <CardContent className="p-6 flex flex-col items-center justify-center">
          <span className="text-[28px] font-bold text-slate-800">{skills.length}</span>
          <span className="text-[13px] text-slate-500 mt-1">Total Skills</span>
        </CardContent>
      </Card>

      <div className="relative w-full sm:w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 bg-white border-slate-200 shadow-sm h-10"
        />
      </div>

      <Card className="overflow-hidden shadow-sm border border-slate-200/60 bg-white rounded-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-500 py-4 pl-6">#</TableHead>
                <TableHead className="font-semibold text-slate-500">Skill Name</TableHead>
                <TableHead className="font-semibold text-slate-500 text-center">ID</TableHead>
                <TableHead className="font-semibold text-slate-500 text-right pr-6">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <Loader text="Loading skills..." />
                  </TableCell>
                </TableRow>
              ) : filteredSkills.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Wrench className="w-10 h-10 opacity-20" />
                      <span className="text-sm font-medium">No skills found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredSkills.map((skill, index) => (
                  <TableRow
                    key={skill.id}
                    className="bg-white hover:bg-slate-50/50 border-b border-slate-100/60 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-400 py-4 pl-6">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-semibold text-slate-800">
                      {skill.name}
                    </TableCell>
                    <TableCell className="text-center text-slate-400 text-sm font-mono">
                      {skill.id}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <Button
                        variant="outline"
                        className="h-8 border-slate-300 hover:bg-slate-100"
                        onClick={() => void openEditDialog(skill.id)}
                        disabled={isSubmitting}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[420px] bg-[#f8fafc] border-none shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-slate-900">
              Update Skill
            </DialogTitle>
            <DialogDescription className="text-slate-500 text-[13px]">
              Edit skill information for student profiles.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-5 pt-2">
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-slate-600">
                Skill Name
              </label>
              <Input
                required
                placeholder="e.g. Swagger"
                value={updateSkillName}
                onChange={(e) => setUpdateSkillName(e.target.value)}
                className="h-10 bg-white border-slate-200"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                onClick={() => setIsUpdateOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader size="sm" /> Updating...
                  </>
                ) : (
                  "Update"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SkillManagement;
