import { useState } from 'react';
import { Message } from '../types/agent';
import { sendMessage } from '../services/api';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addMessage = async (content: string, targetAgents: string[]) => {
    setIsLoading(true);
    
    const userMessage: Message = {
      id: Math.random().toString(),
      agentId: 'user',
      content,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await sendMessage(content, targetAgents);
      if (response.success) {
        setMessages(prev => [...prev, ...response.responses]);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    addMessage
  };
}