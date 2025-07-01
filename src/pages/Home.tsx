import React from 'react';
import { Link } from 'react-router-dom';
import { MessageCircle, Lightbulb, FlaskConical, Users, ArrowRight, Sparkles, Shield, Brain } from 'lucide-react';
import MedicalDisclaimer from '../components/MedicalDisclaimer';

const Home: React.FC = () => {
  const features = [
    {
      icon: MessageCircle,
      title: 'AI-Powered Q&A',
      description: 'Get expert answers to your eye health questions using advanced AI technology.',
      link: '/qa',
      color: 'from-blue-600 to-blue-700',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Lightbulb,
      title: 'Myths & Facts',
      description: 'Discover the truth behind common eye health myths with evidence-based facts.',
      link: '/myths',
      color: 'from-amber-600 to-amber-700',
      bgColor: 'bg-amber-50',
      iconColor: 'text-amber-600'
    },
    {
      icon: FlaskConical,
      title: 'Latest Research',
      description: 'Stay updated with the newest findings in eye health and vision science.',
      link: '/research',
      color: 'from-purple-600 to-purple-700',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    {
      icon: Users,
      title: 'Age-Specific Care',
      description: 'Tailored eye care advice for different life stages and age groups.',
      link: '/age-groups',
      color: 'from-green-600 to-green-700',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Medical Disclaimer Banner */}
      <MedicalDisclaimer variant="banner" className="sticky top-16 z-40" />

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/20"></div>
        
        {/* Powered by Bolt Badge - Top Right */}
        <div className="absolute top-6 right-6 z-10">
          <a
            href="https://bolt.new"
            target="_blank"
            rel="noopener noreferrer"
            className="group block transform hover:scale-105 transition-all duration-200 shadow-xl hover:shadow-2xl"
          >
            <img 
              src="/badge.png" 
              alt="Powered by Bolt - Made in Bolt.new"
              className="w-20 h-20 md:w-24 md:h-24 rounded-full shadow-lg group-hover:shadow-xl transition-shadow duration-200"
            />
          </a>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32">
          <div className="text-center">
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
              Your Vision,{' '}
              <span className="bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-transparent">
                Our Mission
              </span>
            </h1>
            <p className="text-xl lg:text-2xl text-blue-100 mb-4 max-w-3xl mx-auto leading-relaxed">
              Comprehensive eye health education powered by cutting-edge AI technology. 
              Get expert insights, debunk myths, and stay informed about the latest research.
            </p>
            <div className="mb-8">
              <MedicalDisclaimer variant="inline" className="mx-auto bg-white/20 text-white border-white/30" />
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/qa"
                className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                <MessageCircle className="h-5 w-5 mr-2" />
                Ask a Question
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
              <Link
                to="/myths"
                className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200"
              >
                <Lightbulb className="h-5 w-5 mr-2" />
                Explore Myths
              </Link>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute top-20 left-10 animate-float">
          <Sparkles className="h-8 w-8 text-yellow-300 opacity-70" />
        </div>
        <div className="absolute top-40 right-16 animate-float-delayed">
          <Brain className="h-10 w-10 text-pink-300 opacity-60" />
        </div>
        <div className="absolute bottom-20 left-20 animate-float">
          <Shield className="h-6 w-6 text-blue-300 opacity-80" />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Comprehensive Eye Health Resources
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-6">
              Explore our AI-powered platform designed to provide you with accurate, 
              evidence-based information about eye health and vision care.
            </p>
            <div className="flex justify-center">
              <MedicalDisclaimer variant="inline" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Link
                  key={index}
                  to={feature.link}
                  className="group block"
                >
                  <div className={`${feature.bgColor} rounded-2xl p-8 h-full transform group-hover:scale-105 transition-all duration-300 shadow-lg group-hover:shadow-xl border border-gray-100`}>
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-gray-700 transition-colors">
                          {feature.title}
                        </h3>
                        <p className="text-gray-600 leading-relaxed mb-4">
                          {feature.description}
                        </p>
                        <div className="flex items-center text-sm font-semibold text-gray-800 group-hover:text-gray-600 transition-colors">
                          Learn more 
                          <ArrowRight className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform" />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-6">
            Ready to Learn About Your Vision?
          </h2>
          <p className="text-xl text-blue-100 mb-4">
            Start your journey to better eye health awareness with our AI-powered platform. 
            Get instant educational content, learn from research, and stay informed.
          </p>
          <div className="mb-6">
            <MedicalDisclaimer variant="inline" className="bg-white/20 text-white border-white/30" />
          </div>
          <Link
            to="/qa"
            className="inline-flex items-center px-8 py-4 bg-white text-blue-600 font-semibold rounded-lg hover:bg-blue-50 transform hover:scale-105 transition-all duration-200 shadow-lg"
          >
            <MessageCircle className="h-5 w-5 mr-2" />
            Start Your Eye Health Learning Journey
            <ArrowRight className="h-5 w-5 ml-2" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;