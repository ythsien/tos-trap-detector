import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Alert, AlertDescription } from './ui/alert';
import { Textarea } from './ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Badge } from './ui/badge';
import { Shield, Key, Search, FileText, AlertTriangle, CheckCircle, Settings, Eye, EyeOff, Coffee, Heart } from 'lucide-react';
import { AnalysisService } from '../../services/analysisService.js';

interface DashboardProps {
  user: { email: string; name: string };
  onLogout: () => void;
}

export function Dashboard({ user, onLogout }: DashboardProps) {
  const [apiKey, setApiKey] = useState('');
  const [showApiKey, setShowApiKey] = useState(false);
  const [apiKeyLocked, setApiKeyLocked] = useState(false);
  const [url, setUrl] = useState('');
  const [contractText, setContractText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState('url');
  const [lastSummary, setLastSummary] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);

  // Load saved API key from localStorage
  useEffect(() => {
    const savedApiKey = localStorage.getItem('openai_api_key');
    if (savedApiKey) {
      // mask and lock
      setApiKey(`${savedApiKey.slice(0, 3)}****************${savedApiKey.slice(-4)}`);
      setApiKeyLocked(true);
    }
  }, []);

  const handleSaveOrEditApiKey = async () => {
    if (apiKeyLocked) {
      // Switch to editable mode
      setApiKey('');
      setApiKeyLocked(false);
      setShowApiKey(false);
      return;
    }
    // Save mode
    const trimmed = apiKey.trim();
    if (!trimmed) return;
    // Persist for AIService
    localStorage.setItem('openai_api_key', trimmed);
    // Also set Vite env for this session
    // @ts-ignore
    import.meta.env.VITE_OPENAI_API_KEY = trimmed;
    // Lock and mask
    setApiKey(`${trimmed.slice(0, 3)}****************${trimmed.slice(-4)}`);
    setApiKeyLocked(true);
    alert('API key saved successfully!');
  };

  const handleAnalyze = async () => {
    const hasKey = localStorage.getItem('openai_api_key');
    if (!hasKey) {
      alert('Please set your OpenAI API key first');
      return;
    }
    if (activeTab === 'url' && !url.trim()) {
      alert('Please enter a URL to analyze');
      return;
    }
    if (activeTab === 'text' && !contractText.trim()) {
      alert('Please enter contract text to analyze');
      return;
    }

    try {
      setIsAnalyzing(true);
      const result = activeTab === 'url'
        ? await AnalysisService.analyzeContractFromURL(url.trim())
        : await AnalysisService.analyzeContract(contractText.trim());

      const total = result?.summary?.totalClauses ?? result?.analysis?.totalClauses ?? 0;
      const risk = result?.analysis?.overallRisk ?? result?.summary?.overallRisk ?? 'Low';
      setLastSummary(`Overall Risk: ${risk} • ${total} clause(s)`);
      setAnalysisResults(result);
      console.log('Analysis result', result);
    } catch (e: any) {
      alert(`Analysis failed: ${e?.message || e}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Shield className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl text-gray-900">ToSCheck</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm text-gray-900">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                  <span className="text-sm text-gray-600">{user.name?.[0]?.toUpperCase()}</span>
                </div>
              </div>
              <Button 
                variant="outline" 
                onClick={onLogout}
                className="border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Log out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="mx-auto max-w-4xl px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl text-gray-900 mb-2">Terms of Service Analyzer</h1>
          <p className="text-gray-600">
            Analyze Terms of Service and contracts to identify potential risks and concerning clauses.
          </p>
          {lastSummary && (
            <p className="mt-2 text-sm text-gray-700">{lastSummary}</p>
          )}
        </div>

        <div className="grid gap-8">
          {/* API Configuration */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                API Configuration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="apiKey">OpenAI API Key</Label>
                <div className="flex gap-2 mt-1">
                  <div className="relative flex-1">
                    <Input
                      id="apiKey"
                      type={showApiKey ? 'text' : 'password'}
                      placeholder="sk-..."
                      value={apiKey}
                      onChange={(e) => setApiKey(e.target.value)}
                      className="pr-10"
                      disabled={apiKeyLocked}
                    />
                    <button
                      type="button"
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      disabled={apiKeyLocked}
                    >
                      {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <Button onClick={handleSaveOrEditApiKey} variant="outline">
                    <Key className="mr-2 h-4 w-4" />
                    {apiKeyLocked ? 'Edit' : 'Save'}
                  </Button>
                </div>
              </div>
              
              <Alert>
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  Your API key is saved locally in your browser and never sent to our servers. 
                  We respect your privacy and security.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Analysis Section */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Analyze Terms of Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="url">URL Analysis</TabsTrigger>
                  <TabsTrigger value="text">Text Analysis</TabsTrigger>
                </TabsList>
                <TabsContent value="url" className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="url">Terms of Service URL</Label>
                    <div className="flex gap-2 mt-1">
                      <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input
                          id="url"
                          type="url"
                          placeholder="https://example.com/terms"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="pl-10"
                        />
                      </div>
                    </div>
                  </div>
                </TabsContent>
                <TabsContent value="text" className="space-y-4 mt-6">
                  <div>
                    <Label htmlFor="contractText">Contract Text</Label>
                    <Textarea
                      id="contractText"
                      placeholder="Paste your Terms of Service or contract text here..."
                      value={contractText}
                      onChange={(e) => setContractText(e.target.value)}
                      className="mt-1 min-h-[200px]"
                    />
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="flex justify-between items-center pt-4">
                <div className="flex items-center gap-2">
                  {localStorage.getItem('openai_api_key') ? (
                    <Badge variant="default" className="bg-green-100 text-green-800">
                      <CheckCircle className="mr-1 h-3 w-3" />
                      API Key Set
                    </Badge>
                  ) : (
                    <Badge variant="destructive">
                      <AlertTriangle className="mr-1 h-3 w-3" />
                      API Key Required
                    </Badge>
                  )}
                </div>
                
                <Button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !localStorage.getItem('openai_api_key')}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isAnalyzing ? 'Analyzing...' : 'Analyze Terms'}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Analysis Results */}
          {analysisResults && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Analysis Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                {/* Overall Risk */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Overall Risk: {analysisResults.analysis?.overallRisk || analysisResults.summary?.overallRisk || 'Low'}
                  </h3>
                </div>

                {/* Detected Clauses */}
                {analysisResults.analysis?.clauses && analysisResults.analysis.clauses.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="text-md font-medium text-gray-900">
                      {analysisResults.analysis.clauses.length} clause(s) detected
                    </h4>
                    {analysisResults.analysis.clauses.map((clause: any, index: number) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                          <h5 className="font-medium text-gray-900">{clause.category}</h5>
                          <Badge 
                            variant={clause.risk === 'High' ? 'destructive' : clause.risk === 'Medium' ? 'secondary' : 'default'}
                            className={clause.risk === 'High' ? 'bg-red-100 text-red-800' : clause.risk === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}
                          >
                            {clause.risk} Risk
                          </Badge>
                        </div>
                        <p className="text-gray-700 mb-3">
                          {clause.summary} {clause.whyItMatters}
                        </p>
                        {clause.snippet && (
                          <blockquote className="text-sm text-gray-600 bg-white p-3 rounded border-l-4 border-gray-300">
                            "{clause.snippet}"
                          </blockquote>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Support Section */}
          <div className="text-center">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-2xl p-8">
              <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Coffee className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl text-gray-900 mb-3">Enjoying ToSCheck?</h3>
              <p className="text-gray-600 mb-6">Help us keep this tool free and improve it with your support. Every coffee counts! ☕</p>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200" onClick={() => window.open('https://buymeacoffee.com/adam.yu', '_blank', 'noopener') }>
                <Heart className="mr-2 h-5 w-5" />
                Buy Me a Coffee
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}