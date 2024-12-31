// API service for handling backend communication
export async function sendMessage(content: string, targetAgents: string[]) {
  // TODO: Replace with actual API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        responses: targetAgents.map(agentId => ({
          id: Math.random().toString(),
          agentId,
          content: `Response from ${agentId}...`,
          timestamp: new Date()
        }))
      });
    }, 1000);
  });
}