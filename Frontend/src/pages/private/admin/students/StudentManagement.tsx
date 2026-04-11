import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Download, 
  Plus, 
  MoreHorizontal, 
  CheckCircle2, 
  Clock,
  ChevronDown,
  UserPlus,
  Trash2,
  Edit2,
  Filter
} from 'lucide-react';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

interface Student {
  id: number;
  name: string;
  dept: string;
  cgpa: number;
  backlogs: number;
  status: string;
  verified: boolean;
  company: string;
  package: string;
}

const StudentManagement: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All Depts');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const [students, setStudents] = useState<Student[]>([
    { id: 1, name: 'Priya Sharma', dept: 'CSE', cgpa: 9.4, backlogs: 0, status: 'placed', verified: true, company: 'Google', package: '₹24 LPA' },
    { id: 2, name: 'Rahul Verma', dept: 'IT', cgpa: 9.2, backlogs: 0, status: 'placed', verified: true, company: 'Microsoft', package: '₹20 LPA' },
    { id: 3, name: 'Ananya Patel', dept: 'ECE', cgpa: 9.1, backlogs: 0, status: 'placed', verified: true, company: 'Amazon', package: '₹18 LPA' },
    { id: 4, name: 'Vikram Singh', dept: 'CSE', cgpa: 8.9, backlogs: 0, status: 'in-process', verified: true, company: '-', package: '-' },
    { id: 5, name: 'Sneha Gupta', dept: 'ME', cgpa: 8.5, backlogs: 1, status: 'eligible', verified: false, company: '-', package: '-' },
    { id: 6, name: 'Amit Kumar', dept: 'CE', cgpa: 7.8, backlogs: 0, status: 'eligible', verified: false, company: '-', package: '-' },
    { id: 7, name: 'Neha Reddy', dept: 'EE', cgpa: 8.7, backlogs: 0, status: 'in-process', verified: true, company: '-', package: '-' },
  ]);

  const departments = ['All Depts', 'CSE', 'IT', 'ECE', 'ME', 'EE', 'CE'];

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

  const toggleVerification = (id: number) => {
    setStudents(prev => prev.map(s => s.id === id ? { ...s, verified: !s.verified } : s));
    toast.success("Student verification status updated");
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-700 mt-2 p-4 md:p-0">
      {/* Page Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-xl shadow-blue-500/20">
             <UserPlus className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight uppercase">Student Database</h1>
            <p className="text-slate-500 font-medium">Verify credentials and manage placement eligibility.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button 
            variant="outline"
            onClick={handleExport}
            disabled={isExporting}
            className="flex-1 lg:flex-none py-6 rounded-2xl font-black uppercase tracking-widest text-xs border-slate-200"
          >
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
          <Button 
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 lg:flex-none py-6 rounded-2xl font-black uppercase tracking-widest text-xs bg-blue-600 shadow-xl shadow-blue-500/20"
          >
            <Plus className="w-4 h-4 mr-2" /> Add Student
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard label="Total Students" value={students.length.toString()} subtext="+24 updated" />
        <StatCard label="Verified" value={students.filter(s => s.verified).length.toString()} subtext="Ready for drives" />
        <StatCard label="Backlogs" value={students.filter(s => s.backlogs > 0).length.toString()} subtext="Awaiting clearance" />
        <StatCard label="Placed" value={students.filter(s => s.status === 'placed').length.toString()} subtext="Target achieved" />
      </div>

      {/* Filters Area */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm shadow-slate-200/20">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-600 transition-colors" />
          <input 
            type="text" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, roll no, or branch..." 
            className="w-full pl-11 pr-4 py-4 bg-slate-50/50 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all font-medium"
          />
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
           <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 p-1.5 rounded-2xl">
              {['All Depts', 'CSE', 'IT'].map(dept => (
                <button 
                  key={dept}
                  onClick={() => setSelectedDept(dept)}
                  className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${selectedDept === dept ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}`}
                >
                  {dept}
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/20 overflow-hidden mb-20">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Student Name</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Branch</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">CGPA</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-center">Backlogs</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                <th className="px-6 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Verified</th>
                <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredStudents.map((student) => (
                <tr key={student.id} className="hover:bg-blue-50/30 transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-black text-xs shrink-0 uppercase border border-slate-200 shadow-sm group-hover:scale-110 transition-transform">
                        {student.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">{student.name}</span>
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{student.dept} Branch</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                     <Badge variant="outline" className="text-[10px] font-black">{student.dept}</Badge>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-sm font-black text-slate-900 bg-slate-100 px-3 py-1 rounded-lg">{student.cgpa}</span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`text-xs font-black ${student.backlogs > 0 ? 'text-rose-500 underline underline-offset-4 decoration-rose-200' : 'text-slate-400'}`}>
                      {student.backlogs || 'NIL'}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <Badge variant={student.status === 'placed' ? 'primary' : student.status === 'in-process' ? 'success' : 'secondary'} className="uppercase tracking-widest text-[9px] font-black px-3 py-1">
                      {student.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-5">
                    <button 
                      onClick={() => toggleVerification(student.id)}
                      className={`flex items-center gap-1.5 py-1.5 px-4 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${student.verified 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-200' 
                        : 'bg-amber-100 text-amber-600 hover:bg-amber-200'
                      }`}
                    >
                      {student.verified ? <><CheckCircle2 className="w-3.5 h-3.5" /> Verified</> : <><Clock className="w-3.5 h-3.5" /> Pending</>}
                    </button>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                       <button className="p-2.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"><Edit2 size={16} /></button>
                       <button className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-all"><Trash2 size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredStudents.length === 0 && (
            <div className="py-20 text-center text-slate-300">
                <Search className="w-12 h-12 mx-auto mb-4 opacity-10" />
                <p className="font-bold uppercase tracking-widest">No results matched your search</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Student Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Register New Student"
        subtitle="Add a student record to the placement database"
      >
        <form onSubmit={handleAddStudent} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Full Name</label>
              <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Department</label>
              <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-4 focus:ring-blue-500/5 focus:border-blue-500 appearance-none">
                <option>CSE</option>
                <option>IT</option>
                <option>ECE</option>
                <option>ME</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">CGPA</label>
              <input type="number" step="0.01" required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Roll Number</label>
              <input required className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none" />
            </div>
          </div>
          <Button className="w-full py-7 rounded-2xl bg-blue-600 font-black uppercase tracking-widest text-xs shadow-xl shadow-blue-500/20">
            Create Record
          </Button>
        </form>
      </Modal>
    </div>
  );
};

export default StudentManagement;
