import React from 'react';
import { Agent } from '../data/agents';
import { ChevronLeft, ChevronRight, HelpCircle } from 'lucide-react';

interface SidebarProps {
  agents: Agent[];
  onToggleAgent: (agentId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  thinkingAgentId?: string;
}

export function Sidebar({ 
  agents, 
  onToggleAgent, 
  isCollapsed, 
  onToggleCollapse,
  thinkingAgentId 
}: SidebarProps) {
  const getThinkingEmoji = (agent: Agent) => {
    if (agent.id !== thinkingAgentId) return agent.avatar;
    
    switch (agent.id) {
      case 'facilitator':
        return '🤔';
      case 'tech_expert':
        return '⚡';
      case 'analyst':
        return '📈';
      case 'creative':
        return '💭';
      case 'researcher':
        return '🔎';
      default:
        return '💭';
    }
  };

  return (
    <div className={`bg-white border-r border-gray-200 transition-all ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      <div className="p-4 border-b border-gray-200 flex justify-between items-center">
        {!isCollapsed && <h2 className="font-semibold">AI Agents</h2>}
        <button
          onClick={onToggleCollapse}
          className="p-1 hover:bg-gray-100 rounded-lg"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>
      
      <div className="p-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`mb-3 ${isCollapsed ? 'text-center' : ''}`}
          >
            <div className="group relative">
              <div
                onClick={() => onToggleAgent(agent.id)}
                className={`w-full p-2 rounded-lg transition-colors flex items-center gap-2 cursor-pointer ${
                  agent.isActive
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <span className={`flex-shrink-0 transition-all ${
                  thinkingAgentId === agent.id ? 'animate-pulse' : ''
                }`}>
                  {getThinkingEmoji(agent)}
                </span>
                {!isCollapsed && (
                  <div className="text-left flex-1">
                    <div className="font-medium flex items-center gap-1">
                      {agent.name}
                      <span
                        className="opacity-50 hover:opacity-100 transition-opacity cursor-help"
                      >
                        <HelpCircle size={14} />
                      </span>
                    </div>
                    <div className="text-xs opacity-75">{agent.role}</div>
                  </div>
                )}
              </div>

              <div className="absolute left-full top-0 ml-2 hidden group-hover:block z-50">
                <div className="bg-gray-900 text-white text-sm rounded-lg p-3 shadow-lg max-w-xs">
                  <div className="font-medium mb-1">{agent.name} - {agent.role}</div>
                  <div className="text-gray-300 text-xs mb-2">{agent.description}</div>
                  <div className="text-xs font-medium mb-1">Capabilities:</div>
                  <ul className="text-xs text-gray-300 list-disc pl-4">
                    {agent.id === 'facilitator' && [
                      'Guide discussions',
                      'Keep conversations on track',
                      'Summarize key points',
                      'Identify action items'
                    ].map((cap, i) => <li key={i}>{cap}</li>)}
                    {agent.id === 'tech_expert' && [
                      'Provide technical insights',
                      'Explain complex concepts',
                      'Identify technical risks',
                      'Suggest best practices'
                    ].map((cap, i) => <li key={i}>{cap}</li>)}
                    {agent.id === 'analyst' && [
                      'Analyze business impact',
                      'Identify risks and opportunities',
                      'Suggest data-driven solutions',
                      'Consider cost-benefit tradeoffs'
                    ].map((cap, i) => <li key={i}>{cap}</li>)}
                    {agent.id === 'creative' && [
                      'Offer creative perspectives',
                      'Suggest innovative solutions',
                      'Consider user experience',
                      'Think outside the box'
                    ].map((cap, i) => <li key={i}>{cap}</li>)}
                    {agent.id === 'researcher' && [
                      'Real-time internet searches',
                      'Provide up-to-date information',
                      'Support other agents with data',
                      'Synthesize search results'
                    ].map((cap, i) => <li key={i}>{cap}</li>)}
                  </ul>
                  {agent.canSearch && (
                    <div className="mt-2 text-xs text-indigo-300">
                      ✨ Has internet search capability
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}