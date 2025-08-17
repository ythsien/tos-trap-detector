// AI Service for Contract Risk Analysis
// Handles communication with AI providers for comprehensive clause detection

export class AIService {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENAI_API_KEY;
    this.baseURL = 'https://api.openai.com/v1/chat/completions';
  }

  /**
   * Check if API key is configured
   * @returns {boolean} True if API key is available
   */
  isConfigured() {
    return this.apiKey && this.apiKey !== 'your_openai_api_key_here' && this.apiKey.trim() !== '';
  }

  /**
   * Analyze contract text using AI to detect harmful clauses
   * @param {string} contractText - The contract text to analyze
   * @returns {Promise<Object>} Structured analysis results
   */
  async analyzeContract(contractText) {
    try {
      console.log('Starting AI analysis...');
      console.log('API Key configured:', this.isConfigured());
      
      const prompt = this.createAnalysisPrompt(contractText);
      const response = await this.callAI(prompt);
      return this.parseAIResponse(response);
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('AI analysis failed: ' + error.message);
    }
  }

  /**
   * Create the comprehensive analysis prompt for the AI
   * @param {string} contractText - The contract text to analyze
   * @returns {string} Formatted prompt
   */
  createAnalysisPrompt(contractText) {
    return `You are a **legal language analyst** specializing in detecting hidden risks in **Terms of Service (ToS)** and **consumer contracts**.  
Your task is to analyze the provided text and **detect clauses that could be harmful, misleading, or expensive for the user**.

## Clauses to Detect

1. **Auto-Renewals**
   - Subscriptions, memberships, or services that renew automatically.
   - User must cancel before a deadline to avoid charges.
   - Cancellation is difficult or allowed only in a narrow window.
   - Renewals happen without explicit re-consent.

2. **Data Privacy / Data Selling**
   - Company may share, sell, or transfer user data to third parties.
   - Data may be used for advertising, profiling, or undisclosed purposes.
   - Data may not be deleted even after account closure.

3. **Cancellation Fees or Penalties**
   - Fees for ending a service early.
   - Charges incurred during cancellation.
   - Forfeiture of unused credits or prepaid fees.

4. **Unilateral Changes**
   - Company reserves the right to change terms, pricing, or policies at any time without user approval.

5. **Arbitration / No Class Action**
   - Users are forced into arbitration instead of court.
   - Users are prohibited from joining class-action lawsuits.

6. **Limitation of Liability**
   - Company disclaims responsibility for damages, losses, or service failures, even if caused by negligence.

7. **Jurisdiction & Governing Law**
   - Users must resolve disputes in a distant or inconvenient legal jurisdiction.

## Output Guidelines

For each detected clause:
- 🚨 **Category & Detection**: Clearly state the type of clause found.
- ✅ **Plain English Summary**: 2–3 sentence explanation of what it means for the user.
- ⚖️ **Risk Rating**: Low / Medium / High.
- 💡 **Why It Matters**: Explain the potential harm or consequence.
- 📜 **Contract Snippet**: Include the original text that triggered detection.

If no relevant clauses are detected, respond with:
"No risky auto-renewals, data sharing, cancellation penalties, or other traps detected in this section."

Please format your response as JSON with this structure:
{
  "clauses": [
    {
      "category": "Auto-Renewals",
      "emoji": "🚨",
      "summary": "Brief description in plain English",
      "risk": "Low/Medium/High",
      "whyItMatters": "Explanation of potential harm",
      "snippet": "Original contract text that triggered detection"
    }
  ],
  "overallRisk": "Low/Medium/High",
  "totalClauses": 0,
  "summary": "Brief overall assessment"
}

Contract Text to Analyze:
${contractText}`;
  }

  /**
   * Call the AI API
   * @param {string} prompt - The analysis prompt
   * @returns {Promise<Object>} AI response
   */
  async callAI(prompt) {
    if (!this.isConfigured()) {
      console.log('Using simulated response (no API key configured)');
      return this.getSimulatedResponse(prompt);
    }

    console.log('Calling OpenAI API...');
    
    try {
      const response = await fetch(this.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [
            {
              role: 'system',
              content: 'You are a legal analysis expert specializing in consumer protection. Provide responses in valid JSON format only.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: 0.3,
          max_tokens: 3000
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('OpenAI API error:', response.status, errorData);
        
        if (response.status === 401) {
          throw new Error('Invalid API key. Please check your OpenAI API key.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        } else if (response.status === 400) {
          throw new Error('Invalid request. Please check your input.');
        } else {
          throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
        }
      }

      const data = await response.json();
      console.log('OpenAI API response received');
      return data.choices[0].message.content;
    } catch (error) {
      console.error('API call failed:', error);
      throw error;
    }
  }

  /**
   * Parse the AI response into structured data
   * @param {string} aiResponse - Raw AI response
   * @returns {Object} Structured analysis results
   */
  parseAIResponse(aiResponse) {
    try {
      console.log('Parsing AI response...');
      // Try to parse as JSON
      const parsed = JSON.parse(aiResponse);
      
      // Validate the response structure
      if (!parsed.clauses || !Array.isArray(parsed.clauses)) {
        console.warn('Invalid response structure, using fallback parsing');
        return this.parseTextResponse(aiResponse);
      }

      console.log('Successfully parsed AI response');
      return {
        success: true,
        clauses: parsed.clauses || [],
        overallRisk: parsed.overallRisk || 'Low',
        totalClauses: parsed.totalClauses || parsed.clauses.length || 0,
        summary: parsed.summary || 'Analysis completed',
        rawResponse: aiResponse,
        isRealAI: this.isConfigured()
      };
    } catch (error) {
      console.warn('JSON parsing failed, using text parsing:', error);
      // If JSON parsing fails, try to extract information from text
      return this.parseTextResponse(aiResponse);
    }
  }

  /**
   * Parse text response when JSON parsing fails
   * @param {string} textResponse - Text response from AI
   * @returns {Object} Structured results
   */
  parseTextResponse(textResponse) {
    console.log('Using text parsing fallback');
    // Fallback parsing logic for text responses
    const results = {
      success: true,
      clauses: [],
      overallRisk: 'Low',
      totalClauses: 0,
      summary: 'Analysis completed (text parsing)',
      rawResponse: textResponse,
      isRealAI: this.isConfigured()
    };

    // Basic text parsing logic (can be enhanced)
    if (textResponse.toLowerCase().includes('auto-renewal') || 
        textResponse.toLowerCase().includes('automatic renewal')) {
      results.clauses.push({
        category: 'Auto-Renewals',
        emoji: '🚨',
        summary: 'Auto-renewal clause detected',
        risk: 'Medium',
        whyItMatters: 'Service may renew automatically without explicit consent',
        snippet: 'Auto-renewal related text found'
      });
    }

    return results;
  }

  /**
   * Get simulated response for development/testing
   * @param {string} prompt - The analysis prompt
   * @returns {Promise<string>} Simulated AI response
   */
  async getSimulatedResponse(prompt) {
    console.log('Generating simulated response...');
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Return simulated analysis results with the new structure
    return JSON.stringify({
      clauses: [
        {
          category: "Auto-Renewals",
          emoji: "🚨",
          summary: "This contract auto-renews every year unless the user cancels at least 30 days in advance.",
          risk: "Medium",
          whyItMatters: "Users who forget to cancel in time may be charged for another year without warning.",
          snippet: "Your subscription will automatically renew unless canceled 30 days before the renewal date..."
        },
        {
          category: "Data Privacy / Data Selling",
          emoji: "🚨",
          summary: "The company reserves the right to share user data with third-party marketing partners.",
          risk: "High",
          whyItMatters: "Your personal data may be used or sold for advertising without further notice.",
          snippet: "We may share your information with our marketing partners and affiliates for commercial purposes..."
        },
        {
          category: "Unilateral Changes",
          emoji: "🚨",
          summary: "The company can change terms and pricing at any time without user approval.",
          risk: "Medium",
          whyItMatters: "You may be subject to new terms or higher prices without warning.",
          snippet: "We reserve the right to modify these terms at any time with or without notice..."
        }
      ],
      overallRisk: "Medium",
      totalClauses: 3,
      summary: "Found 3 potentially harmful clauses including auto-renewals, data sharing, and unilateral changes."
    });
  }
}
