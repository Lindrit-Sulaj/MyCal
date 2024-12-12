import React from 'react'
import EditProfile from '@/components/settings/edit-profile'
import { deleteUser, getUser } from '@/app/actions/user'
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { redirect } from 'next/navigation';

export default async function ProfilePage() {
  const user = await getUser();

  if (!user) return <></>

  async function handleDelete(formData: FormData) {
    'use server'

    const verification = formData.get('verification') as string;

    if (verification === `mycal/${user?.username!}`) {
      await deleteUser().then(() => {
        redirect('/log-in')
      });
    }
  }

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
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Trash />
                Delete Account
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Are you absolutely sure?</DialogTitle>
                <DialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove your data from our servers.
                </DialogDescription>
              </DialogHeader>
              <form action={handleDelete}>
                <div>
                  <Label htmlFor="verification">Type <span className='underline'>mycal/{user.username}</span> to continue</Label>
                  <Input className='mt-1' id="verification" name="verification" type="text" />
                </div>
                <DialogFooter className='mt-4'>
                  <DialogClose type="button" asChild>
                    <Button variant="ghost">Go back</Button>
                  </DialogClose>
                  <Button variant="destructive">Delete</Button>
                </DialogFooter>
              </form>

            </DialogContent>
          </Dialog>


        </div>
      </div>
    </div>
  )
}
