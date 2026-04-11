import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import type { SidebarItem } from './Sidebar';
import { 
  LayoutDashboard, 
  PlusCircle, 
  Briefcase, 
  Users, 
  ListChecks, 
  Calendar, 
  FileEdit,
  Menu,
  GraduationCap
} from 'lucide-react';

const CompanyLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/company/dashboard', section: 'Recruitment' },
    { icon: PlusCircle, label: 'Post Job', path: '/company/post-job', section: 'Recruitment' },
    { icon: Briefcase, label: 'Manage Jobs', path: '/company/jobs', section: 'Recruitment' },
    { icon: Users, label: 'Applicants', path: '/company/applicants', section: 'Recruitment' },
    
    { icon: ListChecks, label: 'Shortlist', path: '/company/shortlist', section: 'Selection' },
    { icon: Calendar, label: 'Interview Rounds', path: '/company/interviews', section: 'Selection' },
    { icon: FileEdit, label: 'Update Results', path: '/company/results', section: 'Selection' },
  ];

  const handleSignOut = () => {
    console.log('Recruiter signing out...');
    // Add logic to clear auth state if needed
    navigate('/login');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#111827] text-white border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">CPMS</span>
        </div>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
      </header>

      <Sidebar 
        items={sidebarItems} 
        isCollapsed={isCollapsed}
        onToggle={() => setIsCollapsed(!isCollapsed)}
        onSignOut={handleSignOut} 
        isOpenMobile={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
        title="CPMS"             
        subtitle="Recruiter Portal"
      />

      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="p-4 md:p-8 pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default CompanyLayout;
