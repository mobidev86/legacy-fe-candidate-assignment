import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { MockDynamicProvider } from './context/DynamicContext';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MessageSignerPage from './pages/MessageSignerPage';
import ErrorBoundary from './components/ErrorBoundary';

// Create a fallback context that uses our mock provider
const FallbackContext = ({ children }: { children: React.ReactNode }) => {
  return (
    <MockDynamicProvider>
      {children}
    </MockDynamicProvider>
  );
};

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);
  const [useFallback, setUseFallback] = useState(false);
  
  // Add a small delay to ensure proper initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // Check if window.dynamic is defined (this is added by the Dynamic.xyz SDK)
        if (typeof window !== 'undefined' && !(window as any).dynamic) {
          console.warn('Dynamic.xyz SDK not detected, using fallback mode');
          setUseFallback(true);
        }
        setIsLoading(false);
      } catch (error) {
        console.error('Error during initialization:', error);
        setInitError(error instanceof Error ? error.message : 'Failed to initialize application');
        setUseFallback(true);
        setIsLoading(false);
      }
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  if (initError) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md text-center">
          <h2 className="text-xl font-bold text-red-700 mb-2">Initialization Error</h2>
          <p className="text-red-600 mb-4">{initError}</p>
          <p className="text-gray-600 mb-4">Please check your configuration and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Reload Application
          </button>
        </div>
      </div>
    );
  }
  
  // Create a wrapper component to handle potential Dynamic.xyz initialization errors
  const DynamicWrapper = ({ children }: { children: React.ReactNode }) => {
    if (useFallback) {
      return <FallbackContext>{children}</FallbackContext>;
    }
    
    try {
      return (
        <DynamicContextProvider
          settings={{
            environmentId: "04bf994f-d77d-4356-aeab-f6f0c2a1e2c1"
          }}
        >
          {children}
        </DynamicContextProvider>
      );
    } catch (error) {
      console.error('Error rendering DynamicContextProvider:', error);
      return <FallbackContext>{children}</FallbackContext>;
    }
  };
  
  return (
    <ErrorBoundary>
      <DynamicWrapper>
        <div className={useFallback ? "bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4" : "hidden"}>
          <p className="text-yellow-700">
            <strong>Notice:</strong> Running in fallback mode with mock wallet functionality.
            {useFallback && <button 
              onClick={() => window.location.reload()} 
              className="ml-4 px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300 text-sm"
            >
              Try Again
            </button>}
          </p>
        </div>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={
              <ErrorBoundary>
                <HomePage />
              </ErrorBoundary>
            } />
            <Route path="/sign-message" element={
              <ErrorBoundary>
                <MessageSignerPage />
              </ErrorBoundary>
            } />
          </Route>
        </Routes>
      </DynamicWrapper>
    </ErrorBoundary>
  );
}

export default App;
