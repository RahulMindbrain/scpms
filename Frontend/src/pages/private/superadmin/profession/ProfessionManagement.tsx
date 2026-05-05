import { useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, Briefcase, ChevronRight } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "@/redux/store/store";
import type { RootState } from "@/redux/reducers/rootReducer";
import { fetchProfessions, createProfession, updateProfession, deleteProfession } from "@/redux/thunks/superAdminThunk";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
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
import { AdminPageLayout } from "@/components/layout/AdminPageLayout";
import { PageHeader } from "@/components/PageHeader";
import Loader from "@/components/Loader";

const ProfessionManagement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { professions, loading, isSubmitting } = useSelector((state: RootState) => state.superAdmin);
  
  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const [newProfession, setNewProfession] = useState({ name: "", description: "" });
  const [editingProfession, setEditingProfession] = useState<any>(null);
  const [deletingProfessionId, setDeletingProfessionId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchProfessions());
  }, [dispatch]);

  const filteredProfessions = useMemo(
    () =>
      professions.filter((p: any) =>
        p.name.toLowerCase().includes(search.trim().toLowerCase())
      ),
    [professions, search]
  );

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProfession.name.trim()) {
      toast.error("Profession name is required.");
      return;
    }

    try {
      await dispatch(createProfession(newProfession)).unwrap();
      toast.success("Profession created successfully.");
      setNewProfession({ name: "", description: "" });
      setIsCreateOpen(false);
    } catch (error: any) {
      toast.error(error || "Failed to create profession.");
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProfession) return;

    try {
      await dispatch(updateProfession({ id: editingProfession.id, data: editingProfession })).unwrap();
      toast.success("Profession updated successfully.");
      setIsUpdateOpen(false);
      setEditingProfession(null);
    } catch (error: any) {
      toast.error(error || "Failed to update profession.");
    }
  };

  const handleDelete = async () => {
    if (!deletingProfessionId) return;

    try {
      await dispatch(deleteProfession(deletingProfessionId)).unwrap();
      toast.success("Profession deleted successfully.");
      setIsDeleteDialogOpen(false);
      setDeletingProfessionId(null);
    } catch (error: any) {
      toast.error(error || "Failed to delete profession.");
    }
  };

  return (
    <AdminPageLayout>
      <PageHeader
        title="Profession Management"
        description="Define and manage global career paths and professional categories."
        badge="Super Admin"
        icon={Briefcase}
        variant="blue"
      >
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl shadow-lg shadow-blue-500/20 transition-all active:scale-95">
              <Plus className="w-4 h-4 mr-2" /> Add Profession
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-3xl">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black">New Profession</DialogTitle>
                <DialogDescription className="text-blue-100/70 font-medium">
                  Create a new professional category for the platform.
                </DialogDescription>
              </DialogHeader>
            </div>
            <form onSubmit={handleCreate} className="p-8 space-y-6 bg-card">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Profession Name</label>
                <Input
                  required
                  placeholder="e.g. Software Development"
                  value={newProfession.name}
                  onChange={(e) => setNewProfession({ ...newProfession, name: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Description</label>
                <Input
                  placeholder="Brief description of the profession"
                  value={newProfession.description}
                  onChange={(e) => setNewProfession({ ...newProfession, description: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20 transition-all font-bold"
                />
              </div>
              <DialogFooter className="gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  className="flex-1 h-12 rounded-xl font-bold"
                  onClick={() => setIsCreateOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? <Loader size="sm" /> : <><Plus className="w-4 h-4 mr-2" /> Initialize</>}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </PageHeader>

      <div className="space-y-8 pb-10">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
          <div className="relative w-full md:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              placeholder="Search professions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-11 h-12 bg-card border-border/50 rounded-2xl shadow-sm focus:ring-primary/10 transition-all"
            />
          </div>
        </div>

        <div className="saas-card overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead className="w-20 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5 pl-8">#</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5">Profession</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5">Description</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground py-5 text-right pr-8">Management</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-24 text-center">
                      <Loader text="Retrieving profession registry..." />
                    </TableCell>
                  </TableRow>
                ) : filteredProfessions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="py-24 text-center">
                      <div className="flex flex-col items-center gap-4 opacity-40">
                        <Briefcase className="w-12 h-12" />
                        <span className="text-xs font-black uppercase tracking-widest">No professions found</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProfessions.map((profession, index) => (
                    <TableRow key={profession.id} className="border-border/50 hover:bg-muted/30 transition-all group">
                      <TableCell className="font-bold text-muted-foreground py-5 pl-8 tabular-nums">{String(index + 1).padStart(2, '0')}</TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-3">
                          <div className="size-8 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                             <Briefcase className="size-4" />
                          </div>
                          <span className="font-black text-foreground group-hover:text-blue-600 transition-colors">
                            {profession.name}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <span className="text-sm text-muted-foreground font-medium">{profession.description}</span>
                      </TableCell>
                      <TableCell className="text-right py-5 pr-8">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 rounded-xl text-blue-600"
                            onClick={() => {
                              setEditingProfession(profession);
                              setIsUpdateOpen(true);
                            }}
                          >
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-9 rounded-xl text-rose-600"
                            onClick={() => {
                              setDeletingProfessionId(profession.id);
                              setIsDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="size-9 rounded-xl text-muted-foreground">
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Edit Dialog */}
      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden border-none rounded-3xl">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-white">
            <DialogHeader>
              <DialogTitle className="text-2xl font-black">Refine Profession</DialogTitle>
              <DialogDescription className="text-blue-100/70 font-medium">
                Adjust the parameters for the selected professional category.
              </DialogDescription>
            </DialogHeader>
          </div>
          {editingProfession && (
            <form onSubmit={handleUpdate} className="p-8 space-y-6 bg-card">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Profession Name</label>
                <Input
                  required
                  value={editingProfession.name}
                  onChange={(e) => setEditingProfession({ ...editingProfession, name: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20 transition-all font-bold"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground ml-1">Description</label>
                <Input
                  value={editingProfession.description}
                  onChange={(e) => setEditingProfession({ ...editingProfession, description: e.target.value })}
                  className="h-12 bg-muted/30 border-border/50 rounded-xl focus:ring-primary/20 transition-all font-bold"
                />
              </div>
              <DialogFooter className="gap-3">
                <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setIsUpdateOpen(false)}>Cancel</Button>
                <Button type="submit" className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-black" disabled={isSubmitting}>
                  {isSubmitting ? <Loader size="sm" /> : 'Apply Changes'}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-8 border-none rounded-3xl bg-card">
          <div className="size-16 rounded-full bg-rose-500/10 flex items-center justify-center mb-6 mx-auto">
            <Trash2 className="size-8 text-rose-600" />
          </div>
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-black">Delete Profession?</DialogTitle>
            <DialogDescription className="text-muted-foreground font-medium pt-2">
              Are you sure you want to delete this profession? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-8 flex gap-3">
            <Button type="button" variant="ghost" className="flex-1 h-12 rounded-xl font-bold" onClick={() => setIsDeleteDialogOpen(false)}>Abort</Button>
            <Button type="button" className="flex-1 h-12 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black shadow-lg shadow-rose-500/20" onClick={() => void handleDelete()} disabled={isSubmitting}>
              {isSubmitting ? <Loader size="sm" /> : 'Delete'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminPageLayout>
  );
};

export default ProfessionManagement;
