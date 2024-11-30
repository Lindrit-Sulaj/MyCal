'use client'
import React, { FormEvent, useMemo, useState } from 'react'
import { Plus } from 'lucide-react'

import { createEventType } from '@/app/actions/event-type'
import { cn } from '@/lib/utils'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { EventType } from '@prisma/client'
import { navigate } from '@/app/actions/navigate'

export default function CreateEvent({ username }: { username: string }) {
  const { toast } = useToast();

  const [title, setTitle] = useState('');
  const [URL, setURL] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState(15)
  const [loading, setLoading] = useState(false);

  const parsedURL = useMemo(() => {
    let formattedText = URL.toLowerCase().split(' ').join('-')

    const URLValidRegex = /^[a-zA-Z0-9._-]*$/

    formattedText = [...formattedText].filter(char => URLValidRegex.test(char)).join('').replace(/-+/g, '-')

    return formattedText
  }, [URL])

  async function handleCreateEvent(e: FormEvent) {
    setLoading(true);
    e.preventDefault();

    await createEventType({ title, url: URL, description, duration })
      .then((e) => {
        if (e.status === "OK") {
          const newEvent = e.data as EventType
          
          toast({
            title: `Event "${newEvent.title}" created`
          })

          navigate(`/dashboard/event-types/${newEvent.id}`);
        } else if (e.status === "Error") {
          toast({
            title: e.message,
            variant: 'destructive'
          })
        }
      })
      .catch((e) => {
        toast({
          title: e.message,
          variant: 'destructive'
        })
      })
      .finally(() => {
        setLoading(false);
      })
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
          <DialogTitle>Add a new event type</DialogTitle>
          <DialogDescription>
            People will be able to book meetings with this event type.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateEvent}>
          <div className="mb-2">
            <Label htmlFor="title">Title</Label>
            <Input name="title" id="title" placeholder='Quick Meeting' className='mt-1' value={title} onChange={(e) => setTitle(e.target.value)} required />
          </div>
          <div className="my-2">
            <Label htmlFor="url">URL</Label>
            <div className="flex mt-1 rounded-md bg-white dark:bg-neutral-900 overflow-hidden items-center border">
              <div className='px-3 text-sm text-neutral-700 dark:text-neutral-300'>mycal.com/{username}/</div>
              <Input name='url' id='url' className='bg-neutral-100 dark:bg-neutral-950 rounded-l-none focus-visible:ring-0 border-0 border-l' placeholder='quick-meeting' value={parsedURL} onChange={(e) => setURL(e.target.value)} required />
            </div>
          </div>
          <div className="my-2">
            <Label htmlFor="description">Description</Label>
            <Textarea id="description" name="description" placeholder='A quick physical meeting' className='mt-1' value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>
          <div className="my-2">
            <Label htmlFor="duration">Duration</Label>
            <div className="flex mt-1 rounded-md bg-white dark:bg-neutral-900 overflow-hidden items-center border">
              <Input name='duration' id='duration' placeholder='15' type="number" className='bg-neutral-100 dark:bg-neutral-950 rounded-r-none focus-visible:ring-0 border-0 border-r' required min={15} max={360} value={duration} onChange={(e) => setDuration(Number(e.target.value))} />
              <div className="px-3 text-sm text-neutral-700 dark:text-neutral-300">minutes</div>
            </div>
          </div>
          <DialogFooter className='mt-4'>
            <DialogClose asChild>
              <Button variant="ghost">Close</Button>
            </DialogClose>
            <Button disabled={loading}>
              {!loading ? "Create" :
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
                  Creating event type...
                </>}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}
