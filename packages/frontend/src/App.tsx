import { DynamicContextProvider } from '@dynamic-labs/sdk-react-core';
import { EthereumWalletConnectors } from '@dynamic-labs/ethereum';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MessageSignerPage from './pages/MessageSignerPage';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  
  // Add a small delay to ensure proper initialization
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }
  
  return (
    <ErrorBoundary>
      <DynamicContextProvider
        settings={{
          environmentId: import.meta.env.VITE_DYNAMIC_ENVIRONMENT_ID || '04bf994f-d77d-4356-aeab-f6f0c2a1e2c1',
          walletConnectors: [EthereumWalletConnectors],
          evmNetworks: [
            {
              chainId: 1, // Ethereum Mainnet
              name: 'Ethereum',
              displayName: 'Ethereum',
            },
          ],
          // Additional settings to improve stability
          displayTermsOfService: false,
          storageKey: 'web3-message-signer-auth'
        }}
      >
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
      </DynamicContextProvider>
    </ErrorBoundary>
  );
}

export default App;
