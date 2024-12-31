import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SessionContextType {
  isSessionStarted: boolean;
  startSession: () => void;
  endSession: () => void;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [isSessionStarted, setIsSessionStarted] = useState(false);

  const startSession = () => setIsSessionStarted(true);
  const endSession = () => setIsSessionStarted(false);

  return (
    <SessionContext.Provider value={{ isSessionStarted, startSession, endSession }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}