'use client'

import React, { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@prisma/client'
import { UploadButton } from '../uploadthing'
import { Loader2 } from 'lucide-react'

import { editUser } from '@/app/actions/user'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from '../ui/label'
import { Input } from '../ui/input'
import { useToast } from '@/hooks/use-toast'
import { Textarea } from '../ui/textarea'
import { Button } from '../ui/button'

export default function EditProfile({ user }: { user: User }) {
  const router = useRouter();
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [image, setImage] = useState(user.image!)
  const [username, setUsername] = useState(user.username! || "")
  const [name, setName] = useState(user.name || "");
  const [email, setEmail] = useState(user.email!)
  const [description, setDescription] = useState(user.description || "")

  const parsedUsername = useMemo(() => {
    let formattedText = username.toLowerCase().split(' ').join('-')

    const URLValidRegex = /^[a-zA-Z0-9._-]*$/

    formattedText = [...formattedText].filter(char => URLValidRegex.test(char)).join('').replace(/-+/g, '-')

    return formattedText
  }, [username])

  const changed = useMemo(() => {
    let hasChanged = false;

    const newData = { image, username, description, name }
    const oldData = { image: user.image, description: user.description, username: user.username, name: user.name }

    for (let prop in newData) {
      // @ts-ignore
      if (newData[prop] !== oldData[prop]) {
        hasChanged = true
      }
    }

    return hasChanged;
  }, [image, username, name, description]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    await editUser({ data: { username, name, description, image } })
      .then(() => {
        toast({
          title: 'Settings updated successfully'
        })
      })
      .catch(() => {
        toast({
          title: 'Something went wrong',
          variant: 'destructive'
        })
      }).finally(() => {
        setLoading(false);
        router.refresh();
      })
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className='flex items-center space-x-4 mb-3'>
        <Avatar className='!size-14'>
          <AvatarImage src={image} />
          <AvatarFallback>{user.name![0]}</AvatarFallback>
        </Avatar>
        <div>
          <Label>Profile picture</Label>
          <UploadButton
            className='mt-1'
            endpoint="imageUploader"
            onClientUploadComplete={(res) => {
              setImage(res[0].url)
            }}
            onUploadError={(error: Error) => {
              toast({
                title: error.message,
                variant: 'destructive'
              })
            }}
          />
        </div>
      </div>
      <div className="my-3">
        <Label htmlFor="username">Username</Label>
        <div className="flex mt-1 rounded-md bg-neutral-100 dark:bg-neutral-900 overflow-hidden items-center border">
          <div className='px-3 text-sm text-neutral-700 dark:text-neutral-300'>mycal.com/</div>
          <Input name='username' id='username' className='bg-white dark:bg-neutral-950 rounded-l-none focus-visible:ring-0 border-0 border-l' placeholder='username' value={parsedUsername} onChange={(e) => setUsername(e.target.value)} required />
        </div>
      </div>
      <div className="my-3">
        <Label htmlFor="name">Name</Label>
        <Input name="name" id="name" placeholder='Your name' value={name} onChange={(e) => setName(e.target.value)} className='mt-1' required />
      </div>
      <div className="my-3">
        <Label htmlFor="email">Email</Label>
        <Input name="email" id="email" placeholder='Your email' value={email} onChange={(e) => setEmail(e.target.value)} className='mt-1' required disabled />
      </div>
      <div className="my-3">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" name="description" rows={3} placeholder="Write about yourself" className='mt-1' value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>
      <div className="flex justify-end mt-4 lg:mt-6">
        <Button disabled={loading ? true : !changed}>
          {loading && <Loader2 className='animate-spin' />}
          {loading ? "Updating..." : "Update"}
        </Button>
      </div>
    </form>
  )
}
