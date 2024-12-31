import React, { useState } from 'react';
import { Agent } from '../types/agent';
import { MessageCircle } from 'lucide-react';

interface ChatInputProps {
  agents: Agent[];
  onSendMessage: (content: string, targetAgents: string[]) => void;
}

export function ChatInput({ agents, onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message, selectedAgents);
      setMessage('');
      setSelectedAgents([]);
    }
  };

  return (
    <div className="border-t border-gray-200 bg-white p-4">
      <div className="mb-2 flex flex-wrap gap-2">
        {agents.map((agent) => (
          <button
            key={agent.id}
            onClick={() => setSelectedAgents(prev => 
              prev.includes(agent.id) 
                ? prev.filter(id => id !== agent.id)
                : [...prev, agent.id]
            )}
            className={`px-3 py-1 rounded-full text-sm flex items-center gap-1 transition-colors ${
              selectedAgents.includes(agent.id)
                ? 'bg-gray-800 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {agent.role}
          </button>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Ask the board-room a question..."
          className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="rounded-lg bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          <MessageCircle size={20} />
        </button>
      </form>
    </div>
  );
}