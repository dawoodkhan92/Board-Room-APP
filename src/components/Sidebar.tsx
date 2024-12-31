import React from 'react';
import { Agent } from '../data/agents';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  agents: Agent[];
  onToggleAgent: (agentId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ agents, onToggleAgent, isCollapsed, onToggleCollapse }: SidebarProps) {
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
            <button
              onClick={() => onToggleAgent(agent.id)}
              className={`w-full p-2 rounded-lg transition-colors flex items-center gap-2 ${
                agent.isActive
                  ? 'bg-indigo-50 text-indigo-600'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <span className="flex-shrink-0">{agent.avatar}</span>
              {!isCollapsed && (
                <div className="text-left">
                  <div className="font-medium">{agent.name}</div>
                  <div className="text-xs opacity-75">{agent.role}</div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}