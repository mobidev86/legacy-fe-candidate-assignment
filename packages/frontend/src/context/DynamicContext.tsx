import React, { createContext, useContext, useState } from 'react';

// Create a mock context that mimics the structure of Dynamic.xyz's context
interface MockDynamicContextType {
  user: null | { walletPublicKey?: string };
  primaryWallet: null | { signMessage?: (args: { message: string }) => Promise<string> };
  handleLogOut: () => void;
  showAuthFlow: () => void;
  isAuthenticated: boolean;
}

const defaultContext: MockDynamicContextType = {
  user: null,
  primaryWallet: null,
  handleLogOut: () => console.log('Mock logout called'),
  showAuthFlow: () => console.log('Mock auth flow called'),
  isAuthenticated: false
};

// Create the context
const MockDynamicContext = createContext<MockDynamicContextType>(defaultContext);

// Create a provider component
export const MockDynamicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<null | { walletPublicKey?: string }>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Mock implementation of showAuthFlow
  const showAuthFlow = () => {
    // Simulate a login with a mock wallet
    setUser({ walletPublicKey: '0xMockAddress123456789' });
    setIsAuthenticated(true);
    console.log('Mock auth flow triggered - user authenticated');
  };

  // Mock implementation of handleLogOut
  const handleLogOut = () => {
    setUser(null);
    setIsAuthenticated(false);
    console.log('Mock logout triggered - user logged out');
  };

  // Mock wallet with signMessage capability
  const primaryWallet = user ? {
    signMessage: async ({ message }: { message: string }) => {
      console.log('Mock signing message:', message);
      // Return a mock signature
      return `0xMockSignature_${Date.now()}_${message.replace(/\s+/g, '_')}`;
    }
  } : null;

  const value = {
    user,
    primaryWallet,
    handleLogOut,
    showAuthFlow,
    isAuthenticated
  };

  return (
    <MockDynamicContext.Provider value={value}>
      {children}
    </MockDynamicContext.Provider>
  );
};

// Create a hook to use the mock context
export const useMockDynamicContext = () => useContext(MockDynamicContext);

// Export a unified hook that will work regardless of which context is available
export const useSafeDynamicContext = () => {
  try {
    // Try to import the real Dynamic context
    const { useDynamicContext } = require('@dynamic-labs/sdk-react-core');
    
    // Check if we're inside a real Dynamic provider
    try {
      const context = useDynamicContext();
      // If we get here without error, return the real context
      return context;
    } catch (error) {
      // If using the real hook fails, fall back to our mock
      console.warn('Falling back to mock Dynamic context');
      return useMockDynamicContext();
    }
  } catch (error) {
    // If importing the real hook fails, fall back to our mock
    console.warn('Dynamic SDK not available, using mock context');
    return useMockDynamicContext();
  }
};
