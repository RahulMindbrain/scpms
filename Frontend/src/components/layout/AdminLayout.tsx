import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import type { AppDispatch } from '../../redux/store/store';
import Sidebar from './Sidebar';
import type { SidebarItem } from './Sidebar';
import { 
  LayoutDashboard, 
  Settings, 
  Briefcase, 
  Users, 
  Calendar, 
  BarChart3,
  Building2,
  Menu,
  FileText,
  ListChecks,
  Mail,
  Folder
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', section: 'Management' },
    { icon: Users, label: 'Students', path: '/admin/students', section: 'Management' },
    { icon: Building2, label: 'Companies', path: '/admin/companies', section: 'Management' },
    { icon: Briefcase, label: 'Placement Drives', path: '/admin/drives', section: 'Management' },
    { icon: FileText, label: 'Applications', path: '/admin/applications', section: 'Management' },
    { icon: ListChecks, label: 'Shortlisting', path: '/admin/shortlisting', section: 'Management' },
    { icon: Calendar, label: 'Interview Scheduler', path: '/admin/event-management', section: 'Management' },
    
    { icon: BarChart3, label: 'Analytics', path: '/admin/report', section: 'Tools' },
    { icon: Mail, label: 'Bulk Email', path: '/admin/bulk-email', section: 'Tools' },
    { icon: Folder, label: 'Document Management', path: '/admin/documents', section: 'Tools' },
    { icon: Settings, label: 'Settings', path: '/admin/setting', section: 'Tools' },
  ];

  const handleSignOut = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#f8fafc] text-slate-900 font-sans">
      {/* Mobile Header */}
      <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-[#111827] text-white border-b border-white/5 sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-cyan-400 rounded-lg flex items-center justify-center">
            <LayoutDashboard className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg">CPMS Admin</span>
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
  subtitle="Admin Portal"
      />

      <main className="flex-1 min-h-screen overflow-x-hidden">
        <div className="p-4 md:p-8 pt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
