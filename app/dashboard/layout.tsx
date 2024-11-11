import React from 'react'
import { AppSidebar } from '@/components/app-sidebar'
import { SidebarProvider } from '@/components/ui/sidebar'
import DashboardNavbar from '@/components/dashboard/navbar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='w-full'>
        <DashboardNavbar />
        { children }
      </main>
    </SidebarProvider>
  )
}
