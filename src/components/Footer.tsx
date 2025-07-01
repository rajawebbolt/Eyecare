import React from 'react';
import { Eye, Heart, Shield, AlertTriangle } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg">
                <Eye className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">EyeCare Insights</h3>
                <p className="text-gray-400 text-sm">AI-Powered Eye Health Education</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering you with accurate, evidence-based information about eye health and vision care through advanced AI technology.
            </p>
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Heart className="h-4 w-4 text-red-400" />
              <span>Made with care for your vision health</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="/qa" className="text-gray-300 hover:text-white transition-colors">Ask Questions</a></li>
              <li><a href="/myths" className="text-gray-300 hover:text-white transition-colors">Myths & Facts</a></li>
              <li><a href="/research" className="text-gray-300 hover:text-white transition-colors">Latest Research</a></li>
              <li><a href="/age-groups" className="text-gray-300 hover:text-white transition-colors">Age-Specific Care</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-2">
              <li><span className="text-gray-300">Emergency Eye Care</span></li>
              <li><span className="text-gray-300">Find an Eye Doctor</span></li>
              <li><span className="text-gray-300">Vision Insurance</span></li>
              <li><span className="text-gray-300">Eye Health Tips</span></li>
            </ul>
          </div>
        </div>

        {/* Medical Disclaimer */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4 mb-6">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-yellow-200 font-medium mb-1">Medical Disclaimer</p>
                <p className="text-yellow-100/90">
                  This platform provides educational information only and is not intended as medical advice. 
                  Always consult with qualified healthcare professionals for diagnosis and treatment of eye conditions.
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm text-gray-300">Powered by Perplexity AI</span>
            </div>
            <p className="text-sm text-gray-400">
              © 2024 EyeCare Insights. Educational content for vision health awareness.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;