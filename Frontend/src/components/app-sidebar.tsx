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
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5! hover:bg-sidebar-accent"
            >
              <a href="#" className="flex items-center gap-3">
                {/* Gradient logo icon */}
                <div className={`flex aspect-square size-9 items-center justify-center rounded-xl bg-gradient-to-br ${gradientClass} shadow-lg shadow-indigo-500/25 shrink-0`}>
                  <GraduationCap className="size-5 text-white" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none group-data-[collapsible=icon]:hidden">
                  <span className="text-[16px] font-semibold">Smart CPMS</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{role} Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ── Navigation ── */}
      <SidebarContent className="py-2">
        <NavMain items={navigation.main} />
        <SidebarSeparator className="bg-sidebar-border my-2" />
        <NavSecondary items={navigation.secondary} className="mt-0" />
      </SidebarContent>

      {/* ── Footer / User ── */}
      <SidebarFooter className="border-t border-sidebar-border pt-2">
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>

  )
}
