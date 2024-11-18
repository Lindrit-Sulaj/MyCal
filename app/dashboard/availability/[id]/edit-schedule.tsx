"use client"
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AvailableDays, DayOfWeek } from '@prisma/client'
import { Check } from 'lucide-react'
import { editSchedule } from '@/app/actions/schedule'

import { getTimes } from '@/lib/times'
import { useToast } from '@/hooks/use-toast'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function EditSchedule({ id, availableDays, scheduleName }: { id: string, availableDays: AvailableDays[], scheduleName: string }) {
  const router = useRouter();
  const { toast } = useToast();

  const [times, setTimes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [editNameLoading, setEditNameLoading] = useState(false);
  const [name, setName] = useState<string>(scheduleName || "");

  useEffect(() => {
    const res = getTimes();
    setTimes(res)
  }, [])

  async function handleEditName() {
    setEditNameLoading(true);

    const editedSchedule = await editSchedule(id, { name })
      .catch((e) => {
        toast({
          title: e.message,
          variant: 'destructive'
        })
      });

    if (editedSchedule) {
      toast({
        title: 'Schedule has been successfully modified'
      })
      router.refresh();
      setEditNameLoading(false);
    }
  }

  async function handleSaveChanges() {
    setLoading(true);

    const editedSchedule = await editSchedule(id, { availableDays: [monday, tuesday, wednesday, thursday, friday, saturday, sunday] })
      .catch((e) => {
        toast({
          title: e.message,
          variant: 'destructive'
        })
      })

    if (editedSchedule) {
      toast({
        title: `Schedule has been successfully modified`
      })
      router.refresh();
      setLoading(false);
    }
  }

  const [monday, setMonday] = useState<AvailableDays>(availableDays[0]);
  const [tuesday, setTuesday] = useState<AvailableDays>(availableDays[1]);
  const [wednesday, setWednesday] = useState<AvailableDays>(availableDays[2]);
  const [thursday, setThursday] = useState<AvailableDays>(availableDays[3]);
  const [friday, setFriday] = useState<AvailableDays>(availableDays[4]);
  const [saturday, setSaturday] = useState<AvailableDays>(availableDays[5]);
  const [sunday, setSunday] = useState<AvailableDays>(availableDays[6]);

  return (
    <div className={`border-b`}>
      <div className=' p-4 lg:p-8 border-b'>
        <Label>Name</Label>
        <div className="flex items-center gap-x-2 mt-1">
          <Input placeholder='Working hours' className='w-auto' value={name} onChange={(e) => setName(e.target.value)} />
          {name.length > 0 && name !== scheduleName && (
            <Button onClick={handleEditName} size="icon" variant="secondary" disabled={editNameLoading}>
              {!editNameLoading ? <Check /> : <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn("animate-spin")}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>}
            </Button>
          )}
        </div>
      </div>
      <div className='p-4 lg:p-8'>
        <Day times={times} day={monday} setDay={setMonday} />
        <Day times={times} day={tuesday} setDay={setTuesday} />
        <Day times={times} day={wednesday} setDay={setWednesday} />
        <Day times={times} day={thursday} setDay={setThursday} />
        <Day times={times} day={friday} setDay={setFriday} />
        <Day times={times} day={saturday} setDay={setSaturday} />
        <Day times={times} day={sunday} setDay={setSunday} />
        <Button className='mt-4' onClick={handleSaveChanges} disabled={loading}>
          {!loading ? "Save changes" :
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={cn("animate-spin")}
              >
                <path d="M21 12a9 9 0 1 1-6.219-8.56" />
              </svg>
              Saving changes...
            </>}
        </Button>
      </div>

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