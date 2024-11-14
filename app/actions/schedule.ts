'use server'

import { DayOfWeek } from "@prisma/client"
import { prisma } from "@/lib/prisma"
import { getUser } from "./user"

type AvailableDays = { day: DayOfWeek, value?: string }[] | 'default'

export async function createSchedule({ name, availableDays }: { name?: string, availableDays: AvailableDays }) {
  const user = await getUser();

  if (!user) throw new Error("User not authorized")
  
  if (availableDays === 'default') {
    return await prisma.schedule.create({
      data: { 
        userId: user.id,
        name: 'Working Hours', 
        availableDays: [
        { day: 'MONDAY', value: '8:00 - 17:00' },
        { day: 'TUESDAY', value: '8:00 - 17:00' },
        { day: 'WEDNESDAY', value: '8:00 - 17:00' },
        { day: 'THURSDAY', value: '8:00 - 17:00' },
        { day: 'FRIDAY', value: '8:00 - 17:00' },
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