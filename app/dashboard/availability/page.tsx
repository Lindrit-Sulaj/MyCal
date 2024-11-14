import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Globe, Plus } from 'lucide-react'
import { getUser } from '@/app/actions/user'
import { AvailableDays } from '@prisma/client';

export default async function Schedules() {
  const user = await getUser();

  function generateWorkDays(availableDays: AvailableDays[]) {
    let groupedDays: { days: string[], value: string | null }[] = [];

    availableDays.forEach(d => {
      if (groupedDays.length === 0) {
        groupedDays.push({ days: [d.day], value: d.value })
      } else if (groupedDays[groupedDays.length - 1].value === d.value) {
        groupedDays[groupedDays.length - 1].days.push(d.day);
      } else {
        groupedDays.push({ days: [d.day], value: d.value })
      }
    });

    const formattedDates = groupedDays.map(group => {
      let day: string = ''

      if (group.days.length === 1) {
        day = (group.days[0].toLowerCase().charAt(0).toUpperCase() + group.days[0].toLowerCase().slice(1)).slice(0, 3);
      } else {
        let lowercaseFirstDay = group.days[0].toLowerCase();
        let lowercaseLastDay = group.days[group.days.length - 1].toLowerCase();

        let firstDay = (lowercaseFirstDay.charAt(0).toUpperCase() + lowercaseFirstDay.slice(1)).slice(0, 3)
        let secondDay = (lowercaseLastDay.charAt(0).toUpperCase() + lowercaseLastDay.slice(1)).slice(0, 3)

        day = `${firstDay} - ${secondDay}`
      }

      if (group.value) {
        return `${day}, ${group.value}`
      } else {
        return null
      }
    }).filter(f => f !== null)

    return formattedDates
  }

  return (
    <div>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-xl md:text-2xl font-medium'>Schedules</h1>
          <p className='text-sm mt-1 text-foreground/80'>Configure times when you are available for bookings.</p>
        </div>
        <Button>
          <Plus /> Create new
        </Button>
      </div>
      <div className='text-card-foreground bg-neutral-100 dark:bg-neutral-900 border rounded-md mt-4 lg:mt-6 overflow-hidden'>
        {user?.schedules.map((s, i) => {
          const workDays = generateWorkDays(s.availableDays);

          return (
            <Link href={`/dashboard/availability/${s.id}`} key={s.id} className={`p-6 hover:bg-neutral-800 transition-all block ${i !== 0 && "border-b"}`}>
              <h3 className='font-medium'>{s.name}</h3>
              <p className='text-sm mt-1 lg:mt-2 text-foreground/80'>
                {workDays.map((d, i) => (
                  <React.Fragment key={i}>
                    {d} { workDays.length - 1 !== i && <br /> }
                  </React.Fragment>
                ))}
              </p>
              <p className="inline-flex items-center gap-x-2 text-sm mt-1 text-foreground/80">
                <Globe className='size-4' /> {user.timezone}
              </p>
              {/* <pre>{JSON.stringify(s.availableDays, null, 2)}</pre> */}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
