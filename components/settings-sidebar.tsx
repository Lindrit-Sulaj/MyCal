import React from 'react'
import Link from 'next/link'
import { Button } from './ui/button'
import { ArrowLeft, User, Key, Menu } from 'lucide-react'
import SideLink from './side-link'

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default function SettingsSidebar() {
  return (
    <div className="lg:w-1/4 lg:max-w-[280px] p-2 border-b border-border lg:p-6 lg:border-r lg:h-full">
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="lg:w-full">
          <Button className="w-full justify-start" variant="ghost">
            <ArrowLeft /> Go back
          </Button>
        </Link>
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="ghost" className='lg:hidden'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="!size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader className='sr-only'>
              <SheetTitle>Profile settings</SheetTitle>
              <SheetDescription>
                Profile settings
              </SheetDescription>
            </SheetHeader>
            <div>
              <p className="text-[13px] font-medium text-foreground/80 flex gap-x-2 items-center"><User className="size-5" /> My Account</p>
              <div className="flex flex-col space-y-[1px] mt-2">
                <SideLink label="Profile" url="/settings/my-account/profile" />
                <SideLink label="General" url="/settings/my-account/general" />
                <SideLink label="Appearance" url="/settings/my-account/appearance" />
                <SideLink label="Out of office" url="/settings/my-account/out-of-office" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-[13px] font-medium text-foreground/80 flex gap-x-2 items-center"><Key className="size-5" /> Security</p>
              <div className="flex flex-col space-y-[1px] mt-2">
                <SideLink label="Password" url="/settings/security/password" />
                <SideLink label="Impersonation" url="/settings/security/impersonation" />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="mt-4 hidden lg:block">
        <div>
          <p className="text-[13px] font-medium text-foreground/80 flex gap-x-2 items-center"><User className="size-5" /> My Account</p>
          <div className="flex flex-col space-y-[1px] mt-2">
            <SideLink label="Profile" url="/settings/my-account/profile" />
            <SideLink label="General" url="/settings/my-account/general" />
            <SideLink label="Appearance" url="/settings/my-account/appearance" />
            <SideLink label="Out of office" url="/settings/my-account/out-of-office" />
          </div>
          <div className="mt-4">
            <p className="text-[13px] font-medium text-foreground/80 flex gap-x-2 items-center"><Key className="size-5" /> Security</p>
            <div className="flex flex-col space-y-[1px] mt-2">
              <SideLink label="Password" url="/settings/security/password" />
              <SideLink label="Impersonation" url="/settings/security/impersonation" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
