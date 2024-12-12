import React from 'react'
import EditProfile from '@/components/settings/edit-profile'
import { getUser } from '@/app/actions/user'
import DeleteAccount from '@/components/settings/delete-account';

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) return <></>

  return (
    <div className="w-full max-w-screen-md mx-auto my-6">
      <div className='border rounded-md'>
        <div className='p-4 lg:p-6 border-b bg-neutral-100 dark:bg-neutral-900'>
          <h1 className='font-medium text-lg md:text-xl'>Profile</h1>
          <p className='text-sm text-foreground/80'>Manage your MyCal profile</p>
        </div>
        <div className="p-4 lg:p-6">
          <EditProfile user={user!} />
        </div>
      </div>
      <div className='mt-4 lg:mt-6 border rounded-md overflow-hidden'>
        <div className='p-4 lg:p-6 border-b bg-neutral-100 dark:bg-neutral-900'>
          <h1 className='font-medium text-destructive dark:text-red-500'>Danger Zone</h1>
          <p className='text-sm text-foreground/80'>Proceed with caution: Deleting your account is permanent and cannot be undone.</p>
        </div>
        <div className="p-4 lg:p-6 flex justify-end">
          <DeleteAccount username={user.username!} />
        </div>
      </div>
    </div>
  )
}
