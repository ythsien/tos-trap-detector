import React from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Check, Coffee, Key, Zap, Heart } from 'lucide-react';

const features = [
  'Unlimited ToS scans',
  'Privacy-focused analysis',
  'No data stored on our servers',
  'Latest AI models',
  'Plain English explanations',
  'Export reports as PDF',
];

export function PricingSection() {
  return (
    <section className="py-24 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl sm:text-4xl text-gray-900 mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-lg text-gray-600">
            ToSCheck is free to use with your own API key. Support us to keep it running!
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free with API Key */}
          <Card className="relative border-2 border-blue-200 shadow-lg">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge className="bg-blue-600 text-white px-4 py-1">Most Popular</Badge>
            </div>
            
            <CardHeader className="text-center pb-8 pt-12">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Key className="h-8 w-8 text-blue-600" />
              </div>
              
              <CardTitle className="text-2xl text-gray-900">Bring Your Own API Key</CardTitle>
              <div className="mt-4">
                <span className="text-4xl text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">forever</span>
              </div>
              <p className="text-gray-600 mt-2">
                Connect your OpenAI API key for unlimited free scans
              </p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-8">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl h-12">
                <Key className="mr-2 h-5 w-5" />
                Set Up API Key
              </Button>
            </CardContent>
          </Card>
          
          {/* Limited Free */}
          <Card className="shadow-lg">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Zap className="h-8 w-8 text-green-600" />
              </div>
              
              <CardTitle className="text-2xl text-gray-900">Limited Free</CardTitle>
              <div className="mt-4">
                <span className="text-4xl text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">with limits</span>
              </div>
              <p className="text-gray-600 mt-2">
                Try ToSCheck with 5 free scans per month
              </p>
            </CardHeader>
            
            <CardContent>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">5 scans per month</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">All analysis features</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">No API key required</span>
                </li>
                <li className="flex items-center gap-3">
                  <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Export reports</span>
                </li>
              </ul>
              
              <Button variant="outline" className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl h-12">
                <Zap className="mr-2 h-5 w-5" />
                Start Free Trial
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Support Section */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-8 max-w-2xl mx-auto">
            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Coffee className="h-8 w-8 text-orange-600" />
            </div>
            
            <h3 className="text-xl text-gray-900 mb-3">
              Enjoying ToSCheck?
            </h3>
            <p className="text-gray-600 mb-6">
              Help us keep this tool free and improve it with your support. Every coffee counts! ☕
            </p>
            
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200">
              <Heart className="mr-2 h-5 w-5" />
              Buy Me a Coffee
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}