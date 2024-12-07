import React from 'react'
import EditProfile from '@/components/settings/edit-profile'
import { getUser } from '@/app/actions/user'

export default async function ProfilePage() {
  const user = await getUser();
  
  return (
    <div className="w-full max-w-screen-md mx-auto my-6 border rounded-md">
      <div className='p-4 lg:p-6 border-b bg-neutral-100 dark:bg-neutral-900'>
        <h1 className='font-medium text-lg md:text-xl'>Profile</h1>
        <p className='text-sm text-foreground/80'>Manage your MyCal profile</p>
      </div>
      <div className="p-4 lg:p-6">
        <EditProfile user={user!} />
      </div>
    </div>
  )
}
