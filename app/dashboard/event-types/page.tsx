import React from 'react'
import { notFound } from 'next/navigation';

import { getUser } from '@/app/actions/user'
import { getAllEventTypesByUserId } from '@/app/actions/event-type';

import CreateEvent from './create-event';

export default async function EventTypes() {
  const user = await getUser();
  const eventTypes = await getAllEventTypesByUserId(user?.id!);

  if (!user) {
    notFound();
  }

  return (
    <div className='px-4 py-6 sm:p-6 lg:p-8'>
      <div className='flex flex-col items-start sm:flex-row sm:justify-between sm:items-center space-y-2'>
        <div>
          <h1 className='text-xl md:text-2xl font-medium'>Event types</h1>
          <p className='text-sm mt-1 text-foreground/80'>Create events for people to book on your calendar.</p>
        </div>
        <CreateEvent username={user.username as string} />
      </div>

      <div className="grid grid-cols-4 mt-4 md:mt-6">
        <div className="text-card-foreground bg-neutral-100 dark:bg-neutral-900 border rounded-md p-6"></div>
      </div>
    </div>
  )
}
