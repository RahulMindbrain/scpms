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
  ShieldCheck,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
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
          { title: "Dashboard", url: "/admin/dashboard", icon: <LayoutDashboard /> },
          { title: "Students", url: "/admin/students", icon: <Users /> },
          { title: "Companies", url: "/admin/companies", icon: <Building2 /> },
          { title: "Placement Drives", url: "/admin/drives", icon: <Briefcase /> },
          { title: "Manage Jobs", url: "/admin/jobs", icon: <ListChecks /> },
          { title: "Applications", url: "/admin/applications", icon: <FileText /> },
          { title: "Interview Scheduler", url: "/admin/event-management", icon: <Calendar /> },
          { title: "Skills", url: "/admin/skills", icon: <Wrench /> },
        ],
        secondary: [
          { title: "Bulk Email", url: "/admin/bulk-email", icon: <Mail /> },
          { title: "Notifications", url: "/admin/notification", icon: <Bell /> },
          { title: "Departments", url: "/admin/departments", icon: <Building2 /> },
        ],
      }
    } else if (role === "student") {
      return {
        main: [
          { title: "Dashboard", url: "/student/dashboard", icon: <LayoutDashboard /> },
          { title: "My Profile", url: "/student/profile", icon: <User /> },
          { title: "Eligibility", url: "/student/eligibility", icon: <CheckCircle /> },
          { title: "Job Listings", url: "/student/jobs", icon: <Briefcase /> },
          { title: "My Applications", url: "/student/application", icon: <FileSearch /> },
        ],
        secondary: [
          { title: "Notifications", url: "/student/notifications", icon: <Bell /> },
        ],
      }
    } else if (role === "company") {
      return {
        main: [
          { title: "Dashboard", url: "/company/dashboard", icon: <LayoutDashboard /> },
          { title: "Profile", url: "/company/profile", icon: <Building2 /> },
          { title: "Post Job", url: "/company/post-job", icon: <PlusCircle /> },
          { title: "Manage Jobs", url: "/company/jobs", icon: <Briefcase /> },
          { title: "Applicants", url: "/company/applicants", icon: <Users /> },
        ],
        secondary: [
          { title: "Shortlist", url: "/company/shortlist", icon: <ListChecks /> },
          { title: "Interview Rounds", url: "/company/interviews", icon: <Calendar /> },
          { title: "Notifications", url: "/company/notifications", icon: <Bell /> },
        ],
      }
    } else if (role === "super_admin") {
      return {
        main: [
          { title: "Dashboard", url: "/superadmin/dashboard", icon: <LayoutDashboard /> },
          { title: "Professions", url: "/superadmin/professions", icon: <Briefcase /> },
          { title: "Universities", url: "/superadmin/universities", icon: <Building2 /> },
          { title: "Admins", url: "/superadmin/admins", icon: <ShieldCheck /> },
        ],
        secondary: [
          { title: "Notifications", url: "/superadmin/notifications", icon: <Bell /> },
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




  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar dark:bg-[#0B0E14] transition-all duration-300"
      {...props}
    >
      <SidebarHeader className="h-16 flex items-center px-3 shrink-0 overflow-hidden border-b border-sidebar-border/30">
        <div className="flex items-center gap-3 w-full justify-start group-data-[collapsible=icon]:justify-center">
          <div className="flex aspect-square size-9 items-center justify-center rounded-xl bg-blue-600 shadow-sm shrink-0">
            <GraduationCap className="size-5 text-white" />
          </div>
          <div className="flex flex-col leading-tight group-data-[collapsible=icon]:hidden">
            <span className="text-[15px] font-bold tracking-tight text-slate-900 dark:text-white">CPMS</span>
            <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">{role} Portal</span>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-1 py-4 gap-1 no-scrollbar">
        <NavMain items={navigation.main} />
        <SidebarSeparator className="my-2 opacity-50" />
        <NavSecondary items={navigation.secondary} />
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter className="border-t border-sidebar-border/30 p-2">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>


  )
}
