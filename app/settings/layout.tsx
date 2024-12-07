import React from "react";
import { redirect } from "next/navigation";

import { getUser } from "../actions/user";
import SettingsSidebar from "@/components/settings-sidebar";

export default async function SettingsLayout({ children }: { children: React.ReactNode }) {
  const user = await getUser();

  const conditions = [
    !user?.timezone,
    !user?.username,
    user?.schedules.length === 0
  ]

  if (conditions.some(c => c)) {
    redirect('/getting-started')
  }

  return (
    <main className="flex flex-col lg:flex-row h-screen">
      <SettingsSidebar />
      <div className="grow overflow-y-auto h-full px-4 lg:px-0">
        {children}
      </div>
    </main>
  )
}

