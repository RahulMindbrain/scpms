import { NavLink, useLocation } from "react-router-dom"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const location = useLocation()

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/');
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title} isActive={isActive} className={isActive ? "bg-indigo-50 text-indigo-700 font-semibold" : ""}>
                <NavLink to={item.url} className="flex items-center w-full gap-2 relative cursor-pointer">
                  {item.icon}
                  <span className="group-data-[collapsible=icon]:hidden">{item.title}</span>
                  {isActive && (
                    <div className="absolute left-[-8px] w-1.5 h-6 bg-indigo-600 rounded-r-full group-data-[collapsible=icon]:hidden" />
                  )}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )
        })}
      </SidebarMenu>
    </SidebarGroup>
  )
}
