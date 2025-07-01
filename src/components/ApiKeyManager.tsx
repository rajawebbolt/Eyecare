import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, AlertTriangle, CheckCircle, Settings } from 'lucide-react';

interface ApiKeyManagerProps {
  onApiKeyChange: (apiKey: string) => void;
  className?: string;
}

const ApiKeyManager: React.FC<ApiKeyManagerProps> = ({ onApiKeyChange, className = '' }) => {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const [hasKey, setHasKey] = useState(false);

  useEffect(() => {
    // Check if there's a stored API key
    const storedKey = localStorage.getItem('perplexity_api_key');
    if (storedKey) {
      setApiKey(storedKey);
      setHasKey(true);
      validateApiKey(storedKey);
      onApiKeyChange(storedKey);
    }
  }, [onApiKeyChange]);

  const validateApiKey = (key: string) => {
    // Perplexity API keys start with 'pplx-' and are followed by alphanumeric characters
    const isValidFormat = /^pplx-[a-zA-Z0-9]{40,}$/.test(key);
    setIsValid(isValidFormat);
    return isValidFormat;
  };

  const handleApiKeyChange = (value: string) => {
    setApiKey(value);
    const valid = validateApiKey(value);
    
    if (valid) {
      localStorage.setItem('perplexity_api_key', value);
      setHasKey(true);
      onApiKeyChange(value);
    } else {
      localStorage.removeItem('perplexity_api_key');
      setHasKey(false);
      onApiKeyChange('');
    }
  };

  const handleClearKey = () => {
    setApiKey('');
    setIsValid(false);
    setHasKey(false);
    localStorage.removeItem('perplexity_api_key');
    onApiKeyChange('');
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`}>
      <div className="p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Key className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">API Key Configuration</h3>
            <p className="text-sm text-gray-600">Enter your personal Perplexity API key to use this service</p>
          </div>
        </div>

        {/* Security Warning */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
            <div className="text-sm">
              <p className="text-amber-800 font-medium mb-1">Security Notice</p>
              <p className="text-amber-700">
                For security reasons, never share your API key with others or expose it in public repositories. 
                Your key is stored locally in your browser and is not transmitted to our servers.
              </p>
            </div>
          </div>
        </div>

        {/* API Key Input */}
        <div className="space-y-4">
          <div>
            <label htmlFor="api-key" className="block text-sm font-medium text-gray-700 mb-2">
              Perplexity API Key
            </label>
            <div className="relative">
              <input
                id="api-key"
                type={showApiKey ? 'text' : 'password'}
                value={apiKey}
                onChange={(e) => handleApiKeyChange(e.target.value)}
                placeholder="pplx-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
                className={`w-full px-4 py-3 pr-20 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                  apiKey ? (isValid ? 'border-green-300' : 'border-red-300') : 'border-gray-300'
                }`}
              />
              <div className="absolute inset-y-0 right-0 flex items-center space-x-1 pr-3">
                {apiKey && (
                  <div className="flex items-center space-x-1">
                    {isValid ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => setShowApiKey(!showApiKey)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showApiKey ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            {apiKey && !isValid && (
              <p className="mt-1 text-sm text-red-600">
                Invalid API key format. Keys should start with 'pplx-' followed by alphanumeric characters.
              </p>
            )}
            {isValid && (
              <p className="mt-1 text-sm text-green-600">
                ✓ Valid API key format detected
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <a
                href="https://docs.perplexity.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
              >
                Get your API key →
              </a>
              <a
                href="https://docs.perplexity.ai/docs/getting-started"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
              >
                Documentation
              </a>
            </div>
            {hasKey && (
              <button
                onClick={handleClearKey}
                className="text-sm text-red-600 hover:text-red-800 transition-colors"
              >
                Clear Key
              </button>
            )}
          </div>
        </div>

        {/* Status */}
        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4 text-gray-500" />
            <span className="text-sm text-gray-600">
              Status: {hasKey && isValid ? (
                <span className="text-green-600 font-medium">Connected</span>
              ) : (
                <span className="text-gray-500">Not configured</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiKeyManager;