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
      <div className="border-b py-4 flex justify-between px-6 md:px-8">
        <div className='flex items-center gap-x-4'>
          <Link href="/dashboard/availability">
            <Button size="icon" variant="secondary">
              <ArrowLeft />
            </Button>
          </Link>

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
        <div className="flex gap-x-4 items-center">
          <MakeDefault scheduleId={schedule.id} isDefault={schedule.isDefault} />
          <Separator orientation='vertical' className='h-1/2' />
          <DeleteSchedule id={schedule.id} />
        </div>
      </div>
      <div className="p-6 lg:p-8 grid grid-cols-4">
        <EditSchedule className='border col-span-3' availableDays={schedule.availableDays} id={schedule.id} />
      </div>
    </div>
  )
}
