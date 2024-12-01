import React from 'react'
import { redirect } from 'next/navigation'

export default function DashboardMain() {
  redirect('/dashboard/event-types')
}
