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
      <SidebarGroupLabel className="text-[10px] font-bold uppercase tracking-widest text-slate-400 px-2 mb-2 group-data-[collapsible=icon]:hidden">
        More
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-1 px-1 group-data-[collapsible=icon]:px-0 group-data-[collapsible=icon]:items-center">
          {items.map((item) => {
            const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/')
            return (
              <SidebarMenuItem key={item.title} className="group-data-[collapsible=icon]:w-full group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={`
                    h-10 transition-all duration-200 rounded-xl border-none relative group/btn
                    ${isActive
                      ? "bg-indigo-50 text-indigo-600 font-bold dark:bg-indigo-600 dark:text-white"
                      : "text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/5"
                    }
                    group-data-[collapsible=icon]:size-10 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center
                  `}
                >
                  <Link to={item.url} className="flex items-center w-full gap-3 px-2 relative group/link group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:p-0">
                    <span className={`size-4.5 flex items-center justify-center shrink-0 transition-colors duration-200 ${isActive ? "text-indigo-600 dark:text-white" : "text-slate-400 group-hover/link:text-slate-600 dark:group-hover/link:text-slate-300"}`}>
                       {item.icon}
                    </span>
                    <span className="text-[14px] group-data-[collapsible=icon]:hidden whitespace-nowrap tracking-tight">{item.title}</span>
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
