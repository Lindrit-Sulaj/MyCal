'use client'

import React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Button } from "./ui/button"

export default function SideLink({ label, url }: { label: string, url: string }) {
  const path = usePathname();

  const isCurrentPath = path === url;

  return (
    <Link href={url} className="w-full">
      <Button className="w-full justify-start h-8" variant={isCurrentPath ? 'secondary' : 'ghost'}>{label}</Button>
    </Link>
  )
}