import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Building2,
  Plus,
  Loader2,
  Search,
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

import { fetchDepartments, createDepartment } from '@/redux/thunks/departmentThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';

const DepartmentManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { departments, loading } = useSelector((state: RootState) => state.department);

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [deptName, setDeptName] = useState('');

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

  return (
    <div className="p-4 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Building2 className="w-6 h-6 text-blue-600" /> Department Management
          </h1>
          <p className="text-[13px] text-slate-500 mt-1">Manage all academic departments</p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="h-10 bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
              <Plus className="w-4 h-4 mr-2" /> Create Department
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[400px] bg-[#f8fafc] border-none shadow-xl rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold text-slate-900">New Department</DialogTitle>
              <DialogDescription className="text-slate-500 text-[13px]">
                Add a new academic department to the system.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-5 pt-2">
              <div className="space-y-2">
                <label className="text-[13px] font-semibold text-slate-600">Department Name</label>
                <Input
                  required
                  placeholder="e.g. Computer Science Engineering"
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
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
                    <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</>
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
            <span className="text-[28px] font-bold text-slate-800">{departments.length}</span>
            <span className="text-[13px] text-slate-500 mt-1">Total Departments</span>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative w-full sm:w-[300px]">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="Search departments..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-white border-slate-200 shadow-sm h-10"
        />
      </div>

      {/* Table */}
      <Card className="overflow-hidden shadow-sm border border-slate-200/60 bg-white rounded-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-500 py-4 pl-6">#</TableHead>
                <TableHead className="font-semibold text-slate-500">Department Name</TableHead>
                <TableHead className="font-semibold text-slate-500 text-center">ID</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-3 text-slate-400">
                      <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                      <span className="text-sm font-medium">Loading departments...</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="py-20 text-center">
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <Building2 className="w-10 h-10 opacity-20" />
                      <span className="text-sm font-medium">No departments found</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filtered.map((dept: any, index: number) => (
                  <TableRow
                    key={dept.id}
                    className="bg-white hover:bg-slate-50/50 border-b border-slate-100/60 transition-colors"
                  >
                    <TableCell className="font-medium text-slate-400 py-4 pl-6">{index + 1}</TableCell>
                    <TableCell className="font-semibold text-slate-800">
                      {dept.name || dept.deptName || '—'}
                    </TableCell>
                    <TableCell className="text-center text-slate-400 text-sm font-mono">
                      {dept.id}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </Card>
    </div>
  );
};

export default DepartmentManagement;
