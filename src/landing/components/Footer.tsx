import React from 'react';
import { Button } from './ui/button';
import { Shield, ArrowRight, Github, Twitter, Mail, Coffee, Heart } from 'lucide-react';

interface FooterProps {
  onStartScanning: () => void;
}

export function Footer({ onStartScanning }: FooterProps) {
  return (
    <footer>
      {/* CTA Section */}
      <div className="bg-white py-16 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl mb-4 text-gray-900">
              Protect yourself today. Try ToSCheck free.
            </h2>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Don't sign another contract without understanding what you're agreeing to.
            </p>
            
            <Button 
              size="lg"
              onClick={onStartScanning}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 h-14 px-8"
            >
              Start Scanning
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </div>
      
      {/* Support Section */}
      <div className="bg-white py-16 border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8 max-w-2xl mx-auto">
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
      </div>
      
      {/* Footer Links */}
      <div className="bg-gray-900 text-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl">ToSCheck</span>
            </div>
            <p className="text-gray-400 leading-relaxed max-w-md">
              Free AI-powered Terms of Service analysis tool. Understand what you're really agreeing to 
              before you sign up for any service.
            </p>
            
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Github className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors">
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg mb-4">Support</h3>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
              <li><a href="#" className="hover:text-white transition-colors">API Setup Guide</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 ToSCheck. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm mt-4 sm:mt-0">
            Made with ❤️ for consumer protection
          </p>
        </div>
        </div>
      </div>
    </footer>
  );
}