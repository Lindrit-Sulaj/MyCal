import React from 'react'
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import DotPattern from '@/components/ui/dot-pattern';

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export async function generateMetadata({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;

  const user = await prisma.user.findFirst({
    where: {
      username
    },
    select: {
      name: true,
      username: true,
      description: true,
      image: true,
    }
  })

  return {
    title: `${user?.name} | MyCal`,
    description: `${user?.description}`,
    creator: 'Lindrit Sulaj',
  }
}

export default async function BookingPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const user = await prisma.user.findFirst({
    where: {
      username
    },
    select: {
      name: true,
      username: true,
      description: true,
      emailVerified: true,
      image: true,
      eventTypes: true,
      accounts: true
    }
  })

  if (!user) notFound();
  if (user.accounts.length === 0 && !user.emailVerified) notFound()

  return (
    <main className='py-8 md:py-14 lg:py-20 px-4 md:px-8'>
      <div className="max-w-xl mx-auto">
        <div className='flex flex-col items-center'>
          <Avatar className='!size-14 lg:!size-20'>
            <AvatarImage src={user?.image!} />
            <AvatarFallback className='text-lg lg:text-xl'>{(user.name as string)[0]}</AvatarFallback>
          </Avatar>
          <h1 className='font-semibold text-lg md:text-xl lg:text-2xl mt-2 lg:mt-4'>{user.name}</h1>
          {user.description && <p className='text-center mt-2 text-foreground/80 max-w-sm mx-auto'>{user.description}</p>}
        </div>
        <div className='text-card-foreground bg-neutral-50 dark:bg-neutral-900 border rounded-md mt-6 overflow-hidden'>
          {user.eventTypes.filter(event => !event.hidden).map((eventType, i) => (
            <Link href={`/${user.username}/${eventType.url}`} key={eventType.id} className={`${i !== 0 && 'border-t'} block p-4 lg:p-6 hover:bg-white transition-all`} >
              <h3>
                <span className='font-medium text-[17px]'>{eventType.title}</span>
                {eventType.location && (
                  <span className='text-sm text-foreground/80 ml-2'>{eventType.location.type === "IN_PERSON_MEETING" ? "Physical meeting" : "Phone call"}</span>
                )}
              </h3>
              <p className='text-foreground/80'>{eventType.duration} minutes</p>
            </Link>
          ))}
        </div>
      </div>

      <DotPattern
        width={20}
        height={20}
        className="fill-neutral-200 dark:fill-neutral-800 -z-10" />
      <div className="sr-only">
        {/* <DarkMode /> */}
      </div>
    </main>
  )
}
