export interface Agent {
  id: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  isActive: boolean;
}

export const defaultAgents: Agent[] = [
  {
    id: "facilitator",
    name: "Alex",
    role: "Meeting Facilitator",
    description: "Guides the discussion and ensures everyone stays on track",
    avatar: "👨‍💼",
    isActive: true
  },
  {
    id: "tech_expert",
    name: "Taylor",
    role: "Technical Expert",
    description: "Provides technical insights and solutions",
    avatar: "👩‍💻",
    isActive: true
  },
  {
    id: "analyst",
    name: "Jordan",
    role: "Business Analyst",
    description: "Analyzes business impact and requirements",
    avatar: "📊",
    isActive: true
  },
  {
    id: "creative",
    name: "Sam",
    role: "Creative Director",
    description: "Offers creative and design-focused perspectives",
    avatar: "🎨",
    isActive: false
  }
];