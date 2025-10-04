import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { useDynamicContext as useRealDynamicContext } from '@dynamic-labs/sdk-react-core';

// Enhanced interface for our Dynamic context
interface EnhancedDynamicContextType {
  user: null | { walletPublicKey?: string; email?: string };
  primaryWallet: null | { 
    address?: string;
    chainId?: number;
    connector?: string;
    signMessage?: (args: { message: string }) => Promise<string>;
  };
  handleLogOut: () => void;
  showAuthFlow: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  messageHistory: SignedMessageType[];
  addMessageToHistory: (message: SignedMessageType) => void;
}

// Define the signed message type
export interface SignedMessageType {
  id: string;
  message: string;
  signature: string;
  timestamp: number;
  verified?: boolean;
  signer?: string;
}

const defaultContext: EnhancedDynamicContextType = {
  user: null,
  primaryWallet: null,
  handleLogOut: () => console.log('Mock logout called'),
  showAuthFlow: () => console.log('Mock auth flow called'),
  isAuthenticated: false,
  isLoading: false,
  messageHistory: [],
  addMessageToHistory: () => {}
};

// Create the context
const MockDynamicContext = createContext<EnhancedDynamicContextType>(defaultContext);

// Create a provider component with enhanced functionality
export const MockDynamicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<null | { walletPublicKey?: string; email?: string }>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [messageHistory, setMessageHistory] = useState<SignedMessageType[]>([]);

  // Load message history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('messageHistory');
    if (savedHistory) {
      try {
        setMessageHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to parse message history:', error);
      }
    }
  }, []);

  // Save message history to localStorage whenever it changes
  useEffect(() => {
    if (messageHistory.length > 0) {
      localStorage.setItem('messageHistory', JSON.stringify(messageHistory));
    }
  }, [messageHistory]);

  // Add a message to history
  const addMessageToHistory = useCallback((newMessage: SignedMessageType) => {
    setMessageHistory(prev => [newMessage, ...prev]);
  }, []);

  // Enhanced mock implementation of showAuthFlow with email-based authentication
  const showAuthFlow = useCallback(() => {
    setIsLoading(true);
    
    // Simulate a login delay
    setTimeout(() => {
      // Simulate a login with a mock wallet
      setUser({ 
        walletPublicKey: '0xMockAddress123456789',
        email: 'user@example.com'
      });
      setIsAuthenticated(true);
      setIsLoading(false);
      console.log('Mock auth flow triggered - user authenticated with email');
    }, 1000);
  }, []);

  // Mock implementation of handleLogOut
  const handleLogOut = useCallback(() => {
    setIsLoading(true);
    
    // Simulate logout delay
    setTimeout(() => {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      console.log('Mock logout triggered - user logged out');
    }, 500);
  }, []);

  // Enhanced mock wallet with signMessage capability
  const primaryWallet = useMemo(() => user ? {
    address: user.walletPublicKey,
    chainId: 1, // Ethereum Mainnet
    connector: 'mock',
    signMessage: async ({ message }: { message: string }) => {
      console.log('Mock signing message:', message);
      
      // Simulate signing delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Return a mock signature that's more realistic
      return `0x${''.padStart(130, '0123456789abcdef')}`;
    }
  } : null, [user]);

  const value = useMemo(() => ({
    user,
    primaryWallet,
    handleLogOut,
    showAuthFlow,
    isAuthenticated,
    isLoading,
    messageHistory,
    addMessageToHistory
  }), [user, primaryWallet, handleLogOut, showAuthFlow, isAuthenticated, isLoading, messageHistory, addMessageToHistory]);

  return (
    <MockDynamicContext.Provider value={value}>
      {children}
    </MockDynamicContext.Provider>
  );
};

// Create a hook to use the mock context
export const useMockDynamicContext = () => useContext(MockDynamicContext);

// Centralized fallback authentication function
const createFallbackAuthFlow = (context?: any) => () => {
  console.log('Fallback showAuthFlow called');
  
  // Try setShowAuthFlow first (newer SDK versions)
  if (context && typeof context.setShowAuthFlow === 'function') {
    console.log('Using setShowAuthFlow from context');
    try {
      context.setShowAuthFlow(true);
      return;
    } catch (error) {
      console.error('setShowAuthFlow failed:', error);
    }
  }
  
  // Check if we can access the authentication flow through other means
  if (context && typeof context.openWallet === 'function') {
    console.log('Using openWallet as fallback');
    context.openWallet();
    return;
  }
  
  // Try to access the authentication modal through the window.dynamic object
  if (window && (window as any).dynamic) {
    if (typeof (window as any).dynamic.open === 'function') {
      console.log('Using window.dynamic.open as fallback');
      (window as any).dynamic.open();
      return;
    }
    if ((window as any).dynamic.auth && typeof (window as any).dynamic.auth.openAuth === 'function') {
      console.log('Using window.dynamic.auth.openAuth as fallback');
      (window as any).dynamic.auth.openAuth();
      return;
    }
  }
  
  // If all else fails, show an alert
  alert('Authentication flow is not available. Please try again later.');
};

// Helper to manage message history in localStorage
const messageHistoryManager = {
  get: (): SignedMessageType[] => {
    try {
      const savedHistory = localStorage.getItem('messageHistory');
      return savedHistory ? JSON.parse(savedHistory) : [];
    } catch (error) {
      console.error('Failed to parse message history:', error);
      return [];
    }
  },
  add: (newMessage: SignedMessageType): SignedMessageType[] => {
    try {
      const currentHistory = messageHistoryManager.get();
      const updatedHistory = [newMessage, ...currentHistory];
      localStorage.setItem('messageHistory', JSON.stringify(updatedHistory));
      return updatedHistory;
    } catch (error) {
      console.error('Failed to add message to history:', error);
      return [];
    }
  }
};

// Export a unified hook that will work regardless of which context is available
export const useSafeDynamicContext = () => {
  try {
    console.log('Attempting to use real Dynamic.xyz context...');
    const context = useRealDynamicContext();
    
    // Check if context is actually populated
    const contextAny = context as any;
    
    // Debug logging (can be removed in production)
    if (process.env.NODE_ENV === 'development') {
      console.log('Dynamic SDK loaded, user authenticated:', !!context.user);
      console.log('Primary wallet address:', context.primaryWallet?.address);
    }
    
    // Determine the best authentication method to use
    let authFlowFunction;
    
    if (typeof context.setShowAuthFlow === 'function') {
      console.log('Using setShowAuthFlow from context');
      authFlowFunction = () => {
        try {
          context.setShowAuthFlow(true);
        } catch (error) {
          console.error('setShowAuthFlow error:', error);
          createFallbackAuthFlow(context)();
        }
      };
    } else if (typeof context.showAuthFlow === 'function') {
      console.log('Using showAuthFlow from context');
      authFlowFunction = context.showAuthFlow;
    } else {
      console.log('No direct auth method found, using fallback');
      authFlowFunction = createFallbackAuthFlow(context);
    }
    
    // Get the primary wallet - try multiple sources
    let primaryWallet = context.primaryWallet;
    
    // If primaryWallet is not available, try to get it from wallets array
    if (!primaryWallet && contextAny.wallets && contextAny.wallets.length > 0) {
      console.log('Using first wallet from wallets array');
      primaryWallet = contextAny.wallets[0];
    }
    
    // Wallet successfully retrieved
    
    // If we get here without error, return an enhanced version of the real context
    const enhancedContext = {
      ...context,
      primaryWallet,
      messageHistory: messageHistoryManager.get(),
      addMessageToHistory: messageHistoryManager.add,
      showAuthFlow: authFlowFunction
    };
    
    return enhancedContext;
  } catch (error) {
    // If using the real hook fails, fall back to our mock
    console.warn('Falling back to mock Dynamic context:', error);
    return useMockDynamicContext();
  }
};
