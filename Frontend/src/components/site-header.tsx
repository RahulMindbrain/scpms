import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"
import { NotificationBell } from "@/components/notification-bell"
import { ModeToggle } from "@/components/mode-toggle"
import {
  LayoutDashboard, Users, Building2, Briefcase, FileText, ListChecks, Calendar,
  BarChart3, Mail, Folder, Settings, User, CheckCircle, FileSearch, Bell,
  PlusCircle, FileEdit, Wrench
} from "lucide-react"

const routeIcons: Record<string, any> = {
  "/admin/dashboard":       LayoutDashboard,
  "/admin/students":        Users,
  "/admin/departments":     Building2,
  "/admin/companies":       Building2,
  "/admin/drives":          Briefcase,
  "/admin/jobs":            ListChecks,
  "/admin/applications":    FileText,
  "/admin/shortlisting":    ListChecks,
  "/admin/event-management":Calendar,
  "/admin/skills":          Wrench,
  "/admin/report":          BarChart3,
  "/admin/bulk-email":      Mail,
  "/admin/documents":       Folder,
  "/admin/notification":    Bell,
  "/admin/setting":         Settings,
  "/student/dashboard":     LayoutDashboard,
  "/student/profile":       User,
  "/student/eligibility":   CheckCircle,
  "/student/jobs":          Briefcase,
  "/student/application":   FileSearch,
  "/student/interview":     Calendar,
  "/student/notifications": Bell,
  "/student/documents":     FileText,
  "/company/dashboard":     LayoutDashboard,
  "/company/profile":       Building2,
  "/company/post-job":      PlusCircle,
  "/company/jobs":          Briefcase,
  "/company/applicants":    Users,
  "/company/shortlist":     ListChecks,
  "/company/interviews":    Calendar,
  "/company/notifications": Bell,
  "/company/results":       FileEdit,
}

const routeTitles: Record<string, string> = {
  "/admin/dashboard":        "Dashboard",
  "/admin/students":         "Students",
  "/admin/departments":      "Departments",
  "/admin/companies":        "Companies",
  "/admin/drives":           "Placement Drives",
  "/admin/jobs":             "Manage Jobs",
  "/admin/applications":     "Applications",
  "/admin/shortlisting":     "Shortlisting",
  "/admin/event-management": "Interview Scheduler",
  "/admin/skills":           "Skills",
  "/admin/bulk-email":       "Bulk Email",
  "/admin/notification":     "Notifications",
  "/student/dashboard":      "Dashboard",
  "/student/profile":        "My Profile",
  "/student/eligibility":    "Eligibility",
  "/student/jobs":           "Job Listings",
  "/student/application":    "My Applications",
  "/student/notifications":  "Notifications",
  "/company/dashboard":      "Dashboard",
  "/company/profile":        "Company Profile",
  "/company/post-job":       "Post a Job",
  "/company/jobs":           "Manage Jobs",
  "/company/applicants":     "Applicants",
  "/company/shortlist":      "Shortlist",
  "/company/interviews":     "Interview Rounds",
  "/company/notifications":  "Notifications",
}

export function SiteHeader() {
  const location = useLocation()

  const getTitle = () => {
    // Exact match first
    if (routeTitles[location.pathname]) return routeTitles[location.pathname]
    // Fallback: humanize last segment
    const path = location.pathname.split("/").filter(Boolean).pop()
    if (!path) return "Dashboard"
    return path.charAt(0).toUpperCase() + path.slice(1).replace(/-/g, " ")
  }

  const PageIcon = routeIcons[location.pathname] || LayoutDashboard

  return (
    <header className="
      flex h-(--header-height) shrink-0 items-center gap-2
      border-b border-border
      bg-background
      transition-[width,height,background-color] ease-linear
      group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)
    ">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        {/* Sidebar toggle */}
        <SidebarTrigger className="-ml-1 text-muted-foreground hover:text-foreground hover:bg-accent/10 transition-colors" />

        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4 bg-border"
        />

        {/* Page title + icon */}
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center p-1.5 bg-primary/10 rounded-md text-primary">
            <PageIcon className="size-4" />
          </div>
          <h1 className="text-sm font-semibold text-foreground tracking-tight">{getTitle()}</h1>
        </div>

        {/* Right side actions */}
        <div className="ml-auto flex items-center gap-3">
          <ModeToggle />
          <NotificationBell />
        </div>
      </div>
    </header>
  )
}
