export interface Agent {
  id: string;
  role: string;
  description: string;
  color: string;
  avatar: string;
  isActive: boolean;
}

export interface Message {
  id: string;
  agentId: string;
  content: string;
  timestamp: Date;
  replyTo?: string;
}