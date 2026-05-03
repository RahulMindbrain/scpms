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
    <Sidebar collapsible="icon" className="border-r border-white/5 bg-[#0c0e14]" {...props}>
      <SidebarHeader className="h-20 flex flex-row items-center px-4 shrink-0 overflow-hidden">
        <div className="flex items-center gap-3 w-full">
          {/* Premium Logo Icon */}
          <div className="flex aspect-square size-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 shrink-0 transition-all duration-300 group-data-[collapsible=icon]:mx-auto">
             <GraduationCap className="size-6 text-white" />
          </div>
          <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden animate-in fade-in slide-in-from-left-4 duration-500">
            <span className="text-[17px] font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">Smart CPMS</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="size-1.5 rounded-full bg-indigo-500 animate-pulse" />
              <span className="text-[10px] text-indigo-400/80 uppercase font-bold tracking-widest">{role} Portal</span>
            </div>
          </div>
        </div>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="px-2 py-4 gap-4 bg-[#0c0e14]">
        <div className="space-y-6">
          <NavMain items={navigation.main} />
          <div className="px-4">
             <div className="h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent w-full" />
          </div>
          <NavSecondary items={navigation.secondary} className="mt-0" />
        </div>
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter className="border-t border-white/5 p-4 bg-[#0c0e14]">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>

  )
}
