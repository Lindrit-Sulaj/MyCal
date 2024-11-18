'use client'
import React, { FormEvent, useState } from 'react'

import { createSchedule } from '@/app/actions/schedule'
import { Plus } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useToast } from '@/hooks/use-toast'
import { navigate } from '@/app/actions/navigate'

export default function CreateSchedule() {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreateSchedule(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    const schedule = await createSchedule({ name, availableDays: 'default' });

    if (schedule) {
      toast({
        title: `Schedule "${name}" created`,
      })

      navigate(`/dashboard/availability/${schedule.id}`)
    }
    
    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus /> Create new
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new schedule</DialogTitle>
          <DialogDescription className='sr-only'>Create a new schedule</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateSchedule}>
          <Label htmlFor="name">Name</Label>
          <Input id="name" className='mt-1' placeholder='Working Hours' value={name} onChange={(e) => setName(e.target.value)} required />
          <div className="flex justify-end mt-4 gap-x-2">
            <DialogClose asChild>
              <Button type="button" variant="ghost">Close</Button>
            </DialogClose>
            <Button disabled={loading}>
              {!loading ? "Continue" :
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
                  Creating schedule...
                </>}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

  )
}
