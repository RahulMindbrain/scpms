import React from "react"
import { NavLink, useLocation } from "react-router-dom"
import { motion } from "framer-motion"
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
      <SidebarGroupLabel className="text-[11px] font-black uppercase tracking-[0.2em] text-sidebar-foreground/80 px-4 mb-1 group-data-[collapsible=icon]:hidden">
        Core Modules
      </SidebarGroupLabel>
      <SidebarMenu className="gap-1 px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
        {items.map((item) => {
          const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/')
          return (
            <SidebarMenuItem key={item.title} className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                isActive={isActive}
                className={`
                  h-9 transition-colors duration-200 rounded-md border-none relative group/btn
                  ${isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                  }
                  group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                `}
              >
                <NavLink to={item.url} className="flex items-center w-full gap-3 px-3 relative cursor-pointer group/link group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
                  <span className={`size-4 flex items-center justify-center shrink-0 transition-colors duration-200 ${isActive ? "text-primary" : "text-sidebar-foreground/70 group-hover/link:text-sidebar-foreground"}`}>
                    {item.icon}
                  </span>
                  <span className="text-[13px] group-data-[collapsible=icon]:hidden whitespace-nowrap tracking-tight">{item.title}</span>
                  
                  {isActive && (
                    <motion.div 
                      layoutId="sidebar-active-indicator"
                      className="absolute left-0 w-1 h-4 bg-primary rounded-r-full group-data-[collapsible=icon]:hidden"
                    />
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
