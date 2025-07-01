import React, { useState } from 'react';
import { Users, Baby, GraduationCap, Briefcase, Heart } from 'lucide-react';
import { PerplexityService } from '../services/perplexityApi';
import LoadingSpinner from '../components/LoadingSpinner';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import ApiKeyManager from '../components/ApiKeyManager';

interface AgeGroup {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  color: string;
  bgColor: string;
}

const AgeGroupsPage: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [advice, setAdvice] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [perplexityService, setPerplexityService] = useState<PerplexityService | null>(null);

  const ageGroups: AgeGroup[] = [
    {
      id: 'children',
      name: 'Children (0-12 years)',
      icon: Baby,
      description: 'Early development, vision screening, and establishing healthy habits',
      color: 'from-pink-500 to-rose-500',
      bgColor: 'bg-pink-50'
    },
    {
      id: 'teens',
      name: 'Teenagers (13-19 years)',
      icon: GraduationCap,
      description: 'Screen time management, sports eye safety, and vision changes',
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50'
    },
    {
      id: 'adults',
      name: 'Adults (20-64 years)',
      icon: Briefcase,
      description: 'Workplace eye health, digital eye strain, and preventive care',
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50'
    },
    {
      id: 'seniors',
      name: 'Seniors (65+ years)',
      icon: Heart,
      description: 'Age-related conditions, regular monitoring, and quality of life',
      color: 'from-purple-500 to-violet-500',
      bgColor: 'bg-purple-50'
    }
  ];

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

  const handleGroupSelect = async (groupId: string) => {
    const group = ageGroups.find(g => g.id === groupId);
    if (!group) return;

    if (!perplexityService) {
      setError('Please configure your Perplexity API key first.');
      return;
    }

    setSelectedGroup(groupId);
    setIsLoading(true);
    setError('');
    setAdvice('');

    try {
      const response = await perplexityService.getAgeSpecificAdvice(group.name);
      setAdvice(response);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load age-specific advice. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 py-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-full">
              <Users className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Age-Specific Eye Care
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
            Get tailored eye health advice for different life stages. Each age group has unique 
            vision needs, risks, and preventive measures.
          </p>
          <MedicalDisclaimer variant="card" className="max-w-2xl mx-auto" />
        </div>

        {/* API Key Manager */}
        <div className="mb-8">
          <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
        </div>

        {/* Age Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {ageGroups.map((group) => {
            const Icon = group.icon;
            const isSelected = selectedGroup === group.id;
            
            return (
              <button
                key={group.id}
                onClick={() => handleGroupSelect(group.id)}
                disabled={isLoading || !perplexityService}
                className={`${group.bgColor} rounded-xl p-6 text-left transition-all duration-300 hover:shadow-lg transform hover:scale-105 border-2 ${
                  isSelected ? 'border-blue-500 shadow-lg' : 'border-transparent'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${group.color} flex items-center justify-center mb-4`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  {group.name}
                </h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {group.description}
                </p>
                {isSelected && (
                  <div className="mt-3 text-blue-600 font-medium text-sm">
                    Selected ✓
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {!perplexityService && (
          <div className="text-center mb-8">
            <p className="text-amber-600">
              Please configure your API key above to get age-specific advice.
            </p>
          </div>
        )}

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <LoadingSpinner size="lg" className="mx-auto mb-4" />
            <p className="text-gray-600">Loading age-specific eye care advice...</p>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-center">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {/* Advice Display */}
        {advice && selectedGroup && (
          <div className="card p-8">
            <div className="flex items-center mb-6">
              {(() => {
                const group = ageGroups.find(g => g.id === selectedGroup);
                if (!group) return null;
                const Icon = group.icon;
                return (
                  <>
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${group.color} flex items-center justify-center mr-4`}>
                      <Icon className="h-5 w-5 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      Eye Care for {group.name}
                    </h2>
                  </>
                );
              })()}
            </div>
            
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {advice}
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <MedicalDisclaimer variant="inline" />
            </div>
          </div>
        )}

        {/* General Tips */}
        {!selectedGroup && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Universal Eye Health Tips
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-gray-900 mb-3">Regular Exams</h3>
                <p className="text-sm text-gray-600">
                  Schedule comprehensive eye exams based on your age and risk factors
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-gray-900 mb-3">UV Protection</h3>
                <p className="text-sm text-gray-600">
                  Wear sunglasses with 100% UV protection when outdoors
                </p>
              </div>
              <div className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="font-semibold text-gray-900 mb-3">Healthy Lifestyle</h3>
                <p className="text-sm text-gray-600">
                  Maintain a balanced diet rich in eye-healthy nutrients
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgeGroupsPage;