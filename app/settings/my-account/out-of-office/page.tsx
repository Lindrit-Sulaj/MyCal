import React from 'react'
import { getUser } from '@/app/actions/user'
import OutOfOffice from '@/components/settings/out-of-office';
import { getOutOfOffice } from '@/app/actions/out-of-office';

export default async function GeneralSettings() {
  const user = await getUser();
  const outOfOffice = await getOutOfOffice();

  if (!user) return <></>

  return (
    <OutOfOffice entries={outOfOffice} />
  )
}