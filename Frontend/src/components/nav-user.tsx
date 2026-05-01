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
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { EllipsisVerticalIcon, LogOutIcon, UserCircle2 } from "lucide-react"

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
    navigate("/login")
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <div className="flex items-center gap-3 px-2 py-2 rounded-xl hover:bg-[rgba(255,255,255,0.04)] transition-colors group">
            {/* Avatar */}
            <Avatar className="h-8 w-8 rounded-lg ring-1 ring-[rgba(99,102,241,0.3)] shrink-0">
              <AvatarImage src={user.avatar} alt={user.name} />
              <AvatarFallback className="rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-xs font-bold">
                {user.avatar}
              </AvatarFallback>
            </Avatar>

            {/* Name & Email */}
            <div className="grid flex-1 text-left text-sm leading-tight min-w-0">
              <span className="truncate font-medium text-[#e2e2eb]">{user.name}</span>
              <span className="truncate text-xs text-[#908fa0]">{user.email}</span>
            </div>

            {/* Trigger */}
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 hover:bg-[rgba(99,102,241,0.15)] rounded-md transition-colors cursor-pointer outline-none opacity-0 group-hover:opacity-100">
                <EllipsisVerticalIcon className="size-4 text-[#908fa0]" />
              </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              className="w-56 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1e1f26] shadow-xl shadow-black/40 text-[#e2e2eb]"
              side={isMobile ? "bottom" : "right"}
              align="end"
              sideOffset={8}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2.5 px-3 py-2.5">
                  <Avatar className="h-9 w-9 rounded-lg ring-1 ring-[rgba(99,102,241,0.3)]">
                    <AvatarImage src={user.avatar} alt={user.name} />
                    <AvatarFallback className="rounded-lg bg-gradient-to-br from-indigo-600 to-violet-600 text-white text-xs font-bold">
                      {user.avatar}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold text-[#e2e2eb]">{user.name}</span>
                    <span className="truncate text-xs text-[#908fa0]">{user.email}</span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-[rgba(255,255,255,0.06)] mx-2" />

              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer mx-1 rounded-lg text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 focus:bg-rose-500/10 focus:text-rose-300 transition-colors"
              >
                <LogOutIcon className="mr-2 h-4 w-4" />
                <span>Sign out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </div>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}
