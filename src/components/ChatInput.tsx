import React, { useState, FormEvent } from 'react';
import { Agent } from '../data/agents';
import { Send } from 'lucide-react';

interface ChatInputProps {
  agents: Agent[];
  onSendMessage: (content: string, activeAgents: Agent[]) => void;
}

export function ChatInput({ agents, onSendMessage }: ChatInputProps) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    const activeAgents = agents.filter(agent => agent.isActive);
    if (activeAgents.length === 0) {
      alert('Please activate at least one agent to continue the conversation.');
      return;
    }

    onSendMessage(message.trim(), activeAgents);
    setMessage('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
      <div className="flex items-center gap-4">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 min-w-0 rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!message.trim()}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Send size={20} />
          Send
        </button>
      </div>
    </form>
  );
}