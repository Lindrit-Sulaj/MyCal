'use client'

import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

import { changePassword } from '@/app/actions/user';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useToast } from '@/hooks/use-toast';

export default function Password() {
  const { refresh } = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('')

  async function handleChangePassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    await changePassword(oldPassword, newPassword)
      .then(() => {
        toast({
          title: 'Password updated successfully'
        })
        setOldPassword('');
        setNewPassword('')
        refresh();
      })
      .catch(() => {
        toast({
          title: 'Old password is incorrect',
          variant: 'destructive'
        })
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <form onSubmit={handleChangePassword} className='p-4 lg:p-6'>
      <div className="mb-2">
        <Label htmlFor="oldPassword">Old Password</Label>
        <Input id="oldPassword" name="oldPassword" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} placeholder='Your old password' className='mt-1' type="password" />
      </div>
      <div className="mt-2">
        <Label htmlFor="newPassword">New Password</Label>
        <Input id="newPassword" name="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder='Your old password' className='mt-1' type="password" />
      </div>
      <div className="flex justify-end mt-4">
        <Button disabled={loading}>
          {loading && <Loader2 className='animate-spin' />}
          {loading ? "Saving changes..." : "Save"}
        </Button>
      </div>
    </form>
  )
}
