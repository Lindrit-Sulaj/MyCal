import React from 'react'

export default async function BookingPage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  return (
    <div>
      { username }
    </div>
  )
}
