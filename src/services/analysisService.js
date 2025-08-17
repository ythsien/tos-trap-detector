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
      // TODO: Implement web scraping to extract contract text from URL
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
    // TODO: Implement web scraping
    // For now, return a placeholder
    return `Contract text extracted from ${url}. This is a placeholder for web scraping functionality.`;
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
        return 'text-red-600 bg-red-50 border-red-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'low':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'very low':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
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
