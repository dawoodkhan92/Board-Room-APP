import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Database types based on our schema
export interface DbMessage {
  id: string;
  content: string;
  sender: string;
  agent_id?: string;
  session_id: string;
  created_at: string;
}

export interface DbSession {
  id: string;
  created_at: string;
  title?: string;
  is_active: boolean;
}

export interface DbAgentConfig {
  id: string;
  name: string;
  role: string;
  system_prompt: string;
  is_active: boolean;
} 