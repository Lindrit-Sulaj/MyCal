'use server'

import { DayOfWeek } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getUser } from "./user"

type AvailableDays = { day: DayOfWeek, value?: string }[] | 'default'

export async function getSchedules() {
  const user = await getUser();

  if (!user) throw new Error("Not authorized")

  return await prisma.schedule.findMany({
    where: {
      userId: user.id
    }
  })
}

export async function getSchedule(id: string) {
  const user = await getUser();
  if (!user) throw new Error("Not authorized");

  return await prisma.schedule.findUnique({
    where: {
      id,
      userId: user.id
    }
  })
}

export async function createSchedule({ name, availableDays, isDefault }: { name?: string, isDefault?: boolean, availableDays: AvailableDays }) {
  const user = await getUser();

  if (!user) throw new Error("Not authorized")
  
  if (availableDays === 'default') {
    return await prisma.schedule.create({
      data: { 
        userId: user.id,
        isDefault,
        name: name || 'Working Hours', 
        availableDays: [
        { day: 'MONDAY', value: '08:00 - 17:00' },
        { day: 'TUESDAY', value: '08:00 - 17:00' },
        { day: 'WEDNESDAY', value: '08:00 - 17:00' },
        { day: 'THURSDAY', value: '08:00 - 17:00' },
        { day: 'FRIDAY', value: '08:00 - 17:00' },
        { day: 'SATURDAY', value: '' },
        { day: 'SUNDAY', value: '' },
      ]}
    })
  } else {
    return await prisma.schedule.create({
      data: {
        userId: user.id,
        name: name || "Working Hours",
        availableDays
      }
    })
  }
}

export async function deleteSchedule(id: string) {
  const user = await getUser();

  if (!user) throw new Error("Not authorized")

  if (user.schedules.length <= 1) throw new Error("You cannot delete your only schedule")
  
  const deletedSchedule = await prisma.schedule.delete({
    where: { id }
  });

  if (deletedSchedule.isDefault) {
    const newDefaultScheduleId = user.schedules.find(s => s.id !== deletedSchedule.id)?.id;

    await prisma.schedule.update({
      where: { id: newDefaultScheduleId },
      data: { isDefault: true }
    });
  }

  return true
}

export async function setAsDefault(scheduleId: string) {
  const user = await getUser();

  if (!user) throw new Error("Not authorized");

  const defaultSchedule = user?.schedules.find(s => s.isDefault);
  if (!user.schedules.find(s => s.id === scheduleId)) throw new Error("This schedule doesn't exist")

  if (!defaultSchedule) {
    return await prisma.schedule.update({
      where: { id: scheduleId },
      data: {
        isDefault: true
      }
    })
  }

  if (defaultSchedule.id === scheduleId) throw new Error("This schedule is already default");

  await prisma.schedule.update({
    where: {
      id: defaultSchedule.id
    },
    data: {
      isDefault: false
    }
  });

  return await prisma.schedule.update({
    where: {
      id: scheduleId
    },
    data: {
      isDefault: true
    }
  });
}