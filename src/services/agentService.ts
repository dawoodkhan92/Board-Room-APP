import { Agent } from '../data/agents';
import { openai, AGENT_PROMPTS } from '../lib/openai';
import { supabase } from '../lib/supabase';
import { searchWithPerplexity } from '../lib/perplexity';

export interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: Date;
  agentId?: string;
  sessionId?: string;
}

// Simple function to generate a random ID
const generateId = () => Math.random().toString(36).substring(2);

export class AgentService {
  private static currentSessionId: string | null = null;

  static async initSession(): Promise<string> {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          title: `Meeting ${new Date().toLocaleString()}`,
          is_active: true
        })
        .select('id')
        .single();

      if (error) throw error;
      this.currentSessionId = data.id;
      return data.id;
    } catch (error) {
      console.error('Error initializing session:', error);
      throw error;
    }
  }

  static async getAgentResponse(message: string, activeAgents: Agent[]): Promise<Message> {
    if (!this.currentSessionId) {
      this.currentSessionId = await this.initSession();
    }

    if (activeAgents.length === 0) {
      throw new Error('No active agents available');
    }

    // Randomly select an agent (in a real app, you might want to be more strategic)
    const randomAgent = activeAgents[Math.floor(Math.random() * activeAgents.length)];
    
    try {
      let response: string;
      console.log('Getting response from agent:', randomAgent.name); // Debug log

      // If this is the research agent, perform a search first
      if (randomAgent.canSearch) {
        console.log('Performing research...'); // Debug log
        try {
          const searchResult = await searchWithPerplexity(message);
          response = await this.getResearchAgentResponse(message, searchResult);
        } catch (searchError) {
          console.error('Research failed, falling back to normal response:', searchError);
          response = await this.getNormalAgentResponse(message, randomAgent.id);
        }
      } else {
        // Check if we need research support
        const needsResearch = await this.checkIfNeedsResearch(message, randomAgent.id);
        console.log('Needs research:', needsResearch); // Debug log
        
        let searchResult = '';
        if (needsResearch && activeAgents.some(a => a.canSearch)) {
          try {
            searchResult = await searchWithPerplexity(message);
          } catch (searchError) {
            console.error('Optional research failed:', searchError);
            // Continue without research data
          }
        }

        response = await this.getNormalAgentResponse(message, randomAgent.id, searchResult);
      }
      
      console.log('Got response:', response); // Debug log

      const agentMessage: Message = {
        id: generateId(),
        content: response,
        sender: randomAgent.name,
        timestamp: new Date(),
        agentId: randomAgent.id,
        sessionId: this.currentSessionId
      };

      // Store message in Supabase
      try {
        const { error } = await supabase.from('messages').insert({
          content: response,
          sender: randomAgent.name,
          agent_id: randomAgent.id,
          session_id: this.currentSessionId,
          created_at: new Date().toISOString()
        });

        if (error) {
          console.error('Supabase error:', error); // Debug log
        }
      } catch (dbError) {
        console.error('Database error:', dbError); // Debug log
        // Continue even if database storage fails
      }

      return agentMessage;
    } catch (error) {
      console.error('Error in getAgentResponse:', error); // Detailed error log
      // Instead of throwing, return a fallback message
      return {
        id: generateId(),
        content: "I apologize, but I encountered an error while processing your request. I'll respond based on my knowledge without external research.",
        sender: randomAgent.name,
        timestamp: new Date(),
        agentId: randomAgent.id,
        sessionId: this.currentSessionId
      };
    }
  }

  // Check if the message needs research support
  private static async checkIfNeedsResearch(message: string, agentId: string): Promise<boolean> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "You are an AI that determines if a message needs additional research or factual information to be answered properly. Respond with 'true' or 'false' only."
          },
          {
            role: "user",
            content: `Given this user message and considering you are a ${agentId}, do you need additional research or factual information to provide a proper response? Message: "${message}"`
          }
        ],
        temperature: 0.3,
        max_tokens: 10
      });

      const response = completion.choices[0]?.message?.content?.toLowerCase() || 'false';
      return response.includes('true');
    } catch (error) {
      console.error('Error in checkIfNeedsResearch:', error); // Debug log
      return false; // Default to no research needed if check fails
    }
  }

  // Get response from research agent
  private static async getResearchAgentResponse(message: string, searchResult: string): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: AGENT_PROMPTS.researcher
          },
          {
            role: "user",
            content: `Search results: ${searchResult}\n\nBased on these search results, please respond to: ${message}`
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    } catch (error) {
      console.error('Error in getResearchAgentResponse:', error); // Debug log
      throw error;
    }
  }

  // Get response from normal agent
  private static async getNormalAgentResponse(message: string, agentId: string, searchResult: string = ''): Promise<string> {
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: AGENT_PROMPTS[agentId as keyof typeof AGENT_PROMPTS]
          },
          {
            role: "user",
            content: searchResult 
              ? `Additional research information: ${searchResult}\n\nUser message: ${message}`
              : message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return completion.choices[0]?.message?.content || "I apologize, but I couldn't generate a response.";
    } catch (error) {
      console.error('Error in getNormalAgentResponse:', error); // Debug log
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