'use client'
import React, { useEffect, useState } from 'react'

import { setAsDefault } from '@/app/actions/schedule'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/hooks/use-toast'
import { useFirstRender } from '@/hooks/use-first-render'

export default function MakeDefault({ scheduleId, isDefault }: { scheduleId: string, isDefault: boolean | null }) {
  const { toast } = useToast();
  const [checked, setChecked] = useState(isDefault || false);
  const firstRender = useFirstRender();

  useEffect(() => {
    if (!checked || firstRender) return;

    async function handleSetAsDefault() {
      return await setAsDefault(scheduleId)
    }

    handleSetAsDefault()
    .then(() => {
      toast({
        title: 'Schedule set as default'
      })
    })
    .catch(err => {
      toast({
        title: err.message,
        variant: 'destructive'
      })
    });
  }, [checked])

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="default-schedule">Set as default</Label>
      <Switch disabled={checked} checked={checked} onCheckedChange={setChecked} id="default-schedule" />
    </div>
  )
}
