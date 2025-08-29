import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Shield, Search, ArrowRight } from 'lucide-react';


interface HeroSectionProps {
  onScanNow: () => void;
  onSeeDemo: () => void;
}

export function HeroSection({ onScanNow, onSeeDemo }: HeroSectionProps) {
  const [url, setUrl] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onScanNow();
  };

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-blue-50/50 to-white py-20 sm:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-r from-blue-100/20 to-green-100/20 rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center rounded-full bg-blue-100 px-4 py-2 gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              <span className="text-sm text-blue-700">Free ToS Analysis Tool</span>
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-6xl tracking-tight text-gray-900 mb-6">
            Understand What You're{' '}
            <span className="text-blue-600">Really Agreeing To</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-12 leading-relaxed">
            ToSCheck analyzes online service Terms of Service and contracts to reveal hidden risks like 
            auto-renewals, data selling, and cancellation fees — in plain English.
          </p>
          
          <form onSubmit={handleSubmit} className="mx-auto max-w-2xl mb-8">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="url"
                  placeholder="Paste a Terms of Service URL here…"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="pl-12 h-14 text-base border-gray-200 focus:border-blue-500 focus:ring-blue-500 rounded-xl"
                />
              </div>
              <Button 
                type="submit"
                size="lg"
                className="h-14 px-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Scan Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </form>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="lg"
              onClick={onSeeDemo}
              className="h-12 px-6 border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl"
            >
              See Demo Result
            </Button>

          </div>
        </div>
      </div>
    </section>
  );
}