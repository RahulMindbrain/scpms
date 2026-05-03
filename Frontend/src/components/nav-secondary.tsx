"use client"

import * as React from "react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"

export function NavSecondary({
  items,
  ...props
}: {
  items: {
    title: string
    url: string
    icon: React.ReactNode
  }[]
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const location = useLocation()

  return (
    <SidebarGroup {...props}>
      <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500 px-4 mb-1 group-data-[collapsible=icon]:hidden">
        Utilities
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1 px-2 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
          {items.map((item) => {
            const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/')
            return (
              <SidebarMenuItem key={item.title} className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`
                    h-9 transition-colors duration-200 rounded-md border-none relative group/btn
                    ${isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground font-semibold"
                      : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                    }
                    group-data-[collapsible=icon]:size-9 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                  `}
                >
                  <Link to={item.url} className="flex items-center w-full gap-3 px-3 relative group/link group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
                    <span className={`size-4 flex items-center justify-center shrink-0 transition-colors duration-200 ${isActive ? "text-primary" : "text-sidebar-foreground/40 group-hover/link:text-sidebar-foreground"}`}>
                       {item.icon}
                    </span>
                    <span className="text-[13px] group-data-[collapsible=icon]:hidden whitespace-nowrap tracking-tight">{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>

  )
}
