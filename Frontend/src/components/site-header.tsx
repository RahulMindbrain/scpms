import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { useLocation } from "react-router-dom"

export function SiteHeader() {
  const location = useLocation()
  
  const getTitle = () => {
    const path = location.pathname.split("/").filter(Boolean).pop()
    if (!path) return "Dashboard"
    return path.charAt(0).toUpperCase() + path.slice(1).replace("-", " ")
  }

  return (
    <header className="flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <h1 className="text-base font-semibold">{getTitle()}</h1>
      </div>
    </header>
  )
}
