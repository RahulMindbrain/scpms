import React from "react"
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
      <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-[0.15em] text-white/20 px-4 mb-3 group-data-[collapsible=icon]:hidden">
        Main Menu
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1.5 px-2 group-data-[collapsible=icon]:px-0">
        {items.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/')
          return (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
                className={`
                  h-10 transition-all duration-300 rounded-xl border-none
                  ${isActive
                    ? "bg-indigo-500/15 text-indigo-400 font-bold shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <NavLink to={item.url} className="flex items-center w-full gap-3 px-3 relative cursor-pointer group/link group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                  <span className={`size-5 flex items-center justify-center shrink-0 transition-all duration-300 ${isActive ? "text-indigo-400 scale-110" : "text-white/30 group-hover/link:text-white"}`}>
                    {item.icon}
                  </span>
                  <span className="text-[13.5px] group-data-[collapsible=icon]:hidden whitespace-nowrap">{item.title}</span>
                  {isActive && (
                    <div className="absolute left-0 w-1 h-5 bg-indigo-500 rounded-r-full shadow-[0_0_12px_rgba(99,102,241,0.6)] group-data-[collapsible=icon]:hidden" />
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
