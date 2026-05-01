import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Building2,
  Pencil,
  Plus,
  Search,
  Trash2,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent } from '@/components/ui/card';

import {
  fetchDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
} from '@/redux/thunks/departmentThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';

import Loader from '@/components/Loader';

const DepartmentManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading } = useSelector((state: RootState) => state.department);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptName, setDeptName] = useState('');
  const [updateDeptName, setUpdateDeptName] = useState('');
  const [editingDeptId, setEditingDeptId] = useState<number | null>(null);
  const [deletingDeptId, setDeletingDeptId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchDepartments());
  }, [dispatch]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim()) {
      toast.error('Department name is required.');
      return;
    }
    setIsSubmitting(true);
    try {
      await dispatch(createDepartment({ name: deptName.trim(), isActive: true })).unwrap();
      toast.success(`Department "${deptName.trim()}" created successfully!`);
      setDeptName('');
      setIsCreateOpen(false);
      dispatch(fetchDepartments());
    } catch (err: any) {
      toast.error(err?.message || 'Failed to create department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filtered = departments.filter((d: any) =>
    (d.name || d.deptName || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openEditDialog = (dept: any) => {
    setEditingDeptId(dept.id);
    setUpdateDeptName(dept.name || dept.deptName || '');
    setIsUpdateOpen(true);
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingDeptId) return;

    const name = updateDeptName.trim();
    if (!name) {
      toast.error('Department name is required.');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await dispatch(
        updateDepartment({ id: editingDeptId, name, isActive: true })
      ).unwrap();
      toast.success(response?.message || 'Department updated successfully.');
      setIsUpdateOpen(false);
      setEditingDeptId(null);
      setUpdateDeptName('');
      dispatch(fetchDepartments());
    } catch (err: any) {
      toast.error(err?.message || 'Failed to update department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deletingDeptId) return;
    setIsSubmitting(true);
    try {
      const response = await dispatch(deleteDepartment(deletingDeptId)).unwrap();
      toast.success(response?.message || 'Department deleted successfully.');
      setIsDeleteDialogOpen(false);
      setDeletingDeptId(null);
      dispatch(fetchDepartments());
    } catch (err: any) {
      toast.error(err?.message || 'Failed to delete department.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#111319] min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#e2e2eb] flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Department Management
          </h1>
          <p className="text-[13px] text-[#908fa0] mt-1">Manage all academic departments</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Create Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] bg-[#111319] border-none shadow-xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-[#e2e2eb]">New Department</DialogTitle>
              <DialogDescription className="text-[#908fa0] text-[13px]">
                Add a new academic department to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-5 pt-2">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-[#c7c4d7]">Department Name</label>
                <Input
                  required
                  placeholder="e.g. Computer Science Engineering"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  className="h-10 bg-[#1e1f26] border-[rgba(255,255,255,0.08)]"
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
                    <><Loader size="sm" /> Creating...</>
                  ) : (
                    <><Plus className="w-4 h-4 mr-2" /> Create</>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
        <Card className="shadow-sm border border-slate-200/60 rounded-xl max-w-sm mx-auto sm:mx-0">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold text-[#e2e2eb]">{departments.length}</span>
            <span className="text-[13px] text-[#908fa0] mt-1">Total Departments</span>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#908fa0]" />
        <Input
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-[#1e1f26] border-[rgba(255,255,255,0.08)] shadow-sm h-10"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden shadow-sm border border-slate-200/60 bg-[#1e1f26] rounded-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-[#1e1f26] border-b border-[rgba(255,255,255,0.06)]">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-[#908fa0] py-4 pl-6">#</TableHead>
                <TableHead className="font-semibold text-[#908fa0]">Department Name</TableHead>
                <TableHead className="font-semibold text-[#908fa0] text-center">ID</TableHead>
                <TableHead className="font-semibold text-[#908fa0] text-right pr-6">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <Loader text="Loading departments..." />
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-[#908fa0]">
                      <Building2 className="w-10 h-10 opacity-20" />
                      <span className="text-sm font-medium">No departments found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((dept: any, index: number) => (
                  <TableRow
                    key={dept.id}
                    className="bg-[#1e1f26] hover:bg-[#111319] border-b border-slate-100/60 transition-colors"
                  >
                    <TableCell className="font-medium text-[#908fa0] py-4 pl-6">{index + 1}</TableCell>
                    <TableCell className="font-semibold text-[#e2e2eb]">
                      {dept.name || dept.deptName || '—'}
                    </TableCell>
                    <TableCell className="text-center text-[#908fa0] text-sm font-mono">
                      {dept.id}
                    </TableCell>
                    <TableCell className="text-right pr-6">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          onClick={() => openEditDialog(dept)}
                          disabled={isSubmitting}
                          title="Edit Department"
                        >
                          <Pencil className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            setDeletingDeptId(dept.id);
                            setIsDeleteDialogOpen(true);
                          }}
                          disabled={isSubmitting}
                          title="Delete Department"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent className="sm:max-w-[400px] bg-[#111319] border-none shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#e2e2eb]">Update Department</DialogTitle>
            <DialogDescription className="text-[#908fa0] text-[13px]">
              Edit department information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdate} className="space-y-5 pt-2">
            <div className="space-y-2">
              <label className="text-[13px] font-semibold text-[#c7c4d7]">Department Name</label>
              <Input
                required
                placeholder="e.g. Computer Science Engineering"
                value={updateDeptName}
                onChange={(e) => setUpdateDeptName(e.target.value)}
                className="h-10 bg-[#1e1f26] border-[rgba(255,255,255,0.08)]"
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
                  <><Loader size="sm" /> Updating...</>
                ) : (
                  'Update'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[400px] bg-[#1e1f26] border-none shadow-xl rounded-xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-[#e2e2eb]">Delete Department</DialogTitle>
            <DialogDescription className="text-[#908fa0] text-[13px]">
              Are you sure you want to delete this department? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-4 gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="flex-1 bg-red-600 hover:bg-red-700 text-white"
              onClick={() => void handleDelete()}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <><Loader size="sm" /> Deleting...</>
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default DepartmentManagement;
