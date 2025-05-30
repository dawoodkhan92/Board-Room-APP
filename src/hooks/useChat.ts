import { useState } from 'react';
import { Message, AgentService } from '../services/agentService';
import { Agent } from '../data/agents';

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [thinkingAgentId, setThinkingAgentId] = useState<string | undefined>(undefined);

  const addMessage = async (content: string, activeAgents: Agent[]) => {
    // Add user message
    const userMessage: Message = {
      id: Math.random().toString(36).substring(2),
      content,
      sender: 'You',
      timestamp: new Date()
    };
    
    setMessages((prev: Message[]) => [...prev, userMessage]);
    
    // Get AI response
    setIsLoading(true);
    try {
      // Randomly select an agent (in a real app, you might want to be more strategic)
      const randomAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
      setThinkingAgentId(randomAgent.id);

      const agentResponse = await AgentService.getAgentResponse(content, activeAgents);
      setMessages((prev: Message[]) => [...prev, agentResponse]);
    } catch (error) {
      console.error('Error getting agent response:', error);
    } finally {
      setIsLoading(false);
      setThinkingAgentId(undefined);
    }
  };

  return {
    messages,
    isLoading,
    addMessage,
    thinkingAgentId
  };
}