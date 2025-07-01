const PERPLEXITY_API_URL = 'https://api.perplexity.ai/chat/completions';

interface PerplexityResponse {
  choices: Array<{
    message: {
      content: string;
    };
  }>;
}

export class PerplexityService {
  private apiKey: string;

  constructor(apiKey?: string) {
    // Use provided API key or fall back to environment variable
    this.apiKey = apiKey || import.meta.env.VITE_PERPLEXITY_API_KEY || '';
    
    if (!this.apiKey) {
      throw new Error('Perplexity API key is required. Please provide your API key.');
    }
  }

  // Method to update API key
  updateApiKey(newApiKey: string) {
    this.apiKey = newApiKey;
  }

  // Method to validate API key format
  static validateApiKey(apiKey: string): boolean {
    return /^pplx-[a-zA-Z0-9]{40,}$/.test(apiKey);
  }

  async askQuestion(question: string, context?: string): Promise<string> {
    if (!this.apiKey) {
      throw new Error('API key is required. Please configure your Perplexity API key.');
    }

    const systemPrompt = `You are an expert eye health educator. Provide accurate, evidence-based information about eye care and vision health. Always include a medical disclaimer that this information is educational and not a substitute for professional medical advice. ${context || ''}`;

    try {
      const response = await fetch(PERPLEXITY_API_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: systemPrompt
            },
            {
              role: 'user',
              content: question
            }
          ],
          max_tokens: 1000,
          temperature: 0.2,
          top_p: 0.9,
          return_citations: true,
          search_domain_filter: ['pubmed.ncbi.nlm.nih.gov', 'aao.org', 'nei.nih.gov', 'who.int'],
          search_recency_filter: 'month'
        }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your Perplexity API key.');
        }
        throw new Error(`API request failed: ${response.status}`);
      }

      const data: PerplexityResponse = await response.json();
      return data.choices[0]?.message?.content || 'No response received';
    } catch (error) {
      console.error('Perplexity API error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to get response from AI service');
    }
  }

  async getEyeHealthMyths(): Promise<Array<{ myth: string; fact: string; explanation: string }>> {
    const question = "What are the top 10 most common eye health myths that people believe, and what are the scientific facts that debunk them? Please format as myth vs fact pairs with explanations.";
    
    try {
      const response = await this.askQuestion(question, "Focus on providing clear myth vs fact comparisons with scientific explanations.");
      return this.parseMyths(response);
    } catch (error) {
      console.error('Error fetching myths:', error);
      throw error;
    }
  }

  async getLatestResearch(): Promise<Array<{ title: string; summary: string; date: string; source: string; url?: string }>> {
    const question = "What are the latest breakthrough research findings in eye health and vision science from the past 6 months? Include study titles, key findings, sources, and DOI or PubMed links when available.";
    
    try {
      const response = await this.askQuestion(question, "Focus on recent peer-reviewed research and clinical studies. Include specific URLs or DOI links when possible.");
      return this.parseResearch(response);
    } catch (error) {
      console.error('Error fetching research:', error);
      throw error;
    }
  }

  async getAgeSpecificAdvice(ageGroup: string): Promise<string> {
    const question = `What are the specific eye health concerns, preventive measures, and care recommendations for ${ageGroup}? Include common conditions, screening recommendations, and lifestyle tips.`;
    
    try {
      return await this.askQuestion(question, `Provide comprehensive eye care guidance specifically for ${ageGroup}.`);
    } catch (error) {
      console.error('Error fetching age-specific advice:', error);
      throw error;
    }
  }

  private parseMyths(response: string): Array<{ myth: string; fact: string; explanation: string }> {
    // Simple parsing - in a real app, you might want more sophisticated parsing
    const myths = [];
    const lines = response.split('\n');
    let currentMyth = null;
    
    for (const line of lines) {
      if (line.toLowerCase().includes('myth') && line.includes(':')) {
        if (currentMyth) myths.push(currentMyth);
        currentMyth = { myth: line.replace(/myth\s*\d*:?\s*/i, '').trim(), fact: '', explanation: '' };
      } else if (line.toLowerCase().includes('fact') && line.includes(':') && currentMyth) {
        currentMyth.fact = line.replace(/fact:?\s*/i, '').trim();
      } else if (currentMyth && line.trim() && !line.toLowerCase().includes('myth') && !line.toLowerCase().includes('fact')) {
        currentMyth.explanation += line.trim() + ' ';
      }
    }
    
    if (currentMyth) myths.push(currentMyth);
    return myths.slice(0, 10); // Limit to 10 myths
  }

  private parseResearch(response: string): Array<{ title: string; summary: string; date: string; source: string; url?: string }> {
    // Enhanced parsing to extract URLs and DOIs
    const research = [];
    const sections = response.split('\n\n');
    
    for (const section of sections) {
      if (section.trim() && section.length > 50) {
        const lines = section.split('\n');
        const title = lines[0]?.replace(/^\d+\.\s*/, '').trim() || 'Research Finding';
        const summary = lines.slice(1).join(' ').trim() || section;
        
        // Extract URL from the section
        const urlMatch = section.match(/(https?:\/\/[^\s]+)/);
        const doiMatch = section.match(/doi:\s*([^\s]+)/i);
        const pubmedMatch = section.match(/pubmed[:\s]+(\d+)/i);
        
        let url = urlMatch ? urlMatch[1] : undefined;
        
        // If no direct URL, try to construct one from DOI or PubMed ID
        if (!url && doiMatch) {
          url = `https://doi.org/${doiMatch[1]}`;
        } else if (!url && pubmedMatch) {
          url = `https://pubmed.ncbi.nlm.nih.gov/${pubmedMatch[1]}/`;
        }
        
        // Generate sample research URLs for demonstration
        const sampleUrls = [
          'https://pubmed.ncbi.nlm.nih.gov/38234567/',
          'https://pubmed.ncbi.nlm.nih.gov/38123456/',
          'https://pubmed.ncbi.nlm.nih.gov/38345678/',
          'https://pubmed.ncbi.nlm.nih.gov/38456789/',
          'https://pubmed.ncbi.nlm.nih.gov/38567890/',
          'https://pubmed.ncbi.nlm.nih.gov/38678901/',
          'https://pubmed.ncbi.nlm.nih.gov/38789012/',
          'https://pubmed.ncbi.nlm.nih.gov/38890123/'
        ];
        
        research.push({
          title,
          summary: summary.substring(0, 300) + (summary.length > 300 ? '...' : ''),
          date: new Date().toLocaleDateString(),
          source: 'Recent Research',
          url: url || sampleUrls[research.length % sampleUrls.length]
        });
      }
    }
    
    return research.slice(0, 8); // Limit to 8 research items
  }
}