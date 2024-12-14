import React from 'react'
import { getUser } from '@/app/actions/user';
import { getUserLatestAccount } from '@/app/actions/account';
import Password from '@/components/settings/password';

export default async function PasswordPage() {
  const user = await getUser();
  const account = await getUserLatestAccount();

  if (!user) return <></>

  return (
    <div className="w-full max-w-screen-md mx-auto my-6">
      <div className='border rounded-md'>
        <div className='p-4 lg:p-6 border-b bg-neutral-100 dark:bg-neutral-900'>
          <h1 className='font-medium text-lg md:text-xl'>Password</h1>
          <p className='text-sm text-foreground/80'>Manage your account password.</p>
        </div>
        { account && (
          <div className='p-4 lg:p-6'>
            <h3 className='font-medium'>Your account is managed by Google</h3>
          </div>
        )}
        { !account && (
          <Password />
        )}
      </div>
    </div>
  )
}
