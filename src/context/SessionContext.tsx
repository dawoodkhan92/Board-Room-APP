import React, { createContext, useContext, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SessionContextType {
  isSessionStarted: boolean;
  startSession: () => Promise<void>;
  currentSessionId: string | null;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: React.ReactNode }) {
  const [isSessionStarted, setIsSessionStarted] = useState(false);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);

  const startSession = async () => {
    try {
      // Create a new session in Supabase
      const { data, error } = await supabase
        .from('sessions')
        .insert([
          { title: `Meeting ${new Date().toLocaleString()}` }
        ])
        .select()
        .single();

      if (error) throw error;

      setCurrentSessionId(data.id);
      setIsSessionStarted(true);
    } catch (error) {
      console.error('Error starting session:', error);
      // If database fails, still allow the app to work
      setIsSessionStarted(true);
    }
  };

  return (
    <SessionContext.Provider value={{ isSessionStarted, startSession, currentSessionId }}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionProvider');
  }
  return context;
}