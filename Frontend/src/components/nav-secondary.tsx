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
      <SidebarGroupLabel className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#c7c4d7]/50 px-3 mb-1">
        General
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => {
            const isActive = location.pathname === item.url || location.pathname.startsWith(item.url + '/')
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  className={
                    isActive
                      ? "bg-[rgba(99,102,241,0.15)] text-[#c0c1ff] font-semibold border border-[rgba(99,102,241,0.25)]"
                      : "text-[#c7c4d7] hover:bg-[rgba(255,255,255,0.05)] hover:text-[#e2e2eb]"
                  }
                >
                  <Link to={item.url} className="flex items-center gap-2.5">
                    <span className={`size-4 shrink-0 ${isActive ? "text-[#6366f1]" : "text-[#908fa0]"}`}>
                      {item.icon}
                    </span>
                    <span className="text-sm">{item.title}</span>
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
