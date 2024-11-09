"use client"

import React, { useContext, createContext } from "react";
import { SessionProvider, useSession } from 'next-auth/react'
import type { Session } from "next-auth";

type SessionStatus = "loading" | "authenticated" | "unauthenticated";

type SessionData = Session | undefined | null;

type SessionResult = {
  data: SessionData;
  status: SessionStatus;
};


const ClientContext = createContext<SessionResult | undefined | null>(null);

function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ClientProvider>
        {children}
      </ClientProvider>
    </SessionProvider>
  )
}

function ClientProvider({ children }: { children: React.ReactNode }) {
  const session = useSession();

  return (
    <ClientContext.Provider value={session}>
      {children}
    </ClientContext.Provider>
  )
}


export const useAuth = () => useContext(ClientContext)
export default AuthProvider;