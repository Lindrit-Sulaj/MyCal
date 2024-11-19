import React from 'react'
import Link from 'next/link'
import { ArrowLeft, Edit2 } from 'lucide-react'

import { getSchedule } from '@/app/actions/schedule'

import MakeDefault from './make-default'
import EditSchedule from './edit-schedule'
import DeleteSchedule from './delete-schedule'

import { Button } from '@/components/ui/button'
import { generateWorkDays } from '@/lib/generateWorkDays'
import { Separator } from '@/components/ui/separator'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export default async function SchedulePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const schedule = await getSchedule(id)
  const workDays = generateWorkDays(schedule?.availableDays!)

  if (!schedule) {
    return (
      <div>
        Schedule doesn't exist
      </div>
    )
  }

  return (
    <div>
      <div className="border-b py-4 flex flex-row items-center justify-between px-6 md:px-8">
        <div className='flex items-center gap-x-4'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/availability">
                  <Button size="icon" variant="secondary">
                    <ArrowLeft />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to all schedules</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>


          <div>
            <h1 className='font-medium lg:text-lg'>{schedule?.name}</h1>
            <p className='text-sm text-foreground/80'>
              {workDays.map((d, i) => (
                <React.Fragment key={i}>
                  {d} {workDays.length - 1 !== i && <br />}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
        <div className="hidden sm:flex gap-x-4 items-center">
          <MakeDefault scheduleId={schedule.id} isDefault={schedule.isDefault} />
          <Separator orientation='vertical' className='h-1/2' />
          <DeleteSchedule id={schedule.id} />
        </div>
        <Sheet >
          <SheetTrigger className='sm:hidden' asChild>
            <Button size="icon" variant="ghost">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="!size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
              </svg>
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>{schedule.name}</SheetTitle>
              <SheetDescription className='sr-only'>{schedule.name}</SheetDescription>
            </SheetHeader>
            <div className="h-full flex flex-col py-4">
              <MakeDefault scheduleId={schedule.id} isDefault={schedule.isDefault} />
              <div className="mt-auto">
                <DeleteSchedule id={schedule.id} />
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      <EditSchedule availableDays={schedule.availableDays} id={schedule.id} scheduleName={schedule.name} />
    </div>
  )
}
