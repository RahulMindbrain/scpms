import * as React from "react"
import {
  LayoutDashboard,
  Users,
  Building2,
  Briefcase,
  FileText,
  ListChecks,
  Calendar,
  BarChart3,
  Mail,
  Folder,
  Settings,
  User,
  CheckCircle,
  FileSearch,
  Bell,
  PlusCircle,
  FileEdit,
  GraduationCap,
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
          { title: "Shortlisting", url: "/admin/shortlisting", icon: <ListChecks /> },
          { title: "Interview Scheduler", url: "/admin/event-management", icon: <Calendar /> },
        ],
        secondary: [
          { title: "Analytics", url: "/admin/report", icon: <BarChart3 /> },
          { title: "Bulk Email", url: "/admin/bulk-email", icon: <Mail /> },
          { title: "Document Management", url: "/admin/documents", icon: <Folder /> },
          { title: "Settings", url: "/admin/setting", icon: <Settings /> },
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
          { title: "Interview Schedule", url: "/student/interview", icon: <Calendar /> },
          { title: "Notifications", url: "/student/notifications", icon: <Bell /> },
          { title: "Documents", url: "/student/documents", icon: <FileText /> },
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
          { title: "Update Results", url: "/company/results", icon: <FileEdit /> },
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
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <GraduationCap className="size-5" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="text-base font-semibold">Smart CPMS</span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">{role} Portal</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navigation.main} />
        <NavSecondary items={navigation.secondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  )
}
