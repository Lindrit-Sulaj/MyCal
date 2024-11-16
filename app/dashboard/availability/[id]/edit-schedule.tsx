"use client"
import React, { useEffect, useState } from 'react'
import { AvailableDays, DayOfWeek } from '@prisma/client'
import { getTimes } from '@/lib/times'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function EditSchedule({ id, availableDays, className }: { id: string, className?: string, availableDays: AvailableDays[] }) {
  const [times, setTimes] = useState<string[]>([]);

  useEffect(() => {
    console.log('Running heavy function')
    const res = getTimes();
    setTimes(res)
  }, [])

  const [monday, setMonday] = useState<AvailableDays>(availableDays[0]);
  const [tuesday, setTuesday] = useState<AvailableDays>(availableDays[1]);
  const [wednesday, setWednesday] = useState<AvailableDays>(availableDays[2]);
  const [thursday, setThursday] = useState<AvailableDays>(availableDays[3]);
  const [friday, setFriday] = useState<AvailableDays>(availableDays[4]);
  const [saturday, setSaturday] = useState<AvailableDays>(availableDays[5]);
  const [sunday, setSunday] = useState<AvailableDays>(availableDays[6]);

  return (
    <div className={`${className} p-4 lg:p-8 rounded-lg space-y-2`}>
      <Day times={times} day={monday} setDay={setMonday} />
      <Day times={times} day={tuesday} setDay={setTuesday} />
      <Day times={times} day={wednesday} setDay={setWednesday} />
      <Day times={times} day={thursday} setDay={setThursday} />
      <Day times={times} day={friday} setDay={setFriday} />
      <Day times={times} day={saturday} setDay={setSaturday} />
      <Day times={times} day={sunday} setDay={setSunday} />
    </div>
  )
}

function Day({ day, setDay, times }: {
  day: {
    day: DayOfWeek;
    value: string | null;
  },
  setDay: React.Dispatch<React.SetStateAction<{
    day: DayOfWeek;
    value: string | null;
  }>>,
  times: string[]
}) {
  const { day: dayOfWeek, value } = day

  function handleCheckedChange(v: boolean) {
    if (v) {
      setDay({ ...day, value: '08:00 - 17:00' })
    } else {
      setDay({ ...day, value: '' })
    }
  }

  function handleStartChange(s: string) {
    const lastHour = day?.value?.split('-')[1].slice(1, 6)!;
    setDay({ ...day, value: `${s} - ${lastHour}` })
  }

  function handleEndChange(s: string) {
    const firstHour = day?.value?.split('-')[0].slice(0, 5)!;
    setDay({ ...day, value: `${firstHour} - ${s}` })
  }

  return (
    <div className='flex gap-x-4 h-10'>
      <div className='flex items-center space-x-2 w-40'>
        <Switch checked={value ? true : false} onCheckedChange={handleCheckedChange} />
        <Label>{dayOfWeek[0] + dayOfWeek.slice(1).toLowerCase()}</Label>
      </div>
      {day.value && (
        <div className='flex items-center gap-x-2'>
          <Select value={value?.split('-')[0].slice(0, 5)} onValueChange={handleStartChange}>
            <SelectTrigger className='w-32'>
              <SelectValue placeholder="Starting hour" />
            </SelectTrigger>
            <SelectContent>
              {times.map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={value?.split('-')[1].slice(1, 6)} onValueChange={handleEndChange}>
            <SelectTrigger className='w-32'>
              <SelectValue placeholder="Ending hour" />
            </SelectTrigger>
            <SelectContent>
              {times.map(time => (
                <SelectItem key={time} value={time}>{time}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  )
}