import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Search,
  CheckCircle2,
  UserCheck,
  XCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
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
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { fetchStudents, fetchInactiveStudents, activateStudents } from '@/redux/thunks/studentThunk';
import { fetchDepartments } from '@/redux/thunks/departmentThunk';
import type { AppDispatch } from '@/redux/store/store';
import type { RootState } from '@/redux/reducers/rootReducer';
// import { getAPI } from '@/apis/api';

const StudentManagement: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { students: reduxStudents, inactiveStudents: reduxInactiveStudents, loading, error } = useSelector((state: RootState) => state.student);
  const { departments } = useSelector((state: RootState) => state.department);

  const [activeTab, setActiveTab] = useState<'active' | 'inactive'>('active');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Depts');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Viewing Student Profile State
  // const [isViewProfileModalOpen, setIsViewProfileModalOpen] = useState(false);
  // const [viewingStudent, setViewingStudent] = useState<any>(null);
  // const [viewingStudentDept, setViewingStudentDept] = useState<any>(null);
  // const [isProfileDeptLoading, setIsProfileDeptLoading] = useState(false);

  useEffect(() => {
    dispatch(fetchStudents({}));
    dispatch(fetchInactiveStudents({}));
    dispatch(fetchDepartments());
  }, [dispatch]);

  const students = useMemo(() => {
    const currentList = activeTab === 'active' ? reduxStudents : reduxInactiveStudents;
    return currentList.map((s: any) => {
   
      return {
        id: s.id,
        name: s.firstname ? `${s.firstname} ${s.lastname || ''}` : 'Unknown',
    dept: s.student?.department?.name || 'N/A',
deptId: s.student?.department?.id || null,
        verified: s.status === 'ACTIVE',
        status: s.status.toLowerCase(),
      };
    });
  }, [reduxStudents, reduxInactiveStudents, activeTab, departments]);

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = student.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDept = selectedDept === 'All Depts' || student.dept === selectedDept;
      const matchesStatus = selectedStatus === 'All Status' || student.status === selectedStatus.toLowerCase();
      return matchesSearch && matchesDept && matchesStatus;
    });
  }, [students, searchTerm, selectedDept, selectedStatus]);

  const handleAddStudent = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(" add new student records.");
    setIsAddModalOpen(false);
  };

  // const handleViewProfile = async (student: any) => {
  //   setViewingStudent(student);
  //   setViewingStudentDept(null);
  //   setIsViewProfileModalOpen(true);
  //   setIsProfileDeptLoading(true);
  //   try {
  //     const data = await getAPI<any>(`/dept/${student.deptId}`);
  //     setViewingStudentDept(data?.data || null);
  //   } catch {
  //     // dept data unavailable, just show student info
  //   } finally {
  //     setIsProfileDeptLoading(false);
  //   }
  // };

  const toggleVerification = async (id: number) => {
    const student = students.find((s) => s.id === id);
    if (!student?.verified) {
      const toastId = toast.loading("Activating student account...");
      try {
        await dispatch(activateStudents([id])).unwrap();
        toast.success("Student activated successfully!", { id: toastId });
        dispatch(fetchStudents({}));
        dispatch(fetchInactiveStudents({}));
      } catch (err: any) {
        toast.error(err || "Failed to activate student", { id: toastId });
      }
    } else {
      toast.info("Verification status management is pending for active students.");
    }
  };

  const handleActivateAll = async () => {
    const allIds = reduxInactiveStudents.map((s: any) => s.id);
    if (allIds.length === 0) {
      toast.info("No inactive students to activate.");
      return;
    }
    const toastId = toast.loading(`Activating all ${allIds.length} students...`);
    try {
      await dispatch(activateStudents(allIds)).unwrap();
      toast.success(`${allIds.length} student(s) activated successfully!`, { id: toastId });
      dispatch(fetchStudents({}));
      dispatch(fetchInactiveStudents({}));
    } catch (err: any) {
      toast.error(err || "Failed to activate all students", { id: toastId });
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
    <div className="p-4 md:p-8 space-y-6 bg-[#f8fafc] min-h-screen">
      {/* Top Bar */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full xl:w-auto">
          <div className="relative w-full sm:w-[280px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search students..."
              className="pl-9 bg-white border-slate-200 shadow-sm h-10 w-full"
            />
          </div>
          <Select value={selectedDept} onValueChange={setSelectedDept}>
            <SelectTrigger className="w-full sm:w-[140px] bg-white border-slate-200 shadow-sm h-10">
              <SelectValue placeholder="All Depts" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Depts">All Depts</SelectItem>
              {departments.map((dept: any) => (
                <SelectItem key={dept.id} value={dept.name || dept.deptName}>
                  {dept.name || dept.deptName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={selectedStatus} onValueChange={setSelectedStatus}>
            <SelectTrigger className="w-full sm:w-[140px] bg-white border-slate-200 shadow-sm h-10">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All Status">All Status</SelectItem>
              <SelectItem value="placed">Placed</SelectItem>
              <SelectItem value="in-process">In-Process</SelectItem>
              <SelectItem value="eligible">Eligible</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex flex-row items-center gap-3 w-full xl:w-auto">
          {/* <Button
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 xl:flex-none h-10 bg-white border border-slate-200 text-slate-700 shadow-sm hover:bg-slate-50"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </Button> */}
          <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
            <DialogTrigger asChild>
              {/* <Button className="flex-1 xl:flex-none h-10 shadow-sm bg-blue-600 hover:bg-blue-700 text-white">
                <UserPlus className="w-4 h-4 mr-2" /> Add Student
              </Button> */}
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
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Select Dept" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept: any) => (
                          <SelectItem key={dept.id} value={dept.name || dept.deptName}>
                            {dept.name || dept.deptName}
                          </SelectItem>
                        ))}
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
        <Card className="shadow-sm border border-slate-200/60 rounded-xl">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold text-slate-800">{students.length}</span>
            <span className="text-[13px] text-slate-500 mt-1">Total Students</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-slate-200/60 rounded-xl">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold text-green-500">{reduxStudents.length}</span>
            <span className="text-[13px] text-slate-500 mt-1">Verified</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-slate-200/60 rounded-xl">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold text-orange-400">{reduxInactiveStudents.length}</span>
            <span className="text-[13px] text-slate-500 mt-1">Pending Verification</span>
          </CardContent>
        </Card>
        <Card className="shadow-sm border border-slate-200/60 rounded-xl">
          <CardContent className="p-6 flex flex-col items-center justify-center">
            <span className="text-[28px] font-bold text-blue-600">{students.filter((s: any) => s.status === 'placed').length}</span>
            <span className="text-[13px] text-slate-500 mt-1">Placed</span>
          </CardContent>
        </Card>
      </div>

      {/* Students Table */}
      {/* Tabs + Activate All */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl p-1 w-fit shadow-sm">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeTab === 'active'
                ? 'bg-blue-600 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            Active Students
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'active' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {reduxStudents.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab('inactive')}
            className={`px-5 py-2 rounded-lg text-[13px] font-semibold transition-all ${
              activeTab === 'inactive'
                ? 'bg-orange-500 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
            }`}
          >
            Inactive Students
            <span className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
              activeTab === 'inactive' ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
            }`}>
              {reduxInactiveStudents.length}
            </span>
          </button>
        </div>

        {/* Activate All — visible only on Inactive tab */}
        {activeTab === 'inactive' && reduxInactiveStudents.length > 0 && (
          <Button
            onClick={handleActivateAll}
            className="h-10 bg-orange-500 hover:bg-orange-600 text-white shadow-sm font-semibold text-[13px] px-5 rounded-xl transition-all"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Activate All ({reduxInactiveStudents.length})
          </Button>
        )}
      </div>

      <Card className="overflow-hidden shadow-sm border border-slate-200/60 bg-white rounded-xl">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-white border-b border-slate-100">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold text-slate-500 py-4 pl-6">Name</TableHead>
                <TableHead className="font-semibold text-slate-500 text-center">Department</TableHead>
                <TableHead className="font-semibold text-slate-500 text-center">Verified</TableHead>
                {/* <TableHead className="font-semibold text-slate-500 text-right pr-6">Actions</TableHead> */}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => (
                <TableRow key={student.id} className="bg-white hover:bg-slate-50/50 border-b border-slate-100/60 transition-colors">
                  <TableCell className="font-bold text-slate-800 py-4 pl-6">{student.name}</TableCell>
                  <TableCell className="text-slate-600 font-medium text-center">{student.dept}</TableCell>
                  <TableCell className="text-center">
                    <button onClick={() => toggleVerification(student.id)} className="transition-transform hover:scale-105 active:scale-95">
                      {student.verified ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-green-500 text-white text-[11px] font-medium tracking-wide shadow-sm">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-orange-200 text-orange-500 text-[11px] font-medium tracking-wide bg-orange-50/50 shadow-sm">
                           <XCircle className="w-3 h-3 text-orange-400" /> Pending
                        </span>
                      )}
                    </button>
                  </TableCell>
                  {/* <TableCell className="text-right pr-6">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors rounded-lg"
                      onClick={() => handleViewProfile(student)}
                    >
                      <Eye className="w-5 h-5" />
                    </Button>
                  </TableCell> */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {filteredStudents.length === 0 && (
          <div className="py-20 text-center text-muted-foreground">
            <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
            <p className="font-medium">No results matched your search</p>
          </div>
        )}
      </Card>
      
      {/* Student Profile Modal */}
      {/* <Dialog open={isViewProfileModalOpen} onOpenChange={setIsViewProfileModalOpen}>
        <DialogContent className="sm:max-w-[425px] bg-[#f8fafc] border-none shadow-xl rounded-xl">
          <DialogHeader className="text-left mb-2">
            <DialogTitle className="text-xl font-semibold text-slate-900">Student Profile</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium text-[13px]">
              Review and verify student details
            </DialogDescription>
          </DialogHeader>
          {viewingStudent && (
            <div className="grid grid-cols-2 gap-y-6 gap-x-4 py-2">
              <div>
                <p className="text-[13px] text-slate-500 mb-1">Name</p>
                <p className="font-semibold text-slate-900 text-sm">{viewingStudent.name}</p>
              </div>
              <div>
                <p className="text-[13px] text-slate-500 mb-1">Department</p>
                <p className="font-semibold text-slate-900 text-sm">{viewingStudent.dept}</p>
                <div className="mt-1.5">
                  {isProfileDeptLoading ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-3 h-3 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-[11px] text-slate-400">Loading...</span>
                    </div>
                  ) : viewingStudentDept ? (
                    viewingStudentDept.isActive ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" /> Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-red-50 border border-red-200 text-red-600 text-[10px] font-semibold">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 inline-block" /> Inactive
                      </span>
                    )
                  ) : null}
                </div>
              </div>
              <div>
                <p className="text-[13px] text-slate-500 mb-1">Verified</p>
                <p className="font-semibold text-slate-900 text-sm mt-1">{viewingStudent.verified ? 'Yes' : 'No'}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default StudentManagement;
