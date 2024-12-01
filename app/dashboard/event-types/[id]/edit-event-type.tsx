"use client"

import React, { useEffect, useState, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Calendar, ExternalLink, Globe, Link as LinkIcon, Loader2, Pen, Plus, SlidersVertical, Users } from 'lucide-react'
import { EventType, Question as QuestionType, Schedule, AnswerType, AfterBookingEvent, DateRangeType } from '@prisma/client'

import Question from './question'
import { useAuth } from '@/app/auth-provider'
import { editEventType } from '@/app/actions/event-type'
import { getSchedules } from '@/app/actions/schedule'
import { getEventName } from '@/lib/getEventName'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from '@/components/ui/checkbox'
import CreateQuestion from './create-question'
import { Switch } from '@/components/ui/switch'

export default function EditEventType(eventType: EventType & { schedule: Schedule, username: string, timezone: string }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { toast } = useToast();
  const { replace, refresh } = useRouter();
  const auth = useAuth();

  const { username, timezone } = eventType;

  const [allSchedules, setAllSchedules] = useState<Schedule[]>();
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState("");
  const [title, setTitle] = useState(eventType.title || "");
  const [description, setDescription] = useState(eventType.description || "")
  const [URL, setURL] = useState(eventType.url || "")
  const [duration, setDuration] = useState(eventType.duration || 15);
  const [locationType, setLocationType] = useState(eventType?.location?.type || "")
  const [locationValue, setLocationValue] = useState(eventType.location?.value || "");
  const [schedule, setSchedule] = useState(eventType.schedule.id);
  const [allowGuests, setAllowGuests] = useState(eventType.allowGuests || false);
  const [eventName, setEventName] = useState(eventType.eventName || "")
  const [questions, setQuestions] = useState(eventType.questions);
  const [afterBooking, setAfterBooking] = useState({
    event: eventType.afterBooking.event,
    redirectUrl: eventType.afterBooking.redirectUrl || ""
  })
  const [requiresConfirmation, setRequiresConfirmation] = useState(eventType.requiresConfirmation)
  const [dateRange, setDateRange] = useState({ ...eventType.dateRange, value: eventType.dateRange.value || "" })

  const parsedURL = useMemo(() => {
    let formattedText = URL.toLowerCase().split(' ').join('-')

    const URLValidRegex = /^[a-zA-Z0-9._-]*$/

    formattedText = [...formattedText].filter(char => URLValidRegex.test(char)).join('').replace(/-+/g, '-')

    return formattedText
  }, [URL])

  useEffect(() => {
    const currentTab = searchParams.get('tab');
    console.log(currentTab)
    if (currentTab && ['event-details', 'availability', 'hosts-and-invitees', 'advanced'].includes(currentTab)) {
      setTab(currentTab)
    }
  }, [])

  useEffect(() => {
    async function fetchSchedules() {
      return await getSchedules();
    }

    fetchSchedules().then((d) => setAllSchedules(d))
  }, [])

  useEffect(() => {
    const params = new URLSearchParams(searchParams);

    if (tab) {
      params.set('tab', tab);

      replace(`${pathname}?${params.toString()}`)
    }
  }, [tab])

  async function handleSaveChanges() {
    setLoading(true)

    try {
      let res;

      if (tab === "" || tab === "event-details") {
        if (title.length < 1) throw new Error("Title can't be empty");
        if (URL.length < 1) throw new Error("URL can't be empty");
        if (duration < 15 || duration > 360) throw new Error('Duration should be longer than 15 minutes but shorter than 360 minutes')

        let editedData = {
          title,
          description,
          duration
        };

        if (locationType && locationValue) {
          Object.assign(editedData, { location: { type: locationType, value: locationValue } });
        }

        if (URL !== eventType.url) {
          Object.assign(editedData, { url: URL });
        }

        res = await editEventType(eventType.id, editedData);
      } else if (tab === "availability") {
        res = await editEventType(eventType.id, { scheduleId: schedule });
      } else if (tab === "hosts-and-invitees") {
        res = await editEventType(eventType.id, { allowGuests })
      }

      if (res?.status === "Error") {
        throw new Error(res?.message)
      } else if (res?.status === "OK") {
        refresh();
      }
    } catch (err: any) {
      toast({
        title: err?.message! as string,
        variant: 'destructive'
      })
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <div className="border-b py-4 flex flex-row items-center justify-between px-6 md:px-8">
        <div className='flex items-center gap-x-4'>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href="/dashboard/event-types">
                  <Button size="icon" variant="secondary">
                    <ArrowLeft />
                  </Button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                <p>All event types</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>


          <div>
            <h1 className='font-medium lg:text-lg'>{eventType.title}</h1>
            <p className='text-sm text-foreground/80'>{eventType.url}</p>
          </div>
        </div>
        <div>
          <Button disabled={loading} onClick={handleSaveChanges}>
            {loading && <Loader2 className='animate-spin' />}
            {loading ? "Saving changes" : "Save"}
          </Button>
        </div>
      </div>
      <div className='p-6 md:p-8'>
        <div className='flex gap-x-2'>
          <TabButton tab={tab} setTab={setTab} label="Event details" icon={<LinkIcon className='size-4' />} value="event-details" />
          <TabButton tab={tab} setTab={setTab} label="Availability" icon={<Calendar className='size-4' />} value="availability" />
          <TabButton tab={tab} setTab={setTab} label="Hosts and invitees" icon={<Users className='size-4' />} value="hosts-and-invitees" />
          <TabButton tab={tab} setTab={setTab} label="Advanced" icon={<SlidersVertical className='size-4' />} value="advanced" />
        </div>
        <div className='mt-6'>
          {(tab === "event-details" || tab === "") && (
            <>
              <div className="text-card-foreground border rounded-md p-6 bg-neutral-50 dark:bg-neutral-900">
                <div className="mb-2">
                  <Label htmlFor="title">Title</Label>
                  <Input placeholder="Working hours" id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className='mt-1' />
                </div>
                <div className="my-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea placeholder="Working hours" id="description" name="description" value={description} onChange={(e) => setDescription(e.target.value)} className='mt-1' />
                </div>
                <div className="mt-2">
                  <Label htmlFor="url">URL</Label>
                  <div className="flex mt-1 rounded-md bg-neutral-100 dark:bg-neutral-950 overflow-hidden items-center border">
                    <div className='px-3 text-sm text-neutral-700 dark:text-neutral-300'>mycal.com/{username}/</div>
                    <Input name='url' id='url' className='bg-white dark:bg-neutral-900 rounded-l-none focus-visible:ring-0 border-0 border-l' placeholder='quick-meeting' value={parsedURL} onChange={(e) => setURL(e.target.value)} required />
                  </div>
                </div>
              </div>
              <div className="text-card-foreground border rounded-md p-6 bg-neutral-50 dark:bg-neutral-900 mt-6">
                <Label htmlFor="duration">Duration (minutes)</Label>
                <Input placeholder="Duration" id="duration" name="duration" value={duration} type="number" onChange={(e) => setDuration(Number(e.target.value))} min={15} max={360} />
              </div>
              <div className="text-card-foreground border rounded-md p-6 bg-neutral-50 dark:bg-neutral-900 mt-6">
                <div className="mb-2">
                  <Label htmlFor="locationType">Location type</Label>
                  <Select value={locationType} onValueChange={setLocationType}>
                    <SelectTrigger className='mt-1'>
                      <SelectValue placeholder="Select location type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN_PERSON_MEETING">In Person Meeting</SelectItem>
                      <SelectItem value="PHONE_CALL">Phone Call</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="mt-2">
                  {locationType && (
                    <div className="mt-2">
                      <Label htmlFor="locationValue">{locationType === "PHONE_CALL" ? 'Phone number' : 'Location'}</Label>
                      <Input placeholder={locationType === "PHONE_CALL" ? "Your phone number" : "Your address"} id='locationValue' name='locationValue' className='mt-1' value={locationValue} onChange={(e) => setLocationValue(e.target.value)} />
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
          {tab === "availability" && (
            <>
              <div className="text-card-foreground border rounded-md bg-neutral-50 dark:bg-neutral-900">
                <div className='p-6'>
                  <Label>Schedule</Label>
                  <Select value={schedule} onValueChange={setSchedule}>
                    <SelectTrigger className='mt-1'>
                      <SelectValue placeholder="Schedule" />
                    </SelectTrigger>
                    <SelectContent>
                      {allSchedules?.map(s => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.name} {s.isDefault && "(Default)"}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="p-6 border-t text-foreground/80">
                  <ul className='space-y-3'>
                    {eventType.schedule.availableDays.map(d => (
                      <li key={d.day} className='flex'>
                        <div className={`w-40 ${d.value === "" && "line-through"}`}>{`${d.day[0].toUpperCase()}${d.day.slice(1).toLowerCase()}`}</div>
                        {d.value ? d.value?.split('-').join('-') : "Unavailable"}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="p-6 border-t text-foreground/80 flex justify-between">
                  <div className='inline-flex gap-x-2 items-center'>
                    <Globe className='size-4' />
                    {timezone}
                  </div>
                  <Link href="/account/settings">
                    <Button variant="secondary">
                      <ExternalLink />
                      Edit timezone
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="text-card-foreground border rounded-md bg-neutral-50 dark:bg-neutral-900 p-6 mt-6">
                <div>
                  <Label>Date Range</Label>
                  <p className='text-foreground/80 text-sm'>Invitees can schedule...</p>
                  <Select value={dateRange.type} onValueChange={(v) => setDateRange({ value: '', type: v as DateRangeType})}>
                    <SelectTrigger className='mt-2'>
                      <SelectValue placeholder="Date Range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="INDEFINITELY">Indefinitely</SelectItem>
                      <SelectItem value="DATE_RANGE">Date Range</SelectItem>
                      <SelectItem value="CALENDAR_DAYS">Calendar Days</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                { dateRange.type === "CALENDAR_DAYS" && (
                  <div className='flex items-center gap-x-2 mt-2'>
                    <Input className='w-20' type="number" name="calendarDays" id="calendarDays" value={dateRange.value} onChange={(e) => setDateRange({ ...dateRange, value: e.target.value })} />
                    <div className='text-sm'>calendar days into the future</div>
                  </div>
                ) }
              </div>
            </>
          )}
          {tab === "hosts-and-invitees" && (
            <>
              <div className="text-card-foreground border rounded-md bg-neutral-50 dark:bg-neutral-900">
                <div className="p-6 border-b">
                  <p className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Host</p>
                  <div className="flex items-center gap-x-3 mt-2">
                    <Avatar>
                      <AvatarImage src={auth?.data?.user?.image!} />
                      { /* @ts-ignore */}
                      <AvatarFallback>{auth?.data?.user?.email[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    {auth?.data?.user?.name} (you)
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="allow-guests" checked={allowGuests} onCheckedChange={(v) => setAllowGuests(typeof v === "boolean" ? v : false)} />
                    <Label htmlFor="allow-guests">Allow invitees to add guests</Label>
                  </div>
                </div>
              </div>
            </>
          )}
          {tab === "advanced" && (
            <>
              <div className="text-card-foreground border rounded-md bg-neutral-50 dark:bg-neutral-900 p-6">
                <Label htmlFor="with-event-name">With event name</Label>
                <div className="flex mt-1 space-x-2">
                  <Input id="with-event-name" value={eventName} onChange={(e) => setEventName(e.target.value)} name="with-event-name" placeholder={`${eventType.title} between ${auth?.data?.user?.name} and {Scheduler}`} />
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="secondary" size="icon">
                        <Pen />
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Custom event name</DialogTitle>
                        <DialogDescription>
                          Create customised event names to display on calendar event.
                        </DialogDescription>
                      </DialogHeader>

                      <div>
                        <Label htmlFor="with-event-name">Event name</Label>
                        <Input id="with-event-name" value={eventName} onChange={(e) => setEventName(e.target.value)} name="with-event-name" placeholder={`${eventType.title} between ${auth?.data?.user?.name} and {Scheduler}`} className='mt-1' />
                      </div>
                      <div>
                        <p className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Available variables</p>
                        <ul className='text-sm mt-2'>
                          <li>
                            <span className='text-foreground/80 inline-block min-w-32'>{"{Event type title}"}</span> The event type title
                          </li>
                          <li>
                            <span className='text-foreground/80 inline-block min-w-32'>{"{Event duration}"}</span> The event type duration
                          </li>
                          <li>
                            <span className='text-foreground/80 inline-block min-w-32'>{"{Name}"}</span> Scheduler name (input)
                          </li>
                          <li>
                            <span className='text-foreground/80 inline-block min-w-32'>{"{Email}"}</span> Scheduler email (input)
                          </li>
                        </ul>
                      </div>
                      <div className="bg-accent p-4 rounded-lg">
                        <p className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Preview</p>
                        <p className='mt-2'>
                          {getEventName(eventName, { "{Event type title}": eventType.title, "{Event duration}": `${String(eventType.duration)} min`, "{Name}": "John Smith", "{Email}": 'johnsmith@example.com' })}
                        </p>
                      </div>
                      <DialogClose asChild>
                        <Button>Continue</Button>
                      </DialogClose>
                    </DialogContent>
                  </Dialog>
                </div>

              </div>
              <div className='text-card-foreground border rounded-md bg-neutral-50 dark:bg-neutral-900 p-6 mt-6'>
                <p className='text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'>Booking questions</p>
                <p className='text-sm text-foreground/80 mt-1'>Customize the questions in your booking page</p>
                <div className='border rounded-md overflow-hidden mt-4'>
                  {questions.map((q, i) => (
                    <Question q={q} key={i} isLast={i === questions.length - 1} questions={questions} setQuestions={setQuestions} />
                  ))}
                </div>
                <CreateQuestion questions={questions} setQuestions={setQuestions} />
              </div>
              <div className="text-card-foreground border rounded-md bg-neutral-50 dark:bg-neutral-900 p-6 mt-6">
                <div className="mb-2">
                  <Label htmlFor="afterBooking">After booking</Label>
                  <Select value={afterBooking.event} onValueChange={(v) => setAfterBooking({ ...afterBooking, event: v as AfterBookingEvent })}>
                    <SelectTrigger id="afterBooking" name="afterBooking" className='mt-1'>
                      <SelectValue placeholder="After booking" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="MYCAL_CONFIRMATION_PAGE">MyCal Confirmation Page</SelectItem>
                      <SelectItem value="EXTERNAL_REDIRECT">External Redirect</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {afterBooking.event === "EXTERNAL_REDIRECT" && (
                  <div className="my-2">
                    <Label htmlFor="redirectUrl">Redirect URL</Label>
                    <Input className='mt-1' id="redirectUrl" name="redirectUrl" placeholder='myawesomesite.com/thank-you' value={afterBooking.redirectUrl} onChange={(e) => setAfterBooking({ ...afterBooking, redirectUrl: e.target.value })} />
                  </div>
                )}
              </div>
              <div className="text-card-foreground border rounded-md bg-neutral-50 dark:bg-neutral-900 p-6 mt-6 flex items-center justify-between">
                <div>
                  <Label>Requires confirmation</Label>
                  <p className='text-sm text-foreground/80'>The booking needs to manually be confirmed by you before it is confirmed, and a confirmation email will be sent to the customer once approved</p>
                </div>
                <Switch checked={requiresConfirmation} onCheckedChange={setRequiresConfirmation} />
              </div>
            </>
          )}
        </div>
      </div>
      {/* <pre>{JSON.stringify(eventType, null, 2)}</pre> */}
    </div>
  )
}

function TabButton({ tab, setTab, label, icon, value }: { label: string, icon: React.ReactNode, value: string, tab: string, setTab: React.Dispatch<React.SetStateAction<string>> }) {
  const isActive = (tab === "" && value === "event-details") ? true : tab === value

  return (
    <Button variant={isActive ? 'secondary' : 'ghost'} onClick={() => setTab(value)}>
      {icon}
      {label}
    </Button>
  )
}

