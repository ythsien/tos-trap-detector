import React from 'react';
import { RefreshCw, Shield, DollarSign, MessageSquare, Key, AlertTriangle, MapPin } from 'lucide-react';

const features = [
  {
    title: 'Auto-Renewals',
    description: 'Detects terms like "auto-renew", "automatic renewal", "renews automatically", "renewal date", "cancel before".',
    icon: RefreshCw,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
  },
  {
    title: 'Data Privacy / Data Selling',
    description: 'Flags phrases like "share your data", "sell your data", "third parties", "marketing partners", "personal data".',
    icon: Shield,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
  },
  {
    title: 'Cancellation Fees or Penalties',
    description: 'Identifies "cancellation fee", "early termination fee", "penalty", "forfeit", "non-refundable" clauses.',
    icon: DollarSign,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
  },
  {
    title: 'Unilateral Changes',
    description: 'Spots "we reserve the right to modify", "change these terms", "at any time without", "modify at our discretion".',
    icon: MessageSquare,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
  },
  {
    title: 'Arbitration / No Class Action',
    description: 'Detects "arbitration", "class action", "jury trial waiver", "binding arbitration", "dispute resolution".',
    icon: Key,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
  },
  {
    title: 'Limitation of Liability',
    description: 'Identifies "limitation of liability", "not liable", "no liability", "indirect", "consequential", "punitive damages".',
    icon: AlertTriangle,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-50',
  },
  {
    title: 'Jurisdiction & Governing Law',
    description: 'Flags "governing law", "jurisdiction", "venue", "courts of", "state of" clauses that may limit your rights.',
    icon: MapPin,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
  },
];

export function FeaturesSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            Powerful Features
          </h2>
          <p className="text-lg text-gray-600">
            Everything you need to understand Terms of Service and protect yourself from hidden traps
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
              <div className={`w-14 h-14 ${feature.bgColor} rounded-xl flex items-center justify-center mb-6`}>
                <feature.icon className={`h-7 w-7 ${feature.color}`} />
              </div>
              
              <h3 className="text-xl text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="mt-16 text-center">
          <div className="inline-flex items-center gap-2 bg-white rounded-full px-6 py-3 shadow-sm">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm text-gray-600">AI-powered analysis • Always up-to-date</span>
          </div>
        </div>
      </div>
    </section>
  );
}