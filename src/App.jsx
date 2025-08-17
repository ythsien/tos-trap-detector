import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithPopup
} from "firebase/auth";
import { AnalysisService } from "./services/analysisService.js";
import { ERROR_MESSAGES, SUCCESS_MESSAGES, UI_MESSAGES } from "./utils/constants.js";

function App() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState(null);
  const [contractText, setContractText] = useState("");
  const [contractURL, setContractURL] = useState("");
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError("");
  };

  const handleGoogleSignIn = async () => {
    try {
      console.log("Starting Google sign in...");
      const provider = new GoogleAuthProvider();
      console.log("Provider created:", provider);
      
      // Add custom parameters if needed
      provider.setCustomParameters({
        prompt: 'select_account'
      });
      
      const result = await signInWithPopup(auth, provider);
      console.log("Google sign in successful!", result);
    } catch (error) {
      console.error("Google sign in error details:", {
        code: error.code,
        message: error.message,
        email: error.email,
        credential: error.credential
      });
      
      // Provide more specific error messages
      let errorMessage = "Google sign-in failed. ";
      switch (error.code) {
        case 'auth/popup-blocked':
          errorMessage += "Please allow popups for this site.";
          break;
        case 'auth/popup-closed-by-user':
          errorMessage += "Sign-in was cancelled.";
          break;
        case 'auth/unauthorized-domain':
          errorMessage += "This domain is not authorized for sign-in.";
          break;
        default:
          errorMessage += error.message;
      }
      
      setError(errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      console.log("Logged out successfully!");
      setAnalysisResult(null); // Clear analysis results on logout
    } catch (error) {
      console.error("Logout error:", error);
      setError(error.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    try {
      if (isLogin) {
        // Log in
        await signInWithEmailAndPassword(auth, email, password);
        console.log("Logged in successfully!");
      } else {
        // Sign up
        await createUserWithEmailAndPassword(auth, email, password);
        console.log("Signed up successfully!");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      setError(error.message);
    }
  };

  const handleAnalyze = async () => {
    const input = contractText || contractURL;
    if (!input) {
      setError(ERROR_MESSAGES.NO_TEXT_PROVIDED);
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setAnalysisResult(null);

    try {
      let result;
      if (contractText) {
        // Analyze text input
        result = await AnalysisService.analyzeContract(contractText);
      } else {
        // Analyze URL input
        result = await AnalysisService.analyzeContractFromURL(contractURL);
      }

      console.log("Analysis result:", result);
      setAnalysisResult(result);
    } catch (error) {
      console.error("Analysis error:", error);
      setError(ERROR_MESSAGES.ANALYSIS_FAILED + ": " + error.message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const renderAnalysisResults = () => {
    if (!analysisResult) return null;

    const { analysis, summary } = analysisResult;
    const { clauses, overallRisk } = analysis;

    return (
      <div className="mt-6 space-y-4">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Analysis Results</h3>
          
          {/* Overall Summary */}
          <div className={`mb-6 p-4 rounded-lg border ${AnalysisService.getRiskColor(overallRisk)}`}>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{AnalysisService.getRiskIcon(overallRisk)}</span>
              <h4 className="font-semibold">Overall Risk: {overallRisk}</h4>
            </div>
            <p className="text-sm">
              Found {summary.totalClauses} clause{summary.totalClauses !== 1 ? 's' : ''} 
              ({summary.highRiskClauses} high risk, {summary.mediumRiskClauses} medium risk, {summary.lowRiskClauses} low risk)
            </p>
          </div>

          {/* Individual Clauses */}
          {clauses.length > 0 ? (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-700">Detected Clauses:</h4>
              {clauses.map((clause, index) => (
                <div key={index} className={`p-4 rounded-lg border ${AnalysisService.getRiskColor(clause.risk)}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xl">{clause.emoji}</span>
                    <span className="text-lg">{AnalysisService.getCategoryIcon(clause.category)}</span>
                    <h5 className="font-semibold">{clause.category}</h5>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${AnalysisService.getRiskColor(clause.risk)}`}>
                      {clause.risk} Risk
                    </span>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Summary:</strong> {clause.summary}
                    </div>
                    <div>
                      <strong>Why it matters:</strong> {clause.whyItMatters}
                    </div>
                    <div>
                      <strong>Contract snippet:</strong>
                      <blockquote className="mt-1 p-2 bg-gray-50 rounded italic">
                        "{clause.snippet}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">✅</div>
              <h4 className="text-lg font-semibold text-green-600 mb-2">No Risky Clauses Detected</h4>
              <p className="text-gray-600">This contract appears to be free of the common harmful clauses we check for.</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center px-4 py-8">
        <div className="max-w-4xl w-full">
          {/* Header */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-blue-600 mb-2">
                  Contract Risk Analyzer
                </h1>
                <p className="text-gray-600">Welcome, {user.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Log Out
              </button>
            </div>
          </div>

          {/* Analysis Form */}
          <div className="bg-white p-6 rounded-2xl shadow-md mb-6">
            <h3 className="text-xl font-semibold mb-4 text-gray-700">Analyze Contract</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract Text
                </label>
                <textarea
                  rows="6"
                  placeholder="Paste contract text, terms of service, or agreement here..."
                  value={contractText}
                  onChange={(e) => setContractText(e.target.value)}
                  className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="text-center text-gray-500">— OR —</div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contract URL
                </label>
                <input
                  type="url"
                  placeholder="Paste a link to a contract or terms page"
                  value={contractURL}
                  onChange={(e) => setContractURL(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAnalyzing ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="animate-spin">🔍</span>
                    {UI_MESSAGES.ANALYZING}
                  </span>
                ) : (
                  "Analyze Contract"
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-100 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
            </div>
          </div>

          {/* Analysis Results */}
          {renderAnalysisResults()}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          {isLogin ? "Log In" : "Sign Up"}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            required
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            required
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            {isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        <div className="mt-4">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Or continue with</span>
            </div>
          </div>

          <button
            onClick={handleGoogleSignIn}
            className="mt-4 w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-50 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="currentColor"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="currentColor"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="currentColor"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button
            onClick={toggleForm}
            className="text-blue-600 hover:underline font-medium"
          >
            {isLogin ? "Sign Up" : "Log In"}
          </button>
        </p>
      </div>
    </div>
  );
}

export default App;
