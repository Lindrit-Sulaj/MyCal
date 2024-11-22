'use server'

import { prisma } from "@/lib/prisma";
import { getSession, getUser } from "./user";
import { revalidateTag } from "next/cache";

export async function getAllEventTypesByUserId(userId: string) {
  const session = await getSession();

  if (!session?.user?.email) throw new Error("401 Unauthorized");

  return await prisma.schedule.findMany({
    where: { userId }
  })
}

type CreateEventType = {
  title: string;
  url: string;
  description?: string;
  duration: number
}

export async function createEventType(data: CreateEventType) {
  const user = await getUser();

  if (!user) throw new Error("Not authorized");

  const userDefaultScheduleId = user.schedules.find((schedule) => schedule.isDefault === true)?.id!

  const eventTypeWithURL = await prisma.eventType.findFirst({
    where: {
      userId: user.id,
      url: data.url
    }
  })

  if (eventTypeWithURL) {
    return {
      status: 'Error',
      data: 'Event Type with this URL already exists'
    }
  }

  const newEventType = await prisma.eventType.create({
    data: {
      userId: user.id,
      scheduleId: userDefaultScheduleId,
      title: data.title,
      url: data.url,
      duration: data.duration,
      description: data.description || "",
      dateRange: {
        type: 'INDEFINITELY'
      },
      afterBooking: {
        event: 'MYCAL_CONFIRMATION_PAGE',
      },
      questions: [
        {
          identifier: 'name',
          label: 'Your name',
          required: true,
          answerType: 'ONE_LINE',
        },
        {
          identifier: 'email',
          label: 'Your email',
          required: true,
          answerType: 'EMAIL'
        }
      ]
    }
  });

  revalidateTag('eventTypes')

  return {
    status: 'OK',
    data: newEventType
  }
}