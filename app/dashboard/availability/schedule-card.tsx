'use client'
import React from 'react'
import Link from 'next/link';
import { DayOfWeek } from '@prisma/client';

import { Edit, Globe, Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from '@/components/ui/badge';

export default function ScheduleCard({ workDays, s, i, timezone }: {
  workDays: string[],
  s: {
    id: string;
    name: string;
    isDefault: boolean | null;
    userId: string;
    availableDays: {
      day: DayOfWeek;
      value: string | null;
    }[];
  },
  i: number,
  timezone: string
},) {
  return (
    <Link href={`/dashboard/availability/${s.id}`} className={`p-6 hover:bg-white dark:hover:bg-neutral-950 transition-all flex justify-between items-center ${i !== 0 && "border-t"}`}>
      <div>
        <h3 className='font-medium inline-flex items-center gap-x-2'>{s.name} {s.isDefault && <Badge>Default</Badge>}</h3>
        <p className='text-sm mt-1 text-foreground/80'>
          {workDays.map((d, i) => (
            <React.Fragment key={i}>
              {d} {workDays.length - 1 !== i && <br />}
            </React.Fragment>
          ))}
        </p>
        <p className="inline-flex items-center gap-x-2 text-sm mt-1 text-foreground/80">
          <Globe className='size-4' /> {timezone}
        </p>
      </div>
      {/* <div onClick={(e) => e.stopPropagation()}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
            <Button size="icon" variant="outline">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="!size-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
              </svg>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='lg:w-42'>
            <Link href={`/dashboard/availability/${s.id}`}>
              <DropdownMenuItem>
                <Edit />
                Edit
              </DropdownMenuItem>
            </Link>
            <button className='w-full'>
              <DropdownMenuItem className='text-red-300 shadow-sm !hover:text-red-400'>
                <Trash />
                Delete
              </DropdownMenuItem>
            </button>

          </DropdownMenuContent>
        </DropdownMenu>
      </div> */}
    </Link>
  )
}
