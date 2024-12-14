import React from 'react'
import { Metadata } from 'next'
import { default as ForgotPasswordAuth } from '@/components/authentication/forgot-password'

export const metadata: Metadata = {
  title: 'Forgot Password | MyCal'
}

export default function ForgotPassword() {
  return (
    <ForgotPasswordAuth />
  )
}
