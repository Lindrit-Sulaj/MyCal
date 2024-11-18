'use client'

import { FormEvent, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"

import OAuth from "@/components/oauth"
import { navigate } from "@/app/actions/navigate"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import GridPattern from "@/components/ui/grid-pattern"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

export default function LogIn() {
  const { toast } = useToast();
  const router = useRouter();
  
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');

  async function handleSignIn(e: FormEvent) {
    e.preventDefault();

    setLoading(true);

    const signedInUser = await signIn('credentials', { email, password, redirect: false })

    if (signedInUser?.ok) {
      toast({
        title: 'Signed in successfully',
        description: 'Head over to the dashboard to start using your account'
      })
      router.refresh()      
    } else if (signedInUser?.error) {
      toast({
        title: signedInUser.error,
        variant: 'destructive'
      })
    }

    setLoading(false);
  }

  return (
    <main>
      <section className="p-3 md:p-4 h-screen">
        <div className="bg-neutral-100 dark:bg-neutral-950 border w-full h-full rounded-xl flex flex-col items-center relative z-10 px-4">
          <div className="py-8">
            <Link href="/" className='font-bold text-2xl'>MyCal</Link>
          </div>
          <div className="grow flex flex-col justify-center w-full relative z-10">
            <h1 className='text-2xl md:text-3xl font-semibold tracking-tight text-center'>Log in</h1>
            <div className="rounded-xl border text-card-foreground shadow bg-white dark:bg-neutral-900 mt-2 md:mt-4 w-full max-w-sm mx-auto p-6">
              <form onSubmit={(e) => handleSignIn(e)}>
                <div className="mb-2">
                  <Label>Email</Label>
                  <Input value={email} onChange={(e) => setEmail(e.target.value)} name='email' id='email' placeholder='Your email address' className='mt-1' type="email" />
                </div>
                <div className="mt-2">
                  <Label>Password</Label>
                  <Input value={password} onChange={(e) => setPassword(e.target.value)} name='password' id='password' placeholder='Your password' type="password" className='mt-1' />
                </div>
                <Button disabled={loading} variant="secondary" className='w-full mt-2'>
                  {!loading ? "Log in" :
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className={cn("animate-spin")}
                      >
                        <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                      </svg>
                      Logging in...
                    </>}
                </Button>
              </form>
              <OAuth />
              <p className="text-center text-sm mt-4 text-foreground/80">Don't have an account? <Link href="/sign-up" className="underline text-foreground">Create one</Link></p>
            </div>
          </div>
          <GridPattern
            width={65}
            height={65}
            x={-1}
            y={-1}
            className={cn(
              "stroke-neutral-400/20 lg:stroke-neutral-500/20 dark:stroke-neutral-700/30 [mask-image:radial-gradient(400px_circle_at_center,white,transparent)] lg:[mask-image:radial-gradient(600px_circle_at_center,white,transparent)]",
            )}
          />
        </div>

      </section>
    </main>
  )
}