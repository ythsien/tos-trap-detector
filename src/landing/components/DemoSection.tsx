import React, { useState } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { AlertTriangle, Eye, ArrowRight, CheckCircle, XCircle } from 'lucide-react';

interface DemoSectionProps {
  onTryScan: () => void;
}

const serviceResults = {
  Instagram: {
    riskCount: 5,
    findings: [
      { type: 'danger', title: 'Auto-renewal clause detected', description: 'Instagram automatically renews subscriptions with limited cancellation window', severity: 'high', icon: XCircle },
      { type: 'danger', title: 'Extensive data sharing', description: 'Shares personal data with Facebook/Meta and advertising partners', severity: 'high', icon: XCircle },
      { type: 'warning', title: 'Unilateral changes allowed', description: 'Terms can be changed at any time with minimal notice', severity: 'medium', icon: AlertTriangle },
      { type: 'warning', title: 'Limited liability protection', description: 'Limited liability for service outages or data loss', severity: 'medium', icon: AlertTriangle },
      { type: 'success', title: 'Data download available', description: 'You can download your data before account deletion', severity: 'low', icon: CheckCircle }
    ]
  },
  TikTok: {
    riskCount: 6,
    findings: [
      { type: 'danger', title: 'Extensive data collection', description: 'Collects biometric data, location, and device information', severity: 'high', icon: XCircle },
      { type: 'danger', title: 'Foreign jurisdiction', description: 'Disputes resolved under Singapore law, limiting US user rights', severity: 'high', icon: XCircle },
      { type: 'warning', title: 'Algorithm changes without notice', description: 'Content policies and algorithms can change without user notification', severity: 'medium', icon: AlertTriangle },
      { type: 'warning', title: 'Auto-renewal complexity', description: 'Premium features auto-renew with complex cancellation process', severity: 'medium', icon: AlertTriangle },
      { type: 'warning', title: 'Content ownership unclear', description: 'User-generated content rights and usage terms are ambiguous', severity: 'medium', icon: AlertTriangle },
      { type: 'success', title: 'Account deletion possible', description: 'Users can request account and data deletion', severity: 'low', icon: CheckCircle }
    ]
  },
  Notion: {
    riskCount: 3,
    findings: [
      { type: 'warning', title: 'Data used for AI training', description: 'User content may be used for AI training and service improvement', severity: 'medium', icon: AlertTriangle },
      { type: 'warning', title: 'Limited refund policy', description: 'Annual plans have restricted refund options for early cancellation', severity: 'medium', icon: AlertTriangle },
      { type: 'warning', title: 'Standard liability limits', description: 'Limited liability for data loss or service interruption', severity: 'medium', icon: AlertTriangle }
    ]
  },
  Amazon: {
    riskCount: 7,
    findings: [
      { type: 'danger', title: 'Prime auto-renewal trap', description: 'Prime membership auto-renews with complex cancellation requirements', severity: 'high', icon: XCircle },
      { type: 'danger', title: 'Extensive data sharing', description: 'Data shared with third-party sellers and advertising networks', severity: 'high', icon: XCircle },
      { type: 'danger', title: 'Mandatory arbitration', description: 'Arbitration clause prevents class action lawsuits', severity: 'high', icon: XCircle },
      { type: 'warning', title: 'Price changes allowed', description: 'Terms and pricing can be modified with limited advance notice', severity: 'medium', icon: AlertTriangle },
      { type: 'warning', title: 'Account suspension risks', description: 'Accounts can be suspended with limited appeal process', severity: 'medium', icon: AlertTriangle },
      { type: 'warning', title: 'Third-party seller risks', description: 'Limited liability for third-party seller transactions', severity: 'medium', icon: AlertTriangle },
      { type: 'success', title: 'Return policy available', description: 'Most items eligible for returns within specified timeframes', severity: 'low', icon: CheckCircle }
    ]
  },
  YouTube: {
    riskCount: 4,
    findings: [
      { type: 'danger', title: 'Comprehensive data tracking', description: 'Video watching habits shared with Google and advertising networks', severity: 'high', icon: XCircle },
      { type: 'warning', title: 'Premium auto-renewal', description: 'YouTube Premium auto-renews with 24-hour cancellation notice required', severity: 'medium', icon: AlertTriangle },
      { type: 'warning', title: 'Content removal risks', description: 'Limited liability for content removal or channel termination', severity: 'medium', icon: AlertTriangle },
      { type: 'warning', title: 'Policy changes frequent', description: 'Community guidelines and monetization policies change regularly', severity: 'medium', icon: AlertTriangle }
    ]
  }
};

export function DemoSection({ onTryScan }: DemoSectionProps) {
  const [selectedService, setSelectedService] = useState<keyof typeof serviceResults>('Instagram');
  const currentResults = serviceResults[selectedService];

  return (
    <section className="py-24 bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            Here's what a ToSCheck scan looks like
          </h2>
          <p className="text-lg text-gray-600">
            See how we break down complex legal language into clear, actionable insights
          </p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <p className="text-sm text-gray-600 mb-4">Try with popular services:</p>
            <div className="flex flex-wrap justify-center gap-2">
              {(Object.keys(serviceResults) as Array<keyof typeof serviceResults>).map((company) => (
                <button
                  key={company}
                  onClick={() => setSelectedService(company)}
                  className={`px-4 py-2 border rounded-full text-sm transition-colors ${
                    selectedService === company
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  {company}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <div className="bg-gray-50 rounded-2xl p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Eye className="h-4 w-4 text-white" />
                </div>
                <h3 className="text-lg text-gray-900">{selectedService} Terms Analysis</h3>
              </div>
              
              <div className="space-y-4">
                {currentResults.findings.map((finding, index) => (
                  <div key={index} className="bg-white rounded-xl p-4 border border-gray-200">
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        finding.type === 'danger' ? 'bg-red-100' :
                        finding.type === 'warning' ? 'bg-yellow-100' :
                        'bg-green-100'
                      }`}>
                        <finding.icon className={`h-4 w-4 ${
                          finding.type === 'danger' ? 'text-red-600' :
                          finding.type === 'warning' ? 'text-yellow-600' :
                          'text-green-600'
                        }`} />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm text-gray-900">{finding.title}</h4>
                          <Badge variant={
                            finding.severity === 'high' ? 'destructive' :
                            finding.severity === 'medium' ? 'secondary' :
                            'default'
                          } className="text-xs">
                            {finding.severity}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {finding.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 flex items-center justify-between text-xs text-gray-500">
                <span>Analysis completed in 2.3 seconds</span>
                <span>{currentResults.findings.length} findings detected</span>
              </div>
            </div>
            
            <div className="mt-16 text-center">
              <h3 className="text-xl text-gray-900 mb-4">
                Ready to protect yourself?
              </h3>
              <p className="text-gray-600 mb-6">
                Don't let hidden clauses catch you off guard. Scan any Terms of Service for free and get clear insights in seconds.
              </p>
              
              <Button 
                size="lg"
                onClick={onTryScan}
                className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Try Your Own Scan
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}