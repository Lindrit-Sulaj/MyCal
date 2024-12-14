'use server'

import { prisma } from "@/lib/prisma"
import { getUser } from "./user"

export async function getUserLatestAccount() {
  const user = await getUser();
  
  if (!user) throw new Error("401 Unauthorized");

  return await prisma.account.findFirst({
    where: {
      userId: user.id
    },
    orderBy: {
      updatedAt: 'desc'
    }
  })
}