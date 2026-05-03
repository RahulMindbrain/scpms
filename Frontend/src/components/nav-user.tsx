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
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="h-14 data-[state=open]:bg-white/5 data-[state=open]:text-white rounded-xl border border-white/5 hover:bg-white/5 transition-all duration-300"
              tooltip={user.name}
            >
              <div className="relative group/avatar">
                <Avatar className="h-9 w-9 rounded-lg border border-white/10 shadow-lg transition-transform duration-300 group-hover/avatar:scale-110">
                  <AvatarImage src={user.avatar} alt={user.name} />
                  <AvatarFallback className="rounded-lg bg-indigo-500/20 text-indigo-400 font-bold">{user.avatar}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full bg-indigo-500 border-2 border-[#0c0e14] shadow-glow" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-3">
                <span className="truncate font-bold text-white/90">{user.name}</span>
                <span className="truncate text-[11px] text-white/40 font-medium tracking-tight">
                  {user.email}
                </span>
              </div>
              <EllipsisVerticalIcon className="ml-auto size-4 text-white/20 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="w-64 rounded-2xl bg-[#111319]/95 backdrop-blur-xl border-white/10 shadow-2xl p-2"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={12}
          >
            <DropdownMenuLabel className="p-3 font-normal">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 rounded-xl border border-white/10">
                  <AvatarFallback className="rounded-xl bg-indigo-500/20 text-indigo-400 font-bold">{user.avatar}</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-white">{user.name}</span>
                  <span className="truncate text-xs text-white/40">
                    {user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/5 my-2" />
            <DropdownMenuItem 
              onClick={handleLogout} 
              className="flex items-center gap-3 p-3 text-red-400 hover:bg-red-500/10 hover:text-red-400 focus:bg-red-500/10 rounded-xl cursor-pointer transition-all duration-200"
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
