'use server'

import { prisma } from "@/lib/prisma";
import { getSession, getUser } from "./user";
import { EventType } from "@prisma/client";

export async function getAllEventTypes(select?: string[]) {
  const user = await getUser();

  if (!user) throw new Error("401 Unauthorized");

  if (!select) {
    return await prisma.eventType.findMany({
      where: { userId: user.id }
    })
  } else {
    return await prisma.eventType.findMany({
      where: { userId: user.id }, select: Object.fromEntries(select.map(p => [p, true]))
    })
  }

}

export async function getEventTypeById(id: string) {
  const user = await getUser();

  if (!user) throw new Error("401 Unauthorized");

  return await prisma.eventType.findUnique({
    where: {
      id,
      userId: user.id
    },
    include: {
      schedule: true
    }
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

  if (!user) throw new Error("401 Unauthorized");

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
      message: 'Event Type with this URL already exists'
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
          isDeletable: false
        },
        {
          identifier: 'email',
          label: 'Your email',
          required: true,
          answerType: 'EMAIL',
          isDeletable: false,
        }
      ]
    }
  });

  return {
    status: 'OK',
    data: newEventType as EventType
  }
}

export async function editEventType(id: string, newData: Partial<EventType>) {
  const user = await getUser();

  if (!user) throw new Error("401 Unauthorized");

  if (newData.url) {
    const isURLTaken = await prisma.eventType.findFirst({
      where: {
        url: newData.url
      }
    });

    if (isURLTaken) return { status: 'Error', message: 'Event Type with this URL already exists' }
  }

  const editedEventType = await prisma.eventType.update({
    where: {
      id,
      userId: user.id
    },
    data: {
      ...newData,
      ...(newData.questions && {
        questions: newData.questions.map(q => {
          return { ...q, options: q.options.filter(option => option !== "") }
        })
      })
    }
  })

  return {
    status: 'OK',
    data: editedEventType as EventType
  }
}

export async function deleteEventType(id: string) {
  const user = await getUser();

  if (!user) throw new Error("401 Unauthorized");

  return await prisma.eventType.delete({
    where: {
      id
    }
  })
}