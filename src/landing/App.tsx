import React, { useState } from 'react';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FeaturesSection } from './components/FeaturesSection';
import { DemoSection } from './components/DemoSection';
import { Footer } from './components/Footer';
import { AuthModal } from './components/AuthModal';
import { Dashboard } from './components/Dashboard';
import { Button } from './components/ui/button';
import { Shield, Menu, X } from 'lucide-react';

export default function App() {
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<{ email: string; name: string } | null>(null);

  const handleScanNow = () => {
    if (!user) {
      setIsAuthModalOpen(true);
    } else {
      // User is already logged in, they're viewing the dashboard
      console.log('Starting scan...');
    }
  };

  const handleSeeDemo = () => {
    // Scroll to demo section
    document.getElementById('demo')?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleLogin = (email: string, name: string) => {
    setUser({ email, name });
    setIsAuthModalOpen(false);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const scrollToSection = (sectionId: string) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  // If user is logged in, show dashboard
  if (user) {
    return <Dashboard user={user} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-b border-gray-100 z-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl text-gray-900">ToSCheck</span>
            </div>
            
            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Features
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('demo')}
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                Demo
              </button>

            </div>
            
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-600">Welcome back!</span>
                  <Button 
                    onClick={handleScanNow}
                    className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                  >
                    Start Scanning
                  </Button>
                </div>
              ) : (
                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
                >
                  Get Started
                </Button>
              )}
            </div>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-gray-100 py-4">
              <div className="flex flex-col gap-4">
                <button 
                  onClick={() => scrollToSection('features')}
                  className="text-left text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Features
                </button>
                <button 
                  onClick={() => scrollToSection('how-it-works')}
                  className="text-left text-gray-600 hover:text-gray-900 transition-colors"
                >
                  How It Works
                </button>
                <button 
                  onClick={() => scrollToSection('demo')}
                  className="text-left text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Demo
                </button>

                <Button 
                  onClick={() => setIsAuthModalOpen(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg self-start"
                >
                  Get Started
                </Button>
              </div>
            </div>
          )}
        </div>
      </nav>
      
      {/* Main Content */}
      <main className="pt-16">
        <HeroSection onScanNow={handleScanNow} onSeeDemo={handleSeeDemo} />
        
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        
        <div id="demo">
          <DemoSection onTryScan={handleScanNow} />
        </div>
        
        <div id="features">
          <FeaturesSection />
        </div>
        
        <Footer onStartScanning={handleScanNow} />
      </main>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}