import React from 'react';
import { Message } from '../services/agentService';

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isAgent = message.sender !== 'You';

  return (
    <div className={`flex ${isAgent ? 'justify-start' : 'justify-end'} mb-4`}>
      <div className={`max-w-[70%] rounded-lg p-4 ${
        isAgent 
          ? 'bg-white shadow-sm border border-gray-200' 
          : 'bg-indigo-600 text-white'
      }`}>
        {isAgent && (
          <div className="text-sm font-medium text-indigo-600 mb-1">
            {message.sender}
          </div>
        )}
        <div className="text-sm whitespace-pre-wrap">
          {message.content}
        </div>
        <div className="text-xs mt-1 opacity-70">
          {new Date(message.timestamp).toLocaleTimeString()}
        </div>
      </div>
    </div>
  );
}