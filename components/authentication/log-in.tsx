'use client'
import React from 'react'

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"

import { useAuth } from "@/app/auth-provider"
import OAuth from "@/components/oauth"
import { navigate } from "@/app/actions/navigate"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import GridPattern from "@/components/ui/grid-pattern"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import DotPattern from '../ui/dot-pattern'

export default function LogIn() {
  const auth = useAuth();

  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (auth?.status === "authenticated") {
      navigate('/dashboard')
    }
  }, [auth?.status])

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    const signedInUser = await signIn('credentials', { email, password, redirect: false })

    if (signedInUser?.ok) {
      toast({
        title: 'Signed in successfully',
        description: 'Head over to the dashboard to start using your account'
      })
    } else if (signedInUser?.error) {
      toast({
        title: signedInUser.error,
        variant: 'destructive'
      })
    }

    setLoading(false);
  }

  return (
    <main>
      <section className="p-4 lg:p-6 relative min-h-screen flex items-center justify-center flex-col gap-y-4">
        <Link href="/" className='font-bold text-2xl'>MyCal</Link>
        <div className='rounded-xl border text-card-foreground shadow-md bg-white dark:bg-neutral-900 w-full max-w-sm mx-auto p-6'>
          <form onSubmit={(e) => handleSignIn(e)}>
            <div className="mb-2">
              <Label>Email</Label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} name='email' id='email' placeholder='Your email address' className='mt-1' type="email" />
            </div>
            <div className="mt-2">
              <Label>Password</Label>
              <Input value={password} onChange={(e) => setPassword(e.target.value)} name='password' id='password' placeholder='Your password' type="password" className='mt-1' />
            </div>
            <Button disabled={loading} className='w-full mt-2'>
              {!loading ? "Log in" :
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
                  Logging in...
                </>}
            </Button>
            <Link href="/forgot-password" className='text-center mx-auto block mt-2 text-sm text-blue-700 dark:text-blue-400 font-medium'>
              Forgot password?
            </Link>
          </form>
          <OAuth />
          <p className="text-center text-sm mt-4 text-foreground/80">Don't have an account? <Link href="/sign-up" className="underline text-foreground">Create one</Link></p>
        </div>
        <DotPattern
          width={20}
          height={20}
          className="fill-neutral-300 dark:fill-neutral-800 -z-10" />
      </section>

    </main>
  )
}
