import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Globe, Plus } from 'lucide-react'
import { getUser } from '@/app/actions/user'
import { AvailableDays } from '@prisma/client';
import ScheduleCard from './schedule-card'
import CreateSchedule from './create-schedule'
import { generateWorkDays } from '@/lib/generateWorkDays'

export default async function Schedules() {
  const user = await getUser();

  return (
    <div className='px-4 py-6 sm:p-6 lg:p-8'>
      <div className='flex flex-col items-start sm:flex-row sm:justify-between sm:items-center space-y-2'>
        <div>
          <h1 className='text-xl md:text-2xl font-medium'>Schedules</h1>
          <p className='text-sm mt-1 text-foreground/80'>Configure times when you are available for bookings.</p>
        </div>
        <CreateSchedule />
      </div>
      <div className='text-card-foreground bg-neutral-100 dark:bg-neutral-900 border rounded-md mt-4 lg:mt-6 overflow-hidden'>
        {user?.schedules.map((s, i) => {
          const workDays = generateWorkDays(s.availableDays);

          return (
            <ScheduleCard key={i} workDays={workDays} s={s} i={i} timezone={user?.timezone!} />
          )
        })}
      </div>
    </div>
  )
}
