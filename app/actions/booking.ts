'use server'

import { prisma } from "@/lib/prisma"
import { startOfDay, endOfDay } from "date-fns";

export async function getBookingsFromEventType(eventTypeId: string, date: Date) {
  const bookings = await prisma.booking.findMany({
    where: {
      eventTypeId,
      date: {
        gte: startOfDay(date).toISOString(),
        lte: endOfDay(date).toISOString()
      }
    },
    select: {
      date: true,
      duration: true,
      isConfirmed: true,
    }
  });

  return bookings;
}