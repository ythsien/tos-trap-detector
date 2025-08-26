// Contract Risk Analysis Service
// This service handles the analysis of Terms of Service and consumer contracts

import { AIService } from './aiService.js';

export class AnalysisService {
  constructor() {
    this.aiService = new AIService();
  }

  /**
   * Analyze contract text for harmful clauses using AI
   * @param {string} contractText - The contract text to analyze
   * @returns {Promise<Object>} Comprehensive analysis results
   */
  static async analyzeContract(contractText) {
    try {
      const analysisService = new AnalysisService();
      const results = await analysisService.aiService.analyzeContract(contractText);
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        inputLength: contractText.length,
        analysis: results,
        summary: analysisService.generateSummary(results)
      };
    } catch (error) {
      throw new Error('Analysis failed: ' + error.message);
    }
  }

  /**
   * Analyze contract from URL
   * @param {string} url - The URL of the contract page
   * @returns {Promise<Object>} Analysis results
   */
  static async analyzeContractFromURL(url) {
    try {
      const contractText = await AnalysisService.scrapeContractFromURL(url);
      return await AnalysisService.analyzeContract(contractText);
    } catch (error) {
      throw new Error('URL analysis failed: ' + error.message);
    }
  }

  /**
   * Scrape contract text from a URL
   * @param {string} url - The URL to scrape
   * @returns {Promise<string>} Extracted contract text
   */
  static async scrapeContractFromURL(url) {
    if (!url || typeof url !== 'string') {
      throw new Error('Invalid URL');
    }
    // Normalize URL and route via a CORS-friendly content reader (read-only)
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    const encoded = encodeURI(normalized);
    // Jina reader returns cleaned text/markdown for most public pages
    const readerUrl = `https://r.jina.ai/${encoded}`;
    const resp = await fetch(readerUrl, { method: 'GET' });
    if (!resp.ok) {
      throw new Error(`Failed to fetch page content (${resp.status})`);
    }
    const pageText = await resp.text();
    const cleaned = AnalysisService.cleanExtractedText(pageText);
    if (!cleaned || cleaned.trim().length < 80) {
      throw new Error('Could not extract meaningful text from the URL');
    }
    // Limit to a reasonable size for token budget
    return cleaned.slice(0, 25000);
  }

  static cleanExtractedText(text) {
    if (!text) return '';
    return text
      .replace(/\r/g, '')
      .replace(/\t/g, ' ')
      .replace(/\n{3,}/g, '\n\n')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  /**
   * Generate a summary of the analysis results
   * @param {Object} results - Analysis results from AI
   * @returns {Object} Summary information
   */
  generateSummary(results) {
    const totalClauses = results.clauses?.length || 0;
    const highRiskClauses = results.clauses?.filter(clause => clause.risk === 'High').length || 0;
    const mediumRiskClauses = results.clauses?.filter(clause => clause.risk === 'Medium').length || 0;
    const lowRiskClauses = results.clauses?.filter(clause => clause.risk === 'Low').length || 0;

    // Categorize clauses by type
    const clauseCategories = {
      autoRenewals: results.clauses?.filter(c => c.category === 'Auto-Renewals').length || 0,
      dataPrivacy: results.clauses?.filter(c => c.category === 'Data Privacy / Data Selling').length || 0,
      cancellationFees: results.clauses?.filter(c => c.category === 'Cancellation Fees or Penalties').length || 0,
      unilateralChanges: results.clauses?.filter(c => c.category === 'Unilateral Changes').length || 0,
      arbitration: results.clauses?.filter(c => c.category === 'Arbitration / No Class Action').length || 0,
      liabilityLimits: results.clauses?.filter(c => c.category === 'Limitation of Liability').length || 0,
      jurisdiction: results.clauses?.filter(c => c.category === 'Jurisdiction & Governing Law').length || 0
    };

    return {
      totalClauses,
      highRiskClauses,
      mediumRiskClauses,
      lowRiskClauses,
      overallRisk: results.overallRisk || 'Low',
      clauseCategories,
      hasRiskyClauses: totalClauses > 0,
      riskLevel: this.calculateRiskLevel(highRiskClauses, mediumRiskClauses, lowRiskClauses)
    };
  }

  /**
   * Calculate overall risk level based on clause counts
   * @param {number} highRisk - Number of high risk clauses
   * @param {number} mediumRisk - Number of medium risk clauses
   * @param {number} lowRisk - Number of low risk clauses
   * @returns {string} Risk level
   */
  calculateRiskLevel(highRisk, mediumRisk, lowRisk) {
    if (highRisk > 0) return 'High';
    if (mediumRisk > 1) return 'Medium';
    if (mediumRisk > 0 || lowRisk > 2) return 'Low';
    return 'Very Low';
  }

  /**
   * Get risk level color for UI display
   * @param {string} risk - Risk level (Low/Medium/High)
   * @returns {string} CSS color class
   */
  static getRiskColor(risk) {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'text-red-800 bg-red-100 border-red-200';
      case 'medium':
        return 'text-yellow-800 bg-yellow-100 border-yellow-200';
      case 'low':
        return 'text-green-800 bg-green-100 border-green-200';
      case 'very low':
        return 'text-blue-800 bg-blue-100 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  }

  // Risk chip classes for small colored badges
  static getRiskChipClasses(risk) {
    switch (risk.toLowerCase()) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      case 'very low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  }

  /**
   * Get risk level icon for UI display
   * @param {string} risk - Risk level (Low/Medium/High)
   * @returns {string} Icon emoji
   */
  static getRiskIcon(risk) {
    switch (risk.toLowerCase()) {
      case 'high':
        return '🚨';
      case 'medium':
        return '⚠️';
      case 'low':
        return '✅';
      case 'very low':
        return '🟢';
      default:
        return 'ℹ️';
    }
  }

  /**
   * Get category icon for UI display
   * @param {string} category - Clause category
   * @returns {string} Icon emoji
   */
  static getCategoryIcon(category) {
    const icons = {
      'Auto-Renewals': '🔄',
      'Data Privacy / Data Selling': '🔒',
      'Cancellation Fees or Penalties': '💰',
      'Unilateral Changes': '📝',
      'Arbitration / No Class Action': '⚖️',
      'Limitation of Liability': '🛡️',
      'Jurisdiction & Governing Law': '🌍'
    };
    return icons[category] || '📋';
  }
}
