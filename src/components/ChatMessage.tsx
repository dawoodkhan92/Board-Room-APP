import React from 'react';
import { Message } from '../types/agent';
import { agents } from '../data/agents';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const agent = agents.find(a => a.id === message.agentId)!;
  
  return (
    <div className="mb-6">
      <div className="flex items-center mb-2">
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center"
          style={{ backgroundColor: `${agent.color}20` }}
        >
          {React.createElement(agent.avatar, {
            size: 24,
            color: agent.color,
          })}
        </div>
        <div className="ml-3">
          <span className="font-medium" style={{ color: agent.color }}>
            {agent.role}
          </span>
          <span className="text-sm text-gray-500 ml-2">
            {new Date(message.timestamp).toLocaleTimeString()}
          </span>
        </div>
      </div>
      <div className="ml-13 pl-13">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          {message.content}
        </div>
      </div>
    </div>
  );
}