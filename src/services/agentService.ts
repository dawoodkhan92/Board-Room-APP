import { Agent } from '../data/agents';
import { openai, AGENT_PROMPTS } from '../lib/openai';
import { supabase } from '../lib/supabase';

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  agentId?: string;
}

// Simple function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2);

export class AgentService {
  // Get a response from an AI agent
  static async getAgentResponse(message: string, activeAgents: Agent[]): Promise<Message> {
    if (activeAgents.length === 0) {
      throw new Error('No active agents available');
    }

    // Randomly select an agent (in a real app, you might want to be more strategic)
    const randomAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
    
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: AGENT_PROMPTS[randomAgent.id as keyof typeof AGENT_PROMPTS]
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      const response = completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
      
      const agentMessage: Message = {
        id: generateId(),
        content: response,
        sender: randomAgent.name,
        timestamp: new Date(),
        agentId: randomAgent.id
      };

      // Store message in Supabase (you'll need to handle session_id in a real app)
      await supabase.from('messages').insert({
        content: response,
        sender: randomAgent.name,
        agent_id: randomAgent.id,
        session_id: 'default', // In a real app, you'd get this from the session context
        created_at: new Date().toISOString()
      });

      return agentMessage;
    } catch (error) {
      console.error('Error getting AI response:', error);
      throw error;
    }
  }

  // Generates a meeting summary using GPT-4
  static async generateSummary(messages: Message[]): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are a meeting summarizer. Create a concise summary of the key points discussed."
          },
          {
            role: "user",
            content: messages.map(m => `${m.sender}: ${m.content}`).join('\n')
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      });

      return completion.choices[0]?.message?.content || "Unable to generate summary.";
    } catch (error) {
      console.error('Error generating summary:', error);
      return "Error generating summary.";
    }
  }

  // Generates action items from the conversation
  static async generateActionItems(messages: Message[]): Promise<string[]> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Extract clear, actionable items from the conversation. Return them as a bulleted list."
          },
          {
            role: "user",
            content: messages.map(m => `${m.sender}: ${m.content}`).join('\n')
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      });

      const response = completion.choices[0]?.message?.content || "";
      return response.split('\n').filter(item => item.trim().length > 0);
    } catch (error) {
      console.error('Error generating action items:', error);
      return ["Error generating action items."];
    }
  }
} 