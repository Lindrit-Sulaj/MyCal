"use client"

import React, { FormEvent, useEffect, useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { User } from '@prisma/client'

import { navigate } from '@/app/actions/navigate'
import { createUser, createVerification, verifyEmail } from '@/app/actions/user'

import timezoneMapping from '@/lib/timezones'
import { cn } from '@/lib/utils'

import GridPattern from '@/components/ui/grid-pattern'
import { useToast } from '@/hooks/use-toast'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import OAuth from '@/components/oauth'
import { ScrollArea } from '@/components/ui/scroll-area'

export default function SignUp() {
  const { toast } = useToast();

  const [user, setUser] = useState<User | undefined>();
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [timeZone, setTimeZone] = useState('');
  const [status, setStatus] = useState<'create' | 'verify'>('create')
  const [loading, setLoading] = useState(false);
  const [verificationId, setVerificationId] = useState<string>('')

  const [verificationCode, setVerificationCode] = useState<string>('')

  useEffect(() => {
    const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
    setTimeZone(timezoneMapping[userTimeZone as keyof typeof timezoneMapping]);
  }, [])

  async function handleCreateAccount(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const user = await createUser({
      name: name,
      username: username,
      email: email,
      password: password,
      timezone: timeZone
    })
      .catch((err) => {
        const [title, description] = err.message.split('|');

        toast({
          title,
          description
        });
      })
      .finally(() => {
        setLoading(false);

        console.log("Loading finished", loading)
      });

    if (user) {
      setUser(user)
      setPassword(password)

      const verification = await createVerification(user.id);

      if (verification) {
        setVerificationId(verification)
        setStatus('verify');
        setLoading(false);
      }
    };
  }

  async function handleVerifyAccount(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    const verifiedUser = await verifyEmail(user?.id!, verificationId, verificationCode);

    if (verifiedUser) {
      const signedIn = await signIn('credentials', { email: user?.email!, password, redirect: false });

      if (signedIn?.ok) {
        console.log("Signed in")
        navigate('/dashboard')
      }
    }
  }

  return (
    <main>
      <section className="p-3 md:p-4 h-screen">
        <div className="bg-neutral-100 dark:bg-neutral-950 border w-full h-full rounded-xl flex flex-col items-center relative z-10 px-4 pb-8">
          <div className="py-8">
            <Link href="/" className='font-bold text-2xl'>MyCal</Link>
          </div>
          <div className="grow flex flex-col justify-center w-full relative z-10">

            <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-center'>Sign up</h1>
            <div className="rounded-xl border text-card-foreground shadow bg-white dark:bg-neutral-900 mt-2 md:mt-4 w-full max-w-sm mx-auto p-6">
              {status === "create" && (
                <>
                  <form onSubmit={(e) => handleCreateAccount(e)}>
                    <div className="mb-2">
                      <Label>Full name</Label>
                      <Input value={name} onChange={(e) => setName(e.target.value)} name='name' id='name' placeholder='Your full name' className='mt-1' />
                    </div>
                    <div className="my-2">
                      <Label>Username</Label>
                      <div className="flex mt-1 rounded-md bg-neutral-100 dark:bg-neutral-950 overflow-hidden items-center border">
                        <div className='px-3 text-sm text-neutral-700 dark:text-neutral-300'>mycal.com/</div>
                        <Input value={username} onChange={(e) => setUsername(e.target.value)} name='username' id='username' className='bg-white dark:bg-neutral-900 rounded-l-none focus-visible:ring-0 border-0 border-l' placeholder='Your username' />
                      </div>
                    </div>
                    <div className="my-2">
                      <Label>Email</Label>
                      <Input value={email} onChange={(e) => setEmail(e.target.value)} name='email' id='email' placeholder='Your email address' className='mt-1' type="email" />
                    </div>
                    <div className="my-2">
                      <Label>Timezone</Label>
                      <Input placeholder='Your timezone' disabled value={timeZone} className='mt-1' type="text" />
                    </div>
                    <div className="my-2">
                      <Label>Password</Label>
                      <Input value={password} onChange={(e) => setPassword(e.target.value)} name='password' id='password' placeholder='Your password' type="password" className='mt-1' />
                    </div>
                    <Button disabled={loading} variant="secondary" className='w-full mt-2'>
                      {!loading ? "Create account" :
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
                          Creating account...
                        </>}
                    </Button>
                  </form>
                  <OAuth />
                  <p className="text-center text-sm mt-4 text-foreground/80">Already have an account? <Link href="/log-in" className="underline text-foreground">Log in</Link></p>
                </>
              )}
              {status === "verify" && (
                <>
                  <p className='text-sm text-center'>We’ve sent a verification code to your email. Please enter the code to complete your registration. Didn’t receive it? Check your spam folder or request a new code.</p>
                  <form onSubmit={(e) => handleVerifyAccount(e)} className='flex flex-col items-center mt-4'>
                    <InputOTP maxLength={6} value={verificationCode} onChange={(val) => setVerificationCode(val)}>
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                    <Button disabled={loading} variant="secondary" className='mt-4'>
                      {!loading ? "Complete registration" :
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
                          Verifying account...
                        </>}
                    </Button>
                  </form>
                </>
              )}
            </div>
          </div>
          <GridPattern
            width={65}
            height={65}
            x={-1}
            y={-1}
            className={cn(
              "stroke-neutral-400/20 lg:stroke-neutral-500/20 dark:stroke-neutral-700/30 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)] lg:[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            )}
          />
        </div>
      </section >
    </main >
  )
}
