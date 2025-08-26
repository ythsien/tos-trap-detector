// AI Service for Contract Risk Analysis
// Handles communication with AI providers for comprehensive clause detection

export class AIService {
    constructor() {
      this.apiKey = this.getApiKey();
      this.baseURL = 'https://api.openai.com/v1/chat/completions';
      this.defaultModel = 'gpt-4o-mini';
      this._requestQueue = Promise.resolve();
    }
  
    getApiKey() {
      let apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      if (!apiKey || apiKey === 'your_openai_api_key_here') {
        apiKey = localStorage.getItem('openai_api_key');
      }
      return apiKey;
    }
  
    updateApiKey(apiKey) {
      this.apiKey = apiKey;
      console.log('API key updated:', !!apiKey);
    }
  
    isConfigured() {
      const apiKey = this.getApiKey();
      return apiKey && apiKey.trim() !== '' && apiKey !== 'your_openai_api_key_here';
    }
  
    async analyzeContract(contractText) {
      try {
        console.log('Starting AI analysis...');
        console.log('API Key configured:', this.isConfigured());
        
        const prompt = this.createAnalysisPrompt(contractText);
        
        try {
          const response = await this.enqueue(() => this.callAIWithRetry(prompt));
          return this.parseAIResponse(response, prompt);
        } catch (error) {
          // Surface rate limit errors directly so the UI can show an error message
          if (error.message.includes('Rate limit exceeded') || 
              error.message.includes('429') ||
              error.message.includes('Too Many Requests')) {
            console.warn('Rate limits persist after all retries');
            throw new Error('OpenAI rate limit reached. Please wait and try again.');
          }
          throw error;
        }
      } catch (error) {
        console.error('AI analysis failed:', error);
        throw new Error('AI analysis failed: ' + error.message);
      }
    }
    
    enqueue(taskFn) {
      const run = this._requestQueue.then(async () => {
        return await taskFn();
      });
      this._requestQueue = run.catch(() => {});
      return run;
    }
  
    createAnalysisPrompt(contractText) {
      return `You are a legal language analyst. Analyze the provided Terms text and detect clauses that could be harmful, misleading, or expensive for the user.

Categories to detect (non-exhaustive): Auto-Renewals; Data Privacy / Data Selling; Cancellation Fees or Penalties; Unilateral Changes; Arbitration / No Class Action; Limitation of Liability; Jurisdiction & Governing Law.

Rules:
- Return ONLY valid JSON. No prose before or after.
- Include up to 10 clauses if present (not just one).
- For each clause, the field "snippet" MUST be a verbatim substring copied from the provided contract text. Prefer a single sentence or the smallest span (<= 240 chars) that evidences the clause.
- Keep summaries concise (<= 2 sentences). Risk: Low/Medium/High.

JSON schema:
{
  "clauses": [
    {
      "category": "Auto-Renewals | Data Privacy / Data Selling | Cancellation Fees or Penalties | Unilateral Changes | Arbitration / No Class Action | Limitation of Liability | Jurisdiction & Governing Law",
      "emoji": "🚨",
      "summary": "Plain English summary",
      "risk": "Low|Medium|High",
      "whyItMatters": "Brief reason",
      "snippet": "verbatim substring from the input"
    }
  ],
  "overallRisk": "Low|Medium|High",
  "totalClauses": 0,
  "summary": "Overall assessment"
}

Contract Text to Analyze:
${contractText}`;
    }
    // Enhanced retry logic with Retry-After awareness, jitter and exponential backoff
    async callAIWithRetry(prompt, maxRetries = 5, baseDelayMs = 1000) {
      for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
          return await this.callAI(prompt);
        } catch (err) {
          const isRateLimit = err.message.includes('Rate limit exceeded') || 
                             err.message.includes('429') ||
                             err.message.includes('Too Many Requests');
          
          if (isRateLimit && attempt < maxRetries) {
            const retryAfterMs = typeof err.retryAfterMs === 'number' && err.retryAfterMs > 0
              ? err.retryAfterMs
              : baseDelayMs * Math.pow(2, attempt - 1);
            const jitterMs = Math.floor(Math.random() * 250);
            const delayMs = retryAfterMs + jitterMs;
            console.warn(`Rate limit hit, retrying in ${delayMs}ms (attempt ${attempt}/${maxRetries})`);
            await new Promise(r => setTimeout(r, delayMs));
          } else {
            // If it's not a rate limit error or we've exhausted retries, throw the error
            throw err;
          }
        }
      }
    }
  
    async callAI(prompt) {
      this.apiKey = this.getApiKey();
  
      if (!this.isConfigured()) {
        throw new Error('OpenAI API key not configured');
      }
  
      const tryModel = async (modelName) => {
        console.log(`Calling OpenAI API with model: ${modelName}`);
        const response = await fetch(this.baseURL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`
          },
          body: JSON.stringify({
            model: modelName,
            messages: [
              { role: 'system', content: 'You are a legal analysis expert specializing in consumer protection. Provide responses in valid JSON format only.' },
              { role: 'user', content: prompt }
            ],
            temperature: 0.3,
            max_tokens: 1000
          })
        });
  
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          const errorMessage = errorData.error?.message || 'Unknown error';
          
          if (response.status === 404 || response.status === 403) {
            throw { type: 'MODEL_NOT_FOUND', originalError: errorData };
          } else if (response.status === 401) {
            throw new Error('Invalid API key');
          } else if (response.status === 429) {
            // Enhanced rate limit error with more details
            const retryAfter = response.headers.get('Retry-After');
            const retryInfo = retryAfter ? ` (retry after ${retryAfter}s)` : '';
            const e = new Error(`Rate limit exceeded${retryInfo}`);
            const retryAfterSeconds = retryAfter ? Number(retryAfter) : undefined;
            if (!Number.isNaN(retryAfterSeconds) && retryAfterSeconds > 0) {
              e.retryAfterMs = Math.floor(retryAfterSeconds * 1000);
            }
            throw e;
          } else if (response.status === 400) {
            throw new Error(`Invalid request: ${errorMessage}`);
          } else {
            throw new Error(`API error: ${response.status} - ${errorMessage}`);
          }
        }
  
        const data = await response.json();
        return data.choices[0].message.content;
      };
  
      try {
        // Try the default model first
        return await tryModel(this.defaultModel);
      } catch (err) {
        if (err.type === 'MODEL_NOT_FOUND') {
          throw new Error(`${this.defaultModel} is not available for this API key`);
        } else {
          throw err;
        }
      }
    }
  
    parseAIResponse(aiResponse, originalPrompt) {
      try {
        const jsonString = this.extractJsonString(aiResponse);
        const parsed = JSON.parse(jsonString);
        if (!parsed.clauses || !Array.isArray(parsed.clauses)) {
          return this.parseTextResponse(aiResponse);
        }
        // Attempt to ensure snippet presence by deriving from contract text when possible
        let contractText = '';
        if (typeof originalPrompt === 'string') {
          const marker = 'Contract Text to Analyze:\n';
          const idx = originalPrompt.indexOf(marker);
          if (idx !== -1) {
            contractText = originalPrompt.substring(idx + marker.length);
          }
        }
        if (contractText) {
          parsed.clauses = parsed.clauses.map((c) => {
            if (!c || typeof c !== 'object') return c;
            const hasSnippet = typeof c.snippet === 'string' && c.snippet.trim().length > 0 && contractText.includes(c.snippet.trim());
            if (!hasSnippet) {
              const inferred = this.inferSnippet(contractText, c.category);
              if (inferred) {
                c.snippet = inferred;
              }
            }
            return c;
          });
        }
        return {
          success: true,
          clauses: parsed.clauses || [],
          overallRisk: parsed.overallRisk || 'Low',
          totalClauses: parsed.totalClauses || parsed.clauses.length || 0,
          summary: parsed.summary || 'Analysis completed',
          rawResponse: aiResponse,
          isRealAI: this.isConfigured()
        };
      } catch {
        return this.parseTextResponse(aiResponse);
      }
    }

    extractJsonString(raw) {
      if (typeof raw !== 'string') return '{}';
      // Fast path
      try { JSON.parse(raw); return raw; } catch {}
      const first = raw.indexOf('{');
      const last = raw.lastIndexOf('}');
      if (first !== -1 && last !== -1 && last > first) {
        const slice = raw.substring(first, last + 1);
        try { JSON.parse(slice); return slice; } catch {}
      }
      return '{}';
    }

    inferSnippet(contractText, category) {
      if (!contractText || !category) return '';
      const lcText = contractText;
      const sentences = lcText.split(/(?<=[.!?])\s+/);
      const keyMap = {
        'Auto-Renewals': ['auto-renew', 'automatic renewal', 'renews automatically', 'renewal date', 'cancel before'],
        'Data Privacy / Data Selling': ['share your data', 'sell your data', 'third parties', 'marketing partners', 'affiliates', 'personal data'],
        'Cancellation Fees or Penalties': ['cancellation fee', 'early termination fee', 'penalty', 'forfeit', 'non-refundable'],
        'Unilateral Changes': ['we reserve the right to modify', 'change these terms', 'at any time without', 'amend', 'modify at our discretion'],
        'Arbitration / No Class Action': ['arbitration', 'class action', 'jury trial waiver', 'binding arbitration', 'dispute resolution'],
        'Limitation of Liability': ['limitation of liability', 'not liable', 'no liability', 'indirect', 'consequential', 'punitive damages'],
        'Jurisdiction & Governing Law': ['governing law', 'jurisdiction', 'venue', 'courts of', 'state of']
      };
      const keys = keyMap[category] || [];
      for (const s of sentences) {
        for (const k of keys) {
          if (s.toLowerCase().includes(k)) {
            return s.length <= 240 ? s : s.slice(0, 237) + '...';
          }
        }
      }
      // Fallback: return first 200 chars
      return contractText.slice(0, 200);
    }
  
    parseTextResponse(textResponse) {
      const results = {
        success: true,
        clauses: [],
        overallRisk: 'Low',
        totalClauses: 0,
        summary: 'Analysis completed (text parsing)',
        rawResponse: textResponse,
        isRealAI: this.isConfigured()
      };
  
      return results;
    }
  
    // Simulated response removed by user request; callers should handle thrown errors instead
  }