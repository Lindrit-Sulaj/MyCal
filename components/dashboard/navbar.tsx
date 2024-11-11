'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '../ui/sidebar'
import { Separator } from '../ui/separator'

export default function DashboardNavbar() {
  const path = usePathname();

  return (
    <nav className='sticky top-0 bg-white w-full border-b px-6 py-3'>
      <div className='flex gap-x-2'>
        <SidebarTrigger />
        <span>|</span>
        {path}
      </div>
    </nav>
  )
}
