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
      <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#c7c4d7]/50 px-3 mb-1">
        Navigation
      </SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/')
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
                className={
                  isActive
                    ? "bg-[rgba(99,102,241,0.15)] text-[#c0c1ff] font-semibold border border-[rgba(99,102,241,0.25)] shadow-[0_0_12px_rgba(99,102,241,0.2)]"
                    : "text-[#c7c4d7] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#e2e2eb]"
                }
              >
                <NavLink to={item.url} className="flex items-center w-full gap-2.5 relative cursor-pointer transition-all duration-200">
                  <span className={`size-4 shrink-0 ${isActive ? "text-[#6366f1]" : "text-[#908fa0]"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm">{item.title}</span>
                  {isActive && (
                    <div className="absolute left-[-8px] w-[3px] h-5 bg-[#6366f1] rounded-r-full shadow-[0_0_8px_rgba(99,102,241,0.8)]" />
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
