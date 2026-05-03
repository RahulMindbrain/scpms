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
    admin:   "from-indigo-500 to-violet-600",
    student: "from-cyan-500 to-indigo-500",
    company: "from-emerald-500 to-cyan-500",
  }
  const gradientClass = roleColors[role ?? ""] ?? "from-indigo-500 to-violet-600"

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border bg-sidebar transition-all duration-300" {...props}>
      <SidebarHeader className="h-20 flex items-center justify-center px-4 shrink-0 overflow-hidden relative">
        {/* Soft Background Glow for Logo Area */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-cyan-500/5 rounded-full blur-[40px] pointer-events-none" />
        
        <div className="flex items-center gap-3 w-full justify-start group-data-[collapsible=icon]:justify-center relative z-10">
          {/* Premium Logo Icon with vibrant gradient */}
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/20 shrink-0 transition-all duration-500">
             <GraduationCap className="size-5 text-white" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden animate-in fade-in slide-in-from-left-4 duration-500">
            <span className="text-[18px] font-black tracking-tight text-cyan-400">CPMS</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="size-1.5 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_rgba(34,211,238,0.4)]" />
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">{role} Portal</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-2 gap-1 no-scrollbar">
        <NavMain items={navigation.main} />
        <div className="px-4 py-2 group-data-[collapsible=icon]:px-2">
           <div className="h-[1px] bg-gradient-to-r from-transparent via-sidebar-border to-transparent w-full" />
        </div>
        <NavSecondary items={navigation.secondary} />
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter className="border-t border-sidebar-border/50 p-2 bg-sidebar/50 backdrop-blur-sm">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>

  )
}
