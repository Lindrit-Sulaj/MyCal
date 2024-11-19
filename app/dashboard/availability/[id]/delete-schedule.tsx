"use client"

import React, { useState } from 'react'
import { Trash } from 'lucide-react'

import { navigate } from '@/app/actions/navigate'
import { deleteSchedule } from '@/app/actions/schedule'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export default function DeleteSchedule({ id }: { id: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  async function handleDeleteSchedule() {
    setLoading(true);
    const deleted = await deleteSchedule(id).catch(err => {
      toast({
        title: err.message,
        variant: "destructive"
      })
    });

    if (deleted) {
      toast({
        title: 'Schedule deleted successfully'
      })

      navigate('/dashboard/availability')
    }

    setLoading(false);
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div>
          <Button size="icon" variant="secondary" className='hidden sm:inline-flex'>
            <Trash />
          </Button>
          <Button variant="destructive" className="w-full sm:hidden">
            <Trash /> Delete schedule
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone and will permanently delete this schedule.
            All of the event types that use this schedule will start using the default schedule.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="ghost">Close</Button>
          </DialogClose>
          <Button disabled={loading} variant="destructive" onClick={handleDeleteSchedule}>
            {!loading ? "Delete" :
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
                Deleting schedule...
              </>}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
