// Application constants
export const APP_NAME = 'Contract Risk Analyzer';
export const APP_DESCRIPTION = 'AI-powered contract analysis tool to detect hidden risks';

// Firebase collection names
export const COLLECTIONS = {
  USERS: 'users',
  ANALYSES: 'analyses',
  CONTRACTS: 'contracts'
};

// Clause categories
export const CLAUSE_CATEGORIES = {
  AUTO_RENEWALS: 'Auto-Renewals',
  DATA_PRIVACY: 'Data Privacy / Data Selling',
  CANCELLATION_FEES: 'Cancellation Fees or Penalties',
  UNILATERAL_CHANGES: 'Unilateral Changes',
  ARBITRATION: 'Arbitration / No Class Action',
  LIABILITY_LIMITS: 'Limitation of Liability',
  JURISDICTION: 'Jurisdiction & Governing Law'
};

// Risk levels
export const RISK_LEVELS = {
  HIGH: 'High',
  MEDIUM: 'Medium',
  LOW: 'Low',
  VERY_LOW: 'Very Low'
};

// Error messages
export const ERROR_MESSAGES = {
  AUTH_FAILED: 'Authentication failed. Please try again.',
  NETWORK_ERROR: 'Network error. Please check your connection.',
  INVALID_INPUT: 'Please provide valid contract text or URL.',
  ANALYSIS_FAILED: 'Analysis failed. Please try again.',
  NO_TEXT_PROVIDED: 'Please enter contract text or provide a URL to analyze.',
  URL_INVALID: 'Please provide a valid URL.'
};

// Success messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: 'Successfully logged in!',
  SIGNUP_SUCCESS: 'Account created successfully!',
  ANALYSIS_COMPLETE: 'Contract analysis completed successfully!',
  NO_RISKS_FOUND: 'No risky clauses detected in this contract.'
};

// UI Messages
export const UI_MESSAGES = {
  ANALYZING: '🔍 Analyzing contract...',
  LOADING: 'Loading...',
  NO_RESULTS: 'No analysis results yet.',
  WELCOME_MESSAGE: 'Welcome to Contract Risk Analyzer! Paste contract text or provide a URL to get started.'
};
