'use client'

import Link from "next/link"

import { useAuth } from "@/app/auth-provider"
import { Calendar, ChartBarIcon, ChevronDown, Clock, Copy, ExternalLink, Key, LinkIcon, LogOut, Moon, Palette, Settings, User } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "next-auth/react"


export function AppSidebar() {
  const auth = useAuth();

  return (
    <Sidebar>
      <SidebarHeader>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="bg-popover border border-border justify-between hover:bg-sidebar-accent h-auto">
              <div>
                <span className="text-left block">{auth?.data?.user?.name}</span>
                <span className="text-xs text-sidebar-foreground/80 block text-left">{auth?.data?.user?.email}</span>
              </div>

              <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-[--radix-popper-anchor-width]">
            <DropdownMenuLabel>My account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/my-account/profile">
                  <User /> My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/my-account/general">
                  <Settings /> My settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/my-account/appearence">
                  <Moon /> Out of office
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/security/password">
                  <Key /> Password
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/security/password">
                  <User /> Impersonation
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <button className="w-full" onClick={() => signOut()}>
                  <LogOut /> Log out
                </button>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>

          <Link href="/dashboard/event-types" className="block my-[2px]">
            <Button variant="ghost" className="w-full hover:bg-sidebar-accent justify-start">
              <LinkIcon /> Event Types
            </Button>
          </Link>
          <Link href="/dashboard/bookings" className="block my-[2px]">
            <Button variant="ghost" className="w-full hover:bg-sidebar-accent justify-start">
              <Calendar /> Bookings
            </Button>
          </Link>
          <Link href="/dashboard/availability/" className="block my-[2px]">
            <Button variant="ghost" className="w-full hover:bg-sidebar-accent justify-start">
              <Clock /> Availability
            </Button>
          </Link>
          <Link href="/" className="block my-[2px]">
            <Button variant="ghost" className="w-full hover:bg-sidebar-accent justify-start">
              <ChartBarIcon /> Insights
            </Button>
          </Link>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarGroup>
          <Button variant="ghost" className="w-full hover:bg-sidebar-accent justify-start">
            <Copy /> Copy public page link
          </Button>
          <Link href="/" className="block my-[2px]">
            <Button variant="ghost" className="w-full hover:bg-sidebar-accent justify-start">
              <ExternalLink /> View public page
            </Button>
          </Link>
          <Link href="/" className="block my-[2px]">
            <Button variant="ghost" className="w-full hover:bg-sidebar-accent justify-start">
              <Settings /> Settings
            </Button>
          </Link>
          <p className="text-xs text-center text-foreground/70">Lindrit Sulaj \ My Cal © {new Date().getFullYear()}</p>
        </SidebarGroup>

      </SidebarFooter>
    </Sidebar>
  )
}
