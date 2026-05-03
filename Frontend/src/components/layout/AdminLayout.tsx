import React from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from '../app-sidebar';
import { SidebarInset, SidebarProvider } from '../ui/sidebar';
import { SiteHeader } from '../site-header';
import { TooltipProvider } from '../ui/tooltip';

const AdminLayout: React.FC = () => {
  return (
    <TooltipProvider>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "15.5rem",
            "--header-height": "3.5rem",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset className="bg-background">
          <SiteHeader />
          <main className="relative flex flex-1 flex-col bg-background min-h-0 overflow-y-auto @container/main">
            <Outlet />
          </main>
        </SidebarInset>
      </SidebarProvider>
    </TooltipProvider>
  );
};

export default AdminLayout;
