'use server'

import { prisma } from "@/lib/prisma";
import { getSession } from "./user";

export async function getAllEventTypesByUserId(userId: string) {
  const session = await getSession();

  if (!session?.user?.email) throw new Error("401 Unauthorized");

  return await prisma.schedule.findMany({
    where: { userId }
  })
}