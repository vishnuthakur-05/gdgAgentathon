
import React, { useState, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider } from './components/ThemeContext';
import { Navbar } from './components/Navbar';
import { HistorySidebar } from './components/HistorySidebar';
import { Landing } from './components/Landing';
import { DiscoveryView } from './components/DiscoveryView';
import { InputForm } from './components/InputForm';
import { AnalysisView } from './components/AnalysisView';
import { Report } from './components/Report';
import { Toast } from './components/Toast';
import { Login } from './components/Auth/Login';
import { Register } from './components/Auth/Register';
import { FeaturesView } from './components/FeaturesView';
import { ProfileView } from './components/ProfileView';
import { generateCompetitorAnalysis } from './geminiService';
import { SAMPLE_BUSINESS, SAMPLE_REPORT } from './sampleData';
import { BusinessInfo, AnalysisReport, AppState, HistoryItem, User } from './types';
import { auth, db } from './src/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { collection, query, where, getDocs, doc, setDoc, orderBy, onSnapshot } from 'firebase/firestore';

const App = () => {
  const [state, setState] = useState<AppState>('landing');
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);
  const [isAnimationFinished, setIsAnimationFinished] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error'; isVisible: boolean }>({
    message: '',
    type: 'success',
    isVisible: false
  });
  const [preFilledData, setPreFilledData] = useState<Partial<BusinessInfo> | undefined>(undefined);

  // Auth State
  const [user, setUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loginRedirect, setLoginRedirect] = useState<AppState | null>(null);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  // Listen to Auth Changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      setFirebaseUser(authUser);
      if (authUser) {
        setUser({
          name: authUser.displayName || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || ''
        });
      } else {
        setUser(null);
        setHistory([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // Real-time History Listener
  useEffect(() => {
    if (!firebaseUser) {
      setHistory([]);
      return;
    }

    setIsLoadingHistory(true);
    const q = query(
      collection(db, "analysis_history"),
      where("userId", "==", firebaseUser.uid), // Updated to userId
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const items: HistoryItem[] = [];
      snapshot.forEach((doc) => {
        items.push(doc.data() as HistoryItem);
      });
      setHistory(items);
      setIsLoadingHistory(false);
    }, (error) => {
      console.error("Error fetching history:", error);
      setIsLoadingHistory(false);
    });

    return () => unsubscribe();
  }, [firebaseUser]);

  const addToHistory = async (report: AnalysisReport, info: BusinessInfo) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      businessName: info.name,
      niche: info.niche,
      report,
      businessInfo: info,
      userId: firebaseUser ? firebaseUser.uid : undefined
    };

    // Optimistic UI Update
    const updated = [newItem, ...history];
    setHistory(updated);

    // Save to Firestore if logged in
    if (firebaseUser) {
      try {
        await setDoc(doc(db, "analysis_history", newItem.id), {
          ...newItem,
          userId: firebaseUser.uid // Updated to userId
        });
      } catch (e) {
        console.error("Error saving history:", e);
      }
    }
  };

  const handleHistorySelect = (item: HistoryItem) => {
    setBusinessInfo(item.businessInfo);
    setReport(item.report);
    setState('report');
    setShowHistory(false);
  };

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type, isVisible: true });
  };

  const handleStart = () => {
    if (!user) {
      setLoginRedirect('discovery');
      setState('login');
    } else {
      setState('discovery');
    }
  };

  const handleDiscoverySelect = (info: BusinessInfo) => {
    setBusinessInfo(info); // Pre-fill state if needed, though mostly for passing to InputForm
    // We actually just want to go to input with this data pre-filled
    // But since `businessInfo` state is usually for the *result*, 
    // we can use a temporary state or just pass it directly if we refactor `App` to hold form state.
    // Simpler: Just set a local state in App to pass to InputForm
    setPreFilledData(info);
    setState('input');
  };

  const handleManualEntry = () => {
    setPreFilledData(undefined);
    setState('input');
  };

  const handleBack = () => {
    if (state === 'input') {
      setState('discovery');
    } else if (state === 'discovery') {
      setState('landing');
    } else if (state === 'profile') {
      setState('landing');
    } else {
      setState('landing');
    }
  };

  const handleInputSubmit = async (info: BusinessInfo) => {
    setBusinessInfo(info);
    setIsAnimationFinished(false);
    setReport(null);
    setState('analyzing');

    try {
      // Async safety: Data must be fully awaited and passed through Aggregation Gate
      const result = await generateCompetitorAnalysis(info);

      // Data Validation Constraint: Ensure core arrays are populated
      if (!result.competitors || result.competitors.length === 0) throw new Error("Sync Error: Competitor data missing");
      if (!result.swot) throw new Error("Sync Error: SWOT data missing");

      // Async safety: Data must be fully awaited and passed through Aggregation Gate
      setReport(result);
      // Wait for auth state to be settled if possible, but user check handles it
      addToHistory(result, info);
    } catch (error) {
      console.error("AI Synchronization Error:", error);
      console.warn("Switching to offline fallback mode (Mock Data active)");

      // Fallback Strategy: Prevent crash by using sample data
      setReport(SAMPLE_REPORT);
      addToHistory(SAMPLE_REPORT, info);

      showToast("Live analysis failed. Displaying sample data.", "error");
    }
  };

  // State Contract: Only transition when BOTH data is READY and UI animation is complete
  useEffect(() => {
    if (state === 'analyzing' && isAnimationFinished && report?.status === 'READY') {
      setState('report');
    }
  }, [isAnimationFinished, report, state]);

  const handleAnalysisComplete = () => {
    setIsAnimationFinished(true);
  };

  const handleReset = () => {
    setState('landing');
    setBusinessInfo(null);
    setReport(null);
    setIsAnimationFinished(false);
  };

  const handleRetry = () => {
    if (businessInfo) {
      handleInputSubmit(businessInfo);
    } else {
      handleReset();
    }
  };

  const handleViewSample = () => {
    setBusinessInfo(SAMPLE_BUSINESS);
    setReport(SAMPLE_REPORT);
    setState('report');
  };

  const handleAuthSuccess = (user: User) => {
    // Auth state listener handles setUser
    setToast({ message: `Welcome back, ${user.name}`, type: 'success', isVisible: true });

    if (loginRedirect) {
      setState(loginRedirect);
      setLoginRedirect(null);
    } else {
      setState('landing');
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Listener handles state clearing
      setToast({ message: "Logged out successfully", type: 'success', isVisible: true });
      setState('landing');
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <ThemeProvider>
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors duration-300 selection:bg-indigo-100 dark:selection:bg-indigo-900">
        <Navbar
          onReset={handleReset}
          onAnalyze={() => setState('discovery')}
          onToggleHistory={() => setShowHistory(true)}
          onLogin={() => setState('login')}
          onLogout={handleLogout}
          onRegister={() => setState('register')}
          onFeatures={() => setState('features')}
          onProfile={() => setState('profile')}
          user={user}
          appState={state}
        />

        <HistorySidebar
          isOpen={showHistory}
          onClose={() => setShowHistory(false)}
          history={history}
          onSelect={handleHistorySelect}
          isLoading={isLoadingHistory}
        />

        <main className="relative">
          <Toast
            {...toast}
            onClose={() => setToast(prev => ({ ...prev, isVisible: false }))}
          />

          {state === 'landing' && <Landing onStart={handleStart} onViewSample={handleViewSample} user={user} />}
          {state === 'features' && <FeaturesView onBack={() => setState('landing')} />}
          {state === 'profile' && user && (
            <ProfileView
              user={user}
              history={history}
              onBack={() => setState('landing')}
              onLogout={handleLogout}
              onSelectHistory={handleHistorySelect}
            />
          )}

          {state === 'login' && (
            <Login
              onRegister={() => setState('register')}
              onLoginSuccess={handleAuthSuccess}
              onBack={() => setState('landing')}
            />
          )}

          {state === 'register' && (
            <Register
              onLogin={() => setState('login')}
              onRegisterSuccess={handleAuthSuccess}
              onBack={() => setState('landing')}
            />
          )}

          {state === 'discovery' && (
            <DiscoveryView
              onSelect={handleDiscoverySelect}
              onSkip={handleManualEntry}
              onBack={handleBack}
            />
          )}

          {state === 'input' && <InputForm onSubmit={handleInputSubmit} initialData={preFilledData} onBack={handleBack} />}

          {state === 'analyzing' && (
            <div className="flex flex-col items-center">
              <AnalysisView onComplete={handleAnalysisComplete} />
              {/* Fallback for long-running AI tasks */}
              {isAnimationFinished && !report && (
                <div className="mt-8 text-slate-500 flex flex-col items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Finalizing data aggregation...</span>
                  </div>
                  <button
                    onClick={handleRetry}
                    className="text-indigo-600 text-sm font-semibold hover:underline"
                  >
                    Stuck? Click to Retry
                  </button>
                </div>
              )}
            </div>
          )}

          {state === 'report' && report && businessInfo && (
            <Report
              report={report}
              businessInfo={businessInfo}
              onReset={handleReset}
            />
          )}
        </main>

        <footer className="py-12 px-4 border-t border-slate-200 dark:border-slate-800 text-center no-print">
          <p className="text-slate-500 dark:text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} Competitor AI. Secure & Consistent Market Intelligence.
          </p>
        </footer>
      </div>
    </ThemeProvider>
  );
};

const container = document.getElementById('root');
if (container) {
  const root = createRoot(container);
  root.render(<App />);
}
