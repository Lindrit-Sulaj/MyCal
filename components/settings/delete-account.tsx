'use client'

import { Loader2, Trash } from "lucide-react";
import { FormEvent, useState } from "react";


import { deleteUser } from "@/app/actions/user";
import { signOut } from "next-auth/react";
import { navigate } from "@/app/actions/navigate";

import { useToast } from "@/hooks/use-toast";
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
import { Button } from "../ui/button";

export default function DeleteAccount({ username }: { username: string }) {
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false)
  const [verification, setVerification] = useState('')

  async function handleDelete(e: FormEvent) {
    e.preventDefault();
    setLoading(true);

    if (verification !== `mycal/${username}`) {
      setLoading(false);
      return toast({
        title: `Error`,
        description: `"mycal/${username}" missing`
      })
    };

    signOut()
    await deleteUser().then(() => {
      navigate('/log-in')
      setLoading(false);
    })
  }

  return (
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
        <form onSubmit={handleDelete}>
          <div>
            <Label htmlFor="verification">Type <span className='underline'>mycal/{username}</span> to continue</Label>
            <Input className='mt-1' id="verification" name="verification" type="text" value={verification} onChange={(e) => setVerification(e.target.value)} />
          </div>
          <DialogFooter className='mt-4'>
            <DialogClose type="button" asChild>
              <Button variant="ghost">Go back</Button>
            </DialogClose>
            <Button variant="destructive" disabled={loading ? true : verification !== `mycal/${username}`}>
              { loading && <Loader2 className="animate-spin" />}
              { loading ? "Deleting..." : 'Delete'}
            </Button>
          </DialogFooter>
        </form>

      </DialogContent>
    </Dialog>
  )
}