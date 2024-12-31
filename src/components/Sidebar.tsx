import React from 'react';
import { Agent } from '../types/agent';
import { Switch } from './Switch';

interface SidebarProps {
  agents: Agent[];
  onToggleAgent: (agentId: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

export function Sidebar({ agents, onToggleAgent, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={`bg-white border-r border-gray-200 transition-all duration-300 ${
      isCollapsed ? 'w-16' : 'w-80'
    }`}>
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className={`font-semibold ${isCollapsed ? 'hidden' : 'block'}`}>Board Members</h2>
        <button
          onClick={onToggleCollapse}
          className="p-2 hover:bg-gray-100 rounded-lg"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      <div className="p-4">
        {agents.map((agent) => (
          <div
            key={agent.id}
            className={`mb-4 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}
          >
            <div className="flex items-center">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${agent.color}20` }}
              >
                {React.createElement(agent.avatar, {
                  size: 20,
                  color: agent.color,
                })}
              </div>
              {!isCollapsed && (
                <div className="ml-3">
                  <div className="font-medium">{agent.role}</div>
                  <div className="text-sm text-gray-500">{agent.description}</div>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Switch
                checked={agent.isActive}
                onChange={() => onToggleAgent(agent.id)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}