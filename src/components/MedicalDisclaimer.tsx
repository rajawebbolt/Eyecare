import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface MedicalDisclaimerProps {
  variant?: 'banner' | 'inline' | 'card';
  className?: string;
}

const MedicalDisclaimer: React.FC<MedicalDisclaimerProps> = ({ 
  variant = 'inline', 
  className = '' 
}) => {
  const baseClasses = "flex items-start space-x-3 p-4 rounded-lg border";
  
  const variantClasses = {
    banner: "bg-yellow-50 border-yellow-200 text-yellow-800",
    inline: "bg-blue-50 border-blue-200 text-blue-800",
    card: "bg-white border-gray-200 text-gray-700 shadow-sm"
  };

  const iconClasses = {
    banner: "text-yellow-600",
    inline: "text-blue-600", 
    card: "text-gray-600"
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      <AlertTriangle className={`h-5 w-5 mt-0.5 flex-shrink-0 ${iconClasses[variant]}`} />
      <div className="text-sm">
        <p className="font-medium mb-1">Medical Disclaimer</p>
        <p className="leading-relaxed">
          This information is for educational purposes only and should not replace professional medical advice. 
          Always consult with qualified healthcare professionals for diagnosis and treatment.
        </p>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;