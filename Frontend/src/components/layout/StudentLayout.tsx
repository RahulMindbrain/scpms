import React from 'react';
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
  FileText 
} from 'lucide-react';

const StudentLayout: React.FC = () => {
  const navigate = useNavigate();

  const sidebarItems: SidebarItem[] = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/student/dashboard', section: 'Main' },
    { icon: User, label: 'My Profile', path: '/student/profile', section: 'Main' },
    { icon: CheckCircle, label: 'Eligibility', path: '/student/eligibility', section: 'Main' },
    { icon: Briefcase, label: 'Job Listings', path: '/student/jobs', section: 'Main' },
    { icon: FileSearch, label: 'My Applications', path: '/student/Application', section: 'Main' },
    { icon: Calendar, label: 'Interview Schedule', path: '/student/interview', section: 'Tools' },
    { icon: Bell, label: 'Notifications', path: '/student/notifications', section: 'Tools' },
    { icon: FileText, label: 'Documents', path: '/student/documents', section: 'Tools' },
  ];

  const handleSignOut = () => {
    // In a real app, you'd dispatch a logout action
    console.log('Signing out...');
    navigate('/login');
  };

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      <Sidebar 
        items={sidebarItems} 
        portalName="Student Portal" 
        onSignOut={handleSignOut} 
      />
      <main className="flex-1 ml-64 min-h-screen">
        <Outlet />
      </main>
    </div>
  );
};

export default StudentLayout;
