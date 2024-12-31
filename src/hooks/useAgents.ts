import { useState } from 'react';
import { Agent } from '../types/agent';
import { agents as initialAgents } from '../data/agents';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>(initialAgents);

  const toggleAgent = (agentId: string) => {
    setAgents(prev =>
      prev.map(agent =>
        agent.id === agentId ? { ...agent, isActive: !agent.isActive } : agent
      )
    );
  };

  const getActiveAgents = () => agents.filter(agent => agent.isActive);

  return {
    agents,
    toggleAgent,
    getActiveAgents
  };
}