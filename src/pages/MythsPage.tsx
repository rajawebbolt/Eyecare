import React, { useState, useEffect } from 'react';
import { Lightbulb, RefreshCw, CheckCircle, XCircle } from 'lucide-react';
import { PerplexityService } from '../services/perplexityApi';
import LoadingSpinner from '../components/LoadingSpinner';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import ApiKeyManager from '../components/ApiKeyManager';

interface Myth {
  myth: string;
  fact: string;
  explanation: string;
}

const MythsPage: React.FC = () => {
  const [myths, setMyths] = useState<Myth[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [apiKey, setApiKey] = useState('');
  const [perplexityService, setPerplexityService] = useState<PerplexityService | null>(null);

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    if (newApiKey && PerplexityService.validateApiKey(newApiKey)) {
      try {
        const service = new PerplexityService(newApiKey);
        setPerplexityService(service);
        setError('');
      } catch (err) {
        setError('Failed to initialize service with provided API key.');
        setPerplexityService(null);
      }
    } else {
      setPerplexityService(null);
    }
  };

  const loadMyths = async () => {
    if (!perplexityService) {
      setError('Please configure your Perplexity API key first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const mythsData = await perplexityService.getEyeHealthMyths();
      setMyths(mythsData);
      setLastUpdated(new Date());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load myths and facts. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadMyths();
  };

  // Auto-load myths when service is available
  useEffect(() => {
    if (perplexityService && myths.length === 0) {
      loadMyths();
    }
  }, [perplexityService]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full">
              <Lightbulb className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Eye Health Myths vs Facts
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Separate fact from fiction with evidence-based information about common eye health beliefs. 
            Our AI-powered system debunks myths with scientific accuracy.
          </p>
          <MedicalDisclaimer variant="card" className="max-w-2xl mx-auto mb-6" />
        </div>

        {/* API Key Manager */}
        <div className="mb-8">
          <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
          <button
            onClick={handleRefresh}
            disabled={isLoading || !perplexityService}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-5 w-5 mr-2" />
                {myths.length > 0 ? 'Refresh Myths' : 'Load Myths'}
              </>
            )}
          </button>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
          {!perplexityService && (
            <p className="text-sm text-amber-600">
              Please configure your API key above to load myths and facts.
            </p>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && myths.length === 0 && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Loading eye health myths and facts...</p>
          </div>
        )}

        {/* Myths Grid */}
        {myths.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {myths.map((mythItem, index) => (
              <div key={index} className="card p-6 hover:shadow-xl transition-shadow duration-300">
                {/* Myth */}
                <div className="mb-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <XCircle className="h-6 w-6 text-red-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-red-700 mb-2">MYTH</h3>
                      <p className="text-gray-800 leading-relaxed">{mythItem.myth}</p>
                    </div>
                  </div>
                </div>

                {/* Fact */}
                <div className="mb-6">
                  <div className="flex items-start space-x-3 mb-3">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="text-lg font-bold text-green-700 mb-2">FACT</h3>
                      <p className="text-gray-800 leading-relaxed">{mythItem.fact}</p>
                    </div>
                  </div>
                </div>

                {/* Explanation */}
                {mythItem.explanation && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">
                      Explanation
                    </h4>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {mythItem.explanation.trim()}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Bottom Disclaimer */}
        {myths.length > 0 && (
          <div className="mt-12 text-center">
            <MedicalDisclaimer variant="inline" className="max-w-2xl mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default MythsPage;