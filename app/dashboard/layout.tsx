import React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import DashboardNavbar from '@/components/dashboard/navbar'

import { getUser } from '../actions/user'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();
  
  const conditions = [
    !user?.timezone,
    !user?.username,
    user?.schedules.length === 0
  ]

  if (conditions.some(c => c)) {
    redirect('/getting-started')
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <DashboardNavbar />
        <div className="p-6">
          {children}
        </div>
      </main>
    </SidebarProvider>
  )
}
