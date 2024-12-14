'use server'

import { prisma } from "@/lib/prisma"
import { OutOfOffice } from "@prisma/client"
import { getUser } from "./user"

export async function getOutOfOffice() {
  const user = await getUser();

  if (!user) throw new Error("401 Unauthorized");

  return await prisma.outOfOffice.findMany({
    where: { 
      userId: user.id
    },
    orderBy: {
      dates: {
        from: 'asc'
      }
    }
  })
}

export async function createOutOfOffice(data: Pick<OutOfOffice, 'dates' | 'reason' | 'notes'>) {
  const user = await getUser();

  if (!user) throw new Error("401 Unauthorized");
  
  return await prisma.outOfOffice.create({
    data: {
      userId: user.id,
      ...data
    }
  })
}

export async function editOutOfOffice(id: string, data: Pick<OutOfOffice, "dates" | "reason" | "notes">) {
  const user = await getUser();

  if (!user) throw new Error("401 Unauthorized");

  return await prisma.outOfOffice.update({
    where: {
      id
    },
    data
  })
}

export async function deleteOutOfOffice(id: string) {
  const user = await getUser();

  if (!user) throw new Error('401 Unauthorized');

  return await prisma.outOfOffice.delete({
    where: {
      id
    }
  })
}