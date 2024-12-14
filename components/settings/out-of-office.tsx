'use client'
import React, { FormEvent, useState } from 'react'
import { Button } from '../ui/button'
import { Plus, Calendar as CalendarIcon, Loader2, Trash, Pen } from 'lucide-react'
import { type DateRange } from 'react-day-picker'

import { LeaveDateRange, OutOfOffice as OutOfOfficeType, OutOfOfficeReason } from '@prisma/client'
import { addDays, format } from 'date-fns'
import { cn } from '@/lib/utils'

import { useRouter } from 'next/navigation'
import { createOutOfOffice, deleteOutOfOffice, editOutOfOffice } from '@/app/actions/out-of-office'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Calendar } from '../ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'
import { toast } from '@/hooks/use-toast'

export default function OutOfOffice({ entries }: { entries: OutOfOfficeType[] }) {
  const { refresh } = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 7),
  });
  const [reason, setReason] = useState<OutOfOfficeReason>("UNSPECIFIED")
  const [notes, setNotes] = useState('')

  async function handleCreate(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!date || Object.values(date).filter(d => d).length !== 2) {
      setLoading(false);
      return toast({
        title: 'Missing valid dates',
        variant: 'destructive'
      })
    }

    await createOutOfOffice({ dates: date as LeaveDateRange, notes, reason })
      .then(() => {
        toast({
          title: 'Successfully created a new entry'
        })
        refresh();
        setOpen(false);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <div className="w-full max-w-screen-md mx-auto my-6">
      <div className='border rounded-md'>
        <div className='p-4 lg:p-6 border-b bg-neutral-100 dark:bg-neutral-900 flex flex-col items-start gap-y-2 lg:flex-row lg:justify-between lg:items-center'>
          <div>
            <h1 className='font-medium text-lg md:text-xl'>Out of Office</h1>
            <p className='text-sm text-foreground/80'>Let your customers know when you're out of office and unavailable for appointments.</p>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus /> Add
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Go Out Of Office</DialogTitle>
                <DialogDescription>
                  Let your customers know when you're out of office.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreate}>
                <div>
                  <Label htmlFor="dates">Dates</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="dates"
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal mt-1",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon />
                        {date?.from ? (
                          date.to ? (
                            <>
                              {format(date.from, "LLL dd, y")} -{" "}
                              {format(date.to, "LLL dd, y")}
                            </>
                          ) : (
                            format(date.from, "LLL dd, y")
                          )
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        initialFocus
                        mode="range"
                        defaultMonth={date?.from}
                        selected={date}
                        onSelect={setDate}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className='my-2'>
                  <Label htmlFor="reason">Reason</Label>
                  <Select value={reason} onValueChange={(v) => setReason(v as OutOfOfficeReason)}>
                    <SelectTrigger className="mt-1" id="reason">
                      <SelectValue placeholder="Reason" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="UNSPECIFIED">⏰ Unspecified</SelectItem>
                      <SelectItem value="VACATION">🏖️ Vacation</SelectItem>
                      <SelectItem value="TRAVEL">✈️ Travel</SelectItem>
                      <SelectItem value="SICK_LEAVE">🤒 Sick Leave</SelectItem>
                      <SelectItem value="PUBLIC_HOLIDAY">🗓️ Public Holiday</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-">
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea id="notes" placeholder='Additional notes' rows={4} className='mt-1' value={notes} onChange={(e) => setNotes(e.target.value)} />
                </div>
                <DialogFooter className='mt-4'>
                  <DialogClose asChild>
                    <Button variant="ghost">Close</Button>
                  </DialogClose>
                  <Button disabled={loading}>
                    {loading && <Loader2 className='animate-spin' />}
                    {loading ? "Adding..." : "Add"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <div>
          { entries.length < 1 && (
            <div className='p-4 lg:p-6'>
              <p className='text-foreground/80'>You currently don't have any Out of Office entries.</p>
            </div>
          )}
          {entries && entries.map((entry, i) => (
            <EditEntry key={i} entry={entry} isLast={entries.length - 1 === i} />
          ))}
        </div>
      </div>
    </div>
  )
}

const reasonList = {
  "UNSPECIFIED": "⏰ Unspecified",
  "VACATION": "🏖️ Vacation",
  "TRAVEL": "✈️ Travel",
  "SICK_LEAVE": "🤒 Sick Leave",
  "PUBLIC_HOLIDAY": "🗓️ Public Holiday"
}

function EditEntry({ entry, isLast = false }: { entry: OutOfOfficeType, isLast?: boolean }) {
  const { refresh } = useRouter();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const [date, setDate] = useState<DateRange | undefined>(entry.dates);
  const [reason, setReason] = useState<OutOfOfficeReason>(entry.reason)
  const [notes, setNotes] = useState(entry.notes || "")

  async function handleSaveChanges(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (!date || Object.values(date).filter(d => d).length !== 2) {
      setLoading(false);
      return toast({
        title: 'Missing valid dates',
        variant: 'destructive'
      })
    }

    await editOutOfOffice(entry.id, { dates: date as LeaveDateRange, reason, notes })
      .then(() => {
        toast({
          title: 'Successfully updated entry'
        })
        refresh();
        setOpen(false);
      })
      .finally(() => {
        setLoading(false);
      })
  }

  async function handleDelete() {
    await deleteOutOfOffice(entry.id)
      .then(() => {
        toast({
          title: "Successfully deleted entry"
        })
        refresh();
      })
  }

  return (
    <div className={`${!isLast && 'border-b'} p-4 lg:p-6 flex flex-col gap-y-2 lg:flex-row lg:justify-between lg:items-center`}>
      <div>
        <p className='font-medium'>{format(entry.dates.from, "LLL dd, y")} - {format(entry.dates.to, 'LLL dd, y')}</p>
        <p className='text-foreground/80 mt-1 text-sm'>{reasonList[entry.reason]}</p>
      </div>
      <div className='flex gap-x-2 items-center'>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="icon">
              <Pen />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Out Of Office Entry</DialogTitle>
              <DialogDescription>
                Let your customers know when you're out of office.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveChanges}>
              <div>
                <Label htmlFor="dates">Dates</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id="dates"
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal mt-1",
                        !date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon />
                      {date?.from ? (
                        date.to ? (
                          <>
                            {format(date.from, "LLL dd, y")} -{" "}
                            {format(date.to, "LLL dd, y")}
                          </>
                        ) : (
                          format(date.from, "LLL dd, y")
                        )
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      initialFocus
                      mode="range"
                      defaultMonth={date?.from}
                      selected={date}
                      onSelect={setDate}
                      numberOfMonths={2}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className='my-2'>
                <Label htmlFor="reason">Reason</Label>
                <Select value={reason} onValueChange={(v) => setReason(v as OutOfOfficeReason)}>
                  <SelectTrigger className="mt-1" id="reason">
                    <SelectValue placeholder="Reason" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="UNSPECIFIED">⏰ Unspecified</SelectItem>
                    <SelectItem value="VACATION">🏖️ Vacation</SelectItem>
                    <SelectItem value="TRAVEL">✈️ Travel</SelectItem>
                    <SelectItem value="SICK_LEAVE">🤒 Sick Leave</SelectItem>
                    <SelectItem value="PUBLIC_HOLIDAY">🗓️ Public Holiday</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="mt-">
                <Label htmlFor="notes">Notes</Label>
                <Textarea id="notes" placeholder='Additional notes' rows={4} className='mt-1' value={notes} onChange={(e) => setNotes(e.target.value)} />
              </div>
              <DialogFooter className='mt-4'>
                <DialogClose asChild>
                  <Button variant="ghost">Close</Button>
                </DialogClose>
                <Button disabled={loading}>
                  {loading && <Loader2 className='animate-spin' />}
                  {loading ? "Saving changes..." : "Save changes"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
        <Button variant="outline" size="icon" onClick={handleDelete}>
          <Trash />
        </Button>
      </div>
    </div>
  )
}