'use client'

import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import { createResetPassword } from '@/app/actions/user'

import { Button } from '../ui/button'
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { cn } from '@/lib/utils'
import DotPattern from '../ui/dot-pattern'
import { Loader2 } from 'lucide-react'

export default function ForgotPassword() {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'Forgot Password' | 'Email Instructions'>('Forgot Password')
  const [email, setEmail] = useState('');

  async function handleCreateResetPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    await createResetPassword(email)
      .finally(() => {
        setStatus('Email Instructions')
        setLoading(false);
      })
  }

  return (
    <section className="p-4 lg:p-6 relative min-h-screen flex items-center justify-center flex-col gap-y-4">
      <Link href="/" className='font-bold text-2xl'>MyCal</Link>
      <div className='rounded-xl border text-card-foreground shadow-md bg-white dark:bg-neutral-900 w-full max-w-sm mx-auto p-6'>
        {status === 'Forgot Password' && (
          <>
            <h3 className="font-medium text-lg text-center">Forgot Password</h3>
            <form className='mt-2' onSubmit={handleCreateResetPassword}>
              <div className="mb-2">
                <Label>Email Address</Label>
                <Input name='email' id='email' placeholder='Email you signed up with' className='mt-1' type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              </div>
              <Button disabled={loading} className='w-full mt-2'>
                {loading && <Loader2 className='animate-spin' />}
                { loading ? 'Loading...' : 'Reset password'}
              </Button>
            </form>
          </>
        )}
        {status === "Email Instructions" && (
          <>
            <p className='text-foreground/80'>If an account with this email exists, we’ve sent a password reset link to your email.</p>
          </>
        )}
      </div>
      <DotPattern
        width={20}
        height={20}
        className="fill-neutral-300 dark:fill-neutral-800 -z-10" />
    </section>
  )
}
