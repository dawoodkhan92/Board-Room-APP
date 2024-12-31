import { useState } from 'react';
import { Agent, defaultAgents } from '../data/agents';

export function useAgents() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents);

  const toggleAgent = (agentId: string) => {
    setAgents((currentAgents: Agent[]) => 
      currentAgents.map((agent: Agent) => 
        agent.id === agentId 
          ? { ...agent, isActive: !agent.isActive }
          : agent
      )
    );
  };

  const getActiveAgents = () => {
    return agents.filter((agent: Agent) => agent.isActive);
  };

  return {
    agents,
    toggleAgent,
    getActiveAgents
  };
}