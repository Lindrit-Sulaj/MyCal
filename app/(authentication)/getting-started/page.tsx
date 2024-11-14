import { getUser } from "@/app/actions/user";
import GettingStarted from "./getting-started";
import { redirect } from "next/navigation";

export default async function GettingStartedPage() {
  const user = await getUser();
  
  const conditions = [
    user?.timezone,
    user?.username,
    user?.schedules.length !== 0
  ]

  if (conditions.every(c => c)) {
    redirect('/dashboard')
  }

  return <GettingStarted />
}