import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  ListChecks,
  Calendar,
  Mail,
  User,
  CheckCircle,
  FileSearch,
  Bell,
  PlusCircle,
  GraduationCap,
  Wrench,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import useAuth from "@/redux/hooks/useAuth"

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, userType, fullName, initials } = useAuth()
  const role = userType?.toLowerCase()

  const navigation = React.useMemo(() => {
    if (role === "admin") {
      return {
        main: [
          { title: "Dashboard",          url: "/admin/dashboard",       icon: <LayoutDashboard /> },
          { title: "Students",           url: "/admin/students",        icon: <Users /> },
          { title: "Companies",          url: "/admin/companies",       icon: <Building2 /> },
          { title: "Placement Drives",   url: "/admin/drives",          icon: <Briefcase /> },
          { title: "Manage Jobs",        url: "/admin/jobs",            icon: <ListChecks /> },
          { title: "Applications",       url: "/admin/applications",    icon: <FileText /> },
          { title: "Interview Scheduler",url: "/admin/event-management",icon: <Calendar /> },
          { title: "Skills",             url: "/admin/skills",          icon: <Wrench /> },
        ],
        secondary: [
          { title: "Bulk Email",         url: "/admin/bulk-email",      icon: <Mail /> },
          { title: "Notifications",      url: "/admin/notification",    icon: <Bell /> },
          { title: "Departments",        url: "/admin/departments",     icon: <Building2 /> },
        ],
      }
    } else if (role === "student") {
      return {
        main: [
          { title: "Dashboard",          url: "/student/dashboard",     icon: <LayoutDashboard /> },
          { title: "My Profile",         url: "/student/profile",       icon: <User /> },
          { title: "Eligibility",        url: "/student/eligibility",   icon: <CheckCircle /> },
          { title: "Job Listings",       url: "/student/jobs",          icon: <Briefcase /> },
          { title: "My Applications",    url: "/student/application",   icon: <FileSearch /> },
        ],
        secondary: [
          { title: "Notifications",      url: "/student/notifications", icon: <Bell /> },
        ],
      }
    } else if (role === "company") {
      return {
        main: [
          { title: "Dashboard",          url: "/company/dashboard",     icon: <LayoutDashboard /> },
          { title: "Profile",            url: "/company/profile",       icon: <Building2 /> },
          { title: "Post Job",           url: "/company/post-job",      icon: <PlusCircle /> },
          { title: "Manage Jobs",        url: "/company/jobs",          icon: <Briefcase /> },
          { title: "Applicants",         url: "/company/applicants",    icon: <Users /> },
        ],
        secondary: [
          { title: "Shortlist",          url: "/company/shortlist",     icon: <ListChecks /> },
          { title: "Interview Rounds",   url: "/company/interviews",    icon: <Calendar /> },
          { title: "Notifications",      url: "/company/notifications", icon: <Bell /> },
        ],
      }
    }
    return { main: [], secondary: [] }
  }, [role])

  const userData = {
    name: fullName,
    email: user?.email ?? "",
    avatar: initials,
  }

  const roleColors: Record<string, string> = {
    admin:   "from-blue-700 via-blue-600 to-indigo-800",
    student: "from-blue-500 via-blue-600 to-blue-700",
    company: "from-cyan-600 via-blue-600 to-blue-800",
  }
  const gradientClass = roleColors[role ?? ""] ?? "from-blue-700 via-blue-600 to-indigo-800"

  return (
    <Sidebar 
      collapsible="icon" 
      className="border-r border-sidebar-border bg-sidebar transition-all duration-300 relative overflow-hidden" 
      {...props}
    >
      <div className="absolute inset-0 bg-[var(--sidebar-gradient)] pointer-events-none" />
      <SidebarHeader className="h-16 flex items-center px-4 shrink-0 overflow-hidden border-b border-sidebar-border/50">
        <div className="flex items-center gap-3 w-full justify-start group-data-[collapsible=icon]:justify-center">
          <div className={`flex aspect-square size-9 items-center justify-center rounded-lg bg-gradient-to-br ${gradientClass} shadow-lg blue-glow shrink-0`}>
             <GraduationCap className="size-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-[16px] font-bold tracking-tight text-sidebar-accent-foreground">CPMS</span>
            <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">{role} Portal</span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-4 gap-1 no-scrollbar">
        <NavMain items={navigation.main} />
        <SidebarSeparator className="my-4 mx-2" />
        <NavSecondary items={navigation.secondary} />
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter className="border-t border-sidebar-border/50 p-2">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>

  )
}
