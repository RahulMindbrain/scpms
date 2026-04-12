import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"
import { 
  LayoutDashboard, Users, Building2, Briefcase, FileText, ListChecks, Calendar, 
  BarChart3, Mail, Folder, Settings, User, CheckCircle, FileSearch, Bell, 
  PlusCircle, FileEdit 
} from "lucide-react"

const routeIcons: Record<string, React.ReactNode> = {
  "/admin/dashboard": <LayoutDashboard className="size-4" />,
  "/admin/students": <Users className="size-4" />,
  "/admin/companies": <Building2 className="size-4" />,
  "/admin/drives": <Briefcase className="size-4" />,
  "/admin/jobs": <ListChecks className="size-4" />,
  "/admin/applications": <FileText className="size-4" />,
  "/admin/shortlisting": <ListChecks className="size-4" />,
  "/admin/event-management": <Calendar className="size-4" />,
  "/admin/report": <BarChart3 className="size-4" />,
  "/admin/bulk-email": <Mail className="size-4" />,
  "/admin/documents": <Folder className="size-4" />,
  "/admin/setting": <Settings className="size-4" />,
  "/student/dashboard": <LayoutDashboard className="size-4" />,
  "/student/profile": <User className="size-4" />,
  "/student/eligibility": <CheckCircle className="size-4" />,
  "/student/jobs": <Briefcase className="size-4" />,
  "/student/application": <FileSearch className="size-4" />,
  "/student/interview": <Calendar className="size-4" />,
  "/student/notifications": <Bell className="size-4" />,
  "/student/documents": <FileText className="size-4" />,
  "/company/dashboard": <LayoutDashboard className="size-4" />,
  "/company/profile": <Building2 className="size-4" />,
  "/company/post-job": <PlusCircle className="size-4" />,
  "/company/jobs": <Briefcase className="size-4" />,
  "/company/applicants": <Users className="size-4" />,
  "/company/shortlist": <ListChecks className="size-4" />,
  "/company/interviews": <Calendar className="size-4" />,
  "/company/results": <FileEdit className="size-4" />,
}

export function SiteHeader() {
  const location = useLocation()
  
  const getTitle = () => {
    const path = location.pathname.split("/").filter(Boolean).pop()
    if (!path) return "Dashboard"
    return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ")
  }

  const getIcon = () => {
    return routeIcons[location.pathname] || <LayoutDashboard className="size-4" />
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center text-muted-foreground">
            {getIcon()}
          </div>
          <h1 className="text-base font-semibold">{getTitle()}</h1>
        </div>
      </div>
    </header>
  )
}

