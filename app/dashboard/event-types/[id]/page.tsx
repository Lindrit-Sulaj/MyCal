import React from 'react'
import { getEventTypeById } from '@/app/actions/event-type';
import EditEventType from './edit-event-type';
import { type EventType } from '@prisma/client';
import { getUser } from '@/app/actions/user';

export default async function EventType({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const user = await getUser();
  const eventType = await getEventTypeById(id);

  return (
    <EditEventType {...eventType as EventType} schedule={eventType?.schedule!} username={user?.username!} timezone={user?.timezone!} />
  )
}
