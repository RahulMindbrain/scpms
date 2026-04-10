import React, { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import type { SidebarItem } from './Sidebar';
import { 
  LayoutDashboard, 
  Settings, 
  Briefcase, 
  Users, 
  Calendar, 
  Bell, 
  BarChart3,
  Building2,
  Menu
} from 'lucide-react';

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard', section: 'Main' },
    { icon: Users, label: 'Student Management', path: '/admin/students', section: 'Main' },
    { icon: Building2, label: 'Companies', path: '/admin/companies', section: 'Main' },
    { icon: Briefcase, label: 'Placement Drives', path: '/admin/drives', section: 'Main' },
    { icon: BarChart3, label: 'Reports & Analytics', path: '/admin/analytics', section: 'Tools' },
    { icon: Bell, label: 'Notifications', path: '/admin/notifications', section: 'Tools' },
    { icon: Calendar, label: 'Event Calendar', path: '/admin/calendar', section: 'Tools' },
    { icon: Settings, label: 'Settings', path: '/admin/settings', section: 'System' },
  ];

  const handleSignOut = () => {
    console.log('Admin signing out...');
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
