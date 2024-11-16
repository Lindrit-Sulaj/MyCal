'use client'
import React, { useState, useEffect, FormEvent } from 'react'

import { cn } from '@/lib/utils'
import { editUser, getUser } from '@/app/actions/user'
import { useAuth } from '@/app/auth-provider'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import timezoneMapping from '@/lib/timezones'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { navigate } from '@/app/actions/navigate'
import { Schedule, User } from '@prisma/client'

export default function GettingStarted() {
  const auth = useAuth();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [timeZone, setTimeZone] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('')
  const [description, setDescription] = useState('')

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimeZone(timezoneMapping[userTimeZone as keyof typeof timezoneMapping]);
  }, [])

  useEffect(() => {
    setName(auth?.data?.user?.name as string || "")
  }, [auth])

  async function handleGettingStarted(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const changedUser = await editUser({data: { timezone: timeZone, name, username, description }, usernameRequired: true})
      .catch(err => {
        toast({
          title: err.message,
          variant: 'destructive'
        })
      })
      .finally(() => {
        setLoading(false);
      });

    if (changedUser) {
      navigate('/dashboard')
    }

    console.log(timeZone, name, username, description)

    setLoading(false);
  }

  return (
    <main className='h-screen flex items-center justify-center flex-col'>
      <Card className='bg-neutral-50 dark:bg-neutral-900'>
        <CardHeader>
          <CardTitle>Getting started</CardTitle>
          <CardDescription>Fill up the additional information to get started</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={(e) => handleGettingStarted(e)}>
            <div className="mb-2">
              <Label htmlFor='name'>Name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} id='name' name='name' className='mt-1' type='text' required />
            </div>
            <div className="my-2">
              <Label htmlFor='username'>Username</Label>
              <div className="flex mt-1 rounded-md bg-neutral-100 dark:bg-neutral-950 overflow-hidden items-center border">
                <div className='px-3 text-sm text-neutral-700 dark:text-neutral-300'>mycal.com/</div>
                <Input value={username} onChange={(e) => setUsername(e.target.value)} name='username' id='username' className='bg-white dark:bg-neutral-900 rounded-l-none focus-visible:ring-0 border-0 border-l' placeholder='Your username' required />
              </div>
            </div>
            <div className="my-2">
              <Label htmlFor='timezone'>Timezone</Label>
              <Input placeholder='Your timezone' disabled value={timeZone} id='timezone' name='timezone' className='mt-1' type="text" />
              <p className='text-sm mt-1 text-foreground/80'>You can change the timezone later on</p>
            </div>
            <div className='mt-2'>
              <Label htmlFor='description'>About</Label>
              <Textarea className='mt-1' rows={3} placeholder='Tell us about yourself (optional)' name='description' id='description' value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <Button disabled={loading} className='w-full mt-2'>
              {!loading ? "Finish registration" :
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
                  Finishing registration...
                </>}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
