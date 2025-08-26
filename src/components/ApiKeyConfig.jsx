import { useState, useEffect } from 'react';

export const ApiKeyConfig = ({ onApiKeySet }) => {
  const [apiKey, setApiKey] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLocked, setIsLocked] = useState(true);

  // Prefill with anonymized stored key if available
  useEffect(() => {
    const stored = localStorage.getItem('openai_api_key');
    if (stored && stored.length > 8) {
      const masked = `${stored.slice(0, 3)}****************${stored.slice(-4)}`;
      setApiKey(masked);
      setIsLocked(true);
    } else if (stored) {
      setApiKey('********');
      setIsLocked(true);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // If field is locked, clicking primary button acts as Test Connection
      if (isLocked) {
        await handleTestConnection();
        return;
      }
      // Store the API key in localStorage (for demo purposes)
      localStorage.setItem('openai_api_key', apiKey);
      
      // Update environment variable for current session
      import.meta.env.VITE_OPENAI_API_KEY = apiKey;
      
      // Notify parent component
      onApiKeySet(apiKey);
      setIsVisible(false);
      
      // Clear the input
      const masked = `${apiKey.slice(0, 3)}****************${apiKey.slice(-4)}`;
      setApiKey(masked);
      setIsLocked(true);
    } catch (error) {
      console.error('Failed to set API key:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestConnection = async () => {
    const stored = localStorage.getItem('openai_api_key');
    const keyToTest = isLocked ? stored : apiKey;
    if (!keyToTest) return;
    
    setIsLoading(true);
    try {
      const response = await fetch('https://api.openai.com/v1/models', {
        headers: {
          'Authorization': `Bearer ${keyToTest}`
        }
      });
      
      if (response.ok) {
        alert('✅ API key is valid!');
      } else {
        alert('❌ Invalid API key. Please check your key and try again.');
      }
    } catch (error) {
      alert('❌ Connection failed. Please check your internet connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold text-blue-800">OpenAI API Configuration</h3>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="text-blue-600 hover:text-blue-800 text-sm"
        >
          {isVisible ? 'Hide' : 'Configure'}
        </button>
      </div>
      
      {isVisible && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-blue-700 mb-1">
              OpenAI API Key
            </label>
            <input
              type={isLocked ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="sk-..."
              disabled={isLocked}
              className="w-full px-3 py-2 border border-blue-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
            />
          </div>
          
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isLoading}
              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {isLocked ? (isLoading ? 'Testing...' : 'Test Connection') : (isLoading ? 'Setting...' : 'Set API Key')}
            </button>
            
            <button
              type="button"
              onClick={() => setIsLocked(!isLocked)}
              className="px-3 py-1 bg-gray-200 text-gray-800 text-xs rounded hover:bg-gray-300"
            >
              {isLocked ? 'Edit' : 'Cancel'}
            </button>
          </div>
          
          <p className="text-xs text-blue-600">
            💡 Get your API key from{' '}
            <a 
              href="https://platform.openai.com/api-keys" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-blue-800"
            >
              OpenAI Platform
            </a>
          </p>
        </form>
      )}
      
      {!isVisible && (
        <p className="text-xs text-blue-600">
          Configure your OpenAI API key to use real AI analysis instead of simulated responses.
        </p>
      )}
    </div>
  );
};
