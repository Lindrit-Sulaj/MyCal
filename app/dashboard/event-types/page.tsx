import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import React from 'react'

export default function EventTypes() {
  return (
    <div>
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-xl md:text-2xl font-medium'>Event types</h1>
          <p className='text-sm mt-1 text-foreground/80'>Create events to share for people to book on your calendar.</p>
        </div>
        <Button>
          <Plus /> Create new
        </Button>
      </div>
    </div>
  )
}
