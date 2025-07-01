import React, { useState, useEffect } from 'react';
import { FlaskConical, RefreshCw, Calendar, ExternalLink } from 'lucide-react';
import { PerplexityService } from '../services/perplexityApi';
import LoadingSpinner from '../components/LoadingSpinner';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import ApiKeyManager from '../components/ApiKeyManager';

interface ResearchItem {
  title: string;
  summary: string;
  date: string;
  source: string;
  url?: string;
}

const ResearchPage: React.FC = () => {
  const [research, setResearch] = useState<ResearchItem[]>([]);
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

  const loadResearch = async () => {
    if (!perplexityService) {
      setError('Please configure your Perplexity API key first.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const researchData = await perplexityService.getLatestResearch();
      setResearch(researchData);
      setLastUpdated(new Date());
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load research findings. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = () => {
    loadResearch();
  };

  // Auto-load research when service is available
  useEffect(() => {
    if (perplexityService && research.length === 0) {
      loadResearch();
    }
  }, [perplexityService]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full">
              <FlaskConical className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Latest Eye Health Research
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Stay informed about breakthrough discoveries and latest findings in eye health and vision science. 
            Our AI curates the most recent research from trusted medical sources.
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
                {research.length > 0 ? 'Refresh Research' : 'Load Research'}
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
              Please configure your API key above to load research findings.
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
        {isLoading && research.length === 0 && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Loading latest research findings...</p>
          </div>
        )}

        {/* Research Grid */}
        {research.length > 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {research.map((item, index) => (
              <div key={index} className="card p-6 hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{item.date}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-purple-600 font-medium">
                    <span>{item.source}</span>
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-purple-800 transition-colors"
                        title="View research paper"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    ) : (
                      <ExternalLink className="h-4 w-4" />
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-4 leading-tight">
                  {item.title}
                </h3>

                <p className="text-gray-700 leading-relaxed mb-4">
                  {item.summary}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <span className="text-sm text-gray-500">Research Finding #{index + 1}</span>
                  <div className="flex items-center space-x-1">
                    {item.url ? (
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center space-x-1 text-purple-600 hover:text-purple-800 transition-colors group"
                        title="View research paper"
                      >
                        <FlaskConical className="h-4 w-4 group-hover:scale-110 transition-transform" />
                        <span className="text-sm font-medium">View Paper</span>
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <div className="flex items-center space-x-1 text-purple-600">
                        <FlaskConical className="h-4 w-4" />
                        <span className="text-sm font-medium">Scientific Study</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Research Categories */}
        {research.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Research Categories
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Clinical Studies</h3>
                <p className="text-sm text-gray-600">Latest clinical trials and treatment research</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Technology</h3>
                <p className="text-sm text-gray-600">Advances in diagnostic and treatment technology</p>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-md">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <FlaskConical className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Prevention</h3>
                <p className="text-sm text-gray-600">Research on preventive care and lifestyle factors</p>
              </div>
            </div>
          </div>
        )}

        {/* Bottom Disclaimer */}
        {research.length > 0 && (
          <div className="mt-12 text-center">
            <MedicalDisclaimer variant="inline" className="max-w-2xl mx-auto" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchPage;