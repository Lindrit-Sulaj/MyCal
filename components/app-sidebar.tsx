'use client'

import { useState } from "react"
import Link from "next/link"
import { signOut } from "next-auth/react"

import { useAuth } from "@/app/auth-provider"
import { Calendar, ChartBarIcon, ChevronDown, Clock, Copy, CopyCheck, ExternalLink, Key, LinkIcon, LogOut, Moon, Palette, Settings, User as UserIcon } from "lucide-react"
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

export function AppSidebar({ username }: { username: string }) {
  const auth = useAuth();

  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    setCopied(true);

    navigator.clipboard.writeText(`https://mycal.lindritsulaj.com/${username}`)

    setTimeout(() => {
      setCopied(false);
    }, 1500)
  }

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
                  <UserIcon /> My Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/my-account/general">
                  <Settings /> My settings
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/my-account/out-of-office">
                  <Moon /> Out of office
                </Link>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem className="cursor-pointer" asChild>
                <Link href="/settings/security/password">
                  <Key /> Security
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
          <Button variant="ghost" className="w-full hover:bg-sidebar-accent justify-start" onClick={copyToClipboard}>
            { copied ? <CopyCheck /> : <Copy /> }
            { !copied ? "Copy public page link" : "Copied public page link" }
          </Button>
          <Link href={`https://mycal.lindritsulaj.com/${username}`} className="block my-[2px]">
            <Button variant="ghost" className="w-full hover:bg-sidebar-accent justify-start">
              <ExternalLink /> View public page
            </Button>
          </Link>
          <Link href="/settings/my-account/general" className="block my-[2px]">
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
