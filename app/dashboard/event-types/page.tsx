import React from 'react'
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';

import { getUser } from '@/app/actions/user'

import CreateEvent from './create-event';
import EventTypeCard from './event-type-card';
export default async function EventTypes() {
  const user = await getUser();

  if (!user) {
    notFound();
  }

  const eventTypes = await prisma.eventType.findMany({ where: { userId: user.id }, select: { id: true, title: true, url: true, duration: true, hidden: true } });

  return (
    <div className='px-4 py-6 sm:p-6 lg:p-8'>
      <div className='flex flex-col items-start sm:flex-row sm:justify-between sm:items-center space-y-2'>
        <div>
          <h1 className='text-xl md:text-2xl font-medium'>Event types</h1>
          <p className='text-sm mt-1 text-foreground/80'>Create events for people to book on your calendar.</p>
        </div>
        <CreateEvent username={user.username as string} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 mt-4 md:mt-6 gap-6">
        {eventTypes.map((e) => (
          <EventTypeCard key={e.id} username={user.username!} {...e} />
        ))}
      </div>
      <div>
        <pre>{JSON.stringify(eventTypes, null, 2)}</pre>
      </div>
    </div>
  )
}
