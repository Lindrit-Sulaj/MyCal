"use client"

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import GridPattern from '@/components/ui/grid-pattern'
import { cn } from '@/lib/utils'

import timezoneMapping from '@/lib/timezones'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export default function SignUp() {
  const [timeZone, setTimeZone] = useState('')

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimeZone(timezoneMapping[userTimeZone as keyof typeof timezoneMapping]);
  }, [])


  return (
    <main>
      <section className="p-4 h-screen">
        <div className="bg-neutral-100 dark:bg-neutral-950 border w-full h-full rounded-xl flex flex-col items-center relative z-10 px-4">
          <div className="py-8">
            <Link href="/" className='font-bold text-2xl'>MyCal</Link>
          </div>
          <div className="grow flex flex-col justify-center w-full relative z-10">

            <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-center'>Sign up</h1>
            <div className="rounded-xl border text-card-foreground shadow bg-white dark:bg-neutral-900 mt-2 md:mt-4 w-full max-w-sm mx-auto p-6">
              <form action="">
                <div className="mb-2">
                  <Label>Full name</Label>
                  <Input placeholder='Your full name' className='mt-1' />
                </div>
                <div className="my-2">
                  <Label>Username</Label>
                  <div className="flex mt-1 rounded-md bg-neutral-100 dark:bg-neutral-950 overflow-hidden items-center border">
                    <div className='px-3 text-sm text-neutral-700 dark:text-neutral-300'>mycal.com/</div>
                    <Input className='bg-white dark:bg-neutral-900 rounded-l-none focus-visible:ring-0 border-0 border-l' placeholder='Your username' />
                  </div>
                </div>
                <div className="my-2">
                  <Label>Email</Label>
                  <Input placeholder='Your email address' className='mt-1' type="email" />
                </div>
                <div className="my-2">
                  <Label>Timezone</Label>
                  <Input placeholder='Your timezone' disabled value={timeZone} className='mt-1' type="email" />
                </div>
                <div className="my-2">
                  <Label>Password</Label>
                  <Input placeholder='Your passowrd' type="password" className='mt-1' />
                </div>
                <Button variant="secondary" className='w-full mt-2'>
                  Sign up
                </Button>
              </form>
              <div className='mt-4'>
                <p className='text-center uppercase text-sm text-neutral-700 dark:text-neutral-300'>Or continue with</p>
                <Button className='w-full mt-4'>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    preserveAspectRatio="xMidYMid"
                    viewBox="-3 0 262 262"
                    className='size-5'
                  >
                    <g id="SVGRepo_iconCarrier">
                      <path
                        fill="#4285F4"
                        d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                      ></path>
                      <path
                        fill="#34A853"
                        d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                      ></path>
                      <path
                        fill="#FBBC05"
                        d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                      ></path>
                      <path
                        fill="#EB4335"
                        d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                      ></path>
                    </g>
                  </svg>
                  Sign in with Google
                </Button>
              </div>
            </div>
          </div>
          <GridPattern
            width={65}
            height={65}
            x={-1}
            y={-1}
            className={cn(
              "stroke-neutral-500/20 dark:stroke-neutral-700/30 [mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            )}
          />
        </div>
      </section >
    </main >
  )
}
