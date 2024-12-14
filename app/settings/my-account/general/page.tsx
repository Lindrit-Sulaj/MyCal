import React from 'react'
import { getUser } from '@/app/actions/user'
import Timezone from '@/components/settings/timezone';

export default async function GeneralSettings() {
  const user = await getUser();

  if (!user) return <></>

  return (
    <div className="w-full max-w-screen-md mx-auto my-6">
      <div className='border rounded-md'>
        <div className='p-4 lg:p-6 border-b bg-neutral-100 dark:bg-neutral-900'>
          <h1 className='font-medium text-lg md:text-xl'>General</h1>
          <p className='text-sm text-foreground/80'>Manage settings for your timezone</p>
        </div>
        <Timezone userTimezone={user.timezone!} />
      </div>
    </div>
  )
}