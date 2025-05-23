import React, { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { SummaryPanel } from './components/SummaryPanel';
import { Play } from 'lucide-react';
import { useChat } from './hooks/useChat';
import { useAgents } from './hooks/useAgents';
import { useSession } from './context/SessionContext';
import { AgentService } from './services/agentService';

export default function App() {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const { isSessionStarted, startSession } = useSession();
  const { messages, isLoading, addMessage, thinkingAgentId } = useChat();
  const { agents, toggleAgent } = useAgents();
  const [summary, setSummary] = useState('No discussion yet.');
  const [actionItems, setActionItems] = useState<string[]>([]);

  // Update summary and action items when messages change
  useEffect(() => {
    if (messages.length > 0) {
      // Update summary
      AgentService.generateSummary(messages).then(setSummary);
      // Update action items
      AgentService.generateActionItems(messages).then(setActionItems);
    }
  }, [messages]);

  if (!isSessionStarted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-6">AI Board Room</h1>
          <button
            onClick={() => startSession()}
            className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <Play size={20} />
            Start Meeting
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        agents={agents}
        onToggleAgent={toggleAgent}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        thinkingAgentId={thinkingAgentId}
      />
      
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-6">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && (
            <div className="text-center text-gray-500">
              Agents are thinking...
            </div>
          )}
        </div>
        <ChatInput
          agents={agents}
          onSendMessage={addMessage}
        />
      </div>

      <SummaryPanel
        summary={summary}
        actionItems={actionItems}
      />
    </div>
  );
}