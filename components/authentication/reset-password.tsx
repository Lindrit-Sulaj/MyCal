"use client"

import React, { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react';

import { resetPassword } from '@/app/actions/user';
import { useToast } from '@/hooks/use-toast';
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { Button } from '../ui/button';

export default function ResetPassword({ token }: { token: string }) {
  const { replace } = useRouter();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  async function handleResetPassword(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (newPassword !== confirmPassword) {
      setLoading(false);
      return toast({
        title: "Passwords don't match",
        variant: 'destructive'
      })
    }

    await resetPassword(newPassword, token)
      .then(() => {
        toast({
          title: 'Password was successfully changed',
          description: "You can now sign in your account."
        })

        replace('/log-in')
      })
      .finally(() => {
        setLoading(false);
      })
  }

  return (
    <form onSubmit={handleResetPassword}>
      <div className="my-2">
        <Label htmlFor="newPassword">New password</Label>
        <Input id="newPassword" type="password" name="newPassword" className='mt-1' placeholder='New password' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
      </div>
      <div className="mt-2">
        <Label htmlFor="confirmPassword">Confirm password</Label>
        <Input id="confirmPassword" type="password" name="confirmPassword" className='mt-1' placeholder='Confirm new password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
      </div>
      <div className="flex justify-end mt-4">
        <Button disabled={loading}>
          { loading && <Loader2 className='animate-spin' /> }
          { loading ? "Updating password..." : "Update password"}
        </Button>
      </div>
    </form>
  )
}
