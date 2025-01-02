const PERPLEXITY_API_KEY = import.meta.env.VITE_PERPLEXITY_API_KEY;

if (!PERPLEXITY_API_KEY) {
  throw new Error('Missing Perplexity API key');
}

interface PerplexityResponse {
  id: string;
  model: string;
  created: number;
  choices: {
    message: {
      content: string;
    };
    index: number;
    finish_reason: string;
  }[];
}

// Test the Perplexity connection
(async () => {
  try {
    const test = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'pplx-7b-online',
        messages: [{ role: 'system', content: 'Test connection' }]
      })
    });
    if (test.ok) {
      console.log('Perplexity connection successful');
    } else {
      console.error('Perplexity connection failed:', await test.text());
    }
  } catch (error) {
    console.error('Perplexity connection error:', error);
  }
})();

export async function searchWithPerplexity(query: string): Promise<string> {
  try {
    console.log('Searching with query:', query); // Debug log

    const response = await fetch('https://api.perplexity.ai/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${PERPLEXITY_API_KEY}`
      },
      body: JSON.stringify({
        model: 'pplx-7b-online',
        messages: [
          {
            role: 'system',
            content: 'You are a research assistant specializing in technology and software development. You have extensive knowledge of developer tools, AI platforms, and software engineering practices. Provide accurate, up-to-date information with a focus on technical details and practical applications.'
          },
          {
            role: 'user',
            content: `Please research and provide detailed information about: ${query}`
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Perplexity API error details:', errorText); // Debug log
      throw new Error(`Perplexity API error: ${response.statusText}. Details: ${errorText}`);
    }

    const data: PerplexityResponse = await response.json();
    console.log('Perplexity response:', data); // Debug log

    return data.choices[0]?.message?.content || 'No results found.';
  } catch (error) {
    console.error('Error searching with Perplexity:', error);
    throw error;
  }
} 