'use client'

import React from 'react'
import { usePathname } from 'next/navigation'
import { SidebarTrigger } from '../ui/sidebar'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export default function DashboardNavbar() {
  const path = usePathname();

  return (
    <nav className='sticky top-0 bg-white w-full border-b px-6 py-3'>
      <div className='flex items-center gap-x-4'>
        <SidebarTrigger />
        <span>|</span>
        <Breadcrumb>
          <BreadcrumbList>
            {path.split('/').slice(1).map((p, i) => (
              <React.Fragment key={i}>
                <BreadcrumbItem className='capitalize'>
                  {i === path.split('/').length - 2 ? (
                    <BreadcrumbPage>
                      {p.split('-').join(' ')}
                    </BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink href={path.split('/').slice(0, i + 2).join('/')}>
                      {p.split('-').join(' ')}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {i !== path.split('/').length - 2 && <BreadcrumbSeparator />}
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
        {/* {path.split('/').map(p => (

        ))} */}
      </div>
    </nav>
  )
}
