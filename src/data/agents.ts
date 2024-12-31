import { Agent } from '../types/agent';
import { Brain, Code2, Palette, LineChart, UserCog } from 'lucide-react';

export const agents: Agent[] = [
  {
    id: 'ceo',
    role: 'CEO',
    description: 'Strategic vision and decision making',
    color: '#3B82F6',
    avatar: Brain,
    isActive: true
  },
  {
    id: 'developer',
    role: 'Developer',
    description: 'Technical implementation and architecture',
    color: '#10B981',
    avatar: Code2,
    isActive: true
  },
  {
    id: 'designer',
    role: 'Brand Strategist',
    description: 'Visual identity and user experience',
    color: '#EC4899',
    avatar: Palette,
    isActive: true
  },
  {
    id: 'analyst',
    role: 'Data Analyst',
    description: 'Metrics and performance insights',
    color: '#8B5CF6',
    avatar: LineChart,
    isActive: true
  },
  {
    id: 'moderator',
    role: 'Moderator',
    description: 'Discussion facilitation and summaries',
    color: '#6B7280',
    avatar: UserCog,
    isActive: true
  }
];