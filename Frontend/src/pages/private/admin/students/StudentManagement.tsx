import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  Download,
  Plus, CheckCircle2,
  Clock, UserPlus,
  Trash2,
  Edit2,
  UserX,
  UserCheck
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import { fetchStudents, fetchInactiveStudents, activateStudents } from '@/redux/thunks/studentThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';

const StudentManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students: reduxStudents, inactiveStudents: reduxInactiveStudents, loading, error } = useSelector((state: RootState) => state.student);

  const [activeTab, setActiveTab] = useState('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Depts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents({}));
    dispatch(fetchInactiveStudents({}));
  }, [dispatch]);

  const students = useMemo(() => {
    const currentList = activeTab === 'active' ? reduxStudents : reduxInactiveStudents;
    return currentList.map((s: any) => ({
      id: s.id,
      name: s.firstname ? `${s.firstname} ${s.lastname || ''}` : 'Unknown',
      dept: s.student?.branch || 'N/A',
      cgpa: s.student?.cgpa || 0,
      backlogs: s.student?.backlogs || 0,
      status: s.status.toLowerCase(),
      verified: s.status === 'ACTIVE',
      company: s.student?.placedAt || '-',
      package: s.student?.salary || '-',
    }));
  }, [reduxStudents, reduxInactiveStudents, activeTab]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === 'All Depts' || student.dept === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [students, searchTerm, selectedDept]);

  const handleExport = async () => {
    setIsExporting(true);
    const toastId = toast.loading("Generating student database export...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    toast.success("Student records exported successfully!", { id: toastId });
    setIsExporting(false);
  };

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Integrate with backend to add new student records.");
    setIsAddModalOpen(false);
  };

  const toggleVerification = async (id: number) => {
    if (activeTab === 'inactive') {
      const toastId = toast.loading("Activating student account...");
      try {
        await dispatch(activateStudents([id])).unwrap();
        toast.success("Student activated successfully!", { id: toastId });
        // Refresh both lists
        dispatch(fetchStudents({}));
        dispatch(fetchInactiveStudents({}));
      } catch (err: any) {
        toast.error(err || "Failed to activate student", { id: toastId });
      }
    } else {
      toast.info("Verification status management is pending for active students.");
    }
  };

  if (loading && reduxStudents.length === 0) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-[60vh] flex-col items-center justify-center space-y-4">
        <p className="text-destructive font-bold uppercase tracking-widest">{error}</p>
        <Button onClick={() => dispatch(fetchStudents({}))}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto space-y-8 animate-in mt-6 p-4 md:p-6 bg-slate-50/50 rounded-3xl border border-slate-200/60">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20">
            <UserPlus className="w-6 h-6" />
          </div>
          
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 lg:flex-none"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              <Button className="flex-1 lg:flex-none">
                <Plus className="w-4 h-4 mr-2" /> Add Student
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Register New Student</DialogTitle>
                <DialogDescription>
                  Add a student record to the placement database.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddStudent} className="space-y-6 pt-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                    <Input required placeholder="Ex: John Doe" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Department</label>
                    <Select defaultValue="CSE">
                      <SelectTrigger>
                        <SelectValue placeholder="Select Dept" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="CSE">Computer Science</SelectItem>
                        <SelectItem value="IT">Information Tech</SelectItem>
                        <SelectItem value="ECE">Electronics</SelectItem>
                        <SelectItem value="ME">Mechanical</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">CGPA</label>
                    <Input type="number" step="0.01" required placeholder="0.00" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Roll Number</label>
                    <Input required placeholder="24CS001" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit" className="w-full">Create Record</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-none border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">Total Active</CardDescription>
            <CardTitle className="text-2xl font-black">{reduxStudents.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">Verified & ready</p>
          </CardContent>
        </Card>
        <Card className="shadow-none border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">Inactive</CardDescription>
            <CardTitle className="text-2xl font-black">{reduxInactiveStudents.length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">Awaiting activation</p>
          </CardContent>
        </Card>
        <Card className="shadow-none border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">Backlogs</CardDescription>
            <CardTitle className="text-2xl font-black">{reduxStudents.filter((s: any) => (s.student?.backlogs || 0) > 0).length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">Active with backlogs</p>
          </CardContent>
        </Card>
        <Card className="shadow-none border-slate-200">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-bold uppercase tracking-wider">Placed</CardDescription>
            <CardTitle className="text-2xl font-black">{reduxStudents.filter((s: any) => s.status === 'PLACED').length}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground font-medium">Target achieved</p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="active" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" /> Active Students
          </TabsTrigger>
          <TabsTrigger value="inactive" className="flex items-center gap-2">
            <UserX className="w-4 h-4" /> Inactive Students
          </TabsTrigger>
        </TabsList>

        <TabsContent value="active">
          {/* Filters Area moved inside TabsContent if needed, or kept outside for global filtering */}
        </TabsContent>
        <TabsContent value="inactive">
        </TabsContent>
      </Tabs>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search students..."
            className="pl-9 bg-slate-50 border-slate-200"
          />
        </div>

        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg">
          {['All Depts', 'CSE', 'IT'].map(dept => (
            <Button
              key={dept}
              variant={selectedDept === dept ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setSelectedDept(dept)}
              className={`h-8 px-4 text-[10px] font-bold uppercase tracking-wider ${selectedDept === dept ? "bg-white shadow-sm" : ""}`}
            >
              {dept}
            </Button>
          ))}
        </div>
      </div>

      {/* Students Table */}
      <Card className="overflow-hidden border-slate-200 shadow-none">
        <Table>
          <TableHeader className="bg-slate-50/50">
            <TableRow>
              <TableHead className="w-[300px] text-[10px] font-black uppercase tracking-wider pl-6">Student Name</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-wider text-center">Branch</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-wider text-center">CGPA</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-wider text-center">Backlogs</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-wider">Status</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-wider">Verified</TableHead>
              <TableHead className="text-[10px] font-black uppercase tracking-wider text-right pr-6">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStudents.map((student) => (
              <TableRow key={student.id} className="group transition-colors">
                <TableCell className="py-4 pl-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200 shadow-sm group-hover:scale-105 transition-transform">
                      {student.name.split(' ').map((n: string) => n[0]).join('')}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 group-hover:text-primary transition-colors">{student.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase font-semibold">{student.dept}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Badge variant="secondary" className="text-[10px] font-bold">{student.dept}</Badge>
                </TableCell>
                <TableCell className="text-center font-bold text-sm">{student.cgpa}</TableCell>
                <TableCell className="text-center">
                  <span className={`text-xs font-bold ${student.backlogs > 0 ? 'text-destructive underline decoration-destructive/30' : 'text-slate-400'}`}>
                    {student.backlogs || 'NIL'}
                  </span>
                </TableCell>
                <TableCell>
                  <Badge className="uppercase tracking-widest text-[9px] font-bold">
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <button
                    onClick={() => toggleVerification(student.id)}
                    className={`flex items-center gap-1.5 py-1 px-3 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-all ${student.verified
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : activeTab === 'inactive'
                        ? 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                      }`}
                  >
                    {student.verified ? (
                      <>
                        <CheckCircle2 className="w-3" /> Verified
                      </>
                    ) : activeTab === 'inactive' ? (
                      <>
                        <UserCheck className="w-3" /> Activate
                      </>
                    ) : (
                      <>
                        <Clock className="w-3" /> Pending
                      </>
                    )}
                  </button>
                </TableCell>
                <TableCell className="text-right pr-6">
                  <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-primary"><Edit2 size={14} /></Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-destructive"><Trash2 size={14} /></Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredStudents.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="font-bold uppercase tracking-widest text-sm">No results matched your search</p>
          </div>
        )}
      </Card>
      <div className="h-10" />
    </div>
  );
};

export default StudentManagement;
