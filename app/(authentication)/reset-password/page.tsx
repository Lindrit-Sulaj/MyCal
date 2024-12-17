import React from 'react'
import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import ResetPassword from '@/components/authentication/reset-password'
import DotPattern from '@/components/ui/dot-pattern'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Reset Password | MyCal'
}

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token: string }> }) {
  const token = (await searchParams).token
  const resetPassword = await prisma.resetPassword.findUnique({
    where: {
      token
    }
  })

  if (!resetPassword) notFound();

  const currentTime = new Date().getTime();
  const expirationTime = new Date(resetPassword.expires).getTime();

  if (expirationTime < currentTime) return notFound();

  return (
    <main>
      <section className="p-4 lg:p-6 relative min-h-screen flex items-center justify-center flex-col gap-y-4">
        <Link href="/" className='font-bold text-2xl'>MyCal</Link>
        <div className="rounded-xl border text-card-foreground shadow-md bg-white dark:bg-neutral-900 w-full max-w-sm mx-auto p-6">
          {expirationTime < currentTime ? (
            <p className='text-foreground/80 font-medium'>This token has expired, please try another one.</p>
          ) : (
            <>
              <h3 className="font-medium text-lg text-center">Reset password</h3>
              <ResetPassword token={token} />
            </>
          )}
        </div>
      </section>
      <DotPattern
        width={20}
        height={20}
        className="fill-neutral-300 dark:fill-neutral-800 -z-10" />
    </main>
  )
}
