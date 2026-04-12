import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"
import { 
  LayoutDashboard, Users, Building2, Briefcase, FileText, ListChecks, Calendar, 
  BarChart3, Mail, Folder, Settings, User, CheckCircle, FileSearch, Bell, 
  PlusCircle, FileEdit 
} from "lucide-react"

const routeIcons: Record<string, any> = {
  "/admin/dashboard": LayoutDashboard,
  "/admin/students": Users,
  "/admin/companies": Building2,
  "/admin/drives": Briefcase,
  "/admin/jobs": ListChecks,
  "/admin/applications": FileText,
  "/admin/shortlisting": ListChecks,
  "/admin/event-management": Calendar,
  "/admin/report": BarChart3,
  "/admin/bulk-email": Mail,
  "/admin/documents": Folder,
  "/admin/setting": Settings,
  "/student/dashboard": LayoutDashboard,
  "/student/profile": User,
  "/student/eligibility": CheckCircle,
  "/student/jobs": Briefcase,
  "/student/application": FileSearch,
  "/student/interview": Calendar,
  "/student/notifications": Bell,
  "/student/documents": FileText,
  "/company/dashboard": LayoutDashboard,
  "/company/profile": Building2,
  "/company/post-job": PlusCircle,
  "/company/jobs": Briefcase,
  "/company/applicants": Users,
  "/company/shortlist": ListChecks,
  "/company/interviews": Calendar,
  "/company/results": FileEdit,
}

export function SiteHeader() {
  const location = useLocation()
  
  const getTitle = () => {
    const path = location.pathname.split("/").filter(Boolean).pop()
    if (!path) return "Dashboard"
    return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ")
  }

  const PageIcon = routeIcons[location.pathname] || LayoutDashboard

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <div className="flex items-center gap-2">
          <div className="flex items-center justify-center p-1.5 bg-muted rounded-md text-muted-foreground">
            <PageIcon className="size-4" />
          </div>
          <h1 className="text-base font-semibold">{getTitle()}</h1>
        </div>
      </div>
    </header>
  )
}


