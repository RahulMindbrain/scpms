import React from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "@/redux/thunks/logoutThunk"
import type { AppDispatch } from "@/redux/store/store"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { EllipsisVerticalIcon, LogOutIcon } from "lucide-react"
import { toast } from "sonner"

export function NavUser({
  user,
}: {
  user: {
    name: string
    email: string
    avatar: string
  }
}) {
  const { isMobile } = useSidebar()
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const handleLogout = () => {
    dispatch(logoutUser())
    toast.success("Logged out successfully", { id: "logout-toast" })
    navigate("/login", { replace: true })
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem className="group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-12 data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-foreground rounded-xl border border-sidebar-border hover:bg-sidebar-accent transition-all duration-300 group-data-[collapsible=icon]:size-11 group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:justify-center"
              tooltip={user.name}
            >
              <div className="relative group/avatar flex items-center justify-center">
                <Avatar className="h-9 w-9 rounded-lg border border-sidebar-border shadow-md transition-transform duration-300 group-hover/avatar:scale-110">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold">{user.avatar}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-cyan-500 border-2 border-sidebar shadow-sm" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-3">
                <span className="truncate font-bold text-sidebar-foreground/90">{user.name}</span>
                <span className="truncate text-[11px] text-sidebar-foreground/40 font-medium tracking-tight">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4 text-sidebar-foreground/20 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-2xl bg-popover/95 backdrop-blur-xl border-border shadow-2xl p-2"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={12}
          >
            <DropdownMenuLabel className="p-3 font-normal">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl border border-border">
                  <AvatarFallback className="rounded-xl bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 font-bold">{user.avatar}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-foreground">{user.name}</span>
                  <span className="truncate text-xs text-muted-foreground">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-border/50 my-2" />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="flex items-center gap-3 p-3 text-red-500 hover:bg-red-500/10 hover:text-red-600 focus:bg-red-500/10 rounded-xl cursor-pointer transition-all duration-200"
            >
              <div className="flex size-8 items-center justify-center rounded-lg bg-red-500/10">
                <LogOutIcon className="size-4" />
              </div>
              <span className="font-semibold">Sign Out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
