import React, { useState } from 'react';
import { MessageCircle as MessageCircleQuestion, Send, Lightbulb, AlertCircle } from 'lucide-react';
import { PerplexityService } from '../services/perplexityApi';
import LoadingSpinner from '../components/LoadingSpinner';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import ApiKeyManager from '../components/ApiKeyManager';

const QAPage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [perplexityService, setPerplexityService] = useState<PerplexityService | null>(null);

  const commonQuestions = [
    "What are the early signs of glaucoma?",
    "How often should I get an eye exam?",
    "Can screen time damage my eyes?",
    "What foods are good for eye health?",
    "How can I prevent dry eyes?",
    "What causes floaters in vision?",
    "Is it normal for vision to change with age?",
    "How do I protect my eyes from UV damage?"
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    if (!perplexityService) {
      setError('Please configure your Perplexity API key first.');
      return;
    }

    setIsLoading(true);
    setError('');
    setAnswer('');

    try {
      const response = await perplexityService.askQuestion(question);
      setAnswer(response);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to get an answer. Please try again.');
      }
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuestionClick = (commonQuestion: string) => {
    setQuestion(commonQuestion);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full">
              <MessageCircleQuestion className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI-Powered Eye Health Q&A
          </h1>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            Get expert answers to your eye health questions using advanced AI technology. 
            Ask anything about vision care, eye conditions, or preventive measures.
          </p>
          <MedicalDisclaimer variant="card" className="max-w-2xl mx-auto" />
        </div>

        {/* API Key Manager */}
        <div className="mb-8">
          <ApiKeyManager onApiKeyChange={handleApiKeyChange} />
        </div>

        {/* Question Form */}
        <div className="card p-8 mb-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="question" className="block text-lg font-semibold text-gray-900 mb-3">
                What would you like to know about eye health?
              </label>
              <textarea
                id="question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="Type your eye health question here..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-gray-900 placeholder-gray-500"
                disabled={isLoading || !perplexityService}
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !question.trim() || !perplexityService}
              className="btn-primary w-full justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" className="mr-2" />
                  Getting Answer...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5 mr-2" />
                  Ask Question
                </>
              )}
            </button>
            {!perplexityService && (
              <p className="text-sm text-amber-600 text-center">
                Please configure your API key above to ask questions.
              </p>
            )}
          </form>
        </div>

        {/* Common Questions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Lightbulb className="h-6 w-6 mr-2 text-yellow-500" />
            Common Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {commonQuestions.map((commonQuestion, index) => (
              <button
                key={index}
                onClick={() => handleQuestionClick(commonQuestion)}
                className="text-left p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 group disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || !perplexityService}
              >
                <p className="text-gray-700 group-hover:text-blue-700 font-medium">
                  {commonQuestion}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start space-x-3">
            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-800 font-medium">Error</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Answer Display */}
        {answer && (
          <div className="card p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Answer</h2>
            <div className="prose prose-lg max-w-none">
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                {answer}
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-200">
              <MedicalDisclaimer variant="inline" />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default QAPage;