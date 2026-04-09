import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import type { SidebarItem } from './Sidebar';
import {
  LayoutDashboard,
  User,
  CheckCircle,
  Briefcase,
  FileSearch,
  Calendar,
  Bell,
  FileText,
  Menu
} from 'lucide-react';

const StudentLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard', section: 'Main' },
    { icon: User, label: 'My Profile', path: '/student/profile', section: 'Main' },
    { icon: CheckCircle, label: 'Eligibility', path: '/student/eligibility', section: 'Main' },
    { icon: Briefcase, label: 'Job Listings', path: '/student/jobs', section: 'Main' },
    { icon: FileSearch, label: 'My Applications', path: '/student/application', section: 'Main' },
    { icon: Calendar, label: 'Interview Schedule', path: '/student/interview', section: 'Tools' },
    { icon: Bell, label: 'Notifications', path: '/student/notifications', section: 'Tools' },
    { icon: FileText, label: 'Documents', path: '/student/documents', section: 'Tools' },
  ];

  const handleSignOut = () => {
    console.log('Signing out...');
    navigate('/login');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#111827] text-white border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
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
        subtitle="Student Portal"

      />

      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="p-4 md:p-8 pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default StudentLayout;
