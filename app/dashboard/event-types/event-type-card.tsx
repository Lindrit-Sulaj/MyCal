'use client'

import { CheckCheck, Copy, Edit2, SquareArrowOutUpRight } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import Link from 'next/link';

import { editEventType } from '@/app/actions/event-type';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { Switch } from "@/components/ui/switch"
import { Label } from '@/components/ui/label';
import { useFirstRender } from '@/hooks/use-first-render';


export default function EventTypeCard({ id, title, duration, url, hidden, username }: {
  id: string;
  title: string;
  duration: number;
  url: string;
  hidden: boolean | null;
  username: string
}) {
  const firstRender = useFirstRender();
  const [visible, setVisible] = useState(hidden ? false : true);
  const [copied, setCopied] = useState(false);

  function copyToClipboard() {
    setCopied(true);

    navigator.clipboard.writeText(`https://mycal.lindritsulaj.com/${username}/${url}`)

    setTimeout(() => {
      setCopied(false);
    }, 1500)
  }

  useEffect(() => {
    if (firstRender) return;

    console.log(`Updating event ${title}`)

    async function handleEditEventType() {
      return await editEventType(id, { hidden: !visible })
    }

    handleEditEventType()
  }, [visible])

  return (
    <div key={id} className='text-card-foreground bg-neutral-50 dark:bg-neutral-900 border rounded-md p-6'>
      <div className="flex flex-wrap items-center gap-x-1">
        <h3 className='font-medium'>
          {title}
        </h3>
        <p className='text-sm text-foreground/70'>/{username}/{url}</p>
      </div>
      <div className='bg-neutral-200 dark:bg-accent inline-block px-2 py-[2px] rounded-sm text-sm font-medium mt-1'>
        {duration} minutes
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="border rounded-md overflow-hidden">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/${username}/${url}`}>
                  <button className="w-9 h-9 inline-flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-background transition-all">
                    <SquareArrowOutUpRight className='size-4' />
                  </button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                Preview
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <button onClick={copyToClipboard} className="w-9 h-9 inline-flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-background transition-all border-l">
                  {copied ? <CheckCheck className='size-4' /> : <Copy className='size-4' />}
                </button>
              </TooltipTrigger>
              <TooltipContent>
                Copy link
              </TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Link href={`/dashboard/event-types/${id}`}>
                  <button className="w-9 h-9 inline-flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-background transition-all border-l">
                    <Edit2 className='size-4' />
                  </button>
                </Link>
              </TooltipTrigger>
              <TooltipContent>
                Edit
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div>
                <Switch id="visible" defaultChecked={visible} checked={visible} onCheckedChange={setVisible} />
              </div>
            </TooltipTrigger>
            <TooltipContent>
              Show on profile
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

      </div>
    </div>
  )
}
