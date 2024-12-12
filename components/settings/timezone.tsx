'use client'

import React, { useState } from 'react'
import { timezoneValues } from '@/lib/timezones'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from '../ui/button'
import { Loader2 } from 'lucide-react'
import { editUser } from '@/app/actions/user'
import { useToast } from '@/hooks/use-toast'

export default function Timezone({ userTimezone }: { userTimezone: string }) {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [timezone, setTimezone] = useState(userTimezone || "")

  const changedTimezone = timezone === userTimezone;

  async function handleEditTimezone() {
    setLoading(true);

    await editUser({ data: { timezone } })
      .then(() => {
        setLoading(false);
      })
      .catch((e) => {
        toast({
          title: 'Something went wrong',
          variant: 'destructive'
        })
      })
  }

  return (
    <div className='p-4 lg:p-6 '>
      <div className="flex flex-col items-center gap-y-4 lg:flex-row lg:justify-between">
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger className="w-[200px] md:w-[240px]">
            <SelectValue placeholder="Your timezone" />
          </SelectTrigger>
          <SelectContent>
            {timezoneValues.map(t => (
              <SelectItem key={t} value={t}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-foreground/80">
          Current: {new Date().toLocaleString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
          })}
        </p>
      </div>

      <div className="flex justify-end mt-4">
        <Button disabled={loading ? true : changedTimezone} onClick={handleEditTimezone}>
          {loading && <Loader2 className='animate-spin' />}
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </div>

  )
}
