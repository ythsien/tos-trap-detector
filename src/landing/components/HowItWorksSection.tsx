import React from 'react';
import { Link, FileText, CheckCircle } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Bring Your Own OpenAI API Key',
    description: 'Connect your own OpenAI API key for unlimited free scans with complete privacy and control.',
    icon: Link,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    id: 2,
    title: 'Paste a link or contract text',
    description: 'Simply paste a Terms of Service URL or copy & paste contract text directly into ToSCheck.',
    icon: FileText,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    id: 3,
    title: 'Get a clear report with highlights',
    description: 'Receive a detailed report highlighting problematic sections with plain English explanations.',
    icon: CheckCircle,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
];

export function HowItWorksSection() {
  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            How It Works
          </h2>
          <p className="text-lg text-gray-600">
            Get insights into any Terms of Service in just three simple steps
          </p>
        </div>
        
        <div className="mx-auto max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={step.id} className="relative">
                {/* Connection line */}
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-16 left-full w-full h-0.5 bg-gradient-to-r from-gray-200 to-gray-100 -translate-x-6 z-0" />
                )}
                
                <div className="relative bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-shadow duration-300">
                  <div className={`w-16 h-16 ${step.bgColor} rounded-2xl flex items-center justify-center mb-6`}>
                    <step.icon className={`h-8 w-8 ${step.color}`} />
                  </div>
                  
                  <div className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                    <span className="text-sm text-gray-600">{step.id}</span>
                  </div>
                  
                  <h3 className="text-xl text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="mt-16 text-center">
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 max-w-3xl mx-auto">
            <p className="text-sm text-yellow-800">
              <strong>Disclaimer:</strong> AI-generated analysis could be wrong and this tool does not provide actual legal advice. 
              Always consult with a qualified attorney for legal matters and verify important findings independently.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}