import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { MockDynamicProvider } from './context/DynamicContext';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect, useMemo } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MessageSignerPage from './pages/MessageSignerPage';
import ErrorBoundary from './components/ErrorBoundary';
import LoadingSpinner from './components/LoadingSpinner';
import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";

// No need for a separate FallbackContext component anymore

function App() {
  // Create a single source of truth for the app state
  const [appState, setAppState] = useState({
    isLoading: true,
    initError: null as string | null,
    useFallback: false,
    sdkReady: false
  });
  
  // Add a small delay to ensure proper initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        // SDK components are always available, just mark as ready
        setAppState(prev => ({ ...prev, isLoading: false, sdkReady: true }));
      } catch (error) {
        setAppState(prev => ({
          ...prev,
          isLoading: false,
          useFallback: true,
          initError: error instanceof Error ? error.message : 'Failed to initialize application'
        }));
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Memoize settings to prevent unnecessary re-renders (must be before any returns)
  const dynamicSettings = useMemo(() => {
    const environmentId = import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID;
    
    if (!environmentId) {
      throw new Error('VITE_DYNAMIC_ENVIRONMENT_ID is not set in environment variables');
    }
    
    return {
      environmentId,
      walletConnectors: [EthereumWalletConnectors],
      // Enable embedded wallets for email authentication
      eventsCallbacks: {
        onAuthSuccess: () => {
          // Auth success
        },
        onLogout: () => {
          // User logged out
        }
      }
    };
  }, []);
  
  // Extract state variables for readability
  const { isLoading, initError, useFallback } = appState;
  
  // Show loading screen while initializing
  if (isLoading) {
    return <LoadingSpinner size="md" fullScreen={true} message="Initializing application..." />;
  }
  
  // Show error screen if initialization failed
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
  
  // Separate component for routes to ensure they're rendered within the correct provider
  const AppRoutes = ({ showFallbackNotice }: { showFallbackNotice: boolean }) => (
    <>
      {showFallbackNotice && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
          <p className="text-yellow-700">
            <strong>Notice:</strong> Running in fallback mode with mock wallet functionality.
            <button 
              onClick={() => window.location.reload()} 
              className="ml-4 px-2 py-1 bg-yellow-200 rounded hover:bg-yellow-300 text-sm"
            >
              Try Again
            </button>
          </p>
        </div>
      )}
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
    </>
  );
  
  // Determine which provider to use
  if (useFallback) {
    return (
      <ErrorBoundary>
        <MockDynamicProvider>
          <AppRoutes showFallbackNotice={true} />
        </MockDynamicProvider>
      </ErrorBoundary>
    );
  }
  
  // If SDK is ready, use the real provider
  return (
    <ErrorBoundary>
      <DynamicContextProvider settings={dynamicSettings}>
        <AppRoutes showFallbackNotice={false} />
      </DynamicContextProvider>
    </ErrorBoundary>
  );
}

export default App;
